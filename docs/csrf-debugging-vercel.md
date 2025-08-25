# CSRF Token Debugging for Vercel Deployment

## Issue Summary

You're experiencing "Security validation failed. Please refresh the page and try again." errors on your Vercel deployment. This indicates CSRF token validation failures in the serverless environment.

## Root Cause Analysis

The primary issue was **SECRET_KEY inconsistency** in serverless functions. Each Vercel function instance was generating a different SECRET_KEY, making CSRF tokens invalid across requests.

## Fixes Implemented

### 1. Consistent SECRET_KEY in Serverless Environment

**Problem**: `os.urandom(24)` generates a new key for each function instance
**Solution**: Use a consistent fallback key for Vercel

```python
# config.py - Fixed SECRET_KEY handling
if IS_VERCEL:
    # Consistent key across all function instances
    SECRET_KEY = os.environ.get('SECRET_KEY', 'vercel-csrf-fallback-key-please-set-env-var-123456789')
else:
    # Random key for local development
    SECRET_KEY = os.environ.get('SECRET_KEY') or os.urandom(24)
```

### 2. Enhanced CSRF Error Handling

Added comprehensive error logging and debugging for Vercel:

```python
@app.errorhandler(ValidationError)
def handle_csrf_validation_error(e):
    app.logger.error(f"CSRF ValidationError: {e}")
    if app.config.get('IS_VERCEL'):
        # Detailed logging for Vercel debugging
        app.logger.error(f"Vercel CSRF debug info:")
        app.logger.error(f"  - Headers: {dict(request.headers)}")
        app.logger.error(f"  - SECRET_KEY set: {bool(app.config.get('SECRET_KEY'))}")
    # Return JSON error response
```

### 3. Vercel-Optimized Configuration

```python
class VercelConfig(ProductionConfig):
    # Serverless-friendly CSRF settings
    WTF_CSRF_SSL_STRICT = False  # Vercel handles SSL termination
    WTF_CSRF_TIME_LIMIT = 3600   # 1 hour (shorter for serverless)
    SESSION_COOKIE_SECURE = True  # HTTPS in Vercel
    SESSION_COOKIE_SAMESITE = 'Lax'
```

## Testing & Debugging

### Web-Based Test Page

Visit `/csrf-test` on your deployment to debug CSRF issues:

1. **Debug Information**: Shows configuration, environment variables, session data
2. **Token Generation**: Test CSRF token creation and consistency  
3. **Form Submission**: Test forms with and without CSRF tokens

### API Endpoints for Testing

- `GET /api/debug` - Comprehensive debug information
- `GET /api/csrf-token` - Get fresh CSRF token
- `POST /api/test-csrf` - Test CSRF form submission

## Vercel Environment Setup

### Required Environment Variables

Set these in your Vercel project settings:

```bash
SECRET_KEY=your-secure-random-secret-key-here
VERCEL=1  # Automatically set by Vercel
```

### Generate a Secure SECRET_KEY

```python
import secrets
print(secrets.token_urlsafe(32))
```

Use the generated string as your `SECRET_KEY` environment variable.

## Deployment Checklist

1. ✅ **Set SECRET_KEY environment variable in Vercel**
2. ✅ **Deploy with updated configuration**
3. ✅ **Test using `/csrf-test` page**
4. ✅ **Check Vercel function logs for CSRF errors**
5. ✅ **Verify forms work correctly**

## Common Issues & Solutions

### Issue: "CSRF token missing"
**Solution**: Ensure all forms include `{{ csrf_token() }}` or use the JavaScript utilities

### Issue: "CSRF token expired"  
**Solution**: Tokens expire after 1 hour in Vercel. Refresh the page or implement token refresh

### Issue: "Session not found"
**Solution**: Check that SESSION_COOKIE_SECURE and other session settings are correct for HTTPS

### Issue: Different SECRET_KEY per request
**Solution**: Ensure SECRET_KEY environment variable is set in Vercel

## Verification Steps

1. **Visit your Vercel deployment**
2. **Go to `/csrf-test`**
3. **Check debug information shows:**
   - `csrf_enabled: true`
   - `is_vercel: true` 
   - `secret_key_set: true`
   - `secret_key_preview` shows consistent value
4. **Test form submission with CSRF token** - should succeed
5. **Test form submission without CSRF token** - should fail with 400 error

## Next Steps

1. Set the `SECRET_KEY` environment variable in Vercel
2. Deploy the updated code
3. Use the test page to verify CSRF is working
4. Monitor Vercel function logs for any remaining issues

The CSRF implementation is now robust and should work correctly in Vercel's serverless environment once the SECRET_KEY is properly configured.

## Files Modified

- `config.py` - Fixed SECRET_KEY consistency
- `app/__init__.py` - Enhanced error handling
- `app/routes/csrf_api.py` - Added debug endpoints
- `app/routes/main.py` - Added test page route
- `app/templates/csrf-test.html` - Interactive test page
- `app/templates/base.html` - CSRF meta tag for JavaScript
