/**
 * CyberQuest Adaptive Learning Global Integration
 * This script coordinates adaptive learning across all game modes and provides
 * a unified interface for adaptive learning features
 */

class CyberQuestAdaptiveLearning {
    constructor() {
        this.currentMode = null; // 'simulation', 'blue_team_vs_red_team', or null
        this.currentLevel = null;
        this.sessionData = {
            startTime: Date.now(),
            sessionId: this.generateSessionId(),
            interactions: 0,
            achievements: []
        };
        
        this.adaptiveEngines = {
            simulation: null,
            blueTeamVsRedTeam: null
        };
        
        this.init();
    }

    generateSessionId() {
        return 'cyberquest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    async init() {
        console.log('🚀 CyberQuest Adaptive Learning System Initializing...');
        
        // Detect current game mode
        this.detectGameMode();
        
        // Initialize appropriate adaptive engine
        await this.initializeAdaptiveEngine();
        
        // Set up global event listeners
        this.setupGlobalEventListeners();
        
        // Load user preferences
        await this.loadUserPreferences();
        
        console.log('✅ CyberQuest Adaptive Learning System Ready');
    }

    detectGameMode() {
        const path = window.location.pathname;
        
        if (path.includes('/levels/') && path.includes('/start')) {
            this.currentMode = 'simulation';
            const levelMatch = path.match(/\/levels\/(\d+)\/start/);
            if (levelMatch) {
                this.currentLevel = parseInt(levelMatch[1]);
            }
        } else if (path.includes('/blue-team-vs-red-team')) {
            this.currentMode = 'blue_team_vs_red_team';
            this.currentLevel = 1; // Blue team mode is considered level 1
        }
        
        console.log(`🎮 Game Mode Detected: ${this.currentMode}, Level: ${this.currentLevel}`);
    }

    async initializeAdaptiveEngine() {
        switch (this.currentMode) {
            case 'simulation':
                await this.initializeSimulationEngine();
                break;
            case 'blue_team_vs_red_team':
                await this.initializeBlueTeamEngine();
                break;
            default:
                console.log('🔍 No specific game mode detected, using dashboard mode');
        }
    }

    async initializeSimulationEngine() {
        try {
            // Load simulated PC adaptive learning if not already loaded
            if (!window.adaptiveLearning) {
                await this.loadScript('/static/js/simulated-pc/adaptive-learning.js');
            }
            
            if (!window.adaptiveIntegration) {
                await this.loadScript('/static/js/simulated-pc/adaptive-integration.js');
            }
            
            this.adaptiveEngines.simulation = window.adaptiveLearning;
            
            // Set current level
            if (this.adaptiveEngines.simulation && this.currentLevel) {
                this.adaptiveEngines.simulation.setCurrentLevel(this.currentLevel);
            }
            
            console.log('🖥️ Simulation Adaptive Engine Initialized');
        } catch (error) {
            console.error('❌ Failed to initialize simulation adaptive engine:', error);
        }
    }

