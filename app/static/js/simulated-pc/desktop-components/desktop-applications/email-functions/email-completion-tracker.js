import { ALL_EMAILS } from '../../../levels/level-two/emails/email-registry.js';
import { EmailSessionSummary } from './email-session-summary.js';

export class EmailCompletionTracker {
    constructor(emailApp) {
        this.emailApp = emailApp;
        this.sessionSummary = new EmailSessionSummary(emailApp);
        this.hasTriggeredCompletion = false;
        this.completionCheckInterval = null;
    }

    /**
     * Initialize completion tracking
     */
    initialize() {
        // Load any previous session data
        this.loadPreviousSessionData();
        
        // Set up event listeners for completion triggers
        this.setupCompletionEventListeners();
        
        // Start monitoring email completion status
        this.startCompletionMonitoring();
        
        // Listen for email action events
        this.bindCompletionEvents();
    }

    startCompletionMonitoring() {
        // Check completion status every few seconds
        this.completionCheckInterval = setInterval(() => {
            this.checkCompletionStatus();
        }, 3000);
    }

    bindCompletionEvents() {
        // Listen for email security events
        document.addEventListener('email-reported-phishing', () => {
            setTimeout(() => this.checkCompletionStatus(), 1000);
        });

        document.addEventListener('email-marked-legitimate', () => {
            setTimeout(() => this.checkCompletionStatus(), 1000);
        });

        document.addEventListener('email-moved-to-inbox', () => {
            setTimeout(() => this.checkCompletionStatus(), 1000);
        });
    }

    checkCompletionStatus() {
        if (this.hasTriggeredCompletion) return;

        const allEmailIds = ALL_EMAILS.map(email => email.id);
        const securityManager = this.emailApp.state.securityManager;
        
        // Check if all emails have been categorized
        const processedEmails = allEmailIds.filter(emailId => {
            const status = securityManager.getEmailStatus(emailId);
            return status === 'phishing' || status === 'legitimate';
        });

        const completionPercentage = (processedEmails.length / allEmailIds.length) * 100;
        
        // Trigger completion when all emails are processed
        if (completionPercentage === 100) {
            this.triggerLevelCompletion();
        }
    }

    triggerLevelCompletion() {
        if (this.hasTriggeredCompletion) return;
        
        this.hasTriggeredCompletion = true;
        
        // Stop monitoring
        if (this.completionCheckInterval) {
            clearInterval(this.completionCheckInterval);
            this.completionCheckInterval = null;
        }

        // Mark email training as completed
        localStorage.setItem('cyberquest_email_training_completed', 'true');
        
        // Delay before showing completion dialogue
        setTimeout(() => {
            this.showLevelCompletionDialogue();
        }, 2000);
    }

    showLevelCompletionDialogue() {
        // Import and trigger the Level 2 completion dialogue
        import('../../../levels/level-two/dialogues/email-security-completion-dialogue.js').then(module => {
            const EmailSecurityCompletionDialogue = module.EmailSecurityCompletionDialogue;
            if (EmailSecurityCompletionDialogue.startCompletionDialogue && window.desktop) {
                EmailSecurityCompletionDialogue.startCompletionDialogue(window.desktop);
            }
        }).catch(error => {
            console.error('Failed to load Level 2 completion dialogue:', error);
        });
    }

    /**
     * Display level completion dialogue followed by email session summary
     * @param {Object} sessionStats - Session statistics from EmailFeedback
     * @param {Array} feedbackHistory - Array of all feedback interactions
     */
    showCompletionWithSummary(sessionStats, feedbackHistory = []) {
        // First show the level completion dialogue
        this.showLevelCompletionDialogue();
        
        // Wait for dialogue to complete, then show session summary
        setTimeout(() => {
            this.displayEmailSessionSummary(sessionStats, feedbackHistory);
        }, 3000); // 3 second delay to allow dialogue to be read
    }

    /**
     * Display the email session summary with enhanced level completion context
     * @param {Object} sessionStats - Session statistics from EmailFeedback
     * @param {Array} feedbackHistory - Array of all feedback interactions
     */
    displayEmailSessionSummary(sessionStats, feedbackHistory = []) {
        // Close any existing level completion dialogues
        this.closeLevelCompletionDialogue();
        
        // Show the comprehensive session summary
        this.sessionSummary.showSessionSummary(sessionStats, feedbackHistory);
        
        // Mark Level 2 as completed if criteria are met
        if (sessionStats.accuracy >= 70) {
            this.markLevel2Complete(sessionStats);
        }
    }

    /**
     * Close any open level completion dialogues
     */
    closeLevelCompletionDialogue() {
        // Remove any existing level completion dialogues
        const existingDialogues = document.querySelectorAll('.level-completion-dialogue, .dialogue-modal');
        existingDialogues.forEach(dialogue => dialogue.remove());
    }

