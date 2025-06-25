import { BaseFile } from '../base-file.js';

export class SecurityEventsLogFile extends BaseFile {
    constructor() {
        super({
            name: 'security_events.log',
            directoryPath: '/home/trainee/Logs',
            size: '89 KB',
            modified: '2024-12-20 13:22',
            suspicious: true
        });
    }

    getContent() {
        const securityEntries = [
            { timestamp: '2024-12-20 13:22:01', level: 'CRITICAL', message: 'Malware detected: suspicious_file.exe quarantined' },
            { timestamp: '2024-12-20 13:21:45', level: 'HIGH', message: 'Phishing email blocked from sender: fake@malicious-site.com' },
            { timestamp: '2024-12-20 13:21:30', level: 'MEDIUM', message: 'Brute force attack detected on SSH service' },
            { timestamp: '2024-12-20 13:21:15', level: 'HIGH', message: 'Suspicious network traffic to known botnet C&C server' },
            { timestamp: '2024-12-20 13:21:00', level: 'LOW', message: 'Password policy violation: weak password detected' },
            { timestamp: '2024-12-20 13:20:45', level: 'CRITICAL', message: 'Unauthorized admin access attempt' },
            { timestamp: '2024-12-20 13:20:30', level: 'MEDIUM', message: 'Failed virus signature update' },
            { timestamp: '2024-12-20 13:20:15', level: 'HIGH', message: 'Suspicious file download blocked: trojan.exe' }
        ];

        return this.createLogTemplate('Security Events', securityEntries);
    }
}
