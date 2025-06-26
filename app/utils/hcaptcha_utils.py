from flask import current_app
from flask_hcaptcha import hCaptcha

# Initialize hCaptcha instance
hcaptcha = hCaptcha()

def init_hcaptcha(app):
    """Initialize hCaptcha with the Flask app."""
    hcaptcha.init_app(app)

def verify_hcaptcha():
    """Verify hCaptcha response."""
    # Check if hCaptcha is enabled via feature flag
    if not is_hcaptcha_enabled():
        # If hCaptcha is disabled, always return True
        return True
    
    return hcaptcha.verify()

def get_hcaptcha_html(dark_theme=False):
    """Get hCaptcha HTML code."""
    if not is_hcaptcha_enabled():
        return ''
    
    return hcaptcha.get_code(dark_theme=dark_theme)

def is_hcaptcha_enabled():
    """Check if hCaptcha is enabled via feature flag."""
    # Check multiple configuration keys for flexibility
    return (
        current_app.config.get('HCAPTCHA_ENABLED', True) and
        current_app.config.get('FEATURES', {}).get('HCAPTCHA', True) and
        current_app.config.get('HCAPTCHA_SITE_KEY') and
        current_app.config.get('HCAPTCHA_SECRET_KEY')
    )

def get_hcaptcha_status():
    """Get detailed hCaptcha status for debugging."""
    return {
        'enabled': current_app.config.get('HCAPTCHA_ENABLED', True),
        'feature_flag': current_app.config.get('FEATURES', {}).get('HCAPTCHA', True),
        'has_site_key': bool(current_app.config.get('HCAPTCHA_SITE_KEY')),
        'has_secret_key': bool(current_app.config.get('HCAPTCHA_SECRET_KEY')),
        'overall_enabled': is_hcaptcha_enabled()
    }
