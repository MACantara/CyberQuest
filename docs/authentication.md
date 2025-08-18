# Authentication System Documentation

This template includes a complete user authentication system with advanced security features and email verification.

## 🔐 Core Authentication Features

### User Registration
- **Secure Signup**: Username and email-based registration
- **Email Verification**: Mandatory email verification before account activation
- **Password Security**: Argon2 password hashing for maximum security
- **Input Validation**: Comprehensive form validation and sanitization
- **Duplicate Prevention**: Prevents duplicate usernames and emails

### User Login
- **Flexible Login**: Login with username or email address
- **Remember Me**: Optional persistent login sessions
- **Session Management**: Secure session handling with configurable timeouts
- **Real-time Feedback**: Immediate feedback on login attempts
- **Graceful Handling**: User-friendly error messages and guidance

### Email Verification System
- **Mandatory Verification**: Users must verify email before accessing the system
- **Secure Tokens**: Time-limited verification tokens (24-hour expiration)
- **Verification Pending Page**: Dedicated page with clear instructions
- **Resend Functionality**: Easy verification email resending
- **Auto-refresh Checking**: Automatic verification status checking
- **Login Attempt Blocking**: Prevents login until email is verified

## 🔑 Password Management

### Password Reset
- **Email-based Reset**: Secure password reset via email
- **Secure Tokens**: Time-limited reset tokens (1-hour expiration)
- **Token Validation**: Comprehensive token validation and security checks
- **User Guidance**: Clear instructions and feedback throughout the process

### Password Security
- **Argon2 Hashing**: Industry-standard password hashing algorithm
- **Salt Generation**: Automatic salt generation for each password
- **Password Strength**: Configurable password complexity requirements
- **Secure Storage**: No plain text password storage

## 🛡️ Advanced Security Features

### Account Lockout System
- **IP-based Protection**: Tracks failed attempts by IP address
- **Configurable Limits**: Customizable maximum login attempts (default: 5)
- **Lockout Duration**: Configurable lockout time (default: 15 minutes)
- **Real-time Feedback**: Shows remaining attempts and lockout countdown
- **Automatic Recovery**: Accounts unlock automatically after timeout
- **Bypass Prevention**: IP-based tracking prevents account switching circumvention

### Security Monitoring
- **Login Attempt Logging**: Comprehensive logging of all login attempts
- **User Agent Tracking**: Records browser/device information
- **IP Address Logging**: Tracks login sources for security analysis
- **Geographic Tracking**: Optional IP-based location tracking
- **Failed Attempt Analysis**: Detailed analysis of failed login patterns

### Session Security
- **HTTPOnly Cookies**: Prevents XSS attacks on session cookies
- **SameSite Protection**: CSRF protection via SameSite cookie attributes
- **Secure Cookies**: HTTPS-only cookie transmission in production
- **Session Rotation**: Automatic session ID rotation on login
- **Configurable Timeouts**: Customizable session expiration times

## 📧 Email Verification Details

### Verification Flow
1. **User Registration**: User completes registration form
2. **Account Creation**: Account created but marked as unverified
3. **Email Sent**: Verification email sent to registered address
4. **Verification Pending**: User redirected to verification pending page
5. **Email Verification**: User clicks link in email to verify
6. **Account Activation**: Account marked as verified and fully activated
7. **Login Access**: User can now log in normally

### Verification Pending Page Features
- **Dynamic Content**: Different content for registration vs login attempts
- **Clear Instructions**: Step-by-step verification process
- **Email Information**: Shows the email address that needs verification
- **Resend Functionality**: Easy verification email resending
- **Auto-refresh**: Automatic checking for verification completion
- **Navigation Options**: Clear paths to login or home page

### Email Templates
- **HTML Templates**: Rich HTML email templates for better presentation
- **Plain Text Fallback**: Plain text versions for compatibility
- **Branded Design**: Consistent branding with the main application
- **Clear CTAs**: Prominent verification links and buttons

## 🔒 Security Implementation Details

### Password Hashing
```python
# Argon2 configuration
ARGON2_TIME_COST = 2
ARGON2_MEMORY_COST = 65536
ARGON2_PARALLELISM = 1
ARGON2_HASH_LENGTH = 32
ARGON2_SALT_LENGTH = 16
```

### Session Configuration
```python
# Session security settings
SESSION_COOKIE_SECURE = True  # HTTPS only
SESSION_COOKIE_HTTPONLY = True  # No JS access
SESSION_COOKIE_SAMESITE = 'Lax'  # CSRF protection
PERMANENT_SESSION_LIFETIME = timedelta(days=30)
```

### Account Lockout Configuration
```python
# Lockout settings
MAX_LOGIN_ATTEMPTS = 5
LOGIN_LOCKOUT_MINUTES = 15
LOCKOUT_CLEANUP_DAYS = 30
```

## 📧 Email Configuration

### SMTP Settings
```bash
# Gmail SMTP (recommended)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

### Email Templates Location
- `app/templates/emails/verification_email.html`
- `app/templates/emails/verification_email.txt`
- `app/templates/emails/password_reset.html`
- `app/templates/emails/password_reset.txt`

## 🚀 Setup Instructions

### 1. Environment Variables
```bash
# Authentication settings
MAX_LOGIN_ATTEMPTS=5
LOGIN_LOCKOUT_MINUTES=15
PERMANENT_SESSION_LIFETIME=2592000

# Email settings
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

### 2. Database Migration
```bash
flask db migrate -m "Add authentication tables"
flask db upgrade
```

### 3. Create Admin User
```python
from app import create_app, db
from app.models.user import User

app = create_app()
with app.app_context():
    admin = User(username='admin', email='admin@example.com')
    admin.set_password('admin123')
    admin.is_admin = True
    admin.email_verified = True
    db.session.add(admin)
    db.session.commit()
```

## 🔧 Usage Examples

### Check Authentication in Templates
```html
{% if session.user_id %}
    <!-- Authenticated user content -->
    <p>Welcome, {{ session.username }}!</p>
{% else %}
    <!-- Anonymous user content -->
    <a href="{{ url_for('auth.login') }}">Login</a>
{% endif %}
```

### Protect Routes
```python
from app.routes.auth import login_required

@app.route('/protected')
@login_required
def protected_route():
    return render_template('protected.html')
```

### Monitor Login Attempts
```python
from app.models.login_attempt import LoginAttempt

# Check if IP is locked
is_locked = LoginAttempt.is_ip_locked('192.168.1.1')

# Get failed attempt count
failed_count = LoginAttempt.get_failed_attempts_count('192.168.1.1')
```

## 🚨 Security Considerations

### Production Deployment
1. **HTTPS Required**: Always use HTTPS in production
2. **Secure Cookies**: Enable secure cookie settings
3. **Email Security**: Use app-specific passwords for Gmail
4. **Database Security**: Use proper database credentials
5. **Environment Variables**: Never commit sensitive data to version control

### Regular Maintenance
1. **Log Monitoring**: Regularly review authentication logs
2. **Failed Attempt Analysis**: Monitor for brute force attacks
3. **User Account Audits**: Regular review of user accounts
4. **Security Updates**: Keep dependencies updated
5. **Backup Strategy**: Regular backup of user data
