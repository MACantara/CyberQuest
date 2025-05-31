from flask import Blueprint, render_template, request, redirect, url_for, flash, current_app
from flask_mail import Message
from app import db, mail
from app.models.contact import Contact
from app.utils.hcaptcha_utils import verify_hcaptcha
import re

contact_bp = Blueprint('contact', __name__)

def is_valid_email(email):
    """Validate email format."""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def send_contact_notification(contact_submission):
    """Send email notification for new contact form submission."""
    if not current_app.config.get('MAIL_SERVER'):
        current_app.logger.warning("Email server not configured")
        return False
    
    try:
        # Email to admin
        admin_msg = Message(
            subject=f'[Contact Form Submission] {contact_submission.subject}',
            sender=current_app.config.get('MAIL_USERNAME'),
            recipients=[current_app.config.get('MAIL_USERNAME')],  # Send to admin
            reply_to=contact_submission.email  # Add reply-to parameter
        )
        
        admin_msg.body = f"""
{contact_submission.message}
"""
        
        admin_msg.html = f"""
<html>
<body>
    <p>{contact_submission.message.replace(chr(10), '<br>')}</p>
</body>
</html>
"""
        
        # Auto-reply to user
        user_msg = Message(
            subject='Thank you for contacting us - Flask Template',
            sender=current_app.config.get('MAIL_USERNAME'),
            recipients=[contact_submission.email]
        )
        
        user_msg.body = f"""Hello {contact_submission.name},

Thank you for contacting us! We have received your message regarding "{contact_submission.subject}" and will get back to you as soon as possible.

Your message:
{contact_submission.message}

We typically respond within 24-48 hours.

Best regards,
Flask Template Team
"""
        
        user_msg.html = f"""
<html>
<body>
    <h2>Thank you for contacting us!</h2>
    <p>Hello <strong>{contact_submission.name}</strong>,</p>
    
    <p>Thank you for contacting us! We have received your message regarding "<strong>{contact_submission.subject}</strong>" and will get back to you as soon as possible.</p>
    
    <h3>Your message:</h3>
    <p>{contact_submission.message.replace(chr(10), '<br>')}</p>
    
    <p>We typically respond within 24-48 hours.</p>
    
    <p>Best regards,<br>Flask Template Team</p>
</body>
</html>
"""
        
        # Send both emails
        mail.send(admin_msg)
        mail.send(user_msg)
        return True
        
    except Exception as e:
        current_app.logger.error(f"Failed to send contact form emails: {e}")
        return False

@contact_bp.route('/contact', methods=['GET', 'POST'])
def contact_page():
    """Contact page with form handling."""
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip().lower()
        subject = request.form.get('subject', '').strip()
        message = request.form.get('message', '').strip()
        
        # Verify hCaptcha
        if not verify_hcaptcha():
            flash('Please complete the captcha verification.', 'error')
            return render_template('contact.html')
        
        # Validation
        errors = []
        
        if not name or len(name) < 2:
            errors.append('Please provide a valid name (at least 2 characters).')
        elif len(name) > 100:
            errors.append('Name must be less than 100 characters.')
        
        if not email:
            errors.append('Email address is required.')
        elif not is_valid_email(email):
            errors.append('Please provide a valid email address.')
        elif len(email) > 120:
            errors.append('Email address is too long.')
        
        if not subject or len(subject) < 3:
            errors.append('Please provide a subject (at least 3 characters).')
        elif len(subject) > 200:
            errors.append('Subject must be less than 200 characters.')
        
        if not message or len(message) < 10:
            errors.append('Please provide a message (at least 10 characters).')
        elif len(message) > 2000:
            errors.append('Message must be less than 2000 characters.')
        
        if errors:
            for error in errors:
                flash(error, 'error')
            return render_template('contact.html')
        
        # Check if database is disabled (Vercel environment)
        if current_app.config.get('DISABLE_DATABASE', False):
            # Log the submission instead of saving to database
            current_app.logger.info(f"Contact form submission (DB disabled): {name} <{email}> - {subject}")
            flash('Thank you for your message! We have received your inquiry and will get back to you soon.', 'success')
            
            # Still try to send email notification if configured
            if current_app.config.get('MAIL_SERVER'):
                try:
                    # Create a temporary contact object for email
                    from datetime import datetime
                    temp_contact = type('Contact', (), {
                        'name': name,
                        'email': email,
                        'subject': subject,
                        'message': message,
                        'created_at': datetime.utcnow()
                    })()
                    send_contact_notification(temp_contact)
                except Exception as e:
                    current_app.logger.error(f"Failed to send email in Vercel mode: {e}")
            
            return redirect(url_for('contact.contact_page'))
        
        try:
            # Save to database
            contact_submission = Contact(
                name=name,
                email=email,
                subject=subject,
                message=message
            )
            db.session.add(contact_submission)
            db.session.commit()
            
            # Send email notifications
            email_sent = send_contact_notification(contact_submission)
            
            if email_sent:
                flash('Thank you for your message! We have received your inquiry and sent you a confirmation email.', 'success')
            else:
                flash('Thank you for your message! We have received your inquiry and will get back to you soon.', 'success')
            
            current_app.logger.info(f"Contact form submission saved: {name} <{email}> - {subject}")
            return redirect(url_for('contact.contact_page'))
            
        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f"Contact form submission error: {e}")
            flash('There was an error submitting your message. Please try again.', 'error')
    
    return render_template('contact.html')
