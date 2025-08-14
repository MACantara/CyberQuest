# Blue Team vs Red Team Mode Routes
from flask import Blueprint, render_template, request, jsonify, session, redirect, url_for
from flask_login import login_required, current_user
import json
import logging
from datetime import datetime

# Create blueprint
blue_team_vs_red_team = Blueprint('blue_team_vs_red_team', __name__, url_prefix='/blue-vs-red')

# Set up logging
logger = logging.getLogger(__name__)

@blue_team_vs_red_team.route('/')
@login_required
def introduction():
    """Introduction page for Blue Team vs Red Team mode"""
    try:
        return render_template('blue-team-vs-red-team-mode/introduction.html')
    except Exception as e:
        logger.error(f"Error rendering introduction: {str(e)}")
        return render_template('error.html', 
                             error_message="Unable to load Blue vs Red Team introduction"), 500

@blue_team_vs_red_team.route('/dashboard')
@login_required
def dashboard():
    """Main dashboard for Blue Team vs Red Team simulation"""
    try:
        # Initialize default game state if not exists
        if 'blue_vs_red_game_state' not in session:
            session['blue_vs_red_game_state'] = {
                'isRunning': False,
                'timeRemaining': 900,  # 15 minutes
                'assets': {
                    'academy-server': {'status': 'secure', 'integrity': 100},
                    'student-db': {'status': 'secure', 'integrity': 100},
                    'research-files': {'status': 'secure', 'integrity': 100},
                    'learning-platform': {'status': 'secure', 'integrity': 100}
                },
                'alerts': [],
                'incidents': [],
                'securityControls': {
                    'firewall': {'active': True, 'effectiveness': 80},
                    'endpoint': {'active': True, 'effectiveness': 75},
                    'access': {'active': True, 'effectiveness': 85}
                },
                'aiDifficulty': 'Normal',  # Default difficulty
                'currentPhase': 'reconnaissance'
            }
            session.permanent = True
        
        return render_template('blue-team-vs-red-team-mode/dashboard.html')
    except Exception as e:
        logger.error(f"Error rendering dashboard: {str(e)}")
        return render_template('error.html', 
                             error_message="Unable to load Blue vs Red Team dashboard"), 500

@blue_team_vs_red_team.route('/api/game-state', methods=['GET'])
@login_required
def get_game_state():
    """Get current game state"""
    try:
        # Get game state from session or initialize default
        game_state = session.get('blue_vs_red_game_state', {
            'isRunning': False,
            'timeRemaining': 900,  # 15 minutes
            'assets': {
                'academy-server': {'status': 'secure', 'integrity': 100},
                'student-db': {'status': 'secure', 'integrity': 100},
                'research-files': {'status': 'secure', 'integrity': 100},
                'learning-platform': {'status': 'secure', 'integrity': 100}
            },
            'alerts': [],
            'incidents': [],
            'securityControls': {
                'firewall': {'active': True, 'effectiveness': 80},
                'endpoint': {'active': True, 'effectiveness': 75},
                'access': {'active': True, 'effectiveness': 85}
            },
            'aiDifficulty': 'Normal',
            'currentPhase': 'reconnaissance'
        })
        
        return jsonify(game_state)
    
    except Exception as e:
        logger.error(f"Error getting game state: {str(e)}")
        return jsonify({'error': 'Failed to get game state'}), 500

