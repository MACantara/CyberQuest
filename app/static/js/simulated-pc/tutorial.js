import { InitialTutorial } from './tutorials/initial-tutorial.js';

export class TutorialManager {
    constructor(desktop) {
        this.desktop = desktop;
        this.currentTutorial = null;
        this.initializeCSS();
    }

    initializeCSS() {
        // Add tutorial CSS styles to the page
        const tutorialStyles = document.createElement('style');
        tutorialStyles.textContent = `
            .tutorial-highlight {
                animation: tutorial-glow 2s ease-in-out infinite alternate;
                border: 2px solid #10b981 !important;
                border-radius: 8px !important;
                box-shadow: 0 0 20px rgba(16, 185, 129, 0.6) !important;
            }
            
            .tutorial-pulse {
                animation: tutorial-pulse 1.5s ease-in-out infinite;
            }
            
            @keyframes tutorial-glow {
                from {
                    box-shadow: 0 0 20px rgba(16, 185, 129, 0.6);
                }
                to {
                    box-shadow: 0 0 30px rgba(16, 185, 129, 0.9), 0 0 40px rgba(16, 185, 129, 0.6);
                }
            }
            
            @keyframes tutorial-pulse {
                0%, 100% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.05);
                }
            }
            
            .tutorial-tooltip {
                backdrop-filter: blur(10px);
                border: 1px solid rgba(16, 185, 129, 0.3);
                background: rgba(31, 41, 55, 0.95);
            }
            
            .tutorial-btn-primary:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
            }
            
            .tutorial-btn-secondary:hover {
                transform: translateY(-1px);
            }
            
            .tutorial-close:hover {
                text-decoration: underline;
            }
        `;
        document.head.appendChild(tutorialStyles);
    }

    startInitialTutorial() {
        if (this.currentTutorial) {
            this.currentTutorial.cleanup();
        }
        
        this.currentTutorial = new InitialTutorial(this.desktop);
        window.initialTutorial = this.currentTutorial; // For global access
        this.currentTutorial.start();
    }

    // Check if initial tutorial should auto-start
    shouldAutoStartInitial() {
        return InitialTutorial.shouldAutoStart();
    }

    // Restart initial tutorial
    restartInitialTutorial() {
        InitialTutorial.restart();
        this.startInitialTutorial();
    }

    // Future tutorial methods can be added here
    // startAdvancedTutorial() { ... }
    // startSpecificToolTutorial(toolName) { ... }
}

// Legacy support - maintain backwards compatibility
export class Tutorial extends TutorialManager {
    constructor(desktop) {
        super(desktop);
    }

    start() {
        this.startInitialTutorial();
    }

    static shouldAutoStart() {
        return InitialTutorial.shouldAutoStart();
    }

    static restart() {
        if (window.tutorial) {
            window.tutorial.restartInitialTutorial();
        }
    }
}