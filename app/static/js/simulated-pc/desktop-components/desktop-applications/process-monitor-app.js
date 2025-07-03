import { WindowBase } from '../window-base.js';

export class ProcessMonitorApp extends WindowBase {
    constructor() {
        super('process-monitor', 'Process Monitor', {
            width: '85%',
            height: '75%'
        });
        
        this.processes = [];
        this.selectedProcess = null;
        this.sortColumn = 'name';
        this.sortDirection = 'asc';
        this.refreshInterval = null;
        this.isRealTime = true;
        
        // Initialize process data
        this.generateProcessData();
    }

    createContent() {
        return `
            <div class="h-full flex flex-col bg-gray-900 text-white">
                <!-- Header Controls -->
                <div class="bg-gray-800 p-3 border-b border-gray-700 flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <h2 class="text-lg font-semibold text-green-400">Process Monitor</h2>
                        <div class="flex items-center space-x-2">
                            <div class="w-2 h-2 rounded-full ${this.isRealTime ? 'bg-green-400 animate-pulse' : 'bg-red-400'}"></div>
                            <span class="text-sm text-gray-300">${this.isRealTime ? 'Real-time' : 'Paused'}</span>
                        </div>
                    </div>
                    
                    <div class="flex items-center space-x-2">
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
                <div class="bg-gray-800 p-3 border-b border-gray-700 grid grid-cols-4 gap-4 text-sm">
                    <div class="text-center">
                        <div class="text-blue-400 font-semibold">CPU Usage</div>
                        <div class="text-xl font-bold" id="cpu-usage">23%</div>
                    </div>
                    <div class="text-center">
                        <div class="text-green-400 font-semibold">Memory</div>
                        <div class="text-xl font-bold" id="memory-usage">2.4/8.0 GB</div>
                    </div>
                    <div class="text-center">
                        <div class="text-yellow-400 font-semibold">Processes</div>
                        <div class="text-xl font-bold" id="process-count">${this.processes.length}</div>
                    </div>
                    <div class="text-center">
                        <div class="text-purple-400 font-semibold">Threads</div>
                        <div class="text-xl font-bold" id="thread-count">${this.getTotalThreads()}</div>
                    </div>
                </div>

                <!-- Process List -->
                <div class="flex-1 overflow-hidden">
                    <div class="h-full overflow-y-auto">
                        <table class="w-full text-sm">
                            <thead class="bg-gray-700 sticky top-0">
                                <tr>
                                    <th class="px-3 py-2 text-left cursor-pointer hover:bg-gray-600 transition-colors sortable" data-column="name">
                                        Process Name
                                        <i class="bi bi-chevron-${this.sortColumn === 'name' ? (this.sortDirection === 'asc' ? 'up' : 'down') : 'expand'} ml-1 text-xs"></i>
                                    </th>
                                    <th class="px-3 py-2 text-left cursor-pointer hover:bg-gray-600 transition-colors sortable" data-column="pid">
                                        PID
                                        <i class="bi bi-chevron-${this.sortColumn === 'pid' ? (this.sortDirection === 'asc' ? 'up' : 'down') : 'expand'} ml-1 text-xs"></i>
                                    </th>
                                    <th class="px-3 py-2 text-left cursor-pointer hover:bg-gray-600 transition-colors sortable" data-column="status">
                                        Status
                                        <i class="bi bi-chevron-${this.sortColumn === 'status' ? (this.sortDirection === 'asc' ? 'up' : 'down') : 'expand'} ml-1 text-xs"></i>
                                    </th>
                                    <th class="px-3 py-2 text-right cursor-pointer hover:bg-gray-600 transition-colors sortable" data-column="cpu">
                                        CPU %
                                        <i class="bi bi-chevron-${this.sortColumn === 'cpu' ? (this.sortDirection === 'asc' ? 'up' : 'down') : 'expand'} ml-1 text-xs"></i>
                                    </th>
                                    <th class="px-3 py-2 text-right cursor-pointer hover:bg-gray-600 transition-colors sortable" data-column="memory">
                                        Memory
                                        <i class="bi bi-chevron-${this.sortColumn === 'memory' ? (this.sortDirection === 'asc' ? 'up' : 'down') : 'expand'} ml-1 text-xs"></i>
                                    </th>
                                    <th class="px-3 py-2 text-center cursor-pointer hover:bg-gray-600 transition-colors sortable" data-column="threads">
                                        Threads
                                        <i class="bi bi-chevron-${this.sortColumn === 'threads' ? (this.sortDirection === 'asc' ? 'up' : 'down') : 'expand'} ml-1 text-xs"></i>
                                    </th>
                                    <th class="px-3 py-2 text-left">Path</th>
                                </tr>
                            </thead>
                            <tbody id="process-table-body">
                                ${this.renderProcessRows()}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Process Details Panel -->
                <div id="process-details" class="bg-gray-800 border-t border-gray-700 p-4 ${this.selectedProcess ? '' : 'hidden'}">
                    <h3 class="text-lg font-semibold text-green-400 mb-3">Process Details</h3>
                    <div id="process-details-content">
                        ${this.selectedProcess ? this.renderProcessDetails(this.selectedProcess) : ''}
                    </div>
                </div>
            </div>
        `;
    }

