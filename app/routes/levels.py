from flask import Blueprint, render_template, current_app, flash, redirect, url_for, request, jsonify
from flask_login import login_required, current_user
import json
import requests
from urllib.parse import urlparse

levels_bp = Blueprint('levels', __name__, url_prefix='/levels')

# Define all levels with their metadata
CYBERSECURITY_LEVELS = [
    {
        'id': 1,
        'name': 'The Misinformation Maze',
        'description': 'Debunk fake news and stop misinformation from influencing an election.',
        'difficulty': 'Beginner',
        'xp_reward': 100,
        'icon': 'bi-newspaper',
        'category': 'Information Literacy',
        'estimated_time': '15 minutes',
        'skills': ['Critical Thinking', 'Source Verification', 'Fact Checking'],
        'unlocked': True
    },
    {
        'id': 2,
        'name': 'Shadow in the Inbox',
        'description': 'Spot phishing attempts and practice safe email protocols.',
        'difficulty': 'Beginner',
        'xp_reward': 150,
        'icon': 'bi-envelope-exclamation',
        'category': 'Email Security',
        'estimated_time': '20 minutes',
        'skills': ['Phishing Detection', 'Email Analysis', 'Social Engineering'],
        'unlocked': True
    },
    {
        'id': 3,
        'name': 'Malware Mayhem',
        'description': 'Isolate infections and perform digital cleanup during a gaming tournament.',
        'difficulty': 'Intermediate',
        'xp_reward': 200,
        'icon': 'bi-bug',
        'category': 'Threat Detection',
        'estimated_time': '25 minutes',
        'skills': ['Malware Recognition', 'System Security', 'Threat Analysis'],
        'unlocked': True
    },
    {
        'id': 4,
        'name': 'The White Hat Test',
        'description': 'Practice ethical hacking and responsible vulnerability disclosure.',
        'difficulty': 'Expert',
        'xp_reward': 350,
        'icon': 'bi-terminal',
        'category': 'Ethical Hacking',
        'estimated_time': '30 minutes',
        'skills': ['Penetration Testing', 'Vulnerability Assessment', 'Ethical Hacking'],
        'unlocked': True
    },
    {
        'id': 5,
        'name': 'The Hunt for The Null',
        'description': 'Final mission: Use advanced digital forensics to expose The Null\'s identity.',
        'difficulty': 'Master',
        'xp_reward': 500,
        'icon': 'bi-trophy',
        'category': 'Digital Forensics',
        'estimated_time': '40 minutes',
        'skills': ['Digital Forensics', 'Evidence Analysis', 'Advanced Investigation'],
        'unlocked': True
    }
]

@levels_bp.route('/')
@login_required
def levels_overview():
    """Display all cybersecurity levels."""
    if current_app.config.get('DISABLE_DATABASE', False):
        # In demo mode, unlock first 3 levels
        demo_levels = CYBERSECURITY_LEVELS.copy()
        for i, level in enumerate(demo_levels):
            if i < 3:
                level['unlocked'] = True
        return render_template('levels/levels.html', levels=demo_levels)
    
    # TODO: In future, determine unlocked levels based on user progress
    # For now, only first level is unlocked for authenticated users
    user_levels = CYBERSECURITY_LEVELS.copy()
    
    return render_template('levels/levels.html', levels=user_levels)

@levels_bp.route('/<int:level_id>')
@login_required  
def level_detail(level_id):
    """Display specific level details and start the level."""
    level = next((l for l in CYBERSECURITY_LEVELS if l['id'] == level_id), None)
    
    if not level:
        return render_template('404.html'), 404
    
    # Check if level is unlocked
    if not level['unlocked'] and not current_app.config.get('DISABLE_DATABASE', False):
        return render_template('levels/level-locked.html', level=level)
    
    return render_template('levels/level-detail.html', level=level)

