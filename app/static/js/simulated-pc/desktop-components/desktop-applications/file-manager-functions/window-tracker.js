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
            openedAt: new Date(),
            isMaximized: false,
            originalDimensions: null
        });
        return windowId;
    }

    untrackWindow(windowId) {
        this.openWindows.delete(windowId);
        this.windowMetadata.delete(windowId);
    }

    // Track window maximize/snap state
    updateMaximizedState(windowId, isMaximized, originalDimensions = null) {
        const metadata = this.windowMetadata.get(windowId);
        if (metadata) {
            metadata.isMaximized = isMaximized;
            if (originalDimensions) {
                metadata.originalDimensions = originalDimensions;
            }
        }
    }

    // Get window maximize/snap state
    getMaximizedState(windowId) {
        const metadata = this.windowMetadata.get(windowId);
        if (metadata) {
            // Check if window is snapped or maximized
            const window = metadata.windowElement;
            return metadata.isMaximized || (window && window.dataset.snapped);
        }
        return false;
    }

    // Get original dimensions for a window
    getOriginalDimensions(windowId) {
        const metadata = this.windowMetadata.get(windowId);
        return metadata ? metadata.originalDimensions : null;
    }

    // Store window dimensions before maximizing
    storeOriginalDimensions(windowId, dimensions) {
        const metadata = this.windowMetadata.get(windowId);
        if (metadata) {
            metadata.originalDimensions = {
                width: dimensions.width,
                height: dimensions.height,
                left: dimensions.left,
                top: dimensions.top
            };
        }
    }

    // Restore window from maximized state
    restoreWindow(windowId, desktop) {
        const metadata = this.windowMetadata.get(windowId);
        if (metadata && metadata.isMaximized && metadata.originalDimensions && desktop) {
            const window = desktop.windowManager.windows.get(windowId);
            if (window) {
                window.style.width = metadata.originalDimensions.width;
                window.style.height = metadata.originalDimensions.height;
                window.style.left = metadata.originalDimensions.left;
                window.style.top = metadata.originalDimensions.top;
                
                metadata.isMaximized = false;
                return true;
            }
        }
        return false;
    }

    // Maximize window
    maximizeWindow(windowId, desktop) {
        const metadata = this.windowMetadata.get(windowId);
        if (metadata && !metadata.isMaximized && desktop) {
            const window = desktop.windowManager.windows.get(windowId);
            if (window) {
                // Store current dimensions
                this.storeOriginalDimensions(windowId, {
                    width: window.style.width,
                    height: window.style.height,
                    left: window.style.left,
                    top: window.style.top
                });
                
                // Maximize
                window.style.width = '100%';
                window.style.height = 'calc(100% - 50px)';
                window.style.left = '0';
                window.style.top = '0';
                
                metadata.isMaximized = true;
                return true;
            }
        }
        return false;
    }

    // Handle drag start on maximized/snapped window
    handleDragStartOnMaximized(windowId, mouseX, mouseY, desktop) {
        const metadata = this.windowMetadata.get(windowId);
        if (metadata && desktop) {
            const window = desktop.windowManager.windows.get(windowId);
            if (window) {
                // Check if window is snapped first - let snap manager handle it
                if (window.dataset.snapped && desktop.windowManager.snapManager) {
                    // For snapped windows that are maximized, clean up our state and let snap manager handle
                    if (window.dataset.snapped === 'maximize') {
                        metadata.isMaximized = false;
                        return null; // Let snap manager handle
                    }
                    return desktop.windowManager.snapManager.handleDragStart(window, mouseX, mouseY, metadata.viewerApp);
                }
                
                // Handle regular maximized state
                if (metadata.isMaximized && metadata.originalDimensions) {
                    // Calculate window width in pixels
                    const windowWidth = parseInt(metadata.originalDimensions.width);
                    let actualWidth = windowWidth;
                    
                    if (metadata.originalDimensions.width.includes('%')) {
                        const percentage = parseFloat(metadata.originalDimensions.width) / 100;
                        actualWidth = window.innerWidth * percentage;
                    }
                    
                    // Restore window
                    this.restoreWindow(windowId, desktop);
                    
                    // Center window under mouse cursor
                    const newLeft = mouseX - (actualWidth / 2);
                    const newTop = mouseY - 20; // Header height offset
                    
                    // Ensure window stays on screen
                    const maxLeft = window.innerWidth - actualWidth;
                    const maxTop = window.innerHeight - parseInt(metadata.originalDimensions.height);
                    
                    const finalLeft = Math.max(0, Math.min(maxLeft, newLeft));
                    const finalTop = Math.max(0, Math.min(maxTop, newTop));
                    
                    window.style.left = `${finalLeft}px`;
                    window.style.top = `${finalTop}px`;
                    
                    return {
                        left: finalLeft,
                        top: finalTop
                    };
                }
            }
        }
        return null;
    }

    // Get window statistics including snap state
    getWindowStatistics() {
        const stats = {
            total: this.openWindows.size,
            maximized: 0,
            snapped: 0,
            restored: 0,
            byFileType: {},
            averageOpenTime: 0
        };

        let totalOpenTime = 0;
        const now = new Date();

        this.windowMetadata.forEach(metadata => {
            const window = metadata.windowElement;
            
            if (window && window.dataset.snapped) {
                stats.snapped++;
            } else if (metadata.isMaximized) {
                stats.maximized++;
            } else {
                stats.restored++;
            }

            // Track by file extension
            const ext = metadata.fileName.split('.').pop() || 'unknown';
            stats.byFileType[ext] = (stats.byFileType[ext] || 0) + 1;

            // Calculate open time
            totalOpenTime += now - metadata.openedAt;
        });

        if (stats.total > 0) {
            stats.averageOpenTime = Math.round(totalOpenTime / stats.total / 1000); // in seconds
        }

        return stats;
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
