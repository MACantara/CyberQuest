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
        this.currentLevelFilter = 'all';
        this.currentSourceFilter = 'all';
        this.currentCategoryFilter = 'all';
        this.autoRefresh = false;
        this.refreshInterval = null;
    }

    createContent() {
        return `
            <div class="h-full flex flex-col bg-gray-900">
                <!-- Toolbar -->
                <div class="bg-gray-700 p-2 border-b border-gray-600 flex items-center justify-between flex-shrink-0">
                    <div class="flex items-center space-x-2">
                        <select class="px-2 py-1 bg-black border border-gray-600 rounded text-white text-xs cursor-pointer" id="level-filter">
                            <option value="all">All Levels</option>
                            <option value="critical">Critical</option>
                            <option value="error">Error</option>
                            <option value="warn">Warning</option>
                            <option value="info">Info</option>
                            <option value="debug">Debug</option>
                        </select>
                        <select class="px-2 py-1 bg-black border border-gray-600 rounded text-white text-xs cursor-pointer" id="source-filter">
                            <option value="all">All Sources</option>
                            <option value="system">System</option>
                            <option value="security">Security</option>
                            <option value="network">Network</option>
                        </select>
                        <select class="px-2 py-1 bg-black border border-gray-600 rounded text-white text-xs cursor-pointer" id="category-filter">
                            <option value="all">All Categories</option>
                            <option value="startup">Startup</option>
                            <option value="service">Service</option>
                            <option value="authentication">Authentication</option>
                            <option value="connection">Connection</option>
                            <option value="malware">Malware</option>
                            <option value="traffic">Traffic</option>
                            <option value="update">Update</option>
                            <option value="disk">Disk</option>
                            <option value="scan">Scan</option>
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
        // Sort logs from oldest to newest (reverse chronological order)
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
        
        // Set up activity monitoring
        this.setupActivityMonitoring();
    }

    bindEvents() {
        const windowElement = this.windowElement;
        if (!windowElement) return;

        // Level filter dropdown
        const levelSelect = windowElement.querySelector('#level-filter');
        if (levelSelect) {
            levelSelect.addEventListener('change', (e) => {
                this.currentLevelFilter = e.target.value;
                this.applyFilters();
            });
        }

        // Source filter dropdown
        const sourceSelect = windowElement.querySelector('#source-filter');
        if (sourceSelect) {
            sourceSelect.addEventListener('change', (e) => {
                this.currentSourceFilter = e.target.value;
                this.applyFilters();
            });
        }

        // Category filter dropdown
        const categorySelect = windowElement.querySelector('#category-filter');
        if (categorySelect) {
            categorySelect.addEventListener('change', (e) => {
                this.currentCategoryFilter = e.target.value;
                this.applyFilters();
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

    applyFilters() {
        const entries = this.windowElement?.querySelectorAll('.log-entry');
        if (!entries) return;

        entries.forEach(entry => {
            const level = entry.dataset.level;
            const source = entry.dataset.source;
            const category = entry.dataset.category;
            
            let shouldShow = true;
            
            // Level filter
            if (this.currentLevelFilter !== 'all' && level !== this.currentLevelFilter) {
                shouldShow = false;
            }
            
            // Source filter
            if (this.currentSourceFilter !== 'all' && source !== this.currentSourceFilter) {
                shouldShow = false;
            }
            
            // Category filter
            if (this.currentCategoryFilter !== 'all' && category !== this.currentCategoryFilter) {
                shouldShow = false;
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

    addLogEntry(logData) {
        const logsContainer = this.windowElement?.querySelector('#logs-container');
        if (!logsContainer) return;

        const logElement = this.createLogElement(logData);
        // Add new logs at the bottom (most recent)
        logsContainer.insertAdjacentHTML('beforeend', logElement);
        
        // Apply current filters
        this.applyFilters();
        
        // Auto-scroll to bottom to show newest log
        logsContainer.scrollTop = logsContainer.scrollHeight;
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

    setupActivityMonitoring() {
        // Listen for browser activity
        document.addEventListener('browser-navigate', (e) => {
            this.logBrowserActivity(e.detail);
        });

        // Listen for email activity
        document.addEventListener('email-opened', (e) => {
            this.logEmailActivity(e.detail);
        });

        document.addEventListener('email-link-clicked', (e) => {
            this.logEmailLinkActivity(e.detail);
        });

        // Listen for file manager activity
        document.addEventListener('file-accessed', (e) => {
            this.logFileActivity(e.detail);
        });

        document.addEventListener('file-opened', (e) => {
            this.logFileOpenActivity(e.detail);
        });

        document.addEventListener('suspicious-file-detected', (e) => {
            this.logSuspiciousFileActivity(e.detail);
        });

        // Listen for network monitor activity
        document.addEventListener('network-scan-started', (e) => {
            this.logNetworkActivity(e.detail);
        });

        document.addEventListener('suspicious-traffic-detected', (e) => {
            this.logSuspiciousTrafficActivity(e.detail);
        });

        // Listen for terminal activity
        document.addEventListener('terminal-command', (e) => {
            this.logTerminalActivity(e.detail);
        });

        document.addEventListener('security-command-executed', (e) => {
            this.logSecurityCommandActivity(e.detail);
        });

        // Listen for general security events
        document.addEventListener('security-alert', (e) => {
            this.logSecurityAlert(e.detail);
        });

        document.addEventListener('malware-detected', (e) => {
            this.logMalwareDetection(e.detail);
        });

        document.addEventListener('phishing-detected', (e) => {
            this.logPhishingDetection(e.detail);
        });
    }

    logBrowserActivity(detail) {
        const { url } = detail;
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        let level = 'INFO';
        let category = 'network';
        let message = `Web browser navigation to ${url}`;
        let details = `User: trainee, Protocol: HTTPS`;

        // Check for suspicious URLs
        if (this.isSuspiciousUrl(url)) {
            level = 'WARN';
            category = 'security';
            message = `Navigation to suspicious website detected`;
            details = `URL: ${url}, Risk: High, Action: Monitor`;
        }

        this.addLogEntry({
            timestamp,
            level,
            source: 'network',
            category,
            message,
            details
        });
    }

    logEmailActivity(detail) {
        const { sender, subject, suspicious } = detail;
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        let level = suspicious ? 'WARN' : 'INFO';
        let category = suspicious ? 'security' : 'authentication';
        let message = suspicious ? 
            `Suspicious email opened from ${sender}` : 
            `Email accessed from ${sender}`;
        let details = `Subject: ${subject}, User: trainee`;

        if (suspicious) {
            details += `, Risk: High, Scan: Required`;
        }

        this.addLogEntry({
            timestamp,
            level,
            source: 'security',
            category,
            message,
            details
        });
    }

    logEmailLinkActivity(detail) {
        const { url, suspicious } = detail;
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        this.addLogEntry({
            timestamp,
            level: 'CRITICAL',
            source: 'security',
            category: 'malware',
            message: 'Email link clicked - potential phishing attempt',
            details: `URL: ${url}, Source: Email, Action: Block recommended`
        });
    }

    logFileActivity(detail) {
        const { fileName, path, action } = detail;
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        this.addLogEntry({
            timestamp,
            level: 'INFO',
            source: 'system',
            category: 'service',
            message: `File ${action}: ${fileName}`,
            details: `Path: ${path}, User: trainee, Process: file-manager`
        });
    }

    logFileOpenActivity(detail) {
        const { fileName, fileType, suspicious } = detail;
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        let level = suspicious ? 'WARN' : 'INFO';
        let category = suspicious ? 'security' : 'service';
        let message = suspicious ? 
            `Suspicious file opened: ${fileName}` : 
            `File opened: ${fileName}`;
        let details = `Type: ${fileType}, User: trainee`;

        if (suspicious) {
            details += `, Security scan: Recommended`;
        }

        this.addLogEntry({
            timestamp,
            level,
            source: suspicious ? 'security' : 'system',
            category,
            message,
            details
        });
    }

    logSuspiciousFileActivity(detail) {
        const { fileName, reason, action } = detail;
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        this.addLogEntry({
            timestamp,
            level: 'CRITICAL',
            source: 'security',
            category: 'malware',
            message: `Suspicious file detected: ${fileName}`,
            details: `Reason: ${reason}, Action: ${action}, Scan: Required`
        });
    }

    logNetworkActivity(detail) {
        const { action, target } = detail;
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        this.addLogEntry({
            timestamp,
            level: 'INFO',
            source: 'network',
            category: 'scan',
            message: `Network monitoring ${action}`,
            details: `Target: ${target || 'All interfaces'}, User: trainee`
        });
    }

    logSuspiciousTrafficActivity(detail) {
        const { source, destination, protocol, reason } = detail;
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        this.addLogEntry({
            timestamp,
            level: 'CRITICAL',
            source: 'network',
            category: 'traffic',
            message: 'Suspicious network traffic detected',
            details: `${source} -> ${destination}, Protocol: ${protocol}, Reason: ${reason}`
        });
    }

    logTerminalActivity(detail) {
        const { command, user, exitCode } = detail;
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        let level = exitCode === 0 ? 'INFO' : 'WARN';
        let category = this.isSecurityCommand(command) ? 'security' : 'service';
        
        this.addLogEntry({
            timestamp,
            level,
            source: 'system',
            category,
            message: `Terminal command executed: ${command}`,
            details: `User: ${user}, Exit code: ${exitCode}, Shell: bash`
        });
    }

    logSecurityCommandActivity(detail) {
        const { command, result, risk } = detail;
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        this.addLogEntry({
            timestamp,
            level: risk === 'high' ? 'WARN' : 'INFO',
            source: 'security',
            category: 'scan',
            message: `Security command executed: ${command}`,
            details: `Result: ${result}, Risk level: ${risk}, User: trainee`
        });
    }

    logSecurityAlert(detail) {
        const { type, severity, message, source } = detail;
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        let level = 'WARN';
        if (severity === 'critical') level = 'CRITICAL';
        if (severity === 'low') level = 'INFO';
        
        this.addLogEntry({
            timestamp,
            level,
            source: 'security',
            category: 'authentication',
            message: `Security alert: ${type}`,
            details: `${message}, Source: ${source}, Severity: ${severity}`
        });
    }

    logMalwareDetection(detail) {
        const { fileName, signature, action } = detail;
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        this.addLogEntry({
            timestamp,
            level: 'CRITICAL',
            source: 'security',
            category: 'malware',
            message: `Malware detected: ${fileName}`,
            details: `Signature: ${signature}, Action: ${action}, Status: Quarantined`
        });
    }

    logPhishingDetection(detail) {
        const { url, reason, action } = detail;
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        this.addLogEntry({
            timestamp,
            level: 'CRITICAL',
            source: 'security',
            category: 'authentication',
            message: 'Phishing attempt detected',
            details: `URL: ${url}, Reason: ${reason}, Action: ${action}`
        });
    }

    // Helper methods
    isSuspiciousUrl(url) {
        const suspiciousDomains = [
            'suspicious-site.com',
            'secure-verify-support.com',
            'phishing-bank.com',
            'fake-security.net',
            'malicious-download.org'
        ];
        
        return suspiciousDomains.some(domain => url.includes(domain));
    }

    isSecurityCommand(command) {
        const securityCommands = [
            'sudo', 'su', 'chmod', 'chown', 'passwd', 'ssh', 'scp',
            'netstat', 'ps', 'top', 'kill', 'nmap', 'wireshark',
            'iptables', 'ufw', 'fail2ban', 'clamav', 'rkhunter'
        ];
        
        return securityCommands.some(cmd => command.startsWith(cmd));
    }

    cleanup() {
        // Remove event listeners when window is closed
        document.removeEventListener('browser-navigate', this.logBrowserActivity);
        document.removeEventListener('email-opened', this.logEmailActivity);
        document.removeEventListener('email-link-clicked', this.logEmailLinkActivity);
        document.removeEventListener('file-accessed', this.logFileActivity);
        document.removeEventListener('file-opened', this.logFileOpenActivity);
        document.removeEventListener('suspicious-file-detected', this.logSuspiciousFileActivity);
        document.removeEventListener('network-scan-started', this.logNetworkActivity);
        document.removeEventListener('suspicious-traffic-detected', this.logSuspiciousTrafficActivity);
        document.removeEventListener('terminal-command', this.logTerminalActivity);
        document.removeEventListener('security-command-executed', this.logSecurityCommandActivity);
        document.removeEventListener('security-alert', this.logSecurityAlert);
        document.removeEventListener('malware-detected', this.logMalwareDetection);
        document.removeEventListener('phishing-detected', this.logPhishingDetection);
        
        // Stop auto-refresh when window is closed
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
        
        super.cleanup();
    }
}
