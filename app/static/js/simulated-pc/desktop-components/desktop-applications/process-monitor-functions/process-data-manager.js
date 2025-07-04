export class ProcessDataManager {
    constructor(activityEmitter = null) {
        this.processes = [];
        this.activityEmitter = activityEmitter;
        this.generateProcessData();
    }

    generateProcessData() {
        // Generate realistic process data for Level 3: Malware Mayhem gaming tournament scenario
        const systemProcesses = [
            // Legitimate system processes
            { name: 'System', executable: 'System', cpu: 0.1, memory: 128, priority: 'System', status: 'Running' },
            { name: 'explorer.exe', executable: 'explorer.exe', cpu: 2.3, memory: 45.2, priority: 'Normal', status: 'Running' },
            { name: 'winlogon.exe', executable: 'winlogon.exe', cpu: 0.2, memory: 18.9, priority: 'System', status: 'Running' },
            { name: 'csrss.exe', executable: 'csrss.exe', cpu: 0.5, memory: 45.1, priority: 'System', status: 'Running' },
            { name: 'lsass.exe', executable: 'lsass.exe', cpu: 0.3, memory: 34.7, priority: 'System', status: 'Running' },
            { name: 'svchost.exe', executable: 'svchost.exe', cpu: 1.1, memory: 32.6, priority: 'Normal', status: 'Running' },
            
            // Gaming-related legitimate processes
            { name: 'steam.exe', executable: 'program files (x86)\\steam\\steam.exe', cpu: 3.4, memory: 89.2, priority: 'Normal', status: 'Running' },
            { name: 'discord.exe', executable: 'users\\appdata\\local\\discord\\discord.exe', cpu: 2.1, memory: 67.3, priority: 'Normal', status: 'Running' },
            { name: 'obs64.exe', executable: 'program files\\obs studio\\bin\\64bit\\obs64.exe', cpu: 8.7, memory: 156.4, priority: 'High', status: 'Running' },
            { name: 'chrome.exe', executable: 'program files\\google\\chrome\\application\\chrome.exe', cpu: 15.7, memory: 234.8, priority: 'Normal', status: 'Running' },
            
            // Legitimate gaming tournament software
            { name: 'tournament_client.exe', executable: 'program files\\cyberquest\\tournament_client.exe', cpu: 4.2, memory: 78.9, priority: 'High', status: 'Running' },
            { name: 'antivirus.exe', executable: 'program files\\windows defender\\antivirus.exe', cpu: 1.8, memory: 43.4, priority: 'Normal', status: 'Running' },
            
            // Malware disguised as gaming performance boosters - RANSOMWARE
            { name: 'gaming_optimizer_pro.exe', executable: 'temp\\downloads\\gaming_optimizer_pro.exe', cpu: 18.5, memory: 189.7, priority: 'High', status: 'Running' },
            { name: 'fps_booster_ultimate.exe', executable: 'users\\public\\documents\\fps_booster_ultimate.exe', cpu: 14.2, memory: 167.3, priority: 'High', status: 'Running' },
            
            // TROJANS - masquerading as legitimate gaming tools
            { name: 'steam_helper.exe', executable: 'temp\\steam_helper.exe', cpu: 8.8, memory: 94.1, priority: 'Normal', status: 'Running' },
            { name: 'discord_overlay.exe', executable: 'appdata\\roaming\\discord_overlay.exe', cpu: 6.9, memory: 67.8, priority: 'Normal', status: 'Running' },
            { name: 'nvidia_gamestream.exe', executable: 'users\\downloads\\nvidia_gamestream.exe', cpu: 7.4, memory: 85.6, priority: 'Normal', status: 'Running' },
            
            // SPYWARE - monitoring gaming activities and stealing credentials
            { name: 'performance_monitor.exe', executable: 'program files\\common files\\performance_monitor.exe', cpu: 3.3, memory: 54.2, priority: 'Low', status: 'Running' },
            { name: 'game_stats_tracker.exe', executable: 'appdata\\local\\temp\\game_stats_tracker.exe', cpu: 2.7, memory: 41.5, priority: 'Low', status: 'Running' },
            { name: 'tournament_recorder.exe', executable: 'users\\public\\tournament_recorder.exe', cpu: 4.1, memory: 62.8, priority: 'Normal', status: 'Running' },
            
            // ROOTKITS - hiding deep in system processes
            { name: 'system_optimizer.exe', executable: 'windows\\system32\\system_optimizer.exe', cpu: 11.4, memory: 128.9, priority: 'System', status: 'Running' },
            { name: 'driver_updater.exe', executable: 'windows\\system32\\drivers\\driver_updater.exe', cpu: 8.6, memory: 96.4, priority: 'High', status: 'Running' },
            
            // Additional malware variants
            { name: 'latency_reducer.exe', executable: 'temp\\gaming_tools\\latency_reducer.exe', cpu: 9.2, memory: 112.7, priority: 'High', status: 'Running' },
            { name: 'cpu_overclocker.exe', executable: 'users\\downloads\\utilities\\cpu_overclocker.exe', cpu: 12.8, memory: 145.3, priority: 'High', status: 'Running' },
            { name: 'memory_cleaner_pro.exe', executable: 'program files (x86)\\utilities\\memory_cleaner_pro.exe', cpu: 5.7, memory: 73.9, priority: 'Normal', status: 'Running' }
        ];

        // Normalize CPU usage to ensure total doesn't exceed 100%
        this.normalizeCpuUsage(systemProcesses);

        this.processes = systemProcesses.map((proc, index) => ({
            ...proc,
            pid: 1000 + index * 100 + Math.floor(Math.random() * 99),
            threads: Math.floor(Math.random() * 20) + 1,
            startTime: new Date(Date.now() - Math.random() * 86400000).toLocaleString(),
            // Don't automatically flag as suspicious - let players determine this
            suspicious: false
        }));
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
        // Generate potentially malicious gaming-related process names
        const suspiciousProcessNames = [
            `game_booster_${Math.floor(Math.random() * 1000)}.exe`,
            `fps_enhancer_${Math.floor(Math.random() * 100)}.exe`,
            `tournament_optimizer.exe`,
            `steam_achievement_unlocker.exe`,
            `discord_nitro_generator.exe`,
            `gaming_vpn_free.exe`,
            `cheat_engine_pro.exe`,
            `rank_booster_tool.exe`,
            `skin_unlocker.exe`,
            `lag_eliminator.exe`
        ];
        
        const suspiciousExecutables = [
            `temp\\downloads\\${suspiciousProcessNames[0]}`,
            `users\\public\\documents\\${suspiciousProcessNames[1]}`,
            `appdata\\roaming\\gaming\\${suspiciousProcessNames[2]}`,
            `temp\\steam_unofficial\\${suspiciousProcessNames[3]}`,
            `users\\downloads\\discord_tools\\${suspiciousProcessNames[4]}`,
            `program files (x86)\\gaming_utilities\\${suspiciousProcessNames[5]}`,
            `temp\\cheats\\${suspiciousProcessNames[6]}`,
            `appdata\\local\\temp\\${suspiciousProcessNames[7]}`,
            `users\\public\\gaming_mods\\${suspiciousProcessNames[8]}`,
            `downloads\\network_tools\\${suspiciousProcessNames[9]}`
        ];
        
        const randomIndex = Math.floor(Math.random() * suspiciousProcessNames.length);
        
        const newProcess = {
            name: suspiciousProcessNames[randomIndex],
            executable: suspiciousExecutables[randomIndex],
            pid: Math.floor(Math.random() * 9000) + 1000,
            cpu: Math.random() * 8 + 2, // Lower CPU usage for new processes (2-10%)
            memory: Math.random() * 150 + 30, // Higher memory usage
            threads: Math.floor(Math.random() * 15) + 3, // More threads for malicious activity
            priority: Math.random() > 0.5 ? 'High' : 'Normal',
            status: 'Running',
            startTime: new Date().toLocaleString(),
            // Don't automatically flag as suspicious - let players analyze
            suspicious: false
        };
        
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
        const knownProcesses = [
            'system', 'explorer.exe', 'chrome.exe', 'cyberquest.exe', 
            'svchost.exe', 'winlogon.exe', 'csrss.exe', 'lsass.exe'
        ];
        return knownProcesses.some(known => 
            processName.toLowerCase().includes(known.toLowerCase())
        );
    }

    isLegitimateGamingProcess(processName) {
        const legitimateGamingProcesses = [
            'steam.exe', 'discord.exe', 'obs64.exe', 'tournament_client.exe',
            'nvidia_gamestream.exe', 'amd_gaming.exe', 'origin.exe', 'epic_games.exe'
        ];
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
