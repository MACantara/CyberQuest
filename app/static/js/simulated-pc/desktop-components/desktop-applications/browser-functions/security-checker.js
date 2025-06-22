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

        this.threats.set('phishing-bank.com', {
            level: 'critical',
            type: 'phishing',
            description: 'Fake banking website designed to steal credentials and personal information'
        });

        this.threats.set('malware-download.net', {
            level: 'critical',
            type: 'malware',
            description: 'Website known to distribute malware'
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

    displaySecurityStatus(securityCheck) {
        const urlBar = this.browserApp.windowElement?.querySelector('#browser-url-bar');
        if (!urlBar) return;

        // Create security indicator if it doesn't exist
        let indicator = this.browserApp.windowElement?.querySelector('.security-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'security-indicator absolute left-2 top-1/2 transform -translate-y-1/2';
            urlBar.parentElement?.style.setProperty('position', 'relative');
            urlBar.parentElement?.appendChild(indicator);
            
            // Add left padding to URL bar to make space for the indicator
            urlBar.style.paddingLeft = '2rem';
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
        return securityCheck;
    }
}