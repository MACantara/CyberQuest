// AI Engine - Implements Q-Learning for adaptive Red Team attacks with Adaptive Learning
class AIEngine {
    constructor(gameController) {
        this.gameController = gameController;
        this.isAttacking = false;
        this.attackInterval = null;
        
        // Adaptive Learning Integration
        this.adaptiveLearning = null;
        this.difficulty = 'normal';
        this.playerPerformance = {
            correctActions: 0,
            incorrectActions: 0,
            responseTime: [],
            hintsUsed: 0
        };
        
        // Q-Learning parameters
        this.learningRate = 0.1;
        this.discountFactor = 0.9;
        this.explorationRate = 0.3;
        this.explorationDecay = 0.995;
        this.minExplorationRate = 0.05;
        
        // Q-Table: state-action values
        this.qTable = new Map();
        
        // Attack types based on MITRE ATT&CK
        this.attackTypes = [
            'reconnaissance',
            'initial-access',
            'persistence',
            'privilege-escalation',
            'defense-evasion',
            'credential-access',
            'discovery',
            'lateral-movement',
            'collection',
            'exfiltration',
            'impact'
        ];
        
        // Attack techniques
        this.techniques = {
            'reconnaissance': ['Network Scanning', 'Port Scanning', 'Service Discovery'],
            'initial-access': ['Phishing', 'Exploit Public-Facing Application', 'Drive-by Compromise'],
            'persistence': ['Registry Modification', 'Scheduled Task', 'Service Creation'],
            'privilege-escalation': ['Process Injection', 'Access Token Manipulation', 'Exploitation for Privilege Escalation'],
            'defense-evasion': ['File Deletion', 'Process Hollowing', 'Masquerading'],
            'credential-access': ['Credential Dumping', 'Brute Force', 'Keylogging'],
            'discovery': ['System Information Discovery', 'Account Discovery', 'Network Service Scanning'],
            'lateral-movement': ['Remote Services', 'Internal Spearphishing', 'Lateral Tool Transfer'],
            'collection': ['Data from Local System', 'Screen Capture', 'Audio Capture'],
            'exfiltration': ['Data Encrypted for Impact', 'Exfiltration Over C2 Channel', 'Automated Exfiltration'],
            'impact': ['Data Destruction', 'Defacement', 'Denial of Service']
        };
        
        // Target assets
        this.targets = ['academy-server', 'student-db', 'research-files', 'learning-platform'];
        
        // Initialize adaptive learning
        this.initializeAdaptiveLearning();
        
        // Attack progression - tracks current attack phase
        this.currentPhase = 0;
        this.attackPhases = [
            'reconnaissance',
            'initial-access',
            'persistence',
            'privilege-escalation',
            'discovery',
            'lateral-movement',
            'collection',
            'exfiltration',
            'impact'
        ];
        
        console.log('🤖 AI Engine initialized with Q-Learning');
    }
    
    startAttackSequence() {
        if (this.isAttacking) return;
        
        this.isAttacking = true;
        this.currentPhase = 0;
        
        // Start with reconnaissance
        this.scheduleNextAttack(2000); // Start after 2 seconds
        
        console.log('🤖 AI attack sequence started');
    }
    
    stopAttackSequence() {
        this.isAttacking = false;
        
        if (this.attackInterval) {
            clearTimeout(this.attackInterval);
            this.attackInterval = null;
        }
        
        console.log('🤖 AI attack sequence stopped');
    }
    
    scheduleNextAttack(delay = null) {
        if (!this.isAttacking) return;
        
        // Adaptive delay based on previous attack success
        const baseDelay = 3000; // 3 seconds
        const randomDelay = Math.random() * 2000 + 1000; // 1-3 seconds
        const attackDelay = delay || (baseDelay + randomDelay);
        
        this.attackInterval = setTimeout(() => {
            this.executeAttack();
            this.scheduleNextAttack();
        }, attackDelay);
    }
    
    executeAttack() {
        if (!this.gameController.isGameRunning()) return;
        
        // Get current game state for Q-Learning
        const state = this.getCurrentState();
        
        // Select action using epsilon-greedy strategy
        const action = this.selectAction(state);
        
        // Execute the attack
        const attackData = this.createAttackData(action);
        
        console.log(`🤖 AI executing: ${attackData.technique} on ${attackData.target}`);
        
        // Send attack to game controller
        this.gameController.processAttack(attackData);
        
        // Store state-action pair for learning
        this.lastState = state;
        this.lastAction = action;
        
        // Progress through attack phases
        this.updateAttackPhase();
    }
    
