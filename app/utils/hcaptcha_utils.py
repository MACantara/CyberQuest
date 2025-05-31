from flask import current_app
from flask_hcaptcha import hCaptcha

# Initialize hCaptcha instance
hcaptcha = hCaptcha()

def init_hcaptcha(app):
    """Initialize hCaptcha with the Flask app."""
    hcaptcha.init_app(app)

def verify_hcaptcha():
    """Verify hCaptcha response."""
    if not current_app.config.get('HCAPTCHA_ENABLED', True):
        # If hCaptcha is disabled (e.g., in testing), always return True
        return True
    
    return hcaptcha.verify()

def get_hcaptcha_html(dark_theme=False):
    """Get hCaptcha HTML code."""
    if not current_app.config.get('HCAPTCHA_ENABLED', True):
        return ''
    
    return hcaptcha.get_code(dark_theme=dark_theme)

def is_hcaptcha_enabled():
    """Check if hCaptcha is enabled."""
    return current_app.config.get('HCAPTCHA_ENABLED', True)
