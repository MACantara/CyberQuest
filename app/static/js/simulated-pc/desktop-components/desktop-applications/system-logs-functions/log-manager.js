export class LogManager {
    constructor(app) {
        this.app = app;
        this.logTemplates = this.initializeLogTemplates();
    }

    initializeLogTemplates() {
        return [
            { level: 'INFO', source: 'system', category: 'service', message: 'Service restarted successfully', details: 'PID: {pid}' },
            { level: 'WARN', source: 'security', category: 'authentication', message: 'Repeated login failures', details: 'User: {user}, IP: {ip}' },
            { level: 'ERROR', source: 'network', category: 'connection', message: 'Network timeout occurred', details: 'Target: {target}' },
            { level: 'CRITICAL', source: 'security', category: 'malware', message: 'Threat detected and blocked', details: 'File: {file}, Signature: {sig}' },
            { level: 'INFO', source: 'system', category: 'update', message: 'System update completed', details: 'Version: {version}' },
            { level: 'WARN', source: 'network', category: 'traffic', message: 'Suspicious traffic pattern', details: 'Protocol: {protocol}, Volume: {volume}' },
            { level: 'ERROR', source: 'system', category: 'disk', message: 'Disk space critically low', details: 'Partition: {partition}, Free: {free}%' },
            { level: 'INFO', source: 'security', category: 'scan', message: 'Security scan completed', details: 'Duration: {duration}s, Issues: {issues}' }
        ];
    }

    generateNewLogs() {
        const count = Math.floor(Math.random() * 3) + 1; // 1-3 new logs
        
        for (let i = 0; i < count; i++) {
            const template = this.logTemplates[Math.floor(Math.random() * this.logTemplates.length)];
            const logEntry = this.createLogFromTemplate(template);
            this.app.addLogEntry(logEntry);
        }
    }

    createLogFromTemplate(template) {
        // Generate timestamp that's always newer than existing logs
        const now = new Date();
        const timestamp = now.toISOString().slice(0, 19).replace('T', ' ');
        
        return {
            timestamp: timestamp,
            level: template.level,
            source: template.source,
            category: template.category,
            message: template.message,
            details: this.fillTemplateDetails(template.details)
        };
    }

    fillTemplateDetails(template) {
        const replacements = {
            '{pid}': Math.floor(Math.random() * 9999) + 1000,
            '{user}': ['admin', 'guest', 'user1', 'backup'][Math.floor(Math.random() * 4)],
            '{ip}': this.generateRandomIP(),
            '{target}': this.generateRandomTarget(),
            '{file}': ['suspicious.exe', 'malware.dat', 'trojan.bin', 'virus.tmp'][Math.floor(Math.random() * 4)],
            '{sig}': ['TR-' + Math.floor(Math.random() * 9999), 'VIR-' + Math.floor(Math.random() * 9999)][Math.floor(Math.random() * 2)],
            '{version}': '2.1.' + Math.floor(Math.random() * 100),
            '{protocol}': ['TCP', 'UDP', 'ICMP'][Math.floor(Math.random() * 3)],
            '{volume}': Math.floor(Math.random() * 1000) + 'MB',
            '{partition}': ['/var', '/tmp', '/home'][Math.floor(Math.random() * 3)],
            '{free}': Math.floor(Math.random() * 10) + 5,
            '{duration}': Math.floor(Math.random() * 300) + 30,
            '{issues}': Math.floor(Math.random() * 5)
        };

        let result = template;
        Object.entries(replacements).forEach(([key, value]) => {
            result = result.replace(key, value);
        });

        return result;
    }

    generateRandomIP() {
        return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    }

    generateRandomTarget() {
        const targets = [
            'api.example.com:443',
            'update.service.com:80',
            'backup.server.net:22',
            'mail.company.org:993'
        ];
        return targets[Math.floor(Math.random() * targets.length)];
    }

    exportLogs(filterCriteria = {}) {
        const entries = this.app.windowElement?.querySelectorAll('.log-entry');
        if (!entries) return [];

        return Array.from(entries)
            .filter(entry => entry.style.display !== 'none')
            .map(entry => ({
                timestamp: entry.children[0].textContent,
                level: entry.children[1].textContent,
                source: entry.children[2].textContent,
                category: entry.children[3].textContent,
                message: entry.children[4].textContent,
                details: entry.children[5].textContent
            }));
    }

    getLogsByTimeRange(hours = 24) {
        const entries = this.app.windowElement?.querySelectorAll('.log-entry');
        if (!entries) return [];
        
        const cutoffTime = new Date();
        cutoffTime.setHours(cutoffTime.getHours() - hours);
        
        return Array.from(entries)
            .filter(entry => {
                const timestamp = entry.children[0].textContent;
                const logTime = new Date(timestamp);
                return logTime >= cutoffTime;
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

    getLogStatistics() {
        const entries = this.app.windowElement?.querySelectorAll('.log-entry');
        if (!entries) return {};
        
        const stats = {
            total: entries.length,
            byLevel: {},
            bySource: {},
            byCategory: {},
            visible: 0
        };
        
        entries.forEach(entry => {
            const level = entry.dataset.level;
            const source = entry.dataset.source;
            const category = entry.dataset.category;
            
            // Count by level
            stats.byLevel[level] = (stats.byLevel[level] || 0) + 1;
            
            // Count by source
            stats.bySource[source] = (stats.bySource[source] || 0) + 1;
            
            // Count by category
            stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
            
            // Count visible entries
            if (entry.style.display !== 'none') {
                stats.visible++;
            }
        });
        
        return stats;
    }
}
