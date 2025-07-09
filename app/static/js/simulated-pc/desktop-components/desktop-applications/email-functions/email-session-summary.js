export class EmailSessionSummary {
    constructor(emailApp) {
        this.emailApp = emailApp;
    }

    /**
     * Show comprehensive session summary modal
     * @param {Object} sessionStats - Session statistics from EmailFeedback
     * @param {Array} feedbackHistory - Array of all feedback interactions
     */
    showSessionSummary(sessionStats, feedbackHistory = []) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/75 flex items-center justify-center z-50';
        
        const accuracyClass = this.getAccuracyClass(sessionStats.accuracy);
        const emoji = this.getAccuracyEmoji(sessionStats.accuracy);
        const levelCompleted = sessionStats.accuracy >= 70; // 70% threshold for completion
        
        modal.innerHTML = `
            <div class="bg-gray-800 text-white rounded-lg p-8 max-w-4xl mx-4 max-h-96 overflow-y-auto border border-gray-600 shadow-2xl">
                <div class="text-center mb-8">
                    <div class="text-6xl mb-4">${emoji}</div>
                    <h2 class="text-3xl font-bold text-white mb-4">
                        ${levelCompleted ? '🎉 Level 2 Complete!' : 'Training Session Complete'}
                    </h2>
                    
                    <div class="mb-6">
                        <div class="text-5xl font-bold ${accuracyClass} mb-2">${sessionStats.accuracy}%</div>
                        <div class="text-lg text-gray-300">Email Security Accuracy</div>
                        <div class="text-sm text-gray-400">
                            ${sessionStats.correctActions} correct out of ${sessionStats.totalActions} total actions
                        </div>
                    </div>
                    
                    ${this.generatePerformanceMessage(sessionStats.accuracy)}
                </div>

                <!-- Detailed Statistics -->
                <div class="grid md:grid-cols-2 gap-6 mb-8">
                    <!-- Performance Breakdown -->
                    <div class="bg-gray-700 border border-gray-600 rounded-lg p-6">
                        <h3 class="text-lg font-semibold text-white mb-4 flex items-center">
                            <i class="bi bi-bar-chart text-blue-400 mr-2"></i>
                            Performance Breakdown
                        </h3>
                        ${this.generatePerformanceChart(sessionStats, feedbackHistory)}
                    </div>
                    
                    <!-- Key Insights -->
                    <div class="bg-gray-700 border border-gray-600 rounded-lg p-6">
                        <h3 class="text-lg font-semibold text-white mb-4 flex items-center">
                            <i class="bi bi-lightbulb text-yellow-400 mr-2"></i>
                            Key Insights
                        </h3>
                        ${this.generateKeyInsights(feedbackHistory)}
                    </div>
                </div>

                <!-- Email Categories Performance -->
                ${this.generateEmailCategoriesSection(feedbackHistory)}

                <!-- Areas for Improvement -->
                ${this.generateImprovementSection(feedbackHistory, sessionStats.accuracy)}

                <!-- Action Buttons -->
                <div class="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    ${levelCompleted ? `
                        <button onclick="window.emailSessionSummary?.completeLevel2?.()" 
                                class="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-semibold text-lg shadow-lg">
                            <i class="bi bi-trophy mr-2"></i>
                            Continue to Next Level
                        </button>
                        <button onclick="window.emailSessionSummary?.reviewMistakes?.()" 
                                class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold border border-blue-500">
                            <i class="bi bi-eye mr-2"></i>
                            Review Mistakes
                        </button>
                    ` : `
                        <button onclick="window.emailSessionSummary?.retryTraining?.()" 
                                class="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold text-lg border border-orange-500">
                            <i class="bi bi-arrow-clockwise mr-2"></i>
                            Retry Training
                        </button>
                        <button onclick="window.emailSessionSummary?.reviewMistakes?.()" 
                                class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold border border-blue-500">
                            <i class="bi bi-eye mr-2"></i>
                            Review Mistakes
                        </button>
                    `}
                    
                    <button onclick="this.closest('.fixed').remove()" 
                            class="bg-gray-600 text-gray-200 px-6 py-3 rounded-lg hover:bg-gray-500 transition-colors font-semibold border border-gray-500">
                        Close Summary
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Store global reference for button handlers
        window.emailSessionSummary = this;
        
        // Store session data for future reference
        this.lastSessionStats = sessionStats;
        this.lastFeedbackHistory = feedbackHistory;
    }

    /**
     * Generate performance message based on accuracy
     */
    generatePerformanceMessage(accuracy) {
        if (accuracy >= 90) {
            return `
                <div class="bg-green-900/50 border border-green-700 rounded-lg p-4 mb-6">
                    <div class="text-green-300 font-semibold">Outstanding Performance!</div>
                    <div class="text-green-400 text-sm">You demonstrated exceptional email security awareness. You're ready for advanced challenges!</div>
                </div>
            `;
        } else if (accuracy >= 80) {
            return `
                <div class="bg-blue-900/50 border border-blue-700 rounded-lg p-4 mb-6">
                    <div class="text-blue-300 font-semibold">Excellent Work!</div>
                    <div class="text-blue-400 text-sm">Strong email security skills. You've successfully completed this level!</div>
                </div>
            `;
        } else if (accuracy >= 70) {
            return `
                <div class="bg-yellow-900/50 border border-yellow-700 rounded-lg p-4 mb-6">
                    <div class="text-yellow-300 font-semibold">Good Progress!</div>
                    <div class="text-yellow-400 text-sm">You've passed the minimum threshold. Review the feedback to strengthen your skills.</div>
                </div>
            `;
        } else {
            return `
                <div class="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-6">
                    <div class="text-red-300 font-semibold">Keep Learning!</div>
                    <div class="text-red-400 text-sm">Email security requires more practice. Review the feedback and try again to improve your skills.</div>
                </div>
            `;
        }
    }

    /**
     * Generate visual performance chart
     */
    generatePerformanceChart(sessionStats, feedbackHistory) {
        const correctPercentage = sessionStats.accuracy;
        const incorrectPercentage = 100 - correctPercentage;
        
        return `
            <div class="space-y-4">
                <div class="flex justify-between text-sm">
                    <span class="text-green-400 font-medium">Correct Actions</span>
                    <span class="font-semibold text-gray-300">${sessionStats.correctActions}</span>
                </div>
                <div class="w-full bg-gray-600 rounded-full h-3">
                    <div class="bg-green-500 h-3 rounded-full transition-all duration-1000" 
                         style="width: ${correctPercentage}%"></div>
                </div>
                
                <div class="flex justify-between text-sm">
                    <span class="text-red-400 font-medium">Incorrect Actions</span>
                    <span class="font-semibold text-gray-300">${sessionStats.totalActions - sessionStats.correctActions}</span>
                </div>
                <div class="w-full bg-gray-600 rounded-full h-3">
                    <div class="bg-red-500 h-3 rounded-full transition-all duration-1000" 
                         style="width: ${incorrectPercentage}%"></div>
                </div>
                
                <div class="pt-3 border-t border-gray-600">
                    <div class="text-xs text-gray-400">
                        <div>Total Emails Processed: ${this.countUniqueEmails(feedbackHistory)}</div>
                        <div>Session Duration: ${this.calculateSessionDuration(feedbackHistory)}</div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Generate key insights from feedback history
     */
    generateKeyInsights(feedbackHistory) {
        const insights = [];
        
        // Analyze suspicious email detection
        const suspiciousEmails = feedbackHistory.filter(f => f.isSuspicious);
        const correctSuspicious = suspiciousEmails.filter(f => f.isCorrect).length;
        const suspiciousAccuracy = suspiciousEmails.length > 0 ? Math.round((correctSuspicious / suspiciousEmails.length) * 100) : 0;
        
        if (suspiciousAccuracy >= 80) {
            insights.push("✅ Strong phishing detection skills");
        } else {
            insights.push("⚠️ Need improvement in phishing detection");
        }
        
        // Analyze legitimate email handling
        const legitimateEmails = feedbackHistory.filter(f => !f.isSuspicious);
        const correctLegitimate = legitimateEmails.filter(f => f.isCorrect).length;
        const legitimateAccuracy = legitimateEmails.length > 0 ? Math.round((correctLegitimate / legitimateEmails.length) * 100) : 0;
        
        if (legitimateAccuracy >= 80) {
            insights.push("✅ Good legitimate email recognition");
        } else {
            insights.push("⚠️ Sometimes too cautious with legitimate emails");
        }
        
        // Analyze response time patterns
        const avgResponseTime = this.calculateAverageResponseTime(feedbackHistory);
        if (avgResponseTime < 30) {
            insights.push("⚡ Quick decision making");
        } else if (avgResponseTime > 120) {
            insights.push("🤔 Thoughtful, deliberate analysis");
        }
        
        return `
            <div class="space-y-2">
                ${insights.map(insight => `
                    <div class="text-sm text-gray-300 flex items-center">
                        <span class="mr-2">${insight}</span>
                    </div>
                `).join('')}
                
                <div class="mt-4 pt-3 border-t border-gray-600">
                    <div class="text-xs text-gray-400">
                        <div>Phishing Detection: ${suspiciousAccuracy}%</div>
                        <div>Legitimate Recognition: ${legitimateAccuracy}%</div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Generate email categories performance section
     */
    generateEmailCategoriesSection(feedbackHistory) {
        const categories = this.categorizeEmailPerformance(feedbackHistory);
        
        return `
            <div class="bg-gray-700 border border-gray-600 rounded-lg p-6 mb-6">
                <h3 class="text-lg font-semibold text-white mb-4 flex items-center">
                    <i class="bi bi-envelope-check text-purple-400 mr-2"></i>
                    Email Category Performance
                </h3>
                
                <div class="grid md:grid-cols-2 gap-4">
                    ${Object.entries(categories).map(([category, data]) => `
                        <div class="bg-gray-800 border border-gray-600 rounded-lg p-4">
                            <div class="flex justify-between items-center mb-2">
                                <span class="font-medium text-white">${category}</span>
                                <span class="text-sm font-semibold ${data.accuracy >= 70 ? 'text-green-400' : 'text-red-400'}">
                                    ${data.accuracy}%
                                </span>
                            </div>
                            <div class="w-full bg-gray-600 rounded-full h-2">
                                <div class="h-2 rounded-full transition-all duration-1000 ${data.accuracy >= 70 ? 'bg-green-500' : 'bg-red-500'}" 
                                     style="width: ${data.accuracy}%"></div>
                            </div>
                            <div class="text-xs text-gray-400 mt-1">
                                ${data.correct}/${data.total} correct
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Generate improvement suggestions
     */
    generateImprovementSection(feedbackHistory, accuracy) {
        if (accuracy >= 80) return '';
        
        const suggestions = this.generateImprovementSuggestions(feedbackHistory);
        
        return `
            <div class="bg-blue-900/30 border border-blue-600 rounded-lg p-6 mb-6">
                <h3 class="text-lg font-semibold text-blue-300 mb-4 flex items-center">
                    <i class="bi bi-lightbulb text-blue-400 mr-2"></i>
                    Areas for Improvement
                </h3>
                
                <div class="space-y-3">
                    ${suggestions.map(suggestion => `
                        <div class="flex items-start">
                            <div class="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">!</div>
                            <div class="text-blue-200 text-sm">${suggestion}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Helper methods for calculations and analysis
     */
    getAccuracyClass(accuracy) {
        if (accuracy >= 80) return 'text-green-600';
        if (accuracy >= 70) return 'text-yellow-600';
        return 'text-red-600';
    }

    getAccuracyEmoji(accuracy) {
        if (accuracy >= 90) return '🏆';
        if (accuracy >= 80) return '🎉';
        if (accuracy >= 70) return '👍';
        return '📚';
    }

    countUniqueEmails(feedbackHistory) {
        const uniqueEmails = new Set(feedbackHistory.map(f => f.emailId));
        return uniqueEmails.size;
    }

    calculateSessionDuration(feedbackHistory) {
        if (feedbackHistory.length < 2) return 'N/A';
        
        const start = new Date(feedbackHistory[0].timestamp);
        const end = new Date(feedbackHistory[feedbackHistory.length - 1].timestamp);
        const durationMinutes = Math.round((end - start) / (1000 * 60));
        
        return durationMinutes > 0 ? `${durationMinutes} minutes` : '< 1 minute';
    }

    calculateAverageResponseTime(feedbackHistory) {
        // This would require tracking response times in the feedback system
        // For now, return a simulated value
        return Math.random() * 60 + 30; // 30-90 seconds
    }

    categorizeEmailPerformance(feedbackHistory) {
        const categories = {
            'Phishing Emails': { correct: 0, total: 0, accuracy: 0 },
            'Legitimate Emails': { correct: 0, total: 0, accuracy: 0 }
        };
        
        feedbackHistory.forEach(feedback => {
            if (feedback.isSuspicious) {
                categories['Phishing Emails'].total++;
                if (feedback.isCorrect) categories['Phishing Emails'].correct++;
            } else {
                categories['Legitimate Emails'].total++;
                if (feedback.isCorrect) categories['Legitimate Emails'].correct++;
            }
        });
        
        // Calculate accuracies
        Object.keys(categories).forEach(key => {
            const cat = categories[key];
            cat.accuracy = cat.total > 0 ? Math.round((cat.correct / cat.total) * 100) : 0;
        });
        
        return categories;
    }

    generateImprovementSuggestions(feedbackHistory) {
        const suggestions = [];
        
        const phishingMistakes = feedbackHistory.filter(f => f.isSuspicious && !f.isCorrect);
        const legitimateMistakes = feedbackHistory.filter(f => !f.isSuspicious && !f.isCorrect);
        
        if (phishingMistakes.length > legitimateMistakes.length) {
            suggestions.push("Practice identifying red flags in suspicious emails such as urgent language, suspicious links, and requests for personal information.");
            suggestions.push("Pay closer attention to sender domains and email formatting inconsistencies.");
        } else if (legitimateMistakes.length > phishingMistakes.length) {
            suggestions.push("Learn to recognize legitimate business communications and professional email formatting.");
            suggestions.push("Consider the context and necessity of the email request before marking as suspicious.");
        }
        
        if (suggestions.length === 0) {
            suggestions.push("Review email security best practices and common phishing techniques.");
            suggestions.push("Practice with more email examples to build confidence in decision-making.");
        }
        
        return suggestions;
    }

    /**
     * Action handlers for buttons
     */
    completeLevel2() {
        // Mark Level 2 as completed
        localStorage.setItem('cyberquest_level_2_completed', 'true');
        localStorage.setItem('cyberquest_email_training_completed', 'true');
        localStorage.setItem('cyberquest_email_training_score', this.lastSessionStats.accuracy.toString());
        
        console.log('Level 2 marked as completed:', {
            level_completed: localStorage.getItem('cyberquest_level_2_completed'),
            training_completed: localStorage.getItem('cyberquest_email_training_completed'),
            score: localStorage.getItem('cyberquest_email_training_score')
        });
        
        // Close modal and navigate to next level or dashboard
        document.querySelector('.fixed')?.remove();
        
        // Navigate to levels overview or next level
        if (window.desktop?.windowManager) {
            try {
                const browserApp = window.desktop.windowManager.applications.get('browser');
                if (browserApp) {
                    browserApp.navigation.navigateToUrl('/levels');
                }
            } catch (error) {
                console.error('Failed to navigate to levels:', error);
                window.location.href = '/levels';
            }
        } else {
            window.location.href = '/levels';
        }
    }

    retryTraining() {
        // Reset email training state and restart
        document.querySelector('.fixed')?.remove();
        
        // Reset the email app to allow retry
        if (this.emailApp && this.emailApp.reset) {
            this.emailApp.reset();
        }
        
        console.log('Training session reset for retry');
    }

    reviewMistakes() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/75 flex items-center justify-center z-50';
        
        const mistakes = this.lastFeedbackHistory.filter(f => !f.isCorrect);
        
        modal.innerHTML = `
            <div class="bg-gray-800 text-white rounded-lg p-6 max-w-2xl mx-4 max-h-96 overflow-y-auto border border-gray-600">
                <h2 class="text-xl font-bold text-white mb-4">Review Your Mistakes</h2>
                
                ${mistakes.length === 0 ? `
                    <div class="text-center py-8">
                        <div class="text-4xl mb-4">🎯</div>
                        <div class="text-lg font-semibold text-green-400">Perfect Score!</div>
                        <div class="text-gray-400">You didn't make any mistakes in this session.</div>
                    </div>
                ` : `
                    <div class="space-y-4">
                        ${mistakes.map((mistake, index) => `
                            <div class="border border-gray-600 rounded-lg p-4 bg-gray-700">
                                <div class="flex items-start justify-between mb-2">
                                    <div class="font-semibold text-white">Email ${index + 1}</div>
                                    <div class="text-xs text-gray-400">${mistake.timestamp}</div>
                                </div>
                                
                                <div class="text-sm text-gray-300 mb-2">
                                    <strong>From:</strong> ${mistake.emailSender}<br>
                                    <strong>Subject:</strong> ${mistake.emailSubject}
                                </div>
                                
                                <div class="bg-red-900/50 border border-red-600 rounded p-3 mb-2">
                                    <div class="text-red-300 font-medium">Your Action: ${mistake.playerAction}</div>
                                    <div class="text-red-400 text-sm">This email was ${mistake.isSuspicious ? 'suspicious' : 'legitimate'}</div>
                                </div>
                                
                                <div class="text-xs text-gray-400">
                                    ${mistake.reasoning || 'Review the email characteristics and learn to identify similar patterns in the future.'}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `}
                
                <div class="text-center mt-6">
                    <button onclick="this.closest('.fixed').remove()" 
                            class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors border border-blue-500">
                        Close Review
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
}
