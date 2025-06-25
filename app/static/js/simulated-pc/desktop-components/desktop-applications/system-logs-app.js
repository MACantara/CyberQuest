import { WindowBase } from '../window-base.js';
import { LogManager } from './system-logs-functions/log-manager.js';
import { LogFilter } from './system-logs-functions/log-filter.js';

export class SystemLogsApp extends WindowBase {
    constructor() {
        super('logs', 'System Logs', {
            width: '85%',
            height: '70%'
        });
        
        this.logManager = null;
        this.logFilter = null;
        this.currentFilter = 'all';
        this.autoRefresh = false;
        this.refreshInterval = null;
    }

    createContent() {
        return `
            <div class="h-full flex flex-col bg-gray-900">
                <!-- Toolbar -->
                <div class="bg-gray-700 p-2 border-b border-gray-600 flex items-center justify-between flex-shrink-0">
                    <div class="flex items-center space-x-2">
                        <select class="px-2 py-1 bg-black border border-gray-600 rounded text-white text-xs cursor-pointer" id="log-filter">
                            <option value="all">All Logs</option>
                            <option value="security">Security</option>
                            <option value="system">System</option>
                            <option value="network">Network</option>
                            <option value="auth">Authentication</option>
                            <option value="error">Errors Only</option>
                        </select>
                        <button class="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors duration-200 cursor-pointer" id="refresh-btn">
                            <i class="bi bi-arrow-clockwise mr-1"></i>Refresh
                        </button>
                    </div>
                    
                    <div class="flex items-center space-x-2">
                        <label class="flex items-center text-white text-xs">
                            <input type="checkbox" id="auto-refresh" class="mr-1">
                            Auto-refresh
                        </label>
                        <span class="text-gray-400 text-xs" id="log-count">0 entries</span>
                    </div>
                </div>
                
                <!-- Log Content -->
                <div class="flex-1 overflow-hidden flex flex-col">
                    <!-- Headers -->
                    <div class="bg-gray-800 border-b border-gray-600 font-bold text-gray-300" id="log-headers">
                        <div class="grid grid-cols-6 gap-2 p-2 text-xs">
                            <span>Timestamp</span>
                            <span>Level</span>
                            <span>Source</span>
                            <span>Category</span>
                            <span>Message</span>
                            <span>Details</span>
                        </div>
                    </div>
                    
                    <!-- Log Entries -->
                    <div class="flex-1 overflow-auto" id="logs-container">
                        ${this.generateInitialLogs()}
                    </div>
                </div>
                
                <!-- Status Bar -->
                <div class="bg-gray-700 p-2 border-t border-gray-600 flex justify-between items-center text-xs text-gray-300 flex-shrink-0">
                    <div class="flex items-center space-x-4">
                        <span id="total-logs">Total: 0</span>
                        <span id="error-logs" class="text-red-400">Errors: 0</span>
                        <span id="warning-logs" class="text-yellow-400">Warnings: 0</span>
                        <span id="security-logs" class="text-orange-400">Security: 0</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <span id="last-update">Last updated: Never</span>
                    </div>
                </div>
            </div>
        `;
    }

    generateInitialLogs() {
        const logs = [
            { timestamp: '2024-12-20 14:30:15', level: 'INFO', source: 'system', category: 'startup', message: 'System boot completed successfully', details: 'Boot time: 45.2s' },
            { timestamp: '2024-12-20 14:30:20', level: 'WARN', source: 'security', category: 'authentication', message: 'Multiple failed login attempts detected', details: 'User: admin, IP: 192.168.1.100' },
            { timestamp: '2024-12-20 14:30:25', level: 'ERROR', source: 'network', category: 'connection', message: 'Connection timeout to external server', details: 'Server: 203.0.113.50:443' },
            { timestamp: '2024-12-20 14:30:30', level: 'CRITICAL', source: 'security', category: 'malware', message: 'Malware signature detected', details: 'File: suspicious_file.exe, Action: Quarantined' },
            { timestamp: '2024-12-20 14:30:35', level: 'INFO', source: 'system', category: 'service', message: 'Firewall service started', details: 'PID: 1234' },
            { timestamp: '2024-12-20 14:30:40', level: 'WARN', source: 'network', category: 'traffic', message: 'Unusual traffic pattern detected', details: 'Source: 10.0.0.15, Protocol: ICMP' }
        ];

        return logs.map(log => this.createLogElement(log)).join('');
    }

