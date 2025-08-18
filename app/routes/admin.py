from flask import Blueprint, render_template, request, redirect, url_for, flash, current_app, jsonify
from flask_login import login_required, current_user
from app import db
from app.models.user import User
from app.models.login_attempt import LoginAttempt
from app.models.email_verification import EmailVerification
from app.models.contact import Contact
from datetime import datetime, timedelta
from sqlalchemy import desc, func
from functools import wraps

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

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

@admin_bp.route('/')
@login_required
@admin_required
def dashboard():
    """Admin dashboard with overview statistics."""
    # Get statistics
    total_users = User.query.count()
    active_users = User.query.filter_by(is_active=True).count()
    inactive_users = total_users - active_users
    
    # Recent user registrations (last 30 days)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    recent_registrations = User.query.filter(User.created_at >= thirty_days_ago).count()
    
    # Login attempts statistics (last 24 hours)
    twenty_four_hours_ago = datetime.utcnow() - timedelta(hours=24)
    recent_login_attempts = LoginAttempt.query.filter(LoginAttempt.attempted_at >= twenty_four_hours_ago).count()
    failed_login_attempts = LoginAttempt.query.filter(
        LoginAttempt.attempted_at >= twenty_four_hours_ago,
        LoginAttempt.success == False
    ).count()
    
    # Email verification statistics
    verified_emails = EmailVerification.query.filter_by(is_verified=True).count()
    pending_verifications = EmailVerification.query.filter_by(is_verified=False).count()
    
    # Contact form submissions (last 30 days)
    recent_contacts = Contact.query.filter(Contact.created_at >= thirty_days_ago).count()
    
    # Recent activities
    recent_users = User.query.order_by(desc(User.created_at)).limit(5).all()
    recent_login_logs = LoginAttempt.query.order_by(desc(LoginAttempt.attempted_at)).limit(10).all()
    
    stats = {
        'total_users': total_users,
        'active_users': active_users,
        'inactive_users': inactive_users,
        'recent_registrations': recent_registrations,
        'recent_login_attempts': recent_login_attempts,
        'failed_login_attempts': failed_login_attempts,
        'verified_emails': verified_emails,
        'pending_verifications': pending_verifications,
        'recent_contacts': recent_contacts
    }
    
    return render_template('admin/dashboard/dashboard.html', 
                         stats=stats, 
                         recent_users=recent_users,
                         recent_login_logs=recent_login_logs)

@admin_bp.route('/users')
@login_required
@admin_required
def users():
    """User management page."""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 25, type=int)
    
    # Validate per_page to prevent abuse
    if per_page not in [25, 50, 100]:
        per_page = 25
    
    # Search functionality
    search = request.args.get('search', '')
    if search:
        users_query = User.query.filter(
            (User.username.contains(search)) | 
            (User.email.contains(search))
        )
    else:
        users_query = User.query
    
    # Filter by status
    status_filter = request.args.get('status', 'all')
    if status_filter == 'active':
        users_query = users_query.filter_by(is_active=True)
    elif status_filter == 'inactive':
        users_query = users_query.filter_by(is_active=False)
    elif status_filter == 'admin':
        users_query = users_query.filter_by(is_admin=True)
    
    users_pagination = users_query.order_by(desc(User.created_at)).paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    return render_template('admin/users/users.html', 
                         users=users_pagination.items,
                         pagination=users_pagination,
                         search=search,
                         status_filter=status_filter)

@admin_bp.route('/user/<int:user_id>')
@login_required
@admin_required
def user_details(user_id):
    """View detailed information about a specific user."""
    user = User.query.get_or_404(user_id)
    
    # Get user's login attempts
    login_attempts = LoginAttempt.query.filter_by(username_or_email=user.username)\
        .order_by(desc(LoginAttempt.attempted_at)).limit(20).all()
    
    # Also check by email
    email_attempts = LoginAttempt.query.filter_by(username_or_email=user.email)\
        .order_by(desc(LoginAttempt.attempted_at)).limit(20).all()
    
    # Combine and deduplicate
    all_attempts = list(set(login_attempts + email_attempts))
    all_attempts.sort(key=lambda x: x.attempted_at, reverse=True)
    
    # Get user's email verifications
    verifications = EmailVerification.query.filter_by(user_id=user.id)\
        .order_by(desc(EmailVerification.created_at)).all()
    
    return render_template('admin/user-details/user-details.html', 
                         user=user,
                         login_attempts=all_attempts[:20],
                         verifications=verifications)

@admin_bp.route('/user/<int:user_id>/toggle-status', methods=['POST'])
@login_required
@admin_required
def toggle_user_status(user_id):
    """Toggle user active status."""
    user = User.query.get_or_404(user_id)
    
    # Prevent admin from deactivating themselves
    if user.id == current_user.id:
        flash('You cannot deactivate your own account.', 'error')
        return redirect(url_for('admin.user_details', user_id=user_id))
    
    user.is_active = not user.is_active
    db.session.commit()
    
    status = 'activated' if user.is_active else 'deactivated'
    flash(f'User {user.username} has been {status}.', 'success')
    
    return redirect(url_for('admin.user_details', user_id=user_id))

