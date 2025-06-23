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
            'malware_sample.exe': '[BINARY FILE - TRAINING SAMPLE]\n\nDANGER: This is a malware sample for training purposes only!\n\nDo not execute this file on a real system!\n\nThis file is used to demonstrate:\n- How malware appears in file systems\n- Identification of suspicious executables\n- Proper handling procedures'
        };
        
        return fileContents[fileName] || `Content of ${fileName}\n\nThis is a simulated file for training purposes.`;
    }
}
