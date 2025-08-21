from flask import Blueprint, render_template, request, redirect, url_for, flash, current_app, jsonify, send_file
from flask_login import login_required, current_user
from app.models.user import User
from app.models.login_attempt import LoginAttempt
from app.models.email_verification import EmailVerification
from app.models.contact import Contact
from app.database import DatabaseError, get_supabase, Tables
from datetime import datetime, timedelta
from functools import wraps
import json
import os
import tempfile
import zipfile
from typing import Dict, Any

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
    try:
        # Get statistics
        total_users = User.count_all()
        active_users = User.count_active()
        inactive_users = total_users - active_users
        
        # Recent user registrations (last 30 days)
        recent_registrations = User.count_recent_registrations(30)
        
        # Login attempts statistics (last 24 hours)
        recent_login_attempts = LoginAttempt.count_recent_attempts(24)
        failed_login_attempts = LoginAttempt.count_failed_attempts(24)
        
        # Email verification statistics
        verified_emails = EmailVerification.count_verified_emails()
        pending_verifications = EmailVerification.count_pending_verifications()
        
        # Contact form submissions (last 30 days)
        recent_contacts = Contact.count_recent_submissions(30)
        
        # Recent activities
        recent_users, _ = User.get_all_users(page=1, per_page=5)
        recent_login_logs = LoginAttempt.get_recent_attempts(10)
        
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
    
    except DatabaseError as e:
        current_app.logger.error(f"Admin dashboard error: {e}")
        flash('Error loading dashboard data.', 'error')
        return redirect(url_for('main.home'))

@admin_bp.route('/users')
@login_required
@admin_required
def users():
    """User management page."""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 25, type=int)
        
        # Validate per_page to prevent abuse
        if per_page not in [25, 50, 100]:
            per_page = 25
        
        # Search functionality
        search = request.args.get('search', '')
        
        # Filter by status
        status_filter = request.args.get('status', 'all')
        
        # Get users with pagination and filtering
        users_list, total_count = User.get_all_users(page, per_page, search, status_filter)
        
        # Calculate pagination info
        total_pages = (total_count + per_page - 1) // per_page
        has_prev = page > 1
        has_next = page < total_pages
        prev_num = page - 1 if has_prev else None
        next_num = page + 1 if has_next else None
        
        # Create pagination object for template compatibility
        pagination = type('Pagination', (), {
            'items': users_list,
            'page': page,
            'per_page': per_page,
            'total': total_count,
            'pages': total_pages,
            'has_prev': has_prev,
            'has_next': has_next,
            'prev_num': prev_num,
            'next_num': next_num
        })()
        
        return render_template('admin/users/users.html', 
                             users=users_list,
                             pagination=pagination,
                             search=search,
                             status_filter=status_filter)
    
    except DatabaseError as e:
        current_app.logger.error(f"Admin users error: {e}")
        flash('Error loading users data.', 'error')
        return redirect(url_for('admin.dashboard'))

@admin_bp.route('/user/<int:user_id>')
@login_required
@admin_required
def user_details(user_id):
    """View detailed information about a specific user."""
    try:
        user = User.find_by_id(user_id)
        if not user:
            flash('User not found.', 'error')
            return redirect(url_for('admin.users'))
        
        # Get user's login attempts (simplified - get recent attempts)
        all_attempts = LoginAttempt.get_recent_attempts(50)  # Get more to filter
        user_attempts = [attempt for attempt in all_attempts 
                        if attempt.username_or_email in [user.username, user.email]][:20]
        
        # Get email verifications for this user
        verifications = EmailVerification.get_by_user_id(user.id)
        
        # Get contact submissions by this user's email
        contact_submissions = Contact.get_by_email(user.email, limit=10)
        
        return render_template('admin/user-details/user-details.html', 
                             user=user,
                             login_attempts=user_attempts,
                             verifications=verifications,
                             contact_submissions=contact_submissions)
    
    except DatabaseError as e:
        current_app.logger.error(f"Admin user details error: {e}")
        flash('Error loading user details.', 'error')
        return redirect(url_for('admin.users'))

