import { BaseFile } from '../base-file.js';
import { MalwareSampleFile } from './malware-sample.js';
import { InstallerDebFile } from './installer-deb.js';
import { ProfilePhotoFile } from './profile-photo.js';
import { NetworkDiagramFile } from './network-diagram.js';

class DownloadsFileContentClass extends BaseFile {
    constructor() {
        super({
            directoryPath: '/home/trainee/Downloads',
            directoryName: 'Downloads'
        });
    }

    initializeFiles() {
        // Initialize individual files
        const malwareSample = new MalwareSampleFile();
        const installerDeb = new InstallerDebFile();
        const profilePhoto = new ProfilePhotoFile();
        const networkDiagram = new NetworkDiagramFile();

        // Add files using their content
        this.addFile(malwareSample.name, malwareSample.getContent(), {
            size: malwareSample.size,
            modified: malwareSample.modified,
            suspicious: malwareSample.suspicious
        });

        this.addFile(installerDeb.name, installerDeb.getContent(), {
            size: installerDeb.size,
            modified: installerDeb.modified,
            suspicious: installerDeb.suspicious
        });

        this.addFile(profilePhoto.name, profilePhoto.getContent(), {
            size: profilePhoto.size,
            modified: profilePhoto.modified,
            suspicious: profilePhoto.suspicious
        });

        this.addFile(networkDiagram.name, networkDiagram.getContent(), {
            size: networkDiagram.size,
            modified: networkDiagram.modified,
            suspicious: networkDiagram.suspicious
        });
    }
}

// Export as file object for compatibility
export const DownloadsFileContents = new DownloadsFileContentClass().toFileObject();