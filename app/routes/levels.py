# TODO: Add server-side tracking of level completion and XP

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
        'coming_soon': False
    }
]

def get_level_js_files(level_id):
    """Get the JavaScript files required for a specific level."""
    
    # Core files needed for all levels
    core_files = [
        'js/simulated-pc/boot-sequence.js',
        'js/simulated-pc/loading-screen.js',
        'js/simulated-pc/shutdown-sequence.js',
        'js/simulated-pc/desktop.js',
        'js/simulated-pc/main.js',
        'js/simulated-pc/adaptive-integration.js',
        'js/simulated-pc/adaptive-learning.js',
        
        # Core desktop components
        'js/simulated-pc/desktop-components/window-base.js',
        'js/simulated-pc/desktop-components/window-manager.js',
        'js/simulated-pc/desktop-components/window-resize-manager.js',
        'js/simulated-pc/desktop-components/window-snap-manager.js',
        'js/simulated-pc/desktop-components/activity-emitter-base.js',
        'js/simulated-pc/desktop-components/application-launcher.js',
        'js/simulated-pc/desktop-components/application-registry.js',
        'js/simulated-pc/desktop-components/desktop-icons.js',
        'js/simulated-pc/desktop-components/taskbar.js',
        'js/simulated-pc/desktop-components/shutdown-modal.js',
        'js/simulated-pc/desktop-components/skip-dialogue-modal.js',
        'js/simulated-pc/desktop-components/skip-tutorial-modal.js',
        
        # Shared utilities
        'js/simulated-pc/desktop-components/shared-utils/navigation-util.js',
        
        # Base dialogue and tutorial systems
        'js/simulated-pc/dialogues/base-dialogue.js',
        'js/simulated-pc/dialogues/dialogue-manager.js',
        'js/simulated-pc/dialogues/dialogue-integration.js',
        'js/simulated-pc/tutorials/base-tutorial.js',
        'js/simulated-pc/tutorials/tutorial-manager.js',
        'js/simulated-pc/tutorials/tutorial-registry.js',
        'js/simulated-pc/tutorials/tutorial-step-manager.js',
        'js/simulated-pc/tutorials/tutorial-interaction-manager.js',
        'js/simulated-pc/tutorials/adaptive-tutorial-manager.js',
        
        # Level management
        'js/simulated-pc/levels/level-manager.js',
    ]
    
    # Level-specific files
    level_specific_files = []
    
    if level_id == 1:
        # Level 1: The Misinformation Maze - News verification and browser-based tasks
        level_specific_files = [
            # Level 1 configuration and data
            'js/simulated-pc/levels/level-one/level-config.js',
            'js/simulated-pc/levels/level-one/apps/index.js',
            'js/simulated-pc/levels/level-one/data/index.js',
            
            # Level 1 dialogues
            'js/simulated-pc/levels/level-one/dialogues/index.js',
            'js/simulated-pc/levels/level-one/dialogues/level1-misinformation-maze.js',
            'js/simulated-pc/levels/level-one/dialogues/challenge1-dialogue.js',
            'js/simulated-pc/levels/level-one/dialogues/level-completion-dialogue.js',
            
            # Tutorials for Level 1
            'js/simulated-pc/tutorials/initial-tutorial.js',
            'js/simulated-pc/tutorials/browser-tutorial.js',
        ]
    
    elif level_id == 2:
        # Level 2: Shadow in the Inbox - Email security focused
        level_specific_files = [
            # Level 2 configuration and data
            'js/simulated-pc/levels/level-two/level-config.js',
            'js/simulated-pc/levels/level-two/apps/index.js',
            'js/simulated-pc/levels/level-two/data/index.js',
            
            # Level 2 dialogues
            'js/simulated-pc/levels/level-two/dialogues/index.js',
            'js/simulated-pc/levels/level-two/dialogues/level2-shadow-inbox.js',
            'js/simulated-pc/levels/level-two/dialogues/email-security-completion-dialogue.js',
            
            # Tutorials for Level 2
            'js/simulated-pc/tutorials/email-tutorial.js',
        ]
    
    elif level_id == 3:
        # Level 3: Malware Mayhem - System security and malware detection
        level_specific_files = [
            # Level 3 configuration and data
            'js/simulated-pc/levels/level-three/level-config.js',
            'js/simulated-pc/levels/level-three/apps/index.js',
            'js/simulated-pc/levels/level-three/data/index.js',
            
            # Level 3 dialogues
            'js/simulated-pc/levels/level-three/dialogues/index.js',
            'js/simulated-pc/levels/level-three/dialogues/level3-malware-mayhem.js',
            
            # Level 3 malware definitions and processes (moved to level-three)
            'js/simulated-pc/levels/level-three/malware/base-malware.js',
            'js/simulated-pc/levels/level-three/malware/gaming-optimizer-ransomware.js',
            'js/simulated-pc/levels/level-three/malware/performance-monitor-spyware.js',
            'js/simulated-pc/levels/level-three/malware/steam-helper-trojan.js',
            'js/simulated-pc/levels/level-three/malware/system-optimizer-rootkit.js',
            
            'js/simulated-pc/levels/level-three/processes/application-processes.js',
            'js/simulated-pc/levels/level-three/processes/base-process.js',
            'js/simulated-pc/levels/level-three/processes/gaming-processes.js',
            'js/simulated-pc/levels/level-three/processes/malware-processes.js',
            'js/simulated-pc/levels/level-three/processes/process-factory.js',
            'js/simulated-pc/levels/level-three/processes/system-processes.js',
            
            # Malware Scanner Application (core Level 3 app)
            'js/simulated-pc/desktop-components/desktop-applications/malware-scanner-app.js',
            'js/simulated-pc/desktop-components/desktop-applications/malware-scanner-functions/malware-database.js',
            'js/simulated-pc/desktop-components/desktop-applications/malware-scanner-functions/malware-scanner-actions.js',
            'js/simulated-pc/desktop-components/desktop-applications/malware-scanner-functions/malware-scanner-activity-emitter.js',
            'js/simulated-pc/desktop-components/desktop-applications/malware-scanner-functions/malware-scanner-event-handler.js',
            'js/simulated-pc/desktop-components/desktop-applications/malware-scanner-functions/malware-scanner-ui-manager.js',
            'js/simulated-pc/desktop-components/desktop-applications/malware-scanner-functions/quarantine-manager.js',
            'js/simulated-pc/desktop-components/desktop-applications/malware-scanner-functions/scan-engine.js',
            
            # Process Monitor Application (core Level 3 app)
            'js/simulated-pc/desktop-components/desktop-applications/process-monitor-app.js',
            'js/simulated-pc/desktop-components/desktop-applications/process-monitor-functions/notification-manager.js',
            'js/simulated-pc/desktop-components/desktop-applications/process-monitor-functions/process-data-manager.js',
            'js/simulated-pc/desktop-components/desktop-applications/process-monitor-functions/process-event-handler.js',
            'js/simulated-pc/desktop-components/desktop-applications/process-monitor-functions/process-monitor-activity-emitter.js',
            'js/simulated-pc/desktop-components/desktop-applications/process-monitor-functions/process-renderer.js',
            'js/simulated-pc/desktop-components/desktop-applications/process-monitor-functions/process-sorter.js',
            
            # Tutorials for Level 3
            'js/simulated-pc/tutorials/malware-scanner-tutorial.js',
            'js/simulated-pc/tutorials/process-monitor-tutorial.js',
        ]
    
    elif level_id == 4:
        # Level 4: The White Hat Test - Ethical hacking and vulnerability assessment
        level_specific_files = [
            # Level 4 configuration and data
            'js/simulated-pc/levels/level-four/level-config.js',
            'js/simulated-pc/levels/level-four/apps/index.js',
            'js/simulated-pc/levels/level-four/data/index.js',
            
            # Level 4 dialogues
            'js/simulated-pc/levels/level-four/dialogues/index.js',
            'js/simulated-pc/levels/level-four/dialogues/level4-white-hat-test.js',
            
            # Tutorials for Level 4
            'js/simulated-pc/tutorials/vulnerability-scanner-tutorial.js',
            'js/simulated-pc/tutorials/network-monitor-tutorial.js',
            'js/simulated-pc/tutorials/terminal-tutorial.js',
        ]
    
    elif level_id == 5:
        # Level 5: The Hunt for The Null - Advanced digital forensics
        level_specific_files = [
            # Level 5 configuration and data
            'js/simulated-pc/levels/level-five/level-config.js',
            'js/simulated-pc/levels/level-five/apps/index.js',
            'js/simulated-pc/levels/level-five/data/index.js',
            
            # Level 5 dialogues
            'js/simulated-pc/levels/level-five/dialogues/index.js',
            'js/simulated-pc/levels/level-five/dialogues/level5-hunt-for-the-null.js',
            
            # Level 5 special features
            'js/simulated-pc/levels/level-five/evidence-tracker.js',
            'js/simulated-pc/levels/level-five/scoring-system.js',
            
            # Tutorials for Level 5
            'js/simulated-pc/levels/level-five/tutorials/level5-forensics-tutorial.js',
            'js/simulated-pc/tutorials/file-manager-tutorial.js',
            'js/simulated-pc/tutorials/terminal-tutorial.js',
        ]
    
    return core_files + level_specific_files

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
    
    # Define level-specific JavaScript files to load
    level_js_files = get_level_js_files(level_id)
    
    # Convert level data to JSON string for direct JavaScript usage
    level_json = json.dumps(level_data, default=str)
    
    return render_template('simulated-pc/simulation.html', 
                         level=level, 
                         level_data=level_data,
                         level_json=level_json,
                         level_js_files=level_js_files)

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