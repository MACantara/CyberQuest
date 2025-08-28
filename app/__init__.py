from flask import Flask, session, request, jsonify
from flask_mailman import Mail
from config import config, get_config
from flask_login import LoginManager
from flask_wtf.csrf import CSRFProtect
import os

# Initialize extensions
mail = Mail()
login_manager = LoginManager()
csrf = CSRFProtect()

def create_app(config_name=None):
    app = Flask(__name__)
    
    # Load configuration - use get_config() for automatic environment detection
    if config_name:
        app.config.from_object(config[config_name])
    else:
        app.config.from_object(get_config())

    # Initialize Supabase
    from app.database import init_supabase
    try:
        init_supabase()
        app.logger.info("Supabase client initialized successfully")
    except Exception as e:
        app.logger.error(f"Failed to initialize Supabase: {e}")
        if not app.config.get('DISABLE_DATABASE', False):
            raise  # Re-raise if database is not explicitly disabled
    
    # Initialize Flask-Mail
    mail.init_app(app)

    # Initialize Flask-Login
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'
    login_manager.login_message = 'Please log in to access this page.'
    login_manager.login_message_category = 'info'
    
    @login_manager.user_loader
    def load_user(user_id):
        from app.models.user import User
        try:
            return User.find_by_id(int(user_id))
        except Exception as e:
            app.logger.error(f"Error loading user {user_id}: {e}")
            return None

    # Initialize CSRF protection
    csrf.init_app(app)
    
    # Enhanced CSRF error handling with Vercel debugging
    from flask_wtf.csrf import ValidationError
    
    @app.errorhandler(ValidationError)
    def handle_csrf_validation_error(e):
        app.logger.error(f"CSRF ValidationError: {e}")
        if app.config.get('IS_VERCEL'):
            app.logger.error(f"Vercel CSRF debug info:")
            app.logger.error(f"  - Headers: {dict(request.headers)}")
            app.logger.error(f"  - Form data: {request.form}")
            app.logger.error(f"  - Session: {dict(session)}")
            app.logger.error(f"  - SECRET_KEY set: {bool(app.config.get('SECRET_KEY'))}")
            app.logger.error(f"  - CSRF enabled: {app.config.get('WTF_CSRF_ENABLED')}")
            app.logger.error(f"  - SSL strict: {app.config.get('WTF_CSRF_SSL_STRICT')}")
        
        return jsonify({
            'error': 'CSRF token validation failed',
            'message': 'Security validation failed. Please refresh the page and try again.',
            'debug': str(e) if app.debug else None
        }), 400
    
    @app.errorhandler(400)
    def handle_400_error(e):
        # Check if this is a CSRF-related 400 error
        error_str = str(e).lower()
        if any(term in error_str for term in ['csrf', 'security validation', 'token']):
            app.logger.error(f"400 error (CSRF-related): {e}")
            if app.config.get('IS_VERCEL'):
                app.logger.error(f"Vercel 400 debug - Method: {request.method}, Endpoint: {request.endpoint}")
            
            return jsonify({
                'error': 'Security validation failed',
                'message': 'Please refresh the page and try again.'
            }), 400
        
        # For other 400 errors, return normally
        return str(e), 400

    # Initialize hCaptcha
    from app.utils.hcaptcha_utils import init_hcaptcha
    init_hcaptcha(app)

    # Register blueprints
    from app.routes import register_blueprints
    register_blueprints(app)

    # Create default admin user if it doesn't exist (only if database is not disabled)
    with app.app_context():
        if not app.config.get('DISABLE_DATABASE', False):
            try:
                from app.models.user import User
                from app.models.email_verification import EmailVerification
                from app.database import DatabaseError
                
                # Check if admin user exists
                admin_user = User.find_by_username('admin')
                if not admin_user:
                    admin_user = User.create(
                        username='admin',
                        email='admin@example.com',
                        password='admin123'  # Change this in production!
                    )
                    admin_user.is_admin = True
                    admin_user.save()
                    
                    # Create verified email verification for admin
                    admin_verification = EmailVerification.create_verification(
                        admin_user.id,
                        admin_user.email
                    )
                    admin_verification.verify()
                    
                    app.logger.info("Default admin user created: admin/admin123 (email verified)")
                else:
                    # Ensure existing admin has verified email
                    if not EmailVerification.is_email_verified(admin_user.id, admin_user.email):
                        admin_verification = EmailVerification.create_verification(
                            admin_user.id,
                            admin_user.email
                        )
                        admin_verification.verify()
                        app.logger.info("Admin email verification created and verified")
                    
            except DatabaseError as e:
                app.logger.warning(f"Database initialization failed: {e}")
            except Exception as e:
                app.logger.warning(f"Admin user setup failed: {e}")

        # Add current year and date to template context
        @app.context_processor
        def inject_current_date():
            from datetime import datetime
            current_date = datetime.now()
            
            return {
                'current_year': current_date.year,
                'current_date': current_date,
            }
        
        # Add breadcrumb context processor
        @app.context_processor
        def inject_breadcrumb_context():
            from app.utils.breadcrumb_utils import get_breadcrumb_data
            return {
                'breadcrumb_data': get_breadcrumb_data()
            }

    # Make hCaptcha available in templates
    from app.utils.hcaptcha_utils import hcaptcha, is_hcaptcha_enabled
    app.jinja_env.globals.update(hcaptcha=hcaptcha, hcaptcha_enabled=is_hcaptcha_enabled)
    
    return app
