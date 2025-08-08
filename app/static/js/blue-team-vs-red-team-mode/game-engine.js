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
            hosts: this.gameState.hosts, // Add hosts data for AI logic
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
            case 'brute_force':
            case 'social_engineering':
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
                
            case 'credential_reuse':
            case 'network_pivoting':
            case 'smb_traversal':
                // Lateral movement can compromise additional hosts
                const availableHosts = Object.keys(this.gameState.hosts).filter(hostId => 
                    !this.gameState.hosts[hostId].compromised &&
                    this.gameState.hosts[hostId].status !== 'quarantined'
                );
                
                if (availableHosts.length > 0) {
                    const newTarget = availableHosts[Math.floor(Math.random() * availableHosts.length)];
                    this.gameState.hosts[newTarget].compromised = true;
                    this.emitEvent('hostCompromised', { host: newTarget });
                }
                break;
                
            case 'install_backdoor':
            case 'create_scheduled_task':
            case 'modify_registry':
                // Persistence actions - already compromised host becomes more entrenched
                const compromisedHost = this.selectCompromisedHost();
                if (compromisedHost && this.gameState.hosts[compromisedHost]) {
                    this.gameState.hosts[compromisedHost].persistence = true;
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
                
            case 'credential_harvesting':
                // Credential harvesting makes future attacks more likely
                this.gameState.score = Math.max(0, this.gameState.score - 25);
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
        const sessionDuration = this.gameState.duration;
        const alertsHandled = this.gameState.alerts.filter(a => a.handled).length;
        const totalAlerts = this.gameState.alerts.length;
        
        // LOSS CONDITIONS
        
        // 1. All systems compromised - Immediate defeat
        if (compromisedCount >= totalHosts) {
            this.endGame('defeat', 'CRITICAL FAILURE: All systems have been compromised by the Red Team');
            return;
        }
        
        // 2. More than 75% of systems compromised - Defeat
        if (totalHosts > 0 && (compromisedCount / totalHosts) >= 0.75) {
            this.endGame('defeat', 'MAJOR BREACH: Over 75% of systems compromised - mission failed');
            return;
        }
        
        // 3. Too many unhandled critical alerts (security failure)
        const criticalAlerts = this.gameState.alerts.filter(a => a.severity === 'critical' || a.severity === 'high');
        const unhandledCritical = criticalAlerts.filter(a => !a.handled);
        if (unhandledCritical.length >= 5) {
            this.endGame('defeat', 'SECURITY BREAKDOWN: Too many critical alerts left unhandled');
            return;
        }
        
        // VICTORY CONDITIONS
        
        // 1. Time-based victory (10 minutes survived with good defense)
        if (sessionDuration > 600000) { // 10 minutes
            const compromiseRate = compromisedCount / totalHosts;
            const alertHandlingRate = totalAlerts > 0 ? alertsHandled / totalAlerts : 1;
            
            if (compromiseRate <= 0.25 && alertHandlingRate >= 0.7) {
                this.endGame('victory', 'EXCELLENT DEFENSE: Successfully defended against sustained Red Team attacks');
                return;
            } else if (compromiseRate <= 0.5 && alertHandlingRate >= 0.5) {
                this.endGame('partial_victory', 'GOOD DEFENSE: Maintained acceptable security posture under attack');
                return;
            } else {
                this.endGame('defeat', 'INSUFFICIENT DEFENSE: Failed to maintain adequate security during the session');
                return;
            }
        }
        
        // 2. Perfect defense victory (8 minutes with no compromises)
        if (sessionDuration > 480000 && compromisedCount === 0) { // 8 minutes, no compromises
            this.endGame('perfect_victory', 'PERFECT DEFENSE: Zero systems compromised - outstanding performance!');
            return;
        }
        
        // 3. Score-based early victory (very high score indicates excellent response)
        if (this.gameState.score >= 500 && sessionDuration > 300000) { // 5 minutes minimum
            const compromiseRate = compromisedCount / totalHosts;
            if (compromiseRate <= 0.33) {
                this.endGame('victory', 'EXCEPTIONAL RESPONSE: High score with effective defense achieved');
                return;
            }
        }
        
        // 4. Red Team gives up (no successful actions for extended period)
        const recentRedTeamActions = this.gameState.redTeamActions.filter(action => 
            action.timestamp > Date.now() - 120000 && action.success // Last 2 minutes
        );
        if (sessionDuration > 300000 && recentRedTeamActions.length === 0 && this.gameState.redTeamActions.length > 5) {
            this.endGame('victory', 'RED TEAM RETREAT: Effective defenses forced the attackers to withdraw');
            return;
        }
    }
    
    endGame(result, reason) {
        this.gameState.isActive = false;
        this.stopGameLoop();
        
        // Calculate final performance metrics
        const totalHosts = Object.keys(this.gameState.hosts).length;
        const compromisedCount = this.gameState.compromisedHosts;
        const alertHandlingRate = this.gameState.alerts.length > 0 ? 
            this.gameState.alerts.filter(a => a.handled).length / this.gameState.alerts.length : 1;
        const systemUptime = totalHosts > 0 ? 
            ((totalHosts - compromisedCount) / totalHosts) * 100 : 100;
        
        // Calculate bonus scores based on result
        let bonusScore = 0;
        switch (result) {
            case 'perfect_victory':
                bonusScore = 200;
                break;
            case 'victory':
                bonusScore = 100;
                break;
            case 'partial_victory':
                bonusScore = 50;
                break;
            case 'defeat':
                bonusScore = -50;
                break;
        }
        
        const finalScore = this.gameState.score + bonusScore;
        
        const endData = {
            result: result,
            reason: reason,
            finalScore: finalScore,
            bonusScore: bonusScore,
            baseScore: this.gameState.score,
            duration: this.gameState.duration,
            durationMinutes: Math.floor(this.gameState.duration / 60000),
            durationSeconds: Math.floor((this.gameState.duration % 60000) / 1000),
            compromisedHosts: compromisedCount,
            totalHosts: totalHosts,
            systemUptime: systemUptime.toFixed(1),
            totalAlerts: this.gameState.alerts.length,
            handledAlerts: this.gameState.alerts.filter(a => a.handled).length,
            alertHandlingRate: (alertHandlingRate * 100).toFixed(1),
            avgResponseTime: this.calculateAverageResponseTime(),
            detectionSpeed: this.calculateDetectionSpeed(),
            recommendedActions: this.generateRecommendations(result, compromisedCount, alertHandlingRate)
        };
        
        this.emitEvent('gameEnded', endData);
        
        // Update the UI with game over information
        if (typeof showGameOverModal === 'function') {
            showGameOverModal(endData);
        } else {
            console.log('Game Over:', endData);
        }
    }
    
    calculateAverageResponseTime() {
        const handledAlerts = this.gameState.alerts.filter(a => a.handled);
        if (handledAlerts.length === 0) return 'N/A';
        
        // Simulate response times based on handling efficiency
        const totalTime = handledAlerts.length * 45; // Average 45 seconds per alert
        return `${Math.floor(totalTime / handledAlerts.length)}s`;
    }
    
    calculateDetectionSpeed() {
        const totalAlerts = this.gameState.alerts.length;
        if (totalAlerts === 0) return 'N/A';
        
        // Simulate detection speed based on alert frequency
        const detectionRate = totalAlerts / (this.gameState.duration / 60000); // alerts per minute
        if (detectionRate > 2) return 'Fast';
        if (detectionRate > 1) return 'Good';
        return 'Slow';
    }
    
    generateRecommendations(result, compromisedCount, alertHandlingRate) {
        const recommendations = [];
        
        if (result.includes('defeat')) {
            if (compromisedCount > 2) {
                recommendations.push('Focus on faster incident response and containment');
                recommendations.push('Implement better network segmentation');
            }
            if (alertHandlingRate < 0.5) {
                recommendations.push('Improve alert triage and investigation processes');
                recommendations.push('Prioritize high-severity alerts first');
            }
            recommendations.push('Consider more proactive patching schedules');
        } else {
            if (alertHandlingRate === 1) {
                recommendations.push('Excellent alert handling - maintain this performance');
            }
            if (compromisedCount === 0) {
                recommendations.push('Perfect defense execution - outstanding work');
            }
            recommendations.push('Continue monitoring for emerging threats');
        }
        
        return recommendations;
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
