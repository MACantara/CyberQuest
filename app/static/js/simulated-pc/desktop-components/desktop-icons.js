export class DesktopIcons {
    constructor(container, windowManager) {
        this.container = container;
        this.windowManager = windowManager;
        this.selectedIcon = null;
        this.icons = [
            { id: 'browser', name: 'Web Browser', icon: 'bi-globe', action: 'openBrowser' },
            { id: 'terminal', name: 'Terminal', icon: 'bi-terminal', action: 'openTerminal' },
            { id: 'files', name: 'File Manager', icon: 'bi-folder', action: 'openFileManager' },
            { id: 'email', name: 'Email Client', icon: 'bi-envelope', action: 'openEmailClient' },
            { id: 'wireshark', name: 'Network Monitor', icon: 'bi-router', action: 'openNetworkMonitor' },
            { id: 'security', name: 'Security Tools', icon: 'bi-shield-check', action: 'openSecurityTools' },
            { id: 'logs', name: 'System Logs', icon: 'bi-journal-text', action: 'openSystemLogs' }
        ];
        this.init();
    }

    init() {
        this.createIcons();
        this.bindEvents();
    }

    createIcons() {
        this.iconsContainer = document.createElement('div');
        this.iconsContainer.className = 'absolute top-5 left-5 flex flex-col space-y-5';
        this.iconsContainer.innerHTML = this.generateIconsHTML();
        this.container.appendChild(this.iconsContainer);
    }

    generateIconsHTML() {
        return this.icons.map(icon => `
            <div class="desktop-icon flex flex-col items-center w-20 cursor-pointer p-2.5 rounded hover:bg-white/25 transition-all duration-200" data-action="${icon.action}" data-id="${icon.id}">
                <div class="w-12 h-12 bg-green-400 border-2 border-gray-600 rounded flex items-center justify-center text-2xl text-black mb-1 shadow-lg">
                    <i class="bi ${icon.icon}"></i>
                </div>
                <div class="text-xs text-center text-white text-shadow-sm max-w-[70px] break-words leading-tight">${icon.name}</div>
            </div>
        `).join('');
    }

    bindEvents() {
        // Desktop icon clicks
        this.iconsContainer.querySelectorAll('.desktop-icon').forEach(icon => {
            icon.addEventListener('click', (e) => {
                this.selectIcon(icon);
            });
            
            icon.addEventListener('dblclick', (e) => {
                const action = icon.dataset.action;
                if (this.windowManager[action]) {
                    this.windowManager[action]();
                }
            });
        });

        // Clear selection when clicking on empty desktop
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) {
                this.clearSelection();
            }
        });
    }

    selectIcon(icon) {
        this.clearSelection();
        icon.classList.add('bg-green-400/50', 'border', 'border-green-400', 'border-opacity-75');
        this.selectedIcon = icon;
    }

    clearSelection() {
        if (this.selectedIcon) {
            this.selectedIcon.classList.remove('bg-green-400/50', 'border', 'border-green-400', 'border-opacity-75');
            this.selectedIcon = null;
        }
    }
}
