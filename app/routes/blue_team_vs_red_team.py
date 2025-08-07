from flask import Blueprint, render_template, request, jsonify, session
from datetime import datetime
import random
import json

# Create the blueprint
blue_red_bp = Blueprint('blue_red', __name__, url_prefix='/blue-vs-red')

# In-memory session storage (in production, use a database)
active_sessions = {}

class GameSession:
    def __init__(self, session_id):
        self.session_id = session_id
        self.start_time = datetime.now()
        self.score = 0
        self.hosts = {
            'web-server': {'status': 'online', 'compromised': False, 'vulnerabilities': ['CVE-2023-1001', 'CVE-2023-1002']},
            'database': {'status': 'online', 'compromised': False, 'vulnerabilities': ['CVE-2023-2001']},
            'workstation': {'status': 'online', 'compromised': False, 'vulnerabilities': ['CVE-2023-3001', 'CVE-2023-3002']}
        }
        self.alerts = []
        self.ai_state = 'reconnaissance'
        self.ai_personality = random.choice(['aggressive', 'stealthy'])
        self.attacks_detected = 0
        self.alerts_handled = 0
        self.compromised_count = 0
        self.last_ai_action = None
        
    def add_alert(self, alert_type, message, severity='medium', source='Unknown'):
        alert = {
            'id': len(self.alerts) + 1,
            'type': alert_type,
            'message': message,
            'severity': severity,
            'source': source,
            'timestamp': datetime.now().isoformat(),
            'handled': False
        }
        self.alerts.append(alert)
        return alert
    
    def get_session_duration(self):
        return (datetime.now() - self.start_time).total_seconds()

@blue_red_bp.route('/')
def dashboard():
    """Main dashboard for Blue Team vs Red Team mode"""
    session_id = session.get('blue_red_session_id')
    session_data = None
    
    if session_id and session_id in active_sessions:
        session_data = active_sessions[session_id]
    
    return render_template('blue-team-vs-red-team-mode/dashboard.html', session_data=session_data)

@blue_red_bp.route('/start-session', methods=['POST'])
def start_session():
    """Start a new Blue vs Red session"""
    session_id = f"session_{random.randint(1000, 9999)}_{int(datetime.now().timestamp())}"
    game_session = GameSession(session_id)
    active_sessions[session_id] = game_session
    session['blue_red_session_id'] = session_id
    
    # Add initial system status alert
    game_session.add_alert('system', 'Blue Team defense systems online', 'low', 'Security Center')
    
    return jsonify({
        'success': True,
        'session_id': session_id,
        'message': 'New session started successfully'
    })

@blue_red_bp.route('/session-status')
def session_status():
    """Get current session status"""
    session_id = session.get('blue_red_session_id')
    
    if not session_id or session_id not in active_sessions:
        return jsonify({'error': 'No active session'}), 404
    
    game_session = active_sessions[session_id]
    
    return jsonify({
        'session_id': session_id,
        'score': game_session.score,
        'duration': game_session.get_session_duration(),
        'hosts': game_session.hosts,
        'alerts': game_session.alerts[-10:],  # Last 10 alerts
        'ai_state': game_session.ai_state,
        'ai_personality': game_session.ai_personality
    })

@blue_red_bp.route('/scan-network', methods=['POST'])
def scan_network():
    """Perform network scan action"""
    session_id = session.get('blue_red_session_id')
    
    if not session_id or session_id not in active_sessions:
        return jsonify({'error': 'No active session'}), 404
    
    game_session = active_sessions[session_id]
    
    # Simulate network scan results
    scan_results = []
    for host, data in game_session.hosts.items():
        result = {
            'host': host,
            'status': data['status'],
            'vulnerabilities_found': len(data['vulnerabilities']) if not data['compromised'] else 0,
            'suspicious_activity': data['compromised']
        }
        scan_results.append(result)
    
    # Award points for scanning
    game_session.score += 10
    
    # Add scan completion alert
    game_session.add_alert('scan', 'Network scan completed - vulnerabilities detected', 'medium', 'Network Scanner')
    
    return jsonify({
        'success': True,
        'scan_results': scan_results,
        'score': game_session.score,
        'message': 'Network scan completed'
    })

