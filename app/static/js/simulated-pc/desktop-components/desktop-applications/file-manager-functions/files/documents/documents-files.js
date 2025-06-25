import { BaseFile } from '../base-file.js';
import { SecurityReportFile } from './security-report.js';
import { TrainingNotesFile } from './training-notes.js';
import { IncidentReportFile } from './incident-report.js';

class DocumentsFileContentClass extends BaseFile {
    constructor() {
        super({
            directoryPath: '/home/trainee/Documents',
            directoryName: 'Documents'
        });
    }

    initializeFiles() {
        // Initialize individual files
        const securityReport = new SecurityReportFile();
        const trainingNotes = new TrainingNotesFile();
        const incidentReport = new IncidentReportFile();

        // Add files using their content
        this.addFile(securityReport.name, securityReport.getContent(), {
            size: securityReport.size,
            modified: securityReport.modified,
            suspicious: securityReport.suspicious
        });

        this.addFile(trainingNotes.name, trainingNotes.getContent(), {
            size: trainingNotes.size,
            modified: trainingNotes.modified,
            suspicious: trainingNotes.suspicious
        });

        this.addFile(incidentReport.name, incidentReport.getContent(), {
            size: incidentReport.size,
            modified: incidentReport.modified,
            suspicious: incidentReport.suspicious
        });
    }
}

// Export as file object for compatibility
export const DocumentsFileContents = new DocumentsFileContentClass().toFileObject();