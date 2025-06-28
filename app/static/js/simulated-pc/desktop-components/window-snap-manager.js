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
        this.snapZones = {
            left: { x: 0, y: 0, width: '50%', height: '100%' },
            right: { x: '50%', y: 0, width: '50%', height: '100%' },
            top: { x: 0, y: 0, width: '100%', height: '50%' },
            bottom: { x: 0, y: '50%', width: '100%', height: '50%' },
            topLeft: { x: 0, y: 0, width: '50%', height: '50%' },
            topRight: { x: '50%', y: 0, width: '50%', height: '50%' },
            bottomLeft: { x: 0, y: '50%', width: '50%', height: '50%' },
            bottomRight: { x: '50%', y: '50%', width: '50%', height: '50%' },
            maximize: { x: 0, y: 0, width: '100%', height: 'calc(100% - 50px)' }
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
        
        // Edge detection with threshold
        const nearLeft = relativeX <= this.snapThreshold;
        const nearRight = relativeX >= width - this.snapThreshold;
        const nearTop = relativeY <= this.snapThreshold;
        const nearBottom = relativeY >= height - this.snapThreshold;
        
        // Corner snapping (priority)
        if (nearLeft && nearTop) return 'topLeft';
        if (nearRight && nearTop) return 'topRight';
        if (nearLeft && nearBottom) return 'bottomLeft';
        if (nearRight && nearBottom) return 'bottomRight';
        
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
        
        // Calculate absolute positions
        const left = typeof zone.x === 'string' 
            ? containerRect.left + (parseFloat(zone.x) / 100) * containerRect.width
            : containerRect.left + zone.x;
        
        const top = typeof zone.y === 'string'
            ? containerRect.top + (parseFloat(zone.y) / 100) * containerRect.height
            : containerRect.top + zone.y;
        
        const width = typeof zone.width === 'string'
            ? zone.width.includes('calc')
                ? containerRect.width // Simplified for calc expressions
                : (parseFloat(zone.width) / 100) * containerRect.width
            : zone.width;
        
        const height = typeof zone.height === 'string'
            ? zone.height.includes('calc')
                ? containerRect.height - 50 // Account for taskbar
                : (parseFloat(zone.height) / 100) * containerRect.height
            : zone.height;

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

        // Apply snap position and size
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
                // Use existing maximized drag logic
                const result = windowApp.handleDragStartOnMaximized(mouseX, mouseY);
                delete windowElement.dataset.snapped;
                return result;
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
