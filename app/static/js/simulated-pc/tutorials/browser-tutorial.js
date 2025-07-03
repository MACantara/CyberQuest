import { BaseTutorial } from '../base-tutorial.js';

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
                target: '#suspicious-bookmark',
                title: 'Suspicious Site Bookmark',
                content: 'This bookmark is marked with a warning triangle. In real life, avoid clicking on suspicious links or bookmarks that seem too good to be true.',
                action: 'pulse',
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

    start() {
        if (this.isActive) return;
        
        this.isActive = true;
        this.currentStep = 0;
        
        // Wait for browser app to be fully loaded and page to render
        setTimeout(() => {
            this.createOverlay();
            this.showStep();
        }, 1500); // Increased delay to ensure page is fully rendered
    }

    // Override to add browser-specific tutorial behaviors
    showStep() {
        if (this.currentStep >= this.steps.length) {
            this.complete();
            return;
        }

        const step = this.steps[this.currentStep];
        
        // Special handling for URL bar step - ensure URL is set
        if (step.target === '#browser-url-bar') {
            const urlBar = document.querySelector('#browser-url-bar');
            if (urlBar && !urlBar.value) {
                urlBar.value = 'https://suspicious-site.com';
            }
        }

        super.showStep();
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

    // Enhanced completion with browser-specific actions
    complete() {
        super.complete();
        
        // Store completion in localStorage
        localStorage.setItem('cyberquest_browser_tutorial_completed', 'true');
    }

    // Static methods
    static shouldAutoStart() {
        return !localStorage.getItem('cyberquest_browser_tutorial_completed');
    }

    static restart() {
        localStorage.removeItem('cyberquest_browser_tutorial_completed');
    }
}