from flask import Blueprint, jsonify, request, current_app
from flask_login import current_user, login_required
import time
from urllib.parse import quote

api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route('/auth/status', methods=['GET'])
def auth_status():
    """Check current authentication status."""
    try:
        # Check if request is AJAX
        if not request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return jsonify({'error': 'Invalid request'}), 400
        
        is_authenticated = current_user.is_authenticated
        
        response_data = {
            'authenticated': is_authenticated,
            'timestamp': int(time.time()) if is_authenticated else None
        }
        
        if is_authenticated:
            response_data.update({
                'user_id': current_user.id,
                'username': current_user.username,
                'is_admin': getattr(current_user, 'is_admin', False)
            })
        
        return jsonify(response_data)
        
    except Exception as e:
        current_app.logger.error(f"Auth status check error: {e}")
        return jsonify({'authenticated': False, 'error': 'Check failed'}), 500

@api_bp.route('/auth/heartbeat', methods=['POST'])
@login_required
def auth_heartbeat():
    """Maintain session activity."""
    try:
        return jsonify({
            'authenticated': True,
            'timestamp': int(time.time()),
            'user_id': current_user.id
        })
    except Exception as e:
        current_app.logger.error(f"Auth heartbeat error: {e}")
        return jsonify({'authenticated': False}), 401

@api_bp.route('/auth/expired', methods=['POST'])
def auth_expired():
    """Handle authentication expiration with flash message."""
    try:
        data = request.get_json()
        page_url = data.get('page_url', '')
        
        # Check if request is AJAX
        if not request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return jsonify({'error': 'Invalid request'}), 400
        
        # Return redirect URL without flash message - let the login route handle it
        return jsonify({
            'authenticated': False,
            'expired': True,
            'redirect_url': f"/auth/login?next={quote(page_url)}&auth_expired=true"
        })
        
    except Exception as e:
        current_app.logger.error(f"Auth expired handler error: {e}")
        return jsonify({'authenticated': False, 'error': 'Session expired'}), 401
