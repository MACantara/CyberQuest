from flask import Blueprint, render_template, request, redirect, url_for, flash, current_app, make_response
from flask_login import login_required
from app.models.user import User
from app.models.login_attempt import LoginAttempt
from app.models.email_verification import EmailVerification
from app.models.contact import Contact
from app.database import DatabaseError
from datetime import datetime, timedelta
import csv
import io

# Import admin_required from admin utils module
from app.routes.admin.admin_utils import admin_required

admin_logs_bp = Blueprint('admin_logs', __name__, url_prefix='/admin/logs')

@admin_logs_bp.route('/')
@login_required
@admin_required
def logs_management():
    """View system logs."""
    try:
        log_type = request.args.get('type', 'login_attempts')
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 25, type=int)
        
        # Validate per_page to prevent abuse
        if per_page not in [25, 50, 100]:
            per_page = 25
        
        if log_type == 'login_attempts':
            logs_list = LoginAttempt.get_recent_attempts(per_page * page)
            total_count = len(logs_list)  # Simplified pagination
            start_idx = (page - 1) * per_page
            end_idx = start_idx + per_page
            logs_list = logs_list[start_idx:end_idx]
            
        elif log_type == 'user_registrations':
            logs_list, total_count = User.get_all_users(page, per_page)
            
        elif log_type == 'email_verifications':
            # For now, return empty list as we don't have get_all method for email verifications
            logs_list = []
            total_count = 0
            
        elif log_type == 'contact_submissions':
            logs_list = Contact.get_recent_submissions(per_page * page)
            total_count = len(logs_list)
            start_idx = (page - 1) * per_page
            end_idx = start_idx + per_page
            logs_list = logs_list[start_idx:end_idx]
        
        else:
            flash('Invalid log type.', 'error')
            return redirect(url_for('admin_logs.logs_management'))
        
        # Calculate pagination info
        total_pages = (total_count + per_page - 1) // per_page
        has_prev = page > 1
        has_next = page < total_pages
        prev_num = page - 1 if has_prev else None
        next_num = page + 1 if has_next else None
        
        # Create pagination object for template compatibility
        pagination = type('Pagination', (), {
            'items': logs_list,
            'page': page,
            'per_page': per_page,
            'total': total_count,
            'pages': total_pages,
            'has_prev': has_prev,
            'has_next': has_next,
            'prev_num': prev_num,
            'next_num': next_num
        })()
        
        return render_template('admin/logs/logs.html',
                             logs=logs_list,
                             pagination=pagination,
                             log_type=log_type)
    
    except DatabaseError as e:
        current_app.logger.error(f"Logs view error: {e}")
        flash('Error loading logs.', 'error')
        return redirect(url_for('admin.dashboard'))

@admin_logs_bp.route('/export')
@login_required
@admin_required
def export_logs():
    """Export logs to CSV format."""
    try:
        log_type = request.args.get('type', 'login_attempts')
        
        # Create CSV output
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Define headers and data based on log type
        if log_type == 'login_attempts':
            writer.writerow(['Username/Email', 'IP Address', 'Success', 'Attempted At'])
            logs = LoginAttempt.get_recent_attempts(1000)  # Get recent 1000 for export
            for log in logs:
                writer.writerow([
                    log.username_or_email or 'Unknown',
                    log.ip_address,
                    'Success' if log.success else 'Failed',
                    log.attempted_at.strftime('%Y-%m-%d %H:%M:%S') if log.attempted_at else 'Unknown'
                ])
        elif log_type == 'user_registrations':
            writer.writerow(['Username', 'Email', 'Active', 'Admin', 'Created At'])
            logs, _ = User.get_all_users(page=1, per_page=1000)  # Get recent 1000 for export
            for log in logs:
                writer.writerow([
                    log.username,
                    log.email,
                    'Yes' if log.is_active else 'No',
                    'Yes' if log.is_admin else 'No',
                    log.created_at.strftime('%Y-%m-%d %H:%M:%S') if log.created_at else 'Unknown'
                ])
        elif log_type == 'email_verifications':
            writer.writerow(['Email', 'User ID', 'Verified', 'Created At'])
            # For now, write header only as we don't have get_all method
            writer.writerow(['No data available', '', '', ''])
        elif log_type == 'contact_submissions':
            writer.writerow(['Name', 'Email', 'Subject', 'Message', 'Created At'])
            logs = Contact.get_recent_submissions(1000)  # Get recent 1000 for export
            for log in logs:
                writer.writerow([
                    log.name,
                    log.email,
                    log.subject,
                    log.message,
                    log.created_at.strftime('%Y-%m-%d %H:%M:%S') if log.created_at else 'Unknown'
                ])
        
        # Create response
        response = make_response(output.getvalue())
        response.headers['Content-Type'] = 'text/csv'
        response.headers['Content-Disposition'] = f'attachment; filename={log_type}_export.csv'
        
        return response
    
    except DatabaseError as e:
        current_app.logger.error(f"Logs export error: {e}")
        flash('Error exporting logs.', 'error')
        return redirect(url_for('admin_logs.logs_management'))
