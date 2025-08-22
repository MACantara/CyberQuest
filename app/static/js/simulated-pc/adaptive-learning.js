/**
 * Adaptive Learning Manager for Simulated PC Environment
 * Handles adaptive learning features within the simulated PC experience
 */

class SimulatedPCAdaptiveLearning {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.strugglingStartTime = null;
        this.hintCount = 0;
        this.mistakeCount = 0;
        this.currentLevelId = null;
        this.currentDifficulty = 'normal';
        this.learningPreferences = null;
        this.tutorialConfig = null;
        
        this.init();
    }

    async init() {
        // Load user preferences and tutorial configuration
        await this.loadLearningPreferences();
        await this.loadTutorialConfig();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Log session start
        this.logAction('session_start', {
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent
        });
    }

    generateSessionId() {
        return 'sim_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    async loadLearningPreferences() {
        try {
            const response = await fetch('/api/adaptive/preferences');
            if (response.ok) {
                const data = await response.json();
                this.learningPreferences = data.preferences;
                console.log('Loaded learning preferences:', this.learningPreferences);
            }
        } catch (error) {
            console.warn('Failed to load learning preferences:', error);
            // Use defaults
            this.learningPreferences = {
                learning_style: 'balanced',
                difficulty_preference: 'adaptive',
                hint_frequency: 'normal',
                preferred_pace: 'normal',
                tutorial_skip_allowed: false
            };
        }
    }

    async loadTutorialConfig(tutorialType = 'general') {
        try {
            const response = await fetch(`/api/adaptive/tutorial/config/${tutorialType}`);
            if (response.ok) {
                const data = await response.json();
                this.tutorialConfig = data.config;
                console.log('Loaded tutorial config:', this.tutorialConfig);
            }
        } catch (error) {
            console.warn('Failed to load tutorial config:', error);
        }
    }

    async getAdaptiveDifficulty(levelId, levelType = 'simulation') {
        try {
            const response = await fetch(`/api/adaptive/difficulty/${levelId}?level_type=${levelType}`);
            if (response.ok) {
                const data = await response.json();
                this.currentDifficulty = data.difficulty;
                console.log(`Adaptive difficulty for level ${levelId}: ${this.currentDifficulty}`);
                return this.currentDifficulty;
            }
        } catch (error) {
            console.warn('Failed to get adaptive difficulty:', error);
            return 'normal';
        }
    }

    setupEventListeners() {
        // Track user interactions for adaptive feedback
        document.addEventListener('click', (event) => {
            this.handleUserInteraction('click', event);
        });

        document.addEventListener('keydown', (event) => {
            this.handleUserInteraction('keydown', event);
        });

        // Track window focus/blur for engagement analysis
        window.addEventListener('focus', () => {
            this.logAction('window_focus');
        });

        window.addEventListener('blur', () => {
            this.logAction('window_blur');
        });

        // Track when user seems to be struggling
        this.setupStruggleDetection();
    }

    setupStruggleDetection() {
        let lastInteractionTime = Date.now();
        let interactionCount = 0;

        const checkStruggle = () => {
            const now = Date.now();
            const timeSinceLastInteraction = now - lastInteractionTime;

            // If no interaction for more than 30 seconds, consider struggling
            if (timeSinceLastInteraction > 30000 && !this.strugglingStartTime) {
                this.strugglingStartTime = now;
                this.handleStruggling();
            } else if (timeSinceLastInteraction < 10000) {
                this.strugglingStartTime = null;
            }
        };

        // Update interaction tracking
        document.addEventListener('mousemove', () => {
            lastInteractionTime = Date.now();
            interactionCount++;
        });

        document.addEventListener('click', () => {
            lastInteractionTime = Date.now();
            interactionCount++;
        });

        // Check struggle every 5 seconds
        setInterval(checkStruggle, 5000);
    }

    async handleStruggling() {
        if (!this.strugglingStartTime) return;

        const struggleTime = Math.floor((Date.now() - this.strugglingStartTime) / 1000);
        
        try {
            const response = await fetch(`/api/adaptive/hint/should-show?struggle_time=${struggleTime}`);
            if (response.ok) {
                const data = await response.json();
                if (data.should_show_hint) {
                    this.offerHint(struggleTime);
                }
            }
        } catch (error) {
            console.warn('Failed to check hint timing:', error);
        }

        this.logAction('struggling', {
            struggle_time: struggleTime,
            hint_offered: true
        });
    }

    offerHint(struggleTime) {
        // Create adaptive hint based on learning preferences
        const hintStyle = this.learningPreferences?.learning_style || 'balanced';
        const hintFrequency = this.learningPreferences?.hint_frequency || 'normal';

        if (hintFrequency === 'minimal' && struggleTime < 120) {
            return; // Don't offer hint yet for minimal frequency
        }

        this.showAdaptiveHint(hintStyle);
    }

    showAdaptiveHint(style) {
        // Different hint styles based on learning preference
        let hintContent = '';
        let hintClass = 'adaptive-hint';

        switch (style) {
            case 'visual':
                hintContent = this.getVisualHint();
                hintClass += ' visual-hint';
                break;
            case 'hands_on':
                hintContent = this.getInteractiveHint();
                hintClass += ' interactive-hint';
                break;
            case 'theoretical':
                hintContent = this.getTheoreticalHint();
                hintClass += ' theoretical-hint';
                break;
            default:
                hintContent = this.getBalancedHint();
                hintClass += ' balanced-hint';
        }

        this.displayHint(hintContent, hintClass);
        this.hintCount++;
        this.logAction('hint_used', {
            hint_style: style,
            hint_count: this.hintCount,
            struggle_time: this.strugglingStartTime ? Math.floor((Date.now() - this.strugglingStartTime) / 1000) : 0
        });
    }

    getVisualHint() {
        return {
            type: 'visual',
            content: 'Look for visual indicators such as highlighted areas, icons, or color changes that might guide you.',
            icon: '👁️'
        };
    }

    getInteractiveHint() {
        return {
            type: 'interactive',
            content: 'Try clicking on different elements to see what happens. Exploration is key to learning!',
            icon: '🖱️'
        };
    }

    getTheoreticalHint() {
        return {
            type: 'theoretical',
            content: 'Consider the cybersecurity principles involved in this scenario. What would be the best practice approach?',
            icon: '📚'
        };
    }

    getBalancedHint() {
        return {
            type: 'balanced',
            content: 'Take a step back and observe the current situation. What seems out of place or needs attention?',
            icon: '💡'
        };
    }

    displayHint(hintContent, hintClass) {
        // Remove existing hints
        const existingHints = document.querySelectorAll('.adaptive-hint');
        existingHints.forEach(hint => hint.remove());

        // Create hint element
        const hintElement = document.createElement('div');
        hintElement.className = hintClass;
        hintElement.innerHTML = `
            <div class="hint-header">
                <span class="hint-icon">${hintContent.icon}</span>
                <span class="hint-title">Adaptive Hint</span>
                <button class="hint-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="hint-content">${hintContent.content}</div>
            <div class="hint-footer">
                <small>Hint ${this.hintCount} • Style: ${hintContent.type}</small>
            </div>
        `;

        // Style the hint
        hintElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            max-width: 300px;
            background: #f8f9fa;
            border: 2px solid #007bff;
            border-radius: 10px;
            padding: 15px;
            box-shadow: 0 4px 15px rgba(0,123,255,0.3);
            z-index: 10000;
            font-family: 'Segoe UI', sans-serif;
            animation: slideInRight 0.3s ease-out;
        `;

        // Add CSS animation
        if (!document.querySelector('#adaptive-hint-styles')) {
            const style = document.createElement('style');
            style.id = 'adaptive-hint-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .hint-header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                    font-weight: bold;
                }
                .hint-icon {
                    margin-right: 8px;
                    font-size: 18px;
                }
                .hint-title {
                    flex-grow: 1;
                    color: #007bff;
                }
                .hint-close {
                    background: none;
                    border: none;
                    font-size: 18px;
                    cursor: pointer;
                    color: #6c757d;
                }
                .hint-close:hover {
                    color: #dc3545;
                }
                .hint-content {
                    margin-bottom: 10px;
                    line-height: 1.4;
                    color: #495057;
                }
                .hint-footer {
                    color: #6c757d;
                    font-size: 12px;
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(hintElement);

        // Auto-remove after 15 seconds
        setTimeout(() => {
            if (hintElement.parentNode) {
                hintElement.remove();
            }
        }, 15000);
    }

    handleUserInteraction(type, event) {
        // Reset struggle timer on meaningful interaction
        if (type === 'click' || (type === 'keydown' && event.key === 'Enter')) {
            this.strugglingStartTime = null;
        }

        // Log specific interactions for analysis
        this.logAction('interaction', {
            type: type,
            target: event.target.tagName,
            target_id: event.target.id,
            target_class: event.target.className
        });
    }

    recordMistake(mistakeType, details = {}) {
        this.mistakeCount++;
        this.logAction('mistake', {
            mistake_type: mistakeType,
            mistake_count: this.mistakeCount,
            details: details
        });
    }

    recordSuccess(successType, details = {}) {
        this.logAction('success', {
            success_type: successType,
            details: details
        });
    }

    async completeLevel(levelId, score, levelType = 'simulation') {
        const endTime = Date.now();
        const timeSpent = Math.floor((endTime - this.startTime) / 1000);

        const completionData = {
            level_id: levelId,
            level_type: levelType,
            score: score,
            time_spent: timeSpent,
            hints_used: this.hintCount,
            mistakes_made: this.mistakeCount,
            difficulty: this.currentDifficulty
        };

        try {
            // Update progress
            const response = await fetch('/api/adaptive/progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(completionData)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Progress updated:', result);
                
                // Show achievements if any
                if (result.achievements && result.achievements.length > 0) {
                    this.showAchievements(result.achievements);
                }

                return result;
            }
        } catch (error) {
            console.error('Failed to update progress:', error);
        }

        // Log completion
        this.logAction('level_complete', completionData);
    }

    showAchievements(achievements) {
        achievements.forEach((achievement, index) => {
            setTimeout(() => {
                this.displayAchievement(achievement);
            }, index * 1000); // Stagger achievement displays
        });
    }

    displayAchievement(achievement) {
        const achievementElement = document.createElement('div');
        achievementElement.className = 'achievement-notification';
        achievementElement.innerHTML = `
            <div class="achievement-header">
                <span class="achievement-icon">🏆</span>
                <span class="achievement-title">Achievement Unlocked!</span>
            </div>
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-description">${achievement.description}</div>
            <div class="achievement-xp">+${achievement.xp} XP</div>
        `;

        achievementElement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #ffd700, #ffed4e);
            border: 3px solid #ffc107;
            border-radius: 15px;
            padding: 20px;
            text-align: center;
            box-shadow: 0 8px 25px rgba(255,193,7,0.4);
            z-index: 10001;
            max-width: 350px;
            animation: achievementPop 0.5s ease-out;
        `;

        // Add achievement styles
        if (!document.querySelector('#achievement-styles')) {
            const style = document.createElement('style');
            style.id = 'achievement-styles';
            style.textContent = `
                @keyframes achievementPop {
                    0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
                    80% { transform: translate(-50%, -50%) scale(1.1); }
                    100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                }
                .achievement-header {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 10px;
                }
                .achievement-icon {
                    font-size: 24px;
                    margin-right: 8px;
                }
                .achievement-title {
                    font-weight: bold;
                    color: #856404;
                }
                .achievement-name {
                    font-size: 18px;
                    font-weight: bold;
                    color: #856404;
                    margin-bottom: 5px;
                }
                .achievement-description {
                    color: #856404;
                    margin-bottom: 10px;
                }
                .achievement-xp {
                    font-weight: bold;
                    color: #28a745;
                    font-size: 16px;
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(achievementElement);

        // Remove after 4 seconds
        setTimeout(() => {
            if (achievementElement.parentNode) {
                achievementElement.remove();
            }
        }, 4000);
    }

    async logAction(actionType, actionData = {}) {
        try {
            await fetch('/api/adaptive/analytics/log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    level_id: this.currentLevelId || 0,
                    action_type: actionType,
                    action_data: actionData,
                    level_type: 'simulation'
                })
            });
        } catch (error) {
            console.warn('Failed to log action:', error);
        }
    }

    setCurrentLevel(levelId) {
        this.currentLevelId = levelId;
        this.logAction('level_start', {
            level_id: levelId,
            start_time: new Date().toISOString()
        });
    }

    // Method to adjust difficulty mid-level based on performance
    async adjustDifficultyIfNeeded() {
        const currentPerformance = this.calculateCurrentPerformance();
        
        if (currentPerformance < 0.3 && this.currentDifficulty !== 'easy') {
            // Switch to easier difficulty
            this.currentDifficulty = 'easy';
            this.logAction('difficulty_adjusted', {
                new_difficulty: 'easy',
                reason: 'poor_performance',
                performance_score: currentPerformance
            });
            this.showDifficultyAdjustmentMessage('easier');
        } else if (currentPerformance > 0.9 && this.currentDifficulty !== 'hard') {
            // Switch to harder difficulty
            this.currentDifficulty = 'hard';
            this.logAction('difficulty_adjusted', {
                new_difficulty: 'hard',
                reason: 'excellent_performance',
                performance_score: currentPerformance
            });
            this.showDifficultyAdjustmentMessage('harder');
        }
    }

    calculateCurrentPerformance() {
        // Simple performance calculation based on mistakes vs time
        const timeElapsed = (Date.now() - this.startTime) / 1000;
        const mistakeRate = this.mistakeCount / Math.max(1, timeElapsed / 60); // mistakes per minute
        const hintRate = this.hintCount / Math.max(1, timeElapsed / 60); // hints per minute
        
        // Performance score (0-1, higher is better)
        const performance = Math.max(0, 1 - (mistakeRate * 0.3) - (hintRate * 0.2));
        return performance;
    }

    showDifficultyAdjustmentMessage(direction) {
        const message = direction === 'easier' 
            ? 'Difficulty adjusted to be more manageable. You\'ve got this!' 
            : 'Difficulty increased - you\'re doing great!';
        
        const messageElement = document.createElement('div');
        messageElement.className = 'difficulty-adjustment-message';
        messageElement.innerHTML = `
            <span class="adjustment-icon">${direction === 'easier' ? '📉' : '📈'}</span>
            ${message}
        `;
        
        messageElement.style.cssText = `
            position: fixed;
            top: 60px;
            right: 20px;
            background: ${direction === 'easier' ? '#d4edda' : '#fff3cd'};
            border: 2px solid ${direction === 'easier' ? '#c3e6cb' : '#ffeaa7'};
            color: ${direction === 'easier' ? '#155724' : '#856404'};
            padding: 12px 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(messageElement);
        
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 5000);
    }
}

// Global instance for the simulated PC adaptive learning
window.adaptiveLearning = new SimulatedPCAdaptiveLearning();
