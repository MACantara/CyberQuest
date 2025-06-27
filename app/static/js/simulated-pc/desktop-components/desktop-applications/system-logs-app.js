import { WindowBase } from '../window-base.js';
import { LogManager } from './system-logs-functions/log-manager.js';
import { LogFilter } from './system-logs-functions/log-filter.js';
import { ActivityMonitor } from './system-logs-functions/activity-monitor.js';
import { LogUI } from './system-logs-functions/log-ui.js';
import { LogRenderer } from './system-logs-functions/log-renderer.js';

export class SystemLogsApp extends WindowBase {
    constructor() {
        super('logs', 'System Logs', {
            width: '85%',
            height: '70%'
        });
        
        this.logManager = null;
        this.logFilter = null;
        this.activityMonitor = null;
        this.logUI = null;
        this.logRenderer = null;
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
                        ${this.logRenderer ? this.logRenderer.generateInitialLogs() : ''}
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

    initialize() {
        super.initialize();
        
        // Initialize all modular components
        this.logManager = new LogManager(this);
        this.logFilter = new LogFilter(this);
        this.activityMonitor = new ActivityMonitor(this);
        this.logUI = new LogUI(this);
        this.logRenderer = new LogRenderer(this);
        
        // Set up UI and monitoring
        this.logUI.bindEvents();
        this.logUI.updateLogCounts();
        this.logUI.updateLastUpdate();
        
        // Set up activity monitoring
        this.activityMonitor.setupActivityMonitoring();
        
        // Set up page navigation listener
        this.setupPageNavigationListener();
        
        // Re-render initial logs now that renderer is available
        this.updateContent();
    }
    
    setupPageNavigationListener() {
        // Listen for page navigation events
        document.addEventListener('pageNavigated', (event) => {
            if (event.detail && event.detail.page) {
                this.onPageNavigated(event.detail.page);
            }
        });
    }
    
    onPageNavigated(page) {
        if (!this.logManager) return;
        
        // Generate logs related to the page navigation
        this.logManager.generateNewLogs(page);
        
        // If auto-refresh is enabled, update the display
        if (this.autoRefresh) {
            this.applyFilters();
        }
    }

    // Delegate methods to appropriate modules
    addLogEntry(logData) {
        this.logRenderer.addLogEntry(logData);
    }

    applyFilters() {
        this.logRenderer.applyFilters();
    }

    updateContent() {
        const contentElement = this.windowElement?.querySelector('.window-content');
        if (contentElement) {
            contentElement.innerHTML = this.createContent();
            // Re-bind events after content update
            this.logUI.bindEvents();
            this.logUI.updateLogCounts();
            this.logUI.updateLastUpdate();
        }
    }

    cleanup() {
        // Clean up all modular components
        if (this.activityMonitor) {
            this.activityMonitor.cleanup();
        }
        
        // Stop auto-refresh when window is closed
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
        
        super.cleanup();
    }
}