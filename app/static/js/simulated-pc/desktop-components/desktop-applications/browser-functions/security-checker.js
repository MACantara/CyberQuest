export class SecurityChecker {
    constructor(browserApp) {
        this.browserApp = browserApp;
        this.threats = new Map();
        this.initializeThreats();
    }

    initializeThreats() {
        // Known threats database for training
        this.threats.set('suspicious-site.com', {
            level: 'high',
            type: 'scam',
            description: 'Known scam website attempting to steal personal information'
        });

        this.threats.set('malware-download.net', {
            level: 'critical',
            type: 'malware',
            description: 'Website known to distribute malware'
        });

        this.threats.set('phishing-bank.com', {
            level: 'high',
            type: 'phishing',
            description: 'Fake banking website designed to steal credentials'
        });
    }

    checkUrl(url) {
        const domain = this.extractDomain(url);
        const threat = this.threats.get(domain);

        return {
            isSafe: !threat,
            threat: threat || null,
            securityLevel: this.getSecurityLevel(url, threat),
            warnings: this.getWarnings(url, threat)
        };
    }

    extractDomain(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname;
        } catch (error) {
            return url.replace(/^https?:\/\//, '').split('/')[0];
        }
    }

    getSecurityLevel(url, threat) {
        if (threat) {
            switch (threat.level) {
                case 'critical': return 'dangerous';
                case 'high': return 'dangerous';
                case 'medium': return 'warning';
                case 'low': return 'caution';
            }
        }

        // Check for common safe indicators
        if (url.startsWith('https://')) {
            if (this.isKnownSafeSite(url)) {
                return 'safe';
            }
            return 'secure';
        } else {
            return 'insecure';
        }
    }

    isKnownSafeSite(url) {
        const safeDomains = [
            'cyberquest.com',
            'example-bank.com',
            'news-site.com'
        ];

        const domain = this.extractDomain(url);
        return safeDomains.includes(domain);
    }

    getWarnings(url, threat) {
        const warnings = [];

        if (threat) {
            warnings.push({
                type: 'threat',
                severity: threat.level,
                message: threat.description
            });
        }

        if (!url.startsWith('https://')) {
            warnings.push({
                type: 'security',
                severity: 'medium',
                message: 'This website does not use a secure connection (HTTPS)'
            });
        }

        // Check for suspicious URL patterns
        if (this.hasSuspiciousPatterns(url)) {
            warnings.push({
                type: 'suspicious',
                severity: 'medium',
                message: 'This URL contains suspicious patterns'
            });
        }

        return warnings;
    }

    hasSuspiciousPatterns(url) {
        const suspiciousPatterns = [
            /\d+\.\d+\.\d+\.\d+/, // IP addresses instead of domains
            /[a-z]+-[a-z]+-[a-z]+\.(tk|ml|ga|cf)/, // Common free domain patterns
            /bit\.ly|tinyurl|t\.co/, // URL shorteners
            /urgent|winner|prize|congratulations/i, // Scam keywords
            /bank.*login|paypal.*verify/i // Phishing patterns
        ];

        return suspiciousPatterns.some(pattern => pattern.test(url));
    }

    showSecurityWarning(securityCheck) {
        if (!securityCheck.warnings.length) return;

        const highSeverityWarnings = securityCheck.warnings.filter(w => 
            w.severity === 'critical' || w.severity === 'high'
        );

        if (highSeverityWarnings.length === 0) return;

        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-lg mx-4">
                <div class="text-center">
                    <i class="bi bi-shield-exclamation text-6xl text-red-500 mb-4"></i>
                    <h2 class="text-xl font-bold text-red-600 mb-4">🚨 SECURITY ALERT</h2>
                    
                    <div class="text-left mb-4">
                        <p class="text-gray-700 mb-3">
                            This website has been flagged as potentially dangerous:
                        </p>
                        
                        <div class="space-y-2">
                            ${highSeverityWarnings.map(warning => `
                                <div class="bg-red-50 border border-red-200 rounded p-3">
                                    <div class="flex items-center">
                                        <i class="bi bi-exclamation-triangle text-red-500 mr-2"></i>
                                        <span class="text-sm text-red-700">${warning.message}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                        <p class="text-sm text-blue-700">
                            <strong>Training Tip:</strong> In real life, you should immediately close 
                            this website and avoid entering any personal information.
                        </p>
                    </div>
                    
                    <div class="space-x-3">
                        <button onclick="window.browserApp?.navigation.navigateToUrl('https://cyberquest.com'); this.closest('.fixed').remove()" 
                                class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
                            Go to Safe Site
                        </button>
                        <button onclick="this.closest('.fixed').remove()" 
                                class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors">
                            Continue (Training)
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    displaySecurityStatus(securityCheck) {
        const urlBar = this.browserApp.windowElement?.querySelector('#browser-url-bar');
        if (!urlBar) return;

        // Create security indicator if it doesn't exist
        let indicator = this.browserApp.windowElement?.querySelector('.security-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'security-indicator absolute right-2 top-1/2 transform -translate-y-1/2';
            urlBar.parentElement?.style.setProperty('position', 'relative');
            urlBar.parentElement?.appendChild(indicator);
        }

        // Update indicator based on security level
        const iconMap = {
            'safe': { icon: 'shield-check', color: 'text-green-500', tooltip: 'Secure connection' },
            'secure': { icon: 'shield', color: 'text-blue-500', tooltip: 'Encrypted connection' },
            'warning': { icon: 'shield-exclamation', color: 'text-yellow-500', tooltip: 'Caution advised' },
            'dangerous': { icon: 'shield-x', color: 'text-red-500', tooltip: 'Dangerous website' },
            'insecure': { icon: 'shield-slash', color: 'text-gray-500', tooltip: 'Insecure connection' }
        };

        const iconInfo = iconMap[securityCheck.securityLevel] || iconMap['insecure'];
        
        indicator.innerHTML = `
            <i class="bi bi-${iconInfo.icon} ${iconInfo.color}" 
               title="${iconInfo.tooltip}"></i>
        `;
    }

    runSecurityScan(url) {
        const securityCheck = this.checkUrl(url);
        this.displaySecurityStatus(securityCheck);
        
        // Show warning for dangerous sites
        if (securityCheck.securityLevel === 'dangerous') {
            setTimeout(() => {
                this.showSecurityWarning(securityCheck);
            }, 1000); // Show warning after page loads
        }

        return securityCheck;
    }
}
