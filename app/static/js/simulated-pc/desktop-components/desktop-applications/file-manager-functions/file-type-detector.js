export class FileTypeDetector {
    static getFileType(fileName) {
        const ext = fileName.toLowerCase().split('.').pop();
        
        // Log files - check first since they're specific
        if (this.isLogFile(fileName)) {
            return 'log';
        }
        
        // Image files
        if (this.isImageFile(fileName)) {
            return 'image';
        }
        
        // PDF files
        if (ext === 'pdf') {
            return 'pdf';
        }
        
        // Executable files
        if (ext === 'exe' || ext === 'msi' || ext === 'dmg' || ext === 'app') {
            return 'executable';
        }
        
        // Text-based files
        if (this.isTextFile(fileName)) {
            return 'text';
        }
        
        // Archive files
        if (this.isArchiveFile(fileName)) {
            return 'archive';
        }
        
        // Default to text
        return 'text';
    }
    
    static isImageFile(fileName) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp', '.tiff', '.ico'];
        return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
    }
    
    static isLogFile(fileName) {
        const logExtensions = ['.log'];
        const logPatterns = ['access', 'error', 'system', 'security', 'auth', 'firewall', 'audit', 'incident', 'debug', 'traffic'];
        
        // Check file extension first
        if (logExtensions.some(ext => fileName.toLowerCase().endsWith(ext))) {
            return true;
        }
        
        return false;
    }
    
    static isTextFile(fileName) {
        const textExtensions = [
            '.txt', '.md', '.json', '.xml', '.html', '.css', '.js', '.py', 
            '.java', '.cpp', '.c', '.h', '.sh', '.conf', '.cfg', '.ini',
            '.bashrc', '.yml', '.yaml', '.toml'
        ];
        
        return textExtensions.some(ext => fileName.toLowerCase().endsWith(ext)) ||
               fileName.toLowerCase().includes('bashrc') ||
               fileName.toLowerCase().includes('readme');
    }
    
    static isArchiveFile(fileName) {
        const archiveExtensions = ['.zip', '.rar', '.tar', '.gz', '.7z', '.deb', '.rpm'];
        return archiveExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
    }
    
    static getFileCategory(fileName) {
        const type = this.getFileType(fileName);
        
        const categories = {
            'image': 'Media',
            'pdf': 'Document',
            'executable': 'Application',
            'log': 'System',
            'text': 'Document',
            'archive': 'Archive'
        };
        
        return categories[type] || 'Unknown';
    }
    
    static isSuspiciousType(fileName, fileData) {
        // Check if file is marked as suspicious
        if (fileData.suspicious) {
            return true;
        }
        
        // Check for suspicious patterns
        const suspiciousPatterns = [
            /malware/i,
            /virus/i,
            /trojan/i,
            /suspicious/i,
            /phishing/i,
            /scam/i
        ];
        
        return suspiciousPatterns.some(pattern => pattern.test(fileName));
    }
    
    static getSecurityRisk(fileName, fileData) {
        if (this.isSuspiciousType(fileName, fileData)) {
            return 'high';
        }
        
        const type = this.getFileType(fileName);
        
        switch (type) {
            case 'executable':
                return 'medium';
            case 'archive':
                return 'medium';
            case 'log':
                return fileName.toLowerCase().includes('security') ? 'medium' : 'low';
            default:
                return 'low';
        }
    }
    
    // New method to get the appropriate application for opening files
    static getDefaultApplication(fileName, fileData) {
        const type = this.getFileType(fileName);
        
        switch (type) {
            case 'log':
                return 'log-viewer';
            case 'image':
                return 'image-viewer';
            case 'pdf':
                return 'pdf-viewer';
            case 'text':
                return 'text-editor';
            case 'executable':
                return 'executable-runner';
            case 'archive':
                return 'archive-manager';
            default:
                return 'text-editor';
        }
    }
    
    // Method to get application class for file
    static getApplicationClass(fileName, fileData) {
        const defaultApp = this.getDefaultApplication(fileName, fileData);
        
        const appClasses = {
            'log-viewer': 'LogViewerApp',
            'image-viewer': 'ImageViewerApp',
            'pdf-viewer': 'PdfViewerApp', 
            'text-editor': 'TextEditorApp',
            'executable-runner': 'ExecutableRunnerApp',
            'archive-manager': 'ArchiveManagerApp'
        };
        
        return appClasses[defaultApp] || 'TextEditorApp';
    }
    
    // Method to get application import path
    static getApplicationImportPath(fileName, fileData) {
        const defaultApp = this.getDefaultApplication(fileName, fileData);
        
        const appPaths = {
            'log-viewer': '../file-viewer-apps/log-viewer-app.js',
            'image-viewer': '../file-viewer-apps/image-viewer-app.js',
            'pdf-viewer': '../file-viewer-apps/pdf-viewer-app.js',
            'text-editor': '../file-viewer-apps/text-editor-app.js',
            'executable-runner': '../file-viewer-apps/executable-runner-app.js',
            'archive-manager': '../file-viewer-apps/archive-manager-app.js'
        };
        
        return appPaths[defaultApp] || '../file-viewer-apps/text-editor-app.js';
    }
    
    // Check if file should be opened with log viewer
    static shouldUseLogViewer(fileName) {
        return this.isLogFile(fileName);
    }
    
    // Get specific log file patterns for better detection
    static getLogFilePatterns() {
        return [
            'system_access.log',
            'security_events.log', 
            'firewall_blocks.log',
            'auth_failures.log',
            'application_debug.log',
            'network_traffic.log',
            'security_audit.log',
            'incident_report.log'
        ];
    }
    
    // Enhanced log file detection for specific files
    static isSpecificLogFile(fileName) {
        const patterns = this.getLogFilePatterns();
        return patterns.some(pattern => fileName.toLowerCase() === pattern.toLowerCase());
    }
}
