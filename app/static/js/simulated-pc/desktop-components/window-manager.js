import { BrowserApp } from './desktop-applications/browser-app.js';
import { TerminalApp } from './desktop-applications/terminal-app.js';
import { FileManagerApp } from './desktop-applications/file-manager-app.js';
import { EmailApp } from './desktop-applications/email-app.js';
import { NetworkMonitorApp } from './desktop-applications/network-monitor-app.js';
import { SystemLogsApp } from './desktop-applications/system-logs-app.js';
import { ControlPanelApp } from './control-panel.js';
import { WindowSnapManager } from './window-snap-manager.js';

export class WindowManager {
    constructor(container, taskbar, tutorialManager = null) {
        this.container = container;
        this.taskbar = taskbar;
        this.tutorialManager = tutorialManager;
        this.windows = new Map();
        this.applications = new Map();
        this.zIndex = 1000;
        
        // Ensure CSS is loaded before creating snap manager
        this.ensureWindowStylesLoaded();
        this.snapManager = new WindowSnapManager(container);
        
        // Application registry for easier management
        this.appRegistry = {
            'browser': { class: BrowserApp, storageKey: 'cyberquest_browser_opened', tutorialMethod: 'shouldAutoStartBrowser', startMethod: 'startBrowserTutorial' },
            'terminal': { class: TerminalApp, storageKey: 'cyberquest_terminal_opened', tutorialMethod: 'shouldAutoStartTerminal', startMethod: 'startTerminalTutorial' },
            'files': { class: FileManagerApp, storageKey: 'cyberquest_filemanager_opened', tutorialMethod: 'shouldAutoStartFileManager', startMethod: 'startFileManagerTutorial' },
            'email': { class: EmailApp, storageKey: 'cyberquest_email_opened', tutorialMethod: 'shouldAutoStartEmail', startMethod: 'startEmailTutorial' },
            'wireshark': { class: NetworkMonitorApp, storageKey: 'cyberquest_networkmonitor_opened', tutorialMethod: 'shouldAutoStartNetworkMonitor', startMethod: 'startNetworkMonitorTutorial' },
            'logs': { class: SystemLogsApp, storageKey: 'cyberquest_systemlogs_opened', tutorialMethod: 'shouldAutoStartSystemLogs', startMethod: 'startSystemLogsTutorial' }
        };
    }

    // Ensure window styles are loaded
    ensureWindowStylesLoaded() {
        if (document.getElementById('window-scrollbar-styles')) return;

        const link = document.createElement('link');
        link.id = 'window-scrollbar-styles';
        link.rel = 'stylesheet';
        link.href = '/static/css/simulated-pc/windows.css';
        document.head.appendChild(link);
    }

    // Generic application opener that handles tutorial logic
    async openApplication(appId, windowTitle) {
        const appConfig = this.appRegistry[appId];
        if (!appConfig) {
            throw new Error(`Application '${appId}' not found in registry`);
        }

        const isFirstTime = !localStorage.getItem(appConfig.storageKey);
        const app = new appConfig.class();
        
        this.createWindow(appId, windowTitle, app);
        localStorage.setItem(appConfig.storageKey, 'true');

        // Handle tutorial auto-start if it's the first time and tutorial manager is available
        if (isFirstTime && this.tutorialManager && appConfig.tutorialMethod && appConfig.startMethod) {
            await this.handleTutorialAutoStart(appConfig.tutorialMethod, appConfig.startMethod);
        }
    }

    // Shared tutorial auto-start logic
    async handleTutorialAutoStart(tutorialCheckMethod, tutorialStartMethod) {
        try {
            const shouldStart = await this.tutorialManager[tutorialCheckMethod]();
            if (shouldStart) {
                setTimeout(async () => {
                    await this.tutorialManager[tutorialStartMethod]();
                }, 1500);
            }
        } catch (error) {
            console.warn(`Tutorial auto-start failed: ${error.message}`);
        }
    }

