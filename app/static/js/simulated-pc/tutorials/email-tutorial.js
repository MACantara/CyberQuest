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
                title: 'Sophisticated Phishing Detection',
                content: 'This Microsoft email looks convincing but has subtle red flags! Notice the urgent security language and request to verify identity. Always verify security emails through official channels, not email links.',
                action: 'pulse',
                position: 'right'
            },
            {
                target: '.email-item:nth-child(2)',
                title: 'Legitimate Email Recognition',
                content: 'This CyberQuest password reset email is legitimate. Notice the professional domain, specific token in the URL, and no urgent pressure tactics. Legitimate services provide clear, non-threatening communication.',
                action: 'highlight',
                position: 'right'
            },
            {
                target: '.email-item:nth-child(3)',
                title: 'PayPal Phishing Attempt',
                content: 'Another sophisticated phishing attempt! This fake PayPal email uses official branding and urgent account limitation language. Always log into your actual account separately to verify such claims.',
                action: 'pulse',
                position: 'right'
            },
            {
                target: '#email-list',
                title: 'Email Security Complete!',
                content: 'Excellent! You\'ve learned to identify key email security threats: sophisticated phishing that mimics legitimate services, urgent security language tactics, fake account limitations, and how to distinguish legitimate communications from scams. Always verify through official channels!',
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