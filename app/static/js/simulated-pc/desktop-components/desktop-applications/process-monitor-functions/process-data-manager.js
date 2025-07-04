export class ProcessDataManager {
    constructor(activityEmitter = null) {
        this.processes = [];
        this.activityEmitter = activityEmitter;
        this.generateProcessData();
    }

    generateProcessData() {
        // Generate realistic process data without automatic suspicious flagging
        const systemProcesses = [
            { name: 'System', executable: 'System', cpu: 0.1, memory: 128, priority: 'System', status: 'Running' },
            { name: 'explorer.exe', executable: 'explorer.exe', cpu: 2.3, memory: 45.2, priority: 'Normal', status: 'Running' },
            { name: 'chrome.exe', executable: 'chrome.exe', cpu: 15.7, memory: 234.8, priority: 'Normal', status: 'Running' },
            { name: 'cyberquest.exe', executable: 'cyberquest.exe', cpu: 8.2, memory: 156.4, priority: 'High', status: 'Running' },
            { name: 'svchost.exe', executable: 'svchost.exe', cpu: 1.1, memory: 32.6, priority: 'Normal', status: 'Running' },
            { name: 'antivirus.exe', executable: 'antivirus.exe', cpu: 3.4, memory: 78.9, priority: 'Normal', status: 'Running' },
            { name: 'malware_scanner.exe', executable: 'malware_scanner.exe', cpu: 0.8, memory: 23.4, priority: 'Low', status: 'Running' },
            { name: 'notepad.exe', executable: 'notepad.exe', cpu: 0.0, memory: 12.3, priority: 'Normal', status: 'Running' },
            { name: 'winlogon.exe', executable: 'winlogon.exe', cpu: 0.2, memory: 18.9, priority: 'System', status: 'Running' },
            { name: 'csrss.exe', executable: 'csrss.exe', cpu: 0.5, memory: 45.1, priority: 'System', status: 'Running' },
            { name: 'lsass.exe', executable: 'lsass.exe', cpu: 0.3, memory: 34.7, priority: 'System', status: 'Running' },
            { name: 'network_monitor.exe', executable: 'network_monitor.exe', cpu: 2.1, memory: 67.3, priority: 'Normal', status: 'Running' },
            { name: 'backup_service.exe', executable: 'backup_service.exe', cpu: 1.8, memory: 56.2, priority: 'Low', status: 'Running' },
            // Include some potentially suspicious processes but don't auto-flag them
            { name: 'suspicious_process.exe', executable: 'temp\\suspicious_process.exe', cpu: 25.6, memory: 89.7, priority: 'High', status: 'Running' },
            { name: 'keylogger.exe', executable: 'hidden\\keylogger.exe', cpu: 12.4, memory: 45.8, priority: 'Normal', status: 'Running' }
        ];

        this.processes = systemProcesses.map((proc, index) => ({
            ...proc,
            pid: 1000 + index * 100 + Math.floor(Math.random() * 99),
            threads: Math.floor(Math.random() * 20) + 1,
            startTime: new Date(Date.now() - Math.random() * 86400000).toLocaleString(),
            // Remove automatic suspicious flagging - let players determine this
            suspicious: false
        }));
    }

    refreshProcessData() {
        // Simulate process changes
        this.processes.forEach(process => {
            // Track high resource usage before updating
            const oldCpu = process.cpu;
            const oldMemory = process.memory;
            
            // Slightly randomize CPU and memory usage
            process.cpu = Math.max(0, process.cpu + (Math.random() - 0.5) * 5);
            process.memory = Math.max(1, process.memory + (Math.random() - 0.5) * 10);
            
            // Check for high resource usage
            if (this.activityEmitter && typeof this.activityEmitter.emitHighResourceUsage === 'function') {
                if (process.cpu > 50 && oldCpu <= 50) {
                    this.activityEmitter.emitHighResourceUsage(process, 'cpu', process.cpu.toFixed(1));
                }
                if (process.memory > 200 && oldMemory <= 200) {
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
        // Generate potentially suspicious process names but don't auto-flag them
        const processNames = [
            `temp_process_${Math.floor(Math.random() * 1000)}.exe`,
            `update_manager_${Math.floor(Math.random() * 100)}.exe`,
            `system_checker.exe`,
            `windows_defender.exe`,
            `chrome_helper.exe`,
            `java_updater.exe`,
            `flash_player.exe`,
            `codec_pack.exe`
        ];
        
        const executables = [
            `temp\\${processNames[0]}`,
            `downloads\\${processNames[1]}`,
            `system32\\${processNames[2]}`,
            `program files\\${processNames[3]}`,
            `appdata\\${processNames[4]}`,
            `users\\public\\${processNames[5]}`,
            `windows\\${processNames[6]}`,
            `temp\\downloads\\${processNames[7]}`
        ];
        
        const randomIndex = Math.floor(Math.random() * processNames.length);
        
        const newProcess = {
            name: processNames[randomIndex],
            executable: executables[randomIndex],
            pid: Math.floor(Math.random() * 9000) + 1000,
            cpu: Math.random() * 20,
            memory: Math.random() * 100 + 10,
            threads: Math.floor(Math.random() * 10) + 1,
            priority: 'Normal',
            status: 'Running',
            startTime: new Date().toLocaleString(),
            // Don't automatically flag as suspicious - let players analyze
            suspicious: false
        };
        
        this.processes.push(newProcess);
        
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

    // Add method to get potentially suspicious indicators for player analysis
    getProcessRiskFactors(process) {
        const riskFactors = [];
        
        // High CPU usage
        if (process.cpu > 50) {
            riskFactors.push('High CPU usage');
        }
        
        // High memory usage
        if (process.memory > 200) {
            riskFactors.push('High memory usage');
        }
        
        // Unusual executable paths
        if (process.executable.includes('temp\\') || 
            process.executable.includes('downloads\\') ||
            process.executable.includes('appdata\\') ||
            process.executable.includes('users\\public\\')) {
            riskFactors.push('Unusual executable location');
        }
        
        // Suspicious process names
        if (process.name.includes('keylogger') ||
            process.name.includes('suspicious') ||
            process.name.includes('crack') ||
            process.name.includes('hack')) {
            riskFactors.push('Suspicious process name');
        }
        
        // High priority but unknown process
        if (process.priority === 'High' && !this.isKnownSystemProcess(process.name)) {
            riskFactors.push('High priority unknown process');
        }
        
        return riskFactors;
    }

    isKnownSystemProcess(processName) {
        const knownProcesses = [
            'system', 'explorer.exe', 'chrome.exe', 'cyberquest.exe', 
            'svchost.exe', 'winlogon.exe', 'csrss.exe', 'lsass.exe'
        ];
        return knownProcesses.some(known => 
            processName.toLowerCase().includes(known.toLowerCase())
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
        return Math.min(100, totalCpu);
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
