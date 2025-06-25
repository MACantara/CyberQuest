import { BaseTutorial } from '../base-tutorial.js';

export class EmailTutorial extends BaseTutorial {
    constructor(desktop) {
        super(desktop);
        this.steps = [
            {
                target: '#suspicious-email',
                title: 'Suspicious Email Alert',
                content: 'This email has been flagged as suspicious! Notice the red border - this indicates potential phishing. Let\'s examine why this email is dangerous.',
                action: 'highlight',
                position: 'right'
            },
            {
                target: '#suspicious-sender',
                title: 'Check the Sender',
                content: 'Look at the sender address: "prince.nigeria@totally-real.com" - This is clearly suspicious! Real organizations use professional email addresses.',
                action: 'pulse',
                position: 'right'
            },
            {
                target: '#suspicious-subject',
                title: 'Urgent Language Warning',
                content: 'Phishing emails often use urgent language like "URGENT" or "CLAIM NOW" to pressure you into acting quickly without thinking.',
                action: 'highlight',
                position: 'right'
            },
            {
                target: '#legitimate-email',
                title: 'Legitimate Email',
                content: 'This email from "admin@cyberquest.com" appears legitimate. It\'s from the actual training platform with a professional address.',
                action: 'highlight',
                position: 'right'
            },
            {
                target: '#bank-email',
                title: 'Another Suspicious Email',
                content: 'This email claims to be from a bank but asks about account suspension. Always verify bank communications through official channels!',
                action: 'highlight',
                position: 'right'
            },
            {
                target: '#email-list',
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
        return 'Finish Tutorial';
    }

    complete() {
        super.complete();
        
        // Store completion in localStorage
        localStorage.setItem('cyberquest_email_tutorial_completed', 'true');
    }

    // Static methods
    static shouldAutoStart() {
        return !localStorage.getItem('cyberquest_email_tutorial_completed');
    }

    static restart() {
        localStorage.removeItem('cyberquest_email_tutorial_completed');
    }
}