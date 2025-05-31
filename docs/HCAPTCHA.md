# hCaptcha Integration Documentation

This template includes hCaptcha integration for enhanced security against bots and automated attacks.

## 🛡️ hCaptcha Features

### Security Protection
- **Bot Prevention**: Protects forms from automated bot submissions
- **Privacy-Focused**: Privacy-respecting alternative to reCAPTCHA
- **GDPR Compliant**: Fully compliant with GDPR and privacy regulations
- **Accessibility**: Better accessibility support than alternatives
- **Performance**: Lightweight and fast loading

### Integration Points
- **Contact Form**: Protects contact form submissions
- **User Registration**: Prevents automated account creation
- **Password Reset**: Protects password reset requests
- **Login Form**: Optional protection for login attempts
- **Admin Actions**: Protects sensitive admin operations

## 🔧 Setup Instructions

### 1. Create hCaptcha Account
1. Visit [hCaptcha.com](https://www.hcaptcha.com/)
2. Sign up for a free account
3. Create a new site configuration
4. Note your Site Key and Secret Key

### 2. Environment Configuration
Add these variables to your `.env` file:

```bash
# hCaptcha Configuration
HCAPTCHA_SITE_KEY=your-site-key-here
HCAPTCHA_SECRET_KEY=your-secret-key-here
HCAPTCHA_ENABLED=true
```

### 3. Development vs Production
```bash
# Development (disable hCaptcha for testing)
HCAPTCHA_ENABLED=false

# Production (enable hCaptcha)
HCAPTCHA_ENABLED=true
```

## 💻 Implementation Details

### Backend Verification
The `app/utils/hcaptcha_utils.py` module handles server-side verification:

```python
import requests
import os

def verify_hcaptcha(token, user_ip=None):
    """
    Verify hCaptcha token with hCaptcha servers
    
    Args:
        token (str): hCaptcha response token
        user_ip (str): User's IP address (optional)
    
    Returns:
        bool: True if verification successful, False otherwise
    """
    if not os.getenv('HCAPTCHA_ENABLED', 'false').lower() == 'true':
        return True  # Skip verification if disabled
    
    secret_key = os.getenv('HCAPTCHA_SECRET_KEY')
    if not secret_key:
        return False
    
    data = {
        'secret': secret_key,
        'response': token
    }
    
    if user_ip:
        data['remoteip'] = user_ip
    
    try:
        response = requests.post(
            'https://hcaptcha.com/siteverify',
            data=data,
            timeout=10
        )
        result = response.json()
        return result.get('success', False)
    except:
        return False  # Fail closed for security
```

### Frontend Integration
hCaptcha is integrated into forms using JavaScript:

```html
<!-- Include hCaptcha script -->
<script src="https://js.hcaptcha.com/1/api.js" async defer></script>

<!-- hCaptcha widget -->
<div class="h-captcha" 
     data-sitekey="{{ config.HCAPTCHA_SITE_KEY }}"
     data-theme="auto"
     data-size="normal">
</div>
```

### Form Integration Example
```html
<!-- Contact form with hCaptcha -->
<form method="POST" id="contact-form">
    <!-- Form fields -->
    <input type="text" name="name" required>
    <input type="email" name="email" required>
    <textarea name="message" required></textarea>
    
    <!-- hCaptcha widget -->
    {% if config.HCAPTCHA_ENABLED %}
    <div class="h-captcha" 
         data-sitekey="{{ config.HCAPTCHA_SITE_KEY }}"
         data-theme="auto">
    </div>
    {% endif %}
    
    <button type="submit">Send Message</button>
</form>
```

## 🎨 Styling and Themes

### Theme Options
hCaptcha supports automatic theme detection:

```html
<!-- Auto theme (follows system preference) -->
<div class="h-captcha" data-theme="auto"></div>

<!-- Light theme -->
<div class="h-captcha" data-theme="light"></div>

<!-- Dark theme -->
<div class="h-captcha" data-theme="dark"></div>
```

### Size Options
```html
<!-- Normal size (default) -->
<div class="h-captcha" data-size="normal"></div>

<!-- Compact size -->
<div class="h-captcha" data-size="compact"></div>

<!-- Invisible (programmatic) -->
<div class="h-captcha" data-size="invisible"></div>
```

### Custom Styling
```css
/* Custom hCaptcha container styling */
.h-captcha {
    margin: 1rem 0;
    border-radius: 8px;
    overflow: hidden;
}

/* Dark mode adjustments */
.dark .h-captcha {
    filter: invert(1) hue-rotate(180deg);
}
```

## 🔒 Security Configuration

### Production Settings
```python
# config.py
class Config:
    HCAPTCHA_ENABLED = os.environ.get('HCAPTCHA_ENABLED', 'true').lower() == 'true'
    HCAPTCHA_SITE_KEY = os.environ.get('HCAPTCHA_SITE_KEY')
    HCAPTCHA_SECRET_KEY = os.environ.get('HCAPTCHA_SECRET_KEY')
    
    # Verification settings
    HCAPTCHA_TIMEOUT = 10  # seconds
    HCAPTCHA_FAIL_CLOSED = True  # Fail securely if service unavailable
```

### Error Handling
```python
def verify_hcaptcha_with_fallback(token, user_ip=None):
    """
    Verify hCaptcha with fallback handling
    """
    try:
        return verify_hcaptcha(token, user_ip)
    except requests.RequestException:
        # Log the error
        app.logger.error("hCaptcha verification failed due to network error")
        
        # Fail open or closed based on configuration
        return not current_app.config.get('HCAPTCHA_FAIL_CLOSED', True)
```

## 🚀 Usage in Routes

### Contact Form Protection
```python
@contact_bp.route('/contact', methods=['POST'])
def contact_submit():
    # Get hCaptcha token
    hcaptcha_token = request.form.get('h-captcha-response')
    
    # Verify hCaptcha
    if current_app.config.get('HCAPTCHA_ENABLED'):
        user_ip = request.environ.get('HTTP_X_FORWARDED_FOR', request.remote_addr)
        if not verify_hcaptcha(hcaptcha_token, user_ip):
            flash('Please complete the captcha verification.', 'error')
            return redirect(url_for('contact.contact'))
    
    # Process form submission
    # ...
```

### Registration Protection
```python
@auth_bp.route('/signup', methods=['POST'])
def signup():
    # Verify hCaptcha before processing registration
    if current_app.config.get('HCAPTCHA_ENABLED'):
        hcaptcha_token = request.form.get('h-captcha-response')
        user_ip = request.environ.get('HTTP_X_FORWARDED_FOR', request.remote_addr)
        
        if not verify_hcaptcha(hcaptcha_token, user_ip):
            flash('Captcha verification failed. Please try again.', 'error')
            return render_template('auth/signup.html')
    
    # Continue with registration
    # ...
```

## 📊 Monitoring and Analytics

### hCaptcha Dashboard
- **Verification Statistics**: Monitor captcha solve rates
- **Bot Detection**: Track blocked bot attempts
- **Geographic Data**: See where attempts are coming from
- **Performance Metrics**: Monitor response times and success rates

### Application Logging
```python
import logging

def log_hcaptcha_result(success, user_ip, user_agent):
    """Log hCaptcha verification results"""
    logger = logging.getLogger('hcaptcha')
    
    if success:
        logger.info(f"hCaptcha verification successful from {user_ip}")
    else:
        logger.warning(f"hCaptcha verification failed from {user_ip} - {user_agent}")
```

## 🔧 Troubleshooting

### Common Issues

1. **Captcha Not Loading**
   - Check site key configuration
   - Verify domain settings in hCaptcha dashboard
   - Check for JavaScript errors in browser console

2. **Verification Always Failing**
   - Verify secret key is correct
   - Check server-side verification implementation
   - Ensure proper error handling

3. **Theme Issues**
   - Use `data-theme="auto"` for automatic theme detection
   - Check CSS conflicts with site styles
   - Verify dark mode implementation

### Debug Mode
```python
# Enable debug logging for hCaptcha
import logging
logging.getLogger('hcaptcha').setLevel(logging.DEBUG)

def verify_hcaptcha_debug(token, user_ip=None):
    """Debug version with detailed logging"""
    logger = logging.getLogger('hcaptcha')
    logger.debug(f"Verifying token: {token[:20]}... from IP: {user_ip}")
    
    result = verify_hcaptcha(token, user_ip)
    logger.debug(f"Verification result: {result}")
    
    return result
```

## 🌟 Best Practices

### Security
1. **Always Verify Server-side**: Never rely only on client-side validation
2. **Fail Closed**: Default to rejection if verification service is unavailable
3. **Rate Limiting**: Combine with rate limiting for enhanced protection
4. **Log Verification Attempts**: Monitor for patterns and abuse

### User Experience
1. **Clear Instructions**: Provide clear guidance on captcha completion
2. **Error Handling**: Graceful error messages for failed verifications
3. **Accessibility**: Ensure captcha is accessible to all users
4. **Mobile Optimization**: Test on mobile devices for proper functionality

### Performance
1. **Async Loading**: Load hCaptcha script asynchronously
2. **Timeout Handling**: Set reasonable timeout values
3. **Caching**: Consider caching verification results temporarily
4. **Fallback Options**: Have fallback mechanisms for service outages
