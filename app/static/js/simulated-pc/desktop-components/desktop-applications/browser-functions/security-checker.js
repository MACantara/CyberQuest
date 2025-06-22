import { SecurityPopup } from './security-popup.js';
import { PageRegistry } from './pages/page-registry.js';

export class SecurityChecker {
    constructor(browserApp) {
        this.browserApp = browserApp;
        this.securityPopup = new SecurityPopup(browserApp);
        this.pageRegistry = new PageRegistry();
    }

    checkUrl(url) {
        const domain = this.extractDomain(url);
        const pageConfig = this.pageRegistry.getPage(url);
        const isHttps = url.startsWith('https://');

        // Use page-specific security data if available, otherwise use defaults
        const security = pageConfig?.security || this.getDefaultSecurity(url, isHttps);
        
        return {
            isSafe: !security.threats,
            threat: security.threats || null,
            securityLevel: this.getSecurityLevel(url, security, isHttps),
            warnings: this.getWarnings(url, security, isHttps),
            certificate: security.certificate || null,
            isHttps: isHttps,
            connectionSecurity: this.getConnectionSecurity(isHttps, security.certificate),
            pageConfig: pageConfig
        };
    }

    getDefaultSecurity(url, isHttps) {
        return {
            isHttps: isHttps,
            hasValidCertificate: false,
            certificate: null,
            threats: null,
            riskFactors: ['Unknown website', 'Unverified security status']
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

    getSecurityLevel(url, security, isHttps) {
        // Threat-based security takes priority
        if (security.threats) {
            switch (security.threats.level) {
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
        if (!security.certificate || !security.certificate.valid || !security.certificate.trusted) {
            return 'warning';
        }

        // HTTPS with Extended Validation certificate
        if (security.certificate.extendedValidation) {
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

    getWarnings(url, security, isHttps) {
        const warnings = [];

        if (security.threats) {
            warnings.push({
                type: 'threat',
                severity: security.threats.level,
                message: security.threats.description
            });
        }

        if (!isHttps) {
            warnings.push({
                type: 'security',
                severity: 'high',
                message: 'This website does not use HTTPS encryption'
            });
        } else if (security.certificate) {
            // Certificate-specific warnings
            if (!security.certificate.valid) {
                warnings.push({
                    type: 'certificate',
                    severity: 'high',
                    message: 'SSL certificate is invalid or expired'
                });
            }

            if (!security.certificate.trusted) {
                warnings.push({
                    type: 'certificate',
                    severity: 'medium',
                    message: 'SSL certificate is not from a trusted authority'
                });
            }

            if (security.certificate.selfSigned) {
                warnings.push({
                    type: 'certificate',
                    severity: 'medium',
                    message: 'Website uses a self-signed certificate'
                });
            }

            if (security.certificate.warnings) {
                security.certificate.warnings.forEach(warning => {
                    warnings.push({
                        type: 'certificate',
                        severity: 'high',
                        message: warning
                    });
                });
            }

            // Check certificate expiration
            if (security.certificate.expires) {
                const expiryDate = new Date(security.certificate.expires);
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

        return warnings;
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
        indicator.onclick = () => this.securityPopup.show(securityCheck);
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

    runSecurityScan(url) {
        const securityCheck = this.checkUrl(url);
        this.displaySecurityStatus(securityCheck);
        return securityCheck;
    }
}