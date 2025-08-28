export class BaseProcess {
    constructor(config) {
        this.name = config.name;
        this.executable = config.executable;
        this.baseCpu = config.cpu || 0;
        this.baseMemory = config.memory || 1;
        this.priority = config.priority || 'Normal';
        this.status = config.status || 'Running';
        this.category = config.category || 'unknown';
        this.description = config.description || '';
        
        // Runtime properties (set during creation)
        this.pid = null;
        this.cpu = this.baseCpu;
        this.memory = this.baseMemory;
        this.threads = null;
        this.startTime = null;
        this.suspicious = false;
    }

    // Initialize runtime properties
    initialize(pid) {
        this.pid = pid;
        this.threads = Math.floor(Math.random() * 20) + 1;
        this.startTime = new Date(Date.now() - Math.random() * 86400000).toLocaleString();
        this.cpu = this.generateCpuUsage();
        this.memory = this.generateMemoryUsage();
    }

    // Generate CPU usage with some randomization
    generateCpuUsage() {
        const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
        return Math.max(0.1, this.baseCpu * (1 + variation));
    }

    // Generate memory usage with some randomization
    generateMemoryUsage() {
        const variation = (Math.random() - 0.5) * 0.3; // ±15% variation
        return Math.max(1, this.baseMemory * (1 + variation));
    }

    // Update process metrics (called during refresh)
    update() {
        const cpuVariation = (Math.random() - 0.5) * 2; // ±1% variation
        const memoryVariation = (Math.random() - 0.5) * 5; // ±2.5MB variation
        
        this.cpu = Math.max(0.1, this.cpu + cpuVariation);
        this.memory = Math.max(1, this.memory + memoryVariation);
    }

    // Check if process should be considered suspicious
    isSuspicious() {
        return this.suspicious;
    }

    // Get risk factors for this process
    getRiskFactors() {
        const riskFactors = [];
        
        // Default risk factor checks
        if (this.cpu > 30) {
            riskFactors.push('High CPU usage for this type of process');
        }
        
        if (this.memory > 100) {
            riskFactors.push('Excessive memory consumption');
        }
        
        if (this.threads > 10) {
            riskFactors.push('Excessive thread count');
        }
        
        return riskFactors;
    }

    // Convert to plain object for data manager
    toObject() {
        return {
            name: this.name,
            executable: this.executable,
            pid: this.pid,
            cpu: this.cpu,
            memory: this.memory,
            threads: this.threads,
            priority: this.priority,
            status: this.status,
            startTime: this.startTime,
            suspicious: this.suspicious,
            category: this.category,
            description: this.description
        };
    }

    // Static method to get process category
    static getCategory() {
        return 'unknown';
    }

    // Static method to check if process is known system process
    static isKnownSystemProcess() {
        return false;
    }
}
