// Game Engine for Blue Team vs Red Team mode
class BlueRedGameEngine {
    constructor() {
        this.gameState = {
            sessionId: null,
            isActive: false,
            startTime: null,
            duration: 0,
            score: 0,
            hosts: {},
            alerts: [],
            blueTeamActions: [],
            redTeamActions: [],
            blueTeamAlertness: 0.5, // 0-1 scale
            compromisedHosts: 0,
            difficulty: 'medium'
        };
        
        this.redTeamAI = null;
        this.gameLoop = null;
        this.eventHandlers = {};
        
        this.init();
    }
    
    init() {
        // Initialize Red Team AI when game engine starts
        if (typeof RedTeamAI !== 'undefined') {
            this.redTeamAI = new RedTeamAI();
        }
        
        this.setupEventHandlers();
    }
    
    setupEventHandlers() {
        this.eventHandlers = {
            'hostCompromised': [],
            'alertGenerated': [],
            'actionTaken': [],
            'stateChanged': [],
            'gameEnded': []
        };
    }
    
    addEventListener(event, handler) {
        if (this.eventHandlers[event]) {
            this.eventHandlers[event].push(handler);
        }
    }
    
    removeEventListener(event, handler) {
        if (this.eventHandlers[event]) {
            const index = this.eventHandlers[event].indexOf(handler);
            if (index > -1) {
                this.eventHandlers[event].splice(index, 1);
            }
        }
    }
    
    emitEvent(event, data) {
        if (this.eventHandlers[event]) {
            this.eventHandlers[event].forEach(handler => {
                try {
                    handler(data);
                } catch (error) {
                    console.error(`Error in event handler for ${event}:`, error);
                }
            });
        }
    }
    
    startGame(sessionData) {
        this.gameState.sessionId = sessionData.session_id;
        this.gameState.isActive = true;
        this.gameState.startTime = new Date();
        this.gameState.hosts = sessionData.hosts || {};
        this.gameState.score = sessionData.score || 0;
        
        // Set AI personality based on session data
        if (this.redTeamAI && sessionData.ai_personality) {
            this.redTeamAI.setPersonality(sessionData.ai_personality);
        }
        
        // Start the game loop
        this.startGameLoop();
        
        this.emitEvent('stateChanged', this.gameState);
    }
    
