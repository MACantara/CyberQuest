export class ActivityEmitter {
    constructor() {
        this.isEnabled = true;
    }

    // Emit process-related activities that system logs can track
    emitProcessActivity(activityType, processInfo, additionalData = {}) {
        if (!this.isEnabled) return;

        const activityData = {
            timestamp: new Date().toISOString(),
            source: 'process-monitor',
            type: activityType,
            process: processInfo,
            ...additionalData
        };

        // Dispatch custom event for system logs to capture
        const event = new CustomEvent('processActivity', {
            detail: activityData
        });
        document.dispatchEvent(event);

        console.log(`[ProcessMonitor] Activity emitted: ${activityType}`, activityData);
    }

    // Specific activity emission methods
    emitProcessStart(process) {
        this.emitProcessActivity('process_started', {
            name: process.name,
            pid: process.pid,
            executable: process.executable,
            priority: process.priority
        }, {
            message: `Process ${process.name} (PID: ${process.pid}) started`,
            level: 'info',
            category: 'process'
        });
    }

    emitProcessTerminated(process, terminatedBy = 'system') {
        this.emitProcessActivity('process_terminated', {
            name: process.name,
            pid: process.pid,
            executable: process.executable
        }, {
            message: `Process ${process.name} (PID: ${process.pid}) terminated by ${terminatedBy}`,
            level: terminatedBy === 'user' ? 'warn' : 'info',
            category: 'process',
            terminatedBy
        });
    }

    emitSuspiciousProcess(process) {
        this.emitProcessActivity('suspicious_process_detected', {
            name: process.name,
            pid: process.pid,
            executable: process.executable,
            cpu: process.cpu,
            memory: process.memory
        }, {
            message: `Suspicious process detected: ${process.name} (PID: ${process.pid}) from ${process.executable}`,
            level: 'error',
            category: 'security',
            threat_level: 'high'
        });
    }

    emitHighResourceUsage(process, resourceType, value) {
        this.emitProcessActivity('high_resource_usage', {
            name: process.name,
            pid: process.pid,
            resourceType,
            value
        }, {
            message: `High ${resourceType} usage detected: ${process.name} (PID: ${process.pid}) using ${value}${resourceType === 'cpu' ? '%' : 'MB'}`,
            level: 'warn',
            category: 'performance',
            resource_type: resourceType,
            usage_value: value
        });
    }

    emitProcessMonitorStart() {
        this.emitProcessActivity('monitor_started', {
            name: 'process-monitor',
            action: 'application_launched'
        }, {
            message: 'Process Monitor application started - monitoring system processes',
            level: 'info',
            category: 'system'
        });
    }

    emitProcessMonitorStop() {
        this.emitProcessActivity('monitor_stopped', {
            name: 'process-monitor',
            action: 'application_closed'
        }, {
            message: 'Process Monitor application stopped',
            level: 'info',
            category: 'system'
        });
    }

    emitProcessRefresh(processCount) {
        this.emitProcessActivity('process_refresh', {
            action: 'data_refresh',
            processCount
        }, {
            message: `Process list refreshed - ${processCount} processes monitored`,
            level: 'debug',
            category: 'system'
        });
    }

    emitRealTimeToggle(enabled) {
        this.emitProcessActivity('realtime_toggle', {
            action: 'monitoring_mode_change',
            realTimeEnabled: enabled
        }, {
            message: `Real-time monitoring ${enabled ? 'enabled' : 'disabled'}`,
            level: 'info',
            category: 'system'
        });
    }

    emitProcessSorted(column, direction) {
        this.emitProcessActivity('process_sorted', {
            action: 'data_sorted',
            sortColumn: column,
            sortDirection: direction
        }, {
            message: `Process list sorted by ${column} (${direction})`,
            level: 'debug',
            category: 'system'
        });
    }

    emitProcessSelected(process) {
        this.emitProcessActivity('process_selected', {
            name: process.name,
            pid: process.pid,
            action: 'process_inspected'
        }, {
            message: `Process selected for inspection: ${process.name} (PID: ${process.pid})`,
            level: 'debug',
            category: 'system'
        });
    }

    // Control methods
    enable() {
        this.isEnabled = true;
    }

    disable() {
        this.isEnabled = false;
    }

    isActivityEmissionEnabled() {
        return this.isEnabled;
    }
}
