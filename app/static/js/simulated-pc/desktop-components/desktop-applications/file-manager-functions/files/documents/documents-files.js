import { BaseFile } from '../base-file.js';

class DocumentsFileContentClass extends BaseFile {
    constructor() {
        super({
            directoryPath: '/home/trainee/Documents',
            directoryName: 'Documents'
        });
    }

    initializeFiles() {
        // Security report
        this.addFile('security_report.txt', 
            this.createSecurityAlert(
                'Phishing Attempt',
                'Medium',
                'A suspicious email was detected and quarantined.\nNo systems were compromised.\n\nRecommendations:\n- Continue employee training\n- Update email filters\n- Monitor for similar attempts'
            ),
            { suspicious: false, modified: '2024-12-20 11:45' }
        );

        // Training notes PDF
        this.addFile('training_notes.pdf',
            this.createTrainingContent(
                'training_notes.pdf',
                'This would be a PDF document containing training materials for identifying and responding to cyber threats.\n\nTopics covered:\n- Phishing identification\n- Malware detection\n- Incident response\n- Best practices',
                'training'
            ),
            { size: '2.1 MB', modified: '2024-12-19 16:30' }
        );

        // Incident report log
        const incidentEntries = [
            { timestamp: '2024-12-20 08:45:01', level: 'INCIDENT-001', message: 'Phishing email campaign detected' },
            { timestamp: '2024-12-20 08:45:02', level: 'DETAILS', message: 'Source: external-sender@suspicious-domain.com' },
            { timestamp: '2024-12-20 08:45:03', level: 'DETAILS', message: 'Subject: "Urgent: Account Verification Required"' },
            { timestamp: '2024-12-20 08:45:04', level: 'DETAILS', message: 'Recipients: 15 users affected' },
            { timestamp: '2024-12-20 08:45:05', level: 'ACTIONS', message: 'Email quarantined automatically' },
            { timestamp: '2024-12-20 08:45:06', level: 'ACTIONS', message: 'Users notified of phishing attempt' },
            { timestamp: '2024-12-20 08:45:07', level: 'ACTIONS', message: 'Sender domain added to blacklist' },
            { timestamp: '2024-12-20 08:45:08', level: 'STATUS', message: 'Incident contained and resolved' },
            { timestamp: '2024-12-20 08:45:09', level: 'FOLLOW-UP', message: 'Additional security awareness training scheduled' }
        ];

        this.addFile('incident_report.log',
            this.createLogTemplate('Incident Report', incidentEntries),
            { size: '15.7 KB', modified: '2024-12-20 08:45' }
        );
    }
}

// Export as file object for compatibility
export const DocumentsFileContents = new DocumentsFileContentClass().toFileObject();