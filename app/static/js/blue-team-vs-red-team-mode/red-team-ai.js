// Red Team AI implementation
class RedTeamAI {
    constructor() {
        this.state = 'reconnaissance';
        this.personality = 'aggressive'; // 'aggressive' or 'stealthy'
        this.knownAssets = [];
        this.access = new Set();
        this.objectives = [];
        this.lastActionTime = 0;
        this.actionCooldown = 3000; // 3 seconds between actions
        this.stealthLevel = 1; // 1-5, affects detection probability
        
        // Attack vectors and their success probabilities
        this.attackVectors = {
            reconnaissance: [
                { name: 'network_scan', probability: 0.9, detection: 0.3 },
                { name: 'osint_gathering', probability: 0.8, detection: 0.1 },
                { name: 'service_enumeration', probability: 0.7, detection: 0.4 }
            ],
            initial_access: [
                { name: 'phishing', probability: 0.6, detection: 0.5 },
                { name: 'exploit_vulnerability', probability: 0.8, detection: 0.7 },
                { name: 'brute_force', probability: 0.3, detection: 0.9 },
                { name: 'social_engineering', probability: 0.5, detection: 0.2 }
            ],
            establish_foothold: [
                { name: 'install_backdoor', probability: 0.7, detection: 0.4 },
                { name: 'create_scheduled_task', probability: 0.8, detection: 0.3 },
                { name: 'modify_registry', probability: 0.6, detection: 0.5 }
            ],
            lateral_movement: [
                { name: 'credential_reuse', probability: 0.6, detection: 0.6 },
                { name: 'network_pivoting', probability: 0.5, detection: 0.7 },
                { name: 'smb_traversal', probability: 0.4, detection: 0.8 }
            ],
            privilege_escalation: [
                { name: 'exploit_elevation', probability: 0.5, detection: 0.6 },
                { name: 'token_theft', probability: 0.4, detection: 0.7 },
                { name: 'service_manipulation', probability: 0.6, detection: 0.5 }
            ],
            action_on_objectives: [
                { name: 'data_exfiltration', probability: 0.7, detection: 0.8 },
                { name: 'service_disruption', probability: 0.8, detection: 0.9 },
                { name: 'credential_harvesting', probability: 0.6, detection: 0.4 }
            ]
        };
        
        this.init();
    }
    
    init() {
        this.setPersonality(this.personality);
    }
    
    setPersonality(personality) {
        this.personality = personality;
        
        if (personality === 'stealthy') {
            // Stealthy attackers reduce detection probability but take longer
            this.actionCooldown = 5000;
            this.stealthLevel = 4;
            this.modifyAttackVectors(0.8, 0.5); // Lower success, much lower detection
        } else if (personality === 'aggressive') {
            // Aggressive attackers are faster but more detectable
            this.actionCooldown = 2000;
            this.stealthLevel = 1;
            this.modifyAttackVectors(1.2, 1.5); // Higher success, higher detection
        }
    }
    
    modifyAttackVectors(successMultiplier, detectionMultiplier) {
        Object.keys(this.attackVectors).forEach(phase => {
            this.attackVectors[phase].forEach(vector => {
                vector.probability = Math.min(1, vector.probability * successMultiplier);
                vector.detection = Math.min(1, vector.detection * detectionMultiplier);
            });
        });
    }
    
    canTakeAction() {
        return Date.now() - this.lastActionTime > this.actionCooldown;
    }
    
    selectNextAction(gameState) {
        if (!this.canTakeAction()) {
            return null;
        }
        
        const availableActions = this.attackVectors[this.state] || [];
        if (availableActions.length === 0) {
            return null;
        }
        
        // Weight actions based on game state and personality
        const weightedActions = this.calculateActionWeights(availableActions, gameState);
        
        // Select action using weighted random selection
        const selectedAction = this.weightedRandomSelect(weightedActions);
        
        if (selectedAction) {
            this.lastActionTime = Date.now();
            return this.executeAction(selectedAction, gameState);
        }
        
        return null;
    }
    
    calculateActionWeights(actions, gameState) {
        return actions.map(action => {
            let weight = action.probability;
            
            // Adjust weight based on game state
            if (gameState.blueTeamAlertness > 0.7) {
                // Blue team is alert, reduce risky actions
                weight *= (1 - action.detection);
            }
            
            if (gameState.compromisedHosts > 0 && this.state === 'initial_access') {
                // Already have access, transition faster
                weight *= 1.5;
            }
            
            // Personality adjustments
            if (this.personality === 'stealthy') {
                weight *= (1 - action.detection * 0.5);
            } else if (this.personality === 'aggressive') {
                weight *= action.probability;
            }
            
            return { ...action, weight };
        });
    }
    
    weightedRandomSelect(weightedActions) {
        const totalWeight = weightedActions.reduce((sum, action) => sum + action.weight, 0);
        if (totalWeight <= 0) return null;
        
        let random = Math.random() * totalWeight;
        
        for (const action of weightedActions) {
            random -= action.weight;
            if (random <= 0) {
                return action;
            }
        }
        
        return weightedActions[weightedActions.length - 1];
    }
    