@admin_bp.route('/user/<int:user_id>/toggle-status', methods=['POST'])
@login_required
@admin_required
def toggle_user_status(user_id):
    """Toggle user active status."""
    try:
        user = User.find_by_id(user_id)
        if not user:
            flash('User not found.', 'error')
            return redirect(url_for('admin.users'))
        
        # Prevent admin from deactivating themselves
        if user.id == current_user.id:
            flash('You cannot deactivate your own account.', 'error')
            return redirect(url_for('admin.user_details', user_id=user_id))
        
        user.is_active = not user.is_active
        user.save()
        
        status = 'activated' if user.is_active else 'deactivated'
        flash(f'User {user.username} has been {status}.', 'success')
        
        return redirect(url_for('admin.user_details', user_id=user_id))
    
    except DatabaseError as e:
        current_app.logger.error(f"Admin toggle user status error: {e}")
        flash('Error updating user status.', 'error')
        return redirect(url_for('admin.users'))

@admin_bp.route('/user/<int:user_id>/toggle-admin', methods=['POST'])
@login_required
@admin_required
def toggle_admin_status(user_id):
    """Toggle user admin status."""
    try:
        user = User.find_by_id(user_id)
        if not user:
            flash('User not found.', 'error')
            return redirect(url_for('admin.users'))
        
        # Prevent admin from removing their own admin status
        if user.id == current_user.id:
            flash('You cannot remove your own admin privileges.', 'error')
            return redirect(url_for('admin.user_details', user_id=user_id))
        
        user.is_admin = not user.is_admin
        user.save()
        
        status = 'granted' if user.is_admin else 'revoked'
        flash(f'Admin privileges have been {status} for {user.username}.', 'success')
        
        return redirect(url_for('admin.user_details', user_id=user_id))
    
    except DatabaseError as e:
        current_app.logger.error(f"Admin toggle admin status error: {e}")
        flash('Error updating admin status.', 'error')
        return redirect(url_for('admin.users'))

@admin_bp.route('/api/stats')
@login_required
@admin_required
def api_stats():
    """API endpoint for dashboard statistics."""
    try:
        # For now, return simplified stats since we don't have complex time-series queries
        # This could be enhanced with more sophisticated Supabase queries
        stats_data = {
            'daily_login_attempts': [],  # Would need time-series implementation
            'user_registration_trend': [],  # Would need time-series implementation
            'total_users': User.count_all(),
            'active_users': User.count_active(),
            'recent_login_attempts': LoginAttempt.count_recent_attempts(24),
            'failed_login_attempts': LoginAttempt.count_failed_attempts(24)
        }
        
        return jsonify(stats_data)
    
    except DatabaseError as e:
        current_app.logger.error(f"Admin API stats error: {e}")
        return jsonify({'error': 'Failed to load statistics'}), 500

@admin_bp.route('/contacts')
@login_required
@admin_required
def contacts():
    """Contact submissions management page."""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 25, type=int)
        
        # Validate per_page to prevent abuse
        if per_page not in [25, 50, 100]:
            per_page = 25
        
        # Search functionality
        search = request.args.get('search', '')
        
        # Filter by status
        status_filter = request.args.get('status', 'all')
        
        # Get contact submissions with pagination and filtering
        contacts_list, total_count = Contact.get_all_submissions(page, per_page, search, status_filter)
        
        # Calculate pagination info
        total_pages = (total_count + per_page - 1) // per_page
        has_prev = page > 1
        has_next = page < total_pages
        prev_num = page - 1 if has_prev else None
        next_num = page + 1 if has_next else None
        
        # Create pagination object for template compatibility
        pagination = type('Pagination', (), {
            'items': contacts_list,
            'page': page,
            'per_page': per_page,
            'total': total_count,
            'pages': total_pages,
            'has_prev': has_prev,
            'has_next': has_next,
            'prev_num': prev_num,
            'next_num': next_num
        })()
        
        return render_template('admin/contacts/contacts.html', 
                             contacts=contacts_list,
                             pagination=pagination,
                             search=search,
                             status_filter=status_filter)
    
    except DatabaseError as e:
        current_app.logger.error(f"Admin contacts error: {e}")
        flash('Error loading contacts data.', 'error')
        return redirect(url_for('admin.dashboard'))

