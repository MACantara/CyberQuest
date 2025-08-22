/**
 * Adaptive Learning Integration for Simulated PC Main Interface
 * Integrates adaptive learning features across all simulated PC applications
 */

class SimulatedPCAdaptiveIntegration {
    constructor() {
        this.adaptiveLearning = null;
        this.currentLevel = null;
        this.levelStartTime = null;
        this.userActions = [];
        this.performanceMetrics = {
            taskCompletionTime: [],
            accuracyRate: 0,
            hintsUsed: 0,
            errorsCommitted: 0
        };
        
        this.init();
    }

    async init() {
        // Wait for adaptive learning to be available
        if (typeof window.adaptiveLearning !== 'undefined') {
            this.adaptiveLearning = window.adaptiveLearning;
        } else {
            // Create adaptive learning instance if not available
            await this.loadAdaptiveLearningScript();
        }

        this.setupGlobalAdaptiveFeatures();
        this.setupPerformanceTracking();
        console.log('Simulated PC Adaptive Integration initialized');
    }

    async loadAdaptiveLearningScript() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = '/static/js/simulated-pc/adaptive-learning.js';
            script.onload = () => {
                this.adaptiveLearning = window.adaptiveLearning;
                resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    setupGlobalAdaptiveFeatures() {
        // Monitor for level start events
        document.addEventListener('levelStart', (event) => {
            this.handleLevelStart(event.detail);
        });

        // Monitor for task completion events
        document.addEventListener('taskComplete', (event) => {
            this.handleTaskComplete(event.detail);
        });

        // Monitor for application launches
        document.addEventListener('applicationLaunch', (event) => {
            this.handleApplicationLaunch(event.detail);
        });

        // Monitor for dialogue interactions
        document.addEventListener('dialogueInteraction', (event) => {
            this.handleDialogueInteraction(event.detail);
        });

        // Add adaptive hint system
        this.setupAdaptiveHintSystem();

        // Add performance feedback system
        this.setupPerformanceFeedback();
    }

    setupPerformanceTracking() {
        // Track all user interactions for performance analysis
        let interactionTimer = null;
        let lastInteractionTime = Date.now();

        const trackInteraction = (type, details = {}) => {
            const now = Date.now();
            const timeSinceLastInteraction = now - lastInteractionTime;

            this.userActions.push({
                type: type,
                timestamp: now,
                timeSinceLastInteraction: timeSinceLastInteraction,
                details: details
            });

            lastInteractionTime = now;

            // Clear previous timer
            if (interactionTimer) {
                clearTimeout(interactionTimer);
            }

            // Set timer to detect inactivity
            interactionTimer = setTimeout(() => {
                this.handleInactivity();
            }, 30000); // 30 seconds of inactivity
        };

        // Track various interaction types
        document.addEventListener('click', (e) => {
            trackInteraction('click', {
                target: e.target.tagName,
                className: e.target.className,
                id: e.target.id
            });
        });

        document.addEventListener('keydown', (e) => {
            trackInteraction('keydown', {
                key: e.key,
                ctrlKey: e.ctrlKey,
                altKey: e.altKey
            });
        });

        // Track window/application focus changes
        document.addEventListener('windowFocus', (e) => {
            trackInteraction('windowFocus', e.detail);
        });
    }

    setupAdaptiveHintSystem() {
        // Create floating hint button
        const hintButton = document.createElement('div');
        hintButton.id = 'adaptive-hint-button';
        hintButton.className = 'adaptive-hint-button hidden';
        hintButton.innerHTML = `
            <button class="hint-btn">
                <i class="bi bi-lightbulb"></i>
                <span class="hint-text">Need help?</span>
            </button>
        `;

        hintButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            transition: all 0.3s ease;
        `;

        // Add styles
        if (!document.querySelector('#adaptive-hint-styles')) {
            const style = document.createElement('style');
            style.id = 'adaptive-hint-styles';
            style.textContent = `
                .adaptive-hint-button .hint-btn {
                    background: linear-gradient(45deg, #4f46e5, #7c3aed);
                    border: none;
                    border-radius: 50px;
                    padding: 12px 20px;
                    color: white;
                    font-weight: bold;
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.3s ease;
                }
                .adaptive-hint-button .hint-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(79, 70, 229, 0.6);
                }
                .adaptive-hint-button.hidden {
                    opacity: 0;
                    transform: translateY(100px);
                    pointer-events: none;
                }
                .adaptive-hint-button.visible {
                    opacity: 1;
                    transform: translateY(0);
                    pointer-events: all;
                }
            `;
            document.head.appendChild(style);
        }

        hintButton.addEventListener('click', () => {
            this.requestAdaptiveHint();
        });

        document.body.appendChild(hintButton);
        this.hintButton = hintButton;
    }

    setupPerformanceFeedback() {
        // Create performance feedback system
        this.performanceFeedbackContainer = document.createElement('div');
        this.performanceFeedbackContainer.id = 'performance-feedback';
        this.performanceFeedbackContainer.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            max-width: 300px;
            z-index: 9998;
        `;
        document.body.appendChild(this.performanceFeedbackContainer);
    }

    handleLevelStart(levelData) {
        this.currentLevel = levelData.id;
        this.levelStartTime = Date.now();
        this.userActions = [];
        this.performanceMetrics = {
            taskCompletionTime: [],
            accuracyRate: 0,
            hintsUsed: 0,
            errorsCommitted: 0
        };

        if (this.adaptiveLearning) {
            this.adaptiveLearning.setCurrentLevel(levelData.id);
        }

        console.log(`Level ${levelData.id} started with adaptive learning`);
    }

    handleTaskComplete(taskData) {
        const completionTime = Date.now() - (taskData.startTime || this.levelStartTime);
        this.performanceMetrics.taskCompletionTime.push(completionTime);

        if (taskData.correct) {
            this.showPositiveFeedback('Task completed successfully!');
        } else {
            this.performanceMetrics.errorsCommitted++;
            this.showCorrectiveFeedback('Task needs attention. Review and try again.');
        }

        // Update accuracy rate
        const totalTasks = this.performanceMetrics.taskCompletionTime.length;
        const errors = this.performanceMetrics.errorsCommitted;
        this.performanceMetrics.accuracyRate = ((totalTasks - errors) / totalTasks) * 100;

        // Check if adaptive adjustments are needed
        this.checkForAdaptiveAdjustments();
    }

    handleApplicationLaunch(appData) {
        // Track which applications are being used
        if (this.adaptiveLearning) {
            this.adaptiveLearning.logAction('application_launch', {
                application: appData.name,
                level_context: this.currentLevel
            });
        }

        // Provide contextual guidance for first-time app users
        this.provideContextualGuidance(appData.name);
    }

    handleDialogueInteraction(dialogueData) {
        if (this.adaptiveLearning) {
            this.adaptiveLearning.logAction('dialogue_interaction', {
                dialogue_id: dialogueData.id,
                response: dialogueData.response,
                level_context: this.currentLevel
            });
        }
    }

    handleInactivity() {
        // User has been inactive - offer help
        this.showHintButton();
        
        if (this.adaptiveLearning) {
            this.adaptiveLearning.logAction('inactivity_detected', {
                duration: 30000,
                level_context: this.currentLevel
            });
        }
    }

    showHintButton() {
        if (this.hintButton) {
            this.hintButton.className = 'adaptive-hint-button visible';
        }
    }

    hideHintButton() {
        if (this.hintButton) {
            this.hintButton.className = 'adaptive-hint-button hidden';
        }
    }

    async requestAdaptiveHint() {
        if (!this.adaptiveLearning) return;

        // Hide hint button
        this.hideHintButton();

        // Get current context
        const context = this.getCurrentContext();
        
        // Request adaptive hint based on user's learning style
        const hint = await this.adaptiveLearning.getContextualHint(context);
        
        if (hint) {
            this.adaptiveLearning.showAdaptiveHint(hint.style);
            this.performanceMetrics.hintsUsed++;
        }
    }

    getCurrentContext() {
        // Analyze current state to provide context for hints
        const activeWindows = document.querySelectorAll('.window:not(.minimized)');
        const currentApplication = activeWindows.length > 0 ? 
            activeWindows[activeWindows.length - 1].getAttribute('data-app') : null;

        return {
            level: this.currentLevel,
            currentApplication: currentApplication,
            recentActions: this.userActions.slice(-5),
            performanceMetrics: this.performanceMetrics
        };
    }

    checkForAdaptiveAdjustments() {
        // Check if difficulty should be adjusted based on performance
        if (this.performanceMetrics.taskCompletionTime.length >= 3) {
            const avgCompletionTime = this.performanceMetrics.taskCompletionTime.reduce((a, b) => a + b, 0) / 
                                     this.performanceMetrics.taskCompletionTime.length;
            
            const accuracyRate = this.performanceMetrics.accuracyRate;

            // Suggest difficulty adjustment
            if (accuracyRate > 90 && avgCompletionTime < 30000) { // 30 seconds
                this.suggestDifficultyIncrease();
            } else if (accuracyRate < 60 || this.performanceMetrics.hintsUsed > 3) {
                this.suggestDifficultyDecrease();
            }
        }
    }

    suggestDifficultyIncrease() {
        this.showPerformanceFeedback({
            type: 'suggestion',
            title: 'Great Performance!',
            message: 'You\'re mastering this level. Consider trying a higher difficulty for more challenge.',
            action: 'increase_difficulty'
        });
    }

    suggestDifficultyDecrease() {
        this.showPerformanceFeedback({
            type: 'suggestion',
            title: 'Need Support?',
            message: 'This seems challenging. Would you like to adjust the difficulty to help you learn?',
            action: 'decrease_difficulty'
        });
    }

    showPositiveFeedback(message) {
        this.showPerformanceFeedback({
            type: 'positive',
            title: 'Well Done!',
            message: message
        });
    }

    showCorrectiveFeedback(message) {
        this.showPerformanceFeedback({
            type: 'corrective',
            title: 'Learning Opportunity',
            message: message
        });
    }

    showPerformanceFeedback(feedback) {
        const feedbackElement = document.createElement('div');
        feedbackElement.className = `performance-feedback ${feedback.type}`;
        
        const bgColor = {
            positive: 'bg-green-100 border-green-500 text-green-700',
            corrective: 'bg-yellow-100 border-yellow-500 text-yellow-700',
            suggestion: 'bg-blue-100 border-blue-500 text-blue-700'
        }[feedback.type] || 'bg-gray-100 border-gray-500 text-gray-700';

        feedbackElement.innerHTML = `
            <div class="p-4 rounded-lg border-l-4 ${bgColor} shadow-lg">
                <div class="flex items-center justify-between">
                    <div>
                        <h4 class="font-bold">${feedback.title}</h4>
                        <p class="text-sm mt-1">${feedback.message}</p>
                    </div>
                    <button onclick="this.parentElement.parentElement.remove()" class="text-gray-500 hover:text-gray-700">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
                ${feedback.action ? `
                    <div class="mt-3">
                        <button class="px-3 py-1 bg-white rounded border hover:bg-gray-50 transition-colors text-sm"
                                onclick="adaptiveIntegration.handleFeedbackAction('${feedback.action}')">
                            ${feedback.action === 'increase_difficulty' ? 'Increase Challenge' : 'Make Easier'}
                        </button>
                    </div>
                ` : ''}
            </div>
        `;

        this.performanceFeedbackContainer.appendChild(feedbackElement);

        // Auto-remove after 8 seconds if no action buttons
        if (!feedback.action) {
            setTimeout(() => {
                if (feedbackElement.parentNode) {
                    feedbackElement.remove();
                }
            }, 8000);
        }
    }

    handleFeedbackAction(action) {
        if (action === 'increase_difficulty' || action === 'decrease_difficulty') {
            // Implement difficulty adjustment logic
            if (this.adaptiveLearning) {
                this.adaptiveLearning.logAction('difficulty_adjustment_requested', {
                    action: action,
                    current_level: this.currentLevel,
                    performance_metrics: this.performanceMetrics
                });
            }

            // Show confirmation
            this.showPerformanceFeedback({
                type: 'positive',
                title: 'Settings Updated',
                message: 'Difficulty adjustment will take effect in the next level.'
            });
        }

        // Remove all feedback elements
        this.performanceFeedbackContainer.innerHTML = '';
    }

    provideContextualGuidance(appName) {
        // Provide brief guidance when opening new applications for the first time in a session
        const guidanceMessages = {
            'browser': 'Use the browser to investigate suspicious websites and check for security indicators.',
            'email': 'Examine emails carefully for phishing indicators like suspicious links or unexpected attachments.',
            'file-manager': 'Navigate through files to find evidence or suspicious items. Pay attention to file names and dates.',
            'terminal': 'Use command-line tools to investigate system information and run security commands.',
            'network-monitor': 'Monitor network traffic for unusual connections or suspicious data transfers.',
            'process-monitor': 'Watch running processes for unusual activity or unknown programs.',
            'malware-scanner': 'Scan files and systems for malware. Pay attention to scan results and quarantine options.',
            'vulnerability-scanner': 'Identify security vulnerabilities in systems and applications.',
            'system-logs': 'Review system logs for security events, errors, and suspicious activities.'
        };

        const message = guidanceMessages[appName];
        if (message) {
            setTimeout(() => {
                this.showPerformanceFeedback({
                    type: 'suggestion',
                    title: `${appName.charAt(0).toUpperCase() + appName.slice(1)} Guidance`,
                    message: message
                });
            }, 1000); // Delay to let app load
        }
    }

    // Method to complete level and send data to adaptive learning system
    async completeLevelWithAdaptiveLearning(levelId, score) {
        if (!this.adaptiveLearning) return;

        const timeSpent = this.levelStartTime ? (Date.now() - this.levelStartTime) / 1000 : 0;
        
        const result = await this.adaptiveLearning.completeLevel(levelId, score);
        
        if (result && result.achievements) {
            // Show achievements
            this.adaptiveLearning.showAchievements(result.achievements);
        }

        return result;
    }

    // Public method to record mistakes from applications
    recordMistake(mistakeType, details) {
        this.performanceMetrics.errorsCommitted++;
        
        if (this.adaptiveLearning) {
            this.adaptiveLearning.recordMistake(mistakeType, details);
        }

        this.showCorrectiveFeedback('Take your time and review the available information.');
    }

    // Public method to record successes from applications
    recordSuccess(successType, details) {
        if (this.adaptiveLearning) {
            this.adaptiveLearning.recordSuccess(successType, details);
        }

        this.showPositiveFeedback('Great job! You\'re making excellent progress.');
    }
}

// Initialize adaptive integration when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.adaptiveIntegration = new SimulatedPCAdaptiveIntegration();
});

// Export for use in other modules
window.SimulatedPCAdaptiveIntegration = SimulatedPCAdaptiveIntegration;
