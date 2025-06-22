export class WindowBase {
    constructor(id, title, options = {}) {
        this.id = id;
        this.title = title;
        this.options = {
            width: '60%',
            height: '50%',
            ...options
        };
        this.windowElement = null;
        this.isMaximized = false;
        this.originalDimensions = null;
    }

    // Abstract method to be implemented by child classes
    createContent() {
        throw new Error('createContent() must be implemented by child classes');
    }

    // Get the icon for this window
    getIcon() {
        const icons = {
            'browser': 'globe',
            'terminal': 'terminal',
            'files': 'folder',
            'email': 'envelope',
            'wireshark': 'router',
            'security': 'shield-check',
            'logs': 'journal-text',
            'help': 'question-circle',
            'hint': 'lightbulb',
            'progress': 'clipboard-data'
        };
        return icons[this.id] || 'window';
    }

    // Get the icon class for taskbar
    getIconClass() {
        return `bi-${this.getIcon()}`;
    }

    // Create the window structure
    createWindow() {
        this.windowElement = document.createElement('div');
        this.windowElement.className = 'absolute bg-gray-800 border border-gray-600 rounded shadow-2xl overflow-hidden min-w-72 min-h-48 backdrop-blur-lg';
        this.windowElement.style.width = this.options.width;
        this.windowElement.style.height = this.options.height;
        this.windowElement.style.left = `${Math.random() * 20 + 10}%`;
        this.windowElement.style.top = `${Math.random() * 20 + 10}%`;

        this.windowElement.innerHTML = `
            <div class="window-header bg-gradient-to-r from-gray-700 to-gray-600 px-3 py-2 flex justify-between items-center border-b border-gray-600 cursor-grab select-none">
                <div class="window-title text-white text-sm font-semibold flex items-center space-x-2">
                    <i class="bi bi-${this.getIcon()}"></i>
                    <span>${this.title}</span>
                </div>
                <div class="window-controls flex space-x-1">
                    <button class="window-btn minimize w-6 h-6 rounded bg-yellow-500 hover:bg-yellow-400 flex items-center justify-center text-black text-xs transition-all duration-200 hover:shadow-md cursor-pointer" title="Minimize">
                        <i class="bi bi-dash"></i>
                    </button>
                    <button class="window-btn maximize w-6 h-6 rounded bg-green-500 hover:bg-green-400 flex items-center justify-center text-black text-xs transition-all duration-200 hover:shadow-md cursor-pointer" title="Maximize">
                        <i class="bi bi-square"></i>
                    </button>
                    <button class="window-btn close w-6 h-6 rounded bg-red-500 hover:bg-red-400 flex items-center justify-center text-white text-xs transition-all duration-200 hover:shadow-md cursor-pointer" title="Close">
                        <i class="bi bi-x"></i>
                    </button>
                </div>
            </div>
            <div class="window-content h-full overflow-auto bg-black text-white" style="height: calc(100% - 40px);">
                ${this.createContent()}
            </div>
            <!-- Resize handles -->
            <div class="resize-handle resize-n absolute top-0 left-0 right-0 h-1 cursor-n-resize"></div>
            <div class="resize-handle resize-s absolute bottom-0 left-0 right-0 h-1 cursor-s-resize"></div>
            <div class="resize-handle resize-w absolute top-0 bottom-0 left-0 w-1 cursor-w-resize"></div>
            <div class="resize-handle resize-e absolute top-0 bottom-0 right-0 w-1 cursor-e-resize"></div>
            <div class="resize-handle resize-nw absolute top-0 left-0 w-3 h-3 cursor-nw-resize"></div>
            <div class="resize-handle resize-ne absolute top-0 right-0 w-3 h-3 cursor-ne-resize"></div>
            <div class="resize-handle resize-sw absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize"></div>
            <div class="resize-handle resize-se absolute bottom-0 right-0 w-3 h-3 cursor-se-resize"></div>
        `;

        return this.windowElement;
    }

    // Initialize the window after creation
    initialize() {
        // Override in child classes for specific initialization
    }

    // Clean up when window is closed
    cleanup() {
        // Override in child classes for specific cleanup
    }

    // Update window content (useful for dynamic content)
    updateContent() {
        const contentElement = this.windowElement?.querySelector('.window-content');
        if (contentElement) {
            contentElement.innerHTML = this.createContent();
        }
    }

    // Get window state for saving/restoring
    getState() {
        if (!this.windowElement) return null;

        return {
            id: this.id,
            title: this.title,
            width: this.windowElement.style.width,
            height: this.windowElement.style.height,
            left: this.windowElement.style.left,
            top: this.windowElement.style.top,
            isMaximized: this.isMaximized,
            zIndex: this.windowElement.style.zIndex
        };
    }

    // Restore window state
    setState(state) {
        if (!this.windowElement || !state) return;

        this.windowElement.style.width = state.width;
        this.windowElement.style.height = state.height;
        this.windowElement.style.left = state.left;
        this.windowElement.style.top = state.top;
        this.windowElement.style.zIndex = state.zIndex;
        this.isMaximized = state.isMaximized;
    }
}
