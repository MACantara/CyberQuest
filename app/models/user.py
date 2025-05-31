from app import db
from datetime import datetime
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, HashingError
import secrets

ph = PasswordHasher()

class User(db.Model):
    __tablename__ = 'users'  # Add explicit table name to match foreign key reference
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    is_admin = db.Column(db.Boolean, default=False, nullable=False)
    
    # Relationship with password reset tokens
    password_reset_tokens = db.relationship('PasswordResetToken', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    
    def set_password(self, password):
        """Hash and set password using Argon2."""
        try:
            self.password_hash = ph.hash(password)
        except HashingError:
            raise ValueError("Error hashing password")
    
    def check_password(self, password):
        """Verify password against stored hash."""
        try:
            ph.verify(self.password_hash, password)
            return True
        except VerifyMismatchError:
            return False
    
    def update_last_login(self):
        """Update last login timestamp."""
        self.last_login = datetime.utcnow()
        db.session.commit()
    
    def generate_reset_token(self):
        """Generate a password reset token."""
        # Deactivate any existing tokens
        for token in self.password_reset_tokens:
            token.is_active = False
        
        # Create new token
        reset_token = PasswordResetToken(user_id=self.id)
        db.session.add(reset_token)
        db.session.commit()
        return reset_token.token
    
    def __repr__(self):
        return f'<User {self.username}>'

class PasswordResetToken(db.Model):
    __tablename__ = 'password_reset_tokens'  # Add explicit table name for consistency
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # Update foreign key reference
    token = db.Column(db.String(255), unique=True, nullable=False, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    used_at = db.Column(db.DateTime)
    
    def __init__(self, user_id):
        self.user_id = user_id
        self.token = secrets.token_urlsafe(32)
        self.created_at = datetime.utcnow()
        # Token expires in 1 hour
        from datetime import timedelta
        self.expires_at = self.created_at + timedelta(hours=1)
    
    def is_valid(self):
        """Check if token is valid (active and not expired)."""
        return (self.is_active and 
                not self.used_at and 
                datetime.utcnow() < self.expires_at)
    
    def use_token(self):
        """Mark token as used."""
        self.used_at = datetime.utcnow()
        self.is_active = False
        db.session.commit()
    
    @staticmethod
    def find_valid_token(token):
        """Find a valid token by token string."""
        reset_token = PasswordResetToken.query.filter_by(token=token).first()
        if reset_token and reset_token.is_valid():
            return reset_token
        return None
    
    def __repr__(self):
        return f'<PasswordResetToken {self.token[:8]}...>'
