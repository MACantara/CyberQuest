import { BaseDirectory } from './base-directory.js';

class DesktopDirectoryClass extends BaseDirectory {
    constructor() {
        super({
            path: '/home/trainee/Desktop',
            name: 'Desktop'
        });
    }

    initializeItems() {
        // Add basic shortcut file (doesn't need individual file class)
        this.addFile({
            name: 'CyberQuest.lnk',
            icon: 'bi-link-45deg',
            color: 'text-blue-400',
            size: '1 KB',
            modified: '2024-12-20 09:00',
            metadata: {
                target: 'https://cyberquest.com',
                description: 'Shortcut to CyberQuest Training Platform'
            }
        });
    }
}

// Export as directory object for compatibility
export const DesktopDirectory = new DesktopDirectoryClass().toDirectoryObject();
