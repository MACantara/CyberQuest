from datetime import datetime, timedelta
import secrets
from typing import Optional, Dict, Any
from app.database import get_supabase, Tables, handle_supabase_error, DatabaseError

def parse_datetime_naive(dt_string: str) -> datetime:
    """Parse datetime string and ensure it's timezone-naive."""
    if not dt_string:
        return None
    
    # Remove various timezone indicators to make it timezone-naive
    dt_str = dt_string.replace('Z', '').replace('+00:00', '')
    
    # Handle fromisoformat parsing
    try:
        dt = datetime.fromisoformat(dt_str)
        # If it somehow still has timezone info, remove it
        if dt.tzinfo is not None:
            dt = dt.replace(tzinfo=None)
        return dt
    except ValueError:
        # Fallback: try parsing without microseconds
        if '.' in dt_str:
            dt_str = dt_str.split('.')[0]
        return datetime.fromisoformat(dt_str)

class EmailVerification:
    def __init__(self, data: Dict[str, Any]):
        """Initialize EmailVerification from Supabase data."""
        self.id = data.get('id')
        self.user_id = data.get('user_id')
        self.email = data.get('email')
        self.token = data.get('token')
        self.created_at = data.get('created_at')
        self.expires_at = data.get('expires_at')
        self.verified_at = data.get('verified_at')
        self.is_verified = data.get('is_verified', False)
        
        # Convert string timestamps to datetime objects if needed
        if isinstance(self.created_at, str):
            self.created_at = parse_datetime_naive(self.created_at)
        if isinstance(self.expires_at, str):
            self.expires_at = parse_datetime_naive(self.expires_at)
        if isinstance(self.verified_at, str):
            self.verified_at = parse_datetime_naive(self.verified_at)
    
    def save(self):
        """Save email verification to database."""
        supabase = get_supabase()
        try:
            verification_data = {
                'user_id': self.user_id,
                'email': self.email,
                'token': self.token,
                'created_at': self.created_at.isoformat() if self.created_at else None,
                'expires_at': self.expires_at.isoformat() if self.expires_at else None,
                'verified_at': self.verified_at.isoformat() if self.verified_at else None,
                'is_verified': self.is_verified
            }
            
            if self.id:
                # Update existing verification
                response = supabase.table(Tables.EMAIL_VERIFICATIONS).update(verification_data).eq('id', self.id).execute()
                handle_supabase_error(response)
            else:
                # Create new verification
                response = supabase.table(Tables.EMAIL_VERIFICATIONS).insert(verification_data).execute()
                data = handle_supabase_error(response)
                if data and len(data) > 0:
                    self.id = data[0]['id']
        except Exception as e:
            raise DatabaseError(f"Failed to save email verification: {e}")
    
    def __repr__(self):
        return f'<EmailVerification {self.email} for user {self.user_id}>'
    
    def is_expired(self):
        """Check if the verification token has expired."""
        return datetime.utcnow() > self.expires_at
    
    def verify(self):
        """Mark this email as verified."""
        self.is_verified = True
        self.verified_at = datetime.utcnow()
        self.save()
    
    @classmethod
    def create_verification(cls, user_id: int, email: str) -> 'EmailVerification':
        """Create a new email verification entry."""
        supabase = get_supabase()
        try:
            # Remove any existing unverified tokens for this user/email combo
            supabase.table(Tables.EMAIL_VERIFICATIONS).delete().eq('user_id', user_id).eq('email', email).eq('is_verified', False).execute()
            
            verification_data = {
                'user_id': user_id,
                'email': email,
                'token': secrets.token_urlsafe(32),
                'created_at': datetime.utcnow(),
                'expires_at': datetime.utcnow() + timedelta(hours=24),  # 24 hour expiration
                'verified_at': None,
                'is_verified': False
            }
            
            verification = cls(verification_data)
            verification.save()
            return verification
        except Exception as e:
            raise DatabaseError(f"Failed to create verification: {e}")
    
    @classmethod
    def get_by_token(cls, token: str) -> Optional['EmailVerification']:
        """Get verification entry by token."""
        supabase = get_supabase()
        try:
            response = supabase.table(Tables.EMAIL_VERIFICATIONS).select("*").eq('token', token).execute()
            data = handle_supabase_error(response)
            if data and len(data) > 0:
                return cls(data[0])
            return None
        except Exception as e:
            raise DatabaseError(f"Failed to get verification by token: {e}")
    
    @classmethod
    def is_email_verified(cls, user_id: int, email: str) -> bool:
        """Check if a specific email for a user is verified."""
        supabase = get_supabase()
        try:
            response = supabase.table(Tables.EMAIL_VERIFICATIONS).select("*").eq('user_id', user_id).eq('email', email).eq('is_verified', True).execute()
            data = handle_supabase_error(response)
            return len(data) > 0
        except Exception as e:
            raise DatabaseError(f"Failed to check email verification: {e}")
    
    @classmethod
    def cleanup_expired_tokens(cls, days_old: int = 7) -> int:
        """Clean up expired verification tokens."""
        supabase = get_supabase()
        try:
            cutoff_date = (datetime.utcnow() - timedelta(days=days_old)).isoformat()
            response = supabase.table(Tables.EMAIL_VERIFICATIONS).delete().lt('expires_at', cutoff_date).eq('is_verified', False).execute()
            data = handle_supabase_error(response)
            return len(data) if data else 0
        except Exception as e:
            raise DatabaseError(f"Failed to cleanup expired tokens: {e}")
    
    @classmethod
    def count_verified_emails(cls) -> int:
        """Count verified emails."""
        supabase = get_supabase()
        try:
            response = supabase.table(Tables.EMAIL_VERIFICATIONS).select("*", count='exact').eq('is_verified', True).execute()
            return response.count if hasattr(response, 'count') else 0
        except Exception as e:
            raise DatabaseError(f"Failed to count verified emails: {e}")
    
    @classmethod
    def count_pending_verifications(cls) -> int:
        """Count pending verifications."""
        supabase = get_supabase()
        try:
            response = supabase.table(Tables.EMAIL_VERIFICATIONS).select("*", count='exact').eq('is_verified', False).execute()
            return response.count if hasattr(response, 'count') else 0
        except Exception as e:
            raise DatabaseError(f"Failed to count pending verifications: {e}")