    generateProcessData() {
        // Generate realistic process data
        const systemProcesses = [
            { name: 'System', executable: 'System', cpu: 0.1, memory: 128, priority: 'System', status: 'Running' },
            { name: 'explorer.exe', executable: 'explorer.exe', cpu: 2.3, memory: 45.2, priority: 'Normal', status: 'Running' },
            { name: 'chrome.exe', executable: 'chrome.exe', cpu: 15.7, memory: 234.8, priority: 'Normal', status: 'Running' },
            { name: 'cyberquest.exe', executable: 'cyberquest.exe', cpu: 8.2, memory: 156.4, priority: 'High', status: 'Running' },
            { name: 'svchost.exe', executable: 'svchost.exe', cpu: 1.1, memory: 32.6, priority: 'Normal', status: 'Running' },
            { name: 'antivirus.exe', executable: 'antivirus.exe', cpu: 3.4, memory: 78.9, priority: 'Normal', status: 'Running' },
            { name: 'malware_scanner.exe', executable: 'malware_scanner.exe', cpu: 0.8, memory: 23.4, priority: 'Low', status: 'Running' },
            { name: 'notepad.exe', executable: 'notepad.exe', cpu: 0.0, memory: 12.3, priority: 'Normal', status: 'Running' },
            { name: 'suspicious_process.exe', executable: 'temp\\suspicious_process.exe', cpu: 25.6, memory: 89.7, priority: 'High', status: 'Running' },
            { name: 'winlogon.exe', executable: 'winlogon.exe', cpu: 0.2, memory: 18.9, priority: 'System', status: 'Running' },
            { name: 'csrss.exe', executable: 'csrss.exe', cpu: 0.5, memory: 45.1, priority: 'System', status: 'Running' },
            { name: 'lsass.exe', executable: 'lsass.exe', cpu: 0.3, memory: 34.7, priority: 'System', status: 'Running' },
            { name: 'network_monitor.exe', executable: 'network_monitor.exe', cpu: 2.1, memory: 67.3, priority: 'Normal', status: 'Running' },
            { name: 'keylogger.exe', executable: 'hidden\\keylogger.exe', cpu: 12.4, memory: 45.8, priority: 'Normal', status: 'Running' },
            { name: 'backup_service.exe', executable: 'backup_service.exe', cpu: 1.8, memory: 56.2, priority: 'Low', status: 'Running' }
        ];

        this.processes = systemProcesses.map((proc, index) => ({
            ...proc,
            pid: 1000 + index * 100 + Math.floor(Math.random() * 99),
            threads: Math.floor(Math.random() * 20) + 1,
            startTime: new Date(Date.now() - Math.random() * 86400000).toLocaleString(),
            suspicious: proc.name.includes('suspicious') || proc.name.includes('keylogger') || proc.executable.includes('temp\\') || proc.executable.includes('hidden\\')
        }));

        this.sortProcesses();
    }

    sortProcesses() {
        this.processes.sort((a, b) => {
            let aVal = a[this.sortColumn];
            let bVal = b[this.sortColumn];

            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (this.sortDirection === 'asc') {
                return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
            } else {
                return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
            }
        });
    }

