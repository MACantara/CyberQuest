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
        return `
            <div class="bg-gray-700 rounded p-3">
                <h4 class="text-green-400 font-medium mb-1 text-sm">Connection Status</h4>
                <p class="text-white text-xs">${securityCheck.connectionSecurity.description}</p>
                <p class="text-gray-300 text-xs mt-1">${securityCheck.connectionSecurity.details}</p>
            </div>
        `;
    }

    createCertificateSection(securityCheck) {
        if (securityCheck.certificate) {
            return `
                <div class="bg-gray-700 rounded p-3">
                    <h4 class="text-blue-400 font-medium mb-2 text-sm">Certificate Information</h4>
                    <div class="text-xs space-y-1">
                        <div class="flex justify-between">
                            <span class="text-gray-400">Issued by:</span>
                            <span class="text-white text-right max-w-48 break-words">${securityCheck.certificate.issuer}</span>
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
                            '<div class="text-green-400 text-xs mt-1">✓ Extended Validation</div>' : ''
                        }
                    </div>
                    
                    ${this.createIntegratedWarningsSection(securityCheck)}
                </div>
            `;
        } else {
            return `
                <div class="bg-red-900/30 border border-red-500/30 rounded p-3">
                    <h4 class="text-red-400 font-medium mb-1 text-sm">No Certificate</h4>
                    <p class="text-red-300 text-xs">This website does not have an SSL certificate.</p>
                    ${this.createIntegratedWarningsSection(securityCheck)}
                </div>
            `;
        }
    }

    createIntegratedWarningsSection(securityCheck) {
        if (securityCheck.warnings.length > 0) {
            return `
                <div class="mt-3 pt-3 border-t border-gray-600">
                    <h5 class="text-yellow-400 font-medium mb-2 text-xs flex items-center">
                        <i class="bi bi-exclamation-triangle mr-1"></i>
                        Security Issues
                    </h5>
                    <div class="space-y-1">
                        ${securityCheck.warnings.map(warning => `
                            <div class="flex items-start space-x-2">
                                <i class="bi bi-dot text-${this.getSeverityColor(warning.severity)}-400 mt-0.5 text-xs"></i>
                                <span class="text-gray-300 text-xs">${warning.message}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } else if (securityCheck.certificate && securityCheck.certificate.valid) {
            return `
                <div class="mt-3 pt-3 border-t border-gray-600">
                    <div class="flex items-center space-x-2">
                        <i class="bi bi-check-circle text-green-400 text-xs"></i>
                        <span class="text-green-300 text-xs">No certificate issues detected</span>
                    </div>
                </div>
            `;
        }
        return '';
    }

    createWarningsSection(securityCheck) {
        // This method is no longer used but kept for compatibility
        return '';
    }

    createThreatSection(securityCheck) {
        // This method is no longer used - threats removed
        return '';
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
