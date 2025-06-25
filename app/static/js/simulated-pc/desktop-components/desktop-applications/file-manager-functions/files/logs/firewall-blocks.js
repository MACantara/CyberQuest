import { BaseIndividualFile } from '../base-file.js';

export class FirewallBlocksLogFile extends BaseIndividualFile {
    constructor() {
        super({
            name: 'firewall_blocks.log',
            directoryPath: '/home/trainee/Logs',
            size: '256 KB',
            modified: '2024-12-20 12:45',
            suspicious: false,
            icon: 'bi-journal-text',
            color: 'text-orange-400'
        });
    }

    getContent() {
        const firewallEntries = [
            { timestamp: '2024-12-20 12:45:01', level: 'BLOCK', message: 'TCP 203.0.113.5:443 -> 192.168.1.10:80 [Malicious IP]' },
            { timestamp: '2024-12-20 12:44:55', level: 'BLOCK', message: 'UDP 198.51.100.20:53 -> 192.168.1.5:53 [DNS Poisoning]' },
            { timestamp: '2024-12-20 12:44:50', level: 'ALLOW', message: 'TCP 192.168.1.50:443 -> 8.8.8.8:443 [HTTPS Traffic]' },
            { timestamp: '2024-12-20 12:44:45', level: 'BLOCK', message: 'TCP 172.16.0.100:22 -> 192.168.1.1:22 [Unauthorized SSH]' },
            { timestamp: '2024-12-20 12:44:40', level: 'BLOCK', message: 'ICMP 10.0.0.50 -> 192.168.1.255 [Ping Flood]' },
            { timestamp: '2024-12-20 12:44:35', level: 'ALLOW', message: 'TCP 192.168.1.25:80 -> 203.0.113.10:80 [Web Traffic]' },
            { timestamp: '2024-12-20 12:44:30', level: 'BLOCK', message: 'TCP 192.168.1.100:25 -> 198.51.100.5:25 [Spam Relay]' }
        ];

        return this.createLogTemplate('Firewall Blocks', firewallEntries);
    }
}
