import { BaseFile } from '../base-file.js';

export class SystemAccessLogFile extends BaseFile {
    constructor() {
        super({
            name: 'system_access.log',
            directoryPath: '/home/trainee/Logs',
            size: '128 KB',
            modified: '2024-12-20 14:30',
            suspicious: false
        });
    }

    getContent() {
        const accessEntries = [
            { timestamp: '2024-12-20 14:30:01', level: 'INFO', message: 'User login: trainee from 192.168.1.50' },
            { timestamp: '2024-12-20 14:29:45', level: 'INFO', message: 'User logout: admin' },
            { timestamp: '2024-12-20 14:29:30', level: 'WARN', message: 'Failed login attempt: root from 10.0.0.15' },
            { timestamp: '2024-12-20 14:29:15', level: 'INFO', message: 'File accessed: /home/trainee/documents/report.pdf' },
            { timestamp: '2024-12-20 14:29:00', level: 'ERROR', message: 'Privilege escalation attempt blocked for user: guest' },
            { timestamp: '2024-12-20 14:28:45', level: 'INFO', message: 'System backup completed successfully' },
            { timestamp: '2024-12-20 14:28:30', level: 'WARN', message: 'Disk space low on /var partition (85% full)' },
            { timestamp: '2024-12-20 14:28:15', level: 'INFO', message: 'SSH connection established from 192.168.1.25' }
        ];

        return this.createLogTemplate('System Access', accessEntries);
    }
}
