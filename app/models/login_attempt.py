from app import db
from datetime import datetime, timedelta
from sqlalchemy import Index
from flask import current_app

class LoginAttempt(db.Model):
    __tablename__ = 'login_attempts'
    
    id = db.Column(db.Integer, primary_key=True)
    ip_address = db.Column(db.String(45), nullable=False)  # Support IPv6
    username_or_email = db.Column(db.String(255), nullable=True)  # Optional: track what was attempted
    success = db.Column(db.Boolean, nullable=False, default=False)
    attempted_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    user_agent = db.Column(db.Text, nullable=True)  # Optional: track browser/device
    
    # Add index for performance
    __table_args__ = (
        Index('idx_ip_attempted_at', 'ip_address', 'attempted_at'),
        Index('idx_ip_success', 'ip_address', 'success'),
    )
    
    def __repr__(self):
        return f'<LoginAttempt {self.ip_address} at {self.attempted_at}>'
    
    @classmethod
    def get_failed_attempts_count(cls, ip_address, time_window_minutes=None):
        """Get count of failed login attempts for an IP within time window."""
        if time_window_minutes is None:
            time_window_minutes = current_app.config.get('LOGIN_LOCKOUT_MINUTES', 15)
        cutoff_time = datetime.utcnow() - timedelta(minutes=time_window_minutes)
        return cls.query.filter(
            cls.ip_address == ip_address,
            cls.success == False,
            cls.attempted_at >= cutoff_time
        ).count()
    
    @classmethod
    def is_ip_locked(cls, ip_address, max_attempts=None, lockout_minutes=None):
        """Check if IP is locked out based on failed attempts."""
        if max_attempts is None:
            max_attempts = current_app.config.get('MAX_LOGIN_ATTEMPTS', 5)
        if lockout_minutes is None:
            lockout_minutes = current_app.config.get('LOGIN_LOCKOUT_MINUTES', 15)
        failed_count = cls.get_failed_attempts_count(ip_address, lockout_minutes)
        return failed_count >= max_attempts
    
    @classmethod
    def get_lockout_time_remaining(cls, ip_address, lockout_minutes=None):
        """Get remaining lockout time for an IP address."""
        if lockout_minutes is None:
            lockout_minutes = current_app.config.get('LOGIN_LOCKOUT_MINUTES', 15)
        cutoff_time = datetime.utcnow() - timedelta(minutes=lockout_minutes)
        last_failed = cls.query.filter(
            cls.ip_address == ip_address,
            cls.success == False,
            cls.attempted_at >= cutoff_time
        ).order_by(cls.attempted_at.desc()).first()
        
        if last_failed:
            unlock_time = last_failed.attempted_at + timedelta(minutes=lockout_minutes)
            if unlock_time > datetime.utcnow():
                return unlock_time - datetime.utcnow()
        return None
    
    @classmethod
    def record_attempt(cls, ip_address, username_or_email=None, success=False, user_agent=None):
        """Record a login attempt."""
        attempt = cls(
            ip_address=ip_address,
            username_or_email=username_or_email,
            success=success,
            user_agent=user_agent
        )
        db.session.add(attempt)
        db.session.commit()
        return attempt
    
    @classmethod
    def cleanup_old_attempts(cls, days_old=30):
        """Clean up old login attempts (for maintenance)."""
        cutoff_date = datetime.utcnow() - timedelta(days=days_old)
        old_attempts = cls.query.filter(cls.attempted_at < cutoff_date).delete()
        db.session.commit()
        return old_attempts
