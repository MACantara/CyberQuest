import { WindowBase } from '../window-base.js';
import { FileNavigator } from './file-manager-functions/file-navigator.js';
import { FileViewer } from './file-manager-functions/file-viewer.js';

export class FileManagerApp extends WindowBase {
    constructor() {
        super('files', 'File Manager', {
            width: '75%',
            height: '65%'
        });
        
        this.navigator = null;
        this.fileViewer = null;
        this.showHidden = false;
    }

    createContent() {
        return `
            <div class="h-full flex flex-col bg-gray-800">
                <div class="bg-gray-700 p-2 border-b border-gray-600 flex items-center space-x-2 flex-shrink-0" id="file-toolbar">
                    <button class="px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-xs hover:bg-gray-500 transition-colors duration-200 cursor-pointer" id="back-btn"><i class="bi bi-arrow-left"></i></button>
                    <button class="px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-xs hover:bg-gray-500 transition-colors duration-200 cursor-pointer" id="forward-btn"><i class="bi bi-arrow-right"></i></button>
                    <button class="px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-xs hover:bg-gray-500 transition-colors duration-200 cursor-pointer" id="home-btn"><i class="bi bi-house"></i></button>
                    <div class="flex-1 px-3 py-1 bg-black border border-gray-600 rounded text-white text-xs font-mono" id="address-bar">/home/trainee</div>
                </div>
                <div class="flex-1 p-4 overflow-y-auto" id="file-grid">
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-max">
                        <div class="flex flex-col items-center p-3 rounded hover:bg-gray-700 cursor-pointer transition-colors duration-200 max-w-24" id="documents-folder">
                            <i class="bi bi-folder text-4xl text-blue-400 mb-2 max-h-12 flex items-center justify-center"></i>
                            <span class="text-xs text-white text-center break-words leading-tight">Documents</span>
                        </div>
                        <div class="flex flex-col items-center p-3 rounded hover:bg-gray-700 cursor-pointer transition-colors duration-200 max-w-24" id="downloads-folder">
                            <i class="bi bi-folder text-4xl text-blue-400 mb-2 max-h-12 flex items-center justify-center"></i>
                            <span class="text-xs text-white text-center break-words leading-tight">Downloads</span>
                        </div>
                        <div class="flex flex-col items-center p-3 rounded hover:bg-gray-700 cursor-pointer transition-colors duration-200 border border-red-500 bg-red-900 bg-opacity-20 max-w-24" id="suspicious-file">
                            <i class="bi bi-file-text text-4xl text-red-400 mb-2 animate-pulse max-h-12 flex items-center justify-center"></i>
                            <span class="text-xs text-red-400 text-center break-words leading-tight">suspicious_file.txt</span>
                        </div>
                        <div class="flex flex-col items-center p-3 rounded hover:bg-gray-700 cursor-pointer transition-colors duration-200 max-w-24" id="readme-file">
                            <i class="bi bi-file-text text-4xl text-gray-400 mb-2 max-h-12 flex items-center justify-center"></i>
                            <span class="text-xs text-white text-center break-words leading-tight">readme.txt</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    initialize() {
        super.initialize();
        
        this.navigator = new FileNavigator(this);
        this.fileViewer = new FileViewer(this);
        
        this.bindEvents();
        this.renderDirectory();
    }

    bindEvents() {
        const windowElement = this.windowElement;
        if (!windowElement) return;

        // Navigation buttons
        const backBtn = windowElement.querySelector('#back-btn');
        const forwardBtn = windowElement.querySelector('#forward-btn');
        const homeBtn = windowElement.querySelector('#home-btn');

        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.navigator.goBack();
            });
        }

        if (forwardBtn) {
            forwardBtn.addEventListener('click', () => {
                this.navigator.goForward();
            });
        }

        if (homeBtn) {
            homeBtn.addEventListener('click', () => {
                this.navigator.goHome();
            });
        }

        // Keyboard shortcuts
        windowElement.addEventListener('keydown', (e) => {
            if (e.ctrlKey) {
                switch (e.key) {
                    case 'h':
                        e.preventDefault();
                        this.toggleHiddenFiles();
                        break;
                    case 'r':
                        e.preventDefault();
                        this.renderDirectory();
                        break;
                }
            } else {
                switch (e.key) {
                    case 'Backspace':
                        e.preventDefault();
                        this.navigator.navigateUp();
                        break;
                    case 'F5':
                        e.preventDefault();
                        this.renderDirectory();
                        break;
                }
            }
        });
    }

    renderDirectory() {
        const fileGrid = this.windowElement?.querySelector('#file-grid');
        if (!fileGrid) return;

        const items = this.navigator.getVisibleItems(this.showHidden);
        
        fileGrid.innerHTML = `
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-max">
                ${items.map(item => this.createFileItemHTML(item)).join('')}
            </div>
        `;

        this.bindFileEvents();
    }

    createFileItemHTML(item) {
        const suspiciousClass = item.suspicious ? 'border border-red-500 bg-red-900 bg-opacity-20' : '';
        const animationClass = item.suspicious ? 'animate-pulse' : '';
        
        // Generate unique ID based on item name for tutorial targeting
        const itemId = item.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-') + 
                      (item.type === 'directory' ? '-folder' : '-file');
        
        return `
            <div class="flex flex-col items-center p-3 rounded hover:bg-gray-700 cursor-pointer transition-colors duration-200 max-w-24 ${suspiciousClass}" 
                 id="${itemId}"
                 data-name="${item.name}" 
                 data-type="${item.type}"
                 title="${item.name}${item.size ? ' (' + item.size + ')' : ''}">
                <i class="bi ${item.icon} text-4xl ${item.color} mb-2 max-h-12 flex items-center justify-center ${animationClass}"></i>
                <span class="text-xs ${item.suspicious ? 'text-red-400' : 'text-white'} text-center break-words leading-tight">${item.name}</span>
            </div>
        `;
    }

    bindFileEvents() {
        const fileItems = this.windowElement?.querySelectorAll('[data-name]');
        if (!fileItems) return;

        fileItems.forEach(item => {
            item.addEventListener('dblclick', () => {
                const name = item.getAttribute('data-name');
                const type = item.getAttribute('data-type');
                
                if (type === 'directory') {
                    this.openDirectory(name);
                } else {
                    this.openFile(name);
                }
            });

            item.addEventListener('click', (e) => {
                if (e.detail === 1) { // Single click
                    this.selectItem(item);
                }
            });
        });
    }

    selectItem(item) {
        // Remove previous selection
        const selected = this.windowElement?.querySelector('.bg-blue-600');
        if (selected) {
            selected.classList.remove('bg-blue-600', 'bg-opacity-50');
        }
        
        // Select new item
        item.classList.add('bg-blue-600', 'bg-opacity-50');
    }

    openDirectory(dirName) {
        const newPath = `${this.navigator.currentPath}/${dirName}`;
        this.navigator.navigateTo(newPath);
    }

    openFile(fileName) {
        const items = this.navigator.getVisibleItems(this.showHidden);
        const fileData = items.find(item => item.name === fileName);
        
        if (fileData) {
            // Emit file access event for system logs
            document.dispatchEvent(new CustomEvent('file-accessed', {
                detail: { 
                    fileName, 
                    path: this.navigator.currentPath,
                    action: 'accessed'
                }
            }));

            // Check if file is suspicious and emit security event
            if (fileData.suspicious) {
                document.dispatchEvent(new CustomEvent('suspicious-file-detected', {
                    detail: { 
                        fileName, 
                        reason: 'File marked as suspicious',
                        action: 'User accessed suspicious file'
                    }
                }));
            }

            // Emit file open event with type information
            document.dispatchEvent(new CustomEvent('file-opened', {
                detail: { 
                    fileName, 
                    fileType: fileData.type || 'unknown',
                    suspicious: fileData.suspicious || false
                }
            }));

            this.fileViewer.openFile(fileName, fileData);
        }
    }

    updateAddressBar(path) {
        const addressBar = this.windowElement?.querySelector('#address-bar');
        if (addressBar) {
            addressBar.textContent = path;
        }
    }

    updateNavigationButtons() {
        const backBtn = this.windowElement?.querySelector('#back-btn');
        const forwardBtn = this.windowElement?.querySelector('#forward-btn');

        if (backBtn) {
            backBtn.disabled = !this.navigator.canGoBack();
            backBtn.classList.toggle('opacity-50', !this.navigator.canGoBack());
        }

        if (forwardBtn) {
            forwardBtn.disabled = !this.navigator.canGoForward();
            forwardBtn.classList.toggle('opacity-50', !this.navigator.canGoForward());
        }
    }

    toggleHiddenFiles() {
        this.showHidden = !this.showHidden;
        this.renderDirectory();
    }

    cleanup() {
        super.cleanup();
    }
}