    // Special case for email which needs async handling
    async handleEmailTutorialAutoStart() {
        try {
            const shouldStart = await this.tutorialManager.shouldAutoStartEmail();
            if (shouldStart) {
                setTimeout(async () => {
                    await this.tutorialManager.startEmailTutorial();
                }, 1500);
            }
        } catch (error) {
            console.warn(`Email tutorial auto-start failed: ${error.message}`);
        }
    }

    createWindow(id, title, contentOrApp, options = {}) {
        if (this.windows.has(id)) {
            // Bring existing window to front
            const existingWindow = this.windows.get(id);
            existingWindow.style.zIndex = ++this.zIndex;
            this.taskbar.setActiveWindow(id);
            return existingWindow;
        }

        let windowElement;
        let app = null;

        // Check if contentOrApp is a WindowBase application
        if (contentOrApp && typeof contentOrApp.createWindow === 'function') {
            app = contentOrApp;
            windowElement = app.createWindow();
            this.applications.set(id, app);
        } else {
            // Legacy string content support
            windowElement = this.createLegacyWindow(id, title, contentOrApp, options);
        }

        windowElement.style.zIndex = ++this.zIndex;
        this.container.appendChild(windowElement);
        this.windows.set(id, windowElement);

        // Add to taskbar
        const iconClass = app ? app.getIconClass() : this.getIconClassForWindow(id);
        this.taskbar.addWindow(id, title, iconClass);

        // Bind window events
        this.bindWindowEvents(windowElement, id);

        // Make window draggable and resizable
        this.makeDraggable(windowElement);
        this.makeResizable(windowElement);

        // Initialize application if it exists
        if (app && typeof app.initialize === 'function') {
            app.initialize();
        }

        return windowElement;
    }

    // Legacy window creation for backwards compatibility
    createLegacyWindow(id, title, content, options) {
        const window = document.createElement('div');
        window.className = 'absolute bg-gray-800 border border-gray-600 rounded shadow-2xl overflow-hidden min-w-72 min-h-48 backdrop-blur-lg';
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
                ${content}
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

        return window;
    }

    getIconForWindow(id) {
        const icons = {
            'browser': 'globe',
            'terminal': 'terminal',
            'files': 'folder',
            'email': 'envelope',
            'wireshark': 'router',
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

        // Bring to front on click and set as active
        window.addEventListener('mousedown', () => {
            window.style.zIndex = ++this.zIndex;
            this.taskbar.setActiveWindow(id);
        });
    }

    makeDraggable(window) {
        const header = window.querySelector('.window-header');
        let isDragging = false;
        let dragStarted = false;
        let startX, startY, startLeft, startTop;
        let windowApp = null;
        let currentSnapZone = null;

        // Get the window app instance if it exists
        this.applications.forEach((app, id) => {
            if (app.windowElement === window) {
                windowApp = app;
            }
        });

        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.window-controls')) return;
            
            isDragging = true;
            dragStarted = false;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = window.offsetLeft;
            startTop = window.offsetTop;
            
            header.style.cursor = 'grabbing';
            
            // Bring window to front
            window.style.zIndex = ++this.zIndex;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            // Check if this is the start of dragging
            if (!dragStarted) {
                // Check if window is maximized first (WindowBase apps)
                if (windowApp && windowApp.getMaximizedState && windowApp.getMaximizedState()) {
                    const result = windowApp.handleDragStartOnMaximized(e.clientX, e.clientY);
                    if (result) {
                        startLeft = result.left;
                        startTop = result.top;
                        startX = e.clientX;
                        startY = e.clientY;
                    }
                }
                // Check if window is snapped
                else if (this.snapManager.isWindowSnapped(window)) {
                    const snapResult = this.snapManager.handleDragStart(window, e.clientX, e.clientY, windowApp);
                    if (snapResult) {
                        startLeft = snapResult.left;
                        startTop = snapResult.top;
                        startX = e.clientX;
                        startY = e.clientY;
                    }
                }
                // Check legacy maximized state
                else if (window.dataset.maximized === 'true') {
                    // Handle legacy maximized windows
                    const originalWidth = window.dataset.originalWidth;
                    const originalHeight = window.dataset.originalHeight;
                    const originalLeft = window.dataset.originalLeft;
                    const originalTop = window.dataset.originalTop;
                    
                    if (originalWidth && originalHeight) {
                        // Restore original size
                        window.style.width = originalWidth;
                        window.style.height = originalHeight;
                        window.style.left = originalLeft;
                        window.style.top = originalTop;
                        window.dataset.maximized = 'false';
                        
                        // Update start position
                        startLeft = parseInt(originalLeft);
                        startTop = parseInt(originalTop);
                        startX = e.clientX;
                        startY = e.clientY;
                    }
                }
                
                dragStarted = true;
                return; // Don't apply normal drag movement on first frame
            }
            
            const newLeft = startLeft + deltaX;
            const newTop = startTop + deltaY;
            
            // Update window position
            window.style.left = `${newLeft}px`;
            window.style.top = `${newTop}px`;
            
            // Show snap preview
            currentSnapZone = this.snapManager.handleDragMove(e.clientX, e.clientY);
        });

