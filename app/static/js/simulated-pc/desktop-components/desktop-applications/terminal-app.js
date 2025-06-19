export class TerminalApp {
    static createContent() {
        return `
            <div class="h-full bg-black text-green-400 font-mono text-sm p-3 flex flex-col">
                <div class="flex-1 overflow-y-auto mb-3 space-y-1">
                    <div>user@cyberquest:~$ whoami</div>
                    <div>trainee</div>
                    <div>user@cyberquest:~$ ls -la</div>
                    <div>drwxr-xr-x 2 trainee trainee 4096 Dec 20 10:30 Documents</div>
                    <div>drwxr-xr-x 2 trainee trainee 4096 Dec 20 10:30 Downloads</div>
                    <div class="text-red-400">-rw-r--r-- 1 trainee trainee  1337 Dec 20 10:31 suspicious_file.txt</div>
                    <div>user@cyberquest:~$ <span class="inline-block w-2 h-3.5 bg-green-400 animate-pulse">|</span></div>
                </div>
                <div class="flex items-center">
                    <span class="text-green-400 mr-2">user@cyberquest:~$ </span>
                    <input type="text" class="flex-1 bg-transparent border-none text-green-400 outline-none font-mono text-sm" placeholder="Type your command...">
                </div>
            </div>
        `;
    }
}