@admin_bp.route('/contact/<int:contact_id>/mark-read', methods=['POST'])
@login_required
@admin_required
def mark_contact_read(contact_id):
    """Mark a contact submission as read."""
    try:
        # First get all contacts to find the one with the matching ID
        all_contacts, _ = Contact.get_all_submissions(page=1, per_page=1000)  # Get a large number
        contact = None
        for c in all_contacts:
            if c.id == contact_id:
                contact = c
                break
        
        if not contact:
            flash('Contact submission not found.', 'error')
            return redirect(url_for('admin.contacts'))
        
        contact.mark_as_read()
        flash('Contact submission marked as read.', 'success')
        
        return redirect(url_for('admin.contacts'))
    
    except DatabaseError as e:
        current_app.logger.error(f"Admin mark contact read error: {e}")
        flash('Error updating contact status.', 'error')
        return redirect(url_for('admin.contacts'))

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
        old_attempts = LoginAttempt.cleanup_old_attempts(30)
        
        # Clean up expired email verification tokens
        expired_verifications = EmailVerification.cleanup_expired_tokens()
        
        # Clean up old contact submissions (older than 1 year)
        old_contacts = Contact.cleanup_old_submissions(365)
        
        flash(f'Cleanup completed: {old_attempts} login attempts, {expired_verifications} verification tokens, and {old_contacts} old contact submissions removed.', 'success')
        
    except DatabaseError as e:
        current_app.logger.error(f'Database error during cleanup: {e}')
        flash('Error during cleanup process.', 'error')
    except Exception as e:
        current_app.logger.error(f'Cleanup error: {e}')
        flash('Error during cleanup process.', 'error')
    
    return redirect(url_for('admin.dashboard'))

@admin_bp.route('/system-backup')
@login_required
@admin_required
def system_backup():
    """System backup and restore management page."""
    try:
        # Get backup directory info
        backup_dir = os.path.join(current_app.root_path, '..', 'backups')
        os.makedirs(backup_dir, exist_ok=True)
        
        # List existing backups
        backups = []
        if os.path.exists(backup_dir):
            for filename in os.listdir(backup_dir):
                if filename.endswith('.zip'):
                    backup_path = os.path.join(backup_dir, filename)
                    stat = os.stat(backup_path)
                    backups.append({
                        'filename': filename,
                        'size': stat.st_size,
                        'created_at': datetime.fromtimestamp(stat.st_ctime),
                        'size_mb': round(stat.st_size / (1024 * 1024), 2)
                    })
        
        # Sort backups by creation date (newest first)
        backups.sort(key=lambda x: x['created_at'], reverse=True)
        
        # Get database statistics
        stats = {
            'total_users': User.count_all(),
            'total_login_attempts': LoginAttempt.count_recent_attempts(365 * 10),  # All time
            'total_verifications': EmailVerification.count_verified_emails() + EmailVerification.count_pending_verifications(),
            'total_contacts': Contact.get_unread_count() + 100,  # Approximate total (would need a count_all method)
            'backup_count': len(backups),
            'last_backup': backups[0]['created_at'] if backups else None
        }
        
        return render_template('admin/system-backup/backup.html', 
                             backups=backups, 
                             stats=stats)
    
    except Exception as e:
        current_app.logger.error(f"System backup page error: {e}")
        flash('Error loading backup management page.', 'error')
        return redirect(url_for('admin.dashboard'))

