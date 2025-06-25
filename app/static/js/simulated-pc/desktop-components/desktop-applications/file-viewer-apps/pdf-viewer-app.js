import { WindowBase } from '../../window-base.js';

export class PdfViewerApp extends WindowBase {
    constructor(fileName, fileData, fileContent) {
        super(`pdf-viewer-${fileName}`, `PDF Viewer - ${fileName}`, {
            width: '75%',
            height: '70%'
        });
        
        this.fileName = fileName;
        this.fileData = fileData;
        this.fileContent = fileContent;
        this.currentPage = 1;
        this.totalPages = 3; // Simulated
        this.zoomLevel = 100;
    }

    createContent() {
        return `
            <div class="h-full flex flex-col bg-gray-800">
                <!-- PDF Toolbar -->
                <div class="bg-gray-700 p-2 border-b border-gray-600 flex items-center justify-between flex-shrink-0">
                    <div class="flex items-center space-x-3">
                        <i class="bi bi-file-pdf text-red-400 text-xl"></i>
                        <div>
                            <h3 class="text-white text-sm font-semibold">${this.fileName}</h3>
                            <p class="text-gray-400 text-xs">${this.fileData.size || 'Unknown size'} • PDF Document</p>
                        </div>
                    </div>
                    
                    <div class="flex items-center space-x-2">
                        <button id="zoom-out-btn" class="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors text-xs cursor-pointer">
                            <i class="bi bi-zoom-out"></i>
                        </button>
                        <span class="text-white text-xs min-w-12 text-center" id="zoom-level">${this.zoomLevel}%</span>
                        <button id="zoom-in-btn" class="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors text-xs cursor-pointer">
                            <i class="bi bi-zoom-in"></i>
                        </button>
                        <div class="w-px h-6 bg-gray-600 mx-2"></div>
                        <button id="prev-page-btn" class="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors text-xs cursor-pointer" ${this.currentPage <= 1 ? 'disabled' : ''}>
                            <i class="bi bi-chevron-left"></i>
                        </button>
                        <span class="text-white text-xs px-2" id="page-info">Page ${this.currentPage} of ${this.totalPages}</span>
                        <button id="next-page-btn" class="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors text-xs cursor-pointer" ${this.currentPage >= this.totalPages ? 'disabled' : ''}>
                            <i class="bi bi-chevron-right"></i>
                        </button>
                    </div>
                </div>
                
                <!-- PDF Content Area -->
                <div class="flex-1 overflow-auto bg-gray-600 p-4" id="pdf-content">
                    ${this.createPdfPages()}
                </div>
                
                <!-- Status Bar -->
                <div class="bg-gray-700 p-2 border-t border-gray-600 flex justify-between items-center text-xs text-gray-300 flex-shrink-0">
                    <div class="flex items-center space-x-4">
                        <span>PDF Document</span>
                        <span>Security: Standard</span>
                        <span>Version: 1.7</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <span>Adobe PDF Compatible</span>
                    </div>
                </div>
            </div>
        `;
    }

    createPdfPages() {
        return `
            <div class="max-w-4xl mx-auto">
                <div class="bg-white shadow-lg mb-4 p-8 mx-auto" style="width: 8.5in; min-height: 11in; transform: scale(${this.zoomLevel / 100});">
                    ${this.renderCurrentPage()}
                </div>
            </div>
        `;
    }

    renderCurrentPage() {
        switch (this.currentPage) {
            case 1:
                return this.renderPage1();
            case 2:
                return this.renderPage2();
            case 3:
                return this.renderPage3();
            default:
                return this.renderPage1();
        }
    }

