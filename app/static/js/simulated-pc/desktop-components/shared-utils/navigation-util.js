export class NavigationUtil {
    /**
     * Opens browser and navigates to URL
     * @param {string} url - URL to navigate to
     * @param {Object} eventDetails - Additional event details for monitoring
     */
    static openBrowserWithUrl(url, eventDetails = {}) {
        // Emit navigation event for network monitoring
        document.dispatchEvent(new CustomEvent('browser-navigate', {
            detail: { url: url, ...eventDetails }
        }));

        // Open the browser app and navigate to the URL
        if (window.currentSimulation && window.currentSimulation.desktop && window.currentSimulation.desktop.windowManager) {
            window.currentSimulation.desktop.windowManager.openBrowser();
            
            setTimeout(() => {
                this.navigateBrowserToUrl(url);
            }, 500);
        }
    }

    /**
     * Navigate existing browser to URL
     * @param {string} url - URL to navigate to
     */
    static navigateBrowserToUrl(url) {
        // Find the browser window and set the URL bar
        const browserWindows = document.querySelectorAll('.window-title span');
        let browserWindow = null;
        
        browserWindows.forEach(span => {
            if (span.textContent.includes('Web Browser')) {
                browserWindow = span.closest('.absolute');
            }
        });

        if (browserWindow) {
            const urlBar = browserWindow.querySelector('#browser-url-bar');
            if (urlBar) {
                urlBar.value = url;
                urlBar.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter' }));
            }
        } else if (window.browserApp) {
            // Direct navigation if browser app is available
            window.browserApp.navigation.navigateToUrl(url);
        }
    }

    /**
     * Handle click events with data-url attributes
     * @param {Event} event - Click event
     * @param {Object} eventDetails - Additional event details for monitoring
     */
    static handleDataUrlClick(event, eventDetails = {}) {
        const target = event.target.closest('[data-url]');
        if (target && target.hasAttribute('data-url')) {
            event.preventDefault();
            const url = target.getAttribute('data-url');
            if (url) {
                this.openBrowserWithUrl(url, eventDetails);
            }
        }
    }

    /**
     * Bind data-url click handlers to a container element
     * @param {HTMLElement} container - Container element to bind events to
     * @param {Object} defaultEventDetails - Default event details for monitoring
     */
    static bindDataUrlHandlers(container, defaultEventDetails = {}) {
        if (!container) return;

        container.addEventListener('click', (event) => {
            this.handleDataUrlClick(event, defaultEventDetails);
        });
    }

    /**
     * Handle email link clicks specifically
     * @param {HTMLElement} container - Container element to bind events to
     */
    static bindEmailLinkHandlers(container) {
        if (!container) return;

        container.querySelectorAll('.open-browser-link').forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const url = link.getAttribute('data-url');
                
                // Emit email link click event for network monitoring
                document.dispatchEvent(new CustomEvent('email-link-clicked', {
                    detail: { 
                        url: url,
                        suspicious: true // Email links are typically suspicious
                    }
                }));
                
                this.openBrowserWithUrl(url, { source: 'email', suspicious: true });
            });
        });
    }
}