    createLogElement(log) {
        const levelClass = this.getLevelClass(log.level);
        const categoryClass = this.getCategoryClass(log.category);
        
        return `
            <div class="log-entry grid grid-cols-6 gap-2 p-2 border-b border-gray-700 hover:bg-gray-800 transition-colors duration-200 text-xs cursor-pointer" 
                 data-level="${log.level.toLowerCase()}" 
                 data-source="${log.source}" 
                 data-category="${log.category}">
                <span class="text-gray-400">${log.timestamp}</span>
                <span class="log-level ${levelClass} px-2 py-1 rounded text-center font-semibold">${log.level}</span>
                <span class="text-gray-300">${log.source}</span>
                <span class="${categoryClass}">${log.category}</span>
                <span class="text-gray-200">${log.message}</span>
                <span class="text-gray-400 text-xs">${log.details}</span>
            </div>
        `;
    }

    getLevelClass(level) {
        const classes = {
            'INFO': 'bg-blue-600 text-white',
            'WARN': 'bg-yellow-600 text-black',
            'ERROR': 'bg-red-600 text-white',
            'CRITICAL': 'bg-red-800 text-white',
            'DEBUG': 'bg-gray-600 text-white'
        };
        return classes[level] || 'bg-gray-500 text-white';
    }

    getCategoryClass(category) {
        const classes = {
            'security': 'text-red-400',
            'authentication': 'text-orange-400',
            'network': 'text-blue-400',
            'system': 'text-green-400',
            'malware': 'text-red-500',
            'startup': 'text-green-300',
            'service': 'text-purple-400'
        };
        return classes[category] || 'text-gray-400';
    }

    initialize() {
        super.initialize();
        
        // Initialize system logs components
        this.logManager = new LogManager(this);
        this.logFilter = new LogFilter(this);
        
        this.bindEvents();
        this.updateLogCounts();
        this.updateLastUpdate();
    }

