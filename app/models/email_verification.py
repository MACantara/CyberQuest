from app import db
from datetime import datetime, timedelta
import secrets
from sqlalchemy import Index

class EmailVerification(db.Model):
    __tablename__ = 'email_verifications'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    token = db.Column(db.String(100), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=False)
    verified_at = db.Column(db.DateTime, nullable=True)
    is_verified = db.Column(db.Boolean, nullable=False, default=False)
    
    # Add indexes for performance
    __table_args__ = (
        Index('idx_token', 'token'),
        Index('idx_user_email', 'user_id', 'email'),
        Index('idx_expires_at', 'expires_at'),
    )
    
    # Relationship
    user = db.relationship('User', backref=db.backref('email_verifications', lazy=True))
    
    def __init__(self, user_id, email, **kwargs):
        super(EmailVerification, self).__init__(**kwargs)
        self.user_id = user_id
        self.email = email
        self.token = secrets.token_urlsafe(32)
        self.expires_at = datetime.utcnow() + timedelta(hours=24)  # 24 hour expiration
    
    def __repr__(self):
        return f'<EmailVerification {self.email} for user {self.user_id}>'
    
    def is_expired(self):
        """Check if the verification token has expired."""
        return datetime.utcnow() > self.expires_at
    
    def verify(self):
        """Mark this email as verified."""
        self.is_verified = True
        self.verified_at = datetime.utcnow()
        db.session.commit()
    
    @classmethod
    def create_verification(cls, user_id, email):
        """Create a new email verification entry."""
        # Remove any existing unverified tokens for this user/email combo
        existing = cls.query.filter_by(
            user_id=user_id, 
            email=email, 
            is_verified=False
        ).delete()
        
        verification = cls(user_id=user_id, email=email)
        db.session.add(verification)
        db.session.commit()
        return verification
    
    @classmethod
    def get_by_token(cls, token):
        """Get verification entry by token."""
        return cls.query.filter_by(token=token).first()
    
    @classmethod
    def is_email_verified(cls, user_id, email):
        """Check if a specific email for a user is verified."""
        verification = cls.query.filter_by(
            user_id=user_id,
            email=email,
            is_verified=True
        ).first()
        return verification is not None
    
    @classmethod
    def cleanup_expired_tokens(cls, days_old=7):
        """Clean up expired verification tokens."""
        cutoff_date = datetime.utcnow() - timedelta(days=days_old)
        expired_tokens = cls.query.filter(
            cls.expires_at < cutoff_date,
            cls.is_verified == False
        ).delete()
        db.session.commit()
        return expired_tokens
