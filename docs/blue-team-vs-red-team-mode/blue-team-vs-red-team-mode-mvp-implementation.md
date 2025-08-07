# Blue Team vs Red Team Mode - MVP Implementation

This is the MVP implementation of the Blue Team vs Red Team mode for CyberQuest, based on the design specifications in `docs/ideas/blue-vs-red-mode.md`.

## Overview

The Blue Team vs Red Team mode is a competitive cybersecurity simulation where the player (Blue Team) defends a simulated network environment against an AI-driven attacker (Red Team). The mode provides educational value by teaching both offensive and defensive cybersecurity skills in a dynamic, replayable scenario.

## MVP Features

### Core Gameplay
- **Small Simulated Network**: 2-3 hosts (web server, database, workstation) with 1-2 services each
- **AI Red Team**: Rule-based, state-driven algorithm performing basic attack chains
- **Blue Team Actions**: Monitor logs, receive alerts, patch vulnerabilities, quarantine hosts
- **Real-time Interaction**: Dynamic gameplay with immediate feedback

### Interface Components
- **Dashboard Overview**: Network topology view with host status indicators
- **Alert Feed**: Real-time security alerts with severity levels
- **Action Panel**: Quick access to defense actions (scan, patch, quarantine, investigate)
- **Investigation Modal**: Detailed analysis results for alerts and hosts
- **Session Summary**: Post-game analysis with performance metrics and learning points

### Scoring System
- Points awarded for:
  - Network scanning (+10)
  - Vulnerability patching (+15 per vulnerability)
  - Host quarantine (+25)
  - Alert investigation (+20)
- Score penalties for compromised systems and data exfiltration

### AI Personalities
- **Aggressive**: Faster attacks, higher detection probability
- **Stealthy**: Slower but harder to detect attacks

## File Structure

```
app/
├── templates/blue-team-vs-red-team-mode/
│   └── dashboard.html                    # Main game interface
├── routes/
│   └── blue_team_vs_red_team.py         # Flask routes and game logic
└── static/js/blue-team-vs-red-team-mode/
    ├── dashboard.js                      # Frontend dashboard functionality
    ├── red-team-ai.js                   # AI algorithm implementation
    └── game-engine.js                   # Game state management
```

## Technical Implementation

### Backend (Python/Flask)
- **GameSession Class**: Manages session state, scoring, and host information
- **REST API**: Endpoints for game actions (scan, patch, quarantine, investigate)
- **AI Simulation**: Server-side Red Team action processing
- **Session Management**: In-memory storage for active game sessions

### Frontend (JavaScript)
- **BlueTeamDashboard**: Main UI controller for the game interface
- **RedTeamAI**: Client-side AI algorithm with state machine and weighted actions
- **BlueRedGameEngine**: Game state management and event handling
- **Real-time Updates**: Auto-refresh and dynamic UI updates

### AI Algorithm
The Red Team AI follows a state machine approach:
1. **Reconnaissance**: Network scanning and asset enumeration
2. **Initial Access**: Phishing, exploitation, brute force attempts
3. **Establish Foothold**: Deploy persistence mechanisms
4. **Lateral Movement**: Move between compromised systems
5. **Privilege Escalation**: Seek higher system privileges
6. **Action on Objectives**: Data exfiltration or service disruption

## Getting Started

### Prerequisites
- Flask application with existing CyberQuest setup
- Modern web browser with JavaScript support

### Installation
1. The Blue vs Red mode is automatically available when the Flask app runs
2. Access via the navigation menu: "🛡️ vs 🔴 Mode"
3. Or directly at: `/blue-vs-red/`

### Gameplay
1. **Start Session**: A new session begins automatically
2. **Monitor Network**: Watch the network overview for host status changes
3. **Respond to Alerts**: Click alerts in the feed to investigate
4. **Take Actions**: Use action buttons to scan, patch, quarantine, or investigate
5. **Score Points**: Effective defense actions increase your score
6. **Session Summary**: View detailed analysis at any time

## Educational Value

### Learning Objectives
- **Incident Response**: Practice responding to security alerts and breaches
- **Threat Detection**: Learn to identify suspicious activities and attack patterns
- **Defense Strategies**: Understand vulnerability management and system hardening
- **Security Operations**: Experience SOC-like workflows and decision making

### Post-Game Analysis
- Performance metrics (detection speed, response time, system uptime)
- Attack analysis (compromised hosts, handled alerts, recovery time)
- Learning points with actionable cybersecurity insights

## Future Enhancements

The MVP provides a foundation for future expansions:
- **Advanced AI**: Reinforcement learning and NLP integration
- **Multiplayer Support**: Team-based and competitive modes
- **Scenario Editor**: Custom attack scenarios and environments
- **Campaign Integration**: Connection with existing CyberQuest levels
- **Real-world Threat Feeds**: Integration with actual threat intelligence

## API Endpoints

- `GET /blue-vs-red/` - Main dashboard
- `POST /blue-vs-red/start-session` - Start new game session
- `GET /blue-vs-red/session-status` - Get current session state
- `POST /blue-vs-red/scan-network` - Perform network scan
- `POST /blue-vs-red/patch-vulnerabilities` - Patch system vulnerabilities
- `POST /blue-vs-red/quarantine-host` - Quarantine compromised host
- `POST /blue-vs-red/investigate-alert` - Investigate security alert
- `POST /blue-vs-red/ai-action` - Trigger AI action (demo/testing)
- `GET /blue-vs-red/session-summary` - Get session performance summary
- `POST /blue-vs-red/end-session` - End current session

## Contributing

When extending this mode:
1. Follow the existing code patterns and structure
2. Update the AI algorithm in `red-team-ai.js` for new attack behaviors
3. Add new alert types and investigation results in the backend
4. Maintain the educational focus with clear feedback and learning points
5. Test thoroughly for game balance and educational effectiveness

## License

Part of the CyberQuest platform - see main project license.
