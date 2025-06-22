import { WindowBase } from '../window-base.js';

export class TerminalApp extends WindowBase {
    constructor() {
        super('terminal', 'Terminal', {
            width: '70%',
            height: '60%'
        });
    }

    createContent() {
        return `
        <div class="h-full bg-black text-green-400 font-mono text-sm p-3 flex flex-col" id="terminal-container">
                <div class="flex-1 overflow-y-auto mb-3 space-y-1" id="terminal-output">
                    <div id="whoami-command">user@cyberquest:~$ whoami</div>
                    <div id="whoami-result">trainee</div>
                    <div id="ls-command">user@cyberquest:~$ ls -la</div>
                    <div id="documents-dir">drwxr-xr-x 2 trainee trainee 4096 Dec 20 10:30 Documents</div>
                    <div id="downloads-dir">drwxr-xr-x 2 trainee trainee 4096 Dec 20 10:30 Downloads</div>
                    <div class="text-red-400" id="suspicious-file-entry">-rw-r--r-- 1 trainee trainee  1337 Dec 20 10:31 suspicious_file.txt</div>
                    <div id="command-prompt">user@cyberquest:~$ <span class="inline-block w-2 h-3.5 bg-green-400 animate-pulse">|</span></div>
                </div>
                <div class="flex items-center" id="terminal-input-area">
                    <span class="text-green-400 mr-2" id="input-prompt">user@cyberquest:~$ </span>
                    <input type="text" class="flex-1 bg-transparent border-none text-green-400 outline-none font-mono text-sm" placeholder="Type your command..." id="command-input">
                </div>
            </div>
        `;
    }
}
