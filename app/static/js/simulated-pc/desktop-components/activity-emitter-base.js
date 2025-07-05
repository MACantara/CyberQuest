export class ActivityEmitterBase {
    constructor(appId, appName) {
        this.appId = appId;
        this.appName = appName;
        this.isEnabled = true;
    }

    // Core activity emission method
    emitActivity(activityType, activityData = {}, additionalData = {}) {
        if (!this.isEnabled) return;

        const eventData = {
            timestamp: new Date().toISOString(),
            source: this.appId,
            app: this.appName,
            type: activityType,
            data: activityData,
            ...additionalData
        };

        // Dispatch custom event for system logs to capture
        const event = new CustomEvent('applicationActivity', {
            detail: eventData,
            bubbles: true
        });
        
        document.dispatchEvent(event);

        console.log(`[${this.appName}] Activity emitted: ${activityType}`, eventData);
    }

    // Common application lifecycle events
    emitAppStarted() {
        this.emitActivity('app_started', {
            action: 'application_launched'
        }, {
            message: `${this.appName} application started`,
            level: 'info',
            category: 'system'
        });
    }

    emitAppStopped() {
        this.emitActivity('app_stopped', {
            action: 'application_closed'
        }, {
            message: `${this.appName} application stopped`,
            level: 'info',
            category: 'system'
        });
    }

    emitUserAction(action, details = {}) {
        this.emitActivity('user_action', {
            action,
            ...details
        }, {
            message: `User performed action: ${action} in ${this.appName}`,
            level: 'debug',
            category: 'user'
        });
    }

    emitSecurityEvent(severity, description, details = {}) {
        this.emitActivity('security_event', {
            severity,
            description,
            ...details
        }, {
            message: `Security event: ${description}`,
            level: severity === 'high' ? 'error' : severity === 'medium' ? 'warn' : 'info',
            category: 'security'
        });
    }

    emitDataUpdate(dataType, operation, details = {}) {
        this.emitActivity('data_update', {
            dataType,
            operation,
            ...details
        }, {
            message: `Data ${operation}: ${dataType} in ${this.appName}`,
            level: 'debug',
            category: 'data'
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

    // Abstract methods that must be implemented by child classes
    initializeCustomEvents() {
        throw new Error(`${this.constructor.name} must implement initializeCustomEvents() method`);
    }
}
