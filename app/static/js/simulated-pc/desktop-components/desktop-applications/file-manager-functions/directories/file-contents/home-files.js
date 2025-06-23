import { BaseFileContent } from './base-file-content.js';

class HomeFileContentClass extends BaseFileContent {
    constructor() {
        super({
            directoryPath: '/home/trainee',
            directoryName: 'Home'
        });
    }

    initializeFiles() {
        // Suspicious file
        this.addFile('suspicious_file.txt',
            this.createSecurityAlert(
                'Suspicious Content',
                'High',
                'WARNING: This file contains suspicious content!\nDo not execute or share this file.\nReport to security team immediately.'
            ),
            { suspicious: true, size: '1.3 KB', modified: '2024-12-20 10:31' }
        );

        // README file
        this.addFile('readme.txt',
            this.createTrainingContent(
                'readme.txt',
                'Welcome to CyberQuest Training Environment!\n\nThis is a simulated file system for cybersecurity training.\nExplore the directories and learn to identify suspicious files.\n\nFor help, contact support@cyberquest.com',
                'welcome'
            ),
            { size: '256 B', modified: '2024-12-20 09:15' }
        );

        // Bash configuration
        this.addFile('.bashrc',
            '# ~/.bashrc: executed by bash(1) for non-login shells.\nexport PATH=/usr/local/bin:/usr/bin:/bin\nPS1="\\u@\\h:\\w\\$ "\n\n# Training environment settings\nexport TRAINING_MODE=1\n\n# CyberQuest simulation aliases\nalias ls="ls --color=auto"\nalias ll="ls -la"\nalias grep="grep --color=auto"',
            { hidden: true, size: '128 B', modified: '2024-12-19 14:22' }
        );

        // Security audit log
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

        this.addFile('security_audit.log',
            this.createLogTemplate('Security Audit', auditEntries),
            { size: '45.2 KB', modified: '2024-12-20 12:15' }
        );

        // System screenshot
        this.addFile('system_screenshot.png',
            this.createTrainingContent(
                'system_screenshot.png',
                'This would be a screenshot of the system desktop showing various applications and files.\n\nImage Details:\n- Resolution: 1920x1080\n- Color Depth: 32-bit\n- Captured: 2024-12-20 11:30\n\nThis is a simulated image file for training purposes.',
                'image'
            ),
            { size: '2.1 MB', modified: '2024-12-20 11:30' }
        );
    }
}

// Export as file object for compatibility
export const HomeFileContents = new HomeFileContentClass().toFileObject();
