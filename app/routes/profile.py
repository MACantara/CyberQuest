from flask import Blueprint, render_template, request, redirect, url_for, flash, current_app
from flask_login import login_required, current_user
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
@login_required
def profile():
    """User profile page."""
    if current_app.config.get('DISABLE_DATABASE', False):
        flash('User profiles are not available in this deployment environment.', 'warning')
        return redirect(url_for('main.home'))
    
    return render_template('profile/profile.html', user=current_user)

@profile_bp.route('/edit', methods=['GET', 'POST'])
@login_required
def edit_profile():
    """Edit user profile page."""
    if current_app.config.get('DISABLE_DATABASE', False):
        flash('Profile editing is not available in this deployment environment.', 'warning')
        return redirect(url_for('main.home'))
    
    if request.method == 'POST':
        username = request.form.get('username', '').strip().lower()
        email = request.form.get('email', '').strip().lower()
        current_password = request.form.get('current_password', '').strip()
        new_password = request.form.get('new_password', '').strip()
        confirm_password = request.form.get('confirm_password', '').strip()
        
        # Validate current password for any changes
        if not current_user.check_password(current_password):
            flash('Current password is incorrect.', 'error')
            return render_template('profile/edit-profile.html', user=current_user)
        
        # Validate username
        if not username or len(username) < 3 or len(username) > 30 or not is_valid_username(username):
            flash('Username must be between 3 and 30 characters.', 'error')
            return render_template('profile/edit-profile.html', user=current_user)
        
        # Check if username is taken by another user
        if username != current_user.username:
            existing_user = User.query.filter_by(username=username).first()
            if existing_user:
                flash('Username is already taken.', 'error')
                return render_template('profile/edit-profile.html', user=current_user)
        
        # Validate email
        if not email or '@' not in email:
            flash('Please enter a valid email address.', 'error')
            return render_template('profile/edit-profile.html', user=current_user)
        
        # Check if email is taken by another user
        if email != current_user.email:
            existing_user = User.query.filter_by(email=email).first()
            if existing_user:
                flash('Email address is already registered.', 'error')
                return render_template('profile/edit-profile.html', user=current_user)
        
        # Validate new password if provided
        if new_password:
            if len(new_password) < 8:
                flash('Password must be at least 8 characters long.', 'error')
                return render_template('profile/edit-profile.html', user=current_user)
            
            if new_password != confirm_password:
                flash('New passwords do not match.', 'error')
                return render_template('profile/edit-profile.html', user=current_user)
        
        try:
            # Update user information
            current_user.username = username
            current_user.email = email
            
            # Update password if provided
            if new_password:
                current_user.set_password(new_password)
            
            db.session.commit()
            
            flash('Profile updated successfully!', 'success')
            return redirect(url_for('profile.profile'))
            
        except Exception as e:
            db.session.rollback()
            flash('An error occurred while updating your profile. Please try again.', 'error')
            return render_template('profile/edit-profile.html', user=current_user)
    
    return render_template('profile/edit-profile.html', user=current_user)

@profile_bp.route('/dashboard')
@login_required
def dashboard():
    """Display user dashboard with cybersecurity level progress."""
    from app.routes.levels import CYBERSECURITY_LEVELS
    
    # Calculate user progress (mock data for now)
    # TODO: Replace with actual user progress from database
    total_levels = len(CYBERSECURITY_LEVELS)
    completed_levels = 0  # Mock: user has completed no levels
    total_xp = 0  # Mock: XP from completed levels
    learning_streak = 0  # Mock: days of consecutive learning
    progress_percentage = (completed_levels / total_levels) * 100
    
    # Determine user rank based on XP
    if total_xp < 100:
        user_rank = "Novice"
    elif total_xp < 500:
        user_rank = "Apprentice"
    elif total_xp < 1000:
        user_rank = "Guardian"
    elif total_xp < 2000:
        user_rank = "Expert"
    else:
        user_rank = "Master"
    
    # Prepare levels with completion status
    levels_progress = []
    for i, level in enumerate(CYBERSECURITY_LEVELS):
        level_data = level.copy()
        level_data['completed'] = i < completed_levels  # Mock: only first level completed
        level_data['unlocked'] = i < completed_levels + 1  # Next level is unlocked
        levels_progress.append(level_data)
    
    # Find next available level
    next_level = None
    for level in levels_progress:
        if level['unlocked'] and not level['completed']:
            next_level = level
            break
    
    return render_template('profile/dashboard.html',
                         total_xp=total_xp,
                         completed_levels=completed_levels,
                         total_levels=total_levels,
                         learning_streak=learning_streak,
                         user_rank=user_rank,
                         progress_percentage=int(progress_percentage),
                         levels=levels_progress,
                         next_level=next_level)
