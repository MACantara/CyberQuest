import { ProcessFactory } from './processes/process-factory.js';

export class ProcessDataManager {
    constructor(activityEmitter = null) {
        this.processes = [];
        this.activityEmitter = activityEmitter;
        this.tutorialMode = false; // Add tutorial mode flag
        this.generateProcessData();
    }

    // Add method to control tutorial mode
    setTutorialMode(enabled) {
        this.tutorialMode = enabled;
    }

    isTutorialMode() {
        return this.tutorialMode;
    }

    generateProcessData() {
        // Use the process factory to create default processes
        this.processes = ProcessFactory.createDefaultProcesses();
        
        // Normalize CPU usage to ensure total doesn't exceed 100%
        this.normalizeCpuUsage(this.processes);
    }

    normalizeCpuUsage(processes) {
        // Calculate total CPU usage
        const totalCpu = processes.reduce((sum, proc) => sum + proc.cpu, 0);
        
        // If total exceeds 100%, normalize all values proportionally
        if (totalCpu > 100) {
            const scaleFactor = 95 / totalCpu; // Scale to 95% to leave some headroom
            processes.forEach(proc => {
                proc.cpu = proc.cpu * scaleFactor;
            });
        }
    }

    refreshProcessData() {
        // Skip refresh if in tutorial mode
        if (this.tutorialMode) {
            console.log('Process data refresh skipped - tutorial mode active');
            return;
        }

        // Simulate process changes
        this.processes.forEach(process => {
            // Track high resource usage before updating
            const oldCpu = process.cpu;
            const oldMemory = process.memory;
            
            // Slightly randomize CPU and memory usage with smaller variations
            const cpuVariation = (Math.random() - 0.5) * 2; // ±1% variation
            const memoryVariation = (Math.random() - 0.5) * 5; // ±2.5MB variation
            
            process.cpu = Math.max(0.1, process.cpu + cpuVariation);
            process.memory = Math.max(1, process.memory + memoryVariation);
        });

        // Normalize CPU usage after changes to ensure total stays under 100%
        const processArray = this.processes.map(p => ({ cpu: p.cpu }));
        this.normalizeCpuUsage(processArray);
        this.processes.forEach((process, index) => {
            process.cpu = processArray[index].cpu;
            
            // Check for high resource usage after normalization
            if (this.activityEmitter && typeof this.activityEmitter.emitHighResourceUsage === 'function') {
                if (process.cpu > 15 && this.processes[index].cpu <= 15) { // Lowered threshold due to normalization
                    this.activityEmitter.emitHighResourceUsage(process, 'cpu', process.cpu.toFixed(1));
                }
                if (process.memory > 200 && this.processes[index].memory <= 200) {
                    this.activityEmitter.emitHighResourceUsage(process, 'memory', process.memory.toFixed(1));
                }
            }
        });

        // Occasionally add/remove processes
        if (Math.random() < 0.1) {
            if (this.processes.length < 20 && Math.random() < 0.7) {
                // Add new process
                this.addRandomProcess();
            } else if (this.processes.length > 10) {
                // Remove random process
                const randomIndex = Math.floor(Math.random() * this.processes.length);
                const processToRemove = this.processes[randomIndex];
                
                // Emit termination before removal
                if (this.activityEmitter && typeof this.activityEmitter.emitProcessTerminated === 'function') {
                    this.activityEmitter.emitProcessTerminated(processToRemove, 'system');
                }
                
                this.processes.splice(randomIndex, 1);
            }
        }
    }

    addRandomProcess() {
        // Skip adding processes if in tutorial mode
        if (this.tutorialMode) {
            return;
        }

        // Use the process factory to create random suspicious processes
        const newProcess = ProcessFactory.createRandomSuspiciousProcess();
        this.processes.push(newProcess);
        
        // Re-normalize CPU usage after adding new process
        const processArray = this.processes.map(p => ({ cpu: p.cpu }));
        this.normalizeCpuUsage(processArray);
        this.processes.forEach((process, index) => {
            process.cpu = processArray[index].cpu;
        });
        
        // Emit process start activity with safety checks
        if (this.activityEmitter && typeof this.activityEmitter.emitProcessStart === 'function') {
            this.activityEmitter.emitProcessStart(newProcess);
        }
    }

