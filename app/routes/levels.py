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
        'unlocked': False
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
        'unlocked': False
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
        'unlocked': False
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
        'unlocked': False
    }
]

def check_level_completion_status():
    """Check which levels are completed/unlocked based on localStorage simulation"""
    # In a real app, this would query the database
    # For demo purposes, we simulate checking localStorage data
    return {
        'level_1_completed': False,  # Level 1 available but not completed yet
        'level_2_unlocked': False,   # Unlocked when level 1 is completed
        'level_3_unlocked': False,
        'level_4_unlocked': False,
        'level_5_unlocked': False
    }

@levels_bp.route('/')
@login_required
def levels_overview():
    """Display all cybersecurity levels."""
    if current_app.config.get('DISABLE_DATABASE', False):
        # In demo mode, determine unlocked levels based on completion
        demo_levels = CYBERSECURITY_LEVELS.copy()
        completion_status = check_level_completion_status()
        
        # Level 1 is always unlocked
        demo_levels[0]['unlocked'] = True
        
        # Level 2 unlocked if Level 1 completed
        if completion_status.get('level_1_completed'):
            demo_levels[1]['unlocked'] = True
            
        # Additional levels unlocked based on completion
        if completion_status.get('level_2_unlocked'):
            demo_levels[2]['unlocked'] = True
            
        return render_template('levels/levels.html', levels=demo_levels)
    
    # TODO: In future, determine unlocked levels based on user progress from database
    user_levels = CYBERSECURITY_LEVELS.copy()
    
    # For now, unlock Level 2 if Level 1 is completed
    completion_status = check_level_completion_status()
    if completion_status.get('level_1_completed'):
        user_levels[1]['unlocked'] = True
    
    return render_template('levels/levels.html', levels=user_levels)

@levels_bp.route('/<int:level_id>')
@login_required  
def level_detail(level_id):
    """Display specific level details and start the level."""
    level = next((l for l in CYBERSECURITY_LEVELS if l['id'] == level_id), None)
    
    if not level:
        return render_template('404.html'), 404
    
    # Check level unlock status
    if not current_app.config.get('DISABLE_DATABASE', False):
        completion_status = check_level_completion_status()
        
        # Level 1 is always unlocked
        if level_id == 1:
            level['unlocked'] = True
        # Level 2 unlocked only if Level 1 completed
        elif level_id == 2:
            level['unlocked'] = completion_status.get('level_1_completed', False)
        # Other levels locked for now
        else:
            level['unlocked'] = False
    else:
        # Demo mode - only Level 1 unlocked initially
        level['unlocked'] = level_id == 1
    
    # Check if level is unlocked
    if not level['unlocked']:
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
    
    # Check level unlock status
    if not current_app.config.get('DISABLE_DATABASE', False):
        completion_status = check_level_completion_status()
        
        # Level 1 is always unlocked
        if level_id == 1:
            level['unlocked'] = True
        # Level 2 unlocked only if Level 1 completed
        elif level_id == 2:
            level['unlocked'] = completion_status.get('level_1_completed', False)
        # Other levels locked for now
        else:
            level['unlocked'] = False
    else:
        # Demo mode - only Level 1 unlocked initially
        level['unlocked'] = level_id == 1
    
    # Check if level is unlocked
    if not level['unlocked']:
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

@levels_bp.route('/api/complete/<int:level_id>', methods=['POST'])
@login_required
def complete_level(level_id):
    """API endpoint to mark a level as completed."""
    try:
        # In a real app, this would update the database
        # For demo purposes, we just return success
        
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