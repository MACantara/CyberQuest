import { BaseDirectory } from './base-directory.js';

class DocumentsDirectoryClass extends BaseDirectory {
    constructor() {
        super({
            path: '/home/trainee/Documents',
            name: 'Documents'
        });
    }

    initializeItems() {
        this.addFile({
            name: 'security_report.txt',
            color: 'text-yellow-400',
            size: '512 B',
            modified: '2024-12-20 11:45'
        });

        this.addFile({
            name: 'training_notes.pdf',
            size: '2.1 MB',
            modified: '2024-12-19 16:30'
        });

        this.addFile({
            name: 'incident_report.log',
            icon: 'bi-journal-text',
            color: 'text-yellow-400',
            size: '15.7 KB',
            modified: '2024-12-20 08:45'
        });
    }
}

// Export as directory object for compatibility
export const DocumentsDirectory = new DocumentsDirectoryClass().toDirectoryObject();
