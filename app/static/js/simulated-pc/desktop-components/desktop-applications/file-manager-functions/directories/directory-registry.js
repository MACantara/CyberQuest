import { HomeDirectory } from './home-directory.js';
import { DocumentsDirectory } from './documents-directory.js';
import { DownloadsDirectory } from './downloads-directory.js';
import { DesktopDirectory } from './desktop-directory.js';
import { PicturesDirectory } from './pictures-directory.js';
import { LogsDirectory } from './logs-directory.js';

import { HomeFileContents } from './file-contents/home-files.js';
import { DocumentsFileContents } from './file-contents/documents-files.js';
import { DownloadsFileContents } from './file-contents/downloads-files.js';
import { LogsFileContents } from './file-contents/logs-files.js';

export class DirectoryRegistry {
    constructor() {
        this.directories = new Map();
        this.fileContents = new Map();
        this.initializeDirectories();
        this.initializeFileContents();
    }

    initializeDirectories() {
        // Register all directories
        this.directories.set('/home/trainee', HomeDirectory);
        this.directories.set('/home/trainee/Documents', DocumentsDirectory);
        this.directories.set('/home/trainee/Downloads', DownloadsDirectory);
        this.directories.set('/home/trainee/Desktop', DesktopDirectory);
        this.directories.set('/home/trainee/Pictures', PicturesDirectory);
        this.directories.set('/home/trainee/Logs', LogsDirectory);
    }

    initializeFileContents() {
        // Register all file contents by directory
        this.fileContents.set('/home/trainee', HomeFileContents);
        this.fileContents.set('/home/trainee/Documents', DocumentsFileContents);
        this.fileContents.set('/home/trainee/Downloads', DownloadsFileContents);
        this.fileContents.set('/home/trainee/Logs', LogsFileContents);
    }

    getDirectory(path) {
        return this.directories.get(path);
    }

    getFileContent(path, fileName) {
        const directoryContents = this.fileContents.get(path);
        if (directoryContents && directoryContents[fileName]) {
            return directoryContents[fileName];
        }
        
        // Return a default content for files without specific content
        return `Content of ${fileName}\n\nThis is a simulated file for training purposes.\n\nFile Information:\n- Location: ${path}/${fileName}\n- Type: Training simulation file\n- Purpose: Cybersecurity education\n\nThis file demonstrates how files appear in a real file system.`;
    }

    getAllDirectories() {
        return Array.from(this.directories.keys());
    }

    addDirectory(path, directoryConfig) {
        this.directories.set(path, directoryConfig);
    }

    addFileContents(path, fileContents) {
        const existing = this.fileContents.get(path) || {};
        this.fileContents.set(path, { ...existing, ...fileContents });
    }

    removeDirectory(path) {
        this.directories.delete(path);
        this.fileContents.delete(path);
    }

    getDirectoryStatistics() {
        const stats = {
            totalDirectories: this.directories.size,
            totalFileContents: 0,
            directories: []
        };

        this.directories.forEach((dir, path) => {
            const fileCount = dir.items ? dir.items.filter(item => item.type === 'file').length : 0;
            const dirCount = dir.items ? dir.items.filter(item => item.type === 'directory').length : 0;
            const contentsCount = this.fileContents.get(path) ? Object.keys(this.fileContents.get(path)).length : 0;
            
            stats.totalFileContents += contentsCount;
            stats.directories.push({
                path,
                name: dir.name,
                files: fileCount,
                subdirectories: dirCount,
                contentFiles: contentsCount
            });
        });

        return stats;
    }
}