    // Add method to manually flag process as suspicious (for player actions)
    flagProcessAsSuspicious(pid, suspicious = true) {
        const process = this.getProcessByPid(pid);
        if (process) {
            process.suspicious = suspicious;
            
            // Emit suspicious process activity if flagged
            if (suspicious && this.activityEmitter && typeof this.activityEmitter.emitSuspiciousProcess === 'function') {
                this.activityEmitter.emitSuspiciousProcess(process);
            }
        }
    }

    // Enhanced method to get potentially suspicious indicators for gaming malware
    getProcessRiskFactors(process) {
        const riskFactors = [];
        
        // High CPU usage (adjusted for normalized values)
        if (process.cpu > 12) { // Lowered threshold due to normalization
            riskFactors.push('High CPU usage for this type of process');
        }
        
        // High memory usage
        if (process.memory > 100) {
            riskFactors.push('Excessive memory consumption');
        }
        
        // Suspicious executable paths for gaming malware
        if (process.executable.includes('temp\\') || 
            process.executable.includes('downloads\\') ||
            process.executable.includes('appdata\\roaming\\') ||
            process.executable.includes('users\\public\\')) {
            riskFactors.push('Running from suspicious temporary or download location');
        }
        
        // Gaming malware-specific indicators
        if (process.name.includes('booster') || 
            process.name.includes('optimizer') ||
            process.name.includes('enhancer') ||
            process.name.includes('unlocker') ||
            process.name.includes('generator') ||
            process.name.includes('cheat')) {
            riskFactors.push('Potentially fraudulent gaming enhancement tool');
        }
        
        // Masquerading as legitimate gaming software
        if ((process.name.includes('steam') && !process.executable.includes('steam\\')) ||
            (process.name.includes('discord') && !process.executable.includes('discord\\')) ||
            (process.name.includes('nvidia') && !process.executable.includes('nvidia\\')) ||
            (process.name.includes('obs') && !process.executable.includes('obs'))) {
            riskFactors.push('Process name mimics legitimate gaming software but runs from wrong location');
        }
        
        // System location but non-system process
        if (process.executable.includes('system32\\') && 
            !this.isKnownSystemProcess(process.name) &&
            (process.name.includes('optimizer') || process.name.includes('updater'))) {
            riskFactors.push('Suspicious process running from system directory');
        }
        
        // High priority but questionable purpose
        if (process.priority === 'High' && 
            !this.isKnownSystemProcess(process.name) &&
            !this.isLegitimateGamingProcess(process.name)) {
            riskFactors.push('High priority process with questionable gaming purpose');
        }
        
        // Multiple threads for simple optimization tools (indicating malicious background activity)
        if (process.threads > 10 && 
            (process.name.includes('booster') || process.name.includes('optimizer'))) {
            riskFactors.push('Excessive thread count for optimization tool - may indicate background malicious activity');
        }
        
        return riskFactors;
    }

    isKnownSystemProcess(processName) {
        return ProcessFactory.isKnownSystemProcess(processName);
    }

    isLegitimateGamingProcess(processName) {
        const legitimateGamingProcesses = ProcessFactory.getLegitimateGamingProcesses();
        return legitimateGamingProcesses.some(legit => 
            processName.toLowerCase().includes(legit.toLowerCase())
        );
    }

    removeProcess(pid) {
        this.processes = this.processes.filter(p => p.pid !== pid);
    }

    getProcessByPid(pid) {
        return this.processes.find(p => p.pid === pid);
    }

    getTotalThreads() {
        return this.processes.reduce((total, process) => total + process.threads, 0);
    }

    getTotalCpuUsage() {
        const totalCpu = this.processes.reduce((sum, p) => sum + p.cpu, 0);
        return Math.min(100, totalCpu); // Ensure it never exceeds 100%
    }

    getTotalMemoryUsage() {
        const totalMemory = this.processes.reduce((sum, p) => sum + p.memory, 0);
        return totalMemory / 1024; // Convert to GB
    }

    getProcesses() {
        return this.processes;
    }

    getProcessCount() {
        return this.processes.length;
    }

    setActivityEmitter(emitter) {
        this.activityEmitter = emitter;
    }
}