export class NetworkMonitorApp {
    static createContent() {
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
}
