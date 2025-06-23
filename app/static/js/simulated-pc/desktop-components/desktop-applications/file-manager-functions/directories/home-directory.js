import { BaseDirectory } from './base-directory.js';

class HomeDirectoryClass extends BaseDirectory {
    constructor() {
        super({
            path: '/home/trainee',
            name: 'trainee'
        });
    }

    initializeItems() {
        // Add subdirectories
        this.addDirectory({ name: 'Documents' });
        this.addDirectory({ name: 'Downloads' });
        this.addDirectory({ name: 'Desktop' });
        this.addDirectory({ name: 'Pictures' });
        this.addDirectory({ name: 'Logs', color: 'text-yellow-400' });

        // Add files with specific configurations
        this.addFile({
            name: 'suspicious_file.txt',
            suspicious: true,
            color: 'text-red-400',
            size: '1.3 KB',
            modified: '2024-12-20 10:31'
        });

        this.addFile({
            name: 'readme.txt',
            size: '256 B',
            modified: '2024-12-20 09:15'
        });

        this.addFile({
            name: '.bashrc',
            hidden: true,
            icon: 'bi-file-code',
            color: 'text-green-400',
            size: '128 B',
            modified: '2024-12-19 14:22'
        });

        this.addFile({
            name: 'security_audit.log',
            icon: 'bi-journal-text',
            color: 'text-yellow-400',
            size: '45.2 KB',
            modified: '2024-12-20 12:15'
        });

        this.addFile({
            name: 'system_screenshot.png',
            size: '2.1 MB',
            modified: '2024-12-20 11:30'
        });
    }
}

// Export as directory object for compatibility
export const HomeDirectory = new HomeDirectoryClass().toDirectoryObject();
