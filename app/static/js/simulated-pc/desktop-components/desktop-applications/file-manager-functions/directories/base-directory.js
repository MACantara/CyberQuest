export class BaseDirectory {
    constructor(config) {
        this.path = config.path;
        this.name = config.name;
        this.type = 'directory';
        this.items = [];
        this.metadata = {
            created: config.created || new Date().toISOString(),
            modified: config.modified || new Date().toISOString(),
            permissions: config.permissions || 'rwxr-xr-x',
            owner: config.owner || 'trainee',
            group: config.group || 'trainee'
        };
        this.initializeItems();
    }

    // Abstract method - must be implemented by subclasses
    initializeItems() {
        throw new Error('initializeItems() must be implemented by subclasses');
    }

    // Add a file to the directory
    addFile(config) {
        const fileItem = {
            name: config.name,
            type: 'file',
            icon: config.icon || this.getFileIcon(config.name),
            color: config.color || this.getFileColor(config.name),
            size: config.size || '0 B',
            modified: config.modified || new Date().toISOString().slice(0, 16).replace('T', ' '),
            suspicious: config.suspicious || false,
            hidden: config.hidden || false,
            permissions: config.permissions || 'rw-r--r--',
            metadata: config.metadata || {},
            content: config.content || '' // Add content property
        };
        
        this.items.push(fileItem);
        return fileItem;
    }

    // Add a subdirectory
    addDirectory(config) {
        const dirItem = {
            name: config.name,
            type: 'directory',
            icon: 'bi-folder',
            color: config.color || 'text-blue-400',
            permissions: config.permissions || 'rwxr-xr-x',
            metadata: config.metadata || {}
        };
        
        this.items.push(dirItem);
        return dirItem;
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

    // Get items by type
    getFiles() {
        return this.items.filter(item => item.type === 'file');
    }

    getDirectories() {
        return this.items.filter(item => item.type === 'directory');
    }

    // Get visible items (excluding hidden files unless requested)
    getVisibleItems(showHidden = false) {
        return this.items.filter(item => showHidden || !item.hidden);
    }

    // Get suspicious items
    getSuspiciousItems() {
        return this.items.filter(item => item.suspicious);
    }

    // Get directory statistics
    getStatistics() {
        return {
            totalItems: this.items.length,
            files: this.getFiles().length,
            directories: this.getDirectories().length,
            suspiciousItems: this.getSuspiciousItems().length,
            hiddenItems: this.items.filter(item => item.hidden).length
        };
    }

    // Create directory object compatible with existing system
    toDirectoryObject() {
        return {
            path: this.path,
            type: this.type,
            name: this.name,
            items: this.items,
            metadata: this.metadata
        };
    }

    // Search for items by name
    searchItems(query) {
        const lowerQuery = query.toLowerCase();
        return this.items.filter(item => 
            item.name.toLowerCase().includes(lowerQuery)
        );
    }

    // Sort items by various criteria
    sortItems(criteria = 'name', ascending = true) {
        const sortedItems = [...this.items];
        
        sortedItems.sort((a, b) => {
            let comparison = 0;
            
            switch (criteria) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'type':
                    comparison = a.type.localeCompare(b.type);
                    break;
                case 'size':
                    comparison = this.compareSizes(a.size, b.size);
                    break;
                case 'modified':
                    comparison = new Date(a.modified) - new Date(b.modified);
                    break;
                default:
                    comparison = a.name.localeCompare(b.name);
            }
            
            return ascending ? comparison : -comparison;
        });
        
        return sortedItems;
    }

    // Helper method to compare file sizes
    compareSizes(sizeA, sizeB) {
        const parseSize = (size) => {
            const match = size.match(/^([\d.]+)\s*([A-Z]*B?)$/i);
            if (!match) return 0;
            
            const value = parseFloat(match[1]);
            const unit = match[2].toUpperCase();
            
            const multipliers = {
                'B': 1,
                'KB': 1024,
                'MB': 1024 * 1024,
                'GB': 1024 * 1024 * 1024
            };
            
            return value * (multipliers[unit] || 1);
        };
        
        return parseSize(sizeA) - parseSize(sizeB);
    }
}
