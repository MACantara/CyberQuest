import { BaseIndividualFile } from '../base-file.js';

export class SuspiciousFile extends BaseIndividualFile {
    constructor() {
        super({
            name: 'suspicious_file.txt',
            directoryPath: '/home/trainee',
            size: '1.3 KB',
            modified: '2024-12-20 10:31',
            suspicious: true
        });
    }

    getContent() {
        return this.createSecurityAlert(
            'Suspicious Content',
            'High',
            'WARNING: This file contains suspicious content!\nDo not execute or share this file.\nReport to security team immediately.'
        );
    }
}
