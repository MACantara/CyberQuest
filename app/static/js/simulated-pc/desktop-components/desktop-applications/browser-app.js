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
                    <button class="ml-auto px-2 py-1 bg-gray-700 hover:bg-gray-500 text-white rounded border border-gray-500 transition-colors duration-200 cursor-pointer" 
                            data-action="manage-bookmarks" title="Manage Bookmarks">
                        <i class="bi bi-gear text-xs"></i>
                    </button>
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

        // Manage bookmarks button
        const manageBtn = windowElement.querySelector('[data-action="manage-bookmarks"]');
        if (manageBtn) {
            manageBtn.addEventListener('click', () => {
                this.showBookmarksManager();
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

    showBookmarksManager() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-gray-800 border border-gray-600 rounded-lg p-6 max-w-lg mx-4">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-xl font-bold text-white">Bookmark Manager</h2>
                    <button onclick="this.closest('.fixed').remove()" 
                            class="text-gray-400 hover:text-white transition-colors">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
                
                <div class="space-y-3 mb-4">
                    <div class="bg-gray-700 rounded p-3">
                        <h3 class="text-green-400 font-medium mb-2">Safe Bookmarks</h3>
                        <div class="space-y-2 text-sm">
                            <div class="flex items-center justify-between text-gray-300">
                                <div class="flex items-center">
                                    <i class="bi bi-shield-check text-green-400 mr-2"></i>
                                    <span>CyberQuest Training</span>
                                </div>
                                <span class="text-xs text-gray-500">https://cyberquest.com</span>
                            </div>
                            <div class="flex items-center justify-between text-gray-300">
                                <div class="flex items-center">
                                    <i class="bi bi-bank text-blue-400 mr-2"></i>
                                    <span>Example Bank</span>
                                </div>
                                <span class="text-xs text-gray-500">https://example-bank.com</span>
                            </div>
                            <div class="flex items-center justify-between text-gray-300">
                                <div class="flex items-center">
                                    <i class="bi bi-newspaper text-gray-400 mr-2"></i>
                                    <span>Tech News Daily</span>
                                </div>
                                <span class="text-xs text-gray-500">https://news-site.com</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-red-900/30 border border-red-500/30 rounded p-3">
                        <h3 class="text-red-400 font-medium mb-2">⚠️ Training Examples (Dangerous)</h3>
                        <div class="space-y-2 text-sm">
                            <div class="flex items-center justify-between text-gray-300">
                                <div class="flex items-center">
                                    <i class="bi bi-exclamation-triangle text-red-400 mr-2"></i>
                                    <span>Suspicious Site</span>
                                </div>
                                <span class="text-xs text-gray-500">https://suspicious-site.com</span>
                            </div>
                            <div class="flex items-center justify-between text-gray-300">
                                <div class="flex items-center">
                                    <i class="bi bi-shield-x text-red-500 mr-2"></i>
                                    <span>Phishing Example</span>
                                </div>
                                <span class="text-xs text-gray-500">https://phishing-bank.com</span>
                            </div>
                        </div>
                        <div class="mt-2 text-xs text-red-300">
                            These are training examples of dangerous websites. In real life, never bookmark such sites!
                        </div>
                    </div>
                </div>
                
                <div class="text-sm text-gray-400 bg-gray-700 rounded p-3">
                    <strong>Training Tip:</strong> In a real browser, you should regularly review your bookmarks and remove any suspicious or unnecessary ones. Only bookmark trusted sites you frequently visit.
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
