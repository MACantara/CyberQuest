import { BaseProcess } from './base-process.js';

export class SystemProcess extends BaseProcess {
    constructor() {
        super({
            name: 'System',
            executable: 'System',
            cpu: 0.2,
            memory: 135,
            priority: 'System',
            category: 'system',
            description: 'Core Windows system process'
        });
    }

    static getCategory() {
        return 'system';
    }

    static isKnownSystemProcess() {
        return true;
    }
}

export class ExplorerProcess extends BaseProcess {
    constructor() {
        super({
            name: 'explorer.exe',
            executable: 'explorer.exe',
            cpu: 3.3,
            memory: 52.2,
            priority: 'Normal',
            category: 'system',
            description: 'Windows Explorer shell process'
        });
    }

    static getCategory() {
        return 'system';
    }

    static isKnownSystemProcess() {
        return true;
    }
}

export class WinLogonProcess extends BaseProcess {
    constructor() {
        super({
            name: 'winlogon.exe',
            executable: 'winlogon.exe',
            cpu: 0.3,
            memory: 21.9,
            priority: 'System',
            category: 'system',
            description: 'Windows logon process'
        });
    }

    static getCategory() {
        return 'system';
    }

    static isKnownSystemProcess() {
        return true;
    }
}

export class CsrssProcess extends BaseProcess {
    constructor() {
        super({
            name: 'csrss.exe',
            executable: 'csrss.exe',
            cpu: 0.7,
            memory: 48.1,
            priority: 'System',
            category: 'system',
            description: 'Client/Server Runtime Subsystem'
        });
    }

    static getCategory() {
        return 'system';
    }

    static isKnownSystemProcess() {
        return true;
    }
}

export class LsassProcess extends BaseProcess {
    constructor() {
        super({
            name: 'lsass.exe',
            executable: 'lsass.exe',
            cpu: 0.4,
            memory: 38.7,
            priority: 'System',
            category: 'system',
            description: 'Local Security Authority Subsystem'
        });
    }

    static getCategory() {
        return 'system';
    }

    static isKnownSystemProcess() {
        return true;
    }
}

export class SvchostProcess extends BaseProcess {
    constructor() {
        super({
            name: 'svchost.exe',
            executable: 'svchost.exe',
            cpu: 1.4,
            memory: 39.6,
            priority: 'Normal',
            category: 'system',
            description: 'Service Host Process'
        });
    }

    static getCategory() {
        return 'system';
    }

    static isKnownSystemProcess() {
        return true;
    }
}
