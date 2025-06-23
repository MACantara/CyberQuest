export class PacketCapture {
    constructor(networkMonitorApp) {
        this.app = networkMonitorApp;
        this.isCapturing = false;
        this.captureInterval = null;
        this.packetQueue = [];
        this.captureSpeed = 1000; // milliseconds between packets
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
        const packet = this.createRandomPacket();
        this.packetQueue.push(packet);
        this.app.addPacketToList(packet);
        
        // Keep only last 100 packets for performance
        if (this.packetQueue.length > 100) {
            this.packetQueue.shift();
        }
    }

    createRandomPacket() {
        const now = new Date();
        const time = now.toTimeString().split(' ')[0];
        
        const packetTypes = [
            {
                source: '192.168.1.100',
                destination: '8.8.8.8',
                protocol: 'DNS',
                info: 'Standard query A google.com',
                suspicious: false
            },
            {
                source: '192.168.1.100',
                destination: 'malicious-site.com',
                protocol: 'HTTP',
                info: 'GET /malware.exe',
                suspicious: true
            },
            {
                source: '192.168.1.1',
                destination: '192.168.1.100',
                protocol: 'TCP',
                info: 'ACK',
                suspicious: false
            },
            {
                source: '192.168.1.100',
                destination: 'phishing-bank.com',
                protocol: 'HTTPS',
                info: 'POST /login',
                suspicious: true
            },
            {
                source: '192.168.1.100',
                destination: '1.1.1.1',
                protocol: 'DNS',
                info: 'Standard query A cloudflare.com',
                suspicious: false
            }
        ];
        
        const randomPacket = packetTypes[Math.floor(Math.random() * packetTypes.length)];
        
        return {
            id: Date.now() + Math.random(),
            time: time,
            ...randomPacket
        };
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
