import { BaseTutorial } from './base-tutorial.js';

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

    async startInitialTutorial() {
        if (this.currentTutorial) {
            this.currentTutorial.cleanup();
        }
        
        // Dynamic import to avoid circular dependency
        const { InitialTutorial } = await import('./tutorials/initial-tutorial.js');
        
        this.currentTutorial = new InitialTutorial(this.desktop);
        window.initialTutorial = this.currentTutorial; // For global access
        window.currentTutorial = this.currentTutorial; // For shared base functionality
        this.currentTutorial.start();
    }

    // Check if initial tutorial should auto-start
    async shouldAutoStartInitial() {
        const { InitialTutorial } = await import('./tutorials/initial-tutorial.js');
        return InitialTutorial.shouldAutoStart();
    }

    // Restart initial tutorial
    async restartInitialTutorial() {
        const { InitialTutorial } = await import('./tutorials/initial-tutorial.js');
        InitialTutorial.restart();
        await this.startInitialTutorial();
    }

    async startEmailTutorial() {
        if (this.currentTutorial) {
            this.currentTutorial.cleanup();
        }
        
        // Dynamic import to avoid circular dependency
        const { EmailTutorial } = await import('./tutorials/email-tutorial.js');
        
        this.currentTutorial = new EmailTutorial(this.desktop);
        window.emailTutorial = this.currentTutorial; // For global access
        window.currentTutorial = this.currentTutorial; // For shared base functionality
        this.currentTutorial.start();
    }

    async shouldAutoStartEmail() {
        const { EmailTutorial } = await import('./tutorials/email-tutorial.js');
        return EmailTutorial.shouldAutoStart();
    }

    async restartEmailTutorial() {
        const { EmailTutorial } = await import('./tutorials/email-tutorial.js');
        EmailTutorial.restart();
        await this.startEmailTutorial();
    }

    async startBrowserTutorial() {
        if (this.currentTutorial) {
            this.currentTutorial.cleanup();
        }
        
        // Dynamic import to avoid circular dependency
        const { BrowserTutorial } = await import('./tutorials/browser-tutorial.js');
        
        this.currentTutorial = new BrowserTutorial(this.desktop);
        window.browserTutorial = this.currentTutorial; // For global access
        window.currentTutorial = this.currentTutorial; // For shared base functionality
        this.currentTutorial.start();
    }

    async shouldAutoStartBrowser() {
        const { BrowserTutorial } = await import('./tutorials/browser-tutorial.js');
        return BrowserTutorial.shouldAutoStart();
    }

    async restartBrowserTutorial() {
        const { BrowserTutorial } = await import('./tutorials/browser-tutorial.js');
        BrowserTutorial.restart();
        await this.startBrowserTutorial();
    }

    async startFileManagerTutorial() {
        if (this.currentTutorial) {
            this.currentTutorial.cleanup();
        }
        
        // Dynamic import to avoid circular dependency
        const { FileManagerTutorial } = await import('./tutorials/file-manager-tutorial.js');
        
        this.currentTutorial = new FileManagerTutorial(this.desktop);
        window.fileManagerTutorial = this.currentTutorial; // For global access
        window.currentTutorial = this.currentTutorial; // For shared base functionality
        this.currentTutorial.start();
    }

    async shouldAutoStartFileManager() {
        const { FileManagerTutorial } = await import('./tutorials/file-manager-tutorial.js');
        return FileManagerTutorial.shouldAutoStart();
    }    
    
    async restartFileManagerTutorial() {
        const { FileManagerTutorial } = await import('./tutorials/file-manager-tutorial.js');
        FileManagerTutorial.restart();
        await this.startFileManagerTutorial();
    }

    async startNetworkMonitorTutorial() {
        if (this.currentTutorial) {
            this.currentTutorial.cleanup();
        }
        
        // Dynamic import to avoid circular dependency
        const { NetworkMonitorTutorial } = await import('./tutorials/network-monitor-tutorial.js');
        
        this.currentTutorial = new NetworkMonitorTutorial(this.desktop);
        window.networkMonitorTutorial = this.currentTutorial; // For global access
        window.currentTutorial = this.currentTutorial; // For shared base functionality
        this.currentTutorial.start();
    }

    async shouldAutoStartNetworkMonitor() {
        const { NetworkMonitorTutorial } = await import('./tutorials/network-monitor-tutorial.js');
        return NetworkMonitorTutorial.shouldAutoStart();
    }    
    
    async restartNetworkMonitorTutorial() {
        const { NetworkMonitorTutorial } = await import('./tutorials/network-monitor-tutorial.js');
        NetworkMonitorTutorial.restart();
        await this.startNetworkMonitorTutorial();
    }

    async startSecurityToolsTutorial() {
        if (this.currentTutorial) {
            this.currentTutorial.cleanup();
        }
        
        // Dynamic import to avoid circular dependency
        const { SecurityToolsTutorial } = await import('./tutorials/security-tools-tutorial.js');
        
        this.currentTutorial = new SecurityToolsTutorial(this.desktop);
        window.securityToolsTutorial = this.currentTutorial; // For global access
        window.currentTutorial = this.currentTutorial; // For shared base functionality
        this.currentTutorial.start();
    }

    async shouldAutoStartSecurityTools() {
        const { SecurityToolsTutorial } = await import('./tutorials/security-tools-tutorial.js');
        return SecurityToolsTutorial.shouldAutoStart();
    }

    async restartSecurityToolsTutorial() {
        const { SecurityToolsTutorial } = await import('./tutorials/security-tools-tutorial.js');
        SecurityToolsTutorial.restart();
        await this.startSecurityToolsTutorial();
    }

    // Future tutorial methods can be added here
    // async startAdvancedTutorial() { ... }
    // async startSpecificToolTutorial(toolName) { ... }
}

// Maintain Tutorial as an alias for backwards compatibility
export const Tutorial = TutorialManager;

// Export BaseTutorial for backwards compatibility
export { BaseTutorial };