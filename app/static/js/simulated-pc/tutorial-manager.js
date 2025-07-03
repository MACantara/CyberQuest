import { BaseTutorial } from './base-tutorial.js';

export class TutorialManager {
    constructor(desktop) {
        this.desktop = desktop;
        this.currentTutorial = null;
        this.initializeCSS();
    }    initializeCSS() {
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
            
            /* Disable interactions during tutorial */
            .tutorial-mode-active .window-header {
                pointer-events: none !important;
                cursor: default !important;
            }
            
            .tutorial-mode-active .window-controls {
                pointer-events: none !important;
            }
            
            .tutorial-mode-active .resize-handle {
                pointer-events: none !important;
                cursor: default !important;
            }
            
            .tutorial-mode-active .taskbar-button {
                pointer-events: none !important;
                cursor: default !important;
            }
            
            .tutorial-mode-active .start-button {
                pointer-events: none !important;
                cursor: default !important;
            }
            
            .tutorial-mode-active .desktop-icon {
                pointer-events: none !important;
                cursor: default !important;
            }
            
            .tutorial-mode-active .window-content {
                pointer-events: none !important;
            }
            
            /* Allow tutorial elements to be interactive */
            .tutorial-mode-active .tutorial-tooltip {
                pointer-events: auto !important;
            }
            
            .tutorial-mode-active .tutorial-tooltip * {
                pointer-events: auto !important;
            }
            
            .tutorial-mode-active .tutorial-overlay {
                pointer-events: auto !important;
            }
            
            /* Allow highlighted elements to be interactive if needed */
            .tutorial-mode-active .tutorial-highlight {
                pointer-events: auto !important;
            }
        `;
        document.head.appendChild(tutorialStyles);
    }

    // Enable tutorial mode - disable all interactions
    enableTutorialMode() {
        document.body.classList.add('tutorial-mode-active');
        
        // Disable right-click context menu during tutorial
        document.addEventListener('contextmenu', this.preventContextMenu, true);
        
        // Disable keyboard shortcuts during tutorial
        document.addEventListener('keydown', this.preventKeyboardShortcuts, true);
        
        // Disable drag and drop during tutorial
        document.addEventListener('dragstart', this.preventDragDrop, true);
        document.addEventListener('drop', this.preventDragDrop, true);
    }

    // Disable tutorial mode - re-enable all interactions
    disableTutorialMode() {
        document.body.classList.remove('tutorial-mode-active');
        
        // Re-enable right-click context menu
        document.removeEventListener('contextmenu', this.preventContextMenu, true);
        
        // Re-enable keyboard shortcuts
        document.removeEventListener('keydown', this.preventKeyboardShortcuts, true);
        
        // Re-enable drag and drop
        document.removeEventListener('dragstart', this.preventDragDrop, true);
        document.removeEventListener('drop', this.preventDragDrop, true);
    }

    // Prevent context menu during tutorial
    preventContextMenu = (e) => {
        // Allow context menu only on tutorial elements
        if (!e.target.closest('.tutorial-tooltip') && !e.target.closest('.tutorial-highlight')) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }

    // Prevent keyboard shortcuts during tutorial
    preventKeyboardShortcuts = (e) => {
        // Allow only basic navigation keys and tutorial-specific keys
        const allowedKeys = [
            'Tab', 'Shift', 'Enter', 'Escape', 'ArrowUp', 'ArrowDown', 
            'ArrowLeft', 'ArrowRight', 'Space'
        ];
        
        // Block Ctrl/Cmd combinations except for basic text editing
        if ((e.ctrlKey || e.metaKey) && !['c', 'v', 'a', 'x'].includes(e.key.toLowerCase())) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        
        // Block Alt combinations
        if (e.altKey && !allowedKeys.includes(e.key)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        
        // Block F keys (except F5 for refresh in development)
        if (e.key.startsWith('F') && e.key !== 'F5') {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }

    // Prevent drag and drop during tutorial
    preventDragDrop = (e) => {
        if (!e.target.closest('.tutorial-tooltip')) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }

    // Generic tutorial starter
    async startTutorial(tutorialName, tutorialClass, globalVarName) {
        if (this.currentTutorial) {
            this.currentTutorial.cleanup();
        }
        
        // Enable tutorial mode to disable interactions
        this.enableTutorialMode();
        
        // Dynamic import to avoid circular dependency
        const module = await import(`./tutorials/${tutorialName}-tutorial.js`);
        const TutorialClass = module[tutorialClass];
        
        this.currentTutorial = new TutorialClass(this.desktop);
        window[globalVarName] = this.currentTutorial; // For global access
        window.currentTutorial = this.currentTutorial; // For shared base functionality
        
        // Override the tutorial's complete method to disable tutorial mode
        const originalComplete = this.currentTutorial.complete.bind(this.currentTutorial);
        this.currentTutorial.complete = () => {
            originalComplete();
            this.disableTutorialMode();
        };
        
        // Override the tutorial's cleanup method to disable tutorial mode
        const originalCleanup = this.currentTutorial.cleanup.bind(this.currentTutorial);
        this.currentTutorial.cleanup = () => {
            originalCleanup();
            this.disableTutorialMode();
        };
        
        this.currentTutorial.start();
    }

    // Generic auto-start checker
    async shouldAutoStart(tutorialName, tutorialClass) {
        const module = await import(`./tutorials/${tutorialName}-tutorial.js`);
        const TutorialClass = module[tutorialClass];
        return TutorialClass.shouldAutoStart();
    }

    // Generic tutorial restarter
    async restartTutorial(tutorialName, tutorialClass, startMethodName) {
        const module = await import(`./tutorials/${tutorialName}-tutorial.js`);
        const TutorialClass = module[tutorialClass];
        TutorialClass.restart();
        await this[startMethodName]();
    }

    // Individual tutorial methods using the generic functions
    async startInitialTutorial() {
        return this.startTutorial('initial', 'InitialTutorial', 'initialTutorial');
    }

    async shouldAutoStartInitial() {
        return this.shouldAutoStart('initial', 'InitialTutorial');
    }

    async restartInitialTutorial() {
        return this.restartTutorial('initial', 'InitialTutorial', 'startInitialTutorial');
    }

    async startEmailTutorial() {
        return this.startTutorial('email', 'EmailTutorial', 'emailTutorial');
    }

    async shouldAutoStartEmail() {
        return this.shouldAutoStart('email', 'EmailTutorial');
    }

    async restartEmailTutorial() {
        return this.restartTutorial('email', 'EmailTutorial', 'startEmailTutorial');
    }

    async startBrowserTutorial() {
        return this.startTutorial('browser', 'BrowserTutorial', 'browserTutorial');
    }

    async shouldAutoStartBrowser() {
        return this.shouldAutoStart('browser', 'BrowserTutorial');
    }

    async restartBrowserTutorial() {
        return this.restartTutorial('browser', 'BrowserTutorial', 'startBrowserTutorial');
    }

    async startFileManagerTutorial() {
        return this.startTutorial('file-manager', 'FileManagerTutorial', 'fileManagerTutorial');
    }

    async shouldAutoStartFileManager() {
        return this.shouldAutoStart('file-manager', 'FileManagerTutorial');
    }

    async restartFileManagerTutorial() {
        return this.restartTutorial('file-manager', 'FileManagerTutorial', 'startFileManagerTutorial');
    }

    async startNetworkMonitorTutorial() {
        return this.startTutorial('network-monitor', 'NetworkMonitorTutorial', 'networkMonitorTutorial');
    }

    async shouldAutoStartNetworkMonitor() {
        return this.shouldAutoStart('network-monitor', 'NetworkMonitorTutorial');
    }

    async restartNetworkMonitorTutorial() {
        return this.restartTutorial('network-monitor', 'NetworkMonitorTutorial', 'startNetworkMonitorTutorial');
    }

    async startProcessMonitorTutorial() {
        return this.startTutorial('process-monitor', 'ProcessMonitorTutorial', 'processMonitorTutorial');
    }

    async shouldAutoStartProcessMonitor() {
        return this.shouldAutoStart('process-monitor', 'ProcessMonitorTutorial');
    }

    async restartProcessMonitorTutorial() {
        return this.restartTutorial('process-monitor', 'ProcessMonitorTutorial', 'startProcessMonitorTutorial');
    }

    async startSystemLogsTutorial() {
        return this.startTutorial('system-logs', 'SystemLogsTutorial', 'systemLogsTutorial');
    }

    async shouldAutoStartSystemLogs() {
        return this.shouldAutoStart('system-logs', 'SystemLogsTutorial');
    }

    async restartSystemLogsTutorial() {
        return this.restartTutorial('system-logs', 'SystemLogsTutorial', 'startSystemLogsTutorial');
    }

    async startTerminalTutorial() {
        return this.startTutorial('terminal', 'TerminalTutorial', 'terminalTutorial');
    }

    async shouldAutoStartTerminal() {
        return this.shouldAutoStart('terminal', 'TerminalTutorial');
    }

    async restartTerminalTutorial() {
        return this.restartTutorial('terminal', 'TerminalTutorial', 'startTerminalTutorial');
    }

    // Utility method to get all available tutorials
    getTutorialList() {
        return [
            { name: 'initial', class: 'InitialTutorial', title: 'Desktop Introduction' },
            { name: 'email', class: 'EmailTutorial', title: 'Email Security' },
            { name: 'browser', class: 'BrowserTutorial', title: 'Web Security' },
            { name: 'file-manager', class: 'FileManagerTutorial', title: 'File Security' },
            { name: 'process-monitor', class: 'ProcessMonitorTutorial', title: 'Process Management' },
            { name: 'network-monitor', class: 'NetworkMonitorTutorial', title: 'Network Analysis' },
            { name: 'system-logs', class: 'SystemLogsTutorial', title: 'Log Analysis' },
            { name: 'terminal', class: 'TerminalTutorial', title: 'Command Line' }
        ];
    }

    // Utility method to start any tutorial by name
    async startTutorialByName(tutorialName) {
        const methodName = `start${tutorialName.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join('')}Tutorial`;
        
        if (typeof this[methodName] === 'function') {
            return await this[methodName]();
        } else {
            throw new Error(`Tutorial '${tutorialName}' not found`);
        }
    }
}

// Maintain Tutorial as an alias for backwards compatibility
export const Tutorial = TutorialManager;

// Export BaseTutorial for backwards compatibility
export { BaseTutorial };