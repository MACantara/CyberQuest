import { BaseFile } from '../base-file.js';

export class SecurityReportFile extends BaseFile {
    constructor() {
        super({
            name: 'security_report.txt',
            directoryPath: '/home/trainee/Documents',
            size: '3.2 KB',
            modified: '2024-12-20 11:45',
            suspicious: false
        });
    }

    getContent() {
        return this.createSecurityAlert(
            'Phishing Attempt',
            'Medium',
            'A suspicious email was detected and quarantined.\nNo systems were compromised.\n\nRecommendations:\n- Continue employee training\n- Update email filters\n- Monitor for similar attempts'
        );
    }
}
