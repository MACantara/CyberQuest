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
        this.initializeScrollbarStyles();
    }

    // Initialize custom scrollbar styles
    initializeScrollbarStyles() {
        // Check if styles are already added
        if (document.getElementById('window-scrollbar-styles')) return;

        const scrollbarStyles = document.createElement('style');
        scrollbarStyles.id = 'window-scrollbar-styles';
        scrollbarStyles.textContent = `
            /* Custom scrollbar for window content */
            .window-content::-webkit-scrollbar {
                width: 12px;
                height: 12px;
            }

            .window-content::-webkit-scrollbar-track {
                background: #1f2937;
                border-radius: 6px;
                border: 1px solid #374151;
            }

            .window-content::-webkit-scrollbar-thumb {
                background: linear-gradient(180deg, #4b5563 0%, #374151 100%);
                border-radius: 6px;
                border: 1px solid #6b7280;
                box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
            }

            .window-content::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(180deg, #6b7280 0%, #4b5563 100%);
                border-color: #9ca3af;
            }

            .window-content::-webkit-scrollbar-thumb:active {
                background: linear-gradient(180deg, #10b981 0%, #059669 100%);
                border-color: #10b981;
                box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
            }

            .window-content::-webkit-scrollbar-corner {
                background: #1f2937;
                border: 1px solid #374151;
            }

            /* Custom scrollbar for specific content areas */
            .logs-container::-webkit-scrollbar,
            .packet-list::-webkit-scrollbar,
            .file-list::-webkit-scrollbar,
            .terminal-output::-webkit-scrollbar {
                width: 10px;
                height: 10px;
            }

            .logs-container::-webkit-scrollbar-track,
            .packet-list::-webkit-scrollbar-track,
            .file-list::-webkit-scrollbar-track,
            .terminal-output::-webkit-scrollbar-track {
                background: #111827;
                border-radius: 5px;
                border: 1px solid #1f2937;
            }

            .logs-container::-webkit-scrollbar-thumb,
            .packet-list::-webkit-scrollbar-thumb,
            .file-list::-webkit-scrollbar-thumb,
            .terminal-output::-webkit-scrollbar-thumb {
                background: linear-gradient(180deg, #374151 0%, #1f2937 100%);
                border-radius: 5px;
                border: 1px solid #4b5563;
                box-shadow: inset 0 1px 0 rgba(16, 185, 129, 0.1);
            }

            .logs-container::-webkit-scrollbar-thumb:hover,
            .packet-list::-webkit-scrollbar-thumb:hover,
            .file-list::-webkit-scrollbar-thumb:hover,
            .terminal-output::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(180deg, #4b5563 0%, #374151 100%);
                border-color: #6b7280;
                box-shadow: inset 0 1px 0 rgba(16, 185, 129, 0.2);
            }

            .logs-container::-webkit-scrollbar-thumb:active,
            .packet-list::-webkit-scrollbar-thumb:active,
            .file-list::-webkit-scrollbar-thumb:active,
            .terminal-output::-webkit-scrollbar-thumb:active {
                background: linear-gradient(180deg, #10b981 0%, #047857 100%);
                border-color: #10b981;
                box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3);
            }

            /* Firefox scrollbar support */
            .window-content {
                scrollbar-width: thin;
                scrollbar-color: #4b5563 #1f2937;
            }

            .logs-container,
            .packet-list,
            .file-list,
            .terminal-output {
                scrollbar-width: thin;
                scrollbar-color: #374151 #111827;
            }

            /* Scrollbar for log viewer and other specialized content */
            .log-content::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }

            .log-content::-webkit-scrollbar-track {
                background: #000000;
                border-radius: 4px;
            }

            .log-content::-webkit-scrollbar-thumb {
                background: linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%);
                border-radius: 4px;
                border: 1px solid #d97706;
            }

            .log-content::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(180deg, #fcd34d 0%, #fbbf24 100%);
                border-color: #f59e0b;
            }

            .log-content::-webkit-scrollbar-thumb:active {
                background: linear-gradient(180deg, #10b981 0%, #059669 100%);
                border-color: #10b981;
            }

            /* Security-themed scrollbar for security apps */
            .security-content::-webkit-scrollbar {
                width: 10px;
                height: 10px;
            }

            .security-content::-webkit-scrollbar-track {
                background: #7f1d1d;
                border-radius: 5px;
                border: 1px solid #991b1b;
            }

            .security-content::-webkit-scrollbar-thumb {
                background: linear-gradient(180deg, #dc2626 0%, #b91c1c 100%);
                border-radius: 5px;
                border: 1px solid #ef4444;
                box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
            }

            .security-content::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(180deg, #ef4444 0%, #dc2626 100%);
                border-color: #f87171;
            }

            .security-content::-webkit-scrollbar-thumb:active {
                background: linear-gradient(180deg, #10b981 0%, #059669 100%);
                border-color: #10b981;
            }

            /* Network monitor themed scrollbar */
            .network-content::-webkit-scrollbar {
                width: 10px;
                height: 10px;
            }

            .network-content::-webkit-scrollbar-track {
                background: #1e1b4b;
                border-radius: 5px;
                border: 1px solid #312e81;
            }

            .network-content::-webkit-scrollbar-thumb {
                background: linear-gradient(180deg, #3730a3 0%, #312e81 100%);
                border-radius: 5px;
                border: 1px solid #4f46e5;
                box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
            }

            .network-content::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(180deg, #4f46e5 0%, #3730a3 100%);
                border-color: #6366f1;
            }

            .network-content::-webkit-scrollbar-thumb:active {
                background: linear-gradient(180deg, #10b981 0%, #059669 100%);
                border-color: #10b981;
            }

            /* Smooth scrolling behavior */
            .window-content,
            .logs-container,
            .packet-list,
            .file-list,
            .terminal-output,
            .log-content,
            .security-content,
            .network-content {
                scroll-behavior: smooth;
            }

            /* Scrollbar glow effect on focus */
            .window-content:focus-within::-webkit-scrollbar-thumb {
                box-shadow: 
                    inset 0 1px 0 rgba(255, 255, 255, 0.1),
                    0 0 8px rgba(16, 185, 129, 0.3);
            }

            /* Responsive scrollbar sizing */
            @media (max-width: 768px) {
                .window-content::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                
                .logs-container::-webkit-scrollbar,
                .packet-list::-webkit-scrollbar,
                .file-list::-webkit-scrollbar,
                .terminal-output::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
            }
        `;
        document.head.appendChild(scrollbarStyles);
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

        // Store original dimensions for restore functionality
        this.originalDimensions = {
            width: this.options.width,
            height: this.options.height,
            left: this.windowElement.style.left,
            top: this.windowElement.style.top
        };

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

    // Store current dimensions as original (for maximize/restore)
    storeOriginalDimensions() {
        if (this.windowElement && !this.isMaximized) {
            this.originalDimensions = {
                width: this.windowElement.style.width,
                height: this.windowElement.style.height,
                left: this.windowElement.style.left,
                top: this.windowElement.style.top
            };
        }
    }

    // Restore window to original dimensions
    restoreOriginalDimensions() {
        if (this.windowElement && this.originalDimensions) {
            this.windowElement.style.width = this.originalDimensions.width;
            this.windowElement.style.height = this.originalDimensions.height;
            this.windowElement.style.left = this.originalDimensions.left;
            this.windowElement.style.top = this.originalDimensions.top;
            this.isMaximized = false;
        }
    }

    // Maximize window
    maximize() {
        if (this.windowElement) {
            if (this.isMaximized) {
                // Restore from maximized
                this.restoreOriginalDimensions();
            } else {
                // Store current dimensions before maximizing
                this.storeOriginalDimensions();
                
                // Maximize
                this.windowElement.style.width = '100%';
                this.windowElement.style.height = 'calc(100% - 50px)';
                this.windowElement.style.left = '0';
                this.windowElement.style.top = '0';
                this.isMaximized = true;
            }
        }
    }

    // Check if window is maximized
    getMaximizedState() {
        return this.isMaximized;
    }

    // Method to handle drag start on maximized window
    handleDragStartOnMaximized(mouseX, mouseY) {
        if (this.isMaximized && this.originalDimensions) {
            // Calculate the relative position where the mouse should be after restore
            const windowWidth = parseInt(this.originalDimensions.width);
            const mouseRatio = mouseX / window.innerWidth;
            
            // Restore window size first
            this.restoreOriginalDimensions();
            
            // Position the window so the mouse stays relative to where it was
            const newLeft = mouseX - (windowWidth * mouseRatio);
            const newTop = mouseY - 20; // Offset for header height
            
            this.windowElement.style.left = `${Math.max(0, newLeft)}px`;
            this.windowElement.style.top = `${Math.max(0, newTop)}px`;
            
            return {
                left: parseInt(this.windowElement.style.left),
                top: parseInt(this.windowElement.style.top)
            };
        }
        return null;
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
