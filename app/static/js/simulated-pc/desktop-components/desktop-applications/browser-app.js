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
                               class="w-full px-3 py-1 bg-gray-800 border border-gray-600 rounded text-white text-xs font-mono pl-8" 
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
                                data-url="https://securebank.com" title="SecureBank Online">
                            <i class="bi bi-bank text-blue-400 text-xs"></i>
                            <span>SecureBank</span>
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
                                data-url="https://secure-verify-support.com" title="Secure Verify Support">
                            <i class="bi bi-shield-x text-red-500 text-xs"></i>
                            <span>Secure Verify Support</span>
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

        // Setup dynamic security monitoring
        this.setupSecurityMonitoring();
    }

    setupSecurityMonitoring() {
        // Monitor URL changes and update security status
        const urlBar = this.windowElement?.querySelector('#browser-url-bar');
        if (urlBar) {
            urlBar.addEventListener('input', () => {
                // Debounce security checks
                clearTimeout(this.securityCheckTimeout);
                this.securityCheckTimeout = setTimeout(() => {
                    if (urlBar.value) {
                        this.updateSecurityStatus(urlBar.value);
                    }
                }, 500);
            });

            // Also check on focus/blur events
            urlBar.addEventListener('blur', () => {
                if (urlBar.value) {
                    this.updateSecurityStatus(urlBar.value);
                }
            });
        }
    }

    updateSecurityStatus(url) {
        if (this.securityChecker) {
            const securityCheck = this.securityChecker.runSecurityScan(url);
            
            // Update any open security popup
            if (this.securityChecker.securityPopup && this.securityChecker.securityPopup.isVisible) {
                this.securityChecker.securityPopup.refreshContent(securityCheck);
            }
            
            return securityCheck;
        }
    }

    loadInitialPage() {
        const initialUrl = 'https://suspicious-site.com';
        
        // Set the URL in the input field
        const urlBar = this.windowElement?.querySelector('#browser-url-bar');
        if (urlBar) {
            urlBar.value = initialUrl;
        }
        
        this.pageRenderer.renderPage(initialUrl);
        
        // Emit navigation event for network monitoring
        document.dispatchEvent(new CustomEvent('browser-navigate', {
            detail: { url: initialUrl }
        }));
        
        // Ensure security check runs after page render
        setTimeout(() => {
            this.updateSecurityStatus(initialUrl);
        }, 100);
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

    bindBrowserEvents() {
        const windowElement = this.windowElement;
        if (!windowElement) return;

        // Home button
        const homeBtn = windowElement.querySelector('[data-action="home"]');
        if (homeBtn) {
            homeBtn.addEventListener('click', () => {
                const url = 'https://cyberquest.com';
                this.navigation.navigateToUrl(url);
                // Emit navigation event
                document.dispatchEvent(new CustomEvent('browser-navigate', {
                    detail: { url: url }
                }));
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
                    // Emit navigation event
                    document.dispatchEvent(new CustomEvent('browser-navigate', {
                        detail: { url: url }
                    }));
                    // Update security status after navigation
                    setTimeout(() => this.updateSecurityStatus(url), 200);
                }
            });
        });

        // URL bar focus styling and security updates
        const urlBar = windowElement.querySelector('#browser-url-bar');
        if (urlBar) {
            urlBar.addEventListener('focus', () => {
                urlBar.select();
            });
            
            // Handle Enter key in URL bar
            urlBar.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const url = urlBar.value.trim();
                    if (url) {
                        // Add protocol if missing
                        const fullUrl = url.startsWith('http') ? url : `https://${url}`;
                        this.navigation.navigateToUrl(fullUrl);
                        // Emit navigation event
                        document.dispatchEvent(new CustomEvent('browser-navigate', {
                            detail: { url: fullUrl }
                        }));
                        setTimeout(() => this.updateSecurityStatus(fullUrl), 200);
                    }
                }
            });
        }
    }

    cleanup() {
        // Clear any pending security check timeouts
        if (this.securityCheckTimeout) {
            clearTimeout(this.securityCheckTimeout);
        }
        
        // Clean up global reference
        if (window.browserApp === this) {
            window.browserApp = null;
        }
        
        // Clean up only browser-specific modals and popups
        const browserModals = document.querySelectorAll('.security-popup');
        browserModals.forEach(modal => {
            if (modal.parentNode) {
                modal.remove();
            }
        });
        
        // Clean up browser-specific overlays
        const scamModals = document.querySelectorAll('.fixed.inset-0');
        scamModals.forEach(modal => {
            if (modal.innerHTML && (
                modal.innerHTML.includes('SCAM DETECTED') ||
                modal.innerHTML.includes('SECURITY WARNING')
            )) {
                modal.remove();
            }
        });
        
        // Clean up security popup specifically
        if (this.securityChecker && this.securityChecker.securityPopup) {
            this.securityChecker.securityPopup.hide();
        }
        
        super.cleanup();
    }
}