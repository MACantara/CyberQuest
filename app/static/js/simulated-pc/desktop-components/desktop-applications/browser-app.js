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
                                data-action="toggle-bookmarks" title="Toggle Bookmarks">
                            <i class="bi bi-star"></i>
                        </button>
                    </div>
                </div>
                
                <!-- Bookmarks Bar -->
                <div class="bg-gray-600 border-b border-gray-500 px-3 py-1.5 flex items-center space-x-2 text-xs" id="bookmarks-bar">
                    <span class="text-gray-300 font-medium mr-2">Bookmarks:</span>
                    <div class="flex space-x-1 overflow-x-auto">
                        <button class="bookmark-item px-2 py-1 bg-gray-700 hover:bg-gray-500 text-white rounded border border-gray-500 transition-colors duration-200 cursor-pointer flex items-center space-x-1 whitespace-nowrap" 
                                data-url="https://cyberquest.com" title="CyberQuest Training">
                            <i class="bi bi-shield-check text-green-400 text-xs"></i>
                            <span>CyberQuest</span>
                        </button>
                        <button class="bookmark-item px-2 py-1 bg-gray-700 hover:bg-gray-500 text-white rounded border border-gray-500 transition-colors duration-200 cursor-pointer flex items-center space-x-1 whitespace-nowrap" 
                                data-url="https://example-bank.com" title="Example Bank">
                            <i class="bi bi-bank text-blue-400 text-xs"></i>
                            <span>Example Bank</span>
                        </button>
                        <button class="bookmark-item px-2 py-1 bg-gray-700 hover:bg-gray-500 text-white rounded border border-gray-500 transition-colors duration-200 cursor-pointer flex items-center space-x-1 whitespace-nowrap" 
                                data-url="https://news-site.com" title="Tech News Daily">
                            <i class="bi bi-newspaper text-gray-400 text-xs"></i>
                            <span>Tech News</span>
                        </button>
                        <button class="bookmark-item px-2 py-1 bg-gray-700 hover:bg-red-400 text-white rounded border border-gray-500 transition-colors duration-200 cursor-pointer flex items-center space-x-1 whitespace-nowrap" 
                                data-url="https://suspicious-site.com" title="Suspicious Site (Training)">
                            <i class="bi bi-exclamation-triangle text-red-400 text-xs"></i>
                            <span>Suspicious Site</span>
                        </button>
                        <button class="bookmark-item px-2 py-1 bg-gray-700 hover:bg-red-500 text-white rounded border border-gray-500 transition-colors duration-200 cursor-pointer flex items-center space-x-1 whitespace-nowrap" 
                                data-url="https://phishing-bank.com" title="Phishing Site (Training)">
                            <i class="bi bi-shield-x text-red-500 text-xs"></i>
                            <span>Phishing Example</span>
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

        // Toggle bookmarks button
        const bookmarksBtn = windowElement.querySelector('[data-action="toggle-bookmarks"]');
        if (bookmarksBtn) {
            bookmarksBtn.addEventListener('click', () => {
                this.toggleBookmarksBar();
            });
        }

        // Bookmark item clicks
        const bookmarkItems = windowElement.querySelectorAll('.bookmark-item[data-url]');
        bookmarkItems.forEach(item => {
            item.addEventListener('click', () => {
                const url = item.getAttribute('data-url');
                if (url) {
                    this.navigation.navigateToUrl(url);
                }
            });
        });

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

    toggleBookmarksBar() {
        const bookmarksBar = this.windowElement?.querySelector('#bookmarks-bar');
        const toggleBtn = this.windowElement?.querySelector('[data-action="toggle-bookmarks"]');
        
        if (bookmarksBar && toggleBtn) {
            const isHidden = bookmarksBar.style.display === 'none';
            
            if (isHidden) {
                bookmarksBar.style.display = 'flex';
                toggleBtn.classList.add('bg-green-600');
                toggleBtn.classList.remove('bg-gray-600');
            } else {
                bookmarksBar.style.display = 'none';
                toggleBtn.classList.remove('bg-green-600');
                toggleBtn.classList.add('bg-gray-600');
            }
        }
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