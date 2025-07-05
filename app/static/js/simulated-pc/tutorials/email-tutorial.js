import { BaseTutorial } from './base-tutorial.js';
import { tutorialInteractionManager } from './tutorial-interaction-manager.js';

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
                title: 'Email Security Complete!',
                content: 'Excellent! You\'ve learned to identify key email security threats: suspicious sender addresses, phishing attempts, urgent language tactics, and how to distinguish legitimate emails from scams. Always verify before clicking links or providing information!',
                action: 'highlight',
                position: 'right',
                final: true
            }
        ];
    }

    async start() {
        // Ensure email client is open
        if (!this.desktop.windowManager.windows.has('email')) {
            try {
                await this.desktop.windowManager.openEmailClient();
                // Wait for the window to fully render
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error('Email application not found:', error);
                return;
            }
        }

        // Initialize CSS first
        this.initializeCSS();
        
        // Enable tutorial mode
        tutorialInteractionManager.enableTutorialMode();
        
        // Set tutorial state
        this.isActive = true;
        this.stepManager.reset();
        
        // Create overlay before showing any steps
        this.createOverlay();
        
        // Ensure email window is in front
        this.ensureEmailInFront();
        
        // Set global reference
        window.emailTutorial = this;
        window.currentTutorial = this;
        
        // Wait for email app to be fully loaded and then start showing steps
        setTimeout(() => {
            this.showStep();
        }, 1000);
    }

    ensureEmailInFront() {
        const emailWindow = document.querySelector('.window[data-window-id="email"]') || 
                           document.querySelector('.window .email') ||
                           document.querySelector('[id*="email"]')?.closest('.window');
        
        if (emailWindow) {
            emailWindow.style.zIndex = '51';
            emailWindow.style.position = 'relative';
        }
    }

    showStep() {
        if (this.currentStep >= this.steps.length) {
            this.complete();
            return;
        }

        const step = this.steps[this.currentStep];
        let target = document.querySelector(step.target);
        
        // Special handling for email list step - ensure we're looking at the inbox
        if (step.target === '#email-list') {
            // Make sure we're in the inbox view
            const inboxFolder = document.querySelector('.email-folder[data-folder="inbox"]');
            if (inboxFolder && !inboxFolder.classList.contains('bg-green-400')) {
                inboxFolder.click();
                // Wait a moment for the view to update
                setTimeout(() => {
                    this.showStep();
                }, 300);
                return;
            }
            target = document.querySelector('#email-list');
        }
        
        if (!target) {
            console.warn(`Tutorial target not found: ${step.target}`);
            this.nextStep();
            return;
        }

        // Clear previous highlights and interactions
        this.clearHighlights();
        this.clearStepInteractions();
        
        // Highlight target element
        this.highlightElement(target, step.action);
        
        // Setup interactions for this step
        this.setupStepInteraction(step, target);
        
        // Position and show tooltip
        this.showTooltip(target, step);
    }

    complete() {
        super.complete();
        
        // Store completion in localStorage
        localStorage.setItem('cyberquest_email_tutorial_completed', 'true');
    }

    // Override base class methods for proper tutorial flow
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

    // Static methods for auto-start functionality
    static shouldAutoStart() {
        const tutorialCompleted = localStorage.getItem('cyberquest_email_tutorial_completed');
        const emailOpened = localStorage.getItem('cyberquest_email_opened');
        
        return emailOpened && !tutorialCompleted;
    }

    static startTutorial(desktop) {
        console.log('Starting Email tutorial...');
        const tutorial = new EmailTutorial(desktop);
        window.emailTutorial = tutorial;
        tutorial.start();
        return tutorial;
    }

    static restart() {
        localStorage.removeItem('cyberquest_email_tutorial_completed');
        localStorage.removeItem('cyberquest_email_opened');
    }
}