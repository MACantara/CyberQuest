from flask import Blueprint, render_template, request, redirect, url_for, flash, current_app
from flask_mail import Message
from app import db, mail
from app.models.user import User, PasswordResetToken
from app.utils.hcaptcha_utils import verify_hcaptcha
from app.utils.password_validator import PasswordValidator
from argon2.exceptions import HashingError
import re

password_reset_bp = Blueprint('password_reset', __name__, url_prefix='/password')

def send_reset_email(user, token):
    """Send password reset email."""
    if not current_app.config.get('MAIL_SERVER'):
        current_app.logger.warning("Email server not configured")
        return False
    
    try:
        reset_url = url_for('password_reset.reset_password', token=token, _external=True)
        
        msg = Message(
            subject='Password Reset Request - Flask Template',
            sender=current_app.config.get('MAIL_USERNAME'),
            recipients=[user.email]
        )
        
        msg.body = f"""Hello {user.username},

You requested a password reset for your Flask Template account.

Click the link below to reset your password:
{reset_url}

This link will expire in 1 hour.

If you didn't request this password reset, please ignore this email.

Best regards,
Flask Template Team
"""
        
        msg.html = f"""
<html>
<body>
    <h2>Password Reset Request</h2>
    <p>Hello <strong>{user.username}</strong>,</p>
    
    <p>You requested a password reset for your Flask Template account.</p>
    
    <p><a href="{reset_url}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Your Password</a></p>
    
    <p>Or copy and paste this link into your browser:<br>
    <a href="{reset_url}">{reset_url}</a></p>
    
    <p><em>This link will expire in 1 hour.</em></p>
    
    <p>If you didn't request this password reset, please ignore this email.</p>
    
    <p>Best regards,<br>Flask Template Team</p>
</body>
</html>
"""
        
        mail.send(msg)
        return True
        
    except Exception as e:
        current_app.logger.error(f"Failed to send reset email: {e}")
        return False

@password_reset_bp.route('/forgot', methods=['GET', 'POST'])
def forgot_password():
    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        
        if not email:
            flash('Please provide your email address.', 'error')
            return render_template('password/forgot-password.html')
        
        # Verify hCaptcha
        if not verify_hcaptcha():
            flash('Please complete the captcha verification.', 'error')
            return render_template('password/forgot-password.html')
        
        # Check if database is disabled (Vercel environment)
        if current_app.config.get('DISABLE_DATABASE', False):
            flash('Password reset is not available in this deployment environment.', 'warning')
            return render_template('password/forgot-password.html')
        
        # Always show success message for security (don't reveal if email exists)
        flash('If an account with that email exists, we\'ve sent password reset instructions.', 'info')
        
        user = User.query.filter_by(email=email).first()
        if user and user.is_active:
            try:
                token = user.generate_reset_token()
                if send_reset_email(user, token):
                    current_app.logger.info(f"Password reset email sent to {email}")
                else:
                    current_app.logger.error(f"Failed to send password reset email to {email}")
            except Exception as e:
                current_app.logger.error(f"Error generating reset token for {email}: {e}")
        
        return redirect(url_for('auth.login'))
    
    return render_template('password/forgot-password.html')

@password_reset_bp.route('/reset/<token>', methods=['GET', 'POST'])
def reset_password(token):
    # Check if database is disabled (Vercel environment)
    if current_app.config.get('DISABLE_DATABASE', False):
        flash('Password reset is not available in this deployment environment.', 'warning')
        return redirect(url_for('main.home'))
    
    reset_token = PasswordResetToken.find_valid_token(token)
    if not reset_token:
        flash('Invalid or expired reset link.', 'error')
        return redirect(url_for('password_reset.forgot-password'))
    
    if request.method == 'POST':
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        
        # Verify hCaptcha
        if not verify_hcaptcha():
            flash('Please complete the captcha verification.', 'error')
            return render_template('password/reset-password.html', token=token)
        
        errors = []
        
        if not password:
            errors.append('Password is required.')
        else:
            # Use zxcvbn validation with user context
            user = reset_token.user
            user_inputs = [user.username, user.email.split('@')[0]] if user.email else [user.username]
            is_valid, password_errors, _ = PasswordValidator.validate_password(password, user_inputs)
            if not is_valid:
                errors.extend(password_errors)
        
        if password != confirm_password:
            errors.append('Passwords do not match.')
        
        if errors:
            for error in errors:
                flash(error, 'error')
            return render_template('password/reset-password.html', token=token)
        
        try:
            # Update user password
            user = reset_token.user
            user.set_password(password)
            reset_token.use_token()
            db.session.commit()
            
            flash('Your password has been reset successfully! Please log in with your new password.', 'success')
            return redirect(url_for('auth.login'))
            
        except HashingError:
            flash('Error resetting password. Please try again.', 'error')
        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f"Password reset error: {e}")
            flash('Error resetting password. Please try again.', 'error')
    
    return render_template('password/reset-password.html', token=token)
