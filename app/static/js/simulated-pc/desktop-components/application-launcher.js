import { appRegistry } from './application-registry.js';

export class ApplicationLauncher {
    constructor(windowManager) {
        this.windowManager = windowManager;
        this.appRegistry = appRegistry;
        this.tutorialManager = windowManager.tutorialManager;
    }

    // Core application opening functionality moved from window manager
    async openApplication(appId, windowTitle) {
        const appConfig = this.appRegistry.getApp(appId);
        if (!appConfig) {
            throw new Error(`Application '${appId}' not found in registry`);
        }

        const isFirstTime = !localStorage.getItem(appConfig.storageKey);
        const app = this.appRegistry.createAppInstance(appId);
        
        this.windowManager.createWindow(appId, windowTitle || appConfig.title, app);
        this.appRegistry.markAsOpened(appId);

        // Handle tutorial auto-start if it's the first time and tutorial manager is available
        if (isFirstTime && this.tutorialManager && appConfig.tutorialMethod && appConfig.startMethod) {
            await this.handleTutorialAutoStart(appConfig.tutorialMethod, appConfig.startMethod);
        }
    }

    // Shared tutorial auto-start logic moved from window manager
    async handleTutorialAutoStart(tutorialCheckMethod, tutorialStartMethod) {
        try {
            // Check if the tutorial manager has the required methods
            if (typeof this.tutorialManager[tutorialCheckMethod] !== 'function') {
                console.warn(`Tutorial method ${tutorialCheckMethod} not found on tutorial manager`);
                return;
            }

            if (typeof this.tutorialManager[tutorialStartMethod] !== 'function') {
                console.warn(`Tutorial method ${tutorialStartMethod} not found on tutorial manager`);
                return;
            }

            const shouldStart = await this.tutorialManager[tutorialCheckMethod]();
            if (shouldStart) {
                setTimeout(async () => {
                    await this.tutorialManager[tutorialStartMethod]();
                }, 1500);
            }
        } catch (error) {
            console.warn(`Tutorial auto-start failed: ${error.message}`);
        }
    }

    // Generic application launcher
    async launchApplication(appId, windowTitle = null) {
        try {
            await this.openApplication(appId, windowTitle);
            return true;
        } catch (error) {
            console.error(`Failed to launch application '${appId}':`, error);
            return false;
        }
    }

    // Specific application launchers
    async launchBrowser() {
        return await this.launchApplication('browser');
    }

    async launchEmail() {
        return await this.launchApplication('email');
    }

    async launchTerminal() {
        return await this.launchApplication('terminal');
    }

    async launchFileManager() {
        return await this.launchApplication('files');
    }

    async launchNetworkMonitor() {
        return await this.launchApplication('wireshark');
    }

    async launchSystemLogs() {
        return await this.launchApplication('logs');
    }

    async launchProcessMonitor() {
        return await this.launchApplication('process-monitor');
    }

    async launchMalwareScanner() {
        return await this.launchApplication('malware-scanner');
    }

    async launchRansomwareDecryptor() {
        return await this.launchApplication('ransomware-decryptor');
    }

    async launchVulnerabilityScanner() {
        return await this.launchApplication('vulnerability-scanner');
    }

    // Level-specific app launching with logging
    async launchForLevel(levelId, appId, appName = null) {
        const success = await this.launchApplication(appId, appName);
        if (success) {
            console.log(`${appName || appId} opened for Level ${levelId}`);
        } else {
            console.error(`Failed to open ${appName || appId} for Level ${levelId}`);
        }
        return success;
    }

    // Batch application launching
    async launchMultiple(appIds) {
        const results = [];
        for (const appId of appIds) {
            try {
                const success = await this.launchApplication(appId);
                results.push({ appId, success });
            } catch (error) {
                results.push({ appId, success: false, error: error.message });
            }
        }
        return results;
    }

    // Check if application is already open
    isApplicationOpen(appId) {
        return this.windowManager.windows.has(appId);
    }

    // Get open applications
    getOpenApplications() {
        return this.windowManager.getOpenApplications();
    }

    // Close application
    closeApplication(appId) {
        return this.windowManager.closeWindow(appId);
    }

    // Get application info
    getApplicationInfo(appId) {
        return this.appRegistry.getApp(appId);
    }

    // Check if application exists
    applicationExists(appId) {
        return this.appRegistry.hasApp(appId);
    }
}

// Create singleton instance (will be initialized by window manager)
let applicationLauncher = null;

export function initializeApplicationLauncher(windowManager) {
    applicationLauncher = new ApplicationLauncher(windowManager);
    return applicationLauncher;
}

export function getApplicationLauncher() {
    if (!applicationLauncher) {
        throw new Error('Application launcher not initialized. Call initializeApplicationLauncher first.');
    }
    return applicationLauncher;
}

// Export for convenience
export default ApplicationLauncher;
