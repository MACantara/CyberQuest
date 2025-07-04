export class ProcessDataManager {
    constructor() {
        this.processes = [];
        this.generateProcessData();
    }

    generateProcessData() {
        // Generate realistic process data
        const systemProcesses = [
            { name: 'System', executable: 'System', cpu: 0.1, memory: 128, priority: 'System', status: 'Running' },
            { name: 'explorer.exe', executable: 'explorer.exe', cpu: 2.3, memory: 45.2, priority: 'Normal', status: 'Running' },
            { name: 'chrome.exe', executable: 'chrome.exe', cpu: 15.7, memory: 234.8, priority: 'Normal', status: 'Running' },
            { name: 'cyberquest.exe', executable: 'cyberquest.exe', cpu: 8.2, memory: 156.4, priority: 'High', status: 'Running' },
            { name: 'svchost.exe', executable: 'svchost.exe', cpu: 1.1, memory: 32.6, priority: 'Normal', status: 'Running' },
            { name: 'antivirus.exe', executable: 'antivirus.exe', cpu: 3.4, memory: 78.9, priority: 'Normal', status: 'Running' },
            { name: 'malware_scanner.exe', executable: 'malware_scanner.exe', cpu: 0.8, memory: 23.4, priority: 'Low', status: 'Running' },
            { name: 'notepad.exe', executable: 'notepad.exe', cpu: 0.0, memory: 12.3, priority: 'Normal', status: 'Running' },
            { name: 'suspicious_process.exe', executable: 'temp\\suspicious_process.exe', cpu: 25.6, memory: 89.7, priority: 'High', status: 'Running' },
            { name: 'winlogon.exe', executable: 'winlogon.exe', cpu: 0.2, memory: 18.9, priority: 'System', status: 'Running' },
            { name: 'csrss.exe', executable: 'csrss.exe', cpu: 0.5, memory: 45.1, priority: 'System', status: 'Running' },
            { name: 'lsass.exe', executable: 'lsass.exe', cpu: 0.3, memory: 34.7, priority: 'System', status: 'Running' },
            { name: 'network_monitor.exe', executable: 'network_monitor.exe', cpu: 2.1, memory: 67.3, priority: 'Normal', status: 'Running' },
            { name: 'keylogger.exe', executable: 'hidden\\keylogger.exe', cpu: 12.4, memory: 45.8, priority: 'Normal', status: 'Running' },
            { name: 'backup_service.exe', executable: 'backup_service.exe', cpu: 1.8, memory: 56.2, priority: 'Low', status: 'Running' }
        ];

        this.processes = systemProcesses.map((proc, index) => ({
            ...proc,
            pid: 1000 + index * 100 + Math.floor(Math.random() * 99),
            threads: Math.floor(Math.random() * 20) + 1,
            startTime: new Date(Date.now() - Math.random() * 86400000).toLocaleString(),
            suspicious: proc.name.includes('suspicious') || proc.name.includes('keylogger') || proc.executable.includes('temp\\') || proc.executable.includes('hidden\\')
        }));
    }

    refreshProcessData() {
        // Simulate process changes
        this.processes.forEach(process => {
            // Slightly randomize CPU and memory usage
            process.cpu = Math.max(0, process.cpu + (Math.random() - 0.5) * 5);
            process.memory = Math.max(1, process.memory + (Math.random() - 0.5) * 10);
        });

        // Occasionally add/remove processes
        if (Math.random() < 0.1) {
            if (this.processes.length < 20 && Math.random() < 0.7) {
                // Add new process
                this.addRandomProcess();
            } else if (this.processes.length > 10) {
                // Remove random process
                const randomIndex = Math.floor(Math.random() * this.processes.length);
                this.processes.splice(randomIndex, 1);
            }
        }
    }

    addRandomProcess() {
        this.processes.push({
            name: `temp_process_${Math.floor(Math.random() * 1000)}.exe`,
            executable: `temp\\temp_process_${Math.floor(Math.random() * 1000)}.exe`,
            pid: Math.floor(Math.random() * 9000) + 1000,
            cpu: Math.random() * 20,
            memory: Math.random() * 100 + 10,
            threads: Math.floor(Math.random() * 10) + 1,
            priority: 'Normal',
            status: 'Running',
            startTime: new Date().toLocaleString(),
            suspicious: Math.random() < 0.3
        });
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
}
