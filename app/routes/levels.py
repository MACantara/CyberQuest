from flask import Blueprint, render_template, current_app, flash, redirect, url_for, request, session
from flask_login import login_required
import json

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
        'unlocked': True,
        'coming_soon': False
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
        'unlocked': False,
        'coming_soon': False
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
        'unlocked': False,
        'coming_soon': False
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
        'unlocked': False,
        'coming_soon': False
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
        'unlocked': False,
        'coming_soon': True
    }
]

@levels_bp.route('/')
@login_required
def levels_overview():
    """Display all cybersecurity levels."""
    return render_template('levels/levels.html', levels=CYBERSECURITY_LEVELS)

@levels_bp.route('/<int:level_id>/start')
@login_required
def start_level(level_id):
    """Start the interactive simulation for a specific level."""
    level = next((l for l in CYBERSECURITY_LEVELS if l['id'] == level_id), None)
    
    if not level:
        flash('Level not found.', 'error')
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

@levels_bp.route('/api/complete/<int:level_id>', methods=['POST'])
@login_required
def complete_level(level_id):
    """API endpoint to mark a level as completed."""
    try:
        level = next((l for l in CYBERSECURITY_LEVELS if l['id'] == level_id), None)
        if not level:
            return {'success': False, 'error': 'Level not found'}, 404
        
        # Simulate marking level as completed
        completion_data = {
            'level_id': level_id,
            'completed': True,
            'timestamp': request.json.get('timestamp') if request.json else None,
            'score': request.json.get('score') if request.json else None
        }
        
        # Determine next unlocked level
        next_level_id = None
        if level_id == 1:
            next_level_id = 2  # Unlock Level 2 after completing Level 1
        elif level_id == 2:
            next_level_id = 3  # Unlock Level 3 after completing Level 2
        # etc.
        
        return {
            'success': True,
            'level_completed': level_id,
            'next_level_unlocked': next_level_id,
            'xp_earned': level['xp_reward']
        }
        
    except Exception as e:
        return {'success': False, 'error': str(e)}, 500