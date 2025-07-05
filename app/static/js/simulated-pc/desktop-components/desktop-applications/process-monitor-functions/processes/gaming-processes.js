import { BaseProcess } from './base-process.js';

export class SteamProcess extends BaseProcess {
    constructor() {
        super({
            name: 'steam.exe',
            executable: 'program files (x86)\\steam\\steam.exe',
            cpu: 4.4,
            memory: 102.2,
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
            cpu: 3.1,
            memory: 78.3,
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
            cpu: 11.7,
            memory: 189.4,
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
            cpu: 5.2,
            memory: 95.9,
            priority: 'High',
            category: 'gaming',
            description: 'CyberQuest tournament client'
        });
    }

    static getCategory() {
        return 'gaming';
    }
}
