export class PacketCapture {
    constructor(networkMonitorApp) {
        this.app = networkMonitorApp;
        this.isCapturing = false;
        this.captureInterval = null;
        this.packetQueue = [];
        this.captureSpeed = 1500; // milliseconds between packets
        this.trafficSources = this.initializeTrafficSources();
    }

    initializeTrafficSources() {
        return {
            // Website traffic patterns
            websites: [
                {
                    domain: 'cyberquest.com',
                    ip: '104.21.45.78',
                    suspicious: false,
                    patterns: [
                        { protocol: 'DNS', info: 'Standard query A cyberquest.com', weight: 1 },
                        { protocol: 'HTTPS', info: 'GET /index.html', weight: 3 },
                        { protocol: 'HTTPS', info: 'GET /css/styles.css', weight: 2 },
                        { protocol: 'HTTPS', info: 'GET /js/training.js', weight: 2 },
                        { protocol: 'TCP', info: 'TLS handshake', weight: 1 }
                    ]
                },
                {
                    domain: 'securebank.com',
                    ip: '198.185.159.144',
                    suspicious: false,
                    patterns: [
                        { protocol: 'DNS', info: 'Standard query A securebank.com', weight: 1 },
                        { protocol: 'HTTPS', info: 'GET /login [Extended Validation]', weight: 3 },
                        { protocol: 'HTTPS', info: 'POST /api/auth [4096-bit RSA]', weight: 2 },
                        { protocol: 'TCP', info: 'TLS 1.3 handshake', weight: 1 }
                    ]
                },
                {
                    domain: 'news-site.com',
                    ip: '172.67.156.23',
                    suspicious: false,
                    patterns: [
                        { protocol: 'DNS', info: 'Standard query A news-site.com', weight: 1 },
                        { protocol: 'HTTPS', info: 'GET /tech-news', weight: 3 },
                        { protocol: 'HTTPS', info: 'GET /api/articles', weight: 2 },
                        { protocol: 'TCP', info: 'Keep-alive', weight: 1 }
                    ]
                },
                {
                    domain: 'suspicious-site.com',
                    ip: '185.220.102.7',
                    suspicious: true,
                    patterns: [
                        { protocol: 'DNS', info: 'Query A suspicious-site.com [Self-signed cert]', weight: 1 },
                        { protocol: 'HTTP', info: 'GET /win-prize.html [Insecure]', weight: 3 },
                        { protocol: 'HTTP', info: 'POST /collect-data [Suspicious]', weight: 2 },
                        { protocol: 'TCP', info: 'Connection to known scam server', weight: 1 }
                    ]
                },
                {
                    domain: 'phishing-bank.com',
                    ip: '91.218.67.12',
                    suspicious: true,
                    patterns: [
                        { protocol: 'DNS', info: 'Query A phishing-bank.com [Suspicious domain]', weight: 1 },
                        { protocol: 'HTTP', info: 'GET /fake-login [Phishing attempt]', weight: 3 },
                        { protocol: 'HTTP', info: 'POST /steal-credentials [Malicious]', weight: 2 },
                        { protocol: 'TCP', info: 'Data exfiltration attempt', weight: 1 }
                    ]
                }
            ],
            
            // Email traffic patterns
            email: [
                {
                    server: 'mail.cyberquest.com',
                    ip: '104.21.45.78',
                    suspicious: false,
                    patterns: [
                        { protocol: 'SMTP', info: 'Welcome email delivery', weight: 2 },
                        { protocol: 'IMAP', info: 'Fetch inbox messages', weight: 3 },
                        { protocol: 'TCP', info: 'Mail server connection', weight: 1 }
                    ]
                },
                {
                    server: 'verifysystem-alerts.net',
                    ip: '45.142.214.89',
                    suspicious: true,
                    patterns: [
                        { protocol: 'SMTP', info: 'Phishing email delivery [URGENT]', weight: 3 },
                        { protocol: 'HTTP', info: 'Malicious link tracking', weight: 2 },
                        { protocol: 'TCP', info: 'Suspicious mail relay', weight: 1 }
                    ]
                },
                {
                    server: 'totally-real.com',
                    ip: '103.224.182.251',
                    suspicious: true,
                    patterns: [
                        { protocol: 'SMTP', info: 'Spam email delivery [Nigerian Prince]', weight: 3 },
                        { protocol: 'HTTP', info: 'Scam response collection', weight: 2 },
                        { protocol: 'TCP', info: 'Known spam server', weight: 1 }
                    ]
                }
            ],

            // Background system traffic
            system: [
                {
                    destination: '8.8.8.8',
                    patterns: [
                        { protocol: 'DNS', info: 'System DNS lookup', weight: 2 }
                    ]
                },
                {
                    destination: '1.1.1.1',
                    patterns: [
                        { protocol: 'DNS', info: 'CloudFlare DNS query', weight: 1 }
                    ]
                },
                {
                    destination: '192.168.1.1',
                    patterns: [
                        { protocol: 'TCP', info: 'Router communication', weight: 1 },
                        { protocol: 'UDP', info: 'DHCP renewal', weight: 1 }
                    ]
                }
            ]
        };
    }

    startCapture() {
        if (this.isCapturing) return;
        
        this.isCapturing = true;
        this.captureInterval = setInterval(() => {
            this.generatePacket();
        }, this.captureSpeed);
        
        this.updateCaptureButton();
    }

