import { BaseTutorial } from '../tutorial-manager.js';

export class EmailTutorial extends BaseTutorial {
    constructor(desktop) {
        super(desktop);
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
                title: 'Email Security Complete',
                content: 'You\'ve learned to identify suspicious emails! Always look for red flags like suspicious senders, urgent language, and requests for personal information.',
                action: 'highlight',
                position: 'right',
                final: true
            }
        ];
    }

    start() {
        if (this.isActive) return;
        
        this.isActive = true;
        this.currentStep = 0;
        
        // Wait for email app to be fully loaded
        setTimeout(() => {
            this.createOverlay();
            this.showStep();
        }, 1000);
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
        return 'window.emailTutorial.complete()';
    }

    getFinalButtonText() {
        return 'Complete Training';
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