@levels_bp.route('/<int:level_id>/start')
@login_required
def start_level(level_id):
    """Start the interactive simulation for a specific level."""
    level = next((l for l in CYBERSECURITY_LEVELS if l['id'] == level_id), None)
    
    if not level:
        flash('Level not found.', 'error')
        return redirect(url_for('levels.levels_overview'))
    
    # Check if level is unlocked
    if not level['unlocked'] and not current_app.config.get('DISABLE_DATABASE', False):
        flash('This level is locked. Complete previous levels to unlock it.', 'warning')
        return redirect(url_for('levels.levels_overview'))
    
    # Prepare level data for simulation
    level_data = {
        'id': level['id'],
        'name': level['name'],
        'description': level['description'],
        'category': level['category'],
        'difficulty': level['difficulty'],
        'skills': level['skills']
    }
    
    # Convert level data to JSON string for direct JavaScript usage
    level_json = json.dumps(level_data, default=str)
    
    return render_template('simulated-pc/simulation.html', 
                         level=level, 
                         level_data=level_data,
                         level_json=level_json)

@levels_bp.route('/fetch-website')
def fetch_website():
    """Fetch and display HTML content from external websites."""
    url = request.args.get('url')
    
    if not url:
        return jsonify({'error': 'URL parameter is required'}), 400
    
    # Basic URL validation
    try:
        parsed_url = urlparse(url)
        if not parsed_url.scheme or not parsed_url.netloc:
            return jsonify({'error': 'Invalid URL format'}), 400
    except Exception:
        return jsonify({'error': 'Invalid URL format'}), 400
    
    try:
        # Fetch the website with timeout and headers
        headers = {
            'User-Agent': 'CyberQuest-WebFetcher/1.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
        
        response = requests.get(
            url, 
            headers=headers, 
            timeout=10,  # 10 second timeout
            allow_redirects=True,
            verify=True  # Verify SSL certificates
        )
        
        # Check if request was successful
        response.raise_for_status()
        
        html_content = response.text
        
        # Return both raw HTML and metadata
        return jsonify({
            'success': True,
            'html': html_content,
            'status_code': response.status_code,
            'headers': dict(response.headers),
            'url': response.url,  # Final URL after redirects
            'encoding': response.encoding
        })
        
    except requests.exceptions.Timeout:
        return jsonify({'error': 'Request timeout - website took too long to respond'}), 408
    
    except requests.exceptions.ConnectionError:
        return jsonify({'error': 'Connection error - could not reach the website'}), 503
    
    except requests.exceptions.HTTPError as e:
        return jsonify({
            'error': f'HTTP error: {e.response.status_code}',
            'status_code': e.response.status_code
        }), e.response.status_code
    
    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'Request failed: {str(e)}'}), 500
    
    except Exception as e:
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500

@levels_bp.route('/fetch-website-display')
def fetch_website_display():
    """Fetch and display website in an HTML page (for direct viewing)."""
    url = request.args.get('url')
    
    if not url:
        return render_template('error.html', 
                             error_title='Missing URL', 
                             error_message='Please provide a URL parameter.'), 400
    
    # Use the same fetching logic as the API endpoint
    try:
        # Basic URL validation
        parsed_url = urlparse(url)
        if not parsed_url.scheme or not parsed_url.netloc:
            return render_template('error.html', 
                                 error_title='Invalid URL', 
                                 error_message='The provided URL is not valid.'), 400
        
        # Fetch the website
        headers = {
            'User-Agent': 'CyberQuest-WebFetcher/1.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
        
        response = requests.get(
            url, 
            headers=headers, 
            timeout=10,
            allow_redirects=True,
            verify=True
        )
        
        response.raise_for_status()
        
        # Return the HTML content directly
        return response.text, 200, {'Content-Type': 'text/html; charset=utf-8'}
        
    except Exception as e:
        return render_template('error.html', 
                             error_title='Fetch Error', 
                             error_message=f'Could not fetch website: {str(e)}'), 500
