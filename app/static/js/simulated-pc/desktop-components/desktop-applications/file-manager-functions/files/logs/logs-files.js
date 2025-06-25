import { BaseFile } from '../base-file.js';
import { SystemAccessLogFile } from './system-access.js';
import { SecurityEventsLogFile } from './security-events.js';
import { FirewallBlocksLogFile } from './firewall-blocks.js';
import { AuthFailuresLogFile } from './auth-failures.js';
import { ApplicationDebugLogFile } from './application-debug.js';
import { NetworkTrafficLogFile } from './network-traffic.js';

class LogsFileContentClass extends BaseFile {
    constructor() {
        super({
            directoryPath: '/home/trainee/Logs',
            directoryName: 'Logs'
        });
    }

    initializeFiles() {
        // Initialize individual log files
        const systemAccess = new SystemAccessLogFile();
        const securityEvents = new SecurityEventsLogFile();
        const firewallBlocks = new FirewallBlocksLogFile();
        const authFailures = new AuthFailuresLogFile();
        const applicationDebug = new ApplicationDebugLogFile();
        const networkTraffic = new NetworkTrafficLogFile();

        // Add files using their content
        this.addFile(systemAccess.name, systemAccess.getContent(), {
            size: systemAccess.size,
            modified: systemAccess.modified,
            suspicious: systemAccess.suspicious
        });

        this.addFile(securityEvents.name, securityEvents.getContent(), {
            size: securityEvents.size,
            modified: securityEvents.modified,
            suspicious: securityEvents.suspicious
        });

        this.addFile(firewallBlocks.name, firewallBlocks.getContent(), {
            size: firewallBlocks.size,
            modified: firewallBlocks.modified,
            suspicious: firewallBlocks.suspicious
        });

        this.addFile(authFailures.name, authFailures.getContent(), {
            size: authFailures.size,
            modified: authFailures.modified,
            suspicious: authFailures.suspicious
        });

        this.addFile(applicationDebug.name, applicationDebug.getContent(), {
            size: applicationDebug.size,
            modified: applicationDebug.modified,
            suspicious: applicationDebug.suspicious
        });

        this.addFile(networkTraffic.name, networkTraffic.getContent(), {
            size: networkTraffic.size,
            modified: networkTraffic.modified,
            suspicious: networkTraffic.suspicious
        });
    }
}

// Export as file object for compatibility
export const LogsFileContents = new LogsFileContentClass().toFileObject();