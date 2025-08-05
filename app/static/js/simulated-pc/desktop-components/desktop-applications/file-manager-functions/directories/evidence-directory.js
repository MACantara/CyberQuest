import { BaseDirectory } from './base-directory.js';

export class EvidenceDirectory extends BaseDirectory {
    constructor() {
        super('/home/trainee/Evidence', 'Evidence', 'Investigation evidence files for The Hunt for The Null');
        this.initializeEvidenceFiles();
    }

    initializeEvidenceFiles() {
        this.items = [
            // Visible evidence files
            {
                type: 'file',
                name: 'bot_logs.txt',
                icon: 'bi-file-text',
                size: '2.4 KB',
                modified: '2024-08-01 14:35:22',
                suspicious: true,
                description: 'Bot network activity logs',
                permissions: 'r--r--r--',
                created: '2024-08-01 02:00:15'
            },
            {
                type: 'file', 
                name: 'email_headers.txt',
                icon: 'bi-envelope',
                size: '1.8 KB', 
                modified: '2024-08-02 09:15:33',
                suspicious: true,
                description: 'Email header analysis from phishing campaign',
                permissions: 'r--r--r--',
                created: '2024-08-02 02:00:32'
            },
            {
                type: 'file',
                name: 'malware_code.txt', 
                icon: 'bi-bug',
                size: '3.2 KB',
                modified: '2024-08-03 16:42:18',
                suspicious: true,
                description: 'Malware source code analysis',
                permissions: 'r--r--r--',
                created: '2024-08-03 02:15:45'
            },
            {
                type: 'file',
                name: 'login_logs.txt',
                icon: 'bi-shield-exclamation', 
                size: '4.1 KB',
                modified: '2024-08-04 11:28:07',
                suspicious: true,
                description: 'Failed login attempt records',
                permissions: 'r--r--r--',
                created: '2024-08-04 02:00:15'
            },
            // Hidden directory containing the final clue
            {
                type: 'directory',
                name: '.hidden',
                icon: 'bi-eye-slash',
                size: '--',
                modified: '2024-08-05 08:12:44',
                hidden: true,
                suspicious: true,
                description: 'Hidden directory (use ls -la to reveal)',
                permissions: 'drwxr-xr-x',
                created: '2024-08-05 02:30:12',
                items: [
                    {
                        type: 'file',
                        name: 'hidden_message.txt',
                        icon: 'bi-key',
                        size: '856 B',
                        modified: '2024-08-05 08:12:44', 
                        suspicious: true,
                        description: 'Base64 encoded message from The Null',
                        permissions: 'r--r--r--',
                        created: '2024-08-05 02:30:12'
                    }
                ]
            },
            // Additional case files for context
            {
                type: 'file',
                name: 'case_summary.txt',
                icon: 'bi-file-earmark-text',
                size: '1.2 KB',
                modified: '2024-08-05 10:00:00',
                description: 'Investigation case summary',
                permissions: 'r--r--r--',
                created: '2024-08-05 10:00:00'
            },
            {
                type: 'file',
                name: 'timeline.txt', 
                icon: 'bi-clock-history',
                size: '987 B',
                modified: '2024-08-05 10:15:00',
                description: 'Attack timeline reconstruction',
                permissions: 'r--r--r--',
                created: '2024-08-05 10:15:00'
            }
        ];
    }

    getSecurityLevel() {
        return 'high-priority-investigation';
    }

    getEvidenceFiles() {
        return this.items.filter(item => item.suspicious);
    }

    getHiddenItems() {
        return this.items.filter(item => item.hidden);
    }

    findEvidenceByPattern(pattern) {
        const regex = new RegExp(pattern, 'i');
        return this.items.filter(item => 
            regex.test(item.name) || 
            regex.test(item.description || '')
        );
    }

    getEvidenceStatistics() {
        return {
            totalFiles: this.items.filter(item => item.type === 'file').length,
            suspiciousFiles: this.items.filter(item => item.suspicious).length,
            hiddenItems: this.items.filter(item => item.hidden).length,
            totalSize: this.calculateTotalSize(),
            lastModified: this.getLastModifiedTime()
        };
    }

    calculateTotalSize() {
        return this.items
            .filter(item => item.type === 'file')
            .reduce((total, file) => {
                const sizeStr = file.size || '0 B';
                const sizeNum = parseFloat(sizeStr);
                const unit = sizeStr.split(' ')[1];
                
                let bytes = sizeNum;
                switch (unit) {
                    case 'KB': bytes *= 1024; break;
                    case 'MB': bytes *= 1024 * 1024; break;
                    case 'GB': bytes *= 1024 * 1024 * 1024; break;
                    case 'B': bytes = sizeNum; break;
                }
                
                return total + bytes;
            }, 0);
    }

    getLastModifiedTime() {
        const times = this.items
            .map(item => new Date(item.modified))
            .filter(date => !isNaN(date.getTime()));
        
        return times.length > 0 ? new Date(Math.max(...times)) : new Date();
    }
}
