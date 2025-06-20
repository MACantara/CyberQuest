import { BaseTutorial } from '../tutorial-manager.js';

export class EmailTutorial extends BaseTutorial {
    constructor(desktop) {
        super(desktop);
        this.emailsAnalyzed = 0;
        this.steps = [
            {
                target: '.email-item:first-child',
                title: 'Suspicious Email Alert',
                content: 'This email has been flagged as suspicious! Notice the red border - this indicates potential phishing. Let\'s examine why this email is dangerous.',
                action: 'highlight',
                position: 'right'
            },
            {
                target: '.email-item:first-child .font-medium',
                title: 'Check the Sender',
                content: 'Look at the sender address: "prince.nigeria@totally-real.com" - This is clearly suspicious! Real organizations use professional email addresses.',
                action: 'pulse',
                position: 'right'
            },
            {
                target: '.email-item:first-child .text-gray-300',
                title: 'Urgent Language Warning',
                content: 'Phishing emails often use urgent language like "URGENT" or "CLAIM NOW" to pressure you into acting quickly without thinking.',
                action: 'highlight',
                position: 'right'
            },
            {
                target: '.email-item:nth-child(2)',
                title: 'Legitimate Email',
                content: 'This email from "admin@cyberquest.com" appears legitimate. It\'s from the actual training platform with a professional address.',
                action: 'highlight',
                position: 'right'
            },
            {
                target: '.email-item:nth-child(3)',
                title: 'Another Suspicious Email',
                content: 'This email claims to be from a bank but asks about account suspension. Always verify bank communications through official channels!',
                action: 'highlight',
                position: 'right'
            },
            {
                target: '.email-item',
                title: 'Your Mission',
                content: 'Click on different emails to analyze them. Look for red flags like suspicious senders, urgent language, and requests for personal information.',
                action: 'pulse',
                position: 'right',
                final: true
            }
        ];
    }

    start() {
        if (this.isActive) return;
        
        this.isActive = true;
        this.currentStep = 0;
        this.emailsAnalyzed = 0;
        
        // Wait for email app to be fully loaded
        setTimeout(() => {
            this.createOverlay();
            this.showStep();
            this.setupEmailClickListeners();
        }, 1000);
    }

    setupEmailClickListeners() {
        const emailItems = document.querySelectorAll('.email-item');
        emailItems.forEach((email, index) => {
            email.addEventListener('click', () => {
                if (this.isActive) {
                    this.analyzeEmail(email, index);
                }
            });
        });
    }

    analyzeEmail(emailElement, index) {
        this.emailsAnalyzed++;
        
        // Add visual feedback
        emailElement.classList.add('bg-blue-900', 'bg-opacity-30');
        
        // Show analysis tooltip
        this.showEmailAnalysis(emailElement, index);
        
        // If analyzed enough emails, complete tutorial
        if (this.emailsAnalyzed >= 2) {
            setTimeout(() => {
                this.complete();
            }, 3000);
        }
    }

    showEmailAnalysis(emailElement, index) {
        const analysisMessages = [
            {
                title: '🚨 PHISHING DETECTED',
                content: 'This is a classic inheritance scam! Red flags: suspicious sender, urgent language, too-good-to-be-true offer.',
                type: 'danger'
            },
            {
                title: '✅ LEGITIMATE EMAIL',
                content: 'This email appears safe. It\'s from the official training platform with proper formatting.',
                type: 'success'
            },
            {
                title: '⚠️ SUSPICIOUS ACTIVITY',
                content: 'Bank impersonation attempt! Always contact your bank directly to verify such messages.',
                type: 'warning'
            }
        ];

        const analysis = analysisMessages[index] || analysisMessages[0];
        
        // Create temporary analysis popup
        const popup = document.createElement('div');
        popup.className = `fixed z-60 p-4 rounded shadow-2xl max-w-sm transform transition-all duration-300 ${
            analysis.type === 'danger' ? 'bg-red-900 border-red-500' :
            analysis.type === 'success' ? 'bg-green-900 border-green-500' :
            'bg-yellow-900 border-yellow-500'
        } border`;
        
        popup.innerHTML = `
            <h4 class="font-bold text-white mb-2">${analysis.title}</h4>
            <p class="text-gray-300 text-sm">${analysis.content}</p>
        `;
        
        // Position popup near email
        const rect = emailElement.getBoundingClientRect();
        popup.style.left = `${rect.right + 20}px`;
        popup.style.top = `${rect.top}px`;
        
        document.body.appendChild(popup);
        
        // Remove popup after 3 seconds
        setTimeout(() => {
            popup.remove();
        }, 3000);
    }