    getCurrentState() {
        const gameState = this.gameController.getGameState();
        
        // Create state representation
        const state = {
            phase: this.currentPhase,
            timeRemaining: Math.floor(gameState.timeRemaining / 60), // Minutes
            assetIntegrity: this.getAverageAssetIntegrity(gameState.assets),
            alertLevel: Math.min(5, gameState.alerts.length),
            securityControlsActive: this.getActiveSecurityControls(gameState.securityControls)
        };
        
        return this.stateToString(state);
    }
    
    getAverageAssetIntegrity(assets) {
        const integrities = Object.values(assets).map(asset => asset.integrity);
        const average = integrities.reduce((sum, integrity) => sum + integrity, 0) / integrities.length;
        return Math.floor(average / 20); // 0-5 scale
    }
    
    getActiveSecurityControls(controls) {
        return Object.values(controls).filter(control => control.active).length;
    }
    
    stateToString(state) {
        return `${state.phase}-${state.timeRemaining}-${state.assetIntegrity}-${state.alertLevel}-${state.securityControlsActive}`;
    }
    
    selectAction(state) {
        // Epsilon-greedy action selection
        if (Math.random() < this.explorationRate) {
            // Explore: random action
            return this.getRandomAction();
        } else {
            // Exploit: best known action for this state
            return this.getBestAction(state);
        }
    }
    
    getRandomAction() {
        const currentAttackType = this.attackPhases[this.currentPhase];
        const availableTechniques = this.techniques[currentAttackType] || this.techniques['reconnaissance'];
        const technique = availableTechniques[Math.floor(Math.random() * availableTechniques.length)];
        const target = this.targets[Math.floor(Math.random() * this.targets.length)];
        
        return {
            type: currentAttackType,
            technique: technique,
            target: target
        };
    }
    
    getBestAction(state) {
        // Get all possible actions for current state
        const possibleActions = this.getPossibleActions();
        
        let bestAction = null;
        let bestValue = -Infinity;
        
        possibleActions.forEach(action => {
            const actionKey = this.actionToString(action);
            const stateActionKey = `${state}-${actionKey}`;
            const qValue = this.qTable.get(stateActionKey) || 0;
            
            if (qValue > bestValue) {
                bestValue = qValue;
                bestAction = action;
            }
        });
        
        return bestAction || this.getRandomAction();
    }
    
    getPossibleActions() {
        const currentAttackType = this.attackPhases[this.currentPhase];
        const availableTechniques = this.techniques[currentAttackType] || this.techniques['reconnaissance'];
        const actions = [];
        
        availableTechniques.forEach(technique => {
            this.targets.forEach(target => {
                actions.push({
                    type: currentAttackType,
                    technique: technique,
                    target: target
                });
            });
        });
        
        return actions;
    }
    
    actionToString(action) {
        return `${action.type}-${action.technique}-${action.target}`;
    }
    
    createAttackData(action) {
        return {
            type: action.type,
            technique: action.technique,
            target: action.target,
            severity: this.calculateSeverity(action.type),
            timestamp: new Date()
        };
    }
    
    calculateSeverity(attackType) {
        const severityMap = {
            'reconnaissance': 'low',
            'initial-access': 'medium',
            'persistence': 'medium',
            'privilege-escalation': 'high',
            'defense-evasion': 'medium',
            'credential-access': 'high',
            'discovery': 'low',
            'lateral-movement': 'high',
            'collection': 'high',
            'exfiltration': 'critical',
            'impact': 'critical'
        };
        
        return severityMap[attackType] || 'medium';
    }
    
    updateAttackPhase() {
        // Progress through phases with some probability
        const progressProbability = 0.3; // 30% chance to advance phase
        
        if (Math.random() < progressProbability && this.currentPhase < this.attackPhases.length - 1) {
            this.currentPhase++;
        }
    }
    
