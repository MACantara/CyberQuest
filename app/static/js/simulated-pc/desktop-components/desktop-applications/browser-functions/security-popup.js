export class SecurityPopup {
    constructor(browserApp) {
        this.browserApp = browserApp;
        this.popup = null;
        this.isVisible = false;
        this.currentSecurityCheck = null;
    }

    show(securityCheck) {
        // Store current security check for updates
        this.currentSecurityCheck = securityCheck;
        
        // Remove any existing security popup
        this.hide();

        this.popup = document.createElement('div');
        this.popup.className = 'security-popup absolute bg-gray-800 border border-gray-600 rounded-lg shadow-2xl z-50 min-w-80 max-w-96';
        
        // Position popup near the security indicator
        this.positionPopup();

        this.popup.innerHTML = this.createPopupContent(securityCheck);
        document.body.appendChild(this.popup);

        this.isVisible = true;
        this.bindEvents();
        this.setupAutoClose();
        
        // Update security indicator when popup is shown
        this.updateSecurityIndicator(securityCheck);
    }

    hide() {
        if (this.popup && this.popup.parentNode) {
            this.popup.remove();
            this.popup = null;
            this.isVisible = false;
        }
    }

    positionPopup() {
        const indicator = this.browserApp.windowElement?.querySelector('.security-indicator');
        if (indicator) {
            const rect = indicator.getBoundingClientRect();
            this.popup.style.left = `${rect.left - 5}px`;
            this.popup.style.top = `${rect.bottom + 10}px`;
        }
    }

    updateSecurityIndicator(securityCheck) {
        if (this.browserApp.securityChecker) {
            this.browserApp.securityChecker.displaySecurityStatus(securityCheck);
        }
    }

    refreshContent(newSecurityCheck) {
        if (this.popup && this.isVisible) {
            this.currentSecurityCheck = newSecurityCheck;
            const contentContainer = this.popup.querySelector('.p-4');
            if (contentContainer) {
                contentContainer.innerHTML = this.createPopupContent(newSecurityCheck).match(/<div class="p-4">([\s\S]*)<\/div>/)[1];
            }
            this.updateSecurityIndicator(newSecurityCheck);
        }
    }

    createPopupContent(securityCheck) {
        const iconInfo = this.getSecurityIcon(securityCheck);
        
        return `
            <div class="p-4">
                <div class="flex items-center justify-between mb-3">
                    <h3 class="text-lg font-bold text-white flex items-center">
                        <i class="bi bi-${iconInfo.icon} ${iconInfo.color} mr-2"></i>
                        Connection Security
                    </h3>
                    <button onclick="this.closest('.security-popup').remove()" 
                            class="text-gray-400 hover:text-white transition-colors text-lg cursor-pointer">
                        <i class="bi bi-x"></i>
                    </button>
                </div>
                
                <div class="space-y-3">
                    ${this.createConnectionStatusSection(securityCheck)}
                    ${this.createCertificateSection(securityCheck)}
                </div>
            </div>
        `;
    }

    createConnectionStatusSection(securityCheck) {
        const isHttps = securityCheck.isHttps;
        const hasValidCert = securityCheck.certificate && securityCheck.certificate.valid && securityCheck.certificate.trusted;
        
        // Determine status based on both HTTPS and certificate validity
        let statusColor, statusIcon, warningIcon = '';
        
        if (!isHttps) {
            statusColor = 'red';
            statusIcon = 'shield-slash';
            warningIcon = `
                <div class="relative group ml-2">
                    <i class="bi bi-exclamation-triangle text-red-400 text-xs cursor-help"></i>
                    <span class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-red-300 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                        Insecure HTTP connection
                    </span>
                </div>
            `;
        } else if (!hasValidCert) {
            statusColor = 'yellow';
            statusIcon = 'shield-exclamation';
            warningIcon = `
                <div class="relative group ml-2">
                    <i class="bi bi-exclamation-triangle text-yellow-400 text-xs cursor-help"></i>
                    <span class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-yellow-300 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                        HTTPS with certificate issues
                    </span>
                </div>
            `;
        } else {
            statusColor = 'green';
            statusIcon = 'shield-check';
        }
        
        return `
            <div class="bg-gray-700 rounded p-3">
                <h4 class="text-${statusColor}-400 font-medium mb-1 text-sm flex items-center">
                    <i class="bi bi-${statusIcon} mr-2"></i>
                    Connection Status
                    ${warningIcon}
                </h4>
                <p class="text-white text-xs">${securityCheck.connectionSecurity.description}</p>
                <p class="text-gray-300 text-xs mt-1">${securityCheck.connectionSecurity.details}</p>
            </div>
        `;
    }

    createCertificateSection(securityCheck) {
        if (securityCheck.certificate) {
            const cert = securityCheck.certificate;
            const now = new Date();
            const expiryDate = new Date(cert.expires);
            const isExpired = expiryDate < now;
            const isExpiringSoon = (expiryDate - now) / (1000 * 60 * 60 * 24) <= 30 && !isExpired;
            const isWeakAlgorithm = cert.algorithm && (cert.algorithm.includes('1024') || cert.algorithm.toLowerCase().includes('md5') || cert.algorithm.toLowerCase().includes('sha1'));
            
            return `
                <div class="bg-gray-700 rounded p-3">
                    <h4 class="text-blue-400 font-medium mb-2 text-sm">Certificate Information</h4>
                    <div class="text-xs space-y-2">
                        <!-- Issued By -->
                        <div class="flex justify-between items-center">
                            <span class="text-gray-400">Issued by:</span>
                            <div class="flex items-center space-x-2">
                                <span class="text-white text-right max-w-48 break-words">${cert.issuer}</span>
                                ${!cert.trusted ? `
                                    <div class="relative group">
                                        <i class="bi bi-exclamation-triangle text-yellow-400 text-xs cursor-help"></i>
                                        <span class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-yellow-300 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                            Untrusted certificate authority
                                        </span>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                        
                        <!-- Valid Until -->
                        <div class="flex justify-between items-center">
                            <span class="text-gray-400">Valid until:</span>
                            <div class="flex items-center space-x-2">
                                <span class="text-white">${cert.expires}</span>
                                ${isExpired ? `
                                    <div class="relative group">
                                        <i class="bi bi-exclamation-triangle text-red-400 text-xs cursor-help"></i>
                                        <span class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-red-300 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                            Certificate expired
                                        </span>
                                    </div>
                                ` : isExpiringSoon ? `
                                    <div class="relative group">
                                        <i class="bi bi-exclamation-triangle text-yellow-400 text-xs cursor-help"></i>
                                        <span class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-yellow-300 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                            Certificate expires soon
                                        </span>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                        
                        <!-- Algorithm -->
                        <div class="flex justify-between items-center">
                            <span class="text-gray-400">Algorithm:</span>
                            <div class="flex items-center space-x-2">
                                <span class="text-white">${cert.algorithm}</span>
                                ${isWeakAlgorithm ? `
                                    <div class="relative group">
                                        <i class="bi bi-exclamation-triangle text-red-400 text-xs cursor-help"></i>
                                        <span class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-red-300 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                            Weak encryption algorithm
                                        </span>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                        
                        <!-- Status -->
                        <div class="flex justify-between items-center">
                            <span class="text-gray-400">Status:</span>
                            <div class="flex items-center space-x-2">
                                <span class="text-${cert.valid ? 'green' : 'red'}-400">
                                    ${cert.valid ? 'Valid' : 'Invalid'}
                                </span>
                                ${!cert.valid ? `
                                    <div class="relative group">
                                        <i class="bi bi-exclamation-triangle text-red-400 text-xs cursor-help"></i>
                                        <span class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-red-300 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                            Invalid certificate
                                        </span>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                        
                        <!-- Self-signed warning -->
                        ${cert.selfSigned ? `
                            <div class="p-2 bg-yellow-900/30 border border-yellow-500/30 rounded">
                                <div class="flex items-center space-x-2">
                                    <i class="bi bi-exclamation-triangle text-yellow-400 text-xs"></i>
                                    <span class="text-yellow-300 text-xs">Self-signed certificate - identity cannot be verified</span>
                                </div>
                            </div>
                        ` : ''}
                        
                        ${cert.extendedValidation ? 
                            '<div class="text-green-400 text-xs mt-2 flex items-center"><i class="bi bi-check-circle mr-1"></i>Extended Validation</div>' : ''
                        }
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="bg-red-900/30 border border-red-500/30 rounded p-3">
                    <h4 class="text-red-400 font-medium mb-1 text-sm flex items-center">
                        <i class="bi bi-exclamation-triangle mr-2"></i>
                        No Certificate
                    </h4>
                    <p class="text-red-300 text-xs">This website does not have an SSL certificate.</p>
                    <div class="mt-2 p-2 bg-red-900/40 border border-red-500/40 rounded">
                        <div class="flex items-center space-x-2">
                            <i class="bi bi-shield-slash text-red-400 text-xs"></i>
                            <span class="text-red-300 text-xs">Data transmission is not encrypted and may be intercepted</span>
                        </div>
                    </div>
                </div>
            `;
        }
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

    getSeverityColor(severity) {
        switch (severity) {
            case 'high': return 'red';
            case 'medium': return 'yellow';
            case 'low': return 'blue';
            default: return 'gray';
        }
    }

    bindEvents() {
        if (!this.popup) return;

        // Close button handler
        const closeBtn = this.popup.querySelector('button');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hide());
        }

        // Add refresh handler for dynamic updates
        if (this.currentSecurityCheck && this.currentSecurityCheck.pageConfig) {
            this.setupDynamicUpdates();
        }
    }

    setupDynamicUpdates() {
        // Update security status every few seconds for demonstration
        const updateInterval = setInterval(() => {
            if (!this.isVisible) {
                clearInterval(updateInterval);
                return;
            }
            
            // Re-check security for current URL
            const urlBar = this.browserApp.windowElement?.querySelector('#browser-url-bar');
            if (urlBar && urlBar.value) {
                const newSecurityCheck = this.browserApp.securityChecker.checkUrl(urlBar.value);
                if (JSON.stringify(newSecurityCheck) !== JSON.stringify(this.currentSecurityCheck)) {
                    this.refreshContent(newSecurityCheck);
                }
            }
        }, 3000);
    }

    setupAutoClose() {
        if (!this.popup) return;

        const indicator = this.browserApp.windowElement?.querySelector('.security-indicator');

        // Close popup when clicking outside
        const closeOnOutsideClick = (e) => {
            if (this.popup && 
                !this.popup.contains(e.target) && 
                !indicator?.contains(e.target)) {
                this.hide();
                document.removeEventListener('click', closeOnOutsideClick);
            }
        };

        setTimeout(() => {
            document.addEventListener('click', closeOnOutsideClick);
        }, 100);
    }
}
