import { BaseDirectory } from './base-directory.js';

class PicturesDirectoryClass extends BaseDirectory {
    constructor() {
        super({
            path: '/home/trainee/Pictures',
            name: 'Pictures'
        });
    }

    initializeItems() {
        // Add basic image files (these don't need individual file classes)
        this.addFile({
            name: 'conference_2024.jpg',
            size: '3.2 MB',
            modified: '2024-12-15 10:30'
        });

        this.addFile({
            name: 'team_meeting.png',
            size: '1.8 MB',
            modified: '2024-12-10 14:15'
        });

        this.addFile({
            name: 'security_awareness.gif',
            size: '2.5 MB',
            modified: '2024-12-05 11:22'
        });

        this.addFile({
            name: 'vacation_photo.jpg',
            size: '4.1 MB',
            modified: '2024-11-28 16:45'
        });

        this.addFile({
            name: 'network_topology.svg',
            size: '125 KB',
            modified: '2024-12-12 09:30'
        });

        this.addFile({
            name: 'suspicious_attachment.jpg',
            color: 'text-red-400',
            suspicious: true,
            size: '45 KB',
            modified: '2024-12-20 13:45'
        });
    }
}

// Export as directory object for compatibility
export const PicturesDirectory = new PicturesDirectoryClass().toDirectoryObject();
