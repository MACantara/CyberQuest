import { WindowBase } from '../window-base.js';

export class SecurityToolsApp extends WindowBase {
    constructor() {
        super('security', 'Security Tools', {
            width: '70%',
            height: '60%'
        });
    }

    createContent() {
        return `
            <div class="p-5 text-white">
                <h3 class="text-xl font-bold text-green-400 mb-6" id="security-tools-title">Security Analysis Tools</h3>
                <div class="grid grid-cols-2 gap-4 mb-6" id="security-tools-grid">
                    <button class="p-4 bg-gray-700 border border-gray-600 rounded hover:bg-gray-600 transition-colors duration-200 flex flex-col items-center space-y-2 cursor-pointer" id="antivirus-tool">
                        <i class="bi bi-shield-check text-2xl text-green-400"></i>
                        <span class="text-sm">Antivirus Scan</span>
                    </button>
                    <button class="p-4 bg-gray-700 border border-gray-600 rounded hover:bg-gray-600 transition-colors duration-200 flex flex-col items-center space-y-2 cursor-pointer" id="malware-detector">
                        <i class="bi bi-search text-2xl text-blue-400"></i>
                        <span class="text-sm">Malware Detector</span>
                    </button>
                    <button class="p-4 bg-gray-700 border border-gray-600 rounded hover:bg-gray-600 transition-colors duration-200 flex flex-col items-center space-y-2 cursor-pointer" id="network-scanner">
                        <i class="bi bi-graph-up text-2xl text-purple-400"></i>
                        <span class="text-sm">Network Scanner</span>
                    </button>
                    <button class="p-4 bg-gray-700 border border-gray-600 rounded hover:bg-gray-600 transition-colors duration-200 flex flex-col items-center space-y-2 cursor-pointer" id="encryption-tool">
                        <i class="bi bi-lock text-2xl text-yellow-400"></i>
                        <span class="text-sm">Encryption Tool</span>
                    </button>
                </div>
                <div id="scan-results-section">
                    <h4 class="text-lg font-semibold text-red-400 mb-3" id="scan-results-title">⚠️ Recent Scan Results</h4>
                    <div class="space-y-2" id="scan-results-list">
                        <div class="p-3 bg-yellow-900 bg-opacity-30 border-l-4 border-yellow-400 rounded" id="suspicious-file-result">
                            <div class="flex items-center">
                                <i class="bi bi-exclamation-triangle text-yellow-400 mr-2"></i>
                                <span class="text-sm">Suspicious file detected: suspicious_file.txt</span>
                            </div>
                        </div>
                        <div class="p-3 bg-red-900 bg-opacity-30 border-l-4 border-red-400 rounded" id="malware-result">
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
}
