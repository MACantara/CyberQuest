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

    static suspiciousProcessClasses = [
        'gaming_booster',
        'fps_enhancer',
        'tournament_optimizer',
        'steam_achievement_unlocker',
        'discord_nitro_generator',
        'gaming_vpn_free',
        'cheat_engine_pro',
        'rank_booster_tool',
        'skin_unlocker',
        'lag_eliminator'
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

    // Create a random suspicious process
    static createRandomSuspiciousProcess() {
        const suspiciousNames = [
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
            `temp\\downloads\\`,
            `users\\public\\documents\\`,
            `appdata\\roaming\\gaming\\`,
            `temp\\steam_unofficial\\`,
            `users\\downloads\\discord_tools\\`,
            `program files (x86)\\gaming_utilities\\`,
            `temp\\cheats\\`,
            `appdata\\local\\temp\\`,
            `users\\public\\gaming_mods\\`,
            `downloads\\network_tools\\`
        ];
        
        const randomIndex = Math.floor(Math.random() * suspiciousNames.length);
        const name = suspiciousNames[randomIndex];
        const executable = suspiciousExecutables[randomIndex] + name;
        
        const process = {
            name: name,
            executable: executable,
            pid: Math.floor(Math.random() * 9000) + 1000,
            cpu: Math.random() * 8 + 2, // 2-10% CPU
            memory: Math.random() * 150 + 30, // 30-180MB
            threads: Math.floor(Math.random() * 15) + 3, // 3-18 threads
            priority: Math.random() > 0.5 ? 'High' : 'Normal',
            status: 'Running',
            startTime: new Date().toLocaleString(),
            suspicious: false,
            category: 'malware',
            description: 'Potentially malicious gaming utility'
        };
        
        return process;
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
