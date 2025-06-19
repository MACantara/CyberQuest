import { BrowserApp } from './desktop-applications/browser-app.js';
import { TerminalApp } from './desktop-applications/terminal-app.js';
import { FileManagerApp } from './desktop-applications/file-manager-app.js';
import { EmailApp } from './desktop-applications/email-app.js';
import { NetworkMonitorApp } from './desktop-applications/network-monitor-app.js';
import { SecurityToolsApp } from './desktop-applications/security-tools-app.js';
import { SystemLogsApp } from './desktop-applications/system-logs-app.js';

export class ApplicationFactory {
    createBrowserContent() {
        return BrowserApp.createContent();
    }

    createTerminalContent() {
        return TerminalApp.createContent();
    }

    createFileManagerContent() {
        return FileManagerApp.createContent();
    }

    createEmailContent() {
        return EmailApp.createContent();
    }

    createNetworkMonitorContent() {
        return NetworkMonitorApp.createContent();
    }

    createSecurityToolsContent() {
        return SecurityToolsApp.createContent();
    }

    createSystemLogsContent() {
        return SystemLogsApp.createContent();
    }
}