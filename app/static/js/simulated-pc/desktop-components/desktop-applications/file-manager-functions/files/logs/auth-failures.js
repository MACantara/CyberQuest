import { BaseIndividualFile } from '../base-file.js';

export class AuthFailuresLogFile extends BaseIndividualFile {
    constructor() {
        super({
            name: 'auth_failures.log',
            directoryPath: '/home/trainee/Logs',
            size: '67 KB',
            modified: '2024-12-20 11:15',
            suspicious: true
        });
    }

    getContent() {
        const authEntries = [
            { timestamp: '2024-12-20 11:15:01', level: 'FAILED', message: 'Login attempt for user \'admin\' from 203.0.113.15 - Invalid password' },
            { timestamp: '2024-12-20 11:14:58', level: 'FAILED', message: 'Login attempt for user \'root\' from 203.0.113.15 - Account locked' },
            { timestamp: '2024-12-20 11:14:55', level: 'FAILED', message: 'Login attempt for user \'guest\' from 192.168.1.200 - Invalid password' },
            { timestamp: '2024-12-20 11:14:52', level: 'FAILED', message: 'SSH key authentication failed for user \'backup\' from 10.0.0.25' },
            { timestamp: '2024-12-20 11:14:49', level: 'FAILED', message: 'Login attempt for user \'admin\' from 203.0.113.15 - Invalid password' },
            { timestamp: '2024-12-20 11:14:46', level: 'FAILED', message: 'Login attempt for user \'test\' from 172.16.0.50 - User not found' },
            { timestamp: '2024-12-20 11:14:43', level: 'FAILED', message: 'Login attempt for user \'admin\' from 203.0.113.15 - Invalid password' },
            { timestamp: '2024-12-20 11:14:40', level: 'SUCCESS', message: 'Login successful for user \'trainee\' from 192.168.1.50' }
        ];

        return this.createLogTemplate('Authentication Failures', authEntries);
    }
}
