export class BaseFile {
    constructor(config) {
        this.directoryPath = config.directoryPath;
        this.directoryName = config.directoryName;
        this.files = new Map();
        this.initializeFiles();
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

    // Create training file content template
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

    // Create log file template
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

    // Create security alert template
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
