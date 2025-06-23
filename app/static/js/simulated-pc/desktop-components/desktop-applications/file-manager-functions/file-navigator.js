export class FileNavigator {
    constructor(fileManagerApp) {
        this.fileManagerApp = fileManagerApp;
        this.currentPath = '/home/trainee';
        this.history = ['/home/trainee'];
        this.historyIndex = 0;
        this.fileSystem = this.createFileSystem();
    }

    createFileSystem() {
        return {
            '/home/trainee': {
                type: 'directory',
                name: 'trainee',
                items: [
                    { name: 'Documents', type: 'directory', icon: 'bi-folder', color: 'text-blue-400' },
                    { name: 'Downloads', type: 'directory', icon: 'bi-folder', color: 'text-blue-400' },
                    { name: 'Desktop', type: 'directory', icon: 'bi-folder', color: 'text-blue-400' },
                    { name: 'Pictures', type: 'directory', icon: 'bi-folder', color: 'text-blue-400' },
                    { name: 'Logs', type: 'directory', icon: 'bi-folder', color: 'text-yellow-400' },
                    { 
                        name: 'suspicious_file.txt', 
                        type: 'file', 
                        icon: 'bi-file-text', 
                        color: 'text-red-400',
                        suspicious: true,
                        size: '1.3 KB',
                        modified: '2024-12-20 10:31'
                    },
                    { 
                        name: 'readme.txt', 
                        type: 'file', 
                        icon: 'bi-file-text', 
                        color: 'text-gray-400',
                        size: '256 B',
                        modified: '2024-12-20 09:15'
                    },
                    { 
                        name: '.bashrc', 
                        type: 'file', 
                        icon: 'bi-file-code', 
                        color: 'text-green-400',
                        hidden: true,
                        size: '128 B',
                        modified: '2024-12-19 14:22'
                    },
                    { 
                        name: 'security_audit.log', 
                        type: 'file', 
                        icon: 'bi-journal-text', 
                        color: 'text-yellow-400',
                        size: '45.2 KB',
                        modified: '2024-12-20 12:15'
                    },
                    { 
                        name: 'system_screenshot.png', 
                        type: 'file', 
                        icon: 'bi-file-image', 
                        color: 'text-green-400',
                        size: '2.1 MB',
                        modified: '2024-12-20 11:30'
                    }
                ]
            },
            '/home/trainee/Documents': {
                type: 'directory',
                name: 'Documents',
                items: [
                    { 
                        name: 'security_report.txt', 
                        type: 'file', 
                        icon: 'bi-file-text', 
                        color: 'text-yellow-400',
                        size: '512 B',
                        modified: '2024-12-20 11:45'
                    },
                    { 
                        name: 'training_notes.pdf', 
                        type: 'file', 
                        icon: 'bi-file-pdf', 
                        color: 'text-red-400',
                        size: '2.1 MB',
                        modified: '2024-12-19 16:30'
                    },
                    { 
                        name: 'incident_report.log', 
                        type: 'file', 
                        icon: 'bi-journal-text', 
                        color: 'text-yellow-400',
                        size: '15.7 KB',
                        modified: '2024-12-20 08:45'
                    }
                ]
            },
            '/home/trainee/Downloads': {
                type: 'directory',
                name: 'Downloads',
                items: [
                    { 
                        name: 'malware_sample.exe', 
                        type: 'file', 
                        icon: 'bi-file-binary', 
                        color: 'text-red-500',
                        suspicious: true,
                        size: '2.0 KB',
                        modified: '2024-12-20 08:22'
                    },
                    { 
                        name: 'installer.deb', 
                        type: 'file', 
                        icon: 'bi-file-zip', 
                        color: 'text-orange-400',
                        size: '15.7 MB',
                        modified: '2024-12-18 13:10'
                    },
                    { 
                        name: 'profile_photo.jpg', 
                        type: 'file', 
                        icon: 'bi-file-image', 
                        color: 'text-green-400',
                        size: '850 KB',
                        modified: '2024-12-19 14:20'
                    },
                    { 
                        name: 'network_diagram.png', 
                        type: 'file', 
                        icon: 'bi-file-image', 
                        color: 'text-green-400',
                        size: '1.2 MB',
                        modified: '2024-12-18 16:45'
                    }
                ]
            },
            '/home/trainee/Desktop': {
                type: 'directory',
                name: 'Desktop',
                items: [
                    { 
                        name: 'CyberQuest.lnk', 
                        type: 'shortcut', 
                        icon: 'bi-link-45deg', 
                        color: 'text-blue-400',
                        target: 'https://cyberquest.com',
                        size: '1 KB',
                        modified: '2024-12-20 09:00'
                    }
                ]
            },
            '/home/trainee/Pictures': {
                type: 'directory',
                name: 'Pictures',
                items: [
                    { 
                        name: 'conference_2024.jpg', 
                        type: 'file', 
                        icon: 'bi-file-image', 
                        color: 'text-green-400',
                        size: '3.2 MB',
                        modified: '2024-12-15 10:30'
                    },
                    { 
                        name: 'team_meeting.png', 
                        type: 'file', 
                        icon: 'bi-file-image', 
                        color: 'text-green-400',
                        size: '1.8 MB',
                        modified: '2024-12-10 14:15'
                    },
                    { 
                        name: 'security_awareness.gif', 
                        type: 'file', 
                        icon: 'bi-file-image', 
                        color: 'text-green-400',
                        size: '2.5 MB',
                        modified: '2024-12-05 11:22'
                    },
                    { 
                        name: 'vacation_photo.jpg', 
                        type: 'file', 
                        icon: 'bi-file-image', 
                        color: 'text-green-400',
                        size: '4.1 MB',
                        modified: '2024-11-28 16:45'
                    },
                    { 
                        name: 'network_topology.svg', 
                        type: 'file', 
                        icon: 'bi-file-image', 
                        color: 'text-green-400',
                        size: '125 KB',
                        modified: '2024-12-12 09:30'
                    },
                    { 
                        name: 'suspicious_attachment.jpg', 
                        type: 'file', 
                        icon: 'bi-file-image', 
                        color: 'text-red-400',
                        suspicious: true,
                        size: '45 KB',
                        modified: '2024-12-20 13:45'
                    }
                ]
            },
            '/home/trainee/Logs': {
                type: 'directory',
                name: 'Logs',
                items: [
                    { 
                        name: 'system_access.log', 
                        type: 'file', 
                        icon: 'bi-journal-text', 
                        color: 'text-yellow-400',
                        size: '128 KB',
                        modified: '2024-12-20 14:30'
                    },
                    { 
                        name: 'security_events.log', 
                        type: 'file', 
                        icon: 'bi-journal-text', 
                        color: 'text-red-400',
                        suspicious: true,
                        size: '89 KB',
                        modified: '2024-12-20 13:22'
                    },
                    { 
                        name: 'firewall_blocks.log', 
                        type: 'file', 
                        icon: 'bi-journal-text', 
                        color: 'text-orange-400',
                        size: '256 KB',
                        modified: '2024-12-20 12:45'
                    },
                    { 
                        name: 'auth_failures.log', 
                        type: 'file', 
                        icon: 'bi-journal-text', 
                        color: 'text-red-400',
                        suspicious: true,
                        size: '67 KB',
                        modified: '2024-12-20 11:15'
                    },
                    { 
                        name: 'application_debug.log', 
                        type: 'file', 
                        icon: 'bi-journal-text', 
                        color: 'text-blue-400',
                        size: '512 KB',
                        modified: '2024-12-20 10:30'
                    },
                    { 
                        name: 'network_traffic.log', 
                        type: 'file', 
                        icon: 'bi-journal-text', 
                        color: 'text-green-400',
                        size: '1.2 MB',
                        modified: '2024-12-20 09:45'
                    }
                ]
            }
        };
    }

    getCurrentDirectory() {
        return this.fileSystem[this.currentPath];
    }

    getVisibleItems(showHidden = false) {
        const directory = this.getCurrentDirectory();
        if (!directory) return [];
        
        return directory.items.filter(item => showHidden || !item.hidden);
    }

    navigateTo(path) {
        if (this.fileSystem[path]) {
            this.currentPath = path;
            this.addToHistory(path);
            this.updateDisplay();
            return true;
        }
        return false;
    }

    navigateUp() {
        if (this.currentPath === '/home/trainee') return false;
        
        const pathParts = this.currentPath.split('/').filter(p => p);
        pathParts.pop();
        const parentPath = '/' + pathParts.join('/');
        
        return this.navigateTo(parentPath);
    }

    goBack() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.currentPath = this.history[this.historyIndex];
            this.updateDisplay();
            return true;
        }
        return false;
    }

    goForward() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.currentPath = this.history[this.historyIndex];
            this.updateDisplay();
            return true;
        }
        return false;
    }

    goHome() {
        return this.navigateTo('/home/trainee');
    }

    addToHistory(path) {
        // Remove any forward history
        this.history = this.history.slice(0, this.historyIndex + 1);
        // Add new path if it's different from current
        if (this.history[this.history.length - 1] !== path) {
            this.history.push(path);
            this.historyIndex = this.history.length - 1;
        }
    }

    updateDisplay() {
        this.fileManagerApp.renderDirectory();
        this.fileManagerApp.updateAddressBar(this.currentPath);
        this.fileManagerApp.updateNavigationButtons();
    }

    canGoBack() {
        return this.historyIndex > 0;
    }

    canGoForward() {
        return this.historyIndex < this.history.length - 1;
    }

    getFileContent(fileName) {
        const fileContents = {
            'suspicious_file.txt': 'WARNING: This file contains suspicious content!\nDo not execute or share this file.\nReport to security team immediately.\n\n-- TRAINING SIMULATION --',
            'readme.txt': 'Welcome to CyberQuest Training Environment!\n\nThis is a simulated file system for cybersecurity training.\nExplore the directories and learn to identify suspicious files.\n\nFor help, contact support@cyberquest.com',
            '.bashrc': '# ~/.bashrc: executed by bash(1) for non-login shells.\nexport PATH=/usr/local/bin:/usr/bin:/bin\nPS1="\\u@\\h:\\w\\$ "\n\n# Training environment settings\nexport TRAINING_MODE=1',
            'security_report.txt': 'SECURITY INCIDENT REPORT\n========================\n\nDate: 2024-12-20\nIncident Type: Phishing Attempt\nStatus: Resolved\n\nA suspicious email was detected and quarantined.\nNo systems were compromised.\n\nRecommendations:\n- Continue employee training\n- Update email filters\n- Monitor for similar attempts',
            'training_notes.pdf': '[PDF Document]\n\nCybersecurity Training Notes\n\nThis would be a PDF document containing training materials for identifying and responding to cyber threats.\n\nTopics covered:\n- Phishing identification\n- Malware detection\n- Incident response\n- Best practices',
            'malware_sample.exe': '[BINARY FILE - TRAINING SAMPLE]\n\nDANGER: This is a malware sample for training purposes only!\n\nDo not execute this file on a real system!\n\nThis file is used to demonstrate:\n- How malware appears in file systems\n- Identification of suspicious executables\n- Proper handling procedures',
            
            // Log files
            'security_audit.log': `2024-12-20 12:15:01 [INFO] Security audit started by user: admin
2024-12-20 12:15:05 [INFO] Scanning user accounts for anomalies
2024-12-20 12:15:12 [WARN] Multiple failed login attempts detected for user: guest
2024-12-20 12:15:15 [ERROR] Suspicious file access attempt blocked: /etc/passwd
2024-12-20 12:15:18 [INFO] Firewall rules validation complete
2024-12-20 12:15:22 [WARN] Outdated software packages detected
2024-12-20 12:15:25 [INFO] Certificate expiration check complete
2024-12-20 12:15:30 [ERROR] Unauthorized network connection attempt from 192.168.1.100
2024-12-20 12:15:35 [INFO] Security scan completed - 3 issues found`,

            'system_access.log': `2024-12-20 14:30:01 [INFO] User login: trainee from 192.168.1.50
2024-12-20 14:29:45 [INFO] User logout: admin
2024-12-20 14:29:30 [WARN] Failed login attempt: root from 10.0.0.15
2024-12-20 14:29:15 [INFO] File accessed: /home/trainee/documents/report.pdf
2024-12-20 14:29:00 [ERROR] Privilege escalation attempt blocked for user: guest
2024-12-20 14:28:45 [INFO] System backup completed successfully
2024-12-20 14:28:30 [WARN] Disk space low on /var partition (85% full)
2024-12-20 14:28:15 [INFO] SSH connection established from 192.168.1.25`,

            'security_events.log': `2024-12-20 13:22:01 [CRITICAL] Malware detected: suspicious_file.exe quarantined
2024-12-20 13:21:45 [HIGH] Phishing email blocked from sender: fake@malicious-site.com
2024-12-20 13:21:30 [MEDIUM] Brute force attack detected on SSH service
2024-12-20 13:21:15 [HIGH] Suspicious network traffic to known botnet C&C server
2024-12-20 13:21:00 [LOW] Password policy violation: weak password detected
2024-12-20 13:20:45 [CRITICAL] Unauthorized admin access attempt
2024-12-20 13:20:30 [MEDIUM] Failed virus signature update
2024-12-20 13:20:15 [HIGH] Suspicious file download blocked: trojan.exe`,

            'firewall_blocks.log': `2024-12-20 12:45:01 BLOCK TCP 203.0.113.5:443 -> 192.168.1.10:80 [Malicious IP]
2024-12-20 12:44:55 BLOCK UDP 198.51.100.20:53 -> 192.168.1.5:53 [DNS Poisoning]
2024-12-20 12:44:50 ALLOW TCP 192.168.1.50:443 -> 8.8.8.8:443 [HTTPS Traffic]
2024-12-20 12:44:45 BLOCK TCP 172.16.0.100:22 -> 192.168.1.1:22 [Unauthorized SSH]
2024-12-20 12:44:40 BLOCK ICMP 10.0.0.50 -> 192.168.1.255 [Ping Flood]
2024-12-20 12:44:35 ALLOW TCP 192.168.1.25:80 -> 203.0.113.10:80 [Web Traffic]
2024-12-20 12:44:30 BLOCK TCP 192.168.1.100:25 -> 198.51.100.5:25 [Spam Relay]`,

            'auth_failures.log': `2024-12-20 11:15:01 [FAILED] Login attempt for user 'admin' from 203.0.113.15 - Invalid password
2024-12-20 11:14:58 [FAILED] Login attempt for user 'root' from 203.0.113.15 - Account locked
2024-12-20 11:14:55 [FAILED] Login attempt for user 'guest' from 192.168.1.200 - Invalid password
2024-12-20 11:14:52 [FAILED] SSH key authentication failed for user 'backup' from 10.0.0.25
2024-12-20 11:14:49 [FAILED] Login attempt for user 'admin' from 203.0.113.15 - Invalid password
2024-12-20 11:14:46 [FAILED] Login attempt for user 'test' from 172.16.0.50 - User not found
2024-12-20 11:14:43 [FAILED] Login attempt for user 'admin' from 203.0.113.15 - Invalid password
2024-12-20 11:14:40 [SUCCESS] Login successful for user 'trainee' from 192.168.1.50`,

            'incident_report.log': `2024-12-20 08:45:01 [INCIDENT-001] Phishing email campaign detected
2024-12-20 08:45:02 [DETAILS] Source: external-sender@suspicious-domain.com
2024-12-20 08:45:03 [DETAILS] Subject: "Urgent: Account Verification Required"
2024-12-20 08:45:04 [DETAILS] Recipients: 15 users affected
2024-12-20 08:45:05 [ACTIONS] Email quarantined automatically
2024-12-20 08:45:06 [ACTIONS] Users notified of phishing attempt
2024-12-20 08:45:07 [ACTIONS] Sender domain added to blacklist
2024-12-20 08:45:08 [STATUS] Incident contained and resolved
2024-12-20 08:45:09 [FOLLOW-UP] Additional security awareness training scheduled`,

            'application_debug.log': `2024-12-20 10:30:01 [DEBUG] Application startup sequence initiated
2024-12-20 10:30:02 [DEBUG] Loading configuration from /etc/app/config.xml
2024-12-20 10:30:03 [DEBUG] Database connection established: localhost:5432
2024-12-20 10:30:04 [DEBUG] User authentication module loaded
2024-12-20 10:30:05 [DEBUG] Security middleware initialized
2024-12-20 10:30:06 [INFO] Application ready to accept connections
2024-12-20 10:30:07 [DEBUG] First user request received
2024-12-20 10:30:08 [DEBUG] Processing login request for user: trainee
2024-12-20 10:30:09 [DEBUG] Session created successfully`,

            'network_traffic.log': `2024-12-20 09:45:01 TCP 192.168.1.50:443 -> 8.8.8.8:443 [HTTPS - Google DNS]
2024-12-20 09:45:02 UDP 192.168.1.50:53 -> 192.168.1.1:53 [DNS Query - cyberquest.com]
2024-12-20 09:45:03 TCP 192.168.1.50:80 -> 203.0.113.10:80 [HTTP - Web browsing]
2024-12-20 09:45:04 TCP 192.168.1.25:22 -> 192.168.1.50:22 [SSH Connection]
2024-12-20 09:45:05 UDP 192.168.1.50:123 -> 129.6.15.28:123 [NTP Time sync]
2024-12-20 09:45:06 TCP 192.168.1.50:993 -> 203.0.113.20:993 [IMAPS - Email]
2024-12-20 09:45:07 TCP 192.168.1.50:443 -> 198.51.100.5:443 [HTTPS - Secure web]`
        };
        
        return fileContents[fileName] || `Content of ${fileName}\n\nThis is a simulated file for training purposes.`;
    }
}
