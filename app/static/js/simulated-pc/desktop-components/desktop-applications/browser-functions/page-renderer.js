import { PageRegistry } from './pages/page-registry.js';

export class PageRenderer {
    constructor(browserApp) {
        this.browserApp = browserApp;
        this.pageRegistry = new PageRegistry();
    }

    async renderPage(url) {
        const pageConfig = this.pageRegistry.getPage(url) || this.pageRegistry.createNotFoundPage(url);
        const contentElement = this.browserApp.windowElement?.querySelector('#browser-content');
        
        if (contentElement) {
            // Show loading state while content is being generated
            this.showLoadingState(contentElement);
            
            try {
                // Handle both sync and async content creation
                let content;
                if (typeof pageConfig.createContent === 'function') {
                    const result = pageConfig.createContent();
                    
                    // Check if it's a Promise (async)
                    if (result && typeof result.then === 'function') {
                        content = await result;
                    } else {
                        content = result;
                    }
                } else {
                    content = pageConfig.createContent || '<div>No content available</div>';
                }
                
                contentElement.innerHTML = content;
                this.updatePageTitle(pageConfig.title);
                this.bindPageEvents(url);
                
                // Reset scroll position to top
                contentElement.scrollTop = 0;
                
            } catch (error) {
                console.error('Error rendering page content:', error);
                contentElement.innerHTML = this.createErrorContent(error.message);
            }
        }
    }

    showLoadingState(contentElement) {
        contentElement.innerHTML = `
            <div class="min-h-screen bg-white flex items-center justify-center">
                <div class="text-center">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h2 class="text-xl font-semibold text-gray-800 mb-2">Loading page...</h2>
                    <p class="text-gray-600">Please wait while we fetch the content</p>
                </div>
            </div>
        `;
    }

    createErrorContent(errorMessage) {
        return `
            <div class="min-h-screen bg-white flex items-center justify-center">
                <div class="text-center max-w-md mx-auto p-6">
                    <div class="text-red-500 mb-4">
                        <i class="bi bi-exclamation-triangle text-6xl"></i>
                    </div>
                    <h2 class="text-xl font-semibold text-gray-800 mb-2">Error Loading Page</h2>
                    <p class="text-gray-600 mb-4">${errorMessage}</p>
                    <button onclick="window.location.reload()" 
                            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                        Try Again
                    </button>
                </div>
            </div>
        `;
    }

    updatePageTitle(title) {
        const windowTitle = this.browserApp.windowElement?.querySelector('.window-title span');
        if (windowTitle) {
            windowTitle.textContent = `Web Browser - ${title}`;
        }
    }
    
