export class ActivityMonitor {
    constructor(app) {
        this.app = app;
        this.boundEventHandlers = new Map();
    }

    setupActivityMonitoring() {
        // Bind event handlers to maintain proper context
        this.boundEventHandlers.set('browser-navigate', this.logBrowserActivity.bind(this));
        this.boundEventHandlers.set('email-opened', this.logEmailActivity.bind(this));
        this.boundEventHandlers.set('email-link-clicked', this.logEmailLinkActivity.bind(this));
        this.boundEventHandlers.set('file-accessed', this.logFileActivity.bind(this));
        this.boundEventHandlers.set('file-opened', this.logFileOpenActivity.bind(this));
        this.boundEventHandlers.set('suspicious-file-detected', this.logSuspiciousFileActivity.bind(this));
        this.boundEventHandlers.set('network-scan-started', this.logNetworkActivity.bind(this));
        this.boundEventHandlers.set('suspicious-traffic-detected', this.logSuspiciousTrafficActivity.bind(this));
        this.boundEventHandlers.set('terminal-command', this.logTerminalActivity.bind(this));
        this.boundEventHandlers.set('security-command-executed', this.logSecurityCommandActivity.bind(this));
        this.boundEventHandlers.set('security-alert', this.logSecurityAlert.bind(this));
        this.boundEventHandlers.set('malware-detected', this.logMalwareDetection.bind(this));
        this.boundEventHandlers.set('phishing-detected', this.logPhishingDetection.bind(this));

        // Register all event listeners
        this.boundEventHandlers.forEach((handler, eventType) => {
            document.addEventListener(eventType, handler);
        });
    }

    logBrowserActivity(e) {
        const { url } = e.detail;
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        let level = 'INFO';
        let category = 'network';
        let message = `Web browser navigation to ${url}`;
        let details = `User: trainee, Protocol: HTTPS`;

        if (this.isSuspiciousUrl(url)) {
            level = 'WARN';
            category = 'security';
            message = `Navigation to suspicious website detected`;
            details = `URL: ${url}, Risk: High, Action: Monitor`;
        }

        this.app.addLogEntry({
            timestamp,
            level,
            source: 'network',
            category,
            message,
            details
        });
    }

    logEmailActivity(e) {
        const { sender, subject, suspicious } = e.detail;
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        let level = suspicious ? 'WARN' : 'INFO';
        let category = suspicious ? 'security' : 'authentication';
        let message = suspicious ? 
            `Suspicious email opened from ${sender}` : 
            `Email accessed from ${sender}`;
        let details = `Subject: ${subject}, User: trainee`;

        if (suspicious) {
            details += `, Risk: High, Scan: Required`;
        }

        this.app.addLogEntry({
            timestamp,
            level,
            source: 'security',
            category,
            message,
            details
        });
    }

    logEmailLinkActivity(e) {
        const { url } = e.detail;
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        this.app.addLogEntry({
            timestamp,
            level: 'CRITICAL',
            source: 'security',
            category: 'malware',
            message: 'Email link clicked - potential phishing attempt',
            details: `URL: ${url}, Source: Email, Action: Block recommended`
        });
    }

    logFileActivity(e) {
        const { fileName, path, action } = e.detail;
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        this.app.addLogEntry({
            timestamp,
            level: 'INFO',
            source: 'system',
            category: 'service',
            message: `File ${action}: ${fileName}`,
            details: `Path: ${path}, User: trainee, Process: file-manager`
        });
    }

    logFileOpenActivity(e) {
        const { fileName, fileType, suspicious } = e.detail;
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        let level = suspicious ? 'WARN' : 'INFO';
        let category = suspicious ? 'security' : 'service';
        let message = suspicious ? 
            `Suspicious file opened: ${fileName}` : 
            `File opened: ${fileName}`;
        let details = `Type: ${fileType}, User: trainee`;

        if (suspicious) {
            details += `, Security scan: Recommended`;
        }

        this.app.addLogEntry({
            timestamp,
            level,
            source: suspicious ? 'security' : 'system',
            category,
            message,
            details
        });
    }

