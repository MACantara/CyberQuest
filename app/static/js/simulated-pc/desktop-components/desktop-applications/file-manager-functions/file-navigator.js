import { DirectoryRegistry } from '../../../levels/level-five/directories/directory-registry.js';

export class FileNavigator {
    constructor(fileManagerApp) {
        this.fileManagerApp = fileManagerApp;
        this.currentPath = '/home/trainee';
        this.history = ['/home/trainee'];
        this.historyIndex = 0;
        this.directoryRegistry = new DirectoryRegistry();
    }

    getCurrentDirectory() {
        return this.directoryRegistry.getDirectory(this.currentPath);
    }

    getVisibleItems(showHidden = false) {
        const directory = this.getCurrentDirectory();
        if (!directory) return [];
        
        return directory.items.filter(item => showHidden || !item.hidden);
    }

    navigateTo(path) {
        const directory = this.directoryRegistry.getDirectory(path);
        if (directory) {
            this.currentPath = path;
            this.addToHistory(path);
            this.updateDisplay();
            return true;
        }
        return false;
    }

    navigateUp() {
        if (this.currentPath === '/home/trainee') return false;
        
        const pathParts = this.currentPath.split('/').filter(p => p);
        pathParts.pop();
        const parentPath = '/' + pathParts.join('/');
        
        return this.navigateTo(parentPath);
    }

    goBack() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.currentPath = this.history[this.historyIndex];
            this.updateDisplay();
            return true;
        }
        return false;
    }

    goForward() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.currentPath = this.history[this.historyIndex];
            this.updateDisplay();
            return true;
        }
        return false;
    }

    goHome() {
        return this.navigateTo('/home/trainee');
    }

    addToHistory(path) {
        // Remove any forward history
        this.history = this.history.slice(0, this.historyIndex + 1);
        // Add new path if it's different from current
        if (this.history[this.history.length - 1] !== path) {
            this.history.push(path);
            this.historyIndex = this.history.length - 1;
        }
    }

    updateDisplay() {
        this.fileManagerApp.renderDirectory();
        this.fileManagerApp.updateAddressBar(this.currentPath);
        this.fileManagerApp.updateNavigationButtons();
    }

    canGoBack() {
        return this.historyIndex > 0;
    }

    canGoForward() {
        return this.historyIndex < this.history.length - 1;
    }

    getFileContent(fileName) {
        return this.directoryRegistry.getFileContent(this.currentPath, fileName);
    }

    // Utility methods for directory management
    addNewDirectory(path, directoryConfig) {
        this.directoryRegistry.addDirectory(path, directoryConfig);
    }

    addNewFile(path, fileName, content) {
        this.directoryRegistry.addFileContents(path, { [fileName]: content });
    }

    getFileSystemStatistics() {
        return this.directoryRegistry.getDirectoryStatistics();
    }

    getAllDirectoryPaths() {
        return this.directoryRegistry.getAllDirectories();
    }

    // Search functionality
    searchFiles(searchTerm, searchPath = null) {
        const results = [];
        const pathsToSearch = searchPath ? [searchPath] : this.getAllDirectoryPaths();
        
        pathsToSearch.forEach(path => {
            const directory = this.directoryRegistry.getDirectory(path);
            if (directory && directory.items) {
                directory.items.forEach(item => {
                    if (item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                        results.push({
                            ...item,
                            path,
                            fullPath: `${path}/${item.name}`
                        });
                    }
                });
            }
        });
        
        return results;
    }

    // Filter files by type or properties
    filterFiles(filterCriteria) {
        const results = [];
        
        this.getAllDirectoryPaths().forEach(path => {
            const directory = this.directoryRegistry.getDirectory(path);
            if (directory && directory.items) {
                directory.items.forEach(item => {
                    let matches = true;
                    
                    // Apply filters
                    if (filterCriteria.type && item.type !== filterCriteria.type) {
                        matches = false;
                    }
                    
                    if (filterCriteria.suspicious !== undefined && Boolean(item.suspicious) !== filterCriteria.suspicious) {
                        matches = false;
                    }
                    
                    if (filterCriteria.extension) {
                        const fileExt = item.name.split('.').pop().toLowerCase();
                        if (fileExt !== filterCriteria.extension.toLowerCase()) {
                            matches = false;
                        }
                    }
                    
                    if (filterCriteria.minSize || filterCriteria.maxSize) {
                        // Simple size comparison (would need proper parsing in real implementation)
                        const sizeStr = item.size || '0';
                        const sizeMatch = sizeStr.match(/[\d.]+/);
                        const sizeNum = sizeMatch ? parseFloat(sizeMatch[0]) : 0;
                        
                        if (filterCriteria.minSize && sizeNum < filterCriteria.minSize) {
                            matches = false;
                        }
                        if (filterCriteria.maxSize && sizeNum > filterCriteria.maxSize) {
                            matches = false;
                        }
                    }
                    
                    if (matches) {
                        results.push({
                            ...item,
                            path,
                            fullPath: `${path}/${item.name}`
                        });
                    }
                });
            }
        });
        
        return results;
    }
}