@admin_bp.route('/user/<int:user_id>/toggle-admin', methods=['POST'])
@login_required
@admin_required
def toggle_admin_status(user_id):
    """Toggle user admin status."""
    user = User.query.get_or_404(user_id)
    
    # Prevent admin from removing their own admin status
    if user.id == current_user.id:
        flash('You cannot remove your own admin privileges.', 'error')
        return redirect(url_for('admin.user_details', user_id=user_id))
    
    user.is_admin = not user.is_admin
    db.session.commit()
    
    status = 'granted' if user.is_admin else 'revoked'
    flash(f'Admin privileges have been {status} for user {user.username}.', 'success')
    
    return redirect(url_for('admin.user_details', user_id=user_id))

@admin_bp.route('/api/stats')
@login_required
@admin_required
def api_stats():
    """API endpoint for dashboard statistics."""
    # Login attempts over time (last 7 days)
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    daily_stats = []
    
    for i in range(7):
        day = seven_days_ago + timedelta(days=i)
        day_start = day.replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day_start + timedelta(days=1)
        
        total_attempts = LoginAttempt.query.filter(
            LoginAttempt.attempted_at >= day_start,
            LoginAttempt.attempted_at < day_end
        ).count()
        
        failed_attempts = LoginAttempt.query.filter(
            LoginAttempt.attempted_at >= day_start,
            LoginAttempt.attempted_at < day_end,
            LoginAttempt.success == False
        ).count()
        
        daily_stats.append({
            'date': day.strftime('%Y-%m-%d'),
            'total_attempts': total_attempts,
            'failed_attempts': failed_attempts,
            'success_attempts': total_attempts - failed_attempts
        })
    
    return jsonify(daily_stats)

@admin_bp.route('/player-analytics')
@login_required
@admin_required
def player_analytics():
    """Player Data Analytics dashboard with comprehensive metrics."""
    # Generate dummy data for all analytics metrics
    
    # 1. General Usage Statistics
    general_stats = {
        'dau': 847,
        'wau': 3421,
        'mau': 12156,
        'dau_mau_ratio': 0.07,
        'avg_session_length': 1847,  # seconds
        'session_frequency': 4.2,
        'retention_rates': {
            'day_1': 78.5,
            'day_7': 45.2,
            'day_30': 23.8
        },
        'churn_rate': 12.4,
        'completion_rate': 67.3,
        'drop_off_rate': 15.7
    }
    
    # 2. Gameplay Interaction
    gameplay_stats = {
        'levels_completed': {
            'level_1': 89.2,
            'level_2': 76.4,
            'level_3': 58.7,
            'level_4': 34.1,
            'level_5': 18.9
        },
        'avg_actions_per_session': 127.3,
        'hint_usage_rate': 34.7,
        'avg_time_to_completion': {
            'level_1': 912,  # seconds
            'level_2': 1435,
            'level_3': 1789,
            'level_4': 2341,
            'level_5': 2987
        },
        'failure_retry_rate': 28.6,
        'achievements_unlocked': 4521
    }
    
    # 3. Engagement Quality
    engagement_stats = {
        'nps_score': 42,
        'avg_rating': 4.2,
        'total_ratings': 2847,
        'promoters_pct': 56.3,
        'detractors_pct': 14.2
    }
    
    # 4. Cybersecurity-Specific Stats
    cybersec_stats = {
        'level_1_metrics': {
            'fact_check_accuracy': 82.4,
            'misinformation_detection_speed': 45.6  # seconds
        },
        'level_2_metrics': {
            'phishing_detection_rate': 76.8,
            'false_positive_rate': 12.3
        },
        'level_3_metrics': {
            'malware_identification_accuracy': 71.5
        },
        'level_4_metrics': {
            'vulnerability_discovery_rate': 3.2,  # avg per session
            'ethical_methodology_score': 87.1,
            'responsible_disclosure_rate': 94.3
        },
        'level_5_metrics': {
            'evidence_collection_score': 79.6,
            'timeline_accuracy': 68.4,
            'attribution_confidence': 73.2
        },
        'blue_vs_red_metrics': {
            'asset_protection_rate': 74.8,
            'threat_detection_speed': 127.3,  # seconds
            'incident_response_effectiveness': 81.2,
            'ai_attack_success_rate': 34.7,
            'mttd': 89.4,  # seconds
            'mttr': 234.7  # seconds
        }
    }
    
    # 5. Weekly trends data for charts
    weekly_trends = [
        {'date': '2025-08-11', 'dau': 823, 'sessions': 3421, 'completions': 234},
        {'date': '2025-08-12', 'dau': 891, 'sessions': 3789, 'completions': 267},
        {'date': '2025-08-13', 'dau': 756, 'sessions': 3156, 'completions': 198},
        {'date': '2025-08-14', 'dau': 934, 'sessions': 4012, 'completions': 289},
        {'date': '2025-08-15', 'dau': 867, 'sessions': 3654, 'completions': 241},
        {'date': '2025-08-16', 'dau': 912, 'sessions': 3892, 'completions': 276},
        {'date': '2025-08-17', 'dau': 847, 'sessions': 3567, 'completions': 253}
    ]
    
    return render_template('admin/player-data-analytics/dashboard.html',
                         general_stats=general_stats,
                         gameplay_stats=gameplay_stats,
                         engagement_stats=engagement_stats,
                         cybersec_stats=cybersec_stats,
                         weekly_trends=weekly_trends)

