export class WindowTracker {
    constructor() {
        this.openWindows = new Set();
        this.windowMetadata = new Map();
    }
    
    generateWindowId(fileName) {
        return `file-viewer-${fileName.replace(/[^a-zA-Z0-9]/g, '_')}`;
    }
    
    isFileOpen(fileName) {
        const windowId = this.generateWindowId(fileName);
        return this.openWindows.has(windowId);
    }
    
    trackWindow(fileName, windowElement, viewerApp) {
        const windowId = this.generateWindowId(fileName);
        this.openWindows.add(windowId);
        this.windowMetadata.set(windowId, {
            fileName,
            windowElement,
            viewerApp,
            openedAt: new Date()
        });
        return windowId;
    }
    
    untrackWindow(windowId) {
        this.openWindows.delete(windowId);
        this.windowMetadata.delete(windowId);
    }
    
    getWindowMetadata(windowId) {
        return this.windowMetadata.get(windowId);
    }
    
    getAllOpenWindows() {
        return Array.from(this.openWindows);
    }
    
    getOpenFileCount() {
        return this.openWindows.size;
    }
    
    closeAllWindows(desktop) {
        if (desktop && desktop.windowManager) {
            this.openWindows.forEach(windowId => {
                desktop.windowManager.closeWindow(windowId);
            });
        }
        this.openWindows.clear();
        this.windowMetadata.clear();
    }
    
    bringWindowToFront(fileName, desktop) {
        const windowId = this.generateWindowId(fileName);
        
        if (this.openWindows.has(windowId) && desktop && desktop.windowManager) {
            const existingWindow = desktop.windowManager.windows.get(windowId);
            if (existingWindow) {
                existingWindow.style.zIndex = ++desktop.windowManager.zIndex;
                desktop.windowManager.taskbar.setActiveWindow(windowId);
                return true;
            } else {
                // Window was closed externally, clean up tracking
                this.untrackWindow(windowId);
                return false;
            }
        }
        return false;
    }
    
    setupWindowCloseTracking(windowId, windowElement, desktop) {
        if (!windowElement || !desktop) return;
        
        const originalCloseMethod = desktop.windowManager.closeWindow.bind(desktop.windowManager);
        const trackedCloseWindow = (id) => {
            this.untrackWindow(id);
            originalCloseMethod(id);
        };
        
        // Override close button behavior
        const windowCloseBtn = windowElement.querySelector('.close');
        if (windowCloseBtn) {
            windowCloseBtn.removeEventListener('click', windowCloseBtn.onclick);
            windowCloseBtn.addEventListener('click', () => {
                trackedCloseWindow(windowId);
            });
        }
    }
}
