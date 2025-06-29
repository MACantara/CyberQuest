export class WindowSnapManager {
    constructor(container) {
        this.container = container;
        this.snapThreshold = 20; // pixels
        this.snapZones = null;
        this.isSnapping = false;
        this.snapIndicator = null;
        this.initializeSnapZones();
        this.createSnapIndicator();
    }

    initializeSnapZones() {
        // Get taskbar height (typically 50px)
        const taskbarHeight = 50;
        const availableHeight = `calc(100% - ${taskbarHeight}px)`;
        const halfAvailableHeight = `calc(50% - ${taskbarHeight / 2}px)`;
        
        this.snapZones = {
            left: { x: 0, y: 0, width: '50%', height: availableHeight },
            right: { x: '50%', y: 0, width: '50%', height: availableHeight },
            top: { x: 0, y: 0, width: '100%', height: halfAvailableHeight },
            bottom: { x: 0, y: halfAvailableHeight, width: '100%', height: halfAvailableHeight },
            topLeft: { x: 0, y: 0, width: '50%', height: halfAvailableHeight },
            topRight: { x: '50%', y: 0, width: '50%', height: halfAvailableHeight },
            bottomLeft: { x: 0, y: halfAvailableHeight, width: '50%', height: halfAvailableHeight },
            bottomRight: { x: '50%', y: halfAvailableHeight, width: '50%', height: halfAvailableHeight },
            maximize: { x: 0, y: 0, width: '100%', height: availableHeight }
        };
    }

    createSnapIndicator() {
        this.snapIndicator = document.createElement('div');
        this.snapIndicator.className = 'snap-indicator fixed pointer-events-none z-40 border-2 border-blue-400 bg-blue-400 bg-opacity-20 opacity-0 transition-opacity duration-200';
        this.snapIndicator.style.display = 'none';
        document.body.appendChild(this.snapIndicator);
    }

    getSnapZone(mouseX, mouseY) {
        const containerRect = this.container.getBoundingClientRect();
        const relativeX = mouseX - containerRect.left;
        const relativeY = mouseY - containerRect.top;
        
        const { width, height } = containerRect;
        const taskbarHeight = 50;
        const effectiveHeight = height - taskbarHeight; // Don't count taskbar area for main content
        
        // Increased threshold for better corner detection
        const cornerThreshold = 30; // pixels for corners
        const edgeThreshold = this.snapThreshold; // pixels for edges
        
        // Edge detection with threshold
        const nearLeft = relativeX <= edgeThreshold;
        const nearRight = relativeX >= width - edgeThreshold;
        const nearTop = relativeY <= edgeThreshold;
        const nearBottom = relativeY >= effectiveHeight - edgeThreshold && relativeY < effectiveHeight;
        
        // Corner detection with larger threshold for easier access
        const nearLeftCorner = relativeX <= cornerThreshold;
        const nearRightCorner = relativeX >= width - cornerThreshold;
        const nearTopCorner = relativeY <= cornerThreshold;
        // Include taskbar area for bottom corners - extend detection to full height
        const nearBottomCorner = relativeY >= effectiveHeight - cornerThreshold && relativeY <= height;
        
        // Corner snapping (priority) - use larger threshold
        if (nearLeftCorner && nearTopCorner) return 'topLeft';
        if (nearRightCorner && nearTopCorner) return 'topRight';
        if (nearLeftCorner && nearBottomCorner) return 'bottomLeft';
        if (nearRightCorner && nearBottomCorner) return 'bottomRight';
        
        // Edge snapping
        if (nearLeft) return 'left';
        if (nearRight) return 'right';
        if (nearTop) return 'maximize'; // Top edge maximizes
        if (nearBottom) return 'bottom';
        
        return null;
    }

    showSnapPreview(snapZone) {
        if (!snapZone || !this.snapZones[snapZone]) {
            this.hideSnapPreview();
            return;
        }

        const containerRect = this.container.getBoundingClientRect();
        const zone = this.snapZones[snapZone];
        const taskbarHeight = 50;
        
        // Calculate absolute positions
        const left = typeof zone.x === 'string' 
            ? containerRect.left + (parseFloat(zone.x) / 100) * containerRect.width
            : containerRect.left + zone.x;
        
        let top;
        if (typeof zone.y === 'string') {
            if (zone.y.includes('calc')) {
                // Handle calc expressions properly
                if (zone.y.includes('50%')) {
                    top = containerRect.top + (containerRect.height - taskbarHeight) / 2;
                } else {
                    top = containerRect.top;
                }
            } else {
                const percentage = parseFloat(zone.y) / 100;
                if (percentage >= 0.5) {
                    // Bottom half positioning
                    top = containerRect.top + (containerRect.height - taskbarHeight) / 2;
                } else {
                    // Top half positioning
                    top = containerRect.top + percentage * (containerRect.height - taskbarHeight);
                }
            }
        } else {
            top = containerRect.top + zone.y;
        }
        
        const width = typeof zone.width === 'string'
            ? zone.width.includes('calc')
                ? containerRect.width
                : (parseFloat(zone.width) / 100) * containerRect.width
            : zone.width;
        
        let height;
        if (typeof zone.height === 'string') {
            if (zone.height.includes('calc')) {
                // Parse calc expressions for height
                if (zone.height.includes('100%')) {
                    height = containerRect.height - taskbarHeight;
                } else if (zone.height.includes('50%')) {
                    height = (containerRect.height - taskbarHeight) / 2;
                } else {
                    height = containerRect.height - taskbarHeight;
                }
            } else {
                height = (parseFloat(zone.height) / 100) * (containerRect.height - taskbarHeight);
            }
        } else {
            height = zone.height;
        }

        this.snapIndicator.style.left = `${left}px`;
        this.snapIndicator.style.top = `${top}px`;
        this.snapIndicator.style.width = `${width}px`;
        this.snapIndicator.style.height = `${height}px`;
        this.snapIndicator.style.display = 'block';
        this.snapIndicator.style.opacity = '1';
        
        this.isSnapping = true;
    }

    hideSnapPreview() {
        this.snapIndicator.style.opacity = '0';
        setTimeout(() => {
            if (this.snapIndicator.style.opacity === '0') {
                this.snapIndicator.style.display = 'none';
            }
        }, 200);
        this.isSnapping = false;
    }

    snapWindow(windowElement, snapZone, windowApp = null) {
        if (!snapZone || !this.snapZones[snapZone] || !windowElement) return false;

        const containerRect = this.container.getBoundingClientRect();
        const zone = this.snapZones[snapZone];
        
        // Store original dimensions if not already stored
        if (windowApp && typeof windowApp.storeOriginalDimensions === 'function') {
            windowApp.storeOriginalDimensions();
        } else if (!windowElement.dataset.snapOriginalWidth) {
            windowElement.dataset.snapOriginalWidth = windowElement.style.width;
            windowElement.dataset.snapOriginalHeight = windowElement.style.height;
            windowElement.dataset.snapOriginalLeft = windowElement.style.left;
            windowElement.dataset.snapOriginalTop = windowElement.style.top;
        }

        // Apply snap position and size with taskbar consideration
        const left = typeof zone.x === 'string' && zone.x.includes('%')
            ? zone.x
            : typeof zone.x === 'string'
                ? `${zone.x}px`
                : `${zone.x}px`;
        
        const top = typeof zone.y === 'string' && zone.y.includes('%')
            ? zone.y
            : typeof zone.y === 'string'
                ? `${zone.y}px`
                : `${zone.y}px`;

        windowElement.style.left = left;
        windowElement.style.top = top;
        windowElement.style.width = zone.width;
        windowElement.style.height = zone.height;
        
        // Mark as snapped
        windowElement.dataset.snapped = snapZone;
        
        // Update window app state if available
        if (windowApp && snapZone === 'maximize') {
            windowApp.isMaximized = true;
        }
        
        this.hideSnapPreview();
        return true;
    }

    unSnapWindow(windowElement, windowApp = null) {
        if (!windowElement.dataset.snapped) return false;

        // Restore using window app if available
        if (windowApp && typeof windowApp.restoreOriginalDimensions === 'function') {
            windowApp.restoreOriginalDimensions();
        } else if (windowElement.dataset.snapOriginalWidth) {
            // Fallback to dataset restoration
            windowElement.style.width = windowElement.dataset.snapOriginalWidth;
            windowElement.style.height = windowElement.dataset.snapOriginalHeight;
            windowElement.style.left = windowElement.dataset.snapOriginalLeft;
            windowElement.style.top = windowElement.dataset.snapOriginalTop;
            
            // Clean up dataset
            delete windowElement.dataset.snapOriginalWidth;
            delete windowElement.dataset.snapOriginalHeight;
            delete windowElement.dataset.snapOriginalLeft;
            delete windowElement.dataset.snapOriginalTop;
        }

        delete windowElement.dataset.snapped;
        
        // Update window app state if available
        if (windowApp) {
            windowApp.isMaximized = false;
        }
        
        return true;
    }

    isWindowSnapped(windowElement) {
        return !!windowElement.dataset.snapped;
    }

    getWindowSnapZone(windowElement) {
        return windowElement.dataset.snapped || null;
    }

    handleDragStart(windowElement, mouseX, mouseY, windowApp = null) {
        // If window is snapped and being dragged, unsnap it
        if (this.isWindowSnapped(windowElement)) {
            const wasMaximized = windowElement.dataset.snapped === 'maximize';
            
            if (wasMaximized && windowApp && typeof windowApp.handleDragStartOnMaximized === 'function') {
                // Don't handle here - let WindowBase handle maximized state
                // Just clean up snap state
                delete windowElement.dataset.snapped;
                if (windowApp) {
                    windowApp.isMaximized = false;
                }
                return null; // Let the window manager handle the maximized drag
            } else {
                // Regular unsnap
                this.unSnapWindow(windowElement, windowApp);
                
                // Reposition window under cursor
                const rect = windowElement.getBoundingClientRect();
                const newLeft = mouseX - rect.width / 2;
                const newTop = mouseY - 20; // Header offset
                
                windowElement.style.left = `${newLeft}px`;
                windowElement.style.top = `${newTop}px`;
                
                return { left: newLeft, top: newTop };
            }
        }
        return null;
    }

    handleDragMove(mouseX, mouseY) {
        const snapZone = this.getSnapZone(mouseX, mouseY);
        if (snapZone) {
            this.showSnapPreview(snapZone);
        } else {
            this.hideSnapPreview();
        }
        return snapZone;
    }

    handleDragEnd(windowElement, mouseX, mouseY, windowApp = null) {
        const snapZone = this.getSnapZone(mouseX, mouseY);
        if (snapZone) {
            this.snapWindow(windowElement, snapZone, windowApp);
        }
        this.hideSnapPreview();
        return snapZone;
    }

    cleanup() {
        if (this.snapIndicator && this.snapIndicator.parentNode) {
            this.snapIndicator.remove();
        }
    }
}
