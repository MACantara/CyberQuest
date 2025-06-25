export class LogExporter {
    constructor(app) {
        this.app = app;
    }

    showExportOptions() {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        overlay.innerHTML = `
            <div class="bg-gray-800 rounded-lg p-6 max-w-md mx-4">
                <h3 class="text-white text-lg font-semibold mb-4">Export System Logs</h3>
                
                <div class="space-y-4">
                    <div>
                        <label class="text-gray-300 text-sm">Export Format:</label>
                        <select id="export-format" class="w-full px-2 py-1 bg-gray-700 text-white border border-gray-600 rounded text-xs">
                            <option value="csv">CSV (Comma Separated)</option>
                            <option value="json">JSON Format</option>
                            <option value="txt">Plain Text</option>
                            <option value="syslog">Syslog Format</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="text-gray-300 text-sm">Include:</label>
                        <div class="space-y-2 mt-2">
                            <label class="flex items-center text-white text-xs">
                                <input type="checkbox" id="include-info" checked class="mr-2">
                                Info Messages
                            </label>
                            <label class="flex items-center text-white text-xs">
                                <input type="checkbox" id="include-warnings" checked class="mr-2">
                                Warnings
                            </label>
                            <label class="flex items-center text-white text-xs">
                                <input type="checkbox" id="include-errors" checked class="mr-2">
                                Errors & Critical
                            </label>
                            <label class="flex items-center text-white text-xs">
                                <input type="checkbox" id="include-security" checked class="mr-2">
                                Security Events
                            </label>
                        </div>
                    </div>
                    
                    <div>
                        <label class="text-gray-300 text-sm">File Name:</label>
                        <input type="text" id="export-filename" 
                               value="system_logs_${new Date().toISOString().slice(0, 10)}"
                               class="w-full px-2 py-1 bg-gray-700 text-white border border-gray-600 rounded text-xs">
                    </div>
                </div>
                
                <div class="flex justify-end space-x-2 mt-6">
                    <button onclick="this.closest('.fixed').remove()" 
                            class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors cursor-pointer">
                        Cancel
                    </button>
                    <button id="export-logs" 
                            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors cursor-pointer">
                        Export Logs
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        const exportBtn = overlay.querySelector('#export-logs');
        exportBtn.addEventListener('click', () => {
            this.performExport(overlay);
        });
    }

    performExport(overlay) {
        const format = overlay.querySelector('#export-format').value;
        const filename = overlay.querySelector('#export-filename').value;
        const includeInfo = overlay.querySelector('#include-info').checked;
        const includeWarnings = overlay.querySelector('#include-warnings').checked;
        const includeErrors = overlay.querySelector('#include-errors').checked;
        const includeSecurity = overlay.querySelector('#include-security').checked;
        
        // Get filtered log data
        const logData = this.getFilteredLogs({
            includeInfo,
            includeWarnings,
            includeErrors,
            includeSecurity
        });
        
        // Format the data
        const formattedData = this.formatLogData(logData, format);
        
        // Show export confirmation
        this.showExportConfirmation(filename, format, logData.length);
        overlay.remove();
    }

    getFilteredLogs(options) {
        const entries = this.app.windowElement?.querySelectorAll('.log-entry');
        if (!entries) return [];

        return Array.from(entries)
            .filter(entry => {
                if (entry.style.display === 'none') return false;
                
                const level = entry.dataset.level.toLowerCase();
                const source = entry.dataset.source;
                const category = entry.dataset.category;
                
                if (level === 'info' && !options.includeInfo) return false;
                if (level === 'warn' && !options.includeWarnings) return false;
                if (['error', 'critical'].includes(level) && !options.includeErrors) return false;
                if ((source === 'security' || category === 'authentication' || category === 'malware') && !options.includeSecurity) return false;
                
                return true;
            })
            .map(entry => ({
                timestamp: entry.children[0].textContent,
                level: entry.children[1].textContent,
                source: entry.children[2].textContent,
                category: entry.children[3].textContent,
                message: entry.children[4].textContent,
                details: entry.children[5].textContent
            }));
    }

    formatLogData(data, format) {
        switch (format) {
            case 'csv':
                return this.formatCSV(data);
            case 'json':
                return this.formatJSON(data);
            case 'syslog':
                return this.formatSyslog(data);
            case 'txt':
            default:
                return this.formatText(data);
        }
    }

    formatCSV(data) {
        const headers = 'Timestamp,Level,Source,Category,Message,Details\n';
        const rows = data.map(log => 
            `"${log.timestamp}","${log.level}","${log.source}","${log.category}","${log.message}","${log.details}"`
        ).join('\n');
        return headers + rows;
    }

    formatJSON(data) {
        return JSON.stringify(data, null, 2);
    }

    formatText(data) {
        return data.map(log => 
            `[${log.timestamp}] [${log.level}] ${log.source}/${log.category}: ${log.message} (${log.details})`
        ).join('\n');
    }

    formatSyslog(data) {
        return data.map(log => {
            const priority = this.getLevelPriority(log.level);
            return `<${priority}>${log.timestamp} ${log.source}: ${log.message}`;
        }).join('\n');
    }

    getLevelPriority(level) {
        const priorities = {
            'CRITICAL': '2',  // Critical
            'ERROR': '3',     // Error
            'WARN': '4',      // Warning
            'INFO': '6',      // Informational
            'DEBUG': '7'      // Debug
        };
        return priorities[level] || '6';
    }

    showExportConfirmation(filename, format, count) {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        overlay.innerHTML = `
            <div class="bg-gray-800 rounded-lg p-6 max-w-md mx-4">
                <div class="text-center">
                    <i class="bi bi-check-circle text-green-400 text-4xl mb-3"></i>
                    <h3 class="text-white text-lg font-semibold mb-2">Export Completed</h3>
                    <div class="bg-black p-3 rounded text-left mb-4 text-sm">
                        <div class="text-gray-400">File: <span class="text-white">${filename}.${format}</span></div>
                        <div class="text-gray-400">Format: <span class="text-white">${format.toUpperCase()}</span></div>
                        <div class="text-gray-400">Records: <span class="text-white">${count}</span></div>
                    </div>
                    <p class="text-gray-300 text-sm mb-4">
                        Log export completed successfully. In a real environment, this file would be saved to your system.
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
}
