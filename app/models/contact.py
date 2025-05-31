from app import db
from datetime import datetime

class Contact(db.Model):
    """Contact form submission model."""
    __tablename__ = 'contact_submissions'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_read = db.Column(db.Boolean, default=False)
    
    def __repr__(self):
        return f'<Contact {self.name} - {self.subject}>'

    def mark_as_read(self):
        """Mark the contact submission as read."""
        self.is_read = True
        db.session.commit()
    
    def to_dict(self):
        """Convert contact submission to dictionary."""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'subject': self.subject,
            'message': self.message,
            'created_at': self.created_at.isoformat(),
            'is_read': self.is_read
        }
    
    @classmethod
    def get_unread_count(cls):
        """Get count of unread contact submissions."""
        return cls.query.filter_by(is_read=False).count()
    
    @classmethod
    def get_recent_submissions(cls, limit=10):
        """Get recent contact submissions."""
        return cls.query.order_by(cls.created_at.desc()).limit(limit).all()
