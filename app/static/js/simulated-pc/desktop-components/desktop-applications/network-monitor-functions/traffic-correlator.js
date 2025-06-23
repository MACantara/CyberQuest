export class TrafficCorrelator {
    constructor(networkMonitorApp) {
        this.app = networkMonitorApp;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Listen for browser navigation events
        document.addEventListener('browser-navigate', (event) => {
            this.handleBrowserNavigation(event.detail.url);
        });

        // Listen for email open events
        document.addEventListener('email-opened', (event) => {
            this.handleEmailOpen(event.detail.sender, event.detail.subject);
        });

        // Listen for email link clicks
        document.addEventListener('email-link-clicked', (event) => {
            this.handleEmailLinkClick(event.detail.url, event.detail.suspicious);
        });
    }

    handleBrowserNavigation(url) {
        if (this.app.packetCapture && this.app.packetCapture.isCapturing) {
            // Generate DNS lookup first (system traffic)
            this.app.packetCapture.generateSystemTraffic(`DNS resolution for ${url}`);
            
            // Generate realistic traffic for the website being visited
            setTimeout(() => {
                this.app.packetCapture.generateWebsiteTraffic(url);
            }, 200);
            
            // Add a notification in the network monitor
            setTimeout(() => {
                this.addTrafficAlert('Website Visit', `User navigated to ${url}`, 
                    url.includes('suspicious') || url.includes('phishing'));
            }, 1500);
        }
    }

    handleEmailOpen(sender, subject) {
        if (this.app.packetCapture && this.app.packetCapture.isCapturing) {
            // Generate email-related traffic
            this.app.packetCapture.generateEmailTraffic(sender);
            
            // Add notification
            setTimeout(() => {
                const suspicious = sender.includes('verifysystem-alerts.net') || 
                                 sender.includes('totally-real.com');
                this.addTrafficAlert('Email Activity', `Email opened from ${sender}`, suspicious);
            }, 800);
        }
    }

    handleEmailLinkClick(url, suspicious) {
        if (this.app.packetCapture && this.app.packetCapture.isCapturing) {
            // Generate DNS lookup for the clicked link
            this.app.packetCapture.generateSystemTraffic(`DNS resolution for email link: ${url}`);
            
            // Generate traffic for the clicked link
            setTimeout(() => {
                this.app.packetCapture.generateWebsiteTraffic(url);
            }, 300);
            
            // Add warning if suspicious
            setTimeout(() => {
                this.addTrafficAlert('Link Click', 
                    `User clicked email link to ${url}${suspicious ? ' [SUSPICIOUS]' : ''}`, 
                    suspicious);
            }, 600);
        }
    }

    addTrafficAlert(type, message, suspicious = false) {
        // Create a temporary alert packet in the network monitor
        const alertPacket = {
            id: 'alert-' + Date.now(),
            time: new Date().toTimeString().split(' ')[0],
            source: 'SYSTEM',
            destination: 'ALERT',
            protocol: 'INFO',
            info: `${type}: ${message}`,
            suspicious: suspicious,
            isAlert: true
        };

        this.app.packetQueue.push(alertPacket);
        this.app.addPacketToList(alertPacket);

        // Remove alert after 10 seconds
        setTimeout(() => {
            this.app.packetQueue = this.app.packetQueue.filter(p => p.id !== alertPacket.id);
        }, 10000);
    }
}
