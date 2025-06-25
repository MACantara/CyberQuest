import { BaseDirectory } from './base-directory.js';
import { SuspiciousFile } from '../files/home/suspicious-file.js';
import { ReadmeFile } from '../files/home/readme-file.js';
import { BashrcFile } from '../files/home/bashrc-file.js';
import { SecurityAuditFile } from '../files/home/security-audit.js';
import { SystemScreenshotFile } from '../files/home/system-screenshot.js';

class HomeDirectoryClass extends BaseDirectory {
    constructor() {
        super({
            path: '/home/trainee',
            name: 'trainee'
        });
    }

    initializeItems() {
        // Add subdirectories
        this.addDirectory({ name: 'Documents' });
        this.addDirectory({ name: 'Downloads' });
        this.addDirectory({ name: 'Desktop' });
        this.addDirectory({ name: 'Pictures' });
        this.addDirectory({ name: 'Logs', color: 'text-yellow-400' });

        // Register individual files
        this.registerFile(new SuspiciousFile());
        this.registerFile(new ReadmeFile());
        this.registerFile(new BashrcFile());
        this.registerFile(new SecurityAuditFile());
        this.registerFile(new SystemScreenshotFile());
    }
}

// Export as directory object for compatibility
export const HomeDirectory = new HomeDirectoryClass().toDirectoryObject();
