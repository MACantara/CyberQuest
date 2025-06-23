export class FileViewer {
    constructor(fileManagerApp) {
        this.fileManagerApp = fileManagerApp;
        this.openWindows = new Set(); // Track open file viewer windows
    }

    openFile(fileName, fileData) {
        // Get the window manager from the desktop
        const desktop = this.getDesktop();
        if (!desktop || !desktop.windowManager) {
            console.error('Window manager not available');
            return;
        }

        // Get file content
        const fileContent = this.fileManagerApp.navigator.getFileContent(fileName);
        
        // Create unique window ID to allow multiple file viewers
        const windowId = `file-viewer-${fileName.replace(/[^a-zA-Z0-9]/g, '_')}`;
        
        // Check if this file is already open
        if (this.openWindows.has(windowId)) {
            // Bring existing window to front
            const existingWindow = desktop.windowManager.windows.get(windowId);
            if (existingWindow) {
                existingWindow.style.zIndex = ++desktop.windowManager.zIndex;
                desktop.windowManager.taskbar.setActiveWindow(windowId);
                return;
            } else {
                // Window was closed, remove from tracking
                this.openWindows.delete(windowId);
            }
        }

        // Import FileViewerWindow dynamically to avoid circular imports
        import('../file-viewer-window.js').then(({ FileViewerWindow }) => {
            const fileViewerApp = new FileViewerWindow(fileName, fileData, fileContent);
            
            // Create the window using window manager
            const windowElement = desktop.windowManager.createWindow(
                windowId, 
                `File Viewer - ${fileName}`, 
                fileViewerApp
            );
            
            // Track the window
            this.openWindows.add(windowId);
            
            // Override the close method to track window closure
            const originalCloseMethod = desktop.windowManager.closeWindow.bind(desktop.windowManager);
            const originalCloseWindow = (id) => {
                this.openWindows.delete(id);
                originalCloseMethod(id);
            };
            
            // Temporarily override close method for this window
            const windowCloseBtn = windowElement?.querySelector('.close');
            if (windowCloseBtn) {
                windowCloseBtn.removeEventListener('click', windowCloseBtn.onclick);
                windowCloseBtn.addEventListener('click', () => {
                    originalCloseWindow(windowId);
                });
            }
        }).catch(error => {
            console.error('Failed to load FileViewerWindow:', error);
        });
    }

    getDesktop() {
        // Try to get desktop from window manager hierarchy
        const container = this.fileManagerApp.windowElement?.closest('.relative');
        if (container && container.desktop) {
            return container.desktop;
        }
        
        // Fallback: try to get from global scope
        if (window.currentSimulation && window.currentSimulation.desktop) {
            return window.currentSimulation.desktop;
        }
        
        return null;
    }

    closeViewer() {
        // Close all tracked file viewer windows
        const desktop = this.getDesktop();
        if (desktop && desktop.windowManager) {
            this.openWindows.forEach(windowId => {
                desktop.windowManager.closeWindow(windowId);
            });
        }
        
        this.openWindows.clear();
    }

    getOpenFileCount() {
        return this.openWindows.size;
    }

    isFileOpen(fileName) {
        const windowId = `file-viewer-${fileName.replace(/[^a-zA-Z0-9]/g, '_')}`;
        return this.openWindows.has(windowId);
    }
}