from flask import Blueprint, render_template, current_app
from flask_login import login_required, current_user

levels_bp = Blueprint('levels', __name__, url_prefix='/levels')

# Define all levels with their metadata
CYBERSECURITY_LEVELS = [
    {
        'id': 1,
        'name': 'The Misinformation Maze',
        'description': 'Navigate through a web of fake news and learn to identify reliable sources.',
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
        'description': 'Detect phishing emails and social engineering attacks hiding in your inbox.',
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
        'description': 'Identify and neutralize various types of malicious software threats.',
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
        'name': 'The Password Heist',
        'description': 'Master password security and multi-factor authentication techniques.',
        'difficulty': 'Intermediate',
        'xp_reward': 175,
        'icon': 'bi-key',
        'category': 'Authentication',
        'estimated_time': '30 minutes',
        'skills': ['Password Security', 'MFA Setup', 'Access Control'],
        'unlocked': False
    },
    {
        'id': 5,
        'name': 'The Social Web',
        'description': 'Protect your privacy and identity across social media platforms.',
        'difficulty': 'Intermediate',
        'xp_reward': 180,
        'icon': 'bi-people',
        'category': 'Privacy Protection',
        'estimated_time': '25 minutes',
        'skills': ['Privacy Settings', 'Social Engineering Defense', 'Digital Footprint'],
        'unlocked': False
    },
    {
        'id': 6,
        'name': 'Digital Gold Rush',
        'description': 'Secure your financial data and learn about cryptocurrency safety.',
        'difficulty': 'Advanced',
        'xp_reward': 250,
        'icon': 'bi-credit-card-2-front',
        'category': 'Financial Security',
        'estimated_time': '35 minutes',
        'skills': ['Financial Protection', 'Crypto Security', 'Banking Safety'],
        'unlocked': False
    },
    {
        'id': 7,
        'name': 'The Adaptive Adversary',
        'description': 'Face AI-powered threats and learn advanced defense strategies.',
        'difficulty': 'Advanced',
        'xp_reward': 300,
        'icon': 'bi-robot',
        'category': 'AI Security',
        'estimated_time': '40 minutes',
        'skills': ['AI Threat Recognition', 'Advanced Defense', 'Adaptive Security'],
        'unlocked': False
    },
    {
        'id': 8,
        'name': 'The White Hat Test',
        'description': 'Learn ethical hacking fundamentals and penetration testing basics.',
        'difficulty': 'Expert',
        'xp_reward': 350,
        'icon': 'bi-terminal',
        'category': 'Ethical Hacking',
        'estimated_time': '45 minutes',
        'skills': ['Penetration Testing', 'Vulnerability Assessment', 'Ethical Hacking'],
        'unlocked': False
    },
    {
        'id': 9,
        'name': 'Operation Blackout',
        'description': 'Respond to a coordinated cyberattack and minimize damage.',
        'difficulty': 'Expert',
        'xp_reward': 400,
        'icon': 'bi-shield-exclamation',
        'category': 'Incident Response',
        'estimated_time': '50 minutes',
        'skills': ['Incident Response', 'Crisis Management', 'Damage Control'],
        'unlocked': False
    },
    {
        'id': 10,
        'name': 'The Hunt for The Null',
        'description': 'Ultimate challenge combining all cybersecurity skills in a complex scenario.',
        'difficulty': 'Master',
        'xp_reward': 500,
        'icon': 'bi-trophy',
        'category': 'Ultimate Challenge',
        'estimated_time': '60 minutes',
        'skills': ['Advanced Analysis', 'Complete Security Mastery', 'Strategic Thinking'],
        'unlocked': False
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
