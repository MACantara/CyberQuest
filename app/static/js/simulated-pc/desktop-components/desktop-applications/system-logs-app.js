import { WindowBase } from '../window-base.js';

export class SystemLogsApp extends WindowBase {
    constructor() {
        super('logs', 'System Logs', {
            width: '75%',
            height: '65%'
        });
    }

    createContent() {
        return `
            <div class="h-full flex flex-col bg-gray-900">
                <div class="bg-gray-700 p-2 border-b border-gray-600 flex items-center space-x-2" id="logs-toolbar">
                    <select class="px-2 py-1 bg-black border border-gray-600 rounded text-white text-xs cursor-pointer" id="log-filter">
                        <option>All Logs</option>
                        <option>Security</option>
                        <option>Network</option>
                        <option>System</option>
                    </select>
                    <button class="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-500 transition-colors duration-200 cursor-pointer" id="refresh-btn">Refresh</button>
                </div>
                <div class="flex-1 overflow-auto font-mono text-xs" id="logs-container">
                    <div class="grid grid-cols-4 gap-2 p-2 bg-gray-800 border-b border-gray-600 font-bold text-gray-300" id="log-headers">
                        <span>Time</span>
                        <span>Level</span>
                        <span>Message</span>
                        <span>Source</span>
                    </div>
                    <div class="grid grid-cols-4 gap-2 p-2 border-b border-gray-700 hover:bg-gray-800 transition-colors duration-200" id="info-log">
                        <span class="text-gray-400">10:30:45</span>
                        <span class="px-2 py-1 bg-blue-600 text-white text-center rounded text-xs">INFO</span>
                        <span>System startup completed</span>
                        <span class="text-gray-400">system</span>
                    </div>
                    <div class="grid grid-cols-4 gap-2 p-2 border-b border-gray-700 hover:bg-gray-800 transition-colors duration-200" id="warning-log">
                        <span class="text-gray-400">10:30:47</span>
                        <span class="px-2 py-1 bg-yellow-600 text-black text-center rounded text-xs">WARN</span>
                        <span>Suspicious network activity detected</span>
                        <span class="text-gray-400">security</span>
                    </div>
                    <div class="grid grid-cols-4 gap-2 p-2 border-b border-gray-700 hover:bg-gray-800 transition-colors duration-200" id="error-log">
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