    stopCapture() {
        if (!this.isCapturing) return;
        
        this.isCapturing = false;
        if (this.captureInterval) {
            clearInterval(this.captureInterval);
            this.captureInterval = null;
        }
        
        this.updateCaptureButton();
    }

    generatePacket() {
        const packet = this.createRealisticPacket();
        this.packetQueue.push(packet);
        this.app.addPacketToList(packet);
        
        // Keep only last 100 packets for performance
        if (this.packetQueue.length > 100) {
            this.packetQueue.shift();
        }
    }

    createRealisticPacket() {
        const now = new Date();
        const time = now.toTimeString().split(' ')[0];
        
        // Determine traffic type based on probability
        const rand = Math.random();
        let trafficType, source;
        
        if (rand < 0.5) {
            // Website traffic (50%)
            trafficType = 'websites';
            source = this.getRandomWeightedSource(this.trafficSources.websites);
        } else if (rand < 0.75) {
            // Email traffic (25%)
            trafficType = 'email';
            source = this.getRandomWeightedSource(this.trafficSources.email);
        } else {
            // System traffic (25%)
            trafficType = 'system';
            source = this.getRandomWeightedSource(this.trafficSources.system);
        }

        const pattern = this.getRandomWeightedPattern(source.patterns);
        
        let packet = {
            id: Date.now() + Math.random(),
            time: time,
            source: '192.168.1.100', // User's computer
            protocol: pattern.protocol,
            info: pattern.info,
            suspicious: source.suspicious || false
        };

        // Set destination based on traffic type
        if (trafficType === 'websites') {
            packet.destination = source.domain;
        } else if (trafficType === 'email') {
            packet.destination = source.server;
        } else {
            packet.destination = source.destination;
        }

        // Sometimes reverse source/destination for incoming traffic
        if (Math.random() < 0.3) {
            [packet.source, packet.destination] = [packet.destination, packet.source];
            if (pattern.protocol === 'HTTP' || pattern.protocol === 'HTTPS') {
                packet.info = packet.info.replace('GET', 'Response to GET').replace('POST', 'Response to POST');
            }
        }

        return packet;
    }

    getRandomWeightedSource(sources) {
        const totalWeight = sources.reduce((sum, source) => {
            const sourceWeight = source.patterns.reduce((patternSum, pattern) => patternSum + pattern.weight, 0);
            return sum + sourceWeight;
        }, 0);
        
        let random = Math.random() * totalWeight;
        
        for (const source of sources) {
            const sourceWeight = source.patterns.reduce((sum, pattern) => sum + pattern.weight, 0);
            if (random < sourceWeight) {
                return source;
            }
            random -= sourceWeight;
        }
        
        return sources[0]; // Fallback
    }

    getRandomWeightedPattern(patterns) {
        const totalWeight = patterns.reduce((sum, pattern) => sum + pattern.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const pattern of patterns) {
            if (random < pattern.weight) {
                return pattern;
            }
            random -= pattern.weight;
        }
        
        return patterns[0]; // Fallback
    }

    // Method to trigger specific traffic based on user actions
    generateWebsiteTraffic(url) {
        const website = this.trafficSources.websites.find(site => url.includes(site.domain));
        if (website) {
            // Generate a burst of packets for this website
            website.patterns.forEach((pattern, index) => {
                setTimeout(() => {
                    const packet = {
                        id: Date.now() + Math.random(),
                        time: new Date().toTimeString().split(' ')[0],
                        source: '192.168.1.100',
                        destination: website.domain,
                        protocol: pattern.protocol,
                        info: pattern.info,
                        suspicious: website.suspicious
                    };
                    this.packetQueue.push(packet);
                    this.app.addPacketToList(packet);
                }, index * 200);
            });
        }
    }

    generateEmailTraffic(emailSender) {
        let emailServer = null;
        
        // Map email senders to servers
        if (emailSender.includes('cyberquest.com')) {
            emailServer = this.trafficSources.email.find(e => e.server === 'mail.cyberquest.com');
        } else if (emailSender.includes('verifysystem-alerts.net')) {
            emailServer = this.trafficSources.email.find(e => e.server === 'verifysystem-alerts.net');
        } else if (emailSender.includes('totally-real.com')) {
            emailServer = this.trafficSources.email.find(e => e.server === 'totally-real.com');
        }
        
        if (emailServer) {
            // Generate email-related traffic
            emailServer.patterns.forEach((pattern, index) => {
                setTimeout(() => {
                    const packet = {
                        id: Date.now() + Math.random(),
                        time: new Date().toTimeString().split(' ')[0],
                        source: emailServer.server,
                        destination: '192.168.1.100',
                        protocol: pattern.protocol,
                        info: pattern.info,
                        suspicious: emailServer.suspicious
                    };
                    this.packetQueue.push(packet);
                    this.app.addPacketToList(packet);
                }, index * 300);
            });
        }
    }

    updateCaptureButton() {
        const button = this.app.windowElement?.querySelector('#live-capture-btn');
        if (button) {
            if (this.isCapturing) {
                button.textContent = 'Stop Capture';
                button.className = 'px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors duration-200 cursor-pointer';
            } else {
                button.textContent = 'Live Capture';
                button.className = 'px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors duration-200 cursor-pointer';
            }
        }
    }

    getPackets() {
        return this.packetQueue;
    }

    clearPackets() {
        this.packetQueue = [];
        this.app.clearPacketList();
    }
}
