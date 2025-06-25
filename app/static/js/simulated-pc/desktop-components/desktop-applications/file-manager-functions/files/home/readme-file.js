import { BaseFile } from '../base-file.js';

export class ReadmeFile extends BaseFile {
    constructor() {
        super({
            name: 'readme.txt',
            directoryPath: '/home/trainee',
            size: '256 B',
            modified: '2024-12-20 09:15',
            suspicious: false
        });
    }

    getContent() {
        return this.createTrainingContent(
            'readme.txt',
            'Welcome to CyberQuest Training Environment!\n\nThis is a simulated file system for cybersecurity training.\nExplore the directories and learn to identify suspicious files.\n\nFor help, contact support@cyberquest.com',
            'welcome'
        );
    }
}
