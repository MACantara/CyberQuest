export class WindowResizeManager {
    constructor(windowManager) {
        this.windowManager = windowManager;
        this.isResizing = false;
        this.resizeDirection = '';
        this.startX = 0;
        this.startY = 0;
        this.startWidth = 0;
        this.startHeight = 0;
        this.startLeft = 0;
        this.startTop = 0;
        this.minWidth = 300;
        this.minHeight = 200;
        
        this.bindGlobalEvents();
    }

    makeResizable(window) {
        const resizeHandles = window.querySelectorAll('.resize-handle');
        
        resizeHandles.forEach(handle => {
            handle.addEventListener('mousedown', (e) => {
                this.startResize(e, handle, window);
            });
        });
    }

    startResize(e, handle, window) {
        e.preventDefault();
        e.stopPropagation();
        
        this.isResizing = true;
        this.resizeDirection = handle.classList[1]; // resize-n, resize-s, etc.
        
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.startWidth = parseInt(window.offsetWidth, 10);
        this.startHeight = parseInt(window.offsetHeight, 10);
        this.startLeft = parseInt(window.offsetLeft, 10);
        this.startTop = parseInt(window.offsetTop, 10);
        
        // Bring window to front
        window.style.zIndex = ++this.windowManager.zIndex;
        
        // Set cursor and prevent text selection
        document.body.style.cursor = handle.style.cursor;
        document.body.style.userSelect = 'none';
        
        // Store reference to current window
        this.currentWindow = window;
    }

    handleResizeMove(e) {
        if (!this.isResizing || !this.currentWindow) return;

        const deltaX = e.clientX - this.startX;
        const deltaY = e.clientY - this.startY;
        
        let newWidth = this.startWidth;
        let newHeight = this.startHeight;
        let newLeft = this.startLeft;
        let newTop = this.startTop;

        // Calculate new dimensions based on resize direction
        switch (this.resizeDirection) {
            case 'resize-n':
                newHeight = Math.max(this.minHeight, this.startHeight - deltaY);
                newTop = this.startTop + (this.startHeight - newHeight);
                break;
            case 'resize-s':
                newHeight = Math.max(this.minHeight, this.startHeight + deltaY);
                break;
            case 'resize-w':
                newWidth = Math.max(this.minWidth, this.startWidth - deltaX);
                newLeft = this.startLeft + (this.startWidth - newWidth);
                break;
            case 'resize-e':
                newWidth = Math.max(this.minWidth, this.startWidth + deltaX);
                break;
            case 'resize-nw':
                newWidth = Math.max(this.minWidth, this.startWidth - deltaX);
                newHeight = Math.max(this.minHeight, this.startHeight - deltaY);
                newLeft = this.startLeft + (this.startWidth - newWidth);
                newTop = this.startTop + (this.startHeight - newHeight);
                break;
            case 'resize-ne':
                newWidth = Math.max(this.minWidth, this.startWidth + deltaX);
                newHeight = Math.max(this.minHeight, this.startHeight - deltaY);
                newTop = this.startTop + (this.startHeight - newHeight);
                break;
            case 'resize-sw':
                newWidth = Math.max(this.minWidth, this.startWidth - deltaX);
                newHeight = Math.max(this.minHeight, this.startHeight + deltaY);
                newLeft = this.startLeft + (this.startWidth - newWidth);
                break;
            case 'resize-se':
                newWidth = Math.max(this.minWidth, this.startWidth + deltaX);
                newHeight = Math.max(this.minHeight, this.startHeight + deltaY);
                break;
        }

        // Apply new dimensions and position
        this.currentWindow.style.width = `${newWidth}px`;
        this.currentWindow.style.height = `${newHeight}px`;
        this.currentWindow.style.left = `${newLeft}px`;
        this.currentWindow.style.top = `${newTop}px`;
        
        // Reset maximized/snapped state if resizing
        this.resetWindowState(this.currentWindow);
    }

    stopResize() {
        if (this.isResizing) {
            this.isResizing = false;
            this.resizeDirection = '';
            this.currentWindow = null;
            
            // Restore cursor and text selection
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
    }

    resetWindowState(window) {
        // Reset maximized state if resizing
        window.dataset.maximized = 'false';
        
        // Reset snap state if window is snapped
        if (window.dataset.snapped) {
            delete window.dataset.snapped;
        }
        
        // Reset WindowBase maximized state if applicable
        const windowApp = this.getWindowApp(window);
        if (windowApp && windowApp.isMaximized) {
            windowApp.isMaximized = false;
        }
    }

    getWindowApp(window) {
        // Find the window app instance if it exists
        let windowApp = null;
        this.windowManager.applications.forEach((app) => {
            if (app.windowElement === window) {
                windowApp = app;
            }
        });
        return windowApp;
    }

    bindGlobalEvents() {
        // Global mouse move handler
        document.addEventListener('mousemove', (e) => {
            this.handleResizeMove(e);
        });

        // Global mouse up handler
        document.addEventListener('mouseup', () => {
            this.stopResize();
        });
    }

    setMinimumSize(width, height) {
        this.minWidth = width;
        this.minHeight = height;
    }

    getMinimumSize() {
        return {
            width: this.minWidth,
            height: this.minHeight
        };
    }

    isCurrentlyResizing() {
        return this.isResizing;
    }

    getCurrentResizeDirection() {
        return this.resizeDirection;
    }

    cleanup() {
        this.stopResize();
        // Note: Global event listeners are intentionally kept as they're shared
        // across all windows and the resize manager is typically a singleton
    }
}
