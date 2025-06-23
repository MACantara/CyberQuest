import { PageRegistry } from '../browser-functions/pages/page-registry.js';
import { ALL_EMAILS } from '../email-functions/emails/email-registry.js';

export class PacketCapture {
    constructor(networkMonitorApp) {
        this.app = networkMonitorApp;
        this.isCapturing = false;
        this.captureInterval = null;
        this.packetQueue = [];
        this.captureSpeed = 1500; // milliseconds between packets
        this.pageRegistry = new PageRegistry();
        this.trafficSources = this.initializeTrafficSources();
    }

    initializeTrafficSources() {
        return {
            websites: this.buildWebsiteTrafficSources(),
            email: this.buildEmailTrafficSources(),
            system: this.buildSystemTrafficSources()
        };
    }

    buildWebsiteTrafficSources() {
        const websites = [];
        const pages = this.pageRegistry.getAllPages();
        
        pages.forEach(page => {
            const domain = page.url.replace(/^https?:\/\//, '');
            const isSecure = page.url.startsWith('https://');
            const suspicious = page.securityLevel === 'dangerous';
            
            // Generate realistic IP addresses based on domain
            const ip = this.generateIPFromDomain(domain);
            
            // Build traffic patterns based on page security level
            const patterns = this.buildWebsitePatterns(page, isSecure, suspicious);
            
            websites.push({
                domain: domain,
                ip: ip,
                suspicious: suspicious,
                securityLevel: page.securityLevel,
                patterns: patterns
            });
        });
        
        return websites;
    }

    buildEmailTrafficSources() {
        const emailSources = [];
        const uniqueServers = new Set();
        
        ALL_EMAILS.forEach(email => {
            // Extract server from email sender
            const serverDomain = this.extractServerFromEmail(email.sender);
            
            if (!uniqueServers.has(serverDomain)) {
                uniqueServers.add(serverDomain);
                
                const ip = this.generateIPFromDomain(serverDomain);
                const suspicious = email.suspicious || false;
                const patterns = this.buildEmailPatterns(serverDomain, suspicious);
                
                emailSources.push({
                    server: serverDomain,
                    ip: ip,
                    suspicious: suspicious,
                    patterns: patterns
                });
            }
        });
        
        return emailSources;
    }

    buildSystemTrafficSources() {
        return [
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
        ];
    }

    buildWebsitePatterns(page, isSecure, suspicious) {
        const patterns = [];
        const domain = page.url.replace(/^https?:\/\//, '');
        const protocol = isSecure ? 'HTTPS' : 'HTTP';
        
        // DNS lookup (always first)
        patterns.push({
            protocol: 'DNS',
            info: `Standard query A ${domain}${suspicious ? ' [Suspicious domain]' : ''}`,
            weight: 1
        });

        if (suspicious) {
            // Suspicious site patterns
            patterns.push(
                {
                    protocol: protocol,
                    info: `GET ${this.getSuspiciousPath(page)} [${isSecure ? 'Self-signed cert' : 'Insecure'}]`,
                    weight: 3
                },
                {
                    protocol: protocol,
                    info: `POST /collect-data [${suspicious ? 'Suspicious' : 'Malicious'}]`,
                    weight: 2
                },
                {
                    protocol: 'TCP',
                    info: suspicious ? 'Connection to known scam server' : 'Data exfiltration attempt',
                    weight: 1
                }
            );
        } else {
            // Legitimate site patterns
            const securityInfo = this.getSecurityInfo(page);
            patterns.push(
                {
                    protocol: protocol,
                    info: `GET ${this.getLegitimateePath(page)} ${securityInfo}`,
                    weight: 3
                },
                {
                    protocol: protocol,
                    info: `GET /css/styles.css`,
                    weight: 2
                },
                {
                    protocol: protocol,
                    info: `GET /js/app.js`,
                    weight: 2
                },
                {
                    protocol: 'TCP',
                    info: this.getTLSInfo(page),
                    weight: 1
                }
            );
        }

        return patterns;
    }

    buildEmailPatterns(serverDomain, suspicious) {
        const patterns = [];
        
        if (suspicious) {
            patterns.push(
                {
                    protocol: 'SMTP',
                    info: `${this.getSuspiciousEmailType(serverDomain)} delivery [SUSPICIOUS]`,
                    weight: 3
                },
                {
                    protocol: 'HTTP',
                    info: 'Malicious link tracking',
                    weight: 2
                },
                {
                    protocol: 'TCP',
                    info: 'Suspicious mail relay',
                    weight: 1
                }
            );
        } else {
            patterns.push(
                {
                    protocol: 'SMTP',
                    info: `Legitimate email delivery from ${serverDomain}`,
                    weight: 2
                },
                {
                    protocol: 'IMAP',
                    info: 'Fetch inbox messages',
                    weight: 3
                },
                {
                    protocol: 'TCP',
                    info: 'Mail server connection',
                    weight: 1
                }
            );
        }

        return patterns;
    }

    // Helper methods for pattern generation
    extractServerFromEmail(emailAddress) {
        const domain = emailAddress.split('@')[1];
        return domain.includes('cyberquest.com') ? 'mail.cyberquest.com' : domain;
    }

    generateIPFromDomain(domain) {
        // Generate consistent IP addresses based on domain hash
        let hash = 0;
        for (let i = 0; i < domain.length; i++) {
            hash = ((hash << 5) - hash + domain.charCodeAt(i)) & 0xffffffff;
        }
        
        // Convert to IP components
        const a = Math.abs(hash % 223) + 1; // Avoid 0 and reserved ranges
        const b = Math.abs((hash >> 8) % 256);
        const c = Math.abs((hash >> 16) % 256);
        const d = Math.abs((hash >> 24) % 254) + 1; // Avoid .0
        
        return `${a}.${b}.${c}.${d}`;
    }

    getSuspiciousPath(page) {
        const suspiciousPaths = ['/win-prize.html', '/claim-now.php', '/urgent-verify', '/fake-login'];
        return suspiciousPaths[Math.floor(Math.random() * suspiciousPaths.length)];
    }

    getLegitimateePath(page) {
        if (page.url.includes('bank')) return '/login';
        if (page.url.includes('news')) return '/articles';
        if (page.url.includes('cyberquest')) return '/training';
        return '/index.html';
    }

    getSecurityInfo(page) {
        if (page.securityLevel === 'secure-ev') return '[Extended Validation]';
        if (page.securityLevel === 'secure') return '[Valid Certificate]';
        return '';
    }

    getTLSInfo(page) {
        if (page.securityLevel === 'secure-ev') return 'TLS 1.3 handshake [4096-bit RSA]';
        if (page.securityLevel === 'secure') return 'TLS 1.2 handshake';
        return 'TLS handshake';
    }

    getSuspiciousEmailType(serverDomain) {
        if (serverDomain.includes('verifysystem-alerts')) return 'Phishing email';
        if (serverDomain.includes('totally-real')) return 'Spam email [Nigerian Prince]';
        return 'Suspicious email';
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
        const domain = url.replace(/^https?:\/\//, '');
        const website = this.trafficSources.websites.find(site => site.domain === domain);
        
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
        const serverDomain = this.extractServerFromEmail(emailSender);
        const emailServer = this.trafficSources.email.find(e => e.server === serverDomain);
        
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
