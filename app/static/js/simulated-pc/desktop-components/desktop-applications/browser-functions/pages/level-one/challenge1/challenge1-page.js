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
            
            /* CyberQuest verification tools overlay */
            .cyberquest-verification-tools {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(31, 41, 55, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 12px;
                padding: 20px;
                max-width: 400px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                border: 2px solid #10b981;
                font-family: Arial, sans-serif;
            }
            
            .cyberquest-verification-tools h3 {
                color: #10b981 !important;
                margin-bottom: 15px !important;
                font-size: 18px !important;
                font-weight: 600 !important;
            }
            
            .cyberquest-verification-tools p {
                color: #d1d5db !important;
                font-size: 14px !important;
                margin-bottom: 15px !important;
            }
            
            .cyberquest-verification-tools button {
                background: #10b981 !important;
                color: white !important;
                border: none !important;
                padding: 10px 15px !important;
                border-radius: 6px !important;
                cursor: pointer !important;
                font-size: 14px !important;
                margin: 5px !important;
                transition: background-color 0.2s !important;
            }
            
            .cyberquest-verification-tools button:hover {
                background: #059669 !important;
            }
            
            .cyberquest-verification-tools .analysis-form {
                background: rgba(55, 65, 81, 0.8);
                padding: 15px;
                border-radius: 8px;
                margin-top: 15px;
            }
            
            .cyberquest-verification-tools input[type="radio"] {
                margin-right: 8px !important;
            }
            
            .cyberquest-verification-tools label {
                color: #d1d5db !important;
                font-size: 12px !important;
                display: block !important;
                margin: 8px 0 !important;
            }
            
            .cyberquest-verification-tools textarea {
                width: 100% !important;
                background: rgba(75, 85, 99, 0.8) !important;
                color: white !important;
                border: 1px solid #6b7280 !important;
                border-radius: 4px !important;
                padding: 8px !important;
                font-size: 12px !important;
                resize: vertical !important;
            }
            
            /* Make content area have extra padding for our overlay */
            body {
                padding-top: 50px !important;
            }
        `;

        // Create our verification tools section
        const verificationSection = document.createElement('div');
        verificationSection.innerHTML = this.renderVerificationTools();
        verificationSection.className = 'cyberquest-verification-tools';

        // Find the body or main content area
        const bodyElement = tempContainer.querySelector('body') || tempContainer;
        
        // Inject our custom elements
        bodyElement.insertBefore(customStyles, bodyElement.firstChild);
        bodyElement.appendChild(verificationSection);

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

    renderVerificationTools() {
        return `
            <div>
                <h3>🔍 CyberQuest Analysis Tools</h3>
                <p>Use these tools to verify the authenticity of this news story.</p>
                
                <div>
                    <button id="cross-reference-tool" data-url="https://fact-checker.cyberquest.academy/cross-reference">
                        Cross-Reference Story
                    </button>
                    <button id="source-analysis-tool">
                        Analyze Source Credibility
                    </button>
                </div>

                <div class="analysis-form">
                    <label><strong>Your Analysis:</strong></label>
                    <textarea rows="3" placeholder="What did you discover about this story?" id="analysis-notes"></textarea>
                    
                    <div style="margin-top: 10px;">
                        <label><strong>Is this story credible?</strong></label>
                        <label><input type="radio" name="credibility" value="yes">Yes, appears legitimate</label>
                        <label><input type="radio" name="credibility" value="no">No, appears to be misinformation</label>
                        <label><input type="radio" name="credibility" value="unsure">Need more information</label>
                    </div>
                    
                    <button id="submit-analysis" style="margin-top: 15px; width: 100%;">
                        Submit Analysis
                    </button>
                </div>
            </div>
        `;
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