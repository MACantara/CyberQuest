export class BaseFile {
    constructor(config) {
        this.directoryPath = config.directoryPath;
        this.directoryName = config.directoryName;
        this.files = new Map();
        if (this.initializeFiles) {
            this.initializeFiles();
        }
    }

    // Abstract method - must be implemented by subclasses
    initializeFiles() {
        throw new Error('initializeFiles() must be implemented by subclasses');
    }

    // Add a file with content
    addFile(fileName, content, metadata = {}) {
        this.files.set(fileName, {
            content: content,
            metadata: {
                type: this.getFileType(fileName),
                size: this.calculateSize(content),
                created: metadata.created || new Date().toISOString(),
                modified: metadata.modified || new Date().toISOString(),
                suspicious: metadata.suspicious || false,
                ...metadata
            }
        });
    }

    // Get file content
    getFileContent(fileName) {
        const file = this.files.get(fileName);
        return file ? file.content : null;
    }

    // Get file metadata
    getFileMetadata(fileName) {
        const file = this.files.get(fileName);
        return file ? file.metadata : null;
    }

    // Get all files as object (for compatibility)
    toFileObject() {
        const fileObject = {};
        this.files.forEach((file, fileName) => {
            fileObject[fileName] = file.content;
        });
        return fileObject;
    }

    // Get all files with metadata
    getAllFiles() {
        return Array.from(this.files.entries()).map(([fileName, file]) => ({
            name: fileName,
            content: file.content,
            ...file.metadata
        }));
    }

    // Helper method to determine file type
    getFileType(fileName) {
        const ext = fileName.toLowerCase().split('.').pop();
        const typeMap = {
            'txt': 'text',
            'log': 'log',
            'pdf': 'pdf',
            'exe': 'executable',
            'deb': 'package',
            'jpg': 'image',
            'png': 'image',
            'gif': 'image',
            'svg': 'image',
            'lnk': 'shortcut',
            'bashrc': 'config'
        };
        return typeMap[ext] || 'unknown';
    }

    // Calculate file size
    calculateSize(content) {
        if (typeof content === 'string') {
            const bytes = new Blob([content]).size;
            if (bytes < 1024) return `${bytes} B`;
            if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
            return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
        }
        return 'Unknown size';
    }
}

// New base class for individual files
export class BaseIndividualFile {
    constructor(config) {
        this.name = config.name;
        this.directoryPath = config.directoryPath;
        this.size = config.size || '0 B';
        this.modified = config.modified || new Date().toISOString().slice(0, 16).replace('T', ' ');
        this.suspicious = config.suspicious || false;
        this.hidden = config.hidden || false;
        this.permissions = config.permissions || 'rw-r--r--';
        this.metadata = config.metadata || {};
        this.icon = config.icon || this.getFileIcon(config.name);
        this.color = config.color || this.getFileColor(config.name);
    }

    // Abstract method - must be implemented by subclasses
    getContent() {
        throw new Error('getContent() must be implemented by subclasses');
    }

    // Get file icon based on extension
    getFileIcon(fileName) {
        const ext = fileName.toLowerCase().split('.').pop();
        const iconMap = {
            'txt': 'bi-file-text',
            'log': 'bi-journal-text',
            'pdf': 'bi-file-pdf',
            'exe': 'bi-file-binary',
            'deb': 'bi-file-zip',
            'jpg': 'bi-file-image',
            'png': 'bi-file-image',
            'gif': 'bi-file-image',
            'svg': 'bi-file-image',
            'lnk': 'bi-link-45deg',
            'bashrc': 'bi-file-code'
        };
        return iconMap[ext] || 'bi-file';
    }

    // Get file color based on type
    getFileColor(fileName) {
        const ext = fileName.toLowerCase().split('.').pop();
        const colorMap = {
            'txt': 'text-gray-400',
            'log': 'text-yellow-400',
            'pdf': 'text-red-400',
            'exe': 'text-red-500',
            'deb': 'text-orange-400',
            'jpg': 'text-green-400',
            'png': 'text-green-400',
            'gif': 'text-green-400',
            'svg': 'text-green-400',
            'lnk': 'text-blue-400',
            'bashrc': 'text-green-400'
        };
        return colorMap[ext] || 'text-gray-400';
    }

    // Helper methods for content creation
    createTrainingContent(fileName, description, category = 'general') {
        return `CYBERQUEST TRAINING FILE
========================

File: ${fileName}
Category: ${category}
Location: ${this.directoryPath}

Description:
${description}

This is a simulated file for cybersecurity training purposes.
It demonstrates how files appear in real file systems and helps
trainees learn to identify different types of content.

Training Objectives:
- File system navigation
- Content analysis
- Security assessment
- Incident response procedures

For questions about this training material, contact:
support@cyberquest.com
`;
    }

    createLogTemplate(logType, entries) {
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        let content = `# ${logType.toUpperCase()} LOG FILE\n`;
        content += `# Generated: ${timestamp}\n`;
        content += `# Location: ${this.directoryPath}\n\n`;
        
        entries.forEach(entry => {
            content += `${entry.timestamp} [${entry.level}] ${entry.message}\n`;
        });
        
        return content;
    }

    createSecurityAlert(alertType, severity, description) {
        return `SECURITY ALERT - ${alertType.toUpperCase()}
${'='.repeat(50)}

Severity: ${severity}
Timestamp: ${new Date().toISOString()}
Location: ${this.directoryPath}

Alert Description:
${description}

This alert is part of the CyberQuest training simulation.
In a real environment, this would require immediate attention
from the security team.

Recommended Actions:
1. Analyze the alert details
2. Investigate potential threats
3. Document findings
4. Report to security team
5. Follow incident response procedures

TRAINING SIMULATION - NOT A REAL THREAT
`;
    }
}
