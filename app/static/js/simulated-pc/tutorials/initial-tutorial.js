import { SkipTutorialModal } from '../desktop-components/skip-tutorial-modal.js';
import { BaseTutorial } from '../base-tutorial.js';

export class InitialTutorial extends BaseTutorial {
    constructor(desktop) {
        super(desktop);
        this.emailAppOpened = false;
        this.skipTutorialModal = null;
        this.steps = [
            {
                target: '.desktop-icon[data-id="email"]',
                title: 'Desktop Icons',
                content: 'These are your application icons. Double-click any icon to open an application. Let\'s start with the Email Client!',
                action: 'highlight',
                position: 'right'
            },
            {
                target: '#start-btn',
                title: 'Start Button',
                content: 'Click the Start button in the taskbar when you want to exit the simulation safely.',
                action: 'highlight',
                position: 'top'
            },
            {
                target: '#system-clock',
                title: 'System Clock',
                content: 'This shows the current system time and date.',
                action: 'highlight',
                position: 'top'
            },
            {
                target: '#control-panel',
                title: 'Mission Control',
                content: 'Use Mission Control to get help, hints, and track your progress during missions.',
                action: 'highlight',
                position: 'left'
            },
            {
                target: '.desktop-icon[data-id="email"]',
                title: 'Your First Mission',
                content: 'Now double-click the Email Client to start your cybersecurity training. Look for suspicious emails!',
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
        this.emailAppOpened = false;
        this.createOverlay();
        this.showStep();
        this.setupEmailAppListener();
    }

    setupEmailAppListener() {
        // Listen for email app being opened
        const emailIcon = document.querySelector('.desktop-icon[data-id="email"]');
        if (emailIcon) {
            emailIcon.addEventListener('dblclick', () => {
                if (this.isActive) {
                    this.emailAppOpened = true;
                    // Complete tutorial after a short delay to allow email app to open
                    setTimeout(() => {
                        this.complete();
                    }, 500);
                }
            });
        }
    }

    // Override base class methods for tutorial-specific behavior
    getSkipTutorialHandler() {
        return 'window.initialTutorial.showSkipModal()';
    }

    getPreviousStepHandler() {
        return 'window.initialTutorial.previousStep()';
    }

    getNextStepHandler() {
        return 'window.initialTutorial.nextStep()';
    }

    getFinalStepHandler() {
        return 'window.initialTutorial.openEmailAndComplete()';
    }

    getFinalButtonText() {
        return 'Start Mission';
    }

    async showSkipModal() {
        if (!this.skipTutorialModal) {
            this.skipTutorialModal = new SkipTutorialModal(document.body);
        }
        
        const shouldSkip = await this.skipTutorialModal.show();
        if (shouldSkip) {
            this.complete();
        }
    }

    openEmailAndComplete() {
        // Open the email application
        if (this.desktop && this.desktop.windowManager) {
            this.desktop.windowManager.openEmailClient();
        }
        
        // Mark as opened and complete tutorial
        this.emailAppOpened = true;
        setTimeout(() => {
            this.complete();
        }, 500);
    }

    complete() {
        super.complete();
        
        // Store completion in localStorage
        localStorage.setItem('cyberquest_tutorial_completed', 'true');
        
        // Show completion message only if email app was opened
        if (this.emailAppOpened) {
            this.desktop.windowManager.createWindow('tutorial-complete', 'Tutorial Complete', this.createCompletionContent(), {
                width: '50%',
                height: '40%'
            });
        }
    }

    createCompletionContent() {
        return `
            <div class="p-6 text-center text-white">
                <div class="text-6xl mb-4">🎉</div>
                <h2 class="text-2xl font-bold text-green-400 mb-4">Tutorial Complete!</h2>
                <p class="text-gray-300 mb-6">
                    Excellent! You've successfully opened the Email Client and completed the tutorial.
                    You're now ready to start your cybersecurity training missions.
                </p>
                <div class="bg-gray-700 rounded p-4 mb-6">
                    <h3 class="text-lg font-semibold text-yellow-400 mb-2">Your Mission:</h3>
                    <p class="text-left text-sm text-gray-300">
                        Examine the emails in your inbox and identify which ones might be suspicious or phishing attempts. 
                        Look for red flags like suspicious sender addresses, urgent language, and requests for personal information.
                    </p>
                </div>
                <div class="bg-green-900/30 rounded p-4 mb-6">
                    <h3 class="text-lg font-semibold text-green-400 mb-2">Quick Reminders:</h3>
                    <ul class="text-left text-sm text-gray-300 space-y-1">
                        <li>• Double-click icons to open applications</li>
                        <li>• Use Mission Control for help and hints</li>
                        <li>• Click Start button to exit safely</li>
                        <li>• Look for suspicious content in emails</li>
                    </ul>
                </div>
                <p class="text-sm text-gray-400">
                    Good luck with your cybersecurity training, Agent! 🛡️
                </p>
            </div>
        `;
    }

    // Static method to check if tutorial should auto-start
    static shouldAutoStart() {
        return !localStorage.getItem('cyberquest_tutorial_completed');
    }

    // Static method to restart tutorial
    static restart() {
        localStorage.removeItem('cyberquest_tutorial_completed');
        if (window.initialTutorial) {
            window.initialTutorial.start();
        }
    }
}