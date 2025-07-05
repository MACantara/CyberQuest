import { BaseTutorial } from './base-tutorial.js';
import { tutorialInteractionManager } from './tutorial-interaction-manager.js';

export class BrowserTutorial extends BaseTutorial {
    constructor(desktop) {
        super(desktop);        
        this.steps = [
            {
                target: '#browser-url-bar',
                title: 'Suspicious URL Detection',
                content: 'Look at the address bar! This URL "suspicious-site.com" should immediately raise red flags. Always check the URL carefully before trusting a website. Legitimate businesses use proper domain names.',
                action: 'highlight',
                position: 'bottom'
            },
            {
                target: '#bookmarks-bar',
                title: 'Bookmark Bar Warnings',
                content: 'Notice the bookmarks bar shows different types of sites. The red warning icons indicate potentially dangerous sites that are used for training purposes.',
                action: 'highlight',
                position: 'bottom'
            },
            {
                target: '#scam-headline',
                title: 'Too Good to Be True Headlines',
                content: 'This headline is a classic scam indicator! No legitimate website gives away millions of dollars. If it sounds too good to be true, it definitely is!',
                action: 'pulse',
                position: 'bottom'
            },
            {
                target: '#scam-button',
                title: 'Dangerous Action Buttons',
                content: 'Scam sites use flashy, pulsing buttons with urgent language like "CLAIM NOW" to pressure you into clicking quickly without thinking. Never click suspicious "free money" buttons!',
                action: 'highlight',
                position: 'top'
            },
            {
                target: '#fake-disclaimer',
                title: 'False Reassurances',
                content: 'Phrases like "No catch, totally legitimate" are actually red flags! Real legitimate sites don\'t need to convince you they\'re legitimate with desperate language.',
                action: 'highlight',
                position: 'top'
            },
            {
                target: '#browser-content',
                title: 'Browser Security Complete!',
                content: 'Excellent! You\'ve learned to identify key warning signs of scam websites: suspicious URLs, fake urgency, unrealistic offers, pressure tactics, and false testimonials. Always be skeptical and verify before trusting!',
                action: 'highlight',
                position: 'right',
                final: true
            }
        ];
    }

    async start() {
        // Ensure browser is open
        if (!this.desktop.windowManager.windows.has('browser')) {
            try {
                await this.desktop.windowManager.openBrowser();
                // Wait for the window to fully render
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error('Browser application not found:', error);
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
        
        // Ensure browser window is in front
        this.ensureBrowserInFront();
        
        // Set global reference
        window.browserTutorial = this;
        window.currentTutorial = this;
        
        // Wait for browser page to be fully loaded and then start showing steps
        setTimeout(() => {
            this.stepManager.showStep();
        }, 1500);
    }

    ensureBrowserInFront() {
        const browserWindow = document.querySelector('.window[data-window-id="browser"]') || 
                             document.querySelector('.window .browser') ||
                             document.querySelector('[id*="browser"]')?.closest('.window');
        
        if (browserWindow) {
            browserWindow.style.zIndex = '51';
            browserWindow.style.position = 'relative';
        }
    }

    showStep() {
        if (this.currentStep >= this.steps.length) {
            this.complete();
            return;
        }

        const step = this.steps[this.currentStep];
        let target = document.querySelector(step.target);
        
        // Special handling for URL bar step - ensure URL is set
        if (step.target === '#browser-url-bar') {
            const urlBar = document.querySelector('#browser-url-bar');
            if (urlBar && !urlBar.value) {
                urlBar.value = 'https://suspicious-site.com';
            }
            target = urlBar;
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
        localStorage.setItem('cyberquest_browser_tutorial_completed', 'true');
    }

    // Override base class methods for proper tutorial flow
    getSkipTutorialHandler() {
        return 'window.browserTutorial.showSkipModal()';
    }

    getPreviousStepHandler() {
        return 'window.browserTutorial.previousStep()';
    }

    getNextStepHandler() {
        return 'window.browserTutorial.nextStep()';
    }

    getFinalStepHandler() {
        return 'window.browserTutorial.complete()';
    }

    getFinalButtonText() {
        return 'Finish Tutorial';
    }

    // Static methods for auto-start functionality
    static shouldAutoStart() {
        const tutorialCompleted = localStorage.getItem('cyberquest_browser_tutorial_completed');
        const browserOpened = localStorage.getItem('cyberquest_browser_opened');
        
        return browserOpened && !tutorialCompleted;
    }

    static startTutorial(desktop) {
        console.log('Starting Browser tutorial...');
        const tutorial = new BrowserTutorial(desktop);
        window.browserTutorial = tutorial;
        tutorial.start();
        return tutorial;
    }

    static restart() {
        localStorage.removeItem('cyberquest_browser_tutorial_completed');
        localStorage.removeItem('cyberquest_browser_opened');
    }
}