    bindPageEvents(url) {
        const contentElement = this.browserApp.windowElement?.querySelector('#browser-content');
        if (!contentElement) return;

        // Get the page configuration for event binding
        const pageConfig = this.pageRegistry.getPage(url);
        
        // Bind page-specific events if the page has a bindEvents method
        if (pageConfig && typeof pageConfig.bindEvents === 'function') {
            pageConfig.bindEvents(contentElement);
        }

        // Handle scam button clicks
        const scamButton = contentElement.querySelector('#scam-button');
        if (scamButton) {
            scamButton.addEventListener('click', () => {
                this.showScamWarning();
            });
        }

        // Handle form submissions
        const forms = contentElement.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(form, url);
            });
        });

        // Handle link clicks
        const links = contentElement.querySelectorAll('a[href]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                if (href && href !== '#') {
                    this.browserApp.navigation.navigateToUrl(href);
                }
            });
        });
    }

    showScamWarning() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/75 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md mx-4">
                <div class="text-center">
                    <i class="bi bi-shield-x text-6xl text-red-500 mb-4"></i>
                    <h2 class="text-xl font-bold text-red-600 mb-4">🚨 SCAM DETECTED! 🚨</h2>
                    <p class="text-gray-700 mb-4">
                        Good job! You've identified a scam website. In real life, clicking this button would 
                        likely lead to identity theft or financial fraud.
                    </p>
                    <div class="bg-red-50 border border-red-200 rounded p-3 mb-4">
                        <p class="text-sm text-red-700">
                            <strong>Red flags you should notice:</strong><br>
                            • Too good to be true offers<br>
                            • Urgent/pressure language<br>
                            • Suspicious domain name<br>
                            • Poor grammar/spelling
                        </p>
                    </div>
                    <button onclick="this.closest('.fixed').remove()" 
                            class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors">
                        Continue Training
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    handleFormSubmission(form, url) {
        // Show warning for sensitive forms
        if (url.includes('suspicious') || form.querySelector('input[type="password"]')) {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black/75 flex items-center justify-center z-50';
            modal.innerHTML = `
                <div class="bg-white rounded-lg p-6 max-w-md mx-4">
                    <div class="text-center">
                        <i class="bi bi-exclamation-triangle text-6xl text-yellow-500 mb-4"></i>
                        <h2 class="text-xl font-bold text-yellow-600 mb-4">⚠️ SECURITY WARNING</h2>
                        <p class="text-gray-700 mb-4">
                            You're about to submit sensitive information. In a real scenario, 
                            make sure you trust the website and verify the URL before proceeding.
                        </p>
                        <div class="space-x-3">
                            <button onclick="this.closest('.fixed').remove()" 
                                    class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors">
                                Cancel
                            </button>
                            <button onclick="this.closest('.fixed').remove()" 
                                    class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                                Continue (Training)
                            </button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }
    }

    generateSuspiciousSiteHTML() {
        return `
            <div class="bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 min-h-full p-8 text-center">
                <div class="max-w-4xl mx-auto">
                    <div class="mb-8">
                        <h1 class="text-6xl font-bold text-white mb-4 animate-bounce" id="scam-headline">
                            🎉 CONGRATULATIONS! 🎉
                        </h1>
                        <h2 class="text-3xl font-bold text-yellow-300 mb-6" id="scam-subheading">
                            You've Won $10,000,000!
                        </h2>
                        <p class="text-xl text-white mb-8" id="scam-description">
                            You are the 1,000,000th visitor to this website! Click below to claim your prize NOW!
                        </p>
                    </div>
                    
                    <div class="bg-white/90 backdrop-blur-sm rounded-lg p-6 mb-8 shadow-2xl">
                        <div class="flex justify-center items-center mb-6">
                            <div class="animate-pulse bg-green-500 text-white px-6 py-3 rounded-full text-xl font-bold" id="timer-display">
                                ⏰ LIMITED TIME: 05:43 remaining!
                            </div>
                        </div>
                        
                        <button class="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-12 rounded-full text-2xl animate-pulse shadow-lg transform hover:scale-105 transition-all duration-200 cursor-pointer" id="scam-button">
                            🚨 CLAIM NOW - FREE MONEY! 🚨
                        </button>
                        
                        <div class="mt-6 space-y-3">
                            <div class="flex items-center justify-center text-green-600 font-semibold">
                                <i class="bi bi-check-circle-fill mr-2"></i>
                                <span>100% Guaranteed</span>
                            </div>
                            <div class="flex items-center justify-center text-green-600 font-semibold" id="fake-disclaimer">
                                <i class="bi bi-shield-check-fill mr-2"></i>
                                <span>No catch, totally legitimate</span>
                            </div>
                            <div class="flex items-center justify-center text-green-600 font-semibold" id="urgency-message">
                                <i class="bi bi-lightning-fill mr-2"></i>
                                <span>Act fast - offer expires soon!</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="grid md:grid-cols-3 gap-6 mb-8">
                        <div class="bg-white/80 rounded-lg p-4 text-center" id="fake-testimonial-1">
                            <div class="text-2xl mb-2">👤</div>
                            <p class="text-sm text-gray-700">"I won $50,000 last week!" - Sarah K.</p>
                        </div>
                        <div class="bg-white/80 rounded-lg p-4 text-center" id="fake-testimonial-2">
                            <div class="text-2xl mb-2">👤</div>
                            <p class="text-sm text-gray-700">"Easy money, no scam!" - Mike R.</p>
                        </div>
                        <div class="bg-white/80 rounded-lg p-4 text-center" id="fake-testimonial-3">
                            <div class="text-2xl mb-2">👤</div>
                            <p class="text-sm text-gray-700">"Received payment instantly!" - Lisa M.</p>
                        </div>
                    </div>
                    
                    <div class="text-xs text-white/70 max-w-2xl mx-auto" id="fine-print">
                        <p class="mb-2">* This is a cybersecurity training simulation. This is not a real offer or legitimate website.</p>
                        <p>Real scam sites use similar tactics: urgent language, fake testimonials, and pressure to act quickly.</p>
                    </div>
                </div>
            </div>
        `;
    }
}
