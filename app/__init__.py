from flask import Flask, session
from flask_mail import Mail
from config import config
from flask_login import LoginManager
from flask_wtf.csrf import CSRFProtect
import os

# Initialize extensions
mail = Mail()
login_manager = LoginManager()
csrf = CSRFProtect()

def create_app(config_name=None):
    app = Flask(__name__)
    
    # Load configuration
    config_name = config_name or os.environ.get('FLASK_CONFIG', 'default')
    app.config.from_object(config[config_name])

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

    # Make hCaptcha available in templates
    from app.utils.hcaptcha_utils import hcaptcha, is_hcaptcha_enabled
    app.jinja_env.globals.update(hcaptcha=hcaptcha, hcaptcha_enabled=is_hcaptcha_enabled)
    
    return app
