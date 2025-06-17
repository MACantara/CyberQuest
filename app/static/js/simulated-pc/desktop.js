export class Desktop {
    constructor(container) {
        this.container = container;
        this.windows = new Map();
        this.zIndex = 1000;
        this.selectedIcon = null;
        this.initializeDesktop();
    }

    initializeDesktop() {
        this.container.innerHTML = `
            <div class="relative w-full h-full bg-gradient-to-br from-blue-800 via-blue-900 to-indigo-900" style="background-image: radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(0, 255, 0, 0.05) 0%, transparent 50%);">
                <div class="absolute top-5 left-5 flex flex-col space-y-5">
                    ${this.createDesktopIcons()}
                </div>
                <div class="absolute bottom-0 left-0 w-full h-12 bg-gray-800 border-t border-gray-600 flex items-center px-2.5 shadow-lg">
                    <button class="bg-gray-700 border border-gray-600 text-white px-4 py-2 text-xs font-mono hover:bg-green-400 hover:text-black transition-all duration-200 hover:shadow-lg" id="start-btn">
                        <i class="bi bi-grid-3x3-gap mr-1"></i> Start
                    </button>
                    <div class="flex-1 flex items-center space-x-2.5 ml-5" id="taskbar-items"></div>
                    <div class="flex items-center space-x-4">
                        <span class="text-gray-300 text-xs text-center leading-tight" id="system-clock"></span>
                    </div>
                </div>
                <div class="absolute top-5 right-5 bg-gray-800 border border-gray-600 rounded-lg p-4 shadow-xl min-w-48">
                    <h3 class="text-green-400 text-sm font-bold mb-4 pb-1 border-b border-gray-600">Mission Control</h3>
                    <button class="control-button w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 mb-2 text-xs text-left hover:bg-gray-600 hover:shadow-lg transition-all duration-200" id="help-btn">
                        <i class="bi bi-question-circle mr-2"></i> Help
                    </button>
                    <button class="control-button w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 mb-2 text-xs text-left hover:bg-gray-600 hover:shadow-lg transition-all duration-200" id="hint-btn">
                        <i class="bi bi-lightbulb mr-2"></i> Hint
                    </button>
                    <button class="control-button w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 mb-2 text-xs text-left hover:bg-gray-600 hover:shadow-lg transition-all duration-200" id="progress-btn">
                        <i class="bi bi-clipboard-data mr-2"></i> Progress
                    </button>
                    <button class="control-button w-full border border-red-400 text-red-400 px-3 py-2 text-xs text-left hover:bg-red-400 hover:text-black transition-all duration-200" id="exit-btn">
                        <i class="bi bi-box-arrow-left mr-2"></i> Exit Simulation
                    </button>
                </div>
            </div>
        `;

        this.bindEvents();
        this.startClock();
    }

    createDesktopIcons() {
        const icons = [
            { id: 'browser', name: 'Web Browser', icon: 'bi-globe', action: 'openBrowser' },
            { id: 'terminal', name: 'Terminal', icon: 'bi-terminal', action: 'openTerminal' },
            { id: 'files', name: 'File Manager', icon: 'bi-folder', action: 'openFileManager' },
            { id: 'email', name: 'Email Client', icon: 'bi-envelope', action: 'openEmailClient' },
            { id: 'wireshark', name: 'Network Monitor', icon: 'bi-router', action: 'openNetworkMonitor' },
            { id: 'security', name: 'Security Tools', icon: 'bi-shield-check', action: 'openSecurityTools' },
            { id: 'logs', name: 'System Logs', icon: 'bi-journal-text', action: 'openSystemLogs' }
        ];

        return icons.map(icon => `
            <div class="desktop-icon flex flex-col items-center w-20 cursor-pointer p-2.5 rounded hover:bg-white hover:bg-opacity-10 transition-all duration-200" data-action="${icon.action}" data-id="${icon.id}">
                <div class="w-12 h-12 bg-green-400 border-2 border-gray-600 rounded flex items-center justify-center text-2xl text-black mb-1 shadow-lg">
                    <i class="bi ${icon.icon}"></i>
                </div>
                <div class="text-xs text-center text-white text-shadow-sm max-w-[70px] break-words leading-tight">${icon.name}</div>
            </div>
        `).join('');
    }

    bindEvents() {
        // Desktop icon clicks
        this.container.querySelectorAll('.desktop-icon').forEach(icon => {
            icon.addEventListener('click', (e) => {
                this.selectIcon(icon);
            });
            
            icon.addEventListener('dblclick', (e) => {
                const action = icon.dataset.action;
                if (this[action]) {
                    this[action]();
                }
            });
        });

        // Control panel buttons
        this.container.querySelector('#exit-btn').addEventListener('click', () => {
            this.exitSimulation();
        });

        this.container.querySelector('#help-btn').addEventListener('click', () => {
            this.showHelp();
        });

        this.container.querySelector('#hint-btn').addEventListener('click', () => {
            this.showHint();
        });

        this.container.querySelector('#progress-btn').addEventListener('click', () => {
            this.showProgress();
        });

        // Clear selection when clicking on empty desktop
        this.container.querySelector('.relative').addEventListener('click', (e) => {
            if (e.target === this.container.querySelector('.relative')) {
                this.clearSelection();
            }
        });
    }

    selectIcon(icon) {
        this.clearSelection();
        icon.classList.add('bg-green-400', 'bg-opacity-20', 'border', 'border-green-400');
        this.selectedIcon = icon;
    }

    clearSelection() {
        if (this.selectedIcon) {
            this.selectedIcon.classList.remove('bg-green-400', 'bg-opacity-20', 'border', 'border-green-400');
            this.selectedIcon = null;
        }
    }

    startClock() {
        const updateClock = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
            });
            const dateString = now.toLocaleDateString([], {
                month: '2-digit',
                day: '2-digit'
            });
            
            const clockElement = this.container.querySelector('#system-clock');
            if (clockElement) {
                clockElement.innerHTML = `${timeString}<br>${dateString}`;
            }
        };

        updateClock();
        setInterval(updateClock, 1000);
    }

    createWindow(id, title, content, options = {}) {
        if (this.windows.has(id)) {
            // Bring existing window to front
            const existingWindow = this.windows.get(id);
            existingWindow.style.zIndex = ++this.zIndex;
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
                    <button class="window-btn w-6 h-6 rounded bg-yellow-500 hover:bg-yellow-400 flex items-center justify-center text-black text-xs transition-all duration-200 hover:scale-110 hover:shadow-md" title="Minimize">
                        <i class="bi bi-dash"></i>
                    </button>
                    <button class="window-btn w-6 h-6 rounded bg-green-500 hover:bg-green-400 flex items-center justify-center text-black text-xs transition-all duration-200 hover:scale-110 hover:shadow-md" title="Maximize">
                        <i class="bi bi-square"></i>
                    </button>
                    <button class="window-btn w-6 h-6 rounded bg-red-500 hover:bg-red-400 flex items-center justify-center text-white text-xs transition-all duration-200 hover:scale-110 hover:shadow-md" title="Close">
                        <i class="bi bi-x"></i>
                    </button>
                </div>
            </div>
            <div class="window-content h-full overflow-auto bg-black text-white" style="height: calc(100% - 40px);">
                ${content}
            </div>
        `;

        this.container.querySelector('.relative').appendChild(window);
        this.windows.set(id, window);

        // Add to taskbar
        this.addToTaskbar(id, title);

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
            'logs': 'journal-text'
        };
        return icons[id] || 'window';
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

    addToTaskbar(id, title) {
        const taskbarItems = this.container.querySelector('#taskbar-items');
        const taskbarItem = document.createElement('button');
        taskbarItem.className = 'taskbar-item active';
        taskbarItem.dataset.windowId = id;
        taskbarItem.innerHTML = `<i class="bi bi-${this.getIconForWindow(id)}"></i> ${title}`;
        
        taskbarItem.addEventListener('click', () => {
            this.toggleWindow(id);
        });
        
        taskbarItems.appendChild(taskbarItem);
    }

    closeWindow(id) {
        const window = this.windows.get(id);
        if (window) {
            window.remove();
            this.windows.delete(id);
            
            // Remove from taskbar
            const taskbarItem = this.container.querySelector(`[data-window-id="${id}"]`);
            if (taskbarItem) {
                taskbarItem.remove();
            }
        }
    }

    minimizeWindow(id) {
        const window = this.windows.get(id);
        if (window) {
            window.style.display = 'none';
            const taskbarItem = this.container.querySelector(`[data-window-id="${id}"]`);
            if (taskbarItem) {
                taskbarItem.classList.remove('active');
            }
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
        const taskbarItem = this.container.querySelector(`[data-window-id="${id}"]`);
        
        if (window) {
            if (window.style.display === 'none') {
                window.style.display = 'block';
                window.style.zIndex = ++this.zIndex;
                taskbarItem.classList.add('active');
            } else {
                this.minimizeWindow(id);
            }
        }
    }

    exitSimulation() {
        if (confirm('Are you sure you want to exit the simulation?')) {
            // Dispatch custom event to notify parent
            window.dispatchEvent(new CustomEvent('exitSimulation'));
        }
    }

    showHelp() {
        this.createWindow('help', 'Help', this.createHelpContent(), {
            width: '60%',
            height: '50%'
        });
    }

    showHint() {
        this.createWindow('hint', 'Hint', this.createHintContent(), {
            width: '50%',
            height: '40%'
        });
    }

    showProgress() {
        this.createWindow('progress', 'Progress', this.createProgressContent(), {
            width: '55%',
            height: '45%'
        });
    }

    // Content creators for different windows
    createBrowserContent() {
        return `
            <div class="h-full flex flex-col">
                <div class="bg-gray-700 p-2 border-b border-gray-600 flex items-center space-x-3">
                    <div class="flex space-x-1">
                        <button class="px-1.5 py-1 bg-gray-600 border border-gray-500 rounded text-white text-xs hover:bg-gray-500 transition-colors duration-200"><i class="bi bi-arrow-left"></i></button>
                        <button class="px-1.5 py-1 bg-gray-600 border border-gray-500 rounded text-white text-xs hover:bg-gray-500 transition-colors duration-200"><i class="bi bi-arrow-right"></i></button>
                        <button class="px-1.5 py-1 bg-gray-600 border border-gray-500 rounded text-white text-xs hover:bg-gray-500 transition-colors duration-200"><i class="bi bi-arrow-clockwise"></i></button>
                    </div>
                    <div class="flex-1">
                        <input type="text" value="https://suspicious-site.com" readonly class="w-full px-3 py-1 bg-black border border-gray-600 rounded text-white text-xs font-mono">
                    </div>
                </div>
                <div class="flex-1 overflow-auto bg-white">
                    <div class="p-5 text-center text-black">
                        <h2 class="text-2xl font-bold text-red-600 mb-4">🎉 CONGRATULATIONS! YOU'VE WON! 🎉</h2>
                        <p class="mb-4">Click here to claim your $1,000,000 prize!</p>
                        <button class="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-lg font-bold text-lg animate-pulse hover:scale-105 transition-transform duration-200">CLAIM NOW!</button>
                        <p class="text-sm text-gray-600 mt-2">* No catch, totally legitimate *</p>
                    </div>
                </div>
            </div>
        `;
    }

    createTerminalContent() {
        return `
            <div class="h-full bg-black text-green-400 font-mono text-sm p-3 flex flex-col">
                <div class="flex-1 overflow-y-auto mb-3 space-y-1">
                    <div>user@cyberquest:~$ whoami</div>
                    <div>trainee</div>
                    <div>user@cyberquest:~$ ls -la</div>
                    <div>drwxr-xr-x 2 trainee trainee 4096 Dec 20 10:30 Documents</div>
                    <div>drwxr-xr-x 2 trainee trainee 4096 Dec 20 10:30 Downloads</div>
                    <div class="text-red-400">-rw-r--r-- 1 trainee trainee  1337 Dec 20 10:31 suspicious_file.txt</div>
                    <div>user@cyberquest:~$ <span class="inline-block w-2 h-3.5 bg-green-400 animate-pulse">|</span></div>
                </div>
                <div class="flex items-center">
                    <span class="text-green-400 mr-2">user@cyberquest:~$ </span>
                    <input type="text" class="flex-1 bg-transparent border-none text-green-400 outline-none font-mono text-sm" placeholder="Type your command...">
                </div>
            </div>
        `;
    }

    createFileManagerContent() {
        return `
            <div class="file-manager">
                <div class="file-toolbar">
                    <button class="file-btn"><i class="bi bi-arrow-left"></i></button>
                    <button class="file-btn"><i class="bi bi-arrow-right"></i></button>
                    <button class="file-btn"><i class="bi bi-house"></i></button>
                    <div class="file-path">/home/trainee</div>
                </div>
                <div class="file-content">
                    <div class="file-item folder">
                        <i class="bi bi-folder"></i>
                        <span>Documents</span>
                    </div>
                    <div class="file-item folder">
                        <i class="bi bi-folder"></i>
                        <span>Downloads</span>
                    </div>
                    <div class="file-item file suspicious">
                        <i class="bi bi-file-text"></i>
                        <span>suspicious_file.txt</span>
                    </div>
                    <div class="file-item file">
                        <i class="bi bi-file-text"></i>
                        <span>readme.txt</span>
                    </div>
                </div>
            </div>
        `;
    }

    createEmailContent() {
        return `
            <div class="h-full flex">
                <div class="w-48 bg-gray-700 border-r border-gray-600 p-3">
                    <div class="email-folder bg-green-400 text-black px-3 py-2 rounded text-sm font-medium mb-1 cursor-pointer">Inbox (3)</div>
                    <div class="email-folder px-3 py-2 text-gray-300 text-sm hover:bg-gray-600 rounded cursor-pointer transition-colors duration-200">Sent</div>
                    <div class="email-folder px-3 py-2 text-gray-300 text-sm hover:bg-gray-600 rounded cursor-pointer transition-colors duration-200">Trash</div>
                </div>
                <div class="flex-1 flex flex-col">
                    <div class="flex-1 overflow-y-auto">
                        <div class="email-item p-3 border-b border-gray-600 cursor-pointer hover:bg-gray-700 transition-colors duration-200 border-l-4 border-red-500 bg-red-900 bg-opacity-20">
                            <div class="font-medium text-white text-sm">prince.nigeria@totally-real.com</div>
                            <div class="text-gray-300 text-sm mb-1">URGENT: Claim Your Inheritance!</div>
                            <div class="text-gray-400 text-xs">2 min ago</div>
                        </div>
                        <div class="email-item p-3 border-b border-gray-600 cursor-pointer hover:bg-gray-700 transition-colors duration-200">
                            <div class="font-medium text-white text-sm">admin@cyberquest.com</div>
                            <div class="text-gray-300 text-sm mb-1">Welcome to CyberQuest Training</div>
                            <div class="text-gray-400 text-xs">1 hour ago</div>
                        </div>
                        <div class="email-item p-3 border-b border-gray-600 cursor-pointer hover:bg-gray-700 transition-colors duration-200">
                            <div class="font-medium text-white text-sm">noreply@bank.com</div>
                            <div class="text-gray-300 text-sm mb-1">Your account has been suspended</div>
                            <div class="text-gray-400 text-xs">3 hours ago</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createNetworkMonitorContent() {
        return `
            <div class="network-monitor">
                <div class="monitor-toolbar">
                    <button class="monitor-btn active">Live Capture</button>
                    <button class="monitor-btn">Filters</button>
                    <button class="monitor-btn">Statistics</button>
                </div>
                <div class="packet-list">
                    <div class="packet-header">
                        <span>Time</span>
                        <span>Source</span>
                        <span>Destination</span>
                        <span>Protocol</span>
                        <span>Info</span>
                    </div>
                    <div class="packet-item">
                        <span>10:30:45</span>
                        <span>192.168.1.100</span>
                        <span>8.8.8.8</span>
                        <span>DNS</span>
                        <span>Standard query A google.com</span>
                    </div>
                    <div class="packet-item suspicious">
                        <span>10:30:47</span>
                        <span>192.168.1.100</span>
                        <span>malicious-site.com</span>
                        <span>HTTP</span>
                        <span>GET /malware.exe</span>
                    </div>
                    <div class="packet-item">
                        <span>10:30:48</span>
                        <span>192.168.1.1</span>
                        <span>192.168.1.100</span>
                        <span>TCP</span>
                        <span>ACK</span>
                    </div>
                </div>
            </div>
        `;
    }

    createSecurityToolsContent() {
        return `
            <div class="security-tools">
                <h3>Security Analysis Tools</h3>
                <div class="tool-grid">
                    <button class="tool-btn">
                        <i class="bi bi-shield-check"></i>
                        <span>Antivirus Scan</span>
                    </button>
                    <button class="tool-btn">
                        <i class="bi bi-search"></i>
                        <span>Malware Detector</span>
                    </button>
                    <button class="tool-btn">
                        <i class="bi bi-graph-up"></i>
                        <span>Network Scanner</span>
                    </button>
                    <button class="tool-btn">
                        <i class="bi bi-lock"></i>
                        <span>Encryption Tool</span>
                    </button>
                </div>
                <div class="scan-results">
                    <h4>Recent Scan Results</h4>
                    <div class="result-item warning">
                        <i class="bi bi-exclamation-triangle"></i>
                        <span>Suspicious file detected: suspicious_file.txt</span>
                    </div>
                    <div class="result-item danger">
                        <i class="bi bi-x-circle"></i>
                        <span>Malware found: /tmp/malware.exe</span>
                    </div>
                </div>
            </div>
        `;
    }

    createSystemLogsContent() {
        return `
            <div class="system-logs">
                <div class="log-toolbar">
                    <select class="log-filter">
                        <option>All Logs</option>
                        <option>Security</option>
                        <option>Network</option>
                        <option>System</option>
                    </select>
                    <button class="log-btn">Refresh</button>
                </div>
                <div class="log-content">
                    <div class="log-entry">
                        <span class="log-time">10:30:45</span>
                        <span class="log-level info">INFO</span>
                        <span class="log-message">System startup completed</span>
                    </div>
                    <div class="log-entry">
                        <span class="log-time">10:30:47</span>
                        <span class="log-level warning">WARN</span>
                        <span class="log-message">Suspicious network activity detected</span>
                    </div>
                    <div class="log-entry">
                        <span class="log-time">10:30:50</span>
                        <span class="log-level error">ERROR</span>
                        <span class="log-message">Failed login attempt from 192.168.1.200</span>
                    </div>
                </div>
            </div>
        `;
    }

    createHelpContent() {
        return `
            <div class="help-content">
                <h3>CyberQuest Training Help</h3>
                <div class="help-section">
                    <h4>Navigation</h4>
                    <ul>
                        <li>Double-click desktop icons to open applications</li>
                        <li>Use the taskbar to switch between windows</li>
                        <li>Drag windows by their title bar to move them</li>
                    </ul>
                </div>
                <div class="help-section">
                    <h4>Mission Controls</h4>
                    <ul>
                        <li><strong>Help:</strong> Show this help dialog</li>
                        <li><strong>Hint:</strong> Get guidance for current task</li>
                        <li><strong>Progress:</strong> View your mission progress</li>
                        <li><strong>Exit:</strong> Leave the simulation</li>
                    </ul>
                </div>
            </div>
        `;
    }

    createHintContent() {
        return `
            <div class="hint-content">
                <h3>💡 Training Hint</h3>
                <div class="hint-box">
                    <p>Look for suspicious emails in the inbox. Pay attention to:</p>
                    <ul>
                        <li>Sender addresses that look fake</li>
                        <li>Urgent language and grammar mistakes</li>
                        <li>Requests for personal information</li>
                        <li>Suspicious attachments or links</li>
                    </ul>
                </div>
            </div>
        `;
    }

    createProgressContent() {
        return `
            <div class="progress-content">
                <h3>📊 Mission Progress</h3>
                <div class="progress-stats">
                    <div class="stat-item">
                        <span class="stat-label">Tasks Completed:</span>
                        <span class="stat-value">2/5</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Threats Identified:</span>
                        <span class="stat-value">1</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Score:</span>
                        <span class="stat-value">75/100</span>
                    </div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 40%"></div>
                </div>
            </div>
        `;
    }
}
