export class BrowserNavigation {
    constructor(browserApp) {
        this.browserApp = browserApp;
        this.history = ['https://suspicious-site.com'];
        this.currentIndex = 0;
        this.isLoading = false;
    }

    initialize() {
        this.bindNavigationEvents();
        this.updateNavigationButtons();
    }

    bindNavigationEvents() {
        const windowElement = this.browserApp.windowElement;
        if (!windowElement) return;

        // Back button
        const backBtn = windowElement.querySelector('[data-action="back"]');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.goBack());
        }

        // Forward button
        const forwardBtn = windowElement.querySelector('[data-action="forward"]');
        if (forwardBtn) {
            forwardBtn.addEventListener('click', () => this.goForward());
        }

        // Refresh button
        const refreshBtn = windowElement.querySelector('[data-action="refresh"]');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refresh());
        }

        // URL bar
        const urlBar = windowElement.querySelector('#browser-url-bar');
        if (urlBar) {
            urlBar.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.navigateToUrl(urlBar.value);
                }
            });
        }
    }

    goBack() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.loadPage(this.history[this.currentIndex]);
            this.updateNavigationButtons();
        }
    }

    goForward() {
        if (this.currentIndex < this.history.length - 1) {
            this.currentIndex++;
            this.loadPage(this.history[this.currentIndex]);
            this.updateNavigationButtons();
        }
    }

    async refresh() {
        const currentUrl = this.getCurrentUrl();
        await this.loadPage(currentUrl, true);
        
        // Emit refresh event for network monitoring
        document.dispatchEvent(new CustomEvent('browser-navigate', {
            detail: { url: currentUrl, action: 'refresh' }
        }));
    }

    async navigateToUrl(url) {
        // Clean up URL
        url = this.sanitizeUrl(url);
        
        // Add to history if it's a new URL
        if (url !== this.getCurrentUrl()) {
            // Remove any forward history
            this.history = this.history.slice(0, this.currentIndex + 1);
            // Add new URL
            this.history.push(url);
            this.currentIndex = this.history.length - 1;
        }

        await this.loadPage(url);
        this.updateNavigationButtons();
    }

    async loadPage(url, isRefresh = false) {
        if (this.isLoading && !isRefresh) return;

        this.isLoading = true;
        this.updateUrlBar(url);
        this.showLoadingState();

        // Simulate loading delay for realism
        const loadingDelay = Math.random() * 1000 + 500;
        
        try {
            await new Promise(resolve => setTimeout(resolve, loadingDelay));
            
            // Render page (now async with iframe support)
            await this.browserApp.pageRenderer.renderPage(url);
            
            // Run security check after page loads
            if (this.browserApp.securityChecker) {
                this.browserApp.securityChecker.runSecurityScan(url);
            }
            
            // Emit navigation event for network monitoring
            document.dispatchEvent(new CustomEvent('browser-navigate', {
                detail: { 
                    url: url, 
                    action: isRefresh ? 'refresh' : 'navigate',
                    timestamp: new Date().toISOString()
                }
            }));
            
        } catch (error) {
            console.error('Error loading page:', error);
            // The pageRenderer will handle showing error content
        } finally {
            this.isLoading = false;
            this.hideLoadingState();
        }
    }

    updateNavigationButtons() {
        const windowElement = this.browserApp.windowElement;
        if (!windowElement) return;

        const backBtn = windowElement.querySelector('[data-action="back"]');
        const forwardBtn = windowElement.querySelector('[data-action="forward"]');

        if (backBtn) {
            backBtn.disabled = this.currentIndex <= 0;
            backBtn.classList.toggle('opacity-50', this.currentIndex <= 0);
        }

        if (forwardBtn) {
            forwardBtn.disabled = this.currentIndex >= this.history.length - 1;
            forwardBtn.classList.toggle('opacity-50', this.currentIndex >= this.history.length - 1);
        }
    }

    updateUrlBar(url) {
        const urlBar = this.browserApp.windowElement?.querySelector('#browser-url-bar');
        if (urlBar) {
            urlBar.value = url;
        }
    }

    showLoadingState() {
        const refreshBtn = this.browserApp.windowElement?.querySelector('[data-action="refresh"]');
        if (refreshBtn) {
            // Change to loading spinner icon and disable button
            refreshBtn.innerHTML = '<i class="bi bi-hourglass-split animate-spin"></i>';
            refreshBtn.disabled = true;
            refreshBtn.classList.add('opacity-50', 'cursor-not-allowed');
            refreshBtn.classList.remove('hover:bg-gray-500');
        }
    }

    hideLoadingState() {
        const refreshBtn = this.browserApp.windowElement?.querySelector('[data-action="refresh"]');
        if (refreshBtn) {
            // Restore normal refresh icon and enable button
            refreshBtn.innerHTML = '<i class="bi bi-arrow-clockwise"></i>';
            refreshBtn.disabled = false;
            refreshBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            refreshBtn.classList.add('hover:bg-gray-500');
        }
    }

    sanitizeUrl(url) {
        // Add protocol if missing
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        return url;
    }

    getCurrentUrl() {
        return this.history[this.currentIndex] || '';
    }

    getHistory() {
        return [...this.history];
    }
}
