import { WindowBase } from '../../window-base.js';

export class TextViewerApp extends WindowBase {
    constructor(fileName, fileData, fileContent) {
        super(`text-viewer-${fileName}`, `Text Editor - ${fileName}`, {
            width: '70%',
            height: '60%'
        });
        
        this.fileName = fileName;
        this.fileData = fileData;
        this.fileContent = fileContent;
        this.isEditable = false;
    }

    createContent() {
        const isSuspicious = this.fileData.suspicious;
        const isConfig = this.fileName.includes('bashrc') || this.fileName.endsWith('.conf') || this.fileName.endsWith('.cfg');
        
        return `
            <div class="h-full flex flex-col bg-gray-800">
                <!-- Toolbar -->
                <div class="bg-gray-700 p-2 border-b border-gray-600 flex items-center justify-between flex-shrink-0">
                    <div class="flex items-center space-x-3">
                        <i class="bi bi-file-text ${this.getFileIconColor()} text-xl"></i>
                        <div>
                            <h3 class="text-white text-sm font-semibold">${this.fileName}</h3>
                            <p class="text-gray-400 text-xs">${this.fileData.size || 'Unknown size'} • ${this.getFileType()}</p>
                        </div>
                    </div>
                    
                    <div class="flex items-center space-x-2">
                        <button id="toggle-edit-btn" class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs cursor-pointer">
                            ${this.isEditable ? 'View Mode' : 'Edit Mode'}
                        </button>
                        <button id="word-wrap-btn" class="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors text-xs cursor-pointer">
                            Word Wrap
                        </button>
                    </div>
                </div>
                
                ${isSuspicious ? this.createWarningBanner() : ''}
                
                <!-- Content Area -->
                <div class="flex-1 relative overflow-hidden">
                    ${this.createTextEditor()}
                </div>
                
                <!-- Status Bar -->
                <div class="bg-gray-700 p-2 border-t border-gray-600 flex justify-between items-center text-xs text-gray-300 flex-shrink-0">
                    <div class="flex items-center space-x-4">
                        <span>Lines: ${this.getLineCount()}</span>
                        <span>Characters: ${this.fileContent.length}</span>
                        <span>Encoding: UTF-8</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        ${isConfig ? '<span class="text-yellow-400">⚠️ System Configuration File</span>' : ''}
                        ${isSuspicious ? '<span class="text-red-400">🚨 Suspicious Content</span>' : ''}
                    </div>
                </div>
            </div>
        `;
    }

    createWarningBanner() {
        return `
            <div class="bg-red-900/30 border-b border-red-500/30 p-3">
                <div class="flex items-center space-x-2">
                    <i class="bi bi-exclamation-triangle text-red-400"></i>
                    <span class="text-red-300 font-semibold">Security Warning</span>
                </div>
                <p class="text-red-200 text-sm mt-1">This file has been flagged as potentially suspicious. Exercise caution when editing.</p>
            </div>
        `;
    }

    createTextEditor() {
        return `
            <div class="h-full flex">
                <!-- Line Numbers -->
                <div class="bg-gray-900 border-r border-gray-600 p-2 text-gray-500 text-xs font-mono whitespace-pre select-none" id="line-numbers">
                    ${this.generateLineNumbers()}
                </div>
                
                <!-- Text Content -->
                <div class="flex-1 relative">
                    <textarea 
                        id="text-content" 
                        class="w-full h-full p-3 bg-black text-green-400 font-mono text-sm border-none outline-none resize-none"
                        readonly
                        spellcheck="false"
                        wrap="off"
                    >${this.fileContent}</textarea>
                </div>
            </div>
        `;
    }

    generateLineNumbers() {
        const lines = this.fileContent.split('\n');
        return lines.map((_, index) => (index + 1).toString().padStart(3, ' ')).join('\n');
    }

    getLineCount() {
        return this.fileContent.split('\n').length;
    }

    getFileType() {
        const ext = this.fileName.toLowerCase().split('.').pop();
        const types = {
            'txt': 'Plain Text',
            'log': 'Log File',
            'conf': 'Configuration',
            'cfg': 'Configuration',
            'ini': 'INI Configuration',
            'bashrc': 'Bash Configuration',
            'sh': 'Shell Script',
            'py': 'Python Script',
            'js': 'JavaScript',
            'json': 'JSON Data',
            'xml': 'XML Document',
            'html': 'HTML Document',
            'css': 'CSS Stylesheet',
            'md': 'Markdown'
        };
        return types[ext] || 'Text File';
    }

