import { BaseFile } from '../base-file.js';

export class ApplicationDebugLogFile extends BaseFile {
    constructor() {
        super({
            name: 'application_debug.log',
            directoryPath: '/home/trainee/Logs',
            size: '512 KB',
            modified: '2024-12-20 10:30',
            suspicious: false
        });
    }

    getContent() {
        const debugEntries = [
            { timestamp: '2024-12-20 10:30:01', level: 'DEBUG', message: 'Application startup sequence initiated' },
            { timestamp: '2024-12-20 10:30:02', level: 'DEBUG', message: 'Loading configuration from /etc/app/config.xml' },
            { timestamp: '2024-12-20 10:30:03', level: 'DEBUG', message: 'Database connection established: localhost:5432' },
            { timestamp: '2024-12-20 10:30:04', level: 'DEBUG', message: 'User authentication module loaded' },
            { timestamp: '2024-12-20 10:30:05', level: 'DEBUG', message: 'Security middleware initialized' },
            { timestamp: '2024-12-20 10:30:06', level: 'INFO', message: 'Application ready to accept connections' },
            { timestamp: '2024-12-20 10:30:07', level: 'DEBUG', message: 'First user request received' },
            { timestamp: '2024-12-20 10:30:08', level: 'DEBUG', message: 'Processing login request for user: trainee' },
            { timestamp: '2024-12-20 10:30:09', level: 'DEBUG', message: 'Session created successfully' }
        ];

        return this.createLogTemplate('Application Debug', debugEntries);
    }
}
