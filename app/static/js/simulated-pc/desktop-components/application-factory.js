export class ApplicationFactory {
    createBrowserContent() {
        return `
            <div class="h-full flex flex-col">
                <div class="bg-gray-700 p-2 border-b border-gray-600 flex items-center space-x-3">
                    <div class="flex space-x-1">
                        <button class="px-1.5 py-1 bg-gray-600 border border-gray-500 rounded text-white text-xs hover:bg-gray-500 transition-colors duration-200"><i class="bi bi-arrow-left"></i></button>
                        <button class="px-1.5 py-1 bg-gray-600 border border-gray-500 rounded text-white text-xs hover:bg-gray-500 transition-colors duration-200"><i class="bi bi-arrow-right"></i></button>
                        <button class="px-1.5 py-1 bg-gray-600 border border-gray-500 rounded text-white text-xs hover:bg-gray-500 transition-colors duration-200"><i class="bi bi-arrow-clockwise"></i></button>
                    </div>
                    <div class="flex-1">
                        <input type="text" value="https://suspicious-site.com" readonly class="w-full px-3 py-1 bg-black border border-gray-600 rounded text-white text-xs font-mono">
                    </div>
                </div>
                <div class="flex-1 overflow-auto bg-white">
                    <div class="p-5 text-center text-black">
                        <h2 class="text-2xl font-bold text-red-600 mb-4">🎉 CONGRATULATIONS! YOU'VE WON! 🎉</h2>
                        <p class="mb-4">Click here to claim your $1,000,000 prize!</p>
                        <button class="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-lg font-bold text-lg animate-pulse hover:scale-105 transition-transform duration-200">CLAIM NOW!</button>
                        <p class="text-sm text-gray-600 mt-2">* No catch, totally legitimate *</p>
                    </div>
                </div>
            </div>
        `;
    }

    createTerminalContent() {
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

    createFileManagerContent() {
        return `
            <div class="h-full flex flex-col bg-gray-800">
                <div class="bg-gray-700 p-2 border-b border-gray-600 flex items-center space-x-2">
                    <button class="px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-xs hover:bg-gray-500 transition-colors duration-200"><i class="bi bi-arrow-left"></i></button>
                    <button class="px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-xs hover:bg-gray-500 transition-colors duration-200"><i class="bi bi-arrow-right"></i></button>
                    <button class="px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-xs hover:bg-gray-500 transition-colors duration-200"><i class="bi bi-house"></i></button>
                    <div class="flex-1 px-3 py-1 bg-black border border-gray-600 rounded text-white text-xs font-mono">/home/trainee</div>
                </div>
                <div class="flex-1 p-3 grid grid-cols-4 gap-3 overflow-y-auto">
                    <div class="flex flex-col items-center p-3 rounded hover:bg-gray-700 cursor-pointer transition-colors duration-200">
                        <i class="bi bi-folder text-3xl text-blue-400 mb-2"></i>
                        <span class="text-xs text-white text-center">Documents</span>
                    </div>
                    <div class="flex flex-col items-center p-3 rounded hover:bg-gray-700 cursor-pointer transition-colors duration-200">
                        <i class="bi bi-folder text-3xl text-blue-400 mb-2"></i>
                        <span class="text-xs text-white text-center">Downloads</span>
                    </div>
                    <div class="flex flex-col items-center p-3 rounded hover:bg-gray-700 cursor-pointer transition-colors duration-200 border border-red-500 bg-red-900 bg-opacity-20">
                        <i class="bi bi-file-text text-3xl text-red-400 mb-2 animate-pulse"></i>
                        <span class="text-xs text-red-400 text-center">suspicious_file.txt</span>
                    </div>
                    <div class="flex flex-col items-center p-3 rounded hover:bg-gray-700 cursor-pointer transition-colors duration-200">
                        <i class="bi bi-file-text text-3xl text-gray-400 mb-2"></i>
                        <span class="text-xs text-white text-center">readme.txt</span>
                    </div>
                </div>
            </div>
        `;
    }

    createEmailContent() {
        return `
            <div class="h-full flex">
                <div class="w-48 bg-gray-700 border-r border-gray-600 p-3">
                    <div class="email-folder bg-green-400 text-black px-3 py-2 rounded text-sm font-medium mb-1 cursor-pointer">Inbox (3)</div>
                    <div class="email-folder px-3 py-2 text-gray-300 text-sm hover:bg-gray-600 rounded cursor-pointer transition-colors duration-200">Sent</div>
                    <div class="email-folder px-3 py-2 text-gray-300 text-sm hover:bg-gray-600 rounded cursor-pointer transition-colors duration-200">Trash</div>
                </div>
                <div class="flex-1 flex flex-col">
                    <div class="flex-1 overflow-y-auto">
                        <div class="email-item p-3 border-b border-gray-600 cursor-pointer hover:bg-gray-700 transition-colors duration-200 border-l-4 border-red-500 bg-red-900 bg-opacity-20">
                            <div class="font-medium text-white text-sm">prince.nigeria@totally-real.com</div>
                            <div class="text-gray-300 text-sm mb-1">URGENT: Claim Your Inheritance!</div>
                            <div class="text-gray-400 text-xs">2 min ago</div>
                        </div>
                        <div class="email-item p-3 border-b border-gray-600 cursor-pointer hover:bg-gray-700 transition-colors duration-200">
                            <div class="font-medium text-white text-sm">admin@cyberquest.com</div>
                            <div class="text-gray-300 text-sm mb-1">Welcome to CyberQuest Training</div>
                            <div class="text-gray-400 text-xs">1 hour ago</div>
                        </div>
                        <div class="email-item p-3 border-b border-gray-600 cursor-pointer hover:bg-gray-700 transition-colors duration-200">
                            <div class="font-medium text-white text-sm">noreply@bank.com</div>
                            <div class="text-gray-300 text-sm mb-1">Your account has been suspended</div>
                            <div class="text-gray-400 text-xs">3 hours ago</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createNetworkMonitorContent() {
        return `
            <div class="h-full flex flex-col bg-gray-900">
                <div class="bg-gray-700 p-2 border-b border-gray-600 flex space-x-2">
                    <button class="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors duration-200">Live Capture</button>
                    <button class="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-500 transition-colors duration-200">Filters</button>
                    <button class="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-500 transition-colors duration-200">Statistics</button>
                </div>
                <div class="flex-1 overflow-auto font-mono text-xs">
                    <div class="grid grid-cols-5 gap-2 p-2 bg-gray-800 border-b border-gray-600 font-bold text-gray-300">
                        <span>Time</span>
                        <span>Source</span>
                        <span>Destination</span>
                        <span>Protocol</span>
                        <span>Info</span>
                    </div>
                    <div class="grid grid-cols-5 gap-2 p-2 border-b border-gray-700 hover:bg-gray-800 transition-colors duration-200">
                        <span class="text-gray-400">10:30:45</span>
                        <span>192.168.1.100</span>
                        <span>8.8.8.8</span>
                        <span class="text-blue-400">DNS</span>
                        <span>Standard query A google.com</span>
                    </div>
                    <div class="grid grid-cols-5 gap-2 p-2 border-b border-gray-700 hover:bg-gray-800 transition-colors duration-200 bg-red-900 bg-opacity-20 border-l-4 border-red-500">
                        <span class="text-gray-400">10:30:47</span>
                        <span class="text-red-400">192.168.1.100</span>
                        <span class="text-red-400">malicious-site.com</span>
                        <span class="text-red-400">HTTP</span>
                        <span class="text-red-400">GET /malware.exe</span>
                    </div>
                    <div class="grid grid-cols-5 gap-2 p-2 border-b border-gray-700 hover:bg-gray-800 transition-colors duration-200">
                        <span class="text-gray-400">10:30:48</span>
                        <span>192.168.1.1</span>
                        <span>192.168.1.100</span>
                        <span class="text-green-400">TCP</span>
                        <span>ACK</span>
                    </div>
                </div>
            </div>
        `;
    }

    createSecurityToolsContent() {
        return `
            <div class="p-5 text-white">
                <h3 class="text-xl font-bold text-green-400 mb-6">Security Analysis Tools</h3>
                <div class="grid grid-cols-2 gap-4 mb-6">
                    <button class="p-4 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors duration-200 flex flex-col items-center space-y-2">
                        <i class="bi bi-shield-check text-2xl text-green-400"></i>
                        <span class="text-sm">Antivirus Scan</span>
                    </button>
                    <button class="p-4 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors duration-200 flex flex-col items-center space-y-2">
                        <i class="bi bi-search text-2xl text-blue-400"></i>
                        <span class="text-sm">Malware Detector</span>
                    </button>
                    <button class="p-4 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors duration-200 flex flex-col items-center space-y-2">
                        <i class="bi bi-graph-up text-2xl text-purple-400"></i>
                        <span class="text-sm">Network Scanner</span>
                    </button>
                    <button class="p-4 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors duration-200 flex flex-col items-center space-y-2">
                        <i class="bi bi-lock text-2xl text-yellow-400"></i>
                        <span class="text-sm">Encryption Tool</span>
                    </button>
                </div>
                <div>
                    <h4 class="text-lg font-semibold text-red-400 mb-3">⚠️ Recent Scan Results</h4>
                    <div class="space-y-2">
                        <div class="p-3 bg-yellow-900 bg-opacity-30 border-l-4 border-yellow-400 rounded">
                            <div class="flex items-center">
                                <i class="bi bi-exclamation-triangle text-yellow-400 mr-2"></i>
                                <span class="text-sm">Suspicious file detected: suspicious_file.txt</span>
                            </div>
                        </div>
                        <div class="p-3 bg-red-900 bg-opacity-30 border-l-4 border-red-400 rounded">
                            <div class="flex items-center">
                                <i class="bi bi-x-circle text-red-400 mr-2"></i>
                                <span class="text-sm">Malware found: /tmp/malware.exe</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createSystemLogsContent() {
        return `
            <div class="h-full flex flex-col bg-gray-900">
                <div class="bg-gray-700 p-2 border-b border-gray-600 flex items-center space-x-2">
                    <select class="px-2 py-1 bg-black border border-gray-600 rounded text-white text-xs">
                        <option>All Logs</option>
                        <option>Security</option>
                        <option>Network</option>
                        <option>System</option>
                    </select>
                    <button class="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-500 transition-colors duration-200">Refresh</button>
                </div>
                <div class="flex-1 overflow-auto font-mono text-xs">
                    <div class="grid grid-cols-4 gap-2 p-2 bg-gray-800 border-b border-gray-600 font-bold text-gray-300">
                        <span>Time</span>
                        <span>Level</span>
                        <span>Message</span>
                        <span>Source</span>
                    </div>
                    <div class="grid grid-cols-4 gap-2 p-2 border-b border-gray-700 hover:bg-gray-800 transition-colors duration-200">
                        <span class="text-gray-400">10:30:45</span>
                        <span class="px-2 py-1 bg-blue-600 text-white text-center rounded text-xs">INFO</span>
                        <span>System startup completed</span>
                        <span class="text-gray-400">system</span>
                    </div>
                    <div class="grid grid-cols-4 gap-2 p-2 border-b border-gray-700 hover:bg-gray-800 transition-colors duration-200">
                        <span class="text-gray-400">10:30:47</span>
                        <span class="px-2 py-1 bg-yellow-600 text-black text-center rounded text-xs">WARN</span>
                        <span>Suspicious network activity detected</span>
                        <span class="text-gray-400">security</span>
                    </div>
                    <div class="grid grid-cols-4 gap-2 p-2 border-b border-gray-700 hover:bg-gray-800 transition-colors duration-200">
                        <span class="text-gray-400">10:30:50</span>
                        <span class="px-2 py-1 bg-red-600 text-white text-center rounded text-xs">ERROR</span>
                        <span>Failed login attempt from 192.168.1.200</span>
                        <span class="text-gray-400">auth</span>
                    </div>
                </div>
            </div>
        `;
    }
}
