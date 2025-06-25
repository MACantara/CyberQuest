import { BaseFile } from '../base-file.js';
import { SuspiciousFile } from './suspicious-file.js';
import { ReadmeFile } from './readme-file.js';
import { BashrcFile } from './bashrc-file.js';
import { SecurityAuditFile } from './security-audit.js';
import { SystemScreenshotFile } from './system-screenshot.js';

class HomeFileContentClass extends BaseFile {
    constructor() {
        super({
            directoryPath: '/home/trainee',
            directoryName: 'Home'
        });
    }

    initializeFiles() {
        // Initialize individual files
        const suspiciousFile = new SuspiciousFile();
        const readmeFile = new ReadmeFile();
        const bashrcFile = new BashrcFile();
        const securityAudit = new SecurityAuditFile();
        const systemScreenshot = new SystemScreenshotFile();

        // Add files using their content
        this.addFile(suspiciousFile.name, suspiciousFile.getContent(), {
            size: suspiciousFile.size,
            modified: suspiciousFile.modified,
            suspicious: suspiciousFile.suspicious
        });

        this.addFile(readmeFile.name, readmeFile.getContent(), {
            size: readmeFile.size,
            modified: readmeFile.modified,
            suspicious: readmeFile.suspicious
        });

        this.addFile(bashrcFile.name, bashrcFile.getContent(), {
            size: bashrcFile.size,
            modified: bashrcFile.modified,
            suspicious: bashrcFile.suspicious,
            hidden: bashrcFile.hidden
        });

        this.addFile(securityAudit.name, securityAudit.getContent(), {
            size: securityAudit.size,
            modified: securityAudit.modified,
            suspicious: securityAudit.suspicious
        });

        this.addFile(systemScreenshot.name, systemScreenshot.getContent(), {
            size: systemScreenshot.size,
            modified: systemScreenshot.modified,
            suspicious: systemScreenshot.suspicious
        });
    }
}

// Export as file object for compatibility
export const HomeFileContents = new HomeFileContentClass().toFileObject();