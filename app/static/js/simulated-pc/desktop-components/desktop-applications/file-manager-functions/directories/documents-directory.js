import { BaseDirectory } from './base-directory.js';
import { SecurityReportFile } from '../files/documents/security-report.js';
import { TrainingNotesFile } from '../files/documents/training-notes.js';
import { IncidentReportFile } from '../files/documents/incident-report.js';

class DocumentsDirectoryClass extends BaseDirectory {
    constructor() {
        super({
            path: '/home/trainee/Documents',
            name: 'Documents'
        });
    }

    initializeItems() {
        // Register individual files
        this.registerFile(new SecurityReportFile());
        this.registerFile(new TrainingNotesFile());
        this.registerFile(new IncidentReportFile());
    }
}

// Export as directory object for compatibility
export const DocumentsDirectory = new DocumentsDirectoryClass().toDirectoryObject();
