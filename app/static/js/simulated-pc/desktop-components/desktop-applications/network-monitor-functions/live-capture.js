export class LiveCapture {
    constructor(packetGenerator, onPacketReceived) {
        this.packetGenerator = packetGenerator;
        this.onPacketReceived = onPacketReceived;
        this.isCapturing = false;
        this.captureInterval = null;
        this.captureSpeed = 2000; // milliseconds between packets
    }

    start() {
        if (this.isCapturing) return;
        
        this.isCapturing = true;
        this.captureInterval = setInterval(() => {
            const packet = this.packetGenerator.generatePacket();
            this.onPacketReceived(packet);
        }, this.captureSpeed);
    }

    stop() {
        if (!this.isCapturing) return;
        
        this.isCapturing = false;
        if (this.captureInterval) {
            clearInterval(this.captureInterval);
            this.captureInterval = null;
        }
    }

    toggle() {
        if (this.isCapturing) {
            this.stop();
        } else {
            this.start();
        }
        return this.isCapturing;
    }

    setCaptureSpeed(speed) {
        this.captureSpeed = speed;
        if (this.isCapturing) {
            this.stop();
            this.start();
        }
    }

    getStatus() {
        return this.isCapturing;
    }
}
