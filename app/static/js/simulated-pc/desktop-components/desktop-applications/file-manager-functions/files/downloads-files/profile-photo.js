import { BaseIndividualFile } from '../base-file.js';

export class ProfilePhotoFile extends BaseIndividualFile {
    constructor() {
        super({
            name: 'profile_photo.jpg',
            directoryPath: '/home/trainee/Downloads',
            size: '850 KB',
            modified: '2024-12-19 14:20',
            suspicious: false,
            icon: 'bi-file-image',
            color: 'text-green-400'
        });
    }

    getContent() {
        return this.createTrainingContent(
            'profile_photo.jpg',
            'This would be a personal profile photograph.\n\nImage Details:\n- Resolution: 800x600\n- Color Depth: 24-bit\n- File Format: JPEG\n- Compression: 85% quality\n\nThis is a simulated image file for training purposes.',
            'image'
        );
    }
}
