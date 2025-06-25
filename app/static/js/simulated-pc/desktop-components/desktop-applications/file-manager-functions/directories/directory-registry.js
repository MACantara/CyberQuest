import { HomeDirectory } from './home-directory.js';
import { DocumentsDirectory } from './documents-directory.js';
import { DownloadsDirectory } from './downloads-directory.js';
import { DesktopDirectory } from './desktop-directory.js';
import { PicturesDirectory } from './pictures-directory.js';
import { LogsDirectory } from './logs-directory.js';

import { HomeFileContents } from '../files/home/home-files.js';
import { DocumentsFileContents } from '../files/documents/documents-files.js';
import { DownloadsFileContents } from '../files/downloads/downloads-files.js';
import { LogsFileContents } from '../files/logs/logs-files.js';

export class DirectoryRegistry {
    constructor() {
        this.directories = new Map();
        this.fileContents = new Map();
        this.directoryClasses = new Map(); // Store class instances
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

    // Enhanced method to get directory with metadata
    getDirectoryWithMetadata(path) {
        const directory = this.getDirectory(path);
        if (!directory) return null;

        return {
            ...directory,
            statistics: this.calculateDirectoryStats(directory),
            securityInfo: this.analyzeDirectorySecurity(directory)
        };
    }

    calculateDirectoryStats(directory) {
        if (!directory.items) return null;

        return {
            totalItems: directory.items.length,
            files: directory.items.filter(item => item.type === 'file').length,
            directories: directory.items.filter(item => item.type === 'directory').length,
            suspiciousItems: directory.items.filter(item => item.suspicious).length,
            hiddenItems: directory.items.filter(item => item.hidden).length,
            totalSize: this.calculateTotalSize(directory.items.filter(item => item.type === 'file'))
        };
    }

    analyzeDirectorySecurity(directory) {
        if (!directory.items) return { level: 'unknown', threats: [] };

        const threats = [];
        const suspiciousFiles = directory.items.filter(item => item.suspicious);
        
        if (suspiciousFiles.length > 0) {
            threats.push({
                type: 'suspicious_files',
                count: suspiciousFiles.length,
                files: suspiciousFiles.map(f => f.name)
            });
        }

        const executableFiles = directory.items.filter(item => 
            item.name.toLowerCase().endsWith('.exe')
        );
        
        if (executableFiles.length > 0) {
            threats.push({
                type: 'executable_files',
                count: executableFiles.length,
                files: executableFiles.map(f => f.name)
            });
        }

        const securityLevel = threats.length === 0 ? 'safe' : 
                             threats.length <= 2 ? 'medium' : 'high';

        return {
            level: securityLevel,
            threats: threats,
            recommendation: this.getSecurityRecommendation(securityLevel, threats)
        };
    }

    getSecurityRecommendation(level, threats) {
        switch (level) {
            case 'safe':
                return 'Directory appears secure. Continue monitoring.';
            case 'medium':
                return 'Some security concerns detected. Review suspicious files.';
            case 'high':
                return 'Multiple security threats detected. Immediate investigation required.';
            default:
                return 'Security status unknown. Manual review recommended.';
        }
    }

    calculateTotalSize(files) {
        // Simplified size calculation for training purposes
        return files.reduce((total, file) => {
            const sizeStr = file.size || '0 B';
            const sizeNum = parseFloat(sizeStr);
            const unit = sizeStr.split(' ')[1];
            
            let bytes = sizeNum;
            switch (unit) {
                case 'KB': bytes *= 1024; break;
                case 'MB': bytes *= 1024 * 1024; break;
                case 'GB': bytes *= 1024 * 1024 * 1024; break;
            }
            
            return total + bytes;
        }, 0);
    }

    // Enhanced search across all directories
    searchAllDirectories(query, options = {}) {
        const results = [];
        const searchOptions = {
            includeContent: options.includeContent || false,
            caseSensitive: options.caseSensitive || false,
            fileTypesOnly: options.fileTypesOnly || null,
            ...options
        };

        this.directories.forEach((directory, path) => {
            if (directory.items) {
                const matches = this.searchInDirectory(directory, query, searchOptions);
                if (matches.length > 0) {
                    results.push({
                        path: path,
                        directory: directory.name,
                        matches: matches
                    });
                }
            }
        });

        return results;
    }

    searchInDirectory(directory, query, options) {
        const searchQuery = options.caseSensitive ? query : query.toLowerCase();
        
        return directory.items.filter(item => {
            const itemName = options.caseSensitive ? item.name : item.name.toLowerCase();
            
            // Filter by file type if specified
            if (options.fileTypesOnly && !options.fileTypesOnly.includes(item.type)) {
                return false;
            }
            
            // Search in filename
            if (itemName.includes(searchQuery)) {
                return true;
            }
            
            // Search in file content if enabled
            if (options.includeContent && item.type === 'file') {
                const content = this.getFileContent(directory.path, item.name);
                if (content) {
                    const searchContent = options.caseSensitive ? content : content.toLowerCase();
                    return searchContent.includes(searchQuery);
                }
            }
            
            return false;
        });
    }
}