        document.addEventListener('mouseup', (e) => {
            if (isDragging) {
                isDragging = false;
                dragStarted = false;
                header.style.cursor = 'grab';
                
                // Handle window snapping
                if (currentSnapZone) {
                    this.snapManager.handleDragEnd(window, e.clientX, e.clientY, windowApp);
                } else {
                    this.snapManager.hideSnapPreview();
                }
                currentSnapZone = null;
                
                // Double-click detection for maximize/restore
                if (Math.abs(e.clientX - startX) < 5 && Math.abs(e.clientY - startY) < 5) {
                    if (windowApp && e.detail === 2) {
                        // Check if window is snapped, if so unsnap first
                        if (this.snapManager.isWindowSnapped(window)) {
                            this.snapManager.unSnapWindow(window, windowApp);
                        } else {
                            windowApp.maximize();
                        }
                    }
                }
            }
        });
    }

    makeResizable(window) {
        const resizeHandles = window.querySelectorAll('.resize-handle');
        let isResizing = false;
        let resizeDirection = '';
        let startX, startY, startWidth, startHeight, startLeft, startTop;

        resizeHandles.forEach(handle => {
            handle.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                isResizing = true;
                resizeDirection = handle.classList[1]; // resize-n, resize-s, etc.
                
                startX = e.clientX;
                startY = e.clientY;
                startWidth = parseInt(window.offsetWidth, 10);
                startHeight = parseInt(window.offsetHeight, 10);
                startLeft = parseInt(window.offsetLeft, 10);
                startTop = parseInt(window.offsetTop, 10);
                
                // Bring window to front
                window.style.zIndex = ++this.zIndex;
                
                document.body.style.cursor = handle.style.cursor;
                document.body.style.userSelect = 'none';
            });
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            let newWidth = startWidth;
            let newHeight = startHeight;
            let newLeft = startLeft;
            let newTop = startTop;
            
            // Minimum window size
            const minWidth = 300;
            const minHeight = 200;

            switch (resizeDirection) {
                case 'resize-n':
                    newHeight = Math.max(minHeight, startHeight - deltaY);
                    newTop = startTop + (startHeight - newHeight);
                    break;
                case 'resize-s':
                    newHeight = Math.max(minHeight, startHeight + deltaY);
                    break;
                case 'resize-w':
                    newWidth = Math.max(minWidth, startWidth - deltaX);
                    newLeft = startLeft + (startWidth - newWidth);
                    break;
                case 'resize-e':
                    newWidth = Math.max(minWidth, startWidth + deltaX);
                    break;
                case 'resize-nw':
                    newWidth = Math.max(minWidth, startWidth - deltaX);
                    newHeight = Math.max(minHeight, startHeight - deltaY);
                    newLeft = startLeft + (startWidth - newWidth);
                    newTop = startTop + (startHeight - newHeight);
                    break;
                case 'resize-ne':
                    newWidth = Math.max(minWidth, startWidth + deltaX);
                    newHeight = Math.max(minHeight, startHeight - deltaY);
                    newTop = startTop + (startHeight - newHeight);
                    break;
                case 'resize-sw':
                    newWidth = Math.max(minWidth, startWidth - deltaX);
                    newHeight = Math.max(minHeight, startHeight + deltaY);
                    newLeft = startLeft + (startWidth - newWidth);
                    break;
                case 'resize-se':
                    newWidth = Math.max(minWidth, startWidth + deltaX);
                    newHeight = Math.max(minHeight, startHeight + deltaY);
                    break;
            }

            // Apply new dimensions and position without any boundary constraints
            // This allows resizing even when window is partially off-screen
            window.style.width = `${newWidth}px`;
            window.style.height = `${newHeight}px`;
            window.style.left = `${newLeft}px`;
            window.style.top = `${newTop}px`;
            
            // Reset maximized state if resizing
            window.dataset.maximized = 'false';
        });

        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                resizeDirection = '';
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            }
        });
    }

    closeWindow(id) {
        const window = this.windows.get(id);
        const app = this.applications.get(id);
        
        if (window) {
            // Call cleanup if application exists
            if (app && typeof app.cleanup === 'function') {
                app.cleanup();
            }
            
            window.remove();
            this.windows.delete(id);
            this.applications.delete(id);
            this.taskbar.removeWindow(id);
        }
    }

    minimizeWindow(id) {
        const window = this.windows.get(id);
        if (window) {
            window.style.display = 'none';
            this.taskbar.setWindowActive(id, false);
            
            // Clear active state if this was the active window
            if (this.taskbar.activeWindowId === id) {
                this.taskbar.activeWindowId = null;
            }
        }
    }

    maximizeWindow(id) {
        const window = this.windows.get(id);
        const app = this.applications.get(id);
        
        if (app && typeof app.maximize === 'function') {
            // Check if window is snapped first
            if (this.snapManager.isWindowSnapped(window)) {
                this.snapManager.unSnapWindow(window, app);
            } else {
                app.maximize();
            }
        } else if (window) {
            // Legacy maximize for non-app windows
            if (this.snapManager.isWindowSnapped(window)) {
                this.snapManager.unSnapWindow(window);
            } else if (window.dataset.maximized === 'true') {
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
                this.taskbar.setActiveWindow(id);
            } else {
                this.minimizeWindow(id);
            }
        }
    }

    // Simplified application launchers using the generic opener
    async openBrowser() {
        await this.openApplication('browser', 'Web Browser');
    }

    async openTerminal() {
        await this.openApplication('terminal', 'Terminal');
    }

    async openFileManager() {
        await this.openApplication('files', 'File Manager');
    }

    async openEmailClient() {
        await this.openApplication('email', 'Email Client');
    }

    async openNetworkMonitor() {
        await this.openApplication('wireshark', 'Network Monitor');
    }

    async openSystemLogs() {
        await this.openApplication('logs', 'System Logs');
    }

    // Utility methods for batch operations
    closeAllWindows() {
        const windowIds = Array.from(this.windows.keys());
        windowIds.forEach(id => this.closeWindow(id));
        this.snapManager.cleanup();
    }

    minimizeAllWindows() {
        const windowIds = Array.from(this.windows.keys());
        windowIds.forEach(id => this.minimizeWindow(id));
    }

    getOpenWindows() {
        return Array.from(this.windows.keys());
    }

    getOpenApplications() {
        return Array.from(this.applications.keys());
    }

    // Window state management
    saveWindowStates() {
        const states = {};
        this.applications.forEach((app, id) => {
            if (typeof app.getState === 'function') {
                states[id] = app.getState();
            }
        });
        return states;
    }

    restoreWindowStates(states) {
        Object.entries(states).forEach(([id, state]) => {
            const app = this.applications.get(id);
            if (app && typeof app.setState === 'function') {
                app.setState(state);
            }
        });
    }

    // Application registry helpers
    isApplicationRegistered(appId) {
        return this.appRegistry.hasOwnProperty(appId);
    }

    getRegisteredApplications() {
        return Object.keys(this.appRegistry);
    }

    addApplicationToRegistry(appId, config) {
        this.appRegistry[appId] = config;
    }

    removeApplicationFromRegistry(appId) {
        delete this.appRegistry[appId];
    }
}
