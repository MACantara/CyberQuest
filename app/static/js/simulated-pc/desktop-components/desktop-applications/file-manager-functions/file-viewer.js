export class FileViewer {
    constructor(fileManagerApp) {
        this.fileManagerApp = fileManagerApp;
        this.activeViewer = null;
    }

    openFile(fileName, fileData) {
        this.closeViewer();
        
        const viewer = document.createElement('div');
        viewer.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
        viewer.innerHTML = this.createViewerContent(fileName, fileData);
        
        document.body.appendChild(viewer);
        this.activeViewer = viewer;
        
        this.bindViewerEvents();
    }

    createViewerContent(fileName, fileData) {
        const isImage = this.isImageFile(fileName);
        const isPdf = fileName.toLowerCase().endsWith('.pdf');
        const isExecutable = fileName.toLowerCase().endsWith('.exe');
        const isSuspicious = fileData.suspicious;
        
        let iconClass = 'bi-file-text';
        let iconColor = 'text-gray-400';
        
        if (isImage) {
            iconClass = 'bi-file-image';
            iconColor = 'text-green-400';
        } else if (isPdf) {
            iconClass = 'bi-file-pdf';
            iconColor = 'text-red-400';
        } else if (isExecutable) {
            iconClass = 'bi-file-binary';
            iconColor = 'text-red-500';
        }
        
        if (isSuspicious) {
            iconColor = 'text-red-400';
        }

        return `
            <div class="bg-gray-800 rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
                <div class="flex items-center justify-between p-4 border-b border-gray-600">
                    <div class="flex items-center space-x-3">
                        <i class="bi ${iconClass} ${iconColor} text-2xl"></i>
                        <div>
                            <h3 class="text-white text-lg font-semibold">${fileName}</h3>
                            <p class="text-gray-400 text-sm">${fileData.size || 'Unknown size'} • Modified: ${fileData.modified || 'Unknown'}</p>
                        </div>
                    </div>
                    <button onclick="this.closest('.fixed').remove()" 
                            class="text-gray-400 hover:text-white transition-colors text-xl cursor-pointer p-2">
                        <i class="bi bi-x"></i>
                    </button>
                </div>
                
                ${isSuspicious ? this.createWarningSection() : ''}
                
                <div class="flex-1 overflow-auto p-4">
                    ${this.createFileContent(fileName, fileData)}
                </div>
                
                <div class="p-4 border-t border-gray-600 flex justify-end space-x-2">
                    ${isExecutable ? this.createExecutableWarning() : ''}
                    <button onclick="this.closest('.fixed').remove()" 
                            class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        `;
    }

    createWarningSection() {
        return `
            <div class="bg-red-900/30 border-t border-b border-red-500/30 p-3">
                <div class="flex items-center space-x-2">
                    <i class="bi bi-exclamation-triangle text-red-400"></i>
                    <span class="text-red-300 font-semibold">Security Warning</span>
                </div>
                <p class="text-red-200 text-sm mt-1">This file has been flagged as potentially suspicious. Exercise caution when handling.</p>
            </div>
        `;
    }

    createExecutableWarning() {
        return `
            <div class="flex items-center space-x-2 text-red-400 text-sm mr-4">
                <i class="bi bi-shield-exclamation"></i>
                <span>Executable file - Do not run in production</span>
            </div>
        `;
    }

    createFileContent(fileName, fileData) {
        const content = this.fileManagerApp.navigator.getFileContent(fileName);
        
        if (fileName.toLowerCase().endsWith('.pdf')) {
            return `
                <div class="bg-white p-6 rounded text-black min-h-96">
                    <div class="text-center mb-4">
                        <i class="bi bi-file-pdf text-red-500 text-6xl mb-2"></i>
                        <h4 class="text-lg font-semibold">PDF Document Preview</h4>
                    </div>
                    <pre class="whitespace-pre-wrap font-mono text-sm">${content}</pre>
                </div>
            `;
        }
        
        if (fileName.toLowerCase().endsWith('.exe')) {
            return `
                <div class="bg-gray-900 p-4 rounded border border-red-500">
                    <div class="text-center mb-4">
                        <i class="bi bi-file-binary text-red-500 text-6xl mb-2"></i>
                        <h4 class="text-red-400 text-lg font-semibold">Executable File</h4>
                        <p class="text-red-300 text-sm">This file cannot be safely displayed</p>
                    </div>
                    <div class="bg-black p-3 rounded">
                        <pre class="text-green-400 font-mono text-xs">${content}</pre>
                    </div>
                </div>
            `;
        }
        
        return `
            <div class="bg-black p-4 rounded">
                <pre class="text-green-400 font-mono text-sm whitespace-pre-wrap">${content}</pre>
            </div>
        `;
    }

    isImageFile(fileName) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'];
        return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
    }

    bindViewerEvents() {
        if (!this.activeViewer) return;
        
        // Close on escape key
        const handleKeyPress = (e) => {
            if (e.key === 'Escape') {
                this.closeViewer();
                document.removeEventListener('keydown', handleKeyPress);
            }
        };
        
        document.addEventListener('keydown', handleKeyPress);
        
        // Close when clicking outside content
        this.activeViewer.addEventListener('click', (e) => {
            if (e.target === this.activeViewer) {
                this.closeViewer();
            }
        });
    }

    closeViewer() {
        if (this.activeViewer && this.activeViewer.parentNode) {
            this.activeViewer.remove();
            this.activeViewer = null;
        }
    }
}
