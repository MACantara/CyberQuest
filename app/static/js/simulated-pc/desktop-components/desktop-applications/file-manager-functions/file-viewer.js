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
            // Fallback to old modal system if window system fails
            this.openFileModal(fileName, fileData, fileContent);
        });
    }

    // Fallback modal system for compatibility
    openFileModal(fileName, fileData, fileContent) {
        const viewer = document.createElement('div');
        viewer.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
        viewer.innerHTML = this.createModalContent(fileName, fileData, fileContent);
        
        document.body.appendChild(viewer);
        this.bindModalEvents(viewer);
    }

    createModalContent(fileName, fileData, fileContent) {
        const isExecutable = fileName.toLowerCase().endsWith('.exe');
        const isSuspicious = fileData.suspicious;
        
        return `
            <div class="bg-gray-800 rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
                <div class="flex items-center justify-between p-4 border-b border-gray-600">
                    <div class="flex items-center space-x-3">
                        <i class="bi bi-file-text text-gray-400 text-2xl"></i>
                        <div>
                            <h3 class="text-white text-lg font-semibold">${fileName}</h3>
                            <p class="text-gray-400 text-sm">${fileData.size || 'Unknown size'}</p>
                        </div>
                    </div>
                    <button onclick="this.closest('.fixed').remove()" 
                            class="text-gray-400 hover:text-white transition-colors text-xl cursor-pointer p-2">
                        <i class="bi bi-x"></i>
                    </button>
                </div>
                
                ${isSuspicious ? `
                    <div class="bg-red-900/30 border-t border-b border-red-500/30 p-3">
                        <div class="flex items-center space-x-2">
                            <i class="bi bi-exclamation-triangle text-red-400"></i>
                            <span class="text-red-300 font-semibold">Security Warning</span>
                        </div>
                        <p class="text-red-200 text-sm mt-1">This file has been flagged as potentially suspicious.</p>
                    </div>
                ` : ''}
                
                <div class="flex-1 overflow-auto p-4">
                    <div class="bg-black p-4 rounded">
                        <pre class="text-green-400 font-mono text-sm whitespace-pre-wrap">${fileContent}</pre>
                    </div>
                </div>
                
                <div class="p-4 border-t border-gray-600 flex justify-end space-x-2">
                    ${isExecutable ? `
                        <div class="flex items-center space-x-2 text-red-400 text-sm mr-4">
                            <i class="bi bi-shield-exclamation"></i>
                            <span>Executable file - Do not run in production</span>
                        </div>
                    ` : ''}
                    <button onclick="this.closest('.fixed').remove()" 
                            class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        `;
    }

    bindModalEvents(viewer) {
        // Close on escape key
        const handleKeyPress = (e) => {
            if (e.key === 'Escape') {
                viewer.remove();
                document.removeEventListener('keydown', handleKeyPress);
            }
        };
        
        document.addEventListener('keydown', handleKeyPress);
        
        // Close when clicking outside content
        viewer.addEventListener('click', (e) => {
            if (e.target === viewer) {
                viewer.remove();
            }
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
        
        // Also close any modal fallbacks
        const modals = document.querySelectorAll('.fixed.inset-0');
        modals.forEach(modal => {
            if (modal.innerHTML && modal.innerHTML.includes('File Viewer')) {
                modal.remove();
            }
        });
    }

    getOpenFileCount() {
        return this.openWindows.size;
    }

    isFileOpen(fileName) {
        const windowId = `file-viewer-${fileName.replace(/[^a-zA-Z0-9]/g, '_')}`;
        return this.openWindows.has(windowId);
    }
}