    executeAction(action, gameState) {
        const success = Math.random() < action.probability;
        const detected = Math.random() < (action.detection / this.stealthLevel);
        
        const result = {
            action: action.name,
            state: this.state,
            success: success,
            detected: detected,
            personality: this.personality,
            timestamp: Date.now()
        };
        
        // State transitions based on action success
        if (success) {
            this.handleSuccessfulAction(action, gameState);
        } else {
            this.handleFailedAction(action, gameState);
        }
        
        // Generate alerts based on detection
        if (detected) {
            result.alert = this.generateAlert(action, success);
        }
        
        return result;
    }
    
    handleSuccessfulAction(action, gameState) {
        switch (this.state) {
            case 'reconnaissance':
                this.knownAssets.push(...gameState.availableTargets);
                if (this.knownAssets.length >= 2) {
                    this.state = 'initial_access';
                }
                break;
                
            case 'initial_access':
                this.access.add(gameState.targetHost);
                this.state = 'establish_foothold';
                break;
                
            case 'establish_foothold':
                this.state = 'lateral_movement';
                break;
                
            case 'lateral_movement':
                if (this.access.size >= 2) {
                    this.state = 'privilege_escalation';
                }
                break;
                
            case 'privilege_escalation':
                this.state = 'action_on_objectives';
                break;
                
            case 'action_on_objectives':
                // Mission accomplished, could cycle back or end
                if (Math.random() < 0.3) {
                    this.state = 'reconnaissance'; // Start new attack chain
                }
                break;
        }
    }
    
    handleFailedAction(action, gameState) {
        // Failed actions might cause state changes or delays
        if (this.state === 'initial_access' && action.name === 'brute_force') {
            // Brute force failure might trigger lockout
            this.actionCooldown *= 2; // Double cooldown
        }
        
        // Stealthy attackers might retreat on failure
        if (this.personality === 'stealthy' && Math.random() < 0.3) {
            this.state = 'reconnaissance'; // Go back to recon
        }
    }
    
    generateAlert(action, success) {
        const alertTemplates = {
            network_scan: {
                type: 'intrusion',
                severity: 'medium',
                message: 'Suspicious network scanning activity detected',
                source: 'IDS'
            },
            phishing: {
                type: 'email',
                severity: success ? 'high' : 'medium',
                message: success ? 'Phishing email successfully delivered' : 'Phishing attempt blocked',
                source: 'Email Security'
            },
            exploit_vulnerability: {
                type: 'intrusion',
                severity: 'high',
                message: 'Vulnerability exploitation attempt detected',
                source: 'EDR'
            },
            brute_force: {
                type: 'authentication',
                severity: 'high',
                message: 'Multiple failed login attempts detected',
                source: 'Authentication System'
            },
            install_backdoor: {
                type: 'malware',
                severity: 'high',
                message: 'Suspicious file installation detected',
                source: 'Antivirus'
            },
            data_exfiltration: {
                type: 'data',
                severity: 'critical',
                message: 'Unusual data transfer patterns detected',
                source: 'DLP'
            }
        };
        
        return alertTemplates[action.name] || {
            type: 'unknown',
            severity: 'medium',
            message: 'Suspicious activity detected',
            source: 'Security Monitor'
        };
    }
    
    adaptToBlueTeamActions(blueTeamActions) {
        blueTeamActions.forEach(action => {
            switch (action.type) {
                case 'patch':
                    // Patching reduces our success probability
                    this.reduceActionProbabilities(['exploit_vulnerability'], 0.5);
                    break;
                    
                case 'quarantine':
                    // Quarantine removes our access
                    this.access.delete(action.target);
                    if (this.access.size === 0 && this.state !== 'reconnaissance') {
                        this.state = 'reconnaissance'; // Reset if all access lost
                    }
                    break;
                    
                case 'investigation':
                    // Investigation increases blue team alertness
                    if (this.personality === 'stealthy') {
                        this.actionCooldown *= 1.5;
                    }
                    break;
                    
                case 'scan':
                    // Blue team scanning might reveal our activities
                    if (this.state === 'reconnaissance') {
                        this.stealthLevel = Math.max(1, this.stealthLevel - 1);
                    }
                    break;
            }
        });
    }
    
    reduceActionProbabilities(actionNames, factor) {
        Object.keys(this.attackVectors).forEach(phase => {
            this.attackVectors[phase].forEach(vector => {
                if (actionNames.includes(vector.name)) {
                    vector.probability *= factor;
                }
            });
        });
    }
    
    getState() {
        return {
            currentState: this.state,
            personality: this.personality,
            knownAssets: this.knownAssets.length,
            access: this.access.size,
            stealthLevel: this.stealthLevel,
            lastAction: this.lastActionTime
        };
    }
    
    reset() {
        this.state = 'reconnaissance';
        this.knownAssets = [];
        this.access.clear();
        this.lastActionTime = 0;
        this.stealthLevel = this.personality === 'stealthy' ? 4 : 1;
        this.actionCooldown = this.personality === 'stealthy' ? 5000 : 2000;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RedTeamAI;
} else if (typeof window !== 'undefined') {
    window.RedTeamAI = RedTeamAI;
}
