import { BaseIndividualFile } from '../base-file.js';

export class IncidentReportFile extends BaseIndividualFile {
    constructor() {
        super({
            name: 'incident_report.log',
            directoryPath: '/home/trainee/Documents',
            size: '15.7 KB',
            modified: '2024-12-20 08:45',
            suspicious: false,
            icon: 'bi-journal-text',
            color: 'text-yellow-400'
        });
    }

    getContent() {
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

        return this.createLogTemplate('Incident Report', incidentEntries);
    }
}