    // Q-Learning update method
    updateQTable(attackData, detected) {
        if (!this.lastState || !this.lastAction) return;
        
        // Calculate reward
        const reward = this.calculateReward(attackData, detected);
        
        // Get current state
        const currentState = this.getCurrentState();
        
        // Q-Learning update formula
        const stateActionKey = `${this.lastState}-${this.actionToString(this.lastAction)}`;
        const currentQValue = this.qTable.get(stateActionKey) || 0;
        
        // Get max Q-value for next state
        const nextStateMaxQ = this.getMaxQValueForState(currentState);
        
        // Update Q-value
        const newQValue = currentQValue + this.learningRate * 
            (reward + this.discountFactor * nextStateMaxQ - currentQValue);
        
        this.qTable.set(stateActionKey, newQValue);
        
        // Decay exploration rate
        this.explorationRate = Math.max(
            this.minExplorationRate,
            this.explorationRate * this.explorationDecay
        );
        
        console.log(`🧠 Q-Learning update: ${stateActionKey} -> ${newQValue.toFixed(3)} (reward: ${reward})`);
    }
    
    calculateReward(attackData, detected) {
        let reward = 0;
        
        if (detected) {
            // Negative reward for getting detected
            reward = -1;
        } else {
            // Positive reward for successful stealth
            reward = 1;
            
            // Bonus for high-value targets
            if (['student-db', 'research-files'].includes(attackData.target)) {
                reward += 0.5;
            }
            
            // Bonus for advanced attack types
            const advancedTypes = ['exfiltration', 'impact', 'lateral-movement'];
            if (advancedTypes.includes(attackData.type)) {
                reward += 0.3;
            }
        }
        
        return reward;
    }
    
    getMaxQValueForState(state) {
        const possibleActions = this.getPossibleActions();
        let maxQ = 0;
        
        possibleActions.forEach(action => {
            const actionKey = this.actionToString(action);
            const stateActionKey = `${state}-${actionKey}`;
            const qValue = this.qTable.get(stateActionKey) || 0;
            maxQ = Math.max(maxQ, qValue);
        });
        
        return maxQ;
    }
    
    // Get AI difficulty based on learning progress
    getDifficulty() {
        const qTableSize = this.qTable.size;
        const maxEntries = this.attackTypes.length * this.targets.length * 10; // Rough estimate
        
        const progress = Math.min(1, qTableSize / maxEntries);
        
        if (progress < 0.3) return { level: 'Normal', value: 30 };
        if (progress < 0.6) return { level: 'Hard', value: 60 };
        return { level: 'Expert', value: 90 };
    }
    
    // Get current AI tactics for display
    getCurrentTactics() {
        const current = this.attackPhases[this.currentPhase];
        const next = this.currentPhase < this.attackPhases.length - 1 ? 
            this.attackPhases[this.currentPhase + 1] : null;
        
        const tactics = [current];
        if (next) tactics.push(next);
        
        return tactics.map(tactic => 
            tactic.charAt(0).toUpperCase() + tactic.slice(1).replace('-', ' ')
        ).join(', ');
    }
    
    reset() {
        this.stopAttackSequence();
        this.currentPhase = 0;
        // Keep Q-table for continued learning
        // Reset performance tracking for new scenario
        this.resetPerformanceTracking();
        console.log('🤖 AI Engine reset');
    }
    
    // Adaptive Learning Integration Methods
    async initializeAdaptiveLearning() {
        try {
            // Initialize adaptive learning for blue team mode
            this.adaptiveLearning = new BlueTeamAdaptiveLearning();
            await this.adaptiveLearning.init();
            
            // Get adaptive difficulty for blue team mode
            this.difficulty = await this.adaptiveLearning.getAdaptiveDifficulty(1, 'blue_team_vs_red_team');
            console.log('AI Engine initialized with adaptive difficulty:', this.difficulty);
            
            // Adjust Q-learning parameters based on difficulty
            this.adjustQLearningParameters();
        } catch (error) {
            console.warn('Adaptive learning initialization failed:', error);
            this.difficulty = 'normal';
        }
    }
    
