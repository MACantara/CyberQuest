export class FileTypeDetector {
    static getFileType(fileName) {
        const ext = fileName.toLowerCase().split('.').pop();
        
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
        
        // Log files
        if (this.isLogFile(fileName)) {
            return 'log';
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
        const logExtensions = ['.log', '.txt'];
        const logPatterns = ['access', 'error', 'system', 'security', 'auth', 'firewall', 'audit', 'incident'];
        
        // Check file extension first
        if (logExtensions.some(ext => fileName.toLowerCase().endsWith(ext))) {
            // Then check if filename contains log-related keywords
            return logPatterns.some(pattern => fileName.toLowerCase().includes(pattern));
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
}
