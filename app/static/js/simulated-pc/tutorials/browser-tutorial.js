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
                target: '#timer-display',
                title: 'Fake Urgency Tactics',
                content: 'Scammers use countdown timers to create false urgency and pressure you into making quick decisions without thinking. Real legitimate offers don\'t use these pressure tactics.',
                action: 'highlight',
                position: 'top'
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
                target: '#fake-testimonial-1',
                title: 'Fake Testimonials',
                content: 'These testimonials are completely fabricated! Scam sites often use fake customer reviews with generic names and photos to appear trustworthy.',
                action: 'highlight',
                position: 'right'
            },
            {
                target: '#urgency-message',
                title: 'Pressure Tactics',
                content: 'Messages like "Act fast - offer expires soon!" are designed to prevent you from thinking critically. Legitimate businesses give you time to make informed decisions.',
                action: 'pulse',
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
        return 'Finish Browser Security Training';
    }

    // Enhanced completion with browser-specific actions
    complete() {
        // Show completion modal with security tips
        this.showCompletionModal();
        
        super.complete();
        
        // Store completion in localStorage
        localStorage.setItem('cyberquest_browser_tutorial_completed', 'true');
    }

    showCompletionModal() {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
        overlay.innerHTML = `
            <div class="bg-gray-800 rounded-xl p-8 max-w-md mx-4 border border-green-500">
                <div class="text-center">
                    <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="bi bi-shield-check text-white text-2xl"></i>
                    </div>
                    <h3 class="text-white text-xl font-bold mb-4">Browser Security Training Complete!</h3>
                    <div class="bg-gray-700 rounded-lg p-4 mb-6 text-left">
                        <h4 class="text-green-400 font-semibold mb-2">Key Security Tips Learned:</h4>
                        <ul class="text-gray-300 text-sm space-y-1">
                            <li>• Always verify website URLs before trusting</li>
                            <li>• Be suspicious of "too good to be true" offers</li>
                            <li>• Recognize fake urgency and pressure tactics</li>
                            <li>• Don't trust fake testimonials and reviews</li>
                            <li>• Never click suspicious "free money" buttons</li>
                        </ul>
                    </div>
                    <button onclick="this.closest('.fixed').remove()" 
                            class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer font-semibold">
                        Continue Training
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        
        // Auto-remove after 8 seconds
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.remove();
            }
        }, 8000);
    }

    // Static methods
    static shouldAutoStart() {
        return !localStorage.getItem('cyberquest_browser_tutorial_completed');
    }

    static restart() {
        localStorage.removeItem('cyberquest_browser_tutorial_completed');
    }
}