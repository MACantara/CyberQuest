export class FileSystem {
    constructor() {
        this.files = {
            '/home/trainee': {
                type: 'directory',
                contents: {
                    'Documents': { type: 'directory', contents: {} },
                    'Downloads': { type: 'directory', contents: {} },
                    'Desktop': { type: 'directory', contents: {} },
                    'suspicious_file.txt': { 
                        type: 'file', 
                        content: 'WARNING: This file contains suspicious content!\nDo not execute or share this file.\nReport to security team immediately.',
                        suspicious: true,
                        size: 1337
                    },
                    'readme.txt': {
                        type: 'file',
                        content: 'Welcome to CyberQuest Training Environment!\n\nThis is a simulated terminal for cybersecurity training.\nExplore the file system and learn basic Linux commands.\n\nFor help, type: help',
                        size: 256
                    },
                    '.bashrc': {
                        type: 'file',
                        content: '# ~/.bashrc: executed by bash(1) for non-login shells.\nexport PATH=/usr/local/bin:/usr/bin:/bin\nPS1="\\u@\\h:\\w\\$ "',
                        size: 128,
                        hidden: true
                    }
                }
            },
            '/home/trainee/Documents': {
                type: 'directory',
                contents: {
                    'security_report.txt': {
                        type: 'file',
                        content: 'SECURITY INCIDENT REPORT\n========================\n\nDate: 2024-12-20\nIncident Type: Phishing Attempt\nStatus: Resolved\n\nA suspicious email was detected and quarantined.\nNo systems were compromised.',
                        size: 512
                    }
                }
            },
            '/home/trainee/Downloads': {
                type: 'directory',
                contents: {
                    'malware_sample.exe': {
                        type: 'file',
                        content: 'DANGER: This is a malware sample for training purposes only!\nDo not execute this file on a real system!',
                        suspicious: true,
                        size: 2048
                    }
                }
            }
        };
    }

    listDirectory(path, showHidden = false) {
        const dir = this.files[path];
        if (!dir || dir.type !== 'directory') {
            return [];
        }

        const items = [];
        
        // Add . and .. entries if showing hidden files
        if (showHidden) {
            items.push({ name: '.', type: 'directory' });
            if (path !== '/') {
                items.push({ name: '..', type: 'directory' });
            }
        }

        // Add directory contents
        for (const [name, item] of Object.entries(dir.contents)) {
            if (!showHidden && (item.hidden || name.startsWith('.'))) {
                continue;
            }
            
            items.push({
                name: name,
                type: item.type,
                size: item.size,
                suspicious: item.suspicious
            });
        }

        return items;
    }

    readFile(directory, filename) {
        const dir = this.files[directory];
        if (!dir || dir.type !== 'directory') {
            return null;
        }

        const file = dir.contents[filename];
        if (!file || file.type !== 'file') {
            return null;
        }

        return file.content;
    }

    directoryExists(path) {
        const dir = this.files[path];
        return dir && dir.type === 'directory';
    }

    resolvePath(currentPath, target) {
        if (target === '.') {
            return currentPath;
        }
        
        if (target === '..') {
            const parts = currentPath.split('/').filter(p => p);
            if (parts.length > 0) {
                parts.pop();
                return '/' + parts.join('/');
            }
            return '/';
        }

        if (target.startsWith('/')) {
            return target;
        }

        if (target.startsWith('~/')) {
            return '/home/trainee' + target.substring(1);
        }

        // Relative path
        if (currentPath === '/') {
            return '/' + target;
        }
        return currentPath + '/' + target;
    }
}
