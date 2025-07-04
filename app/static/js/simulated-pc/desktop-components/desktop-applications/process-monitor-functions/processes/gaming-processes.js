import { BaseProcess } from './base-process.js';

export class SteamProcess extends BaseProcess {
    constructor() {
        super({
            name: 'steam.exe',
            executable: 'program files (x86)\\steam\\steam.exe',
            cpu: 3.4,
            memory: 89.2,
            priority: 'Normal',
            category: 'gaming',
            description: 'Steam gaming platform client'
        });
    }

    static getCategory() {
        return 'gaming';
    }
}

export class DiscordProcess extends BaseProcess {
    constructor() {
        super({
            name: 'discord.exe',
            executable: 'users\\appdata\\local\\discord\\discord.exe',
            cpu: 2.1,
            memory: 67.3,
            priority: 'Normal',
            category: 'gaming',
            description: 'Discord communication platform'
        });
    }

    static getCategory() {
        return 'gaming';
    }
}

export class ObsProcess extends BaseProcess {
    constructor() {
        super({
            name: 'obs64.exe',
            executable: 'program files\\obs studio\\bin\\64bit\\obs64.exe',
            cpu: 8.7,
            memory: 156.4,
            priority: 'High',
            category: 'gaming',
            description: 'OBS Studio streaming software'
        });
    }

    static getCategory() {
        return 'gaming';
    }
}

export class TournamentClientProcess extends BaseProcess {
    constructor() {
        super({
            name: 'tournament_client.exe',
            executable: 'program files\\cyberquest\\tournament_client.exe',
            cpu: 4.2,
            memory: 78.9,
            priority: 'High',
            category: 'gaming',
            description: 'CyberQuest tournament client'
        });
    }

    static getCategory() {
        return 'gaming';
    }
}
