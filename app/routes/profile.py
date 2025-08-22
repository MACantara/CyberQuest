from flask import Blueprint, render_template, request, redirect, url_for, flash, current_app
from flask_login import login_required, current_user
from app.models.user import User
from app.database import DatabaseError
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
            existing_user = User.find_by_username(username)
            if existing_user:
                flash('Username is already taken.', 'error')
                return render_template('profile/edit-profile.html', user=current_user)
        
        # Validate email
        if not email or '@' not in email:
            flash('Please enter a valid email address.', 'error')
            return render_template('profile/edit-profile.html', user=current_user)
        
        # Check if email is taken by another user
        if email != current_user.email:
            existing_user = User.find_by_email(email)
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
            
            current_user.save()
            
            flash('Profile updated successfully!', 'success')
            return redirect(url_for('profile.profile'))
            
        except DatabaseError as e:
            flash('An error occurred while updating your profile. Please try again.', 'error')
            return render_template('profile/edit-profile.html', user=current_user)
        except Exception as e:
            flash('An error occurred while updating your profile. Please try again.', 'error')
            return render_template('profile/edit-profile.html', user=current_user)
    
    return render_template('profile/edit-profile.html', user=current_user)

@profile_bp.route('/dashboard')
@login_required
def dashboard():
    """Display user dashboard with cybersecurity level progress."""
    if current_app.config.get('DISABLE_DATABASE', False):
        flash('User dashboard is not available in this deployment environment.', 'warning')
        return redirect(url_for('main.home'))
    
    from app.routes.levels import CYBERSECURITY_LEVELS
    from app.models.adaptive_learning import UserProgress, SkillAssessment, LearningRecommendation
    from app.utils.adaptive_learning_engine import AdaptiveLearningEngine, GameificationEngine
    
    # Get comprehensive user progress from adaptive learning system
    progress_summary = UserProgress.get_user_progress_summary(current_user.id)
    skills = SkillAssessment.get_user_skills(current_user.id)
    recommendations = LearningRecommendation.get_user_recommendations(current_user.id)
    
    # Use real data from adaptive learning system
    total_levels = len(CYBERSECURITY_LEVELS)
    completed_levels = progress_summary.get('completed_levels', 0)
    total_xp = progress_summary.get('total_xp', 0)
    learning_streak = progress_summary.get('learning_streak', 0)
    user_rank = progress_summary.get('user_rank', 'Novice')
    progress_percentage = (completed_levels / total_levels) * 100 if total_levels > 0 else 0
    
    # Prepare levels with completion status from database
    levels_progress = []
    for i, level in enumerate(CYBERSECURITY_LEVELS):
        level_data = level.copy()
        
        # Get actual progress from database
        user_progress = UserProgress.get_by_user_and_level(current_user.id, level['id'], 'simulation')
        if user_progress:
            level_data['completed'] = user_progress.status == 'completed'
            level_data['score'] = user_progress.score
            level_data['attempts'] = user_progress.attempts
            level_data['time_spent'] = user_progress.time_spent
            level_data['xp_earned'] = user_progress.xp_earned
        else:
            level_data['completed'] = False
            level_data['score'] = 0
            level_data['attempts'] = 0
            level_data['time_spent'] = 0
            level_data['xp_earned'] = 0
        
        # Determine if level is unlocked (first level or previous level completed)
        level_data['unlocked'] = i == 0 or (i > 0 and levels_progress[i-1]['completed'])
        
        # Get adaptive difficulty recommendation
        if level_data['unlocked'] and not level_data['completed']:
            level_data['recommended_difficulty'] = AdaptiveLearningEngine.calculate_adaptive_difficulty(
                current_user.id, level['id'], 'simulation'
            )
        
        levels_progress.append(level_data)
    
    # Find next available level
    next_level = None
    for level in levels_progress:
        if level['unlocked'] and not level['completed']:
            next_level = level
            break
    
    # Get Blue Team vs Red Team progress
    blue_team_progress = UserProgress.get_by_user_and_level(current_user.id, 1, 'blue_team_vs_red_team')
    blue_team_unlocked = completed_levels >= 1  # Unlock after completing first simulation level
    
    # Prepare skill analysis
    skill_analysis = []
    all_skills = ['critical_thinking', 'source_verification', 'fact_checking', 'phishing_detection', 
                  'email_analysis', 'social_engineering', 'malware_recognition', 'system_security', 
                  'threat_analysis', 'penetration_testing', 'vulnerability_assessment', 'ethical_hacking',
                  'digital_forensics', 'evidence_analysis', 'advanced_investigation']
    
    for skill in all_skills:
        if skill in skills:
            assessment = skills[skill]
            skill_analysis.append({
                'name': skill.replace('_', ' ').title(),
                'proficiency': assessment.proficiency_level,
                'score': assessment.assessment_score,
                'max_score': assessment.max_score
            })
        else:
            skill_analysis.append({
                'name': skill.replace('_', ' ').title(),
                'proficiency': 'not_assessed',
                'score': 0,
                'max_score': 100
            })
    
    # Get gamification data
    leaderboard_position = GameificationEngine.get_leaderboard_position(current_user.id)
    
    # Get learning recommendations
    rec_data = []
    for rec in recommendations[:3]:  # Show top 3 recommendations
        rec_data.append({
            'id': rec.id,
            'title': rec.recommendation_data.get('title', 'New Recommendation'),
            'description': rec.recommendation_data.get('description', ''),
            'type': rec.recommendation_type,
            'confidence': rec.confidence_score
        })
    
    # Get learning analytics
    learning_patterns = AdaptiveLearningEngine.analyze_learning_patterns(current_user.id, 30)
    
    return render_template('profile/dashboard.html',
                         total_xp=total_xp,
                         completed_levels=completed_levels,
                         total_levels=total_levels,
                         learning_streak=learning_streak,
                         user_rank=user_rank,
                         progress_percentage=int(progress_percentage),
                         levels=levels_progress,
                         next_level=next_level,
                         blue_team_progress=blue_team_progress,
                         blue_team_unlocked=blue_team_unlocked,
                         skill_analysis=skill_analysis,
                         leaderboard_position=leaderboard_position,
                         recommendations=rec_data,
                         learning_patterns=learning_patterns)
