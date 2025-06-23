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

        // Determine the appropriate viewer based on file type
        this.createSpecializedViewer(fileName, fileData, fileContent, windowId, desktop);
    }

    createSpecializedViewer(fileName, fileData, fileContent, windowId, desktop) {
        const fileExt = fileName.toLowerCase().split('.').pop();
        
        if (fileName.toLowerCase().endsWith('.exe')) {
            // Use executable viewer for .exe files
            import('../file-viewer-apps/executable-viewer-app.js').then(({ ExecutableViewerApp }) => {
                const fileViewerApp = new ExecutableViewerApp(fileName, fileData, fileContent);
                this.createAndTrackWindow(windowId, fileName, fileViewerApp, desktop);
            }).catch(error => {
                console.error('Failed to load ExecutableViewerApp:', error);
                this.createFallbackViewer(fileName, fileData, fileContent, windowId, desktop);
            });
        } else if (fileName.toLowerCase().endsWith('.pdf')) {
            // Use PDF viewer for PDF files
            import('../file-viewer-apps/pdf-viewer-app.js').then(({ PdfViewerApp }) => {
                const fileViewerApp = new PdfViewerApp(fileName, fileData, fileContent);
                this.createAndTrackWindow(windowId, fileName, fileViewerApp, desktop);
            }).catch(error => {
                console.error('Failed to load PdfViewerApp:', error);
                this.createFallbackViewer(fileName, fileData, fileContent, windowId, desktop);
            });
        } else if (this.isImageFile(fileName)) {
            // Use image viewer for image files
            import('../file-viewer-apps/image-viewer-app.js').then(({ ImageViewerApp }) => {
                const fileViewerApp = new ImageViewerApp(fileName, fileData, fileContent);
                this.createAndTrackWindow(windowId, fileName, fileViewerApp, desktop);
            }).catch(error => {
                console.error('Failed to load ImageViewerApp:', error);
                this.createFallbackViewer(fileName, fileData, fileContent, windowId, desktop);
            });
        } else if (this.isLogFile(fileName)) {
            // Use log viewer for log files
            import('../file-viewer-apps/log-viewer-app.js').then(({ LogViewerApp }) => {
                const fileViewerApp = new LogViewerApp(fileName, fileData, fileContent);
                this.createAndTrackWindow(windowId, fileName, fileViewerApp, desktop);
            }).catch(error => {
                console.error('Failed to load LogViewerApp:', error);
                this.createFallbackViewer(fileName, fileData, fileContent, windowId, desktop);
            });
        } else {
            // Use text viewer for all other files
            import('../file-viewer-apps/text-viewer-app.js').then(({ TextViewerApp }) => {
                const fileViewerApp = new TextViewerApp(fileName, fileData, fileContent);
                this.createAndTrackWindow(windowId, fileName, fileViewerApp, desktop);
            }).catch(error => {
                console.error('Failed to load TextViewerApp:', error);
                this.createFallbackViewer(fileName, fileData, fileContent, windowId, desktop);
            });
        }
    }

    createAndTrackWindow(windowId, fileName, fileViewerApp, desktop) {
        // Create the window using window manager
        const windowElement = desktop.windowManager.createWindow(
            windowId, 
            `${fileViewerApp.title}`, 
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
    }

    createFallbackViewer(fileName, fileData, fileContent, windowId, desktop) {
        // Fallback to the basic file viewer window
        import('../file-viewer-window.js').then(({ FileViewerWindow }) => {
            const fileViewerApp = new FileViewerWindow(fileName, fileData, fileContent);
            this.createAndTrackWindow(windowId, fileName, fileViewerApp, desktop);
        }).catch(error => {
            console.error('Failed to load fallback FileViewerWindow:', error);
        });
    }

    isImageFile(fileName) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp', '.tiff', '.ico'];
        return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
    }

    isLogFile(fileName) {
        const logExtensions = ['.log', '.txt'];
        const logPatterns = ['access', 'error', 'system', 'security', 'auth', 'firewall', 'audit'];
        
        // Check file extension
        if (logExtensions.some(ext => fileName.toLowerCase().endsWith(ext))) {
            // Check if filename contains log-related keywords
            return logPatterns.some(pattern => fileName.toLowerCase().includes(pattern));
        }
        
        return false;
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