    adjustQLearningParameters() {
        // Adjust Q-learning parameters based on difficulty
        switch (this.difficulty) {
            case 'easy':
                this.explorationRate = 0.5; // More random, less optimal
                this.learningRate = 0.05;   // Slower learning
                break;
            case 'hard':
                this.explorationRate = 0.1; // More optimal moves
                this.learningRate = 0.2;    // Faster learning
                break;
            case 'expert':
                this.explorationRate = 0.05; // Highly optimal
                this.learningRate = 0.3;     // Very fast learning
                break;
            default: // normal
                this.explorationRate = 0.3;
                this.learningRate = 0.1;
        }
    }
    
    // Record player action for performance analysis
    recordPlayerAction(action, isCorrect, responseTime) {
        if (isCorrect) {
            this.playerPerformance.correctActions++;
            if (this.adaptiveLearning) {
                this.adaptiveLearning.recordSuccess('correct_action', {
                    action: action,
                    response_time: responseTime
                });
            }
        } else {
            this.playerPerformance.incorrectActions++;
            if (this.adaptiveLearning) {
                this.adaptiveLearning.recordMistake('incorrect_action', {
                    action: action,
                    response_time: responseTime
                });
            }
        }
        
        this.playerPerformance.responseTime.push(responseTime);
        
        // Check if difficulty adjustment is needed
        this.checkDifficultyAdjustment();
    }
    
    recordHintUsed() {
        this.playerPerformance.hintsUsed++;
        if (this.adaptiveLearning) {
            this.adaptiveLearning.hintCount++;
        }
    }
    
    analyzePlayerPerformance() {
        const totalActions = this.playerPerformance.correctActions + this.playerPerformance.incorrectActions;
        const accuracy = totalActions > 0 ? this.playerPerformance.correctActions / totalActions : 0;
        const avgResponseTime = this.playerPerformance.responseTime.length > 0 
            ? this.playerPerformance.responseTime.reduce((a, b) => a + b, 0) / this.playerPerformance.responseTime.length
            : 0;

        return {
            accuracy: accuracy,
            avgResponseTime: avgResponseTime,
            hintsUsed: this.playerPerformance.hintsUsed,
            totalActions: totalActions,
            performanceScore: this.calculatePerformanceScore(accuracy, avgResponseTime)
        };
    }
    
    calculatePerformanceScore(accuracy, avgResponseTime) {
        // Performance score from 0-100
        const accuracyScore = accuracy * 70; // 70% weight for accuracy
        const speedScore = Math.max(0, 30 - (avgResponseTime / 1000)) * 1; // 30% weight for speed
        return Math.min(100, accuracyScore + speedScore);
    }
    
    checkDifficultyAdjustment() {
        const performance = this.analyzePlayerPerformance();
        
        // Adjust difficulty based on performance
        if (performance.totalActions >= 5) { // Only adjust after some actions
            if (performance.performanceScore > 85 && this.difficulty !== 'expert') {
                this.increaseDifficulty();
            } else if (performance.performanceScore < 40 && this.difficulty !== 'easy') {
                this.decreaseDifficulty();
            }
        }
    }
    
    increaseDifficulty() {
        const difficulties = ['easy', 'normal', 'hard', 'expert'];
        const currentIndex = difficulties.indexOf(this.difficulty);
        if (currentIndex < difficulties.length - 1) {
            const oldDifficulty = this.difficulty;
            this.difficulty = difficulties[currentIndex + 1];
            this.adjustQLearningParameters();
            
            if (this.adaptiveLearning) {
                this.adaptiveLearning.logAction('difficulty_increased', {
                    old_difficulty: oldDifficulty,
                    new_difficulty: this.difficulty,
                    performance_score: this.analyzePlayerPerformance().performanceScore
                });
            }
            this.showDifficultyChangeMessage('increased');
        }
    }
    
    decreaseDifficulty() {
        const difficulties = ['easy', 'normal', 'hard', 'expert'];
        const currentIndex = difficulties.indexOf(this.difficulty);
        if (currentIndex > 0) {
            const oldDifficulty = this.difficulty;
            this.difficulty = difficulties[currentIndex - 1];
            this.adjustQLearningParameters();
            
            if (this.adaptiveLearning) {
                this.adaptiveLearning.logAction('difficulty_decreased', {
                    old_difficulty: oldDifficulty,
                    new_difficulty: this.difficulty,
                    performance_score: this.analyzePlayerPerformance().performanceScore
                });
            }
            this.showDifficultyChangeMessage('decreased');
        }
    }
    
