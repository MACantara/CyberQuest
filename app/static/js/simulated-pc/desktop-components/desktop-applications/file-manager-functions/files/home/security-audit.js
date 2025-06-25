import { BaseIndividualFile } from '../base-file.js';

export class SecurityAuditFile extends BaseIndividualFile {
    constructor() {
        super({
            name: 'security_audit.log',
            directoryPath: '/home/trainee',
            size: '45.2 KB',
            modified: '2024-12-20 12:15',
            suspicious: false
        });
    }

    getContent() {
        const auditEntries = [
            { timestamp: '2024-12-20 12:15:01', level: 'INFO', message: 'Security audit started by user: admin' },
            { timestamp: '2024-12-20 12:15:05', level: 'INFO', message: 'Scanning user accounts for anomalies' },
            { timestamp: '2024-12-20 12:15:12', level: 'WARN', message: 'Multiple failed login attempts detected for user: guest' },
            { timestamp: '2024-12-20 12:15:15', level: 'ERROR', message: 'Suspicious file access attempt blocked: /etc/passwd' },
            { timestamp: '2024-12-20 12:15:18', level: 'INFO', message: 'Firewall rules validation complete' },
            { timestamp: '2024-12-20 12:15:22', level: 'WARN', message: 'Outdated software packages detected' },
            { timestamp: '2024-12-20 12:15:25', level: 'INFO', message: 'Certificate expiration check complete' },
            { timestamp: '2024-12-20 12:15:30', level: 'ERROR', message: 'Unauthorized network connection attempt from 192.168.1.100' },
            { timestamp: '2024-12-20 12:15:35', level: 'INFO', message: 'Security scan completed - 3 issues found' }
        ];

        return this.createLogTemplate('Security Audit', auditEntries);
    }
}
