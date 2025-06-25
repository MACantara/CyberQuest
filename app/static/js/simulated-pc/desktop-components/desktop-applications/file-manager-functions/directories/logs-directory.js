import { BaseDirectory } from './base-directory.js';
import { SystemAccessLogFile } from '../files/logs/system-access.js';
import { SecurityEventsLogFile } from '../files/logs/security-events.js';
import { FirewallBlocksLogFile } from '../files/logs/firewall-blocks.js';
import { AuthFailuresLogFile } from '../files/logs/auth-failures.js';
import { ApplicationDebugLogFile } from '../files/logs/application-debug.js';
import { NetworkTrafficLogFile } from '../files/logs/network-traffic.js';

class LogsDirectoryClass extends BaseDirectory {
    constructor() {
        super({
            path: '/home/trainee/Logs',
            name: 'Logs'
        });
    }

    initializeItems() {
        // Register individual log files
        this.registerFile(new SystemAccessLogFile());
        this.registerFile(new SecurityEventsLogFile());
        this.registerFile(new FirewallBlocksLogFile());
        this.registerFile(new AuthFailuresLogFile());
        this.registerFile(new ApplicationDebugLogFile());
        this.registerFile(new NetworkTrafficLogFile());
    }
}

// Export as directory object for compatibility
export const LogsDirectory = new LogsDirectoryClass().toDirectoryObject();