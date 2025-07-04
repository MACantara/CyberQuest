import { BrowserApp } from './desktop-applications/browser-app.js';
import { TerminalApp } from './desktop-applications/terminal-app.js';
import { FileManagerApp } from './desktop-applications/file-manager-app.js';
import { EmailApp } from './desktop-applications/email-app.js';
import { NetworkMonitorApp } from './desktop-applications/network-monitor-app.js';
import { SystemLogsApp } from './desktop-applications/system-logs-app.js';
import { ProcessMonitorApp } from './desktop-applications/process-monitor-app.js';

export class ApplicationRegistry {
    constructor() {
        this.registry = {
            'browser': {
                class: BrowserApp,
                storageKey: 'cyberquest_browser_opened',
                tutorialMethod: 'shouldAutoStartBrowser',
                startMethod: 'startBrowserTutorial',
                iconClass: 'bi-globe',
                title: 'Web Browser'
            },
            'terminal': {
                class: TerminalApp,
                storageKey: 'cyberquest_terminal_opened',
                tutorialMethod: 'shouldAutoStartTerminal',
                startMethod: 'startTerminalTutorial',
                iconClass: 'bi-terminal',
                title: 'Terminal'
            },
            'files': {
                class: FileManagerApp,
                storageKey: 'cyberquest_filemanager_opened',
                tutorialMethod: 'shouldAutoStartFileManager',
                startMethod: 'startFileManagerTutorial',
                iconClass: 'bi-folder',
                title: 'File Manager'
            },
            'email': {
                class: EmailApp,
                storageKey: 'cyberquest_email_opened',
                tutorialMethod: 'shouldAutoStartEmail',
                startMethod: 'startEmailTutorial',
                iconClass: 'bi-envelope',
                title: 'Email Client'
            },
            'wireshark': {
                class: NetworkMonitorApp,
                storageKey: 'cyberquest_networkmonitor_opened',
                tutorialMethod: 'shouldAutoStartNetworkMonitor',
                startMethod: 'startNetworkMonitorTutorial',
                iconClass: 'bi-router',
                title: 'Network Monitor'
            },
            'logs': {
                class: SystemLogsApp,
                storageKey: 'cyberquest_systemlogs_opened',
                tutorialMethod: 'shouldAutoStartSystemLogs',
                startMethod: 'startSystemLogsTutorial',
                iconClass: 'bi-journal-text',
                title: 'System Logs'
            },
            'process-monitor': {
                class: ProcessMonitorApp,
                storageKey: 'cyberquest_processmonitor_opened',
                tutorialMethod: 'shouldAutoStartProcessMonitor',
                startMethod: 'startProcessMonitorTutorial',
                iconClass: 'bi-cpu',
                title: 'Process Monitor'
            }
        };
    }

    // Get application configuration by ID
    getApp(appId) {
        return this.registry[appId] || null;
    }

    // Check if application exists
    hasApp(appId) {
        return this.registry.hasOwnProperty(appId);
    }

    // Get all registered application IDs
    getAllAppIds() {
        return Object.keys(this.registry);
    }

    // Get all registered applications
    getAllApps() {
        return { ...this.registry };
    }

    // Register a new application
    registerApp(appId, config) {
        if (!config.class) {
            throw new Error('Application configuration must include a class property');
        }
        
        const defaultConfig = {
            storageKey: `cyberquest_${appId}_opened`,
            tutorialMethod: null,
            startMethod: null,
            iconClass: 'bi-window',
            title: appId.charAt(0).toUpperCase() + appId.slice(1)
        };

        this.registry[appId] = { ...defaultConfig, ...config };
    }

    // Unregister an application
    unregisterApp(appId) {
        if (this.registry[appId]) {
            delete this.registry[appId];
            return true;
        }
        return false;
    }

    // Update existing application configuration
    updateApp(appId, config) {
        if (this.registry[appId]) {
            this.registry[appId] = { ...this.registry[appId], ...config };
            return true;
        }
        return false;
    }

    // Get icon class for application (with fallback)
    getIconClass(appId) {
        const app = this.registry[appId];
        return app ? app.iconClass : 'bi-window';
    }

    // Get title for application (with fallback)
    getTitle(appId) {
        const app = this.registry[appId];
        return app ? app.title : appId.charAt(0).toUpperCase() + appId.slice(1);
    }

    // Get applications that have tutorial integration
    getTutorialApps() {
        return Object.entries(this.registry)
            .filter(([id, config]) => config.tutorialMethod && config.startMethod)
            .reduce((acc, [id, config]) => {
                acc[id] = config;
                return acc;
            }, {});
    }

    // Get applications by category (if categorization is needed in the future)
    getAppsByCategory(category) {
        return Object.entries(this.registry)
            .filter(([id, config]) => config.category === category)
            .reduce((acc, [id, config]) => {
                acc[id] = config;
                return acc;
            }, {});
    }

    // Validate application configuration
    validateAppConfig(config) {
        const required = ['class'];
        const optional = ['storageKey', 'tutorialMethod', 'startMethod', 'iconClass', 'title', 'category'];
        
        for (const prop of required) {
            if (!config.hasOwnProperty(prop)) {
                throw new Error(`Required property '${prop}' missing from application configuration`);
            }
        }

        const allProps = [...required, ...optional];
        for (const prop in config) {
            if (!allProps.includes(prop)) {
                console.warn(`Unknown property '${prop}' in application configuration`);
            }
        }

        return true;
    }

    // Create application instance
    createAppInstance(appId) {
        const config = this.registry[appId];
        if (!config) {
            throw new Error(`Application '${appId}' not found in registry`);
        }

        try {
            return new config.class();
        } catch (error) {
            throw new Error(`Failed to create instance of application '${appId}': ${error.message}`);
        }
    }

    // Check if app should show tutorial on first open
    shouldShowTutorial(appId) {
        const config = this.registry[appId];
        if (!config || !config.storageKey) {
            return false;
        }

        return !localStorage.getItem(config.storageKey);
    }

    // Mark app as opened
    markAsOpened(appId) {
        const config = this.registry[appId];
        if (config && config.storageKey) {
            localStorage.setItem(config.storageKey, 'true');
        }
    }

    // Reset app opened status (for testing/debugging)
    resetOpenedStatus(appId) {
        const config = this.registry[appId];
        if (config && config.storageKey) {
            localStorage.removeItem(config.storageKey);
        }
    }

    // Reset all app opened statuses
    resetAllOpenedStatuses() {
        Object.values(this.registry).forEach(config => {
            if (config.storageKey) {
                localStorage.removeItem(config.storageKey);
            }
        });
    }

    // Get application statistics
    getStats() {
        const total = Object.keys(this.registry).length;
        const withTutorials = Object.values(this.registry)
            .filter(config => config.tutorialMethod && config.startMethod).length;
        const opened = Object.values(this.registry)
            .filter(config => config.storageKey && localStorage.getItem(config.storageKey)).length;

        return {
            total,
            withTutorials,
            opened,
            unopened: total - opened
        };
    }
}

// Export singleton instance
export const appRegistry = new ApplicationRegistry();

// Export class for testing/custom instances
export default ApplicationRegistry;
