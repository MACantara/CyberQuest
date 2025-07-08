import { BasePage } from '../../base-page.js';
import { EventHandlers } from './utils/event-handlers.js';

class Challenge1PageClass extends BasePage {
    constructor() {
        super({
            url: 'https://daily-politico-news.com/breaking-news',
            title: 'BREAKING: Senator Johnson Hacking Scandal - Daily Politico News',
            ipAddress: '192.0.2.47',
            securityLevel: 'suspicious',
            security: {
                isHttps: false,
                hasValidCertificate: false,
                threats: ['Phishing attempt', 'Suspicious domain'],
                riskFactors: [
                    'No HTTPS',
                    'New domain (registered 2 weeks ago)',
                    'Sensational headline',
                    'No author information',
                    'No contact information'
                ]
            }
        });
        
        this.eventHandlers = new EventHandlers(this);
        this.realWebsiteUrl = 'https://www.today.com/style/see-people-s-choice-awards-red-carpet-looks-t141832';
        this.htmlContent = null;
        this.fetchPromise = null; // Cache the fetch promise
    }

    async createContent() {
        // If we already have cached content, return it with training overlay
        if (this.htmlContent) {
            return this.processHtmlContent(this.htmlContent);
        }

        // If we're already fetching, wait for that promise
        if (this.fetchPromise) {
            try {
                await this.fetchPromise;
                return this.processHtmlContent(this.htmlContent);
            } catch (error) {
                return this.createErrorContent();
            }
        }

        // Start fetching the real website content
        this.fetchPromise = this.fetchRealWebsiteContent();
        
        try {
            await this.fetchPromise;
            return this.processHtmlContent(this.htmlContent);
        } catch (error) {
            console.error('Failed to fetch real website:', error);
            return this.createErrorContent();
        }
    }

    createLoadingContent() {
        return `
            <div class="min-h-screen bg-white flex items-center justify-center">
                <div class="text-center">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <h2 class="text-xl font-semibold text-gray-800 mb-2">Loading Daily Politico News...</h2>
                    <p class="text-gray-600">Fetching breaking news content</p>
                </div>
            </div>
        `;
    }

    createErrorContent() {
        return `
            <div class="min-h-screen bg-white flex items-center justify-center">
                <div class="text-center max-w-md mx-auto p-6">
                    <div class="text-red-500 mb-4">
                        <i class="bi bi-exclamation-triangle text-6xl"></i>
                    </div>
                    <h2 class="text-xl font-semibold text-gray-800 mb-2">Failed to Load Content</h2>
                    <p class="text-gray-600 mb-4">Unable to fetch the website content. This might be a network issue or the site may be unavailable.</p>
                    <button onclick="window.location.reload()" 
                            class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                        Try Again
                    </button>
                </div>
            </div>
        `;
    }

    // Fetch real website content from our server proxy
    async fetchRealWebsiteContent() {
        try {
            console.log('Fetching real website content from:', this.realWebsiteUrl);
            
            // Use our fetch-website route to get real HTML content
            const response = await fetch(`/levels/fetch-website?url=${encodeURIComponent(this.realWebsiteUrl)}`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            if (data.success && data.html) {
                // Store the fetched HTML content
                this.htmlContent = data.html;
                console.log('Successfully fetched website content');
                return this.htmlContent;
            } else {
                throw new Error(data.error || 'Failed to fetch website content');
            }
        } catch (error) {
            console.error('Error fetching website content:', error);
            this.htmlContent = null;
            throw error;
        } finally {
            this.fetchPromise = null; // Clear the promise
        }
    }

    // Process the fetched HTML to inject our training tools and modify content
    processHtmlContent(rawHtml) {
        // Create a temporary container to parse and modify the HTML
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = rawHtml;

        // Inject custom styles to make it look like a suspicious news site
        const customStyles = document.createElement('style');
        customStyles.textContent = `
            /* Override site styling to make it look like a suspicious news site */
            body {
                font-family: Arial, sans-serif !important;
            }
        `;

        // Find the body or main content area
        const bodyElement = tempContainer.querySelector('body') || tempContainer;
        
        // Inject our custom elements
        bodyElement.insertBefore(customStyles, bodyElement.firstChild);

        // Modify some text content to make it look like political news
        this.modifyContentToSuspiciousNews(tempContainer);

        return tempContainer.innerHTML;
    }

    // Modify the content to make it look like suspicious political news
    modifyContentToSuspiciousNews(container) {
        // Find and modify headlines
        const headlines = container.querySelectorAll('h1, h2, .headline, [class*="headline"], [class*="title"]');
        if (headlines.length > 0) {
            headlines[0].textContent = "SENATOR JOHNSON'S PRIVATE EMAILS HACKED: EXPLOSIVE REVELATIONS";
        }

        // Find and modify some paragraphs to political content
        const paragraphs = container.querySelectorAll('p');
        if (paragraphs.length > 0) {
            paragraphs[0].innerHTML = `<strong>EXCLUSIVE:</strong> In a shocking turn of events, anonymous hackers have breached the personal email account of Senator Michael Johnson, revealing damning evidence of corruption and collusion with foreign powers.`;
        }
        
        if (paragraphs.length > 1) {
            paragraphs[1].textContent = "According to the leaked emails, Senator Johnson has been secretly communicating with representatives from a foreign government, promising political favors in exchange for financial contributions to his campaign.";
        }

        // Add some urgent call-to-action elements
        const callToAction = container.querySelector('.share, [class*="share"], .social');
        if (callToAction) {
            callToAction.innerHTML = `
                <div style="background: #dc2626; color: white; padding: 15px; margin: 20px 0; border-radius: 8px; text-align: center;">
                    <h3 style="margin: 0 0 10px 0; color: white;">URGENT: YOUR ACTION NEEDED</h3>
                    <p style="margin: 0 0 10px 0; color: white;">Share this story immediately to spread awareness about government corruption! The mainstream media won't report on this!</p>
                    <button style="background: #1d4ed8; color: white; padding: 10px 20px; border: none; border-radius: 4px; margin: 5px;">Share on Facebook</button>
                    <button style="background: #1da1f2; color: white; padding: 10px 20px; border: none; border-radius: 4px; margin: 5px;">Tweet Now</button>
                </div>
            `;
        }
    }

    async bindEvents(contentElement) {
        // Wait a moment for the content to be fully rendered
        setTimeout(() => {
            this.eventHandlers.bindAllEvents(document);
        }, 100);
    }

    // Override toPageObject to work with the registry
    toPageObject() {
        const pageInstance = this;
        return {
            url: this.url,
            title: this.title,
            ipAddress: this.ipAddress,
            securityLevel: this.securityLevel,
            security: this.security,
            createContent: () => pageInstance.createContent(), // This will return a Promise
            bindEvents: (contentElement) => pageInstance.bindEvents(contentElement)
        };
    }
}

// Export as page object for compatibility
export const Challenge1Page = new Challenge1PageClass().toPageObject();