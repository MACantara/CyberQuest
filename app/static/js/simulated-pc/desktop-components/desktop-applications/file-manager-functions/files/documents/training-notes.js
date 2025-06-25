import { BaseIndividualFile } from '../base-file.js';

export class TrainingNotesFile extends BaseIndividualFile {
    constructor() {
        super({
            name: 'training_notes.pdf',
            directoryPath: '/home/trainee/Documents',
            size: '2.1 MB',
            modified: '2024-12-19 16:30',
            suspicious: false,
            icon: 'bi-file-pdf',
            color: 'text-red-400'
        });
    }

    getContent() {
        return this.createTrainingContent(
            'training_notes.pdf',
            'This would be a PDF document containing training materials for identifying and responding to cyber threats.\n\nTopics covered:\n- Phishing identification\n- Malware detection\n- Incident response\n- Best practices',
            'training'
        );
    }
}
