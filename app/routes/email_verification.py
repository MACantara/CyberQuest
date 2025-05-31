from flask import Blueprint, render_template, request, redirect, url_for, flash, current_app, jsonify
from flask_mail import Message
from app import db, mail
from app.models.user import User
from app.models.email_verification import EmailVerification

email_verification_bp = Blueprint('email_verification', __name__, url_prefix='/auth')

def send_verification_email(user, verification):
    """Send email verification email to user."""
    if not current_app.config.get('MAIL_SERVER'):
        current_app.logger.warning("Email server not configured for verification")
        return False
    
    try:
        verification_url = url_for('email_verification.verify_email', token=verification.token, _external=True)
        
        msg = Message(
            subject='Verify Your Email Address - Flask Template',
            sender=current_app.config.get('MAIL_USERNAME'),
            recipients=[user.email]
        )
        
        msg.body = f"""Hello {user.username},

Thank you for registering with Flask Template! To complete your registration, please verify your email address by clicking the link below:

{verification_url}

This verification link will expire in 24 hours.

If you didn't create an account, you can safely ignore this email.

Best regards,
Flask Template Team
"""
        
        msg.html = f"""
<html>
<body>
    <h2>Verify Your Email Address</h2>
    <p>Hello <strong>{user.username}</strong>,</p>
    
    <p>Thank you for registering with Flask Template! To complete your registration, please verify your email address by clicking the button below:</p>
    
    <p style="text-align: center; margin: 30px 0;">
        <a href="{verification_url}" style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Verify Email Address
        </a>
    </p>
    
    <p>Or copy and paste this link into your browser:</p>
    <p><a href="{verification_url}">{verification_url}</a></p>
    
    <p><small>This verification link will expire in 24 hours.</small></p>
    
    <p>If you didn't create an account, you can safely ignore this email.</p>
    
    <p>Best regards,<br>Flask Template Team</p>
</body>
</html>
"""
        
        mail.send(msg)
        return True
        
    except Exception as e:
        current_app.logger.error(f"Failed to send verification email: {e}")
        return False

def create_and_send_verification(user):
    """Create verification token and send email."""
    try:
        # Create verification record
        verification = EmailVerification.create_verification(user.id, user.email)
        
        # Send verification email
        email_sent = send_verification_email(user, verification)
        
        return verification, email_sent
        
    except Exception as e:
        current_app.logger.error(f"Error creating verification for user {user.id}: {e}")
        return None, False

def check_email_verification_status(user_or_identifier):
    """
    Check if a user's email is verified.
    
    Args:
        user_or_identifier: User object, user ID, or username/email string
        
    Returns:
        tuple: (is_verified, user_id, user_email) or (False, None, None) if user not found
    """
    user = None
    
    if isinstance(user_or_identifier, User):
        user = user_or_identifier
    elif isinstance(user_or_identifier, (int, str)) and str(user_or_identifier).isdigit():
        # User ID
        user = User.query.get(int(user_or_identifier))
    else:
        # Username or email
        user = User.query.filter(
            (User.username == user_or_identifier) | 
            (User.email == user_or_identifier)
        ).first()
    
    if not user:
        return False, None, None
    
    is_verified = EmailVerification.is_email_verified(user.id, user.email)
    return is_verified, user.id, user.email

@email_verification_bp.route('/verify-email/<token>')
def verify_email(token):
    """Handle email verification."""
    verification = EmailVerification.get_by_token(token)
    
    if not verification:
        flash('Invalid verification token.', 'error')
        return redirect(url_for('auth.login'))
    
    if verification.is_expired():
        flash('Verification token has expired. Please request a new one.', 'error')
        return redirect(url_for('auth.login'))
    
    if verification.is_verified:
        flash('Email address has already been verified. You can now log in.', 'info')
        return redirect(url_for('auth.login'))
    
    # Verify the email
    verification.verify()
    flash('Email address verified successfully! You can now log in.', 'success')
    return redirect(url_for('auth.login'))

@email_verification_bp.route('/check-verification-status', methods=['POST'])
def check_verification_status():
    """Check if user's email has been verified (AJAX endpoint)."""
    data = request.get_json()
    user_id = data.get('user_id')
    user_email = data.get('user_email')
    
    if not user_id or not user_email:
        return jsonify({'verified': False, 'error': 'Invalid request'})
    
    try:
        # Check if email is verified
        is_verified = EmailVerification.is_email_verified(user_id, user_email)
        return jsonify({'verified': is_verified})
    except Exception as e:
        current_app.logger.error(f"Error checking verification status: {e}")
        return jsonify({'verified': False, 'error': 'Check failed'})

@email_verification_bp.route('/resend-verification', methods=['POST'])
def resend_verification():
    """Resend verification email."""
    user_id = request.form.get('user_id')
    user_email = request.form.get('user_email')
    
    if not user_id or not user_email:
        flash('Invalid request.', 'error')
        return redirect(url_for('auth.login'))
    
    user = User.query.get(user_id)
    if not user or user.email != user_email:
        flash('Invalid request.', 'error')
        return redirect(url_for('auth.login'))
    
    # Check if already verified
    if EmailVerification.is_email_verified(user.id, user.email):
        flash('Email address is already verified. You can now log in.', 'info')
        return redirect(url_for('auth.login'))
    
    # Create new verification
    verification, email_sent = create_and_send_verification(user)
    
    # Clear any existing flash messages by redirecting to a clean verification pending page
    if email_sent:
        return redirect(url_for('email_verification.verification_pending', 
                              user_id=user.id, 
                              user_email=user.email,
                              resent='true'))
    else:
        return redirect(url_for('email_verification.verification_pending', 
                              user_id=user.id, 
                              user_email=user.email,
                              resent='false'))

@email_verification_bp.route('/verification-pending', methods=['GET', 'POST']) # POST for resend verification button
def verification_pending():
    """Show verification pending page after signup."""
    user_id = request.args.get('user_id')
    user_email = request.args.get('user_email')
    email_sent = request.args.get('email_sent', 'true') == 'true'
    resent = request.args.get('resent')
    login_attempt = request.args.get('login_attempt')
    
    # Show appropriate flash message based on context
    if login_attempt == 'true':
        flash('Please verify your email address before logging in. Check your email and click the verification link.', 'warning')
    elif resent == 'true':
        flash('Verification email sent! Please check your email and click the verification link.', 'success')
    elif resent == 'false':
        flash('Could not send verification email. Please try again later.', 'error')
    elif email_sent:
        flash('Account created successfully! Please check your email and click the verification link before logging in.', 'success')
    else:
        flash('Account created successfully! However, we could not send the verification email. Please contact support.', 'warning')
    
    return render_template('auth/verification-pending.html', 
                         user_id=user_id, 
                         user_email=user_email,
                         email_sent=email_sent)
