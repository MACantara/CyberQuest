
import { WindowBase } from '../window-base.js';
import { ProcessDataManager } from './process-monitor-functions/process-data-manager.js';
import { ProcessSorter } from './process-monitor-functions/process-sorter.js';
import { ProcessRenderer } from './process-monitor-functions/process-renderer.js';
import { ProcessEventHandler } from './process-monitor-functions/process-event-handler.js';
import { NotificationManager } from './process-monitor-functions/notification-manager.js';
import { ProcessMonitorActivityEmitter } from './process-monitor-functions/process-monitor-activity-emitter.js';

export class ProcessMonitorApp extends WindowBase {
    constructor() {
        super('process-monitor', 'Process Monitor', {
            width: '85%',
            height: '75%'
        });
        
        this.selectedProcess = null;
        this.isRealTime = true;
        
        // Set up activity emission system with error handling
        try {
            this.setupActivityEmission(ProcessMonitorActivityEmitter);
        } catch (error) {
            console.warn('Failed to set up activity emission for process monitor:', error.message);
            // Continue without activity emission if it fails
            this.activityEmitter = null;
        }
        
        // Initialize modular components with activity emitter (may be null)
        this.dataManager = new ProcessDataManager(this.activityEmitter);
        this.sorter = new ProcessSorter();
        this.renderer = new ProcessRenderer(this.dataManager, this.sorter);
        this.eventHandler = new ProcessEventHandler(this, this.dataManager, this.sorter, this.renderer);
        
        // Sort initial data
        this.sorter.sortProcesses(this.dataManager.getProcesses());
    }

    createContent() {
        return `
            <div class="h-full flex flex-col bg-gray-900 text-white">
                <!-- Header Controls -->
                <div id="process-monitor-header" class="bg-gray-800 p-3 border-b border-gray-700 flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <h2 class="text-lg font-semibold text-green-400">Process Monitor</h2>
                        <div class="flex items-center space-x-2">
                            <div class="w-2 h-2 rounded-full ${this.isRealTime ? 'bg-green-400 animate-pulse' : 'bg-red-400'}"></div>
                            <span class="text-sm text-gray-300">${this.isRealTime ? 'Real-time' : 'Paused'}</span>
                        </div>
                    </div>
                    
                    <div id="process-monitor-controls" class="flex items-center space-x-2">
                        <button id="refresh-btn" class="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm transition-colors cursor-pointer">
                            <i class="bi bi-arrow-clockwise mr-1"></i>Refresh
                        </button>
                        <button id="toggle-realtime-btn" class="px-3 py-1 ${this.isRealTime ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'} text-white rounded text-sm transition-colors cursor-pointer">
                            ${this.isRealTime ? 'Pause' : 'Resume'}
                        </button>
                        <button id="kill-process-btn" class="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-sm transition-colors cursor-pointer disabled:opacity-50" ${!this.selectedProcess ? 'disabled' : ''}>
                            <i class="bi bi-x-circle mr-1"></i>End Process
                        </button>
                    </div>
                </div>

                <!-- System Stats -->
                <div id="system-stats-panel" class="bg-gray-800 p-3 border-b border-gray-700 grid grid-cols-4 gap-4 text-sm">
                    <div class="text-center">
                        <div class="text-blue-400 font-semibold">CPU Usage</div>
                        <div class="text-xl font-bold" id="cpu-usage">${this.dataManager.getTotalCpuUsage().toFixed(0)}%</div>
                    </div>
                    <div class="text-center">
                        <div class="text-green-400 font-semibold">Memory</div>
                        <div class="text-xl font-bold" id="memory-usage">${this.dataManager.getTotalMemoryUsage().toFixed(1)}/8.0 GB</div>
                    </div>
                    <div class="text-center">
                        <div class="text-yellow-400 font-semibold">Processes</div>
                        <div class="text-xl font-bold" id="process-count">${this.dataManager.getProcessCount()}</div>
                    </div>
                    <div class="text-center">
                        <div class="text-purple-400 font-semibold">Threads</div>
                        <div class="text-xl font-bold" id="thread-count">${this.dataManager.getTotalThreads()}</div>
                    </div>
                </div>

                <!-- Process List -->
                <div class="flex-1 overflow-hidden">
                    <div class="h-full overflow-y-auto">
                        <table id="process-table" class="w-full text-sm">
                            <thead id="process-table-header" class="bg-gray-700 sticky top-0">
                                <tr>
                                    <th id="sort-name" class="px-3 py-2 text-left cursor-pointer hover:bg-gray-600 transition-colors sortable" data-column="name">
                                        Process Name
                                        <i class="bi bi-chevron-expand ml-1 text-xs"></i>
                                    </th>
                                    <th id="sort-pid" class="px-3 py-2 text-left cursor-pointer hover:bg-gray-600 transition-colors sortable" data-column="pid">
                                        PID
                                        <i class="bi bi-chevron-expand ml-1 text-xs"></i>
                                    </th>
                                    <th id="sort-status" class="px-3 py-2 text-left cursor-pointer hover:bg-gray-600 transition-colors sortable" data-column="status">
                                        Status
                                        <i class="bi bi-chevron-expand ml-1 text-xs"></i>
                                    </th>
                                    <th id="sort-cpu" class="px-3 py-2 text-right cursor-pointer hover:bg-gray-600 transition-colors sortable" data-column="cpu">
                                        CPU %
                                        <i class="bi bi-chevron-expand ml-1 text-xs"></i>
                                    </th>
                                    <th id="sort-memory" class="px-3 py-2 text-right cursor-pointer hover:bg-gray-600 transition-colors sortable" data-column="memory">
                                        Memory
                                        <i class="bi bi-chevron-expand ml-1 text-xs"></i>
                                    </th>
                                    <th id="sort-threads" class="px-3 py-2 text-center cursor-pointer hover:bg-gray-600 transition-colors sortable" data-column="threads">
                                        Threads
                                        <i class="bi bi-chevron-expand ml-1 text-xs"></i>
                                    </th>
                                    <th class="px-3 py-2 text-left">Path</th>
                                </tr>
                            </thead>
                            <tbody id="process-table-body">
                                ${this.renderer.renderProcessRows(this.selectedProcess)}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Process Details Panel -->
                <div id="process-details" class="bg-gray-800 border-t border-gray-700 p-4 ${this.selectedProcess ? '' : 'hidden'}">
                    <h3 class="text-lg font-semibold text-green-400 mb-3">Process Details</h3>
                    <div id="process-details-content">
                        ${this.selectedProcess ? this.renderer.renderProcessDetails(this.selectedProcess) : ''}
                    </div>
                </div>
            </div>
        `;
    }