    async initializeBlueTeamEngine() {
        try {
            // The AI engine should already be loaded in blue team mode
            // We'll integrate with it if available
            if (window.AIEngine) {
                console.log('🛡️ Blue Team Adaptive Engine Found');
            }
        } catch (error) {
            console.error('❌ Failed to initialize blue team adaptive engine:', error);
        }
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    setupGlobalEventListeners() {
        // Track page navigation for learning analytics
        window.addEventListener('beforeunload', () => {
            this.logSessionEnd();
        });

        // Track user interactions globally
        document.addEventListener('click', (e) => {
            this.sessionData.interactions++;
            this.logInteraction('click', {
                target: e.target.tagName,
                className: e.target.className,
                id: e.target.id
            });
        });

        // Listen for custom adaptive learning events
        document.addEventListener('adaptiveLearningEvent', (e) => {
            this.handleAdaptiveLearningEvent(e.detail);
        });

        // Listen for level completion events
        document.addEventListener('levelComplete', (e) => {
            this.handleLevelComplete(e.detail);
        });

        // Listen for achievement events
        document.addEventListener('achievementUnlocked', (e) => {
            this.handleAchievement(e.detail);
        });
    }

    async loadUserPreferences() {
        try {
            const response = await fetch('/api/adaptive/preferences');
            if (response.ok) {
                const data = await response.json();
                this.userPreferences = data.preferences;
                console.log('📋 User preferences loaded:', this.userPreferences);
            }
        } catch (error) {
            console.warn('⚠️ Could not load user preferences:', error);
            this.userPreferences = this.getDefaultPreferences();
        }
    }

    getDefaultPreferences() {
        return {
            learning_style: 'balanced',
            difficulty_preference: 'adaptive',
            hint_frequency: 'normal',
            preferred_pace: 'normal',
            tutorial_skip_allowed: false
        };
    }

    handleAdaptiveLearningEvent(eventData) {
        console.log('🎯 Adaptive Learning Event:', eventData);
        
        // Forward to appropriate engine
        if (this.currentMode === 'simulation' && this.adaptiveEngines.simulation) {
            // Handle simulation-specific events
            if (eventData.type === 'hint_requested') {
                this.adaptiveEngines.simulation.offerHint();
            } else if (eventData.type === 'mistake_made') {
                this.adaptiveEngines.simulation.recordMistake(eventData.mistakeType, eventData.details);
            }
        } else if (this.currentMode === 'blue_team_vs_red_team' && window.AIEngine) {
            // Handle blue team events
            if (eventData.type === 'player_action') {
                window.aiEngine?.recordPlayerAction(
                    eventData.action, 
                    eventData.isCorrect, 
                    eventData.responseTime
                );
            }
        }
    }

    async handleLevelComplete(completionData) {
        console.log('🏁 Level Complete:', completionData);
        
        const sessionTime = Date.now() - this.sessionData.startTime;
        
        // Send completion data to appropriate engine
        let result = null;
        
        if (this.currentMode === 'simulation' && this.adaptiveEngines.simulation) {
            result = await this.adaptiveEngines.simulation.completeLevel(
                completionData.levelId, 
                completionData.score
            );
        } else if (this.currentMode === 'blue_team_vs_red_team' && window.aiEngine) {
            result = await window.aiEngine.completeScenario(
                completionData.score, 
                sessionTime / 1000
            );
        }
        
        // Show completion feedback
        this.showCompletionFeedback(completionData, result);
        
        // Log completion analytics
        this.logCompletion(completionData, sessionTime);
    }

    handleAchievement(achievementData) {
        console.log('🏆 Achievement Unlocked:', achievementData);
        this.sessionData.achievements.push(achievementData);
        
        // Show achievement notification
        this.showAchievementNotification(achievementData);
    }

    showCompletionFeedback(completionData, adaptiveResult) {
        const feedbackElement = document.createElement('div');
        feedbackElement.className = 'completion-feedback';
        
        let xpGained = adaptiveResult?.xp_earned || 0;
        let achievements = adaptiveResult?.achievements || [];
        
        feedbackElement.innerHTML = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md mx-4 text-center">
                    <div class="text-6xl mb-4">🎉</div>
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Level ${completionData.levelId} Complete!
                    </h2>
                    <div class="space-y-2 mb-6">
                        <p class="text-lg">Score: <span class="font-bold text-blue-600">${completionData.score}%</span></p>
                        ${xpGained > 0 ? `<p class="text-lg">XP Gained: <span class="font-bold text-green-600">+${xpGained}</span></p>` : ''}
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            Session Time: ${Math.round((Date.now() - this.sessionData.startTime) / 1000 / 60)} minutes
                        </p>
                    </div>
                    ${achievements.length > 0 ? `
                        <div class="mb-6">
                            <h3 class="font-semibold mb-2">New Achievements!</h3>
                            ${achievements.map(ach => `
                                <div class="flex items-center justify-center text-sm bg-yellow-100 text-yellow-800 rounded-lg p-2 mb-1">
                                    🏆 ${ach.name}
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                    <div class="flex space-x-4">
                        <button onclick="this.closest('.completion-feedback').remove()" 
                                class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                            Continue
                        </button>
                        <button onclick="window.location.href='/profile/dashboard'" 
                                class="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors">
                            Dashboard
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(feedbackElement);
    }

    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="fixed top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm animate-bounce">
                <div class="flex items-center">
                    <div class="text-2xl mr-3">🏆</div>
                    <div>
                        <h4 class="font-bold">Achievement Unlocked!</h4>
                        <p class="text-sm">${achievement.name}</p>
                        <p class="text-xs opacity-90">${achievement.description}</p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    async logInteraction(type, details) {
        try {
            await fetch('/api/adaptive/analytics/log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    level_id: this.currentLevel || 0,
                    level_type: this.currentMode || 'general',
                    action_type: `global_${type}`,
                    action_data: {
                        ...details,
                        session_id: this.sessionData.sessionId,
                        session_interactions: this.sessionData.interactions
                    }
                })
            });
        } catch (error) {
            console.warn('Could not log interaction:', error);
        }
    }

    async logCompletion(completionData, sessionTime) {
        try {
            await fetch('/api/adaptive/analytics/log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    level_id: completionData.levelId,
                    level_type: this.currentMode,
                    action_type: 'global_level_complete',
                    action_data: {
                        score: completionData.score,
                        session_time: sessionTime,
                        session_interactions: this.sessionData.interactions,
                        achievements_earned: this.sessionData.achievements.length,
                        session_id: this.sessionData.sessionId
                    }
                })
            });
        } catch (error) {
            console.warn('Could not log completion:', error);
        }
    }

    logSessionEnd() {
        const sessionTime = Date.now() - this.sessionData.startTime;
        
        // Send session end analytics
        fetch('/api/adaptive/analytics/log', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                level_id: this.currentLevel || 0,
                level_type: this.currentMode || 'general',
                action_type: 'session_end',
                action_data: {
                    session_time: sessionTime,
                    total_interactions: this.sessionData.interactions,
                    achievements_earned: this.sessionData.achievements.length,
                    session_id: this.sessionData.sessionId
                }
            })
        }).catch(error => {
            console.warn('Could not log session end:', error);
        });
    }

    // Public API methods for other scripts to use
    recordCustomEvent(eventType, eventData) {
        const event = new CustomEvent('adaptiveLearningEvent', {
            detail: {
                type: eventType,
                ...eventData
            }
        });
        document.dispatchEvent(event);
    }

    recordLevelComplete(levelId, score, additionalData = {}) {
        const event = new CustomEvent('levelComplete', {
            detail: {
                levelId: levelId,
                score: score,
                ...additionalData
            }
        });
        document.dispatchEvent(event);
    }

    recordAchievement(name, description, xp = 0) {
        const event = new CustomEvent('achievementUnlocked', {
            detail: {
                name: name,
                description: description,
                xp: xp,
                timestamp: Date.now()
            }
        });
        document.dispatchEvent(event);
    }

    // Get current adaptive learning state
    getAdaptiveState() {
        return {
            mode: this.currentMode,
            level: this.currentLevel,
            sessionTime: Date.now() - this.sessionData.startTime,
            interactions: this.sessionData.interactions,
            achievements: this.sessionData.achievements.length,
            preferences: this.userPreferences
        };
    }
}

// Initialize global adaptive learning system
document.addEventListener('DOMContentLoaded', function() {
    window.cyberQuestAdaptive = new CyberQuestAdaptiveLearning();
});

// Export for other modules
window.CyberQuestAdaptiveLearning = CyberQuestAdaptiveLearning;
