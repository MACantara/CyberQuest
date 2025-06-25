import { BaseFile } from '../base-file.js';

export class NetworkTrafficLogFile extends BaseFile {
    constructor() {
        super({
            name: 'network_traffic.log',
            directoryPath: '/home/trainee/Logs',
            size: '1.2 MB',
            modified: '2024-12-20 09:45',
            suspicious: false
        });
    }

    getContent() {
        const networkEntries = [
            { timestamp: '2024-12-20 09:45:01', level: 'TCP', message: '192.168.1.50:443 -> 8.8.8.8:443 [HTTPS - Google DNS]' },
            { timestamp: '2024-12-20 09:45:02', level: 'UDP', message: '192.168.1.50:53 -> 192.168.1.1:53 [DNS Query - cyberquest.com]' },
            { timestamp: '2024-12-20 09:45:03', level: 'TCP', message: '192.168.1.50:80 -> 203.0.113.10:80 [HTTP - Web browsing]' },
            { timestamp: '2024-12-20 09:45:04', level: 'TCP', message: '192.168.1.25:22 -> 192.168.1.50:22 [SSH Connection]' },
            { timestamp: '2024-12-20 09:45:05', level: 'UDP', message: '192.168.1.50:123 -> 129.6.15.28:123 [NTP Time sync]' },
            { timestamp: '2024-12-20 09:45:06', level: 'TCP', message: '192.168.1.50:993 -> 203.0.113.20:993 [IMAPS - Email]' },
            { timestamp: '2024-12-20 09:45:07', level: 'TCP', message: '192.168.1.50:443 -> 198.51.100.5:443 [HTTPS - Secure web]' }
        ];

        return this.createLogTemplate('Network Traffic', networkEntries);
    }
}
