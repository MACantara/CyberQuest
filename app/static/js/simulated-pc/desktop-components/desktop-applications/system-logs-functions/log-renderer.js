export class LogRenderer {
    constructor(app) {
        this.app = app;
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
        
        // Add IP address badge if available in the context
        const ipBadge = log.context?.ip ? 
            `<span class="bg-blue-900 text-blue-200 text-xs px-1.5 py-0.5 rounded ml-2">IP: ${log.context.ip}</span>` : '';
            
        // Add domain badge if available in the context
        const domainBadge = log.context?.domain ?
            `<span class="bg-purple-900 text-purple-200 text-xs px-1.5 py-0.5 rounded ml-1">${log.context.domain}</span>` : '';
        
        return `
            <div class="log-entry grid grid-cols-6 gap-2 p-2 border-b border-gray-700 hover:bg-gray-800 transition-colors duration-200 text-xs cursor-pointer" 
                 data-level="${log.level.toLowerCase()}" 
                 data-source="${log.source}" 
                 data-category="${log.category}"
                 data-ip="${log.context?.ip || ''}">
                <div class="flex items-center">
                    <span class="text-gray-400">${log.timestamp}</span>
                </div>
                <div class="flex items-center">
                    <span class="log-level ${levelClass} px-2 py-1 rounded text-center font-semibold">${log.level}</span>
                </div>
                <div class="flex items-center">
                    <span class="text-gray-300">${log.source}</span>
                </div>
                <div class="flex items-center">
                    <span class="${categoryClass}">${log.category}</span>
                </div>
                <div class="flex items-center">
                    <span class="text-gray-200">${log.message}</span>
                    ${domainBadge}
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-gray-400 text-xs">${log.details}</span>
                    ${ipBadge}
                </div>
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

    addLogEntry(logData) {
        const logsContainer = this.app.windowElement?.querySelector('#logs-container');
        if (!logsContainer) return;

        const logElement = this.createLogElement(logData);
        // Add new logs at the bottom (most recent)
        logsContainer.insertAdjacentHTML('beforeend', logElement);
        
        // Apply current filters
        this.app.applyFilters();
        
        // Auto-scroll to bottom to show newest log
        logsContainer.scrollTop = logsContainer.scrollHeight;
    }

    applyFilters() {
        const entries = this.app.windowElement?.querySelectorAll('.log-entry');
        if (!entries) return;

        entries.forEach(entry => {
            const level = entry.dataset.level;
            const source = entry.dataset.source;
            const category = entry.dataset.category;
            
            let shouldShow = true;
            
            // Level filter
            if (this.app.currentLevelFilter !== 'all' && level !== this.app.currentLevelFilter) {
                shouldShow = false;
            }
            
            // Source filter
            if (this.app.currentSourceFilter !== 'all' && source !== this.app.currentSourceFilter) {
                shouldShow = false;
            }
            
            // Category filter
            if (this.app.currentCategoryFilter !== 'all' && category !== this.app.currentCategoryFilter) {
                shouldShow = false;
            }
            
            entry.style.display = shouldShow ? 'grid' : 'none';
        });
        
        this.app.logUI.updateLogCounts();
    }
}
