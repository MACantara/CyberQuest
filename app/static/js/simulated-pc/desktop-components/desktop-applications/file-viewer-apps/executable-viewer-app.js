import { WindowBase } from '../../window-base.js';

export class ExecutableViewerApp extends WindowBase {
    constructor(fileName, fileData, fileContent) {
        super(`exe-viewer-${fileName}`, `Executable Analyzer - ${fileName}`, {
            width: '80%',
            height: '75%'
        });
        
        this.fileName = fileName;
        this.fileData = fileData;
        this.fileContent = fileContent;
        this.activeTab = 'overview';
    }

    createContent() {
        return `
            <div class="h-full flex flex-col bg-gray-800">
                <!-- Warning Header -->
                <div class="bg-red-900/30 border-b border-red-500/30 p-3">
                    <div class="flex items-center space-x-2">
                        <i class="bi bi-shield-exclamation text-red-400 text-xl"></i>
                        <div>
                            <span class="text-red-300 font-semibold">CAUTION: Executable File Analysis</span>
                            <p class="text-red-200 text-sm">This file could be malicious. Analysis is for training purposes only.</p>
                        </div>
                    </div>
                </div>
                
                <!-- Tab Navigation -->
                <div class="bg-gray-700 border-b border-gray-600 flex">
                    <button class="tab-btn px-4 py-2 text-sm ${this.activeTab === 'overview' ? 'bg-gray-600 text-white' : 'text-gray-300 hover:text-white'}" data-tab="overview">
                        <i class="bi bi-info-circle mr-1"></i>Overview
                    </button>
                    <button class="tab-btn px-4 py-2 text-sm ${this.activeTab === 'headers' ? 'bg-gray-600 text-white' : 'text-gray-300 hover:text-white'}" data-tab="headers">
                        <i class="bi bi-file-binary mr-1"></i>PE Headers
                    </button>
                    <button class="tab-btn px-4 py-2 text-sm ${this.activeTab === 'strings' ? 'bg-gray-600 text-white' : 'text-gray-300 hover:text-white'}" data-tab="strings">
                        <i class="bi bi-search mr-1"></i>Strings
                    </button>
                    <button class="tab-btn px-4 py-2 text-sm ${this.activeTab === 'security' ? 'bg-gray-600 text-white' : 'text-gray-300 hover:text-white'}" data-tab="security">
                        <i class="bi bi-shield-check mr-1"></i>Security
                    </button>
                </div>
                
                <!-- Tab Content -->
                <div class="flex-1 overflow-auto p-4">
                    <div id="tab-content">
                        ${this.renderTabContent()}
                    </div>
                </div>
                
                <!-- Action Bar -->
                <div class="bg-gray-700 p-3 border-t border-gray-600 flex justify-between items-center flex-shrink-0">
                    <div class="flex items-center space-x-2 text-red-400 text-sm">
                        <i class="bi bi-exclamation-triangle"></i>
                        <span>Do not execute this file in a production environment</span>
                    </div>
                    <div class="flex space-x-2">
                        <button class="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors text-sm" id="sandbox-btn">
                            Submit to Sandbox
                        </button>
                        <button class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm" id="quarantine-btn">
                            Quarantine
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderTabContent() {
        switch (this.activeTab) {
            case 'overview':
                return this.renderOverviewTab();
            case 'headers':
                return this.renderHeadersTab();
            case 'strings':
                return this.renderStringsTab();
            case 'security':
                return this.renderSecurityTab();
            default:
                return this.renderOverviewTab();
        }
    }

    renderOverviewTab() {
        return `
            <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- File Information -->
                    <div class="bg-gray-700 rounded p-4">
                        <h3 class="text-white font-semibold mb-3 flex items-center">
                            <i class="bi bi-file-binary text-red-400 mr-2"></i>
                            File Information
                        </h3>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span class="text-gray-400">Name:</span>
                                <span class="text-white">${this.fileName}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Size:</span>
                                <span class="text-white">${this.fileData.size || '2.0 KB'}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Type:</span>
                                <span class="text-red-400">PE32 Executable</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Architecture:</span>
                                <span class="text-white">x86</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Compiler:</span>
                                <span class="text-white">Microsoft Visual C++</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Security Assessment -->
                    <div class="bg-gray-700 rounded p-4">
                        <h3 class="text-white font-semibold mb-3 flex items-center">
                            <i class="bi bi-shield-exclamation text-yellow-400 mr-2"></i>
                            Security Assessment
                        </h3>
                        <div class="space-y-3">
                            <div class="flex items-center space-x-2">
                                <i class="bi bi-x-circle text-red-400"></i>
                                <span class="text-red-400 text-sm">No digital signature</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <i class="bi bi-exclamation-triangle text-yellow-400"></i>
                                <span class="text-yellow-400 text-sm">Suspicious strings detected</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <i class="bi bi-x-circle text-red-400"></i>
                                <span class="text-red-400 text-sm">Known malware signatures</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <i class="bi bi-check-circle text-green-400"></i>
                                <span class="text-green-400 text-sm">No packer detected</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Risk Analysis -->
                <div class="bg-red-900/20 border border-red-500/30 rounded p-4">
                    <h3 class="text-red-400 font-semibold mb-3">🚨 Risk Analysis</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <span class="text-gray-400">Threat Level:</span>
                            <span class="text-red-400 font-bold ml-2">HIGH</span>
                        </div>
                        <div>
                            <span class="text-gray-400">Malware Family:</span>
                            <span class="text-red-400 ml-2">Trojan.Generic</span>
                        </div>
                        <div>
                            <span class="text-gray-400">Confidence:</span>
                            <span class="text-red-400 ml-2">95%</span>
                        </div>
                    </div>
                    <p class="text-red-300 mt-3 text-sm">
                        This executable exhibits characteristics commonly associated with malware. 
                        It attempts to establish network connections and modify system settings.
                    </p>
                </div>
            </div>
        `;
    }

    renderHeadersTab() {
        // ...existing code for headers tab...
        return `
            <div class="space-y-4">
                <div class="bg-gray-700 rounded p-4">
                    <h3 class="text-white font-semibold mb-3">PE Header Information</h3>
                    <div class="font-mono text-sm space-y-1">
                        <div class="text-blue-400">DOS Header:</div>
                        <div class="text-gray-300 ml-4">Signature: MZ (0x5A4D)</div>
                        <div class="text-gray-300 ml-4">PE Offset: 0x000000F0</div>
                        
                        <div class="text-blue-400 mt-3">NT Headers:</div>
                        <div class="text-gray-300 ml-4">Signature: PE (0x00004550)</div>
                        <div class="text-gray-300 ml-4">Machine: IMAGE_FILE_MACHINE_I386</div>
                        <div class="text-gray-300 ml-4">Number of Sections: 4</div>
                        <div class="text-gray-300 ml-4">Timestamp: ${new Date().toLocaleString()}</div>
                        
                        <div class="text-blue-400 mt-3">Optional Header:</div>
                        <div class="text-gray-300 ml-4">Magic: PE32 (0x010B)</div>
                        <div class="text-gray-300 ml-4">Entry Point: 0x00001000</div>
                        <div class="text-gray-300 ml-4">Image Base: 0x00400000</div>
                        <div class="text-red-400 ml-4">⚠️ Suspicious Entry Point</div>
                    </div>
                </div>
            </div>
        `;
    }

    renderStringsTab() {
        // ...existing code for strings tab...
        return `
            <div class="space-y-4">
                <div class="bg-gray-700 rounded p-4">
                    <h3 class="text-white font-semibold mb-3">Extracted Strings</h3>
                    <div class="bg-black p-3 rounded font-mono text-sm max-h-96 overflow-y-auto">
                        <div class="text-green-400">Normal strings:</div>
                        <div class="text-gray-300 ml-2">kernel32.dll</div>
                        <div class="text-gray-300 ml-2">GetProcAddress</div>
                        
                        <div class="text-red-400 mt-3">⚠️ Suspicious strings:</div>
                        <div class="text-red-300 ml-2">keylogger.exe</div>
                        <div class="text-red-300 ml-2">password</div>
                        
                        <div class="text-yellow-400 mt-3">⚠️ Network indicators:</div>
                        <div class="text-yellow-300 ml-2">malicious-server.com</div>
                    </div>
                </div>
            </div>
        `;
    }

    renderSecurityTab() {
        // ...existing code for security tab...
        return `
            <div class="space-y-4">
                <!-- Threat Detection -->
                <div class="bg-red-900/20 border border-red-500/30 rounded p-4">
                    <h3 class="text-red-400 font-semibold mb-3">🚨 Threat Detection Results</h3>
                    <div class="space-y-3">
                        <div class="flex items-center justify-between p-2 bg-red-900/30 rounded">
                            <span class="text-red-300">Behavioral Analysis</span>
                            <span class="text-red-400 font-bold">MALICIOUS</span>
                        </div>
                        <div class="flex items-center justify-between p-2 bg-red-900/30 rounded">
                            <span class="text-red-300">Signature Match</span>
                            <span class="text-red-400 font-bold">DETECTED</span>
                        </div>
                    </div>
                </div>
                
                <!-- Recommendations -->
                <div class="bg-blue-900/20 border border-blue-500/30 rounded p-4">
                    <h3 class="text-blue-400 font-semibold mb-3">📋 Security Recommendations</h3>
                    <ul class="text-blue-300 text-sm space-y-2">
                        <li>• Immediately quarantine this file</li>
                        <li>• Scan the system for additional malware</li>
                        <li>• Check for network connections to malicious servers</li>
                        <li>• Review system logs for suspicious activity</li>
                    </ul>
                </div>
            </div>
        `;
    }

    initialize() {
        super.initialize();
        this.bindExecutableViewerEvents();
    }

    bindExecutableViewerEvents() {
        const windowElement = this.windowElement;
        if (!windowElement) return;

        // Tab switching
        const tabBtns = windowElement.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });

        // Action buttons
        const sandboxBtn = windowElement.querySelector('#sandbox-btn');
        const quarantineBtn = windowElement.querySelector('#quarantine-btn');

        if (sandboxBtn) {
            sandboxBtn.addEventListener('click', () => {
                this.showSandboxDialog();
            });
        }

        if (quarantineBtn) {
            quarantineBtn.addEventListener('click', () => {
                this.showQuarantineDialog();
            });
        }
    }

    switchTab(tabName) {
        this.activeTab = tabName;
        
        // Update tab appearance
        const tabBtns = this.windowElement?.querySelectorAll('.tab-btn');
        tabBtns?.forEach(btn => {
            if (btn.getAttribute('data-tab') === tabName) {
                btn.className = 'tab-btn px-4 py-2 text-sm bg-gray-600 text-white';
            } else {
                btn.className = 'tab-btn px-4 py-2 text-sm text-gray-300 hover:text-white';
            }
        });
        
        // Update content
        const tabContent = this.windowElement?.querySelector('#tab-content');
        if (tabContent) {
            tabContent.innerHTML = this.renderTabContent();
        }
    }

    showSandboxDialog() {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        overlay.innerHTML = `
            <div class="bg-gray-800 rounded-lg p-6 max-w-md mx-4">
                <div class="text-center">
                    <i class="bi bi-shield-check text-blue-400 text-4xl mb-3"></i>
                    <h3 class="text-white text-lg font-semibold mb-2">Submit to Sandbox</h3>
                    <p class="text-gray-300 text-sm mb-4">
                        This will submit "${this.fileName}" to a secure sandbox environment for analysis.
                    </p>
                    <button onclick="this.closest('.fixed').remove(); alert('File submitted to sandbox (simulation)');" 
                            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                        Submit
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    showQuarantineDialog() {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        overlay.innerHTML = `
            <div class="bg-gray-800 rounded-lg p-6 max-w-md mx-4">
                <div class="text-center">
                    <i class="bi bi-shield-exclamation text-red-400 text-4xl mb-3"></i>
                    <h3 class="text-white text-lg font-semibold mb-2">Quarantine Malware</h3>
                    <p class="text-gray-300 text-sm mb-4">
                        This action will move "${this.fileName}" to a secure quarantine location.
                    </p>
                    <div class="flex space-x-3">
                        <button onclick="this.closest('.fixed').remove()" 
                                class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
                            Cancel
                        </button>
                        <button onclick="this.closest('.fixed').remove(); alert('File quarantined successfully (simulation)');" 
                                class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
                            Quarantine
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }
}