@admin_bp.route('/player-analytics/levels')
@login_required
@admin_required
def player_analytics_levels():
    """Detailed level-specific analytics."""
    # Detailed level performance data
    level_details = {
        'level_1': {
            'name': 'The Misinformation Maze',
            'completion_rate': 89.2,
            'avg_time': 912,
            'fact_check_accuracy': 82.4,
            'source_verification_attempts': 3.4,
            'misinformation_detection_speed': 45.6,
            'critical_thinking_score': 7.8,
            'news_bias_recognition': 74.2
        },
        'level_2': {
            'name': 'Shadow in the Inbox',
            'completion_rate': 76.4,
            'avg_time': 1435,
            'phishing_detection_rate': 76.8,
            'false_positive_rate': 12.3,
            'email_analysis_thoroughness': 68.7,
            'social_engineering_susceptibility': 23.4,
            'safe_protocol_adherence': 84.1
        },
        'level_3': {
            'name': 'Malware Mayhem',
            'completion_rate': 58.7,
            'avg_time': 1789,
            'malware_identification_accuracy': 71.5,
            'quarantine_effectiveness': 79.3,
            'system_cleanup_thoroughness': 66.8,
            'threat_propagation_prevention': 82.4,
            'security_tool_utilization': 73.6
        },
        'level_4': {
            'name': 'The White Hat Test',
            'completion_rate': 34.1,
            'avg_time': 2341,
            'vulnerability_discovery_rate': 3.2,
            'ethical_methodology_score': 87.1,
            'responsible_disclosure_rate': 94.3,
            'risk_assessment_accuracy': 78.9,
            'documentation_quality': 81.7
        },
        'level_5': {
            'name': 'The Hunt for The Null',
            'completion_rate': 18.9,
            'avg_time': 2987,
            'evidence_collection_score': 79.6,
            'data_analysis_depth': 72.3,
            'timeline_accuracy': 68.4,
            'attribution_confidence': 73.2,
            'investigation_methodology': 85.6
        }
    }
    
    return render_template('admin/player-data-analytics/levels.html',
                         level_details=level_details)

@admin_bp.route('/player-analytics/blue-vs-red')
@login_required
@admin_required
def player_analytics_blue_vs_red():
    """Blue Team vs Red Team mode analytics."""
    blue_vs_red_data = {
        'overview': {
            'total_games': 1247,
            'avg_game_duration': 567,  # seconds
            'asset_protection_rate': 74.8,
            'player_win_rate': 68.3
        },
        'performance_metrics': {
            'threat_detection_speed': 127.3,
            'incident_response_effectiveness': 81.2,
            'security_control_optimization': 76.4,
            'ai_attack_success_rate': 34.7,
            'player_action_efficiency': 0.73,
            'alert_prioritization_accuracy': 79.8,
            'mttd': 89.4,
            'mttr': 234.7,
            'rto': 312.6
        },
        'asset_protection': {
            'academy_server': 78.2,
            'student_db': 74.1,
            'research_files': 71.9,
            'learning_platform': 75.6
        },
        'attack_patterns': [
            {'phase': 'reconnaissance', 'success_rate': 67.2, 'detection_rate': 45.8},
            {'phase': 'initial_access', 'success_rate': 52.4, 'detection_rate': 63.1},
            {'phase': 'persistence', 'success_rate': 38.7, 'detection_rate': 78.4},
            {'phase': 'privilege_escalation', 'success_rate': 29.3, 'detection_rate': 84.2},
            {'phase': 'data_exfiltration', 'success_rate': 18.6, 'detection_rate': 91.7}
        ]
    }
    
    return render_template('admin/player-data-analytics/blue-vs-red.html',
                         blue_vs_red_data=blue_vs_red_data)

@admin_bp.route('/cleanup', methods=['POST'])
@login_required
@admin_required
def cleanup_logs():
    """Clean up old logs and expired tokens."""
    try:
        # Clean up old login attempts (older than 30 days)
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        old_attempts = LoginAttempt.query.filter(
            LoginAttempt.attempted_at < thirty_days_ago
        ).delete()
        
        # Clean up expired email verification tokens
        expired_verifications = EmailVerification.cleanup_expired_tokens()
        
        # Clean up old contact submissions (older than 90 days)
        ninety_days_ago = datetime.utcnow() - timedelta(days=90)
        old_contacts = Contact.query.filter(
            Contact.created_at < ninety_days_ago
        ).delete()
        
        db.session.commit()
        
        flash(f'Cleanup completed: {old_attempts} login attempts, {expired_verifications} verification tokens, and {old_contacts} contact submissions removed.', 'success')
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Cleanup error: {e}')
        flash('Error during cleanup process.', 'error')
    
    return redirect(url_for('admin.dashboard'))