@admin_bp.route('/create-backup', methods=['POST'])
@login_required
@admin_required
def create_backup():
    """Create a full system backup."""
    try:
        backup_dir = os.path.join(current_app.root_path, '..', 'backups')
        os.makedirs(backup_dir, exist_ok=True)
        
        # Generate backup filename with timestamp
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_filename = f'cyberquest_backup_{timestamp}.zip'
        backup_path = os.path.join(backup_dir, backup_filename)
        
        # Create backup data
        backup_data = _create_database_backup()
        
        # Create ZIP file with backup data
        with zipfile.ZipFile(backup_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            # Add database backup as JSON
            zipf.writestr('database_backup.json', json.dumps(backup_data, indent=2, default=str))
            
            # Add metadata
            metadata = {
                'backup_type': 'full',
                'created_at': datetime.now().isoformat(),
                'created_by': current_user.username,
                'version': '1.0',
                'tables_included': list(backup_data.keys()),
                'total_records': sum(len(table_data) for table_data in backup_data.values())
            }
            zipf.writestr('backup_metadata.json', json.dumps(metadata, indent=2))
            
            # Add application info
            app_info = {
                'app_name': 'CyberQuest',
                'backup_created_at': datetime.now().isoformat(),
                'python_version': '3.12',
                'database_type': 'Supabase PostgreSQL'
            }
            zipf.writestr('app_info.json', json.dumps(app_info, indent=2))
        
        file_size = os.path.getsize(backup_path)
        size_mb = round(file_size / (1024 * 1024), 2)
        
        flash(f'Backup created successfully: {backup_filename} ({size_mb} MB)', 'success')
        current_app.logger.info(f'Database backup created by {current_user.username}: {backup_filename}')
        
    except Exception as e:
        current_app.logger.error(f"Backup creation error: {e}")
        flash('Error creating backup. Please check server logs.', 'error')
    
    return redirect(url_for('admin.system_backup'))

@admin_bp.route('/download-backup/<filename>')
@login_required
@admin_required
def download_backup(filename):
    """Download a backup file."""
    try:
        backup_dir = os.path.join(current_app.root_path, '..', 'backups')
        backup_path = os.path.join(backup_dir, filename)
        
        if not os.path.exists(backup_path) or not filename.endswith('.zip'):
            flash('Backup file not found.', 'error')
            return redirect(url_for('admin.system_backup'))
        
        current_app.logger.info(f'Backup downloaded by {current_user.username}: {filename}')
        return send_file(backup_path, as_attachment=True, download_name=filename)
        
    except Exception as e:
        current_app.logger.error(f"Backup download error: {e}")
        flash('Error downloading backup file.', 'error')
        return redirect(url_for('admin.system_backup'))

@admin_bp.route('/delete-backup/<filename>', methods=['POST'])
@login_required
@admin_required
def delete_backup(filename):
    """Delete a backup file."""
    try:
        backup_dir = os.path.join(current_app.root_path, '..', 'backups')
        backup_path = os.path.join(backup_dir, filename)
        
        if not os.path.exists(backup_path) or not filename.endswith('.zip'):
            flash('Backup file not found.', 'error')
            return redirect(url_for('admin.system_backup'))
        
        os.remove(backup_path)
        flash(f'Backup {filename} deleted successfully.', 'success')
        current_app.logger.info(f'Backup deleted by {current_user.username}: {filename}')
        
    except Exception as e:
        current_app.logger.error(f"Backup deletion error: {e}")
        flash('Error deleting backup file.', 'error')
    
    return redirect(url_for('admin.system_backup'))

@admin_bp.route('/restore-backup', methods=['POST'])
@login_required
@admin_required
def restore_backup():
    """Restore system from a backup file."""
    try:
        if 'backup_file' not in request.files:
            flash('No backup file provided.', 'error')
            return redirect(url_for('admin.system_backup'))
        
        file = request.files['backup_file']
        if file.filename == '' or not file.filename.endswith('.zip'):
            flash('Please select a valid backup file (.zip).', 'error')
            return redirect(url_for('admin.system_backup'))
        
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.zip') as temp_file:
            file.save(temp_file.name)
            
            # Extract and restore backup
            with zipfile.ZipFile(temp_file.name, 'r') as zipf:
                # Read backup metadata
                metadata = json.loads(zipf.read('backup_metadata.json'))
                
                # Read database backup
                backup_data = json.loads(zipf.read('database_backup.json'))
                
                # Perform restore with confirmation
                restore_type = request.form.get('restore_type', 'merge')
                _restore_database_backup(backup_data, restore_type)
                
                flash(f'Database restored successfully from backup created on {metadata["created_at"]}', 'success')
                current_app.logger.info(f'Database restored by {current_user.username} from backup: {file.filename}')
            
            # Clean up temp file
            os.unlink(temp_file.name)
        
    except Exception as e:
        current_app.logger.error(f"Backup restore error: {e}")
        flash('Error restoring backup. Please check server logs.', 'error')
    
    return redirect(url_for('admin.system_backup'))

def _create_database_backup() -> Dict[str, Any]:
    """Create a complete database backup."""
    supabase = get_supabase()
    backup_data = {}
    
    try:
        # Backup Users table
        response = supabase.table(Tables.USERS).select("*").execute()
        backup_data['users'] = response.data if response.data else []
        
        # Backup Login Attempts table
        response = supabase.table(Tables.LOGIN_ATTEMPTS).select("*").execute()
        backup_data['login_attempts'] = response.data if response.data else []
        
        # Backup Email Verifications table
        response = supabase.table(Tables.EMAIL_VERIFICATIONS).select("*").execute()
        backup_data['email_verifications'] = response.data if response.data else []
        
        # Backup Contact Submissions table
        response = supabase.table(Tables.CONTACT_SUBMISSIONS).select("*").execute()
        backup_data['contact_submissions'] = response.data if response.data else []
        
        # Backup Password Reset Tokens table
        response = supabase.table(Tables.PASSWORD_RESET_TOKENS).select("*").execute()
        backup_data['password_reset_tokens'] = response.data if response.data else []
        
        return backup_data
        
    except Exception as e:
        current_app.logger.error(f"Database backup creation error: {e}")
        raise DatabaseError(f"Failed to create database backup: {e}")

def _restore_database_backup(backup_data: Dict[str, Any], restore_type: str = 'merge'):
    """Restore database from backup data."""
    supabase = get_supabase()
    
    try:
        if restore_type == 'replace':
            # WARNING: This will delete all existing data
            current_app.logger.warning(f"Full database replacement initiated by {current_user.username}")
            
            # Delete existing data (in reverse dependency order)
            supabase.table(Tables.PASSWORD_RESET_TOKENS).delete().neq('id', 0).execute()
            supabase.table(Tables.EMAIL_VERIFICATIONS).delete().neq('id', 0).execute()
            supabase.table(Tables.CONTACT_SUBMISSIONS).delete().neq('id', 0).execute()
            supabase.table(Tables.LOGIN_ATTEMPTS).delete().neq('id', 0).execute()
            # Note: Don't delete users table as it might break the current session
        
        # Restore data
        for table_name, table_data in backup_data.items():
            if not table_data:
                continue
                
            table_mapping = {
                'users': Tables.USERS,
                'login_attempts': Tables.LOGIN_ATTEMPTS,
                'email_verifications': Tables.EMAIL_VERIFICATIONS,
                'contact_submissions': Tables.CONTACT_SUBMISSIONS,
                'password_reset_tokens': Tables.PASSWORD_RESET_TOKENS
            }
            
            if table_name in table_mapping:
                # Insert data in batches to avoid timeout
                batch_size = 100
                for i in range(0, len(table_data), batch_size):
                    batch = table_data[i:i + batch_size]
                    if restore_type == 'merge':
                        # Use upsert to merge data
                        supabase.table(table_mapping[table_name]).upsert(batch).execute()
                    else:
                        # Insert new data
                        supabase.table(table_mapping[table_name]).insert(batch).execute()
        
        current_app.logger.info(f"Database restore completed: {restore_type} mode")
        
    except Exception as e:
        current_app.logger.error(f"Database restore error: {e}")
        raise DatabaseError(f"Failed to restore database: {e}")

@admin_bp.route('/backup-schedule')
@login_required
@admin_required
def backup_schedule():
    """Backup scheduling configuration page."""
    # This would integrate with a task scheduler like Celery in production
    # For now, provide manual backup options and information
    
    schedule_info = {
        'auto_backup_enabled': False,  # Would be configurable
        'backup_frequency': 'daily',   # daily, weekly, monthly
        'backup_retention': 30,        # days to keep backups
        'next_scheduled_backup': None,
        'last_auto_backup': None
    }
    
    return render_template('admin/system-backup/schedule.html', 
                         schedule_info=schedule_info)
