import { BaseTutorial } from './base-tutorial.js';
import { tutorialInteractionManager } from './tutorial-interaction-manager.js';

export class TutorialManager {
    constructor(desktop) {
        this.desktop = desktop;
        this.currentTutorial = null;
        this.interactionManager = tutorialInteractionManager;
    }

    // Generic tutorial starter
    async startTutorial(tutorialName, tutorialClass, globalVarName) {
        if (this.currentTutorial) {
            this.currentTutorial.cleanup();
        }
        
        // Enable tutorial mode to disable interactions
        this.interactionManager.enableTutorialMode();
        
        // Dynamic import to avoid circular dependency
        const module = await import(`./${tutorialName}-tutorial.js`);
        const TutorialClass = module[tutorialClass];
        
        this.currentTutorial = new TutorialClass(this.desktop);
        window[globalVarName] = this.currentTutorial; // For global access
        window.currentTutorial = this.currentTutorial; // For shared base functionality
        
        // Override the tutorial's complete method to disable tutorial mode
        const originalComplete = this.currentTutorial.complete.bind(this.currentTutorial);
        this.currentTutorial.complete = () => {
            originalComplete();
            this.interactionManager.disableTutorialMode();
        };
        
        // Override the tutorial's cleanup method to disable tutorial mode
        const originalCleanup = this.currentTutorial.cleanup.bind(this.currentTutorial);
        this.currentTutorial.cleanup = () => {
            originalCleanup();
            this.interactionManager.disableTutorialMode();
        };
        
        this.currentTutorial.start();
    }

    // Generic auto-start checker
    async shouldAutoStart(tutorialName, tutorialClass) {
        const module = await import(`./${tutorialName}-tutorial.js`);
        const TutorialClass = module[tutorialClass];
        return TutorialClass.shouldAutoStart();
    }

    // Generic tutorial restarter
    async restartTutorial(tutorialName, tutorialClass, startMethodName) {
        const module = await import(`./${tutorialName}-tutorial.js`);
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