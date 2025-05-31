from flask import Blueprint, render_template, request, redirect, url_for, flash, current_app, make_response
from app import db
from app.models.user import User
from app.models.login_attempt import LoginAttempt
from app.models.email_verification import EmailVerification
from app.models.contact import Contact
from datetime import datetime, timedelta
from sqlalchemy import desc
import csv
import io

# Import admin_required from admin module
from app.routes.admin import admin_required

logs_bp = Blueprint('logs', __name__, url_prefix='/admin/logs')

@logs_bp.route('/')
@admin_required
def logs():
    """View system logs."""
    log_type = request.args.get('type', 'login_attempts')
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 25, type=int)
    
    # Validate per_page to prevent abuse
    if per_page not in [25, 50, 100]:
        per_page = 25
    
    if log_type == 'login_attempts':
        logs_query = LoginAttempt.query.order_by(desc(LoginAttempt.attempted_at))
        logs_pagination = logs_query.paginate(page=page, per_page=per_page, error_out=False)
        
    elif log_type == 'user_registrations':
        logs_query = User.query.order_by(desc(User.created_at))
        logs_pagination = logs_query.paginate(page=page, per_page=per_page, error_out=False)
        
    elif log_type == 'email_verifications':
        logs_query = EmailVerification.query.order_by(desc(EmailVerification.created_at))
        logs_pagination = logs_query.paginate(page=page, per_page=per_page, error_out=False)
        
    elif log_type == 'contact_submissions':
        logs_query = Contact.query.order_by(desc(Contact.created_at))
        logs_pagination = logs_query.paginate(page=page, per_page=per_page, error_out=False)
    
    else:
        flash('Invalid log type.', 'error')
        return redirect(url_for('logs.logs'))
    
    return render_template('admin/logs.html',
                         logs=logs_pagination.items,
                         pagination=logs_pagination,
                         log_type=log_type)

@logs_bp.route('/export')
@admin_required
def export_logs():
    """Export logs to CSV format."""
    log_type = request.args.get('type', 'login_attempts')
    
    # Create CSV output
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Define headers and data based on log type
    if log_type == 'login_attempts':
        writer.writerow(['Username/Email', 'IP Address', 'Success', 'Attempted At'])
        logs = LoginAttempt.query.order_by(desc(LoginAttempt.attempted_at)).all()
        for log in logs:
            writer.writerow([
                log.username_or_email or 'Unknown',
                log.ip_address,
                'Success' if log.success else 'Failed',
                log.attempted_at.strftime('%Y-%m-%d %H:%M:%S')
            ])
    elif log_type == 'user_registrations':
        writer.writerow(['Username', 'Email', 'Active', 'Admin', 'Created At'])
        logs = User.query.order_by(desc(User.created_at)).all()
        for log in logs:
            writer.writerow([
                log.username,
                log.email,
                'Yes' if log.is_active else 'No',
                'Yes' if log.is_admin else 'No',
                log.created_at.strftime('%Y-%m-%d %H:%M:%S')
            ])
    elif log_type == 'email_verifications':
        writer.writerow(['Email', 'User', 'Verified', 'Expired', 'Created At'])
        logs = EmailVerification.query.order_by(desc(EmailVerification.created_at)).all()
        for log in logs:
            writer.writerow([
                log.email,
                log.user.username if log.user else 'Unknown',
                'Yes' if log.is_verified else 'No',
                'Yes' if log.is_expired() else 'No',
                log.created_at.strftime('%Y-%m-%d %H:%M:%S')
            ])
    elif log_type == 'contact_submissions':
        writer.writerow(['Name', 'Email', 'Subject', 'Message', 'Created At'])
        logs = Contact.query.order_by(desc(Contact.created_at)).all()
        for log in logs:
            writer.writerow([
                log.name,
                log.email,
                log.subject,
                log.message,
                log.created_at.strftime('%Y-%m-%d %H:%M:%S')
            ])
    
    # Create response
    response = make_response(output.getvalue())
    response.headers['Content-Type'] = 'text/csv'
    response.headers['Content-Disposition'] = f'attachment; filename={log_type}_export.csv'
    
    return response
