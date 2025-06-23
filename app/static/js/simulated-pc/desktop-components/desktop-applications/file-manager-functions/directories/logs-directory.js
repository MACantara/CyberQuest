import { BaseDirectory } from './base-directory.js';

class LogsDirectoryClass extends BaseDirectory {
    constructor() {
        super({
            path: '/home/trainee/Logs',
            name: 'Logs'
        });
    }

    initializeItems() {
        this.addFile({
            name: 'system_access.log',
            color: 'text-yellow-400',
            size: '128 KB',
            modified: '2024-12-20 14:30'
        });

        this.addFile({
            name: 'security_events.log',
            color: 'text-red-400',
            suspicious: true,
            size: '89 KB',
            modified: '2024-12-20 13:22'
        });

        this.addFile({
            name: 'firewall_blocks.log',
            color: 'text-orange-400',
            size: '256 KB',
            modified: '2024-12-20 12:45'
        });

        this.addFile({
            name: 'auth_failures.log',
            color: 'text-red-400',
            suspicious: true,
            size: '67 KB',
            modified: '2024-12-20 11:15'
        });

        this.addFile({
            name: 'application_debug.log',
            color: 'text-blue-400',
            size: '512 KB',
            modified: '2024-12-20 10:30'
        });

        this.addFile({
            name: 'network_traffic.log',
            color: 'text-green-400',
            size: '1.2 MB',
            modified: '2024-12-20 09:45'
        });
    }
}

// Export as directory object for compatibility
export const LogsDirectory = new LogsDirectoryClass().toDirectoryObject();
