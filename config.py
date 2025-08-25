import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Base configuration class."""
    # Generate a secure random secret key
    SECRET_KEY = os.urandom(24)
    
    # Check if running on Vercel
    IS_VERCEL = os.environ.get('VERCEL') == '1'
    
    if IS_VERCEL:
        # In Vercel, disable database functionality
        SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'  # In-memory database for compatibility
        SQLALCHEMY_TRACK_MODIFICATIONS = False
        DISABLE_DATABASE = True
    else:
        # Local development with SQLite and supabase
        basedir = os.path.abspath(os.path.dirname(__file__))
        SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
            'sqlite:///' + os.path.join(basedir, 'instance', 'app.db')
        SUPABASE_URL = os.environ.get('SUPABASE_URL')
        SUPABASE_SERVICE_ROLE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
        SQLALCHEMY_TRACK_MODIFICATIONS = False
        DISABLE_DATABASE = False
    
    # Email configuration (required for password reset)
    MAIL_SERVER = os.environ.get('MAIL_SERVER')
    MAIL_PORT = int(os.environ.get('MAIL_PORT') or 587)
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS', 'true').lower() in ['true', 'on', '1']
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    
    # Session configuration
    PERMANENT_SESSION_LIFETIME = timedelta(days=int(os.environ.get('PERMANENT_SESSION_LIFETIME', 30)))
    SESSION_COOKIE_SECURE = False  # Set to True in production with HTTPS
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    
    # Application settings
    POSTS_PER_PAGE = int(os.environ.get('POSTS_PER_PAGE', 10))
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', 'app/static/uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file upload

    # Login security settings
    MAX_LOGIN_ATTEMPTS = int(os.environ.get('MAX_LOGIN_ATTEMPTS', 5))
    LOGIN_LOCKOUT_MINUTES = int(os.environ.get('LOGIN_LOCKOUT_MINUTES', 15))
    
    # Feature flags
    FEATURES = {
        'HCAPTCHA': True,  # Enable/disable hCaptcha globally
        'EMAIL_VERIFICATION': True,  # Enable/disable email verification
        'LOGIN_ATTEMPTS': True,  # Enable/disable login attempt tracking
        'ADMIN_PANEL': True,  # Enable/disable admin panel
    }
    
    # hCaptcha Configuration
    HCAPTCHA_ENABLED = True  # Master switch for hCaptcha
    HCAPTCHA_SITE_KEY = os.environ.get('HCAPTCHA_SITE_KEY', '')
    HCAPTCHA_SECRET_KEY = os.environ.get('HCAPTCHA_SECRET_KEY', '')

class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True
    TESTING = False
    
    # Override feature flags for development
    FEATURES = {
        'HCAPTCHA': False,  # Disable hCaptcha in development
        'EMAIL_VERIFICATION': True,
        'LOGIN_ATTEMPTS': True,
        'ADMIN_PANEL': True,
    }
    
    HCAPTCHA_ENABLED = False  # Disable for easier development

class ProductionConfig(Config):
    """Production configuration."""
    DEBUG = False
    TESTING = False
    
    # Use more secure settings in production
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'

class TestingConfig(Config):
    """Testing configuration."""
    DEBUG = True
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    WTF_CSRF_ENABLED = False
    DISABLE_DATABASE = True
    
    # Override feature flags for testing
    FEATURES = {
        'HCAPTCHA': False,  # Disable hCaptcha in testing
        'EMAIL_VERIFICATION': False,  # Disable email verification in testing
        'LOGIN_ATTEMPTS': False,  # Disable login attempts in testing
        'ADMIN_PANEL': True,
    }
    
    HCAPTCHA_ENABLED = False  # Disable for testing

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