    showDifficultyChangeMessage(change) {
        const message = change === 'increased' 
            ? `🔥 Red Team is adapting! Challenge increased.`
            : `💪 Red Team difficulty adjusted to help you learn.`;
        
        this.showNotification(message, change === 'increased' ? 'warning' : 'info');
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `blue-team-notification ${type}`;
        notification.innerHTML = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'warning' ? '#ff6b6b' : '#4ecdc4'};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-weight: bold;
            animation: slideDown 0.3s ease-out;
        `;

        // Add animation styles if not already present
        if (!document.querySelector('#blue-team-styles')) {
            const style = document.createElement('style');
            style.id = 'blue-team-styles';
            style.textContent = `
                @keyframes slideDown {
                    from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
                    to { transform: translateX(-50%) translateY(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 4000);
    }
    
    resetPerformanceTracking() {
        this.playerPerformance = {
            correctActions: 0,
            incorrectActions: 0,
            responseTime: [],
            hintsUsed: 0
        };
    }
    
    // Complete blue team scenario and update adaptive learning
    async completeScenario(score, timeSpent) {
        if (!this.adaptiveLearning) return null;
        
        const performance = this.analyzePlayerPerformance();
        
        const completionData = {
            level_id: 1, // Blue team mode level 1
            level_type: 'blue_team_vs_red_team',
            score: score,
            time_spent: timeSpent,
            hints_used: this.playerPerformance.hintsUsed,
            mistakes_made: this.playerPerformance.incorrectActions,
            difficulty: this.difficulty,
            performance_metrics: performance
        };
        
        return await this.adaptiveLearning.completeLevel(1, score, 'blue_team_vs_red_team');
    }
    
    // Export Q-table for analysis (development/debugging)
    exportQTable() {
        return Object.fromEntries(this.qTable);
    }
}

/**
 * Adaptive Learning Manager specifically for Blue Team vs Red Team Mode
 */
class BlueTeamAdaptiveLearning {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.hintCount = 0;
        this.learningPreferences = null;
    }

    generateSessionId() {
        return 'blue_team_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    async init() {
        await this.loadLearningPreferences();
        this.logAction('blue_team_session_start', {
            timestamp: new Date().toISOString()
        });
    }

    async loadLearningPreferences() {
        try {
            const response = await fetch('/api/adaptive/preferences');
            if (response.ok) {
                const data = await response.json();
                this.learningPreferences = data.preferences;
            }
        } catch (error) {
            console.warn('Failed to load learning preferences:', error);
            this.learningPreferences = {
                learning_style: 'balanced',
                difficulty_preference: 'adaptive',
                hint_frequency: 'normal'
            };
        }
    }

    async getAdaptiveDifficulty(levelId, levelType) {
        try {
            const response = await fetch(`/api/adaptive/difficulty/${levelId}?level_type=${levelType}`);
            if (response.ok) {
                const data = await response.json();
                return data.difficulty;
            }
        } catch (error) {
            console.warn('Failed to get adaptive difficulty:', error);
        }
        return 'normal';
    }

    recordMistake(mistakeType, details = {}) {
        this.logAction('blue_team_mistake', {
            mistake_type: mistakeType,
            details: details
        });
    }

    recordSuccess(successType, details = {}) {
        this.logAction('blue_team_success', {
            success_type: successType,
            details: details
        });
    }

    async completeLevel(levelId, score, levelType) {
        const timeSpent = Math.floor((Date.now() - this.startTime) / 1000);
        
        const completionData = {
            level_id: levelId,
            level_type: levelType,
            score: score,
            time_spent: timeSpent,
            hints_used: this.hintCount
        };

        try {
            const response = await fetch('/api/adaptive/progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(completionData)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Blue team progress updated:', result);
                return result;
            }
        } catch (error) {
            console.error('Failed to update blue team progress:', error);
        }

        this.logAction('blue_team_complete', completionData);
        return null;
    }

    async logAction(actionType, actionData = {}) {
        try {
            await fetch('/api/adaptive/analytics/log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    level_id: 1,
                    action_type: actionType,
                    action_data: actionData,
                    level_type: 'blue_team_vs_red_team'
                })
            });
        } catch (error) {
            console.warn('Failed to log blue team action:', error);
        }
    }
}

export { AIEngine, BlueTeamAdaptiveLearning };