    /**
     * Mark Level 2 as completed and store completion data
     * @param {Object} sessionStats - Session statistics
     */
    markLevel2Complete(sessionStats) {
        const completionData = {
            levelId: 2,
            completed: true,
            score: sessionStats.accuracy,
            timestamp: new Date().toISOString(),
            totalActions: sessionStats.totalActions,
            correctActions: sessionStats.correctActions,
            completionMethod: 'email-training'
        };
        
        // Store completion data in localStorage
        localStorage.setItem('cyberquest_level_2_completed', 'true');
        localStorage.setItem('cyberquest_level_2_completion', JSON.stringify(completionData));
        localStorage.setItem('cyberquest_email_training_completed', 'true');
        localStorage.setItem('cyberquest_email_training_score', sessionStats.accuracy.toString());
        
        console.log('Level 2 marked as completed via EmailCompletionTracker:', {
            level_completed: localStorage.getItem('cyberquest_level_2_completed'),
            completion_data: localStorage.getItem('cyberquest_level_2_completion')
        });
        
        // Emit completion event for other systems
        document.dispatchEvent(new CustomEvent('level-completed', {
            detail: {
                levelId: 2,
                score: sessionStats.accuracy,
                completionData: completionData
            }
        }));
    }

    /**
     * Check if user meets completion criteria and trigger appropriate completion flow
     * @param {Object} sessionStats - Session statistics from EmailFeedback
     * @param {Array} feedbackHistory - Array of all feedback interactions
     */
    checkAndTriggerCompletion(sessionStats, feedbackHistory = []) {
        const minActionsRequired = 5; // Minimum number of email actions
        const minAccuracyRequired = 50; // Minimum accuracy percentage
        
        // Check if user meets minimum requirements for completion
        if (sessionStats.totalActions >= minActionsRequired && 
            sessionStats.accuracy >= minAccuracyRequired) {
            
            // Trigger completion with summary
            this.showCompletionWithSummary(sessionStats, feedbackHistory);
            return true;
        }
        
        return false;
    }

    /**
     * Show a simplified completion notification for lower scores
     * @param {Object} sessionStats - Session statistics
     * @param {Array} feedbackHistory - Feedback history
     */
    showTrainingCompletionOnly(sessionStats, feedbackHistory = []) {
        // For users who don't meet the level completion criteria but have completed training
        this.displayEmailSessionSummary(sessionStats, feedbackHistory);
    }

    /**
     * Get completion status and recommendations
     * @param {Object} sessionStats - Session statistics
     * @returns {Object} Completion status and recommendations
     */
    getCompletionStatus(sessionStats) {
        const status = {
            canCompleteLevel: sessionStats.accuracy >= 70,
            hasCompletedTraining: sessionStats.totalActions >= 5,
            recommendedAction: '',
            nextSteps: []
        };
        
        if (status.canCompleteLevel) {
            status.recommendedAction = 'complete-level';
            status.nextSteps = [
                'Review your performance in the session summary',
                'Continue to Level 3: Malware Mayhem',
                'Practice with additional email scenarios if desired'
            ];
        } else if (status.hasCompletedTraining) {
            status.recommendedAction = 'retry-training';
            status.nextSteps = [
                'Review mistakes in the session summary',
                'Practice with more emails to improve accuracy',
                'Retry the level when ready'
            ];
        } else {
            status.recommendedAction = 'continue-training';
            status.nextSteps = [
                'Continue processing more emails',
                'Focus on identifying red flags in suspicious emails',
                'Practice with both phishing and legitimate emails'
            ];
        }
        
        return status;
    }

    /**
     * Load previous session data if available
     */
    loadPreviousSessionData() {
        const previousCompletion = localStorage.getItem('cyberquest_level_2_completion');
        if (previousCompletion) {
            try {
                const completionData = JSON.parse(previousCompletion);
                console.log('Previous Level 2 completion found:', completionData);
            } catch (error) {
                console.warn('Error parsing previous completion data:', error);
            }
        }
    }

    /**
     * Set up event listeners for completion-related events
     */
    setupCompletionEventListeners() {
        // Listen for manual completion requests
        document.addEventListener('email-training-complete', (event) => {
            const { sessionStats, feedbackHistory } = event.detail;
            this.checkAndTriggerCompletion(sessionStats, feedbackHistory);
        });
        
        // Listen for level navigation requests
        document.addEventListener('navigate-to-level', (event) => {
            const { levelId } = event.detail;
            if (levelId === 3) {
                // User wants to go to level 3, ensure level 2 is marked complete
                const level2Complete = localStorage.getItem('cyberquest_level_2_completed');
                if (level2Complete !== 'true') {
                    console.warn('Attempting to access Level 3 without completing Level 2');
                }
            }
        });
    }

    /**
     * Clean up completion tracker
     */
    cleanup() {
        this.closeLevelCompletionDialogue();
        
        // Remove any global references
        if (window.emailCompletionTracker === this) {
            window.emailCompletionTracker = null;
        }
    }
}
