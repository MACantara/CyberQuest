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
                weight *= (1 - action.detection * 0.5);
            }
            
            // Encourage spreading to multiple hosts
            const uncompromisedHosts = gameState.availableTargets ? 
                gameState.availableTargets.filter(host => !this.access.has(host)) : [];
            
            if (this.state === 'initial_access' && uncompromisedHosts.length > 0) {
                // Boost weight for initial access actions when targets are available
                weight *= 1.3;
            }
            
            if (this.state === 'lateral_movement' && uncompromisedHosts.length > 0) {
                // Strongly encourage lateral movement when targets remain
                weight *= 1.5;
            }
            
            // Reduce weight for actions if we already have significant access and no targets remain
            if (this.access.size >= 2 && uncompromisedHosts.length === 0) {
                if (this.state === 'initial_access' || this.state === 'lateral_movement') {
                    weight *= 0.3; // Reduce these actions when no more targets
                }
            }
            
            // Personality adjustments
            if (this.personality === 'stealthy') {
                weight *= (1 - action.detection * 0.3);
            } else if (this.personality === 'aggressive') {
                weight *= action.probability * 1.2;
                // Aggressive personality prefers spreading attacks
                if ((this.state === 'initial_access' || this.state === 'lateral_movement') 
                    && uncompromisedHosts.length > 0) {
                    weight *= 1.4;
                }
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
                if (this.knownAssets.length >= 1) {
                    this.state = 'initial_access';
                }
                break;
                
            case 'initial_access':
                if (action.name === 'exploit_vulnerability' || action.name === 'phishing' || 
                    action.name === 'brute_force' || action.name === 'social_engineering') {
                    this.access.add(gameState.targetHost);
                    
                    // Determine next state based on goals and current situation
                    const uncompromisedHosts = gameState.availableTargets.filter(host => 
                        !this.access.has(host) && 
                        gameState.hosts && gameState.hosts[host] && 
                        !gameState.hosts[host].compromised
                    );
                    
                    if (this.access.size === 1) {
                        // First compromise - establish foothold
                        this.state = 'establish_foothold';
                    } else if (uncompromisedHosts.length > 0 && Math.random() < 0.7) {
                        // Still targets available - continue attacking (70% chance)
                        this.state = 'lateral_movement';
                    } else {
                        // Move to establish foothold for current compromise
                        this.state = 'establish_foothold';
                    }
                }
                break;
                
            case 'establish_foothold':
                // After establishing foothold, decide next action
                const availableTargets = gameState.availableTargets.filter(host => 
                    !this.access.has(host) && 
                    gameState.hosts && gameState.hosts[host] && 
                    !gameState.hosts[host].compromised
                );
                
                if (availableTargets.length > 0 && this.access.size < 3) {
                    // More targets available and haven't compromised too many yet
                    if (Math.random() < 0.6) {
                        this.state = 'lateral_movement'; // Try to spread
                    } else {
                        this.state = 'privilege_escalation'; // Deepen current access
                    }
                } else {
                    this.state = 'privilege_escalation';
                }
                break;
                
            case 'lateral_movement':
                if (action.name === 'credential_reuse' || action.name === 'network_pivoting' || 
                    action.name === 'smb_traversal') {
                    // Successful lateral movement - try to compromise another host
                    this.state = 'initial_access';
                } else {
                    // Continue lateral movement or escalate
                    if (this.access.size >= 2) {
                        this.state = 'privilege_escalation';
                    }
                }
                break;
                
            case 'privilege_escalation':
                // After privilege escalation, either continue spreading or achieve objectives
                const remainingTargets = gameState.availableTargets.filter(host => 
                    !this.access.has(host) && 
                    gameState.hosts && gameState.hosts[host] && 
                    !gameState.hosts[host].compromised
                );
                
                if (remainingTargets.length > 0 && this.access.size < gameState.availableTargets.length && Math.random() < 0.4) {
                    // 40% chance to continue spreading if targets remain
                    this.state = 'lateral_movement';
                } else {
                    this.state = 'action_on_objectives';
                }
                break;
                
            case 'action_on_objectives':
                // After completing objectives, decide whether to continue or start new attack chain
                const stillAvailableTargets = gameState.availableTargets.filter(host => 
                    !this.access.has(host) && 
                    gameState.hosts && gameState.hosts[host] && 
                    !gameState.hosts[host].compromised
                );
                
                if (stillAvailableTargets.length > 0 && Math.random() < 0.5) {
                    // 50% chance to continue attacking if targets remain
                    this.state = 'lateral_movement';
                } else if (Math.random() < 0.3) {
                    // 30% chance to start completely fresh
                    this.state = 'reconnaissance';
                } else {
                    // Otherwise continue with objectives on current compromised hosts
                    // Stay in current state for continued data exfiltration, etc.
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
            },
            credential_reuse: {
                type: 'authentication',
                severity: 'high',
                message: 'Suspicious credential usage detected',
                source: 'Identity Management'
            },
            network_pivoting: {
                type: 'intrusion',
                severity: 'high',
                message: 'Unusual network traversal detected',
                source: 'Network Monitor'
            },
            smb_traversal: {
                type: 'intrusion',
                severity: 'medium',
                message: 'SMB traffic anomaly detected',
                source: 'Network Monitor'
            },
            service_disruption: {
                type: 'availability',
                severity: 'critical',
                message: 'Service disruption detected',
                source: 'Service Monitor'
            },
            create_scheduled_task: {
                type: 'persistence',
                severity: 'high',
                message: 'Suspicious scheduled task created',
                source: 'System Monitor'
            },
            modify_registry: {
                type: 'persistence',
                severity: 'medium',
                message: 'Unauthorized registry modification detected',
                source: 'System Monitor'
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
