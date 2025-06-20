import { SkipTutorialModal } from '../desktop-components/skip-tutorial-modal.js';

export class InitialTutorial {
    constructor(desktop) {
        this.desktop = desktop;
        this.currentStep = 0;
        this.isActive = false;
        this.overlay = null;
        this.tooltip = null;
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
                target: '.control-panel',
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

    createOverlay() {
        // Create tutorial overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 tutorial-overlay';
        this.overlay.style.pointerEvents = 'none';
        
        // Create tooltip container
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'fixed z-50 tutorial-tooltip bg-gray-800 border border-gray-600 rounded shadow-2xl p-6 max-w-sm transform transition-all duration-300';
        this.tooltip.style.pointerEvents = 'auto';
        
        document.body.appendChild(this.overlay);
        document.body.appendChild(this.tooltip);
    }

    showStep() {
        if (this.currentStep >= this.steps.length) {
            this.complete();
            return;
        }

        const step = this.steps[this.currentStep];
        const target = document.querySelector(step.target);
        
        if (!target) {
            console.warn(`Tutorial target not found: ${step.target}`);
            this.nextStep();
            return;
        }

        // Clear previous highlights
        this.clearHighlights();
        
        // Highlight target element
        this.highlightElement(target, step.action);
        
        // Position and show tooltip
        this.showTooltip(target, step);
    }

    highlightElement(element, action = 'highlight') {
        // Create highlight effect
        const rect = element.getBoundingClientRect();
        
        // Create spotlight effect by cutting out the overlay
        this.overlay.style.background = `
            radial-gradient(
                ellipse ${rect.width + 20}px ${rect.height + 20}px at ${rect.left + rect.width/2}px ${rect.top + rect.height/2}px,
                transparent 0%,
                transparent 40%,
                rgba(0, 0, 0, 0.7) 70%
            )
        `;

        // Add visual effects to the target
        element.classList.add('tutorial-highlight');
        
        if (action === 'pulse') {
            element.classList.add('tutorial-pulse');
        }
        
        // Make target clickable during tutorial
        element.style.position = 'relative';
        element.style.zIndex = '51';
        element.style.pointerEvents = 'auto';
    }

    showTooltip(target, step) {
        const rect = target.getBoundingClientRect();
        
        this.tooltip.innerHTML = `
            <div class="tutorial-content">
                <div class="flex items-start justify-between mb-4">
                    <div>
                        <h3 class="text-lg font-bold text-white mb-2">${step.title}</h3>
                        <div class="text-xs text-gray-400 mb-2">Step ${this.currentStep + 1} of ${this.steps.length}</div>
                    </div>
                    <button class="tutorial-close text-gray-400 hover:text-white transition-colors duration-200 ml-4 text-xs cursor-pointer" onclick="window.initialTutorial.showSkipModal()">
                        Skip tutorial
                    </button>
                </div>
                
                <p class="text-gray-300 text-sm leading-relaxed mb-6">${step.content}</p>
                
                <div class="flex items-center justify-between">
                    <div class="flex space-x-1">
                        ${this.steps.map((_, index) => `
                            <div class="w-2 h-2 rounded-full ${index === this.currentStep ? 'bg-green-400' : 'bg-gray-600'}"></div>
                        `).join('')}
                    </div>
                    
                    <div class="flex space-x-2">
                        ${this.currentStep > 0 ? `
                            <button class="tutorial-btn-secondary px-3 py-1 text-xs border border-gray-500 text-gray-300 rounded hover:bg-gray-700 transition-colors duration-200 cursor-pointer" onclick="window.initialTutorial.previousStep()">
                                <i class="bi bi-arrow-left mr-1"></i>Back
                            </button>
                        ` : ''}
                        
                        ${step.final ? `
                            <button class="tutorial-btn-primary px-4 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 cursor-pointer" onclick="window.initialTutorial.openEmailAndComplete()">
                                Start Mission
                                <i class="bi bi-play ml-1"></i>
                            </button>
                        ` : `
                            <button class="tutorial-btn-primary px-4 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 cursor-pointer" onclick="window.initialTutorial.nextStep()">
                                Next
                                <i class="bi bi-arrow-right ml-1"></i>
                            </button>
                        `}
                    </div>
                </div>
            </div>
        `;

        // Position tooltip
        this.positionTooltip(target, step.position);
        
        // Show tooltip with animation
        this.tooltip.style.opacity = '0';
        this.tooltip.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            this.tooltip.style.opacity = '1';
            this.tooltip.style.transform = 'scale(1)';
        }, 100);
    }

    positionTooltip(target, position) {
        const rect = target.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();
        const margin = 20;
        
        let left, top;
        
        switch (position) {
            case 'right':
                left = rect.right + margin;
                top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                break;
            case 'left':
                left = rect.left - tooltipRect.width - margin;
                top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                break;
            case 'top':
                left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                top = rect.top - tooltipRect.height - margin;
                break;
            case 'bottom':
                left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                top = rect.bottom + margin;
                break;
            default:
                left = rect.right + margin;
                top = rect.top;
        }
        
        // Ensure tooltip stays within viewport
        left = Math.max(20, Math.min(left, window.innerWidth - tooltipRect.width - 20));
        top = Math.max(20, Math.min(top, window.innerHeight - tooltipRect.height - 20));
        
        this.tooltip.style.left = `${left}px`;
        this.tooltip.style.top = `${top}px`;
    }

    nextStep() {
        this.currentStep++;
        this.showStep();
    }

    previousStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.showStep();
        }
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
        this.clearHighlights();
        this.cleanup();
        
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

    clearHighlights() {
        // Remove all tutorial highlights
        document.querySelectorAll('.tutorial-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight', 'tutorial-pulse');
            el.style.zIndex = '';
            el.style.pointerEvents = '';
        });
    }

    cleanup() {
        this.isActive = false;
        
        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
        }
        
        if (this.tooltip) {
            this.tooltip.remove();
            this.tooltip = null;
        }
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