    updateContent() {
        if (!this.windowElement) return;

        const tableBody = this.windowElement.querySelector('#process-table-body');
        const processCount = this.windowElement.querySelector('#process-count');
        const threadCount = this.windowElement.querySelector('#thread-count');
        const cpuUsage = this.windowElement.querySelector('#cpu-usage');
        const memoryUsage = this.windowElement.querySelector('#memory-usage');

        if (tableBody) {
            tableBody.innerHTML = this.renderer.renderProcessRows(this.selectedProcess);
        }

        if (processCount) {
            processCount.textContent = this.dataManager.getProcessCount();
        }

        if (threadCount) {
            threadCount.textContent = this.dataManager.getTotalThreads();
        }

        if (cpuUsage) {
            cpuUsage.textContent = this.dataManager.getTotalCpuUsage().toFixed(0) + '%';
        }

        if (memoryUsage) {
            memoryUsage.textContent = `${this.dataManager.getTotalMemoryUsage().toFixed(1)}/8.0 GB`;
        }

        // Update sort indicators
        this.renderer.updateSortIndicators(this.windowElement, this.sorter.getSortColumn(), this.sorter.getSortDirection());

        // Re-bind events for new rows
        this.eventHandler.bindProcessRowEvents(this.windowElement);
    }

    showNotification(message, type = 'info') {
        NotificationManager.showNotification(message, type);
    }

    initialize() {
        super.initialize(); // This will emit app started event
        this.eventHandler.bindEvents(this.windowElement);
        this.eventHandler.startRealTimeUpdates();
        
        // Remove automatic suspicious process checking - let players analyze
        
        // Add a test activity emission to verify the system is working
        if (this.activityEmitter) {
            console.log('[ProcessMonitorApp] Testing activity emission...');
            this.activityEmitter.emitActivity('app_initialized', {
                action: 'application_ready'
            }, {
                message: 'Process Monitor application initialized and ready',
                level: 'info',
                category: 'system'
            });
        }
        
        // Mark app as opened for tutorial system
        localStorage.setItem('cyberquest_process_monitor_opened', 'true');
        
        // Trigger tutorial if not completed
        setTimeout(() => {
            this.checkAndStartTutorial();
        }, 1000);
    }

    // Remove or comment out automatic suspicious process checking
    // checkForSuspiciousProcesses() {
    //     // Check for existing suspicious processes and emit alerts with safety check
    //     this.dataManager.getProcesses().forEach(process => {
    //         if (process.suspicious && this.activityEmitter && typeof this.activityEmitter.emitSuspiciousProcess === 'function') {
    //             console.log('[ProcessMonitorApp] Emitting suspicious process alert for:', process.name);
    //             this.activityEmitter.emitSuspiciousProcess(process);
    //         }
    //     });
    // }

    // Add method for players to manually flag processes
    flagProcessAsSuspicious(pid) {
        this.dataManager.flagProcessAsSuspicious(pid, true);
        this.updateContent();
        
        // Emit user action for flagging process
        if (this.activityEmitter) {
            const process = this.dataManager.getProcessByPid(pid);
            this.activityEmitter.emitUserAction('process_flagged_suspicious', {
                processName: process?.name,
                pid: pid
            });
        }
    }

    cleanup() {
        this.eventHandler.cleanup();
        super.cleanup(); // This will emit app stopped event
    }
}