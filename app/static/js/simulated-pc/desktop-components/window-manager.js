import { ApplicationFactory } from './application-factory.js';

export class WindowManager {
    constructor(container, taskbar) {
        this.container = container;
        this.taskbar = taskbar;
        this.windows = new Map();
        this.zIndex = 1000;
        this.applicationFactory = new ApplicationFactory();
    }

    createWindow(id, title, content, options = {}) {
        if (this.windows.has(id)) {
            // Bring existing window to front
            const existingWindow = this.windows.get(id);
            existingWindow.style.zIndex = ++this.zIndex;
            this.taskbar.setWindowActive(id, true);
            return;
        }

        const window = document.createElement('div');
        window.className = 'absolute bg-gray-800 border border-gray-600 rounded-lg shadow-2xl overflow-hidden min-w-72 min-h-48 backdrop-blur-lg';
        window.style.zIndex = ++this.zIndex;
        window.style.width = options.width || '60%';
        window.style.height = options.height || '50%';
        window.style.left = `${Math.random() * 20 + 10}%`;
        window.style.top = `${Math.random() * 20 + 10}%`;

        window.innerHTML = `
            <div class="window-header bg-gradient-to-r from-gray-700 to-gray-600 px-3 py-2 flex justify-between items-center border-b border-gray-600 cursor-grab select-none">
                <div class="window-title text-white text-sm font-semibold flex items-center space-x-2">
                    <i class="bi bi-${this.getIconForWindow(id)}"></i>
                    <span>${title}</span>
                </div>
                <div class="window-controls flex space-x-1">
                    <button class="window-btn minimize w-6 h-6 rounded bg-yellow-500 hover:bg-yellow-400 flex items-center justify-center text-black text-xs transition-all duration-200 hover:scale-110 hover:shadow-md" title="Minimize">
                        <i class="bi bi-dash"></i>
                    </button>
                    <button class="window-btn maximize w-6 h-6 rounded bg-green-500 hover:bg-green-400 flex items-center justify-center text-black text-xs transition-all duration-200 hover:scale-110 hover:shadow-md" title="Maximize">
                        <i class="bi bi-square"></i>
                    </button>
                    <button class="window-btn close w-6 h-6 rounded bg-red-500 hover:bg-red-400 flex items-center justify-center text-white text-xs transition-all duration-200 hover:scale-110 hover:shadow-md" title="Close">
                        <i class="bi bi-x"></i>
                    </button>
                </div>
            </div>
            <div class="window-content h-full overflow-auto bg-black text-white" style="height: calc(100% - 40px);">
                ${content}
            </div>
        `;

        this.container.appendChild(window);
        this.windows.set(id, window);

        // Add to taskbar
        const iconClass = this.getIconClassForWindow(id);
        this.taskbar.addWindow(id, title, iconClass);

        // Bind window events
        this.bindWindowEvents(window, id);

        // Make window draggable
        this.makeDraggable(window);
    }

    getIconForWindow(id) {
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
        return icons[id] || 'window';
    }

    getIconClassForWindow(id) {
        return `bi-${this.getIconForWindow(id)}`;
    }

    bindWindowEvents(window, id) {
        // Close button
        window.querySelector('.close').addEventListener('click', () => {
            this.closeWindow(id);
        });

        // Minimize button
        window.querySelector('.minimize').addEventListener('click', () => {
            this.minimizeWindow(id);
        });

        // Maximize button
        window.querySelector('.maximize').addEventListener('click', () => {
            this.maximizeWindow(id);
        });

        // Bring to front on click
        window.addEventListener('mousedown', () => {
            window.style.zIndex = ++this.zIndex;
        });
    }

    makeDraggable(window) {
        const header = window.querySelector('.window-header');
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.window-controls')) return;
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = window.offsetLeft;
            startTop = window.offsetTop;
            
            header.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            window.style.left = `${startLeft + deltaX}px`;
            window.style.top = `${startTop + deltaY}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            header.style.cursor = 'grab';
        });
    }

    closeWindow(id) {
        const window = this.windows.get(id);
        if (window) {
            window.remove();
            this.windows.delete(id);
            this.taskbar.removeWindow(id);
        }
    }

    minimizeWindow(id) {
        const window = this.windows.get(id);
        if (window) {
            window.style.display = 'none';
            this.taskbar.setWindowActive(id, false);
        }
    }

    maximizeWindow(id) {
        const window = this.windows.get(id);
        if (window) {
            if (window.dataset.maximized === 'true') {
                // Restore
                window.style.width = window.dataset.originalWidth;
                window.style.height = window.dataset.originalHeight;
                window.style.left = window.dataset.originalLeft;
                window.style.top = window.dataset.originalTop;
                window.dataset.maximized = 'false';
            } else {
                // Maximize
                window.dataset.originalWidth = window.style.width;
                window.dataset.originalHeight = window.style.height;
                window.dataset.originalLeft = window.style.left;
                window.dataset.originalTop = window.style.top;
                
                window.style.width = '100%';
                window.style.height = 'calc(100% - 50px)';
                window.style.left = '0';
                window.style.top = '0';
                window.dataset.maximized = 'true';
            }
        }
    }

    toggleWindow(id) {
        const window = this.windows.get(id);
        
        if (window) {
            if (window.style.display === 'none') {
                window.style.display = 'block';
                window.style.zIndex = ++this.zIndex;
                this.taskbar.setWindowActive(id, true);
            } else {
                this.minimizeWindow(id);
            }
        }
    }

    // Application launchers
    openBrowser() {
        this.createWindow('browser', 'Web Browser', this.applicationFactory.createBrowserContent(), {
            width: '80%',
            height: '70%'
        });
    }

    openTerminal() {
        this.createWindow('terminal', 'Terminal', this.applicationFactory.createTerminalContent(), {
            width: '70%',
            height: '60%'
        });
    }

    openFileManager() {
        this.createWindow('files', 'File Manager', this.applicationFactory.createFileManagerContent(), {
            width: '75%',
            height: '65%'
        });
    }

    openEmailClient() {
        this.createWindow('email', 'Email Client', this.applicationFactory.createEmailContent(), {
            width: '80%',
            height: '70%'
        });
    }

    openNetworkMonitor() {
        this.createWindow('wireshark', 'Network Monitor', this.applicationFactory.createNetworkMonitorContent(), {
            width: '85%',
            height: '75%'
        });
    }

    openSecurityTools() {
        this.createWindow('security', 'Security Tools', this.applicationFactory.createSecurityToolsContent(), {
            width: '70%',
            height: '60%'
        });
    }

    openSystemLogs() {
        this.createWindow('logs', 'System Logs', this.applicationFactory.createSystemLogsContent(), {
            width: '75%',
            height: '65%'
        });
    }
}