    renderPage1() {
        return `
            <div class="text-black">
                <div class="text-center mb-8">
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">Cybersecurity Training Manual</h1>
                    <h2 class="text-xl text-gray-700 mb-4">Best Practices and Threat Recognition</h2>
                    <div class="w-16 h-1 bg-blue-500 mx-auto mb-8"></div>
                </div>
                
                <div class="mb-8">
                    <h3 class="text-lg font-semibold mb-4 text-blue-700">Table of Contents</h3>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between border-b border-gray-200 pb-1">
                            <span>1. Introduction to Cybersecurity</span>
                            <span>3</span>
                        </div>
                        <div class="flex justify-between border-b border-gray-200 pb-1">
                            <span>2. Phishing Attack Recognition</span>
                            <span>8</span>
                        </div>
                        <div class="flex justify-between border-b border-gray-200 pb-1">
                            <span>3. Email Security Best Practices</span>
                            <span>15</span>
                        </div>
                        <div class="flex justify-between border-b border-gray-200 pb-1">
                            <span>4. Web Browser Security</span>
                            <span>22</span>
                        </div>
                        <div class="flex justify-between border-b border-gray-200 pb-1">
                            <span>5. Incident Response Procedures</span>
                            <span>28</span>
                        </div>
                    </div>
                </div>
                
                <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                    <h4 class="font-semibold text-blue-800 mb-2">Training Objectives</h4>
                    <ul class="text-sm text-blue-700 space-y-1">
                        <li>• Identify common cybersecurity threats</li>
                        <li>• Recognize phishing attempts and social engineering</li>
                        <li>• Implement security best practices</li>
                        <li>• Respond appropriately to security incidents</li>
                    </ul>
                </div>
                
                <div class="absolute bottom-8 left-8 right-8 text-center text-xs text-gray-500">
                    <p>CyberQuest Training Platform • Confidential Training Material • Page 1 of 3</p>
                </div>
            </div>
        `;
    }

    renderPage2() {
        return `
            <div class="text-black">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">Chapter 2: Phishing Attack Recognition</h2>
                
                <div class="mb-6">
                    <h3 class="text-lg font-semibold mb-3 text-blue-700">Common Phishing Indicators</h3>
                    <div class="bg-red-50 border border-red-200 rounded p-4 mb-4">
                        <h4 class="font-semibold text-red-800 mb-2">🚨 Red Flags to Watch For:</h4>
                        <ul class="text-sm text-red-700 space-y-2">
                            <li>• <strong>Urgent language:</strong> "Act now or lose access!"</li>
                            <li>• <strong>Suspicious sender:</strong> Mismatched email domains</li>
                            <li>• <strong>Generic greetings:</strong> "Dear Customer" instead of your name</li>
                            <li>• <strong>Suspicious links:</strong> Hover to check destination URLs</li>
                            <li>• <strong>Unexpected attachments:</strong> Especially executable files</li>
                        </ul>
                    </div>
                </div>
                
                <div class="mb-6">
                    <h3 class="text-lg font-semibold mb-3 text-green-700">Example: Legitimate vs. Phishing Email</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="border border-green-200 rounded p-3">
                            <h4 class="font-medium text-green-800 mb-2">✅ Legitimate</h4>
                            <div class="text-xs bg-white p-2 rounded border">
                                <p><strong>From:</strong> security@yourbank.com</p>
                                <p><strong>Subject:</strong> Monthly Security Update</p>
                                <p class="mt-2">Dear John Smith,<br>
                                Your account is secure. Review our monthly security report in your dashboard.</p>
                            </div>
                        </div>
                        <div class="border border-red-200 rounded p-3">
                            <h4 class="font-medium text-red-800 mb-2">❌ Phishing</h4>
                            <div class="text-xs bg-white p-2 rounded border">
                                <p><strong>From:</strong> security@your-bank-security.com</p>
                                <p><strong>Subject:</strong> URGENT: Account Suspended!</p>
                                <p class="mt-2">Dear Customer,<br>
                                Click here immediately to prevent account closure!</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="absolute bottom-8 left-8 right-8 text-center text-xs text-gray-500">
                    <p>CyberQuest Training Platform • Confidential Training Material • Page 2 of 3</p>
                </div>
            </div>
        `;
    }