@blue_red_bp.route('/patch-vulnerabilities', methods=['POST'])
def patch_vulnerabilities():
    """Patch system vulnerabilities"""
    session_id = session.get('blue_red_session_id')
    
    if not session_id or session_id not in active_sessions:
        return jsonify({'error': 'No active session'}), 404
    
    game_session = active_sessions[session_id]
    host = request.json.get('host', 'all')
    
    patched_count = 0
    if host == 'all':
        for host_data in game_session.hosts.values():
            if not host_data['compromised']:
                patched_count += len(host_data['vulnerabilities'])
                host_data['vulnerabilities'] = []
    else:
        if host in game_session.hosts and not game_session.hosts[host]['compromised']:
            patched_count = len(game_session.hosts[host]['vulnerabilities'])
            game_session.hosts[host]['vulnerabilities'] = []
    
    # Award points for patching
    game_session.score += patched_count * 15
    
    # Add patching alert
    game_session.add_alert('patch', f'Patched {patched_count} vulnerabilities', 'low', 'Patch Management')
    
    return jsonify({
        'success': True,
        'patched_count': patched_count,
        'score': game_session.score,
        'message': f'Successfully patched {patched_count} vulnerabilities'
    })

@blue_red_bp.route('/quarantine-host', methods=['POST'])
def quarantine_host():
    """Quarantine a compromised host"""
    session_id = session.get('blue_red_session_id')
    
    if not session_id or session_id not in active_sessions:
        return jsonify({'error': 'No active session'}), 404
    
    game_session = active_sessions[session_id]
    host = request.json.get('host')
    
    if not host or host not in game_session.hosts:
        return jsonify({'error': 'Invalid host specified'}), 400
    
    if game_session.hosts[host]['status'] == 'quarantined':
        return jsonify({'error': 'Host already quarantined'}), 400
    
    # Quarantine the host
    game_session.hosts[host]['status'] = 'quarantined'
    
    # Award points for quarantine action
    game_session.score += 25
    
    # Add quarantine alert
    game_session.add_alert('quarantine', f'Host {host} has been quarantined', 'medium', 'Security Team')
    
    return jsonify({
        'success': True,
        'host': host,
        'score': game_session.score,
        'message': f'Host {host} quarantined successfully'
    })

@blue_red_bp.route('/investigate-alert', methods=['POST'])
def investigate_alert():
    """Investigate a specific alert or host"""
    session_id = session.get('blue_red_session_id')
    
    if not session_id or session_id not in active_sessions:
        return jsonify({'error': 'No active session'}), 404
    
    game_session = active_sessions[session_id]
    alert_id = request.json.get('alert_id')
    host = request.json.get('host')
    
    investigation_results = {
        'findings': [],
        'recommendations': []
    }
    
    if alert_id:
        # Find the specific alert
        alert = next((a for a in game_session.alerts if a['id'] == alert_id), None)
        if alert:
            alert['handled'] = True
            game_session.alerts_handled += 1
            
            # Generate investigation findings based on alert type
            if alert['type'] == 'intrusion':
                investigation_results['findings'] = [
                    'Suspicious network traffic detected',
                    'Potential lateral movement attempt',
                    'Credentials may be compromised'
                ]
                investigation_results['recommendations'] = [
                    'Change affected user passwords',
                    'Review access logs',
                    'Consider host isolation'
                ]
            elif alert['type'] == 'malware':
                investigation_results['findings'] = [
                    'Malicious file detected',
                    'Process anomalies identified',
                    'Network connections to suspicious IPs'
                ]
                investigation_results['recommendations'] = [
                    'Run full system scan',
                    'Block suspicious IP addresses',
                    'Update antivirus signatures'
                ]
    
    if host and host in game_session.hosts:
        host_data = game_session.hosts[host]
        investigation_results['findings'].extend([
            f'Host status: {host_data["status"]}',
            f'Compromised: {host_data["compromised"]}',
            f'Vulnerabilities: {len(host_data["vulnerabilities"])}'
        ])
    
    # Award points for investigation
    game_session.score += 20
    
    return jsonify({
        'success': True,
        'investigation_results': investigation_results,
        'score': game_session.score,
        'message': 'Investigation completed'
    })