    bindEvents() {
        const windowElement = this.windowElement;
        if (!windowElement) return;

        // Filter dropdown
        const filterSelect = windowElement.querySelector('#log-filter');
        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => {
                this.currentFilter = e.target.value;
                this.applyFilter();
            });
        }

        // Refresh button
        const refreshBtn = windowElement.querySelector('#refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshLogs();
            });
        }

        // Auto-refresh checkbox
        const autoRefreshCheckbox = windowElement.querySelector('#auto-refresh');
        if (autoRefreshCheckbox) {
            autoRefreshCheckbox.addEventListener('change', (e) => {
                this.toggleAutoRefresh(e.target.checked);
            });
        }

        // Log entry clicks
        const logsContainer = windowElement.querySelector('#logs-container');
        if (logsContainer) {
            logsContainer.addEventListener('click', (e) => {
                const logEntry = e.target.closest('.log-entry');
                if (logEntry) {
                    this.selectLogEntry(logEntry);
                }
            });
        }
    }

    applyFilter() {
        const entries = this.windowElement?.querySelectorAll('.log-entry');
        if (!entries) return;

        entries.forEach(entry => {
            const level = entry.dataset.level;
            const source = entry.dataset.source;
            const category = entry.dataset.category;
            
            let shouldShow = true;
            
            switch (this.currentFilter) {
                case 'security':
                    shouldShow = source === 'security' || category === 'authentication' || category === 'malware';
                    break;
                case 'system':
                    shouldShow = source === 'system';
                    break;
                case 'network':
                    shouldShow = source === 'network';
                    break;
                case 'auth':
                    shouldShow = category === 'authentication';
                    break;
                case 'error':
                    shouldShow = level === 'error' || level === 'critical';
                    break;
                case 'all':
                default:
                    shouldShow = true;
                    break;
            }
            
            entry.style.display = shouldShow ? 'grid' : 'none';
        });
        
        this.updateLogCounts();
    }

    refreshLogs() {
        const refreshBtn = this.windowElement?.querySelector('#refresh-btn');
        if (refreshBtn) {
            refreshBtn.innerHTML = '<i class="bi bi-arrow-clockwise animate-spin mr-1"></i>Refreshing...';
            refreshBtn.disabled = true;
        }

        // Simulate refresh with new log entries
        setTimeout(() => {
            this.logManager.generateNewLogs();
            this.updateLogCounts();
            this.updateLastUpdate();
            
            if (refreshBtn) {
                refreshBtn.innerHTML = '<i class="bi bi-arrow-clockwise mr-1"></i>Refresh';
                refreshBtn.disabled = false;
            }
        }, 1500);
    }

    toggleAutoRefresh(enabled) {
        this.autoRefresh = enabled;
        
        if (enabled) {
            this.refreshInterval = setInterval(() => {
                this.refreshLogs();
            }, 30000); // Refresh every 30 seconds
        } else {
            if (this.refreshInterval) {
                clearInterval(this.refreshInterval);
                this.refreshInterval = null;
            }
        }
    }

    selectLogEntry(entry) {
        // Remove previous selection
        const selected = this.windowElement?.querySelector('.log-entry.selected');
        if (selected) {
            selected.classList.remove('selected', 'bg-blue-900');
        }
        
        // Select new entry
        entry.classList.add('selected', 'bg-blue-900');
        
        // Show details for security-related logs
        const category = entry.dataset.category;
        const level = entry.dataset.level;
        
        if (category === 'security' || category === 'malware' || level === 'critical') {
            this.showLogDetails(entry);
        }
    }

    showLogDetails(entry) {
        const timestamp = entry.children[0].textContent;
        const level = entry.children[1].textContent;
        const message = entry.children[4].textContent;
        const details = entry.children[5].textContent;
        
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        overlay.innerHTML = `
            <div class="bg-gray-800 rounded-lg p-6 max-w-2xl mx-4">
                <div class="text-center">
                    <i class="bi bi-exclamation-triangle text-yellow-400 text-4xl mb-3"></i>
                    <h3 class="text-white text-lg font-semibold mb-2">Log Entry Details</h3>
                    <div class="bg-black p-4 rounded text-left mb-4">
                        <div class="grid grid-cols-2 gap-2 text-sm">
                            <span class="text-gray-400">Timestamp:</span>
                            <span class="text-white">${timestamp}</span>
                            <span class="text-gray-400">Level:</span>
                            <span class="text-white">${level}</span>
                            <span class="text-gray-400">Message:</span>
                            <span class="text-white">${message}</span>
                            <span class="text-gray-400">Details:</span>
                            <span class="text-white">${details}</span>
                        </div>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Review this log entry for potential security implications.
                    </p>
                    <button onclick="this.closest('.fixed').remove()" 
                            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer">
                        Close
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    updateLogCounts() {
        const entries = this.windowElement?.querySelectorAll('.log-entry');
        if (!entries) return;

        const visible = Array.from(entries).filter(entry => entry.style.display !== 'none');
        const errors = visible.filter(entry => ['error', 'critical'].includes(entry.dataset.level));
        const warnings = visible.filter(entry => entry.dataset.level === 'warn');
        const security = visible.filter(entry => 
            entry.dataset.source === 'security' || 
            entry.dataset.category === 'authentication' || 
            entry.dataset.category === 'malware'
        );

        const totalElement = this.windowElement?.querySelector('#total-logs');
        const errorElement = this.windowElement?.querySelector('#error-logs');
        const warningElement = this.windowElement?.querySelector('#warning-logs');
        const securityElement = this.windowElement?.querySelector('#security-logs');
        const countElement = this.windowElement?.querySelector('#log-count');

        if (totalElement) totalElement.textContent = `Total: ${visible.length}`;
        if (errorElement) errorElement.textContent = `Errors: ${errors.length}`;
        if (warningElement) warningElement.textContent = `Warnings: ${warnings.length}`;
        if (securityElement) securityElement.textContent = `Security: ${security.length}`;
        if (countElement) countElement.textContent = `${visible.length} entries`;
    }

    updateLastUpdate() {
        const now = new Date().toLocaleTimeString();
        const lastUpdateElement = this.windowElement?.querySelector('#last-update');
        if (lastUpdateElement) {
            lastUpdateElement.textContent = `Last updated: ${now}`;
        }
    }

    addLogEntry(logData) {
        const logsContainer = this.windowElement?.querySelector('#logs-container');
        if (!logsContainer) return;

        const logElement = this.createLogElement(logData);
        logsContainer.insertAdjacentHTML('afterbegin', logElement);
        
        // Apply current filter
        this.applyFilter();
    }

    cleanup() {
        // Stop auto-refresh when window is closed
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
        
        super.cleanup();
    }
}
        // Apply current filter
        this.applyFilter();
    }

    cleanup() {
        // Stop auto-refresh when window is closed
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
        
        super.cleanup();
    }
}
