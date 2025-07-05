import { ActivityEmitterBase } from '../../activity-emitter-base.js';

export class ProcessMonitorActivityEmitter extends ActivityEmitterBase {
    constructor(appId, appName) {
        super(appId, appName);
    }

    // Implement required method
    initializeCustomEvents() {
        // Process monitor specific initialization
        console.log(`[${this.appName}] Custom activity events initialized`);
    }

    // Process-specific activity emission methods
    emitProcessStart(process) {
        console.log('[ProcessMonitorActivityEmitter] Emitting process start:', process.name);
        this.emitActivity('process_started', {
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
        console.log('[ProcessMonitorActivityEmitter] Emitting process terminated:', process.name);
        this.emitActivity('process_terminated', {
            name: process.name,
            pid: process.pid,
            executable: process.executable,
            terminatedBy
        }, {
            message: `Process ${process.name} (PID: ${process.pid}) terminated by ${terminatedBy}`,
            level: terminatedBy === 'user' ? 'warn' : 'info',
            category: 'process'
        });
    }

    emitSuspiciousProcess(process) {
        console.log('[ProcessMonitorActivityEmitter] Emitting suspicious process:', process.name);
        this.emitActivity('suspicious_process_detected', {
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
        this.emitActivity('high_resource_usage', {
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

    emitProcessRefresh(processCount) {
        this.emitActivity('process_refresh', {
            action: 'data_refresh',
            processCount
        }, {
            message: `Process list refreshed - ${processCount} processes monitored`,
            level: 'debug',
            category: 'system'
        });
    }

    emitRealTimeToggle(enabled) {
        this.emitActivity('realtime_toggle', {
            action: 'monitoring_mode_change',
            realTimeEnabled: enabled
        }, {
            message: `Real-time monitoring ${enabled ? 'enabled' : 'disabled'}`,
            level: 'info',
            category: 'system'
        });
    }

    emitProcessSorted(column, direction) {
        this.emitActivity('process_sorted', {
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
        this.emitActivity('process_selected', {
            name: process.name,
            pid: process.pid,
            action: 'process_inspected'
        }, {
            message: `Process selected for inspection: ${process.name} (PID: ${process.pid})`,
            level: 'debug',
            category: 'system'
        });
    }
}