    startGameLoop() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }
        
        this.gameLoop = setInterval(() => {
            this.updateGameState();
            this.processRedTeamAI();
            this.updateBlueTeamAlertness();
        }, 1000); // Update every second
    }
    
    stopGameLoop() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
    }
    
    updateGameState() {
        if (!this.gameState.isActive) return;
        
        // Update duration
        this.gameState.duration = Date.now() - this.gameState.startTime.getTime();
        
        // Update compromised host count
        this.gameState.compromisedHosts = Object.values(this.gameState.hosts)
            .filter(host => host.compromised).length;
        
        // Check win/lose conditions
        this.checkGameEndConditions();
    }
    
    processRedTeamAI() {
        if (!this.redTeamAI || !this.gameState.isActive) return;
        
        // Prepare game state for AI
        const aiGameState = {
            availableTargets: Object.keys(this.gameState.hosts),
            targetHost: this.selectTargetHost(),
            blueTeamAlertness: this.gameState.blueTeamAlertness,
            compromisedHosts: this.gameState.compromisedHosts,
            patchedSystems: this.countPatchedSystems(),
            quarantinedHosts: this.countQuarantinedHosts()
        };
        
        // Let AI take action
        const aiAction = this.redTeamAI.selectNextAction(aiGameState);
        
        if (aiAction) {
            this.processRedTeamAction(aiAction);
        }
        
        // Adapt AI to blue team actions
        if (this.gameState.blueTeamActions.length > 0) {
            this.redTeamAI.adaptToBlueTeamActions(this.gameState.blueTeamActions);
            this.gameState.blueTeamActions = []; // Clear processed actions
        }
    }
    
    processRedTeamAction(action) {
        this.gameState.redTeamActions.push(action);
        
        // Apply action effects
        if (action.success) {
            this.applyRedTeamSuccess(action);
        }
        
        // Generate alert if detected
        if (action.detected && action.alert) {
            this.generateAlert(action.alert);
        }
        
        // Trigger event
        this.emitEvent('actionTaken', { type: 'red', action });
    }
    
    applyRedTeamSuccess(action) {
        switch (action.action) {
            case 'exploit_vulnerability':
                const targetHost = this.selectTargetHost();
                if (targetHost && this.gameState.hosts[targetHost]) {
                    this.gameState.hosts[targetHost].compromised = true;
                    this.emitEvent('hostCompromised', { host: targetHost });
                }
                break;
                
            case 'phishing':
                // Phishing might compromise user workstation
                if (this.gameState.hosts['workstation']) {
                    this.gameState.hosts['workstation'].compromised = true;
                    this.emitEvent('hostCompromised', { host: 'workstation' });
                }
                break;
                
            case 'data_exfiltration':
                // Data exfiltration reduces score
                this.gameState.score = Math.max(0, this.gameState.score - 50);
                break;
                
            case 'service_disruption':
                // Service disruption affects host status
                const disruptHost = this.selectCompromisedHost();
                if (disruptHost && this.gameState.hosts[disruptHost]) {
                    this.gameState.hosts[disruptHost].status = 'offline';
                }
                break;
        }
    }
    
    generateAlert(alertData) {
        const alert = {
            id: this.gameState.alerts.length + 1,
            type: alertData.type,
            message: alertData.message,
            severity: alertData.severity,
            source: alertData.source,
            timestamp: new Date().toISOString(),
            handled: false
        };
        
        this.gameState.alerts.push(alert);
        this.emitEvent('alertGenerated', alert);
        
        // Increase blue team alertness based on alert severity
        const alertnessIncrease = {
            'low': 0.05,
            'medium': 0.1,
            'high': 0.2,
            'critical': 0.3
        };
        
        this.gameState.blueTeamAlertness = Math.min(1, 
            this.gameState.blueTeamAlertness + (alertnessIncrease[alert.severity] || 0.1));
    }
    
    updateBlueTeamAlertness() {
        // Gradually decrease alertness over time if no new alerts
        const recentAlerts = this.gameState.alerts.filter(alert => 
            Date.now() - new Date(alert.timestamp).getTime() < 30000); // Last 30 seconds
        
        if (recentAlerts.length === 0) {
            this.gameState.blueTeamAlertness = Math.max(0, this.gameState.blueTeamAlertness - 0.01);
        }
    }
    
    selectTargetHost() {
        const availableHosts = Object.keys(this.gameState.hosts).filter(host => 
            !this.gameState.hosts[host].compromised && 
            this.gameState.hosts[host].status !== 'quarantined'
        );
        
        if (availableHosts.length === 0) return null;
        
        // Prioritize hosts with vulnerabilities
        const vulnerableHosts = availableHosts.filter(host => 
            this.gameState.hosts[host].vulnerabilities && 
            this.gameState.hosts[host].vulnerabilities.length > 0
        );
        
        if (vulnerableHosts.length > 0) {
            return vulnerableHosts[Math.floor(Math.random() * vulnerableHosts.length)];
        }
        
        return availableHosts[Math.floor(Math.random() * availableHosts.length)];
    }
    
    selectCompromisedHost() {
        const compromisedHosts = Object.keys(this.gameState.hosts).filter(host => 
            this.gameState.hosts[host].compromised
        );
        
        if (compromisedHosts.length === 0) return null;
        return compromisedHosts[Math.floor(Math.random() * compromisedHosts.length)];
    }
    
    countPatchedSystems() {
        return Object.values(this.gameState.hosts).filter(host => 
            !host.vulnerabilities || host.vulnerabilities.length === 0
        ).length;
    }
    
    countQuarantinedHosts() {
        return Object.values(this.gameState.hosts).filter(host => 
            host.status === 'quarantined'
        ).length;
    }
    
    checkGameEndConditions() {
        const totalHosts = Object.keys(this.gameState.hosts).length;
        const compromisedCount = this.gameState.compromisedHosts;
        
        // Game ends if all hosts are compromised
        if (compromisedCount >= totalHosts) {
            this.endGame('defeat', 'All systems have been compromised by the Red Team');
        }
        
        // Game ends after a certain duration (optional)
        if (this.gameState.duration > 600000) { // 10 minutes
            const successRate = 1 - (compromisedCount / totalHosts);
            if (successRate > 0.5) {
                this.endGame('victory', 'Successfully defended against Red Team attacks');
            } else {
                this.endGame('defeat', 'Too many systems were compromised');
            }
        }
    }
    
    endGame(result, reason) {
        this.gameState.isActive = false;
        this.stopGameLoop();
        
        const endData = {
            result: result,
            reason: reason,
            finalScore: this.gameState.score,
            duration: this.gameState.duration,
            compromisedHosts: this.gameState.compromisedHosts,
            totalAlerts: this.gameState.alerts.length,
            handledAlerts: this.gameState.alerts.filter(a => a.handled).length
        };
        
        this.emitEvent('gameEnded', endData);
    }
    
    // Blue Team action handlers
    handleBlueTeamAction(actionType, actionData) {
        const action = {
            type: actionType,
            data: actionData,
            timestamp: Date.now()
        };
        
        this.gameState.blueTeamActions.push(action);
        
        switch (actionType) {
            case 'scan':
                this.handleScanAction(actionData);
                break;
            case 'patch':
                this.handlePatchAction(actionData);
                break;
            case 'quarantine':
                this.handleQuarantineAction(actionData);
                break;
            case 'investigate':
                this.handleInvestigateAction(actionData);
                break;
        }
        
        this.emitEvent('actionTaken', { type: 'blue', action });
    }
    
    handleScanAction(data) {
        // Scanning increases blue team alertness and reveals threats
        this.gameState.blueTeamAlertness = Math.min(1, this.gameState.blueTeamAlertness + 0.1);
        this.gameState.score += 10;
    }
    
    handlePatchAction(data) {
        // Patching reduces vulnerability counts
        if (data.host === 'all') {
            Object.values(this.gameState.hosts).forEach(host => {
                if (!host.compromised) {
                    host.vulnerabilities = [];
                }
            });
        } else if (this.gameState.hosts[data.host]) {
            this.gameState.hosts[data.host].vulnerabilities = [];
        }
        
        this.gameState.score += (data.patchedCount || 1) * 15;
    }
    
    handleQuarantineAction(data) {
        if (this.gameState.hosts[data.host]) {
            this.gameState.hosts[data.host].status = 'quarantined';
            this.gameState.score += 25;
        }
    }
    
    handleInvestigateAction(data) {
        // Investigation increases alertness and provides score
        this.gameState.blueTeamAlertness = Math.min(1, this.gameState.blueTeamAlertness + 0.15);
        this.gameState.score += 20;
        
        // Mark alert as handled if investigating specific alert
        if (data.alertId) {
            const alert = this.gameState.alerts.find(a => a.id === data.alertId);
            if (alert) {
                alert.handled = true;
            }
        }
    }
    
    getGameState() {
        return { ...this.gameState };
    }
    
    pauseGame() {
        this.gameState.isActive = false;
        this.stopGameLoop();
    }
    
    resumeGame() {
        this.gameState.isActive = true;
        this.startGameLoop();
    }
    
    resetGame() {
        this.stopGameLoop();
        
        this.gameState = {
            sessionId: null,
            isActive: false,
            startTime: null,
            duration: 0,
            score: 0,
            hosts: {},
            alerts: [],
            blueTeamActions: [],
            redTeamActions: [],
            blueTeamAlertness: 0.5,
            compromisedHosts: 0,
            difficulty: 'medium'
        };
        
        if (this.redTeamAI) {
            this.redTeamAI.reset();
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlueRedGameEngine;
} else if (typeof window !== 'undefined') {
    window.BlueRedGameEngine = BlueRedGameEngine;
}