@blue_red_bp.route('/ai-action', methods=['POST'])
def trigger_ai_action():
    """Trigger Red Team AI action (for testing/demo purposes)"""
    session_id = session.get('blue_red_session_id')
    
    if not session_id or session_id not in active_sessions:
        return jsonify({'error': 'No active session'}), 404
    
    game_session = active_sessions[session_id]
    
    # Simple AI action based on current state
    ai_actions = []
    
    if game_session.ai_state == 'reconnaissance':
        # AI performs reconnaissance
        action = {
            'type': 'scan',
            'description': 'Red Team performed network reconnaissance',
            'target': 'network'
        }
        game_session.add_alert('intrusion', 'Suspicious network scanning detected', 'medium', 'IDS')
        game_session.ai_state = 'initial_access'
        
    elif game_session.ai_state == 'initial_access':
        # AI attempts initial access
        target_host = random.choice(list(game_session.hosts.keys()))
        if game_session.hosts[target_host]['vulnerabilities'] and not game_session.hosts[target_host]['compromised']:
            # Successful compromise
            game_session.hosts[target_host]['compromised'] = True
            game_session.compromised_count += 1
            action = {
                'type': 'compromise',
                'description': f'Red Team compromised {target_host}',
                'target': target_host,
                'success': True
            }
            game_session.add_alert('intrusion', f'Host compromise detected on {target_host}', 'high', 'EDR')
            game_session.ai_state = 'lateral_movement'
        else:
            action = {
                'type': 'failed_access',
                'description': f'Red Team failed to compromise {target_host}',
                'target': target_host,
                'success': False
            }
            game_session.add_alert('intrusion', f'Failed intrusion attempt on {target_host}', 'medium', 'IDS')
    
    elif game_session.ai_state == 'lateral_movement':
        # AI attempts lateral movement
        compromised_hosts = [host for host, data in game_session.hosts.items() if data['compromised']]
        if compromised_hosts:
            source = random.choice(compromised_hosts)
            target = random.choice([host for host in game_session.hosts.keys() if not game_session.hosts[host]['compromised']])
            
            action = {
                'type': 'lateral_movement',
                'description': f'Red Team attempting lateral movement from {source} to {target}',
                'source': source,
                'target': target
            }
            game_session.add_alert('intrusion', f'Lateral movement detected: {source} → {target}', 'high', 'Network Monitor')
    
    else:
        action = {
            'type': 'unknown',
            'description': 'Red Team activity detected',
            'target': 'unknown'
        }
    
    game_session.last_ai_action = action
    ai_actions.append(action)
    
    return jsonify({
        'success': True,
        'ai_actions': ai_actions,
        'ai_state': game_session.ai_state,
        'message': 'AI action executed'
    })

@blue_red_bp.route('/session-summary')
def session_summary():
    """Get detailed session summary"""
    session_id = session.get('blue_red_session_id')
    
    if not session_id or session_id not in active_sessions:
        return jsonify({'error': 'No active session'}), 404
    
    game_session = active_sessions[session_id]
    duration = game_session.get_session_duration()
    
    # Calculate metrics
    detection_speed = "Fast" if game_session.attacks_detected > 0 else "N/A"
    response_time = f"{duration/60:.1f} minutes"
    system_uptime = f"{(1 - game_session.compromised_count/3) * 100:.1f}%"
    
    # Generate learning points
    learning_points = []
    if game_session.compromised_count == 0:
        learning_points.append("Excellent defense! No systems were compromised.")
    else:
        learning_points.append("Some systems were compromised. Consider faster patching and monitoring.")
    
    if game_session.alerts_handled < len(game_session.alerts) / 2:
        learning_points.append("Investigate more alerts to improve detection capabilities.")
    
    learning_points.append("Regular network scanning helps identify vulnerabilities early.")
    learning_points.append("Quick response to high-severity alerts is crucial for containment.")
    
    summary = {
        'final_score': game_session.score,
        'duration': duration,
        'detection_speed': detection_speed,
        'response_time': response_time,
        'system_uptime': system_uptime,
        'attacks_detected': game_session.attacks_detected,
        'alerts_handled': game_session.alerts_handled,
        'compromised_hosts': game_session.compromised_count,
        'learning_points': learning_points,
        'ai_personality': game_session.ai_personality
    }
    
    return jsonify(summary)

@blue_red_bp.route('/end-session', methods=['POST'])
def end_session():
    """End current session"""
    session_id = session.get('blue_red_session_id')
    
    if session_id and session_id in active_sessions:
        del active_sessions[session_id]
        session.pop('blue_red_session_id', None)
    
    return jsonify({
        'success': True,
        'message': 'Session ended successfully'
    })
