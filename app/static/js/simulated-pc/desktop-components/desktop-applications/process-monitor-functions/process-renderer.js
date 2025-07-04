export class ProcessRenderer {
    constructor(dataManager, sorter) {
        this.dataManager = dataManager;
        this.sorter = sorter;
    }

    renderProcessRows(selectedProcess) {
        const processes = this.dataManager.getProcesses();
        return processes.map((process, index) => {
            const isSelected = selectedProcess && selectedProcess.pid === process.pid;
            const rowClass = `process-row cursor-pointer hover:bg-gray-700 transition-colors ${isSelected ? 'bg-blue-800' : ''} ${process.suspicious ? 'border-l-4 border-red-500 suspicious-process' : ''}`;
            
            return `
                <tr id="process-row-${process.pid}" class="${rowClass}" data-pid="${process.pid}">
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

    updateSortIndicators(windowElement, sortColumn, sortDirection) {
        if (!windowElement) return;

        // Reset all sort indicators
        const headers = windowElement.querySelectorAll('.sortable i');
        headers.forEach(icon => {
            icon.className = 'bi bi-chevron-expand ml-1 text-xs';
        });

        // Set active sort indicator
        const activeHeader = windowElement.querySelector(`[data-column="${sortColumn}"] i`);
        if (activeHeader) {
            activeHeader.className = `bi bi-chevron-${sortDirection === 'asc' ? 'up' : 'down'} ml-1 text-xs`;
        }
    }
}
