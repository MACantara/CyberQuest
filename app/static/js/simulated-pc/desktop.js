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
            <div class="desktop">
                <div class="desktop-icons">
                    ${this.createDesktopIcons()}
                </div>
                <div class="taskbar">
                    <button class="start-button" id="start-btn">
                        <i class="bi bi-grid-3x3-gap"></i> Start
                    </button>
                    <div class="taskbar-items" id="taskbar-items"></div>
                    <div class="system-tray">
                        <span class="system-clock" id="system-clock"></span>
                    </div>
                </div>
                <div class="control-panel">
                    <h3>Mission Control</h3>
                    <button class="control-button" id="help-btn">
                        <i class="bi bi-question-circle"></i> Help
                    </button>
                    <button class="control-button" id="hint-btn">
                        <i class="bi bi-lightbulb"></i> Hint
                    </button>
                    <button class="control-button" id="progress-btn">
                        <i class="bi bi-clipboard-data"></i> Progress
                    </button>
                    <button class="control-button danger" id="exit-btn">
                        <i class="bi bi-box-arrow-left"></i> Exit Simulation
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
            <div class="desktop-icon" data-action="${icon.action}" data-id="${icon.id}">
                <div class="icon-image">
                    <i class="bi ${icon.icon}"></i>
                </div>
                <div class="icon-label">${icon.name}</div>
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
        this.container.querySelector('.desktop').addEventListener('click', (e) => {
            if (e.target.classList.contains('desktop')) {
                this.clearSelection();
            }
        });
    }

    selectIcon(icon) {
        this.clearSelection();
        icon.classList.add('selected');
        this.selectedIcon = icon;
    }

    clearSelection() {
        if (this.selectedIcon) {
            this.selectedIcon.classList.remove('selected');
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

    // Application launchers
    openBrowser() {
        this.createWindow('browser', 'Web Browser', this.createBrowserContent(), {
            width: '80%',
            height: '70%'
        });
    }

    openTerminal() {
        this.createWindow('terminal', 'Terminal', this.createTerminalContent(), {
            width: '70%',
            height: '60%'
        });
    }

    openFileManager() {
        this.createWindow('files', 'File Manager', this.createFileManagerContent(), {
            width: '75%',
            height: '65%'
        });
    }

    openEmailClient() {
        this.createWindow('email', 'Email Client', this.createEmailContent(), {
            width: '80%',
            height: '70%'
        });
    }

    openNetworkMonitor() {
        this.createWindow('wireshark', 'Network Monitor', this.createNetworkMonitorContent(), {
            width: '85%',
            height: '75%'
        });
    }

    openSecurityTools() {
        this.createWindow('security', 'Security Tools', this.createSecurityToolsContent(), {
            width: '70%',
            height: '60%'
        });
    }

    openSystemLogs() {
        this.createWindow('logs', 'System Logs', this.createSystemLogsContent(), {
            width: '75%',
            height: '65%'
        });
    }

    createWindow(id, title, content, options = {}) {
        if (this.windows.has(id)) {
            // Bring existing window to front
            const existingWindow = this.windows.get(id);
            existingWindow.style.zIndex = ++this.zIndex;
            return;
        }

        const window = document.createElement('div');
        window.className = 'simulated-window';
        window.style.zIndex = ++this.zIndex;
        window.style.width = options.width || '60%';
        window.style.height = options.height || '50%';
        window.style.left = `${Math.random() * 20 + 10}%`;
        window.style.top = `${Math.random() * 20 + 10}%`;

        window.innerHTML = `
            <div class="window-header">
                <div class="window-title">
                    <i class="bi bi-${this.getIconForWindow(id)}"></i>
                    ${title}
                </div>
                <div class="window-controls">
                    <button class="window-btn minimize" title="Minimize">
                        <i class="bi bi-dash"></i>
                    </button>
                    <button class="window-btn maximize" title="Maximize">
                        <i class="bi bi-square"></i>
                    </button>
                    <button class="window-btn close" title="Close">
                        <i class="bi bi-x"></i>
                    </button>
                </div>
            </div>
            <div class="window-content">
                ${content}
            </div>
        `;

        this.container.querySelector('.desktop').appendChild(window);
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
            <div class="browser-interface">
                <div class="browser-toolbar">
                    <div class="browser-controls">
                        <button class="browser-btn"><i class="bi bi-arrow-left"></i></button>
                        <button class="browser-btn"><i class="bi bi-arrow-right"></i></button>
                        <button class="browser-btn"><i class="bi bi-arrow-clockwise"></i></button>
                    </div>
                    <div class="address-bar">
                        <input type="text" value="https://suspicious-site.com" readonly>
                    </div>
                </div>
                <div class="browser-content">
                    <div class="webpage">
                        <h2>🎉 CONGRATULATIONS! YOU'VE WON! 🎉</h2>
                        <p>Click here to claim your $1,000,000 prize!</p>
                        <button class="suspicious-button">CLAIM NOW!</button>
                        <p><small>* No catch, totally legitimate *</small></p>
                    </div>
                </div>
            </div>
        `;
    }

    createTerminalContent() {
        return `
            <div class="terminal-interface">
                <div class="terminal-output">
                    <div class="terminal-line">user@cyberquest:~$ whoami</div>
                    <div class="terminal-line">trainee</div>
                    <div class="terminal-line">user@cyberquest:~$ ls -la</div>
                    <div class="terminal-line">drwxr-xr-x 2 trainee trainee 4096 Dec 20 10:30 Documents</div>
                    <div class="terminal-line">drwxr-xr-x 2 trainee trainee 4096 Dec 20 10:30 Downloads</div>
                    <div class="terminal-line">-rw-r--r-- 1 trainee trainee  1337 Dec 20 10:31 suspicious_file.txt</div>
                    <div class="terminal-line">user@cyberquest:~$ <span class="terminal-cursor">|</span></div>
                </div>
                <div class="terminal-input">
                    <span class="terminal-prompt">user@cyberquest:~$ </span>
                    <input type="text" class="terminal-command" placeholder="Type your command...">
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
            <div class="email-client">
                <div class="email-sidebar">
                    <div class="email-folder active">Inbox (3)</div>
                    <div class="email-folder">Sent</div>
                    <div class="email-folder">Trash</div>
                </div>
                <div class="email-main">
                    <div class="email-list">
                        <div class="email-item suspicious">
                            <div class="email-from">prince.nigeria@totally-real.com</div>
                            <div class="email-subject">URGENT: Claim Your Inheritance!</div>
                            <div class="email-time">2 min ago</div>
                        </div>
                        <div class="email-item">
                            <div class="email-from">admin@cyberquest.com</div>
                            <div class="email-subject">Welcome to CyberQuest Training</div>
                            <div class="email-time">1 hour ago</div>
                        </div>
                        <div class="email-item">
                            <div class="email-from">noreply@bank.com</div>
                            <div class="email-subject">Your account has been suspended</div>
                            <div class="email-time">3 hours ago</div>
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