@blue_team_vs_red_team.route('/api/game-state', methods=['POST'])
@login_required
def update_game_state():
    """Update game state"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Update session with new game state
        session['blue_vs_red_game_state'] = data
        session.permanent = True
        
        return jsonify({'success': True, 'message': 'Game state updated'})
    
    except Exception as e:
        logger.error(f"Error updating game state: {str(e)}")
        return jsonify({'error': 'Failed to update game state'}), 500

@blue_team_vs_red_team.route('/api/start-game', methods=['POST'])
@login_required
def start_game():
    """Start a new game session"""
    try:
        # Initialize new game state
        initial_state = {
            'isRunning': True,
            'timeRemaining': 900,
            'startTime': datetime.now().isoformat(),
            'assets': {
                'academy-server': {'status': 'secure', 'integrity': 100},
                'student-db': {'status': 'secure', 'integrity': 100},
                'research-files': {'status': 'secure', 'integrity': 100},
                'learning-platform': {'status': 'secure', 'integrity': 100}
            },
            'alerts': [],
            'incidents': [],
            'securityControls': {
                'firewall': {'active': True, 'effectiveness': 80},
                'endpoint': {'active': True, 'effectiveness': 75},
                'access': {'active': True, 'effectiveness': 85}
            },
            'aiDifficulty': 'Normal',
            'currentPhase': 'reconnaissance',
            'playerActions': [],
            'aiActions': []
        }
        
        session['blue_vs_red_game_state'] = initial_state
        session.permanent = True
        
        # Log game start
        logger.info(f"User {current_user.username} started Blue vs Red Team simulation")
        
        return jsonify({
            'success': True,
            'message': 'Game started successfully',
            'gameState': initial_state
        })
    
    except Exception as e:
        logger.error(f"Error starting game: {str(e)}")
        return jsonify({'error': 'Failed to start game'}), 500

@blue_team_vs_red_team.route('/api/stop-game', methods=['POST'])
@login_required
def stop_game():
    """Stop current game session"""
    try:
        game_state = session.get('blue_vs_red_game_state', {})
        
        if game_state.get('isRunning'):
            game_state['isRunning'] = False
            game_state['endTime'] = datetime.now().isoformat()
            
            session['blue_vs_red_game_state'] = game_state
            session.permanent = True
            
            # Log game stop
            logger.info(f"User {current_user.username} stopped Blue vs Red Team simulation")
        
        return jsonify({
            'success': True,
            'message': 'Game stopped successfully',
            'gameState': game_state
        })
    
    except Exception as e:
        logger.error(f"Error stopping game: {str(e)}")
        return jsonify({'error': 'Failed to stop game'}), 500

@blue_team_vs_red_team.route('/api/reset-game', methods=['POST'])
@login_required
def reset_game():
    """Reset game to initial state"""
    try:
        # Clear game state from session
        session.pop('blue_vs_red_game_state', None)
        
        # Log game reset
        logger.info(f"User {current_user.username} reset Blue vs Red Team simulation")
        
        return jsonify({
            'success': True,
            'message': 'Game reset successfully'
        })
    
    except Exception as e:
        logger.error(f"Error resetting game: {str(e)}")
        return jsonify({'error': 'Failed to reset game'}), 500

@blue_team_vs_red_team.route('/api/player-action', methods=['POST'])
@login_required
def player_action():
    """Record a player action"""
    try:
        data = request.get_json()
        
        if not data or 'action' not in data:
            return jsonify({'error': 'Action data required'}), 400
        
        game_state = session.get('blue_vs_red_game_state', {})
        
        if not game_state.get('isRunning'):
            return jsonify({'error': 'Game is not running'}), 400
        
        # Record player action
        action = {
            'timestamp': datetime.now().isoformat(),
            'type': data['action'],
            'target': data.get('target'),
            'parameters': data.get('parameters', {}),
            'effectiveness': data.get('effectiveness', 0)
        }
        
        if 'playerActions' not in game_state:
            game_state['playerActions'] = []
        
        game_state['playerActions'].append(action)
        
        # Update session
        session['blue_vs_red_game_state'] = game_state
        session.permanent = True
        
        return jsonify({
            'success': True,
            'message': 'Player action recorded',
            'action': action
        })
    
    except Exception as e:
        logger.error(f"Error recording player action: {str(e)}")
        return jsonify({'error': 'Failed to record player action'}), 500

@blue_team_vs_red_team.route('/api/ai-action', methods=['POST'])
@login_required
def ai_action():
    """Record an AI action"""
    try:
        data = request.get_json()
        
        if not data or 'action' not in data:
            return jsonify({'error': 'Action data required'}), 400
        
        game_state = session.get('blue_vs_red_game_state', {})
        
        if not game_state.get('isRunning'):
            return jsonify({'error': 'Game is not running'}), 400
        
        # Record AI action
        action = {
            'timestamp': datetime.now().isoformat(),
            'type': data['action'],
            'technique': data.get('technique'),
            'target': data.get('target'),
            'severity': data.get('severity', 'medium'),
            'detected': data.get('detected', False),
            'successful': data.get('successful', False)
        }
        
        if 'aiActions' not in game_state:
            game_state['aiActions'] = []
        
        game_state['aiActions'].append(action)
        
        # Update session
        session['blue_vs_red_game_state'] = game_state
        session.permanent = True
        
        return jsonify({
            'success': True,
            'message': 'AI action recorded',
            'action': action
        })
    
    except Exception as e:
        logger.error(f"Error recording AI action: {str(e)}")
        return jsonify({'error': 'Failed to record AI action'}), 500

@blue_team_vs_red_team.route('/api/game-results', methods=['GET'])
@login_required
def get_game_results():
    """Get game results and statistics"""
    try:
        game_state = session.get('blue_vs_red_game_state', {})
        
        if not game_state:
            return jsonify({'error': 'No game data found'}), 404
        
        # Calculate statistics
        player_actions = game_state.get('playerActions', [])
        ai_actions = game_state.get('aiActions', [])
        
        stats = {
            'gameDuration': calculate_game_duration(game_state),
            'totalPlayerActions': len(player_actions),
            'totalAIActions': len(ai_actions),
            'attacksDetected': len([a for a in ai_actions if a.get('detected')]),
            'attacksSuccessful': len([a for a in ai_actions if a.get('successful')]),
            'assetIntegrity': calculate_asset_integrity(game_state.get('assets', {})),
            'detectionRate': calculate_detection_rate(ai_actions),
            'responseTime': calculate_avg_response_time(player_actions, ai_actions),
            'finalScore': calculate_final_score(game_state)
        }
        
        return jsonify({
            'success': True,
            'gameState': game_state,
            'statistics': stats
        })
    
    except Exception as e:
        logger.error(f"Error getting game results: {str(e)}")
        return jsonify({'error': 'Failed to get game results'}), 500

def calculate_game_duration(game_state):
    """Calculate game duration in seconds"""
    start_time = game_state.get('startTime')
    end_time = game_state.get('endTime')
    
    if not start_time:
        return 0
    
    if not end_time:
        end_time = datetime.now().isoformat()
    
    try:
        start = datetime.fromisoformat(start_time)
        end = datetime.fromisoformat(end_time)
        return int((end - start).total_seconds())
    except:
        return 0

def calculate_asset_integrity(assets):
    """Calculate average asset integrity"""
    if not assets:
        return 100
    
    total_integrity = sum(asset.get('integrity', 100) for asset in assets.values())
    return round(total_integrity / len(assets), 1)

def calculate_detection_rate(ai_actions):
    """Calculate detection rate as percentage"""
    if not ai_actions:
        return 0
    
    detected = len([a for a in ai_actions if a.get('detected')])
    return round((detected / len(ai_actions)) * 100, 1)

def calculate_avg_response_time(player_actions, ai_actions):
    """Calculate average response time in seconds"""
    # Simplified calculation - in a real implementation, this would be more sophisticated
    return round(len(player_actions) * 2.5, 1) if player_actions else 0

def calculate_final_score(game_state):
    """Calculate final game score"""
    asset_integrity = calculate_asset_integrity(game_state.get('assets', {}))
    time_remaining = game_state.get('timeRemaining', 0)
    ai_actions = game_state.get('aiActions', [])
    detection_rate = calculate_detection_rate(ai_actions)
    
    # Score calculation: asset integrity (40%) + time bonus (30%) + detection rate (30%)
    score = (asset_integrity * 0.4) + (min(time_remaining / 9, 100) * 0.3) + (detection_rate * 0.3)
    return round(score, 1)

# Error handlers for the blueprint
@blue_team_vs_red_team.errorhandler(404)
def not_found_error(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@blue_team_vs_red_team.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500
