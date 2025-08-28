import { BaseIndividualFile } from '../base-file.js';

export class InstallerDebFile extends BaseIndividualFile {
    constructor() {
        super({
            name: 'installer.deb',
            directoryPath: '/home/trainee/Downloads',
            size: '15.7 MB',
            modified: '2024-12-18 13:10',
            suspicious: false,
            icon: 'bi-file-zip',
            color: 'text-orange-400'
        });
    }

    getContent() {
        return this.createTrainingContent(
            'installer.deb',
            'This is a simulated .deb package file for training purposes.\n\nPackage Information:\n- Name: example-software\n- Version: 1.0.0\n- Architecture: amd64\n- Description: Example software package for cybersecurity training\n\nThis file would normally be installed using dpkg or apt.',
            'package'
        );
    }
}
