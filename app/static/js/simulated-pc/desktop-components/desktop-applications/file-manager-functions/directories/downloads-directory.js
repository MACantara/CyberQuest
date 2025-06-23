import { BaseDirectory } from './base-directory.js';

class DownloadsDirectoryClass extends BaseDirectory {
    constructor() {
        super({
            path: '/home/trainee/Downloads',
            name: 'Downloads'
        });
    }

    initializeItems() {
        this.addFile({
            name: 'malware_sample.exe',
            suspicious: true,
            size: '2.0 KB',
            modified: '2024-12-20 08:22'
        });

        this.addFile({
            name: 'installer.deb',
            icon: 'bi-file-zip',
            color: 'text-orange-400',
            size: '15.7 MB',
            modified: '2024-12-18 13:10'
        });

        this.addFile({
            name: 'profile_photo.jpg',
            size: '850 KB',
            modified: '2024-12-19 14:20'
        });

        this.addFile({
            name: 'network_diagram.png',
            size: '1.2 MB',
            modified: '2024-12-18 16:45'
        });
    }
}

// Export as directory object for compatibility
export const DownloadsDirectory = new DownloadsDirectoryClass().toDirectoryObject();