    logSuspiciousFileActivity(e) {
        const { fileName, reason, action } = e.detail;
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        this.app.addLogEntry({
            timestamp,
            level: 'CRITICAL',
            source: 'security',
            category: 'malware',
            message: `Suspicious file detected: ${fileName}`,
            details: `Reason: ${reason}, Action: ${action}, Scan: Required`
        });
    }

    logNetworkActivity(e) {
        const { action, target } = e.detail;
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        this.app.addLogEntry({
            timestamp,
            level: 'INFO',
            source: 'network',
            category: 'scan',
            message: `Network monitoring ${action}`,
            details: `Target: ${target || 'All interfaces'}, User: trainee`
        });
    }

    logSuspiciousTrafficActivity(e) {
        const { source, destination, protocol, reason } = e.detail;
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        this.app.addLogEntry({
            timestamp,
            level: 'CRITICAL',
            source: 'network',
            category: 'traffic',
            message: 'Suspicious network traffic detected',
            details: `${source} -> ${destination}, Protocol: ${protocol}, Reason: ${reason}`
        });
    }

    logTerminalActivity(e) {
        const { command, user, exitCode } = e.detail;
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        let level = exitCode === 0 ? 'INFO' : 'WARN';
        let category = this.isSecurityCommand(command) ? 'security' : 'service';
        
        this.app.addLogEntry({
            timestamp,
            level,
            source: 'system',
            category,
            message: `Terminal command executed: ${command}`,
            details: `User: ${user}, Exit code: ${exitCode}, Shell: bash`
        });
    }

    logSecurityCommandActivity(e) {
        const { command, result, risk } = e.detail;
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        this.app.addLogEntry({
            timestamp,
            level: risk === 'high' ? 'WARN' : 'INFO',
            source: 'security',
            category: 'scan',
            message: `Security command executed: ${command}`,
            details: `Result: ${result}, Risk level: ${risk}, User: trainee`
        });
    }

    logSecurityAlert(e) {
        const { type, severity, message, source } = e.detail;
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        let level = 'WARN';
        if (severity === 'critical') level = 'CRITICAL';
        if (severity === 'low') level = 'INFO';
        
        this.app.addLogEntry({
            timestamp,
            level,
            source: 'security',
            category: 'authentication',
            message: `Security alert: ${type}`,
            details: `${message}, Source: ${source}, Severity: ${severity}`
        });
    }

    logMalwareDetection(e) {
        const { fileName, signature, action } = e.detail;
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        this.app.addLogEntry({
            timestamp,
            level: 'CRITICAL',
            source: 'security',
            category: 'malware',
            message: `Malware detected: ${fileName}`,
            details: `Signature: ${signature}, Action: ${action}, Status: Quarantined`
        });
    }

    logPhishingDetection(e) {
        const { url, reason, action } = e.detail;
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        this.app.addLogEntry({
            timestamp,
            level: 'CRITICAL',
            source: 'security',
            category: 'authentication',
            message: 'Phishing attempt detected',
            details: `URL: ${url}, Reason: ${reason}, Action: ${action}`
        });
    }

    isSuspiciousUrl(url) {
        const suspiciousDomains = [
            'suspicious-site.com',
            'secure-verify-support.com',
            'phishing-bank.com',
            'fake-security.net',
            'malicious-download.org'
        ];
        
        return suspiciousDomains.some(domain => url.includes(domain));
    }

    isSecurityCommand(command) {
        const securityCommands = [
            'sudo', 'su', 'chmod', 'chown', 'passwd', 'ssh', 'scp',
            'netstat', 'ps', 'top', 'kill', 'nmap', 'wireshark',
            'iptables', 'ufw', 'fail2ban', 'clamav', 'rkhunter'
        ];
        
        return securityCommands.some(cmd => command.startsWith(cmd));
    }

    cleanup() {
        // Remove all event listeners using bound handlers
        this.boundEventHandlers.forEach((handler, eventType) => {
            document.removeEventListener(eventType, handler);
        });
        this.boundEventHandlers.clear();
    }
}
