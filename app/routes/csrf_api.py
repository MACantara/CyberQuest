from flask import Blueprint, jsonify, request
from flask_wtf.csrf import generate_csrf

csrf_api_bp = Blueprint('csrf_api', __name__, url_prefix='/api')

@csrf_api_bp.route('/csrf-token', methods=['GET'])
def csrf_token():
    """
    Endpoint to get a fresh CSRF token
    Used by JavaScript to refresh tokens when needed
    """
    try:
        token = generate_csrf()
        return jsonify({
            'csrf_token': token,
            'status': 'success'
        })
    except Exception as e:
        return jsonify({
            'error': 'Failed to generate CSRF token',
            'status': 'error'
        }), 500

@csrf_api_bp.route('/health', methods=['GET'])
def health_check():
    """
    Simple health check endpoint
    """
    return jsonify({
        'status': 'healthy',
        'message': 'CyberQuest API is running'
    })
