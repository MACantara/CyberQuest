import { BaseTutorial } from '../tutorial-manager.js';

export class BrowserTutorial extends BaseTutorial {
    constructor(desktop) {
        super(desktop);
        this.steps = [
            {
                target: 'input[value="https://suspicious-site.com"]',
                title: 'Suspicious URL',
                content: 'Look at the address bar! This URL "suspicious-site.com" should immediately raise red flags. Always check the URL carefully before trusting a website.',
                action: 'highlight',
                position: 'bottom'
            },
            {
                target: '.text-red-600',
                title: 'Too Good to Be True',
                content: 'This headline is a classic scam indicator. No legitimate website gives away money like this. If it sounds too good to be true, it probably is!',
                action: 'pulse',
                position: 'bottom'
            },
            {
                target: '.animate-pulse',
                title: 'Urgent Action Buttons',
                content: 'Scam sites use flashy, pulsing buttons to pressure you into clicking quickly without thinking. Never click suspicious "CLAIM NOW" buttons!',
                action: 'highlight',
                position: 'top'
            },
            {
                target: '.text-gray-600',
                title: 'False Reassurances',
                content: 'Phrases like "No catch, totally legitimate" are actually red flags! Real legitimate sites don\'t need to convince you they\'re legitimate.',
                action: 'highlight',
                position: 'top'
            },
            {
                target: '.bg-white',
                title: 'Browser Security Complete',
                content: 'You\'ve learned to identify suspicious websites! Always check URLs, be skeptical of unrealistic offers, and avoid urgent action buttons.',
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
        
        // Wait for browser app to be fully loaded
        setTimeout(() => {
            this.createOverlay();
            this.showStep();
        }, 1000);
    }

    // Override base class methods
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

    complete() {
        super.complete();
        
        // Store completion in localStorage
        localStorage.setItem('cyberquest_browser_tutorial_completed', 'true');
    }

    showSkipModal() {
        if (confirm('Are you sure you want to skip the browser security tutorial? This training helps you identify dangerous websites.')) {
            this.complete();
        }
    }

    // Static methods
    static shouldAutoStart() {
        return !localStorage.getItem('cyberquest_browser_tutorial_completed');
    }

    static restart() {
        localStorage.removeItem('cyberquest_browser_tutorial_completed');
    }
}