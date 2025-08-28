import { BaseDirectory } from './base-directory.js';
import { MalwareSampleFile } from '../files/downloads-files/malware-sample.js';
import { InstallerDebFile } from '../files/downloads-files/installer-deb.js';
import { ProfilePhotoFile } from '../files/downloads-files/profile-photo.js';
import { NetworkDiagramFile } from '../files/downloads-files/network-diagram.js';

class DownloadsDirectoryClass extends BaseDirectory {
    constructor() {
        super({
            path: '/home/trainee/Downloads',
            name: 'Downloads'
        });
    }

    initializeItems() {
        // Register individual files
        this.registerFile(new MalwareSampleFile());
        this.registerFile(new InstallerDebFile());
        this.registerFile(new ProfilePhotoFile());
        this.registerFile(new NetworkDiagramFile());
    }
}

// Export as directory object for compatibility
export const DownloadsDirectory = new DownloadsDirectoryClass().toDirectoryObject();
