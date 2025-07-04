import { BaseProcess } from './base-process.js';

export class ChromeProcess extends BaseProcess {
    constructor() {
        super({
            name: 'chrome.exe',
            executable: 'program files\\google\\chrome\\application\\chrome.exe',
            cpu: 15.7,
            memory: 234.8,
            priority: 'Normal',
            category: 'application',
            description: 'Google Chrome web browser'
        });
    }

    static getCategory() {
        return 'application';
    }

    static isKnownSystemProcess() {
        return true;
    }
}

export class AntivirusProcess extends BaseProcess {
    constructor() {
        super({
            name: 'antivirus.exe',
            executable: 'program files\\windows defender\\antivirus.exe',
            cpu: 1.8,
            memory: 43.4,
            priority: 'Normal',
            category: 'security',
            description: 'Windows Defender antivirus'
        });
    }

    static getCategory() {
        return 'security';
    }

    static isKnownSystemProcess() {
        return true;
    }
}
