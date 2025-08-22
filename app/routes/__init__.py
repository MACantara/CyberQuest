from flask import current_app
from .main import main_bp
from .auth import auth_bp
from .contact import contact_bp
from .password_reset import password_reset_bp
from .login_attempts import login_attempts_bp
from .email_verification import email_verification_bp
from .profile import profile_bp
from .admin import admin_bp, data_analytics_bp, system_backup_bp, admin_logs_bp
from .levels import levels_bp
from .api import api_bp
from .news_api import news_api_bp
from .adaptive_learning import adaptive_bp
from .blue_team_vs_red_team_mode import blue_team_vs_red_team as blue_red_bp

def register_blueprints(app):
    """Register all blueprints with the Flask app."""
    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(contact_bp)
    app.register_blueprint(password_reset_bp)
    app.register_blueprint(login_attempts_bp)
    app.register_blueprint(email_verification_bp)
    app.register_blueprint(profile_bp)
    
    # Register admin module blueprints
    app.register_blueprint(admin_bp)
    app.register_blueprint(data_analytics_bp)
    app.register_blueprint(system_backup_bp)
    app.register_blueprint(admin_logs_bp)
    
    app.register_blueprint(levels_bp)
    app.register_blueprint(api_bp)
    app.register_blueprint(news_api_bp)
    app.register_blueprint(adaptive_bp)
    app.register_blueprint(blue_red_bp)