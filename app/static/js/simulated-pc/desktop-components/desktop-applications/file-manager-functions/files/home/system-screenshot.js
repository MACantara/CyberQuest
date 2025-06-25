import { BaseIndividualFile } from '../base-file.js';

export class SystemScreenshotFile extends BaseIndividualFile {
    constructor() {
        super({
            name: 'system_screenshot.png',
            directoryPath: '/home/trainee',
            size: '2.1 MB',
            modified: '2024-12-20 11:30',
            suspicious: false
        });
    }

    getContent() {
        return this.createTrainingContent(
            'system_screenshot.png',
            'This would be a screenshot of the system desktop showing various applications and files.\n\nImage Details:\n- Resolution: 1920x1080\n- Color Depth: 32-bit\n- Captured: 2024-12-20 11:30\n\nThis is a simulated image file for training purposes.',
            'image'
        );
    }
}