    getFileIconColor() {
        if (this.fileData.suspicious) return 'text-red-400';
        
        const fileName = this.fileName.toLowerCase();
        if (fileName.includes('bashrc') || fileName.endsWith('.sh')) return 'text-green-400';
        if (fileName.endsWith('.log')) return 'text-yellow-400';
        if (fileName.endsWith('.conf') || fileName.endsWith('.cfg')) return 'text-blue-400';
        
        return 'text-gray-400';
    }

    initialize() {
        super.initialize();
        this.bindTextViewerEvents();
        this.updateLineNumbers();
    }

    bindTextViewerEvents() {
        const windowElement = this.windowElement;
        if (!windowElement) return;

        const toggleEditBtn = windowElement.querySelector('#toggle-edit-btn');
        const wordWrapBtn = windowElement.querySelector('#word-wrap-btn');
        const textContent = windowElement.querySelector('#text-content');

        if (toggleEditBtn) {
            toggleEditBtn.addEventListener('click', () => {
                this.toggleEditMode();
            });
        }

        if (wordWrapBtn) {
            wordWrapBtn.addEventListener('click', () => {
                this.toggleWordWrap();
            });
        }

        if (textContent) {
            textContent.addEventListener('input', () => {
                this.updateLineNumbers();
            });

            textContent.addEventListener('scroll', () => {
                this.syncLineNumbers();
            });
        }
    }

    toggleEditMode() {
        this.isEditable = !this.isEditable;
        const textContent = this.windowElement?.querySelector('#text-content');
        const toggleBtn = this.windowElement?.querySelector('#toggle-edit-btn');

        if (textContent && toggleBtn) {
            textContent.readOnly = !this.isEditable;
            toggleBtn.textContent = this.isEditable ? 'View Mode' : 'Edit Mode';
            
            if (this.isEditable) {
                textContent.classList.add('text-white');
                textContent.classList.remove('text-green-400');
                this.showEditModeWarning();
            } else {
                textContent.classList.remove('text-white');
                textContent.classList.add('text-green-400');
            }
        }
    }

    toggleWordWrap() {
        const textContent = this.windowElement?.querySelector('#text-content');
        if (textContent) {
            const currentWrap = textContent.getAttribute('wrap');
            textContent.setAttribute('wrap', currentWrap === 'off' ? 'soft' : 'off');
        }
    }

    updateLineNumbers() {
        const textContent = this.windowElement?.querySelector('#text-content');
        const lineNumbers = this.windowElement?.querySelector('#line-numbers');
        
        if (textContent && lineNumbers) {
            const lines = textContent.value.split('\n');
            lineNumbers.textContent = lines.map((_, index) => 
                (index + 1).toString().padStart(3, ' ')
            ).join('\n');
        }
    }

    syncLineNumbers() {
        const textContent = this.windowElement?.querySelector('#text-content');
        const lineNumbers = this.windowElement?.querySelector('#line-numbers');
        
        if (textContent && lineNumbers) {
            lineNumbers.scrollTop = textContent.scrollTop;
        }
    }

    showEditModeWarning() {
        if (this.fileData.suspicious) {
            const overlay = document.createElement('div');
            overlay.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
            overlay.innerHTML = `
                <div class="bg-gray-800 rounded-lg p-6 max-w-md mx-4">
                    <div class="text-center">
                        <i class="bi bi-exclamation-triangle text-yellow-400 text-4xl mb-3"></i>
                        <h3 class="text-white text-lg font-semibold mb-2">Edit Mode Warning</h3>
                        <p class="text-gray-300 text-sm mb-4">
                            You are about to edit a suspicious file. Changes could affect system security.
                            This is a training environment, but in real scenarios, be extremely careful.
                        </p>
                        <div class="flex space-x-3">
                            <button onclick="this.closest('.fixed').remove()" 
                                    class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                                I Understand
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(overlay);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.remove();
                }
            }, 5000);
        }
    }

    cleanup() {
        // Remove any warning dialogs
        const warnings = document.querySelectorAll('.fixed.inset-0');
        warnings.forEach(warning => {
            if (warning.innerHTML && warning.innerHTML.includes('Edit Mode Warning')) {
                warning.remove();
            }
        });
        
        super.cleanup();
    }
}
