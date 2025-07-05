// System processes
import { 
    SystemProcess, 
    ExplorerProcess, 
    WinLogonProcess, 
    CsrssProcess, 
    LsassProcess, 
    SvchostProcess 
} from './system-processes.js';

// Gaming processes
import { 
    SteamProcess, 
    DiscordProcess, 
    ObsProcess, 
    TournamentClientProcess 
} from './gaming-processes.js';

// Application processes
import { 
    ChromeProcess, 
    AntivirusProcess 
} from './application-processes.js';

// Malware processes
import { 
    RansomwareGamingOptimizerProcess, 
    TrojanSteamHelperProcess, 
    SpywarePerformanceMonitorProcess, 
    RootkitSystemOptimizerProcess 
} from './malware-processes.js';

export class ProcessFactory {
    static processClasses = [
        // System processes
        SystemProcess,
        ExplorerProcess,
        WinLogonProcess,
        CsrssProcess,
        LsassProcess,
        SvchostProcess,
        
        // Application processes
        ChromeProcess,
        AntivirusProcess,
        
        // Gaming processes
        SteamProcess,
        DiscordProcess,
        ObsProcess,
        TournamentClientProcess,
        
        // Malware processes
        RansomwareGamingOptimizerProcess,
        TrojanSteamHelperProcess,
        SpywarePerformanceMonitorProcess,
        RootkitSystemOptimizerProcess
    ];

    // Create all default processes for the gaming tournament scenario
    static createDefaultProcesses() {
        const processes = [];
        
        this.processClasses.forEach((ProcessClass, index) => {
            const process = new ProcessClass();
            const pid = 1000 + index * 100 + Math.floor(Math.random() * 99);
            process.initialize(pid);
            processes.push(process.toObject());
        });

        return processes;
    }

    // Get process categories
    static getProcessCategories() {
        const categories = new Set();
        this.processClasses.forEach(ProcessClass => {
            categories.add(ProcessClass.getCategory());
        });
        return Array.from(categories);
    }

    // Check if a process name is a known system process
    static isKnownSystemProcess(processName) {
        return this.processClasses.some(ProcessClass => {
            if (ProcessClass.isKnownSystemProcess && ProcessClass.isKnownSystemProcess()) {
                const instance = new ProcessClass();
                return processName.toLowerCase().includes(instance.name.toLowerCase());
            }
            return false;
        });
    }

    // Get legitimate gaming processes
    static getLegitimateGamingProcesses() {
        return this.processClasses
            .filter(ProcessClass => ProcessClass.getCategory() === 'gaming')
            .map(ProcessClass => new ProcessClass().name);
    }
}