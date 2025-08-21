"""
Shared utilities for admin routes.
"""

from flask import current_app, flash, redirect, url_for
from flask_login import current_user
from functools import wraps


def admin_required(f):
    """Decorator to require admin authentication."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Check if database is disabled
        if current_app.config.get('DISABLE_DATABASE', False):
            flash('Admin panel is not available in this deployment environment.', 'warning')
            return redirect(url_for('main.home'))
        
        # Check if user is logged in and is admin
        if not current_user.is_authenticated or not current_user.is_admin:
            flash('Access denied. Admin privileges required.', 'error')
            return redirect(url_for('main.home'))
        
        return f(*args, **kwargs)
    return decorated_function
