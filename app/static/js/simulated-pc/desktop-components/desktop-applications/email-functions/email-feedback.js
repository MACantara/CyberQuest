export class EmailFeedback {
    constructor(emailApp) {
        this.emailApp = emailApp;
        this.feedbackHistory = [];
        this.sessionScore = 0;
        this.totalActions = 0;
        this.hasShownCompletionSuggestion = false;
    }

    /**
     * Evaluate player action and provide feedback
     * @param {Object} email - Email object with suspicious property
     * @param {string} action - Player action: 'report', 'trust', 'delete', 'ignore'
     * @param {string} reasoning - Optional reasoning for the action
     */
    evaluateAction(email, action, reasoning = '') {
        const isCorrectAction = this.isActionCorrect(email, action);
        const feedbackData = {
            emailId: email.id,
            emailSubject: email.subject,
            emailSender: email.sender,
            isSuspicious: email.suspicious,
            playerAction: action,
            isCorrect: isCorrectAction,
            reasoning: reasoning,
            timestamp: new Date().toISOString(),
            feedback: this.generateFeedback(email, action, isCorrectAction)
        };

        this.recordFeedback(feedbackData);
        this.showFeedbackModal(feedbackData);
        
        return feedbackData;
    }

    /**
     * Determine if the player's action is correct
     * @param {Object} email - Email object
     * @param {string} action - Player action
     * @returns {boolean} True if action is correct
     */
    isActionCorrect(email, action) {
        if (email.suspicious) {
            // For suspicious emails, correct actions are: report, delete
            return ['report', 'delete'].includes(action);
        } else {
            // For legitimate emails, correct actions are: trust, ignore (normal processing)
            return ['trust', 'ignore'].includes(action);
        }
    }

    /**
     * Generate detailed feedback based on email and action
     * @param {Object} email - Email object
     * @param {string} action - Player action
     * @param {boolean} isCorrect - Whether action was correct
     * @returns {Object} Feedback object with details
     */
    generateFeedback(email, action, isCorrect) {
        const feedback = {
            result: isCorrect ? 'correct' : 'incorrect',
            title: '',
            message: '',
            redFlags: [],
            goodSigns: [],
            tips: []
        };

        if (email.suspicious) {
            // Suspicious email feedback
            if (isCorrect) {
                feedback.title = '✅ Excellent Security Awareness!';
                feedback.message = `You correctly identified this as a suspicious email and took appropriate action by ${action === 'report' ? 'reporting' : 'deleting'} it.`;
            } else {
                feedback.title = '❌ Security Risk - Incorrect Action';
                feedback.message = `This was a suspicious email that should have been reported or deleted. ${action === 'trust' ? 'Trusting this email could lead to security breaches.' : 'Ignoring suspicious emails allows threats to persist.'}`;
            }

            // Add red flags for suspicious emails
            feedback.redFlags = this.identifyRedFlags(email);
            feedback.tips = [
                'Always verify sender identity through alternative channels',
                'Be cautious of urgent requests for sensitive information',
                'Check for spelling errors and suspicious domains',
                'When in doubt, report to your security team'
            ];
        } else {
            // Legitimate email feedback
            if (isCorrect) {
                feedback.title = '✅ Good Email Management';
                feedback.message = `You correctly identified this as a legitimate email. ${action === 'trust' ? 'Proper email processing helps maintain business flow.' : 'Normal processing of legitimate emails is appropriate.'}`;
            } else {
                feedback.title = '⚠️ Overly Cautious Action';
                feedback.message = `This was a legitimate email that didn't require ${action === 'report' ? 'reporting' : 'deletion'}. While security awareness is good, over-reporting can impact workflow.`;
            }

            // Add good signs for legitimate emails
            feedback.goodSigns = this.identifyGoodSigns(email);
            feedback.tips = [
                'Legitimate emails often come from known domains',
                'Professional formatting and proper grammar are good signs',
                'Reasonable requests that align with business needs',
                'Contact information and proper signatures indicate legitimacy'
            ];
        }

        return feedback;
    }

    /**
     * Identify red flags in suspicious emails
     * @param {Object} email - Email object
     * @returns {Array} List of red flags
     */
    identifyRedFlags(email) {
        const redFlags = [];
        
        // Check sender domain
        const senderDomain = email.sender.split('@')[1];
        if (senderDomain && (
            senderDomain.includes('gmail.com') && !email.sender.includes('cyberquest') ||
            senderDomain.includes('suspicious') ||
            senderDomain.includes('phish') ||
            senderDomain.includes('fake')
        )) {
            redFlags.push('Suspicious sender domain');
        }

        // Check subject line
        if (email.subject.includes('URGENT') || 
            email.subject.includes('IMMEDIATE') ||
            email.subject.includes('ACTION REQUIRED') ||
            email.subject.includes('VERIFY') ||
            email.subject.includes('SUSPENDED')) {
            redFlags.push('Urgent or threatening language in subject');
        }

        // Check for common phishing indicators in subject
        if (email.subject.toLowerCase().includes('password') ||
            email.subject.toLowerCase().includes('account') ||
            email.subject.toLowerCase().includes('security') ||
            email.subject.toLowerCase().includes('limited')) {
            redFlags.push('Subject mentions sensitive account information');
        }

        // Check sender patterns
        if (email.sender.includes('noreply') && email.suspicious) {
            redFlags.push('Suspicious use of no-reply address');
        }

        return redFlags;
    }

    /**
     * Identify good signs in legitimate emails
     * @param {Object} email - Email object
     * @returns {Array} List of positive indicators
     */
    identifyGoodSigns(email) {
        const goodSigns = [];
        
        // Check sender domain
        const senderDomain = email.sender.split('@')[1];
        if (senderDomain && senderDomain.includes('cyberquest.com')) {
            goodSigns.push('Email from trusted organizational domain');
        }

        // Check for professional communication patterns
        if (email.subject && !email.subject.includes('!!!') && !email.subject.toUpperCase() === email.subject) {
            goodSigns.push('Professional subject line formatting');
        }

        // Check priority level
        if (email.priority === 'normal') {
            goodSigns.push('Normal priority level (not artificially urgent)');
        }

        return goodSigns;
    }

    /**
     * Record feedback for session tracking
     * @param {Object} feedbackData - Feedback data to record
     */
    recordFeedback(feedbackData) {
        this.feedbackHistory.push(feedbackData);
        this.totalActions++;
        
        if (feedbackData.isCorrect) {
            this.sessionScore++;
        }

        // Store in localStorage for persistence
        localStorage.setItem('cyberquest_email_feedback_history', JSON.stringify(this.feedbackHistory));
        localStorage.setItem('cyberquest_email_session_score', this.sessionScore.toString());
        localStorage.setItem('cyberquest_email_total_actions', this.totalActions.toString());
        
        // Check if we should show completion notice
        this.checkForTrainingCompletion();
    }

    /**
     * Check if enough emails have been processed to suggest completion
     */
    checkForTrainingCompletion() {
        const totalEmails = 8; // Approximate number of emails in the training
        const completionThreshold = Math.ceil(totalEmails * 0.6); // 60% threshold for suggestion
        
        if (this.totalActions >= completionThreshold && !this.hasShownCompletionSuggestion) {
            this.hasShownCompletionSuggestion = true;
            
            // Show a subtle completion suggestion
            setTimeout(() => {
                this.showCompletionSuggestion();
            }, 2000);
        }
    }

    /**
     * Show suggestion to complete training
     */
    showCompletionSuggestion() {
        if (this.totalActions < 5) return; // Minimum actions before suggesting completion
        
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
        
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md mx-4">
                <div class="text-center">
                    <div class="text-4xl mb-4">📧</div>
                    <h2 class="text-xl font-bold text-gray-900 mb-4">Great Progress!</h2>
                    <p class="text-gray-700 mb-4">
                        You've processed ${this.totalActions} emails with ${this.sessionScore} correct decisions 
                        (${Math.round((this.sessionScore / this.totalActions) * 100)}% accuracy).
                    </p>
                    <p class="text-gray-600 text-sm mb-6">
                        Feel free to continue practicing or complete your training session now.
                    </p>
                    <div class="flex space-x-3 justify-center">
                        <button onclick="this.closest('.fixed').remove()" 
                                class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors">
                            Continue Training
                        </button>
                        <button onclick="window.emailFeedback?.completeTrainingSession?.(); this.closest('.fixed').remove()" 
                                class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                            Complete Session
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Store global reference for button handlers
        window.emailFeedback = this;
        
        // Auto-remove after 8 seconds if user doesn't interact
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 8000);
    }

    /**
     * Complete training session manually
     */
    completeTrainingSession() {
        if (this.emailApp && this.emailApp.actionHandler) {
            this.emailApp.actionHandler.completeEmailTraining();
        }
    }

    /**
     * Show feedback modal to the user
     * @param {Object} feedbackData - Feedback data to display
     */
    showFeedbackModal(feedbackData) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/75 flex items-center justify-center z-50';
        
        const { feedback } = feedbackData;
        const resultClass = feedback.result === 'correct' ? 'correct' : 'incorrect';
        const borderColor = feedback.result === 'correct' ? '#22c55e' : '#ef4444';
        const bgColor = feedback.result === 'correct' ? '#f0fdf4' : '#fef2f2';
        
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-lg mx-4 max-h-96 overflow-y-auto">
                <div class="text-center mb-6">
                    <div class="text-6xl mb-3">${feedback.result === 'correct' ? '✅' : '❌'}</div>
                    <h2 class="text-xl font-bold mb-2" style="color: ${feedback.result === 'correct' ? '#059669' : '#dc2626'}">${feedback.title}</h2>
                    <p class="text-gray-700">${feedback.message}</p>
                </div>

                <div class="space-y-4">
                    <!-- Email Details -->
                    <div class="bg-gray-50 rounded-lg p-3">
                        <h3 class="font-semibold text-gray-900 mb-2">📧 Email Details</h3>
                        <div class="text-sm text-gray-600 space-y-1">
                            <div><strong>From:</strong> ${feedbackData.emailSender}</div>
                            <div><strong>Subject:</strong> ${feedbackData.emailSubject}</div>
                            <div><strong>Your Action:</strong> ${feedbackData.playerAction.charAt(0).toUpperCase() + feedbackData.playerAction.slice(1)}</div>
                            <div><strong>Email Type:</strong> ${feedbackData.isSuspicious ? 'Suspicious/Phishing' : 'Legitimate'}</div>
                        </div>
                    </div>

                    ${feedback.redFlags.length > 0 ? `
                    <div class="bg-red-50 border border-red-200 rounded-lg p-3">
                        <h3 class="font-semibold text-red-800 mb-2">🚩 Red Flags Identified</h3>
                        <ul class="text-sm text-red-700 space-y-1">
                            ${feedback.redFlags.map(flag => `<li>• ${flag}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}

                    ${feedback.goodSigns.length > 0 ? `
                    <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                        <h3 class="font-semibold text-green-800 mb-2">✅ Positive Indicators</h3>
                        <ul class="text-sm text-green-700 space-y-1">
                            ${feedback.goodSigns.map(sign => `<li>• ${sign}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}

                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <h3 class="font-semibold text-blue-800 mb-2">💡 Security Tips</h3>
                        <ul class="text-sm text-blue-700 space-y-1">
                            ${feedback.tips.map(tip => `<li>• ${tip}</li>`).join('')}
                        </ul>
                    </div>

                    <!-- Session Progress -->
                    <div class="bg-gray-50 rounded-lg p-3">
                        <h3 class="font-semibold text-gray-900 mb-2">📊 Your Progress</h3>
                        <div class="text-sm text-gray-600">
                            <div>Correct Actions: ${this.sessionScore}/${this.totalActions}</div>
                            <div>Accuracy: ${this.totalActions > 0 ? Math.round((this.sessionScore / this.totalActions) * 100) : 0}%</div>
                        </div>
                    </div>
                </div>

                <div class="text-center mt-6">
                    <button onclick="this.closest('.fixed').remove()" 
                            class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">
                        Continue Training
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Auto-remove after 10 seconds if user doesn't interact
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 10000);
    }

    /**
     * Get session statistics
     * @returns {Object} Session statistics
     */
    getSessionStats() {
        return {
            totalActions: this.totalActions,
            correctActions: this.sessionScore,
            accuracy: this.totalActions > 0 ? Math.round((this.sessionScore / this.totalActions) * 100) : 0,
            feedbackHistory: this.feedbackHistory
        };
    }

    /**
     * Reset session data
     */
    resetSession() {
        this.feedbackHistory = [];
        this.sessionScore = 0;
        this.totalActions = 0;
        
        localStorage.removeItem('cyberquest_email_feedback_history');
        localStorage.removeItem('cyberquest_email_session_score');
        localStorage.removeItem('cyberquest_email_total_actions');
    }

    /**
     * Load session data from localStorage
     */
    loadSessionData() {
        const history = localStorage.getItem('cyberquest_email_feedback_history');
        const score = localStorage.getItem('cyberquest_email_session_score');
        const total = localStorage.getItem('cyberquest_email_total_actions');
        
        if (history) {
            this.feedbackHistory = JSON.parse(history);
        }
        if (score) {
            this.sessionScore = parseInt(score);
        }
        if (total) {
            this.totalActions = parseInt(total);
        }
    }

    /**
     * Show final session summary
     */
    showSessionSummary() {
        const stats = this.getSessionStats();
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/75 flex items-center justify-center z-50';
        
        const accuracyClass = stats.accuracy >= 80 ? 'text-green-600' : stats.accuracy >= 60 ? 'text-yellow-600' : 'text-red-600';
        const emoji = stats.accuracy >= 80 ? '🏆' : stats.accuracy >= 60 ? '👍' : '📚';
        
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-8 max-w-md mx-4">
                <div class="text-center">
                    <div class="text-6xl mb-4">${emoji}</div>
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">Email Security Training Complete!</h2>
                    
                    <div class="space-y-3 mb-6">
                        <div class="text-lg">
                            <span class="font-semibold">Final Score:</span>
                            <span class="${accuracyClass} font-bold text-xl"> ${stats.accuracy}%</span>
                        </div>
                        <div class="text-gray-600">
                            Correct Actions: ${stats.correctActions} out of ${stats.totalActions}
                        </div>
                    </div>
                    
                    <div class="text-sm text-gray-600 mb-6">
                        ${stats.accuracy >= 80 ? 
                            'Excellent work! You demonstrated strong email security awareness.' :
                            stats.accuracy >= 60 ?
                            'Good job! Continue practicing to improve your security skills.' :
                            'Keep learning! Email security is crucial for cybersecurity.'
                        }
                    </div>
                    
                    <button onclick="this.closest('.fixed').remove()" 
                            class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                        Continue to Next Level
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
}
