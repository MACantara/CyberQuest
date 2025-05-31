from flask import current_app
from .main import main_bp
from .auth import auth_bp
from .contact import contact_bp
from .password_reset import password_reset_bp
from .login_attempts import login_attempts_bp
from .email_verification import email_verification_bp
from .profile import profile_bp
from .admin import admin_bp
from .logs import logs_bp

def register_blueprints(app):
    """Register all blueprints with the Flask app."""
    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(contact_bp)
    app.register_blueprint(password_reset_bp)
    app.register_blueprint(login_attempts_bp)
    app.register_blueprint(email_verification_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(logs_bp)
