export class LogUI {
    constructor(app) {
        this.app = app;
    }

    bindEvents() {
        const windowElement = this.app.windowElement;
        if (!windowElement) return;

        // Level filter dropdown
        const levelSelect = windowElement.querySelector('#level-filter');
        if (levelSelect) {
            levelSelect.addEventListener('change', (e) => {
                this.app.currentLevelFilter = e.target.value;
                this.app.applyFilters();
            });
        }

        // Source filter dropdown
        const sourceSelect = windowElement.querySelector('#source-filter');
        if (sourceSelect) {
            sourceSelect.addEventListener('change', (e) => {
                this.app.currentSourceFilter = e.target.value;
                this.app.applyFilters();
            });
        }

        // Category filter dropdown
        const categorySelect = windowElement.querySelector('#category-filter');
        if (categorySelect) {
            categorySelect.addEventListener('change', (e) => {
                this.app.currentCategoryFilter = e.target.value;
                this.app.applyFilters();
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

    refreshLogs() {
        const refreshBtn = this.app.windowElement?.querySelector('#refresh-btn');
        if (refreshBtn) {
            refreshBtn.innerHTML = '<i class="bi bi-arrow-clockwise animate-spin mr-1"></i>Refreshing...';
            refreshBtn.disabled = true;
        }

        // Only generate new logs when explicitly refreshed by user
        setTimeout(() => {
            this.app.logManager.generateNewLogs();
            this.updateLogCounts();
            this.updateLastUpdate();
            
            if (refreshBtn) {
                refreshBtn.innerHTML = '<i class="bi bi-arrow-clockwise mr-1"></i>Refresh';
                refreshBtn.disabled = false;
            }
        }, 1500);
    }

    toggleAutoRefresh(enabled) {
        this.app.autoRefresh = enabled;
        
        if (enabled) {
            this.app.refreshInterval = setInterval(() => {
                this.refreshLogs();
            }, 30000); // Refresh every 30 seconds
        } else {
            if (this.app.refreshInterval) {
                clearInterval(this.app.refreshInterval);
                this.app.refreshInterval = null;
            }
        }
    }

    selectLogEntry(entry) {
        // Remove previous selection
        const selected = this.app.windowElement?.querySelector('.log-entry.selected');
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
        overlay.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
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
        const entries = this.app.windowElement?.querySelectorAll('.log-entry');
        if (!entries) return;

        const visible = Array.from(entries).filter(entry => entry.style.display !== 'none');
        const errors = visible.filter(entry => ['error', 'critical'].includes(entry.dataset.level));
        const warnings = visible.filter(entry => entry.dataset.level === 'warn');
        const security = visible.filter(entry => 
            entry.dataset.source === 'security' || 
            entry.dataset.category === 'authentication' || 
            entry.dataset.category === 'malware'
        );

        const totalElement = this.app.windowElement?.querySelector('#total-logs');
        const errorElement = this.app.windowElement?.querySelector('#error-logs');
        const warningElement = this.app.windowElement?.querySelector('#warning-logs');
        const securityElement = this.app.windowElement?.querySelector('#security-logs');
        const countElement = this.app.windowElement?.querySelector('#log-count');

        if (totalElement) totalElement.textContent = `Total: ${visible.length}`;
        if (errorElement) errorElement.textContent = `Errors: ${errors.length}`;
        if (warningElement) warningElement.textContent = `Warnings: ${warnings.length}`;
        if (securityElement) securityElement.textContent = `Security: ${security.length}`;
        if (countElement) countElement.textContent = `${visible.length} entries`;
    }

    updateLastUpdate() {
        const now = new Date().toLocaleTimeString();
        const lastUpdateElement = this.app.windowElement?.querySelector('#last-update');
        if (lastUpdateElement) {
            lastUpdateElement.textContent = `Last updated: ${now}`;
        }
    }
}
