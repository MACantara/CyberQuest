import { BaseTutorial } from './base-tutorial.js';

export class EmailTutorial extends BaseTutorial {
    constructor(desktop) {
        super(desktop);
        this.steps = [
            {
                target: '.email-folder[data-folder="inbox"]',
                title: 'Email Inbox Navigation',
                content: 'This is your email inbox. Notice it shows the number of emails you have. Click here to view your emails and learn to identify threats.',
                action: 'highlight',
                position: 'right'
            },
            {
                target: '#email-list',
                title: 'Email List Overview',
                content: 'Here you can see all your emails. Notice the colored dots - blue dots indicate unread emails, gray dots show read emails. Look for suspicious patterns!',
                action: 'highlight',
                position: 'right'
            },
            {
                target: '.email-item:first-child',
                title: 'Suspicious Email Detection',
                content: 'This email looks suspicious! Always check the sender address carefully. Emails from unknown or suspicious domains should be treated with caution.',
                action: 'pulse',
                position: 'right'
            },
            {
                target: '.email-item:nth-child(2)',
                title: 'Banking Phishing Attempt',
                content: 'This email claims to be from a bank about account suspension. This is a common phishing tactic! Always verify bank communications through official channels.',
                action: 'pulse',
                position: 'right'
            },
            {
                target: '.email-item:nth-child(3)',
                title: 'Legitimate vs Suspicious',
                content: 'Compare this email to the previous one. Look at the sender domain and subject line. Legitimate organizations use professional email addresses.',
                action: 'highlight',
                position: 'right'
            },
            {
                target: '#email-list',
                title: 'Email Security Best Practices',
                content: 'Remember: Never click suspicious links, always verify sender authenticity, be wary of urgent language, and when in doubt, contact the organization directly.',
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

    // Override to add email-specific tutorial behaviors
    showStep() {
        if (this.currentStep >= this.steps.length) {
            this.complete();
            return;
        }

        const step = this.steps[this.currentStep];
        
        // Special handling for email list step - ensure we're looking at the inbox
        if (step.target === '#email-list') {
            // Make sure we're in the inbox view
            const inboxFolder = document.querySelector('.email-folder[data-folder="inbox"]');
            if (inboxFolder && !inboxFolder.classList.contains('bg-green-400')) {
                inboxFolder.click();
                // Wait a moment for the view to update
                setTimeout(() => {
                    super.showStep();
                }, 300);
                return;
            }
        }

        super.showStep();
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