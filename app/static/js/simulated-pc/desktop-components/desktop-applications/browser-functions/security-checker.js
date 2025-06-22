export class SecurityChecker {
    constructor(browserApp) {
        this.browserApp = browserApp;
        this.threats = new Map();
        this.certificates = new Map();
        this.initializeThreats();
        this.initializeCertificates();
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

    initializeCertificates() {
        // Simulated SSL certificate data for training
        this.certificates.set('cyberquest.com', {
            valid: true,
            issuer: 'Let\'s Encrypt Authority X3',
            expires: '2024-12-20',
            algorithm: 'RSA 2048-bit',
            trusted: true
        });

        this.certificates.set('example-bank.com', {
            valid: true,
            issuer: 'DigiCert SHA2 Extended Validation Server CA',
            expires: '2024-11-15',
            algorithm: 'RSA 4096-bit',
            trusted: true,
            extendedValidation: true
        });

        this.certificates.set('news-site.com', {
            valid: true,
            issuer: 'CloudFlare Inc ECC CA-3',
            expires: '2024-10-30',
            algorithm: 'ECDSA P-256',
            trusted: true
        });

        this.certificates.set('suspicious-site.com', {
            valid: false,
            issuer: 'Self-signed',
            expires: '2023-01-01',
            algorithm: 'RSA 1024-bit',
            trusted: false,
            selfSigned: true
        });

        this.certificates.set('phishing-bank.com', {
            valid: false,
            issuer: 'Fake CA Authority',
            expires: '2024-01-01',
            algorithm: 'RSA 2048-bit',
            trusted: false,
            warnings: ['Domain mismatch', 'Untrusted issuer']
        });
    }

    checkUrl(url) {
        const domain = this.extractDomain(url);
        const threat = this.threats.get(domain);
        const certificate = this.certificates.get(domain);
        const isHttps = url.startsWith('https://');

        return {
            isSafe: !threat,
            threat: threat || null,
            securityLevel: this.getSecurityLevel(url, threat, certificate, isHttps),
            warnings: this.getWarnings(url, threat, certificate, isHttps),
            certificate: certificate || null,
            isHttps: isHttps,
            connectionSecurity: this.getConnectionSecurity(isHttps, certificate)
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

    getSecurityLevel(url, threat, certificate, isHttps) {
        // Threat-based security takes priority
        if (threat) {
            switch (threat.level) {
                case 'critical': return 'dangerous';
                case 'high': return 'dangerous';
                case 'medium': return 'warning';
                case 'low': return 'caution';
            }
        }

        // No HTTPS - insecure
        if (!isHttps) {
            return 'insecure';
        }

        // HTTPS with invalid or no certificate
        if (!certificate || !certificate.valid || !certificate.trusted) {
            return 'warning';
        }

        // HTTPS with Extended Validation certificate
        if (certificate.extendedValidation) {
            return 'secure-ev';
        }

        // HTTPS with valid certificate
        return 'secure';
    }

    getConnectionSecurity(isHttps, certificate) {
        if (!isHttps) {
            return {
                level: 'none',
                description: 'Connection is not encrypted',
                details: 'Data sent to this site could be read by others'
            };
        }

        if (!certificate || !certificate.valid) {
            return {
                level: 'warning',
                description: 'Connection is encrypted but certificate is invalid',
                details: 'The site\'s identity cannot be verified'
            };
        }

        if (!certificate.trusted) {
            return {
                level: 'untrusted',
                description: 'Connection is encrypted but certificate is not trusted',
                details: 'The certificate authority is not recognized'
            };
        }

        if (certificate.extendedValidation) {
            return {
                level: 'ev',
                description: 'Connection is secure with Extended Validation',
                details: `Organization identity verified by ${certificate.issuer}`
            };
        }

        return {
            level: 'secure',
            description: 'Connection is secure',
            details: `Certificate issued by ${certificate.issuer}`
        };
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

    getWarnings(url, threat, certificate, isHttps) {
        const warnings = [];

        if (threat) {
            warnings.push({
                type: 'threat',
                severity: threat.level,
                message: threat.description
            });
        }

        if (!isHttps) {
            warnings.push({
                type: 'security',
                severity: 'high',
                message: 'This website does not use HTTPS encryption'
            });
        } else {
            // HTTPS-specific warnings
            if (!certificate) {
                warnings.push({
                    type: 'certificate',
                    severity: 'high',
                    message: 'No SSL certificate found'
                });
            } else {
                if (!certificate.valid) {
                    warnings.push({
                        type: 'certificate',
                        severity: 'high',
                        message: 'SSL certificate is invalid or expired'
                    });
                }

                if (!certificate.trusted) {
                    warnings.push({
                        type: 'certificate',
                        severity: 'medium',
                        message: 'SSL certificate is not from a trusted authority'
                    });
                }

                if (certificate.selfSigned) {
                    warnings.push({
                        type: 'certificate',
                        severity: 'medium',
                        message: 'Website uses a self-signed certificate'
                    });
                }

                if (certificate.warnings) {
                    certificate.warnings.forEach(warning => {
                        warnings.push({
                            type: 'certificate',
                            severity: 'high',
                            message: warning
                        });
                    });
                }

                // Check certificate expiration
                if (certificate.expires) {
                    const expiryDate = new Date(certificate.expires);
                    const now = new Date();
                    const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
                    
                    if (daysUntilExpiry < 0) {
                        warnings.push({
                            type: 'certificate',
                            severity: 'high',
                            message: 'SSL certificate has expired'
                        });
                    } else if (daysUntilExpiry < 30) {
                        warnings.push({
                            type: 'certificate',
                            severity: 'low',
                            message: `SSL certificate expires in ${daysUntilExpiry} days`
                        });
                    }
                }
            }
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
            indicator.className = 'security-indicator absolute left-2 top-1/2 transform -translate-y-1/2 cursor-pointer';
            urlBar.parentElement?.style.setProperty('position', 'relative');
            urlBar.parentElement?.appendChild(indicator);
            
            // Add left padding to URL bar to make space for the indicator
            urlBar.style.paddingLeft = '2rem';
        }

        // Update indicator based on security level
        const iconInfo = this.getSecurityIcon(securityCheck);
        
        indicator.innerHTML = `
            <i class="bi bi-${iconInfo.icon} ${iconInfo.color}" 
               title="${iconInfo.tooltip}"></i>
        `;

        // Add click handler to show security details
        indicator.onclick = () => this.showSecurityDetails(securityCheck);
    }

    getSecurityIcon(securityCheck) {
        const iconMap = {
            'secure-ev': { 
                icon: 'shield-check', 
                color: 'text-green-600', 
                tooltip: 'Secure connection with Extended Validation certificate' 
            },
            'secure': { 
                icon: 'shield-check', 
                color: 'text-green-500', 
                tooltip: 'Secure HTTPS connection with valid certificate' 
            },
            'warning': { 
                icon: 'shield-exclamation', 
                color: 'text-yellow-500', 
                tooltip: 'HTTPS connection but certificate issues detected' 
            },
            'dangerous': { 
                icon: 'shield-x', 
                color: 'text-red-500', 
                tooltip: 'Dangerous website - avoid entering personal information' 
            },
            'insecure': { 
                icon: 'shield-slash', 
                color: 'text-red-400', 
                tooltip: 'Insecure HTTP connection - data is not encrypted' 
            }
        };

        return iconMap[securityCheck.securityLevel] || iconMap['insecure'];
    }

    showSecurityDetails(securityCheck) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-gray-800 border border-gray-600 rounded-lg p-6 max-w-lg mx-4">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-xl font-bold text-white flex items-center">
                        <i class="bi bi-${this.getSecurityIcon(securityCheck).icon} ${this.getSecurityIcon(securityCheck).color} mr-2"></i>
                        Connection Security
                    </h2>
                    <button onclick="this.closest('.fixed').remove()" 
                            class="text-gray-400 hover:text-white transition-colors">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
                
                <div class="space-y-4">
                    <!-- Connection Status -->
                    <div class="bg-gray-700 rounded p-4">
                        <h3 class="text-green-400 font-medium mb-2">Connection Status</h3>
                        <p class="text-white text-sm">${securityCheck.connectionSecurity.description}</p>
                        <p class="text-gray-300 text-xs mt-1">${securityCheck.connectionSecurity.details}</p>
                    </div>

                    <!-- Certificate Information -->
                    ${securityCheck.certificate ? `
                        <div class="bg-gray-700 rounded p-4">
                            <h3 class="text-blue-400 font-medium mb-2">Certificate Information</h3>
                            <div class="text-sm space-y-1">
                                <div class="flex justify-between">
                                    <span class="text-gray-400">Issued by:</span>
                                    <span class="text-white">${securityCheck.certificate.issuer}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-400">Valid until:</span>
                                    <span class="text-white">${securityCheck.certificate.expires}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-400">Algorithm:</span>
                                    <span class="text-white">${securityCheck.certificate.algorithm}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-400">Status:</span>
                                    <span class="text-${securityCheck.certificate.valid ? 'green' : 'red'}-400">
                                        ${securityCheck.certificate.valid ? 'Valid' : 'Invalid'}
                                    </span>
                                </div>
                                ${securityCheck.certificate.extendedValidation ? 
                                    '<div class="text-green-400 text-xs mt-2">✓ Extended Validation</div>' : ''
                                }
                            </div>
                        </div>
                    ` : `
                        <div class="bg-red-900/30 border border-red-500/30 rounded p-4">
                            <h3 class="text-red-400 font-medium mb-2">No Certificate</h3>
                            <p class="text-red-300 text-sm">This website does not have an SSL certificate.</p>
                        </div>
                    `}

                    <!-- Warnings -->
                    ${securityCheck.warnings.length > 0 ? `
                        <div class="bg-red-900/30 border border-red-500/30 rounded p-4">
                            <h3 class="text-red-400 font-medium mb-2">Security Warnings</h3>
                            <div class="space-y-2">
                                ${securityCheck.warnings.map(warning => `
                                    <div class="flex items-start space-x-2">
                                        <i class="bi bi-exclamation-triangle text-${warning.severity === 'high' ? 'red' : warning.severity === 'medium' ? 'yellow' : 'blue'}-400 mt-0.5"></i>
                                        <span class="text-gray-300 text-sm">${warning.message}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : `
                        <div class="bg-green-900/30 border border-green-500/30 rounded p-4">
                            <h3 class="text-green-400 font-medium mb-2">✓ No Security Issues</h3>
                            <p class="text-green-300 text-sm">This connection appears secure.</p>
                        </div>
                    `}

                    <!-- Educational Info -->
                    <div class="bg-blue-900/30 border border-blue-500/30 rounded p-4">
                        <h3 class="text-blue-400 font-medium mb-2">Security Tips</h3>
                        <ul class="text-blue-300 text-sm space-y-1">
                            <li>• Always look for HTTPS (🔒) before entering sensitive information</li>
                            <li>• Verify the domain name matches the expected website</li>
                            <li>• Be cautious of certificate warnings or errors</li>
                            <li>• Green indicators usually mean Extended Validation certificates</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    runSecurityScan(url) {
        const securityCheck = this.checkUrl(url);
        this.displaySecurityStatus(securityCheck);
        return securityCheck;
    }
}