    renderProcessRows() {
        return this.processes.map(process => {
            const isSelected = this.selectedProcess && this.selectedProcess.pid === process.pid;
            const rowClass = `process-row cursor-pointer hover:bg-gray-700 transition-colors ${isSelected ? 'bg-blue-800' : ''} ${process.suspicious ? 'border-l-4 border-red-500' : ''}`;
            
            return `
                <tr class="${rowClass}" data-pid="${process.pid}">
                    <td class="px-3 py-2">
                        <div class="flex items-center">
                            ${process.suspicious ? '<i class="bi bi-exclamation-triangle text-red-500 mr-2" title="Suspicious Process"></i>' : ''}
                            <span class="font-mono">${process.name}</span>
                        </div>
                    </td>
                    <td class="px-3 py-2 font-mono">${process.pid}</td>
                    <td class="px-3 py-2">
                        <span class="px-2 py-1 rounded text-xs ${this.getStatusColor(process.status)}">${process.status}</span>
                    </td>
                    <td class="px-3 py-2 text-right font-mono">${process.cpu.toFixed(1)}%</td>
                    <td class="px-3 py-2 text-right font-mono">${process.memory.toFixed(1)} MB</td>
                    <td class="px-3 py-2 text-center font-mono">${process.threads}</td>
                    <td class="px-3 py-2 font-mono text-xs text-gray-400 truncate max-w-xs" title="${process.executable}">${process.executable}</td>
                </tr>
            `;
        }).join('');
    }

    getStatusColor(status) {
        switch (status) {
            case 'Running': return 'bg-green-600 text-white';
            case 'Suspended': return 'bg-yellow-600 text-white';
            case 'Stopped': return 'bg-red-600 text-white';
            default: return 'bg-gray-600 text-white';
        }
    }

    renderProcessDetails(process) {
        return `
            <div class="grid grid-cols-2 gap-6 text-sm">
                <div>
                    <h4 class="font-semibold text-blue-400 mb-2">Basic Information</h4>
                    <div class="space-y-1">
                        <div><span class="text-gray-400">Process Name:</span> <span class="font-mono">${process.name}</span></div>
                        <div><span class="text-gray-400">PID:</span> <span class="font-mono">${process.pid}</span></div>
                        <div><span class="text-gray-400">Status:</span> <span class="font-mono">${process.status}</span></div>
                        <div><span class="text-gray-400">Priority:</span> <span class="font-mono">${process.priority}</span></div>
                        <div><span class="text-gray-400">Started:</span> <span class="font-mono">${process.startTime}</span></div>
                    </div>
                </div>
                <div>
                    <h4 class="font-semibold text-green-400 mb-2">Resource Usage</h4>
                    <div class="space-y-1">
                        <div><span class="text-gray-400">CPU Usage:</span> <span class="font-mono">${process.cpu.toFixed(1)}%</span></div>
                        <div><span class="text-gray-400">Memory:</span> <span class="font-mono">${process.memory.toFixed(1)} MB</span></div>
                        <div><span class="text-gray-400">Threads:</span> <span class="font-mono">${process.threads}</span></div>
                        <div><span class="text-gray-400">Executable:</span> <span class="font-mono text-xs">${process.executable}</span></div>
                    </div>
                </div>
            </div>
            ${process.suspicious ? `
                <div class="mt-4 p-3 bg-red-900 border border-red-700 rounded">
                    <h4 class="font-semibold text-red-400 mb-2"><i class="bi bi-exclamation-triangle mr-2"></i>Security Alert</h4>
                    <p class="text-red-300 text-sm">This process has been flagged as potentially suspicious. Consider investigating further or terminating if unauthorized.</p>
                </div>
            ` : ''}
        `;
    }

    getTotalThreads() {
        return this.processes.reduce((total, process) => total + process.threads, 0);
    }

    refreshProcessData() {
        // Simulate process changes
        this.processes.forEach(process => {
            // Slightly randomize CPU and memory usage
            process.cpu = Math.max(0, process.cpu + (Math.random() - 0.5) * 5);
            process.memory = Math.max(1, process.memory + (Math.random() - 0.5) * 10);
        });

        // Occasionally add/remove processes
        if (Math.random() < 0.1) {
            if (this.processes.length < 20 && Math.random() < 0.7) {
                // Add new process
                this.processes.push({
                    name: `temp_process_${Math.floor(Math.random() * 1000)}.exe`,
                    executable: `temp\\temp_process_${Math.floor(Math.random() * 1000)}.exe`,
                    pid: Math.floor(Math.random() * 9000) + 1000,
                    cpu: Math.random() * 20,
                    memory: Math.random() * 100 + 10,
                    threads: Math.floor(Math.random() * 10) + 1,
                    priority: 'Normal',
                    status: 'Running',
                    startTime: new Date().toLocaleString(),
                    suspicious: Math.random() < 0.3
                });
            } else if (this.processes.length > 10) {
                // Remove random process
                const randomIndex = Math.floor(Math.random() * this.processes.length);
                this.processes.splice(randomIndex, 1);
            }
        }

        this.sortProcesses();
        this.updateContent();
    }

    updateContent() {
        if (!this.windowElement) return;

        const tableBody = this.windowElement.querySelector('#process-table-body');
        const processCount = this.windowElement.querySelector('#process-count');
        const threadCount = this.windowElement.querySelector('#thread-count');
        const cpuUsage = this.windowElement.querySelector('#cpu-usage');
        const memoryUsage = this.windowElement.querySelector('#memory-usage');

        if (tableBody) {
            tableBody.innerHTML = this.renderProcessRows();
        }

        if (processCount) {
            processCount.textContent = this.processes.length;
        }

        if (threadCount) {
            threadCount.textContent = this.getTotalThreads();
        }

        if (cpuUsage) {
            const totalCpu = this.processes.reduce((sum, p) => sum + p.cpu, 0);
            cpuUsage.textContent = Math.min(100, totalCpu).toFixed(0) + '%';
        }

        if (memoryUsage) {
            const totalMemory = this.processes.reduce((sum, p) => sum + p.memory, 0);
            memoryUsage.textContent = `${(totalMemory / 1024).toFixed(1)}/8.0 GB`;
        }

        // Re-bind events for new rows
        this.bindProcessRowEvents();
    }

    initialize() {
        super.initialize();
        this.bindEvents();
        this.startRealTimeUpdates();
    }

    bindEvents() {
        const windowElement = this.windowElement;
        if (!windowElement) return;

        // Refresh button
        const refreshBtn = windowElement.querySelector('#refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshProcessData();
            });
        }

        // Toggle real-time button
        const toggleBtn = windowElement.querySelector('#toggle-realtime-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.toggleRealTime();
            });
        }

        // Kill process button
        const killBtn = windowElement.querySelector('#kill-process-btn');
        if (killBtn) {
            killBtn.addEventListener('click', () => {
                this.killSelectedProcess();
            });
        }

        // Sortable headers
        const sortableHeaders = windowElement.querySelectorAll('.sortable');
        sortableHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const column = header.getAttribute('data-column');
                this.sortBy(column);
            });
        });

        this.bindProcessRowEvents();
    }

    bindProcessRowEvents() {
        const windowElement = this.windowElement;
        if (!windowElement) return;

        const processRows = windowElement.querySelectorAll('.process-row');
        processRows.forEach(row => {
            row.addEventListener('click', () => {
                const pid = parseInt(row.getAttribute('data-pid'));
                this.selectProcess(pid);
            });
        });
    }

    sortBy(column) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }
        
        this.sortProcesses();
        this.updateContent();
    }

    selectProcess(pid) {
        this.selectedProcess = this.processes.find(p => p.pid === pid);
        this.updateContent();
        
        const detailsPanel = this.windowElement?.querySelector('#process-details');
        const detailsContent = this.windowElement?.querySelector('#process-details-content');
        const killBtn = this.windowElement?.querySelector('#kill-process-btn');
        
        if (detailsPanel && detailsContent) {
            detailsPanel.classList.remove('hidden');
            detailsContent.innerHTML = this.renderProcessDetails(this.selectedProcess);
        }
        
        if (killBtn) {
            killBtn.disabled = false;
        }
    }

    killSelectedProcess() {
        if (!this.selectedProcess) return;

        // Show confirmation
        const confirmed = confirm(`Are you sure you want to end process "${this.selectedProcess.name}" (PID: ${this.selectedProcess.pid})?`);
        if (!confirmed) return;

        // Remove process from list
        this.processes = this.processes.filter(p => p.pid !== this.selectedProcess.pid);
        this.selectedProcess = null;
        
        // Hide details panel
        const detailsPanel = this.windowElement?.querySelector('#process-details');
        if (detailsPanel) {
            detailsPanel.classList.add('hidden');
        }
        
        this.updateContent();
        
        // Show success message
        this.showNotification('Process terminated successfully', 'success');
    }

    toggleRealTime() {
        this.isRealTime = !this.isRealTime;
        
        if (this.isRealTime) {
            this.startRealTimeUpdates();
        } else {
            this.stopRealTimeUpdates();
        }
        
        this.updateContent();
    }

    startRealTimeUpdates() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        
        this.refreshInterval = setInterval(() => {
            if (this.isRealTime) {
                this.refreshProcessData();
            }
        }, 3000); // Update every 3 seconds
    }

    stopRealTimeUpdates() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
            type === 'success' ? 'bg-green-600 text-white' : 
            type === 'error' ? 'bg-red-600 text-white' : 
            'bg-blue-600 text-white'
        }`;
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('opacity-0', 'transform', 'translate-x-full');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }

    cleanup() {
        this.stopRealTimeUpdates();
        super.cleanup();
    }
}
