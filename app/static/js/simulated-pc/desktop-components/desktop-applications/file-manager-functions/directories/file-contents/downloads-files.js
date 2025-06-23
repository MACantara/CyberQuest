import { BaseFileContent } from './base-file-content.js';

class DownloadsFileContentClass extends BaseFileContent {
    constructor() {
        super({
            directoryPath: '/home/trainee/Downloads',
            directoryName: 'Downloads'
        });
    }

    initializeFiles() {
        // Malware sample (training)
        this.addFile('malware_sample.exe',
            this.createSecurityAlert(
                'Malware Sample',
                'Critical',
                'DANGER: This is a malware sample for training purposes only!\n\nDo not execute this file on a real system!\n\nThis file is used to demonstrate:\n- How malware appears in file systems\n- Identification of suspicious executables\n- Proper handling procedures'
            ),
            { suspicious: true, size: '2.0 KB', modified: '2024-12-20 08:22' }
        );

        // Debian package
        this.addFile('installer.deb',
            this.createTrainingContent(
                'installer.deb',
                'This is a simulated .deb package file for training purposes.\n\nPackage Information:\n- Name: example-software\n- Version: 1.0.0\n- Architecture: amd64\n- Description: Example software package for cybersecurity training\n\nThis file would normally be installed using dpkg or apt.',
                'package'
            ),
            { size: '15.7 MB', modified: '2024-12-18 13:10' }
        );

        // Profile photo
        this.addFile('profile_photo.jpg',
            this.createTrainingContent(
                'profile_photo.jpg',
                'This would be a personal profile photograph.\n\nImage Details:\n- Resolution: 800x600\n- Color Depth: 24-bit\n- File Format: JPEG\n- Compression: 85% quality\n\nThis is a simulated image file for training purposes.',
                'image'
            ),
            { size: '850 KB', modified: '2024-12-19 14:20' }
        );

        // Network diagram
        this.addFile('network_diagram.png',
            this.createTrainingContent(
                'network_diagram.png',
                'This would be a technical diagram showing network infrastructure.\n\nDiagram Details:\n- Shows network architecture\n- Includes routers, switches, and endpoints\n- Color-coded by security zones\n- Contains IP address ranges\n\nThis is a simulated technical diagram for training purposes.',
                'technical'
            ),
            { size: '1.2 MB', modified: '2024-12-18 16:45' }
        );
    }
}

// Export as file object for compatibility
export const DownloadsFileContents = new DownloadsFileContentClass().toFileObject();
