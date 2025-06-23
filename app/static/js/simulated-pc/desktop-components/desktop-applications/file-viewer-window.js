import { WindowBase } from '../window-base.js';

export class FileViewerWindow extends WindowBase {
    constructor(fileName, fileData, fileContent) {
        super(`file-viewer-${fileName}`, `File Viewer - ${fileName}`, {
            width: '70%',
            height: '60%'
        });
        
        this.fileName = fileName;
        this.fileData = fileData;
        this.fileContent = fileContent;
    }

    createContent() {
        const isImage = this.isImageFile(this.fileName);
        const isPdf = this.fileName.toLowerCase().endsWith('.pdf');
        const isExecutable = this.fileName.toLowerCase().endsWith('.exe');
        const isSuspicious = this.fileData.suspicious;
        
        return `
            <div class="h-full flex flex-col bg-gray-800">
                <!-- File Info Header -->
                <div class="bg-gray-700 p-4 border-b border-gray-600 flex-shrink-0">
                    <div class="flex items-center space-x-3">
                        <i class="bi ${this.getFileIcon()} ${this.getFileIconColor()} text-2xl"></i>
                        <div>
                            <h3 class="text-white text-lg font-semibold">${this.fileName}</h3>
                            <p class="text-gray-400 text-sm">${this.fileData.size || 'Unknown size'} • Modified: ${this.fileData.modified || 'Unknown'}</p>
                        </div>
                    </div>
                    
                    ${isSuspicious ? this.createWarningBanner() : ''}
                </div>
                
                <!-- File Content Area -->
                <div class="flex-1 overflow-auto p-4">
                    ${this.createFileContentDisplay()}
                </div>
                
                <!-- Action Bar -->
                ${isExecutable ? this.createActionBar() : ''}
            </div>
        `;
    }

    getFileIcon() {
        const fileName = this.fileName.toLowerCase();
        
        if (this.isImageFile(fileName)) return 'bi-file-image';
        if (fileName.endsWith('.pdf')) return 'bi-file-pdf';
        if (fileName.endsWith('.exe')) return 'bi-file-binary';
        if (fileName.endsWith('.txt')) return 'bi-file-text';
        if (fileName.includes('bashrc') || fileName.endsWith('.sh')) return 'bi-file-code';
        
        return 'bi-file-text';
    }

    getFileIconColor() {
        if (this.fileData.suspicious) return 'text-red-400';
        
        const fileName = this.fileName.toLowerCase();
        
        if (this.isImageFile(fileName)) return 'text-green-400';
        if (fileName.endsWith('.pdf')) return 'text-red-400';
        if (fileName.endsWith('.exe')) return 'text-red-500';
        if (fileName.includes('bashrc') || fileName.endsWith('.sh')) return 'text-green-400';
        
        return 'text-gray-400';
    }

    createWarningBanner() {
        return `
            <div class="bg-red-900/30 border border-red-500/30 rounded p-3 mt-3">
                <div class="flex items-center space-x-2">
                    <i class="bi bi-exclamation-triangle text-red-400"></i>
                    <span class="text-red-300 font-semibold">Security Warning</span>
                </div>
                <p class="text-red-200 text-sm mt-1">This file has been flagged as potentially suspicious. Exercise caution when handling.</p>
            </div>
        `;
    }

    createFileContentDisplay() {
        const fileName = this.fileName.toLowerCase();
        
        if (fileName.endsWith('.pdf')) {
            return `
                <div class="bg-white p-6 rounded text-black min-h-96">
                    <div class="text-center mb-4">
                        <i class="bi bi-file-pdf text-red-500 text-6xl mb-2"></i>
                        <h4 class="text-lg font-semibold">PDF Document Preview</h4>
                    </div>
                    <pre class="whitespace-pre-wrap font-mono text-sm">${this.fileContent}</pre>
                </div>
            `;
        }
        
        if (fileName.endsWith('.exe')) {
            return `
                <div class="bg-gray-900 p-4 rounded border border-red-500">
                    <div class="text-center mb-4">
                        <i class="bi bi-file-binary text-red-500 text-6xl mb-2"></i>
                        <h4 class="text-red-400 text-lg font-semibold">Executable File</h4>
                        <p class="text-red-300 text-sm">This file cannot be safely displayed</p>
                    </div>
                    <div class="bg-black p-3 rounded max-h-96 overflow-auto">
                        <pre class="text-green-400 font-mono text-xs">${this.fileContent}</pre>
                    </div>
                </div>
            `;
        }
        
        if (this.isImageFile(fileName)) {
            return `
                <div class="text-center">
                    <div class="bg-gray-700 p-4 rounded inline-block">
                        <i class="bi bi-file-image text-green-400 text-6xl mb-2"></i>
                        <p class="text-gray-300">Image Preview</p>
                        <p class="text-gray-400 text-sm">Image files cannot be displayed in this simulation</p>
                    </div>
                </div>
            `;
        }
        
        // Default text file display
        return `
            <div class="bg-black p-4 rounded border border-gray-600">
                <pre class="text-green-400 font-mono text-sm whitespace-pre-wrap overflow-auto max-h-96">${this.fileContent}</pre>
            </div>
        `;
    }

    createActionBar() {
        return `
            <div class="bg-gray-700 p-3 border-t border-gray-600 flex justify-between items-center flex-shrink-0">
                <div class="flex items-center space-x-2 text-red-400 text-sm">
                    <i class="bi bi-shield-exclamation"></i>
                    <span>Executable file - Do not run in production</span>
                </div>
                <div class="flex space-x-2">
                    <button class="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors text-sm">
                        Properties
                    </button>
                    <button class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm">
                        Quarantine
                    </button>
                </div>
            </div>
        `;
    }

    isImageFile(fileName) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'];
        return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
    }

    initialize() {
        super.initialize();
        this.bindFileViewerEvents();
    }

    bindFileViewerEvents() {
        const windowElement = this.windowElement;
        if (!windowElement) return;

        // Bind action buttons if they exist
        const propertiesBtn = windowElement.querySelector('button:contains("Properties")');
        const quarantineBtn = windowElement.querySelector('button:contains("Quarantine")');

        if (quarantineBtn) {
            quarantineBtn.addEventListener('click', () => {
                this.showQuarantineDialog();
            });
        }
    }

    showQuarantineDialog() {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        overlay.innerHTML = `
            <div class="bg-gray-800 rounded-lg p-6 max-w-md mx-4">
                <div class="text-center">
                    <i class="bi bi-shield-exclamation text-yellow-400 text-4xl mb-3"></i>
                    <h3 class="text-white text-lg font-semibold mb-2">Quarantine File</h3>
                    <p class="text-gray-300 text-sm mb-4">
                        Are you sure you want to quarantine "${this.fileName}"? 
                        This will move the file to a secure location where it cannot be executed.
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
        
        // Close on escape key
        const handleKeyPress = (e) => {
            if (e.key === 'Escape') {
                overlay.remove();
                document.removeEventListener('keydown', handleKeyPress);
            }
        };
        document.addEventListener('keydown', handleKeyPress);
        
        // Close when clicking outside
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    }

    cleanup() {
        // Clean up any dialogs
        const dialogs = document.querySelectorAll('.fixed.inset-0');
        dialogs.forEach(dialog => {
            if (dialog.innerHTML && dialog.innerHTML.includes('Quarantine File')) {
                dialog.remove();
            }
        });
        
        super.cleanup();
    }
}