    renderPage3() {
        return `
            <div class="text-black">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">Chapter 5: Incident Response Procedures</h2>
                
                <div class="mb-6">
                    <h3 class="text-lg font-semibold mb-3 text-blue-700">Step-by-Step Response</h3>
                    <div class="space-y-4">
                        <div class="flex items-start space-x-3">
                            <div class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                            <div>
                                <h4 class="font-medium">Immediate Assessment</h4>
                                <p class="text-sm text-gray-600">Determine the scope and nature of the security incident</p>
                            </div>
                        </div>
                        <div class="flex items-start space-x-3">
                            <div class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                            <div>
                                <h4 class="font-medium">Containment</h4>
                                <p class="text-sm text-gray-600">Isolate affected systems to prevent further damage</p>
                            </div>
                        </div>
                        <div class="flex items-start space-x-3">
                            <div class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                            <div>
                                <h4 class="font-medium">Documentation</h4>
                                <p class="text-sm text-gray-600">Record all details of the incident and response actions</p>
                            </div>
                        </div>
                        <div class="flex items-start space-x-3">
                            <div class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                            <div>
                                <h4 class="font-medium">Recovery</h4>
                                <p class="text-sm text-gray-600">Restore systems and verify security integrity</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="bg-yellow-50 border border-yellow-200 rounded p-4">
                    <h4 class="font-semibold text-yellow-800 mb-2">📞 Emergency Contacts</h4>
                    <div class="text-sm text-yellow-700">
                        <p><strong>IT Security Team:</strong> ext. 2911</p>
                        <p><strong>Security Operations Center:</strong> ext. 2400</p>
                        <p><strong>External Hotline:</strong> 1-800-CYBER-HELP</p>
                    </div>
                </div>
                
                <div class="absolute bottom-8 left-8 right-8 text-center text-xs text-gray-500">
                    <p>CyberQuest Training Platform • Confidential Training Material • Page 3 of 3</p>
                </div>
            </div>
        `;
    }

    initialize() {
        super.initialize();
        this.bindPdfViewerEvents();
    }

    bindPdfViewerEvents() {
        const windowElement = this.windowElement;
        if (!windowElement) return;

        const zoomInBtn = windowElement.querySelector('#zoom-in-btn');
        const zoomOutBtn = windowElement.querySelector('#zoom-out-btn');
        const prevPageBtn = windowElement.querySelector('#prev-page-btn');
        const nextPageBtn = windowElement.querySelector('#next-page-btn');

        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => this.zoomIn());
        }

        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => this.zoomOut());
        }

        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', () => this.previousPage());
        }

        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', () => this.nextPage());
        }
    }

    zoomIn() {
        if (this.zoomLevel < 200) {
            this.zoomLevel += 25;
            this.updateZoom();
        }
    }

    zoomOut() {
        if (this.zoomLevel > 50) {
            this.zoomLevel -= 25;
            this.updateZoom();
        }
    }

    updateZoom() {
        const zoomLevelSpan = this.windowElement?.querySelector('#zoom-level');
        const pdfContent = this.windowElement?.querySelector('#pdf-content');
        
        if (zoomLevelSpan) {
            zoomLevelSpan.textContent = `${this.zoomLevel}%`;
        }
        
        if (pdfContent) {
            pdfContent.innerHTML = this.createPdfPages();
        }
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updatePage();
        }
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.updatePage();
        }
    }

    updatePage() {
        const pageInfo = this.windowElement?.querySelector('#page-info');
        const prevBtn = this.windowElement?.querySelector('#prev-page-btn');
        const nextBtn = this.windowElement?.querySelector('#next-page-btn');
        const pdfContent = this.windowElement?.querySelector('#pdf-content');
        
        if (pageInfo) {
            pageInfo.textContent = `Page ${this.currentPage} of ${this.totalPages}`;
        }
        
        if (prevBtn) {
            prevBtn.disabled = this.currentPage <= 1;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentPage >= this.totalPages;
        }
        
        if (pdfContent) {
            pdfContent.innerHTML = this.createPdfPages();
        }
    }
}
