import { BaseFile } from '../base-file.js';

class LogsFileContentClass extends BaseFile {
    constructor() {
        super({
            directoryPath: '/home/trainee/Logs',
            directoryName: 'Logs'
        });
    }

    initializeFiles() {
        // System access log
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

        this.addFile('system_access.log',
            this.createLogTemplate('System Access', accessEntries),
            { size: '128 KB', modified: '2024-12-20 14:30' }
        );

        // Security events log
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

        this.addFile('security_events.log',
            this.createLogTemplate('Security Events', securityEntries),
            { suspicious: true, size: '89 KB', modified: '2024-12-20 13:22' }
        );

        // Firewall blocks log
        const firewallEntries = [
            { timestamp: '2024-12-20 12:45:01', level: 'BLOCK', message: 'TCP 203.0.113.5:443 -> 192.168.1.10:80 [Malicious IP]' },
            { timestamp: '2024-12-20 12:44:55', level: 'BLOCK', message: 'UDP 198.51.100.20:53 -> 192.168.1.5:53 [DNS Poisoning]' },
            { timestamp: '2024-12-20 12:44:50', level: 'ALLOW', message: 'TCP 192.168.1.50:443 -> 8.8.8.8:443 [HTTPS Traffic]' },
            { timestamp: '2024-12-20 12:44:45', level: 'BLOCK', message: 'TCP 172.16.0.100:22 -> 192.168.1.1:22 [Unauthorized SSH]' },
            { timestamp: '2024-12-20 12:44:40', level: 'BLOCK', message: 'ICMP 10.0.0.50 -> 192.168.1.255 [Ping Flood]' },
            { timestamp: '2024-12-20 12:44:35', level: 'ALLOW', message: 'TCP 192.168.1.25:80 -> 203.0.113.10:80 [Web Traffic]' },
            { timestamp: '2024-12-20 12:44:30', level: 'BLOCK', message: 'TCP 192.168.1.100:25 -> 198.51.100.5:25 [Spam Relay]' }
        ];

        this.addFile('firewall_blocks.log',
            this.createLogTemplate('Firewall Blocks', firewallEntries),
            { size: '256 KB', modified: '2024-12-20 12:45' }
        );

        // Auth failures log
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

        this.addFile('auth_failures.log',
            this.createLogTemplate('Authentication Failures', authEntries),
            { suspicious: true, size: '67 KB', modified: '2024-12-20 11:15' }
        );

        // Application debug log
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

        this.addFile('application_debug.log',
            this.createLogTemplate('Application Debug', debugEntries),
            { size: '512 KB', modified: '2024-12-20 10:30' }
        );

        // Network traffic log
        const networkEntries = [
            { timestamp: '2024-12-20 09:45:01', level: 'TCP', message: '192.168.1.50:443 -> 8.8.8.8:443 [HTTPS - Google DNS]' },
            { timestamp: '2024-12-20 09:45:02', level: 'UDP', message: '192.168.1.50:53 -> 192.168.1.1:53 [DNS Query - cyberquest.com]' },
            { timestamp: '2024-12-20 09:45:03', level: 'TCP', message: '192.168.1.50:80 -> 203.0.113.10:80 [HTTP - Web browsing]' },
            { timestamp: '2024-12-20 09:45:04', level: 'TCP', message: '192.168.1.25:22 -> 192.168.1.50:22 [SSH Connection]' },
            { timestamp: '2024-12-20 09:45:05', level: 'UDP', message: '192.168.1.50:123 -> 129.6.15.28:123 [NTP Time sync]' },
            { timestamp: '2024-12-20 09:45:06', level: 'TCP', message: '192.168.1.50:993 -> 203.0.113.20:993 [IMAPS - Email]' },
            { timestamp: '2024-12-20 09:45:07', level: 'TCP', message: '192.168.1.50:443 -> 198.51.100.5:443 [HTTPS - Secure web]' }
        ];

        this.addFile('network_traffic.log',
            this.createLogTemplate('Network Traffic', networkEntries),
            { size: '1.2 MB', modified: '2024-12-20 09:45' }
        );
    }
}

// Export as file object for compatibility
export const LogsFileContents = new LogsFileContentClass().toFileObject();