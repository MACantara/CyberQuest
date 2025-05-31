from flask import Blueprint, render_template, request, redirect, url_for, flash, session, current_app
from app import db
from app.models.user import User
import re

profile_bp = Blueprint('profile', __name__, url_prefix='/profile')

def is_valid_username(username):
    """Validate username format."""
    # Username must be 3-30 characters, alphanumeric and underscores only
    pattern = r'^[a-zA-Z0-9_]{3,30}$'
    return re.match(pattern, username) is not None

@profile_bp.route('/')
def profile():
    """User profile page."""
    if 'user_id' not in session:
        flash('Please log in to access your profile.', 'warning')
        return redirect(url_for('auth.login'))
    
    if current_app.config.get('DISABLE_DATABASE', False):
        flash('User profiles are not available in this deployment environment.', 'warning')
        return redirect(url_for('main.home'))
    
    user = User.query.get(session['user_id'])
    if not user:
        session.clear()
        flash('User not found. Please log in again.', 'error')
        return redirect(url_for('auth.login'))
    
    return render_template('profile/profile.html', user=user)

@profile_bp.route('/edit', methods=['GET', 'POST'])
def edit_profile():
    """Edit user profile page."""
    if 'user_id' not in session:
        flash('Please log in to access this page.', 'error')
        return redirect(url_for('auth.login'))
    
    if current_app.config.get('DISABLE_DATABASE', False):
        flash('Profile editing is not available in this deployment environment.', 'warning')
        return redirect(url_for('main.home'))
    
    user = User.query.get(session['user_id'])
    if not user:
        flash('User not found.', 'error')
        return redirect(url_for('auth.login'))
    
    if request.method == 'POST':
        username = request.form.get('username', '').strip().lower()
        email = request.form.get('email', '').strip().lower()
        current_password = request.form.get('current_password', '').strip()
        new_password = request.form.get('new_password', '').strip()
        confirm_password = request.form.get('confirm_password', '').strip()
        
        # Validate current password for any changes
        if not user.check_password(current_password):
            flash('Current password is incorrect.', 'error')
            return render_template('profile/edit-profile.html', user=user)
        
        # Validate username
        if not username or len(username) < 3 or len(username) > 30 or not is_valid_username(username):
            flash('Username must be between 3 and 30 characters.', 'error')
            return render_template('profile/edit-profile.html', user=user)
        
        # Check if username is taken by another user
        if username != user.username:
            existing_user = User.query.filter_by(username=username).first()
            if existing_user:
                flash('Username is already taken.', 'error')
                return render_template('profile/edit-profile.html', user=user)
        
        # Validate email
        if not email or '@' not in email:
            flash('Please enter a valid email address.', 'error')
            return render_template('profile/edit-profile.html', user=user)
        
        # Check if email is taken by another user
        if email != user.email:
            existing_user = User.query.filter_by(email=email).first()
            if existing_user:
                flash('Email address is already registered.', 'error')
                return render_template('profile/edit-profile.html', user=user)
        
        # Validate new password if provided
        if new_password:
            if len(new_password) < 8:
                flash('Password must be at least 8 characters long.', 'error')
                return render_template('profile/edit-profile.html', user=user)
            
            if new_password != confirm_password:
                flash('New passwords do not match.', 'error')
                return render_template('profile/edit-profile.html', user=user)
        
        try:
            # Update user information
            user.username = username
            user.email = email
            
            # Update password if provided
            if new_password:
                user.set_password(new_password)
            
            db.session.commit()
            
            # Update session username if it changed
            session['username'] = username
            
            flash('Profile updated successfully!', 'success')
            return redirect(url_for('profile.profile'))
            
        except Exception as e:
            db.session.rollback()
            flash('An error occurred while updating your profile. Please try again.', 'error')
            return render_template('profile/edit-profile.html', user=user)
    
    return render_template('profile/edit-profile.html', user=user)
