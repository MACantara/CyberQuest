export class BasePage {
    constructor(config) {
        this.url = config.url;
        this.title = config.title;
        this.securityLevel = config.securityLevel || 'neutral';
        this.security = this.initializeSecurity(config.security || {});
    }

    initializeSecurity(securityConfig) {
        const defaultSecurity = {
            isHttps: this.url.startsWith('https://'),
            hasValidCertificate: this.securityLevel !== 'dangerous',
            certificate: null,
            threats: null,
            riskFactors: [],
            securityFeatures: []
        };

        return {
            ...defaultSecurity,
            ...securityConfig
        };
    }

    // Abstract method - must be implemented by subclasses
    createContent() {
        throw new Error('createContent() must be implemented by subclasses');
    }

    // Helper method to get domain from URL
    getDomain() {
        return this.url.replace(/^https?:\/\//, '');
    }

    // Helper method to check if page is suspicious
    isSuspicious() {
        return this.securityLevel === 'dangerous';
    }

    // Helper method to check if page is secure
    isSecure() {
        return ['safe', 'secure', 'secure-ev'].includes(this.securityLevel);
    }

    // Generate certificate expiration date
    static generateCertExpiration(monthsFromNow = 12) {
        const date = new Date();
        date.setMonth(date.getMonth() + monthsFromNow);
        return date.toISOString().split('T')[0];
    }

    // Create page object compatible with existing system
    toPageObject() {
        const pageInstance = this;
        return {
            url: this.url,
            title: this.title,
            ipAddress: this.ipAddress,
            securityLevel: this.securityLevel,
            security: this.security,
            createContent: () => this.createContent(),
            bindEvents: (contentElement) => {
                if (typeof pageInstance.bindEvents === 'function') {
                    pageInstance.bindEvents(contentElement);
                }
            }
        };
    }
}