    // Override base class methods
    getSkipTutorialHandler() {
        return 'window.emailTutorial.showSkipModal()';
    }

    getPreviousStepHandler() {
        return 'window.emailTutorial.previousStep()';
    }

    getNextStepHandler() {
        return 'window.emailTutorial.nextStep()';
    }

    getFinalStepHandler() {
        return 'window.emailTutorial.startAnalysis()';
    }

    getFinalButtonText() {
        return 'Start Analysis';
    }

    startAnalysis() {
        // Move to interactive analysis mode
        this.clearHighlights();
        this.tooltip.innerHTML = this.createAnalysisPrompt();
    }

    createAnalysisPrompt() {
        return `
            <div class="tutorial-content">
                <h3 class="text-lg font-bold text-white mb-4">🔍 Email Analysis Mode</h3>
                <p class="text-gray-300 text-sm mb-4">
                    Great! Now click on the emails to analyze them. I'll give you feedback on each one.
                </p>
                <div class="bg-blue-900/30 rounded p-3 mb-4">
                    <p class="text-blue-300 text-xs">
                        <strong>Tip:</strong> Look for suspicious sender addresses, urgent language, and requests for personal information.
                    </p>
                </div>
                <div class="text-center">
                    <div class="text-2xl mb-2">📧</div>
                    <p class="text-gray-400 text-xs">Emails analyzed: ${this.emailsAnalyzed}/3</p>
                </div>
            </div>
        `;
    }

    complete() {
        super.complete();
        
        // Store completion in localStorage
        localStorage.setItem('cyberquest_email_tutorial_completed', 'true');
        
        // Show completion message
        this.desktop.windowManager.createWindow('email-tutorial-complete', 'Email Security Training Complete', this.createCompletionContent(), {
            width: '60%',
            height: '50%'
        });
    }

    createCompletionContent() {
        return `
            <div class="p-6 text-center text-white">
                <div class="text-6xl mb-4">🛡️</div>
                <h2 class="text-2xl font-bold text-green-400 mb-4">Email Security Training Complete!</h2>
                <p class="text-gray-300 mb-6">
                    Excellent work! You've learned how to identify phishing emails and suspicious content.
                    This knowledge will help protect you from cyber threats.
                </p>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div class="bg-red-900/30 rounded p-4">
                        <h3 class="text-lg font-semibold text-red-400 mb-2">🚨 Red Flags</h3>
                        <ul class="text-left text-sm text-gray-300 space-y-1">
                            <li>• Suspicious sender addresses</li>
                            <li>• Urgent or threatening language</li>
                            <li>• Too-good-to-be-true offers</li>
                            <li>• Requests for personal info</li>
                        </ul>
                    </div>
                    
                    <div class="bg-green-900/30 rounded p-4">
                        <h3 class="text-lg font-semibold text-green-400 mb-2">✅ Safety Tips</h3>
                        <ul class="text-left text-sm text-gray-300 space-y-1">
                            <li>• Verify sender identity</li>
                            <li>• Check URLs carefully</li>
                            <li>• Don't click suspicious links</li>
                            <li>• When in doubt, ask for help</li>
                        </ul>
                    </div>
                </div>
                
                <p class="text-sm text-gray-400">
                    Continue exploring the email client to practice your skills! 🎯
                </p>
            </div>
        `;
    }

    showSkipModal() {
        if (confirm('Are you sure you want to skip the email security tutorial? This training is important for cybersecurity awareness.')) {
            this.complete();
        }
    }

    // Static methods
    static shouldAutoStart() {
        return !localStorage.getItem('cyberquest_email_tutorial_completed');
    }

    static restart() {
        localStorage.removeItem('cyberquest_email_tutorial_completed');
    }
}
