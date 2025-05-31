from flask import Blueprint, request, current_app
from app.models.login_attempt import LoginAttempt

login_attempts_bp = Blueprint('login_attempts', __name__)

def get_client_ip():
    """Get the real client IP address, considering proxies."""
    # Check for forwarded IP first (common in production with reverse proxies)
    if request.headers.get('X-Forwarded-For'):
        return request.headers.get('X-Forwarded-For').split(',')[0].strip()
    elif request.headers.get('X-Real-IP'):
        return request.headers.get('X-Real-IP')
    else:
        return request.remote_addr

def check_ip_lockout():
    """Check if current IP is locked out and return lockout info."""
    client_ip = get_client_ip()
    
    if LoginAttempt.is_ip_locked(client_ip):
        remaining_time = LoginAttempt.get_lockout_time_remaining(client_ip)
        if remaining_time:
            minutes = int(remaining_time.total_seconds() / 60) + 1
            return True, minutes
    
    return False, 0

def record_login_attempt(username_or_email, success=False):
    """Record a login attempt with IP and user agent information."""
    client_ip = get_client_ip()
    user_agent = request.headers.get('User-Agent')
    
    return LoginAttempt.record_attempt(
        ip_address=client_ip,
        username_or_email=username_or_email,
        success=success,
        user_agent=user_agent
    )

def get_remaining_attempts():
    """Get the number of remaining login attempts for current IP."""
    client_ip = get_client_ip()
    failed_count = LoginAttempt.get_failed_attempts_count(client_ip)
    max_attempts = current_app.config.get('MAX_LOGIN_ATTEMPTS', 5)
    return max(0, max_attempts - failed_count)

def is_lockout_triggered():
    """Check if the current IP should be locked out after this attempt."""
    client_ip = get_client_ip()
    failed_count = LoginAttempt.get_failed_attempts_count(client_ip)
    max_attempts = current_app.config.get('MAX_LOGIN_ATTEMPTS', 5)
    return failed_count >= max_attempts
