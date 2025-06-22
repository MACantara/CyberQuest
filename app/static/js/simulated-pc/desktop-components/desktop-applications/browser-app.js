import { WindowBase } from '../window-base.js';
import { BrowserNavigation } from './browser-functions/navigation.js';
import { PageRenderer } from './browser-functions/page-renderer.js';
import { SecurityChecker } from './browser-functions/security-checker.js';

export class BrowserApp extends WindowBase {
    constructor() {
        super('browser', 'Web Browser', {
            width: '80%',
            height: '70%'
        });
        
        // Initialize browser components
        this.navigation = null;
        this.pageRenderer = null;
        this.securityChecker = null;
    }

    createContent() {
        return `
            <div class="h-full flex flex-col">
                <div class="bg-gray-700 p-2 border-b border-gray-600 flex items-center space-x-3">
                    <div class="flex space-x-1">
                        <button class="px-1.5 py-1 bg-gray-600 border border-gray-500 rounded text-white text-xs hover:bg-gray-500 transition-colors duration-200 cursor-pointer" 
                                data-action="back" title="Go Back">
                            <i class="bi bi-arrow-left"></i>
                        </button>
                        <button class="px-1.5 py-1 bg-gray-600 border border-gray-500 rounded text-white text-xs hover:bg-gray-500 transition-colors duration-200 cursor-pointer" 
                                data-action="forward" title="Go Forward">
                            <i class="bi bi-arrow-right"></i>
                        </button>
                        <button class="px-1.5 py-1 bg-gray-600 border border-gray-500 rounded text-white text-xs hover:bg-gray-500 transition-colors duration-200 cursor-pointer" 
                                data-action="refresh" title="Refresh Page">
                            <i class="bi bi-arrow-clockwise"></i>
                        </button>
                    </div>
                    <div class="flex-1 relative">
                        <input type="text" 
                               value="https://suspicious-site.com" 
                               class="w-full px-3 py-1 bg-black border border-gray-600 rounded text-white text-xs font-mono pr-8" 
                               id="browser-url-bar"
                               placeholder="Enter URL or search term..."
                               title="Address Bar">
                    </div>
                    <div class="flex space-x-1">
                        <button class="px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-xs hover:bg-gray-500 transition-colors duration-200 cursor-pointer" 
                                data-action="home" title="Home">
                            <i class="bi bi-house"></i>
                        </button>
                        <button class="px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-xs hover:bg-gray-500 transition-colors duration-200 cursor-pointer" 
                                data-action="bookmark" title="Bookmark">
                            <i class="bi bi-star"></i>
                        </button>
                    </div>
                </div>
                <div class="flex-1 overflow-auto bg-white" id="browser-content">
                    <div class="flex items-center justify-center h-full text-gray-500">
                        <div class="text-center">
                            <i class="bi bi-hourglass-split text-4xl mb-4 animate-spin"></i>
                            <p>Loading page...</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    initialize() {
        // Make browser app globally accessible for functions
        window.browserApp = this;
        
        // Initialize browser functionality
        this.navigation = new BrowserNavigation(this);
        this.pageRenderer = new PageRenderer(this);
        this.securityChecker = new SecurityChecker(this);
        
        // Initialize components
        this.navigation.initialize();
        
        // Bind additional events
        this.bindBrowserEvents();
        
        // Load initial page
        setTimeout(() => {
            this.loadInitialPage();
        }, 500);
    }

    bindBrowserEvents() {
        const windowElement = this.windowElement;
        if (!windowElement) return;

        // Home button
        const homeBtn = windowElement.querySelector('[data-action="home"]');
        if (homeBtn) {
            homeBtn.addEventListener('click', () => {
                this.navigation.navigateToUrl('https://cyberquest.com');
            });
        }

        // Bookmark button
        const bookmarkBtn = windowElement.querySelector('[data-action="bookmark"]');
        if (bookmarkBtn) {
            bookmarkBtn.addEventListener('click', () => {
                this.showBookmarks();
            });
        }

        // URL bar focus styling
        const urlBar = windowElement.querySelector('#browser-url-bar');
        if (urlBar) {
            urlBar.addEventListener('focus', () => {
                urlBar.select();
            });
        }
    }

    loadInitialPage() {
        const initialUrl = 'https://suspicious-site.com';
        this.pageRenderer.renderPage(initialUrl);
        this.securityChecker.runSecurityScan(initialUrl);
    }

    showBookmarks() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md mx-4">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-xl font-bold text-gray-900">Bookmarks</h2>
                    <button onclick="this.closest('.fixed').remove()" 
                            class="text-gray-500 hover:text-gray-700">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
                
                <div class="space-y-2">
                    <div class="bookmark-item p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer"
                         onclick="window.browserApp?.navigation.navigateToUrl('https://cyberquest.com'); this.closest('.fixed').remove()">
                        <div class="flex items-center">
                            <i class="bi bi-shield-check text-green-500 mr-3"></i>
                            <div>
                                <div class="font-medium">CyberQuest Training</div>
                                <div class="text-sm text-gray-600">https://cyberquest.com</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bookmark-item p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer"
                         onclick="window.browserApp?.navigation.navigateToUrl('https://example-bank.com'); this.closest('.fixed').remove()">
                        <div class="flex items-center">
                            <i class="bi bi-bank text-blue-500 mr-3"></i>
                            <div>
                                <div class="font-medium">Example Bank</div>
                                <div class="text-sm text-gray-600">https://example-bank.com</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bookmark-item p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer"
                         onclick="window.browserApp?.navigation.navigateToUrl('https://news-site.com'); this.closest('.fixed').remove()">
                        <div class="flex items-center">
                            <i class="bi bi-newspaper text-gray-600 mr-3"></i>
                            <div>
                                <div class="font-medium">Tech News Daily</div>
                                <div class="text-sm text-gray-600">https://news-site.com</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="mt-4 text-sm text-gray-500 text-center">
                    Click any bookmark to navigate to that site
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    cleanup() {
        // Clean up global reference
        if (window.browserApp === this) {
            window.browserApp = null;
        }
        
        // Clean up any modals
        const modals = document.querySelectorAll('.fixed.inset-0');
        modals.forEach(modal => {
            if (modal.innerHTML.includes('SECURITY ALERT') || 
                modal.innerHTML.includes('SCAM DETECTED') ||
                modal.innerHTML.includes('Bookmarks')) {
                modal.remove();
            }
        });
        
        super.cleanup();
    }
}
