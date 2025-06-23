export class PacketGenerator {
    constructor() {
        this.packetId = 0;
        this.normalTrafficPatterns = [
            { protocol: 'DNS', port: 53, threat: false },
            { protocol: 'HTTP', port: 80, threat: false },
            { protocol: 'HTTPS', port: 443, threat: false },
            { protocol: 'TCP', port: 22, threat: false },
            { protocol: 'UDP', port: 1234, threat: false }
        ];
        
        this.threatPatterns = [
            { protocol: 'HTTP', destination: 'malicious-site.com', info: 'GET /malware.exe', threat: true },
            { protocol: 'TCP', destination: 'suspicious-ip.net', info: 'SYN flood attempt', threat: true },
            { protocol: 'DNS', destination: 'phishing-domain.org', info: 'Suspicious domain query', threat: true },
            { protocol: 'HTTP', destination: 'botnet-c2.com', info: 'POST /command', threat: true }
        ];
    }

    generatePacket() {
        this.packetId++;
        const now = new Date();
        const time = now.toTimeString().slice(0, 8);
        
        // 15% chance for malicious packet
        const isThreat = Math.random() < 0.15;
        
        if (isThreat) {
            return this.generateThreatPacket(time);
        } else {
            return this.generateNormalPacket(time);
        }
    }

    generateNormalPacket(time) {
        const pattern = this.normalTrafficPatterns[Math.floor(Math.random() * this.normalTrafficPatterns.length)];
        const sources = ['192.168.1.100', '192.168.1.101', '192.168.1.102'];
        const destinations = ['8.8.8.8', 'google.com', 'github.com', 'stackoverflow.com'];
        
        return {
            id: this.packetId,
            time,
            source: sources[Math.floor(Math.random() * sources.length)],
            destination: destinations[Math.floor(Math.random() * destinations.length)],
            protocol: pattern.protocol,
            info: this.generateNormalInfo(pattern.protocol),
            threat: false
        };
    }

    generateThreatPacket(time) {
        const pattern = this.threatPatterns[Math.floor(Math.random() * this.threatPatterns.length)];
        
        return {
            id: this.packetId,
            time,
            source: '192.168.1.100',
            destination: pattern.destination,
            protocol: pattern.protocol,
            info: pattern.info,
            threat: true
        };
    }

    generateNormalInfo(protocol) {
        const infoPatterns = {
            'DNS': ['Standard query A google.com', 'Response A 8.8.8.8', 'Query AAAA github.com'],
            'HTTP': ['GET /index.html', 'POST /api/data', 'Response 200 OK'],
            'HTTPS': ['Client Hello', 'Server Hello', 'Application Data'],
            'TCP': ['SYN', 'ACK', 'FIN'],
            'UDP': ['Data transfer', 'Keep-alive', 'Response']
        };
        
        const patterns = infoPatterns[protocol] || ['Data'];
        return patterns[Math.floor(Math.random() * patterns.length)];
    }
}
