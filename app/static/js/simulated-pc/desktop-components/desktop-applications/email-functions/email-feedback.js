import { EmailServerAPI } from './email-server-api.js';

export class EmailFeedback {
    constructor(emailApp) {
        this.emailApp = emailApp;
        this.feedbackHistory = [];
        this.sessionScore = 0;
        this.totalActions = 0;
        this.emailServerAPI = new EmailServerAPI();
        this.dataLoaded = false;
    }

    /**
     * Evaluate player action and provide feedback
     * @param {Object} email - Email object with suspicious property
     * @param {string} action - Player action: 'report', 'trust', 'delete', 'ignore'
     * @param {string} reasoning - Optional reasoning for the action
     */
    async evaluateAction(email, action, reasoning = '') {
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

        await this.recordFeedback(feedbackData);
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
    async recordFeedback(feedbackData) {
        this.feedbackHistory.push(feedbackData);
        this.totalActions++;
        
        if (feedbackData.isCorrect) {
            this.sessionScore++;
        }

        // Store in server-side session data
        await this.saveSessionData();
    }

    /**
     * Show feedback modal to the user
     * @param {Object} feedbackData - Feedback data to display
     */
    showFeedbackModal(feedbackData) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/85 flex items-center justify-center z-50';
        
        const { feedback } = feedbackData;
        const resultClass = feedback.result === 'correct' ? 'correct' : 'incorrect';
        const resultColor = feedback.result === 'correct' ? '#22c55e' : '#ef4444';
        const bgColor = feedback.result === 'correct' ? '#064e3b' : '#7f1d1d';
        
        modal.innerHTML = `
            <div class="bg-gray-800 rounded-lg border border-gray-600 shadow-2xl p-6 max-w-lg mx-4 overflow-y-auto">
                <div class="text-center mb-6">
                    <div class="text-6xl mb-3">${feedback.result === 'correct' ? '✅' : '❌'}</div>
                    <h2 class="text-xl font-bold mb-2 text-white" style="color: ${resultColor}">${feedback.title}</h2>
                    <p class="text-gray-300">${feedback.message}</p>
                </div>

                <div class="space-y-4">
                    <!-- Email Details -->
                    <div class="bg-gray-700 rounded-lg p-3 border border-gray-600">
                        <h3 class="font-semibold text-white mb-2">📧 Email Details</h3>
                        <div class="text-sm text-gray-300 space-y-1">
                            <div><strong class="text-gray-200">From:</strong> ${feedbackData.emailSender}</div>
                            <div><strong class="text-gray-200">Subject:</strong> ${feedbackData.emailSubject}</div>
                            <div><strong class="text-gray-200">Your Action:</strong> ${feedbackData.playerAction.charAt(0).toUpperCase() + feedbackData.playerAction.slice(1)}</div>
                            <div><strong class="text-gray-200">Email Type:</strong> <span class="${feedbackData.isSuspicious ? 'text-red-400' : 'text-green-400'}">${feedbackData.isSuspicious ? 'Suspicious/Phishing' : 'Legitimate'}</span></div>
                        </div>
                    </div>

                    ${feedback.redFlags.length > 0 ? `
                    <div class="bg-red-900/30 border border-red-700 rounded-lg p-3">
                        <h3 class="font-semibold text-red-400 mb-2">🚩 Red Flags Identified</h3>
                        <ul class="text-sm text-red-300 space-y-1">
                            ${feedback.redFlags.map(flag => `<li class="flex items-start"><span class="text-red-500 mr-2">•</span>${flag}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}

                    ${feedback.goodSigns.length > 0 ? `
                    <div class="bg-green-900/30 border border-green-700 rounded-lg p-3">
                        <h3 class="font-semibold text-green-400 mb-2">✅ Positive Indicators</h3>
                        <ul class="text-sm text-green-300 space-y-1">
                            ${feedback.goodSigns.map(sign => `<li class="flex items-start"><span class="text-green-500 mr-2">•</span>${sign}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}

                    <div class="bg-blue-900/30 border border-blue-700 rounded-lg p-3">
                        <h3 class="font-semibold text-blue-400 mb-2">💡 Security Tips</h3>
                        <ul class="text-sm text-blue-300 space-y-1">
                            ${feedback.tips.map(tip => `<li class="flex items-start"><span class="text-blue-500 mr-2">•</span>${tip}</li>`).join('')}
                        </ul>
                    </div>

                    <!-- Session Progress -->
                    <div class="bg-gray-700 rounded-lg p-3 border border-gray-600">
                        <h3 class="font-semibold text-white mb-2">📊 Your Progress</h3>
                        <div class="text-sm text-gray-300">
                            <div class="mb-2">Correct Actions: <span class="text-green-400 font-semibold">${this.sessionScore}</span>/<span class="text-gray-200">${this.totalActions}</span></div>
                            <div class="mb-3">Accuracy: <span class="text-yellow-400 font-semibold">${this.totalActions > 0 ? Math.round((this.sessionScore / this.totalActions) * 100) : 0}%</span></div>
                            
                            <!-- Progress Bar -->
                            <div class="w-full bg-gray-600 rounded-full h-2">
                                <div class="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500" 
                                     style="width: ${this.totalActions > 0 ? (this.sessionScore / this.totalActions) * 100 : 0}%"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="text-center mt-6">
                    <button onclick="this.closest('.fixed').remove()" 
                            class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors font-semibold">
                        Continue Training
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Auto-remove after 12 seconds if user doesn't interact
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 12000);
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
    async resetSession() {
        this.feedbackHistory = [];
        this.sessionScore = 0;
        this.totalActions = 0;
        
        // Clear server-side session data
        await this.emailServerAPI.saveSessionData({
            feedback_history: [],
            session_score: 0,
            total_actions: 0
        });
    }

    /**
     * Load session data from server
     */
    async loadSessionData() {
        if (this.dataLoaded) return;
        
        try {
            const sessionData = await this.emailServerAPI.loadSessionData();
            
            if (sessionData.feedback_history) {
                this.feedbackHistory = Array.isArray(sessionData.feedback_history) 
                    ? sessionData.feedback_history 
                    : JSON.parse(sessionData.feedback_history);
            }
            
            if (sessionData.session_score !== undefined) {
                this.sessionScore = parseInt(sessionData.session_score) || 0;
            }
            
            if (sessionData.total_actions !== undefined) {
                this.totalActions = parseInt(sessionData.total_actions) || 0;
            }
            
            this.dataLoaded = true;
        } catch (error) {
            console.warn('Could not load session data from server:', error);
            // Initialize with defaults
            this.feedbackHistory = [];
            this.sessionScore = 0;
            this.totalActions = 0;
            this.dataLoaded = true;
        }
    }

    /**
     * Save session data to server
     */
    async saveSessionData() {
        try {
            await this.emailServerAPI.saveSessionData({
                feedback_history: this.feedbackHistory,
                session_score: this.sessionScore,
                total_actions: this.totalActions
            });
        } catch (error) {
            console.error('Failed to save session data:', error);
        }
    }

    /**
     * Show final session summary
     */
    showSessionSummary() {
        const stats = this.getSessionStats();
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/85 flex items-center justify-center z-50';
        
        const accuracyClass = stats.accuracy >= 80 ? 'text-green-400' : stats.accuracy >= 60 ? 'text-yellow-400' : 'text-red-400';
        const emoji = stats.accuracy >= 80 ? '🏆' : stats.accuracy >= 60 ? '👍' : '📚';
        const bgGradient = stats.accuracy >= 80 ? 'from-green-600 to-emerald-600' : stats.accuracy >= 60 ? 'from-yellow-600 to-orange-600' : 'from-red-600 to-pink-600';
        
        modal.innerHTML = `
            <div class="bg-gray-800 rounded-lg border border-gray-600 shadow-2xl p-8 max-w-md mx-4">
                <div class="text-center">
                    <div class="text-6xl mb-4">${emoji}</div>
                    <h2 class="text-2xl font-bold text-white mb-4">Email Security Training Complete!</h2>
                    
                    <div class="space-y-3 mb-6">
                        <div class="text-lg">
                            <span class="font-semibold text-gray-200">Final Score:</span>
                            <span class="${accuracyClass} font-bold text-2xl"> ${stats.accuracy}%</span>
                        </div>
                        
                        <!-- Animated Progress Ring -->
                        <div class="relative w-24 h-24 mx-auto mb-4">
                            <svg class="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                                <path class="text-gray-600" stroke="currentColor" stroke-width="2" fill="none" 
                                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                                <path class="${accuracyClass}" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"
                                      stroke-dasharray="${stats.accuracy}, 100" 
                                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                            </svg>
                            <div class="absolute inset-0 flex items-center justify-center">
                                <span class="${accuracyClass} text-lg font-bold">${stats.accuracy}%</span>
                            </div>
                        </div>
                        
                        <div class="text-gray-300 text-sm">
                            Correct Actions: <span class="text-green-400 font-semibold">${stats.correctActions}</span> out of <span class="text-gray-200">${stats.totalActions}</span>
                        </div>
                    </div>
                    
                    <div class="text-sm text-gray-400 mb-6 p-3 bg-gray-700 rounded-lg border border-gray-600">
                        ${stats.accuracy >= 80 ? 
                            'Excellent work! You demonstrated strong email security awareness.' :
                            stats.accuracy >= 60 ?
                            'Good job! Continue practicing to improve your security skills.' :
                            'Keep learning! Email security is crucial for cybersecurity.'
                        }
                    </div>
                    
                    <button onclick="this.closest('.fixed').remove()" 
                            class="bg-gradient-to-r ${bgGradient} text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold">
                        Continue to Next Level
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
}
