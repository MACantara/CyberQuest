import { BasePage } from '../../base-page.js';
import { EventHandlers } from './utils/event-handlers.js';

class Challenge1PageClass extends BasePage {
    constructor() {
        super({
            url: 'https://daily-politico-news.com/breaking-news',
            title: 'BREAKING: Senator Johnson Hacking Scandal - Daily Politico News',
            ipAddress: '192.0.2.47',
            securityLevel: 'suspicious',
            useIframe: true, // Flag to use iframe rendering
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
        this.fetchPromise = null;
    }

    async createContent() {
        // If we already have cached content, return it
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

    async fetchRealWebsiteContent() {
        try {
            console.log('Fetching real website content from:', this.realWebsiteUrl);
            
            const response = await fetch(`/levels/fetch-website?url=${encodeURIComponent(this.realWebsiteUrl)}`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            if (data.success && data.html) {
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
            this.fetchPromise = null;
        }
    }

    processHtmlContent(rawHtml) {
        // Parse the HTML and modify it for the misinformation training
        const parser = new DOMParser();
        const doc = parser.parseFromString(rawHtml, 'text/html');
        
        // Modify content to look like political misinformation
        this.modifyContentToSuspiciousNews(doc);
        
        // Return the modified HTML
        return new XMLSerializer().serializeToString(doc);
    }

    modifyContentToSuspiciousNews(doc) {
        // Change page title
        const title = doc.querySelector('title');
        if (title) {
            title.textContent = "BREAKING: Senator Johnson's Private Emails Hacked - Daily Politico News";
        }
        
        // Modify main headlines
        const headlines = doc.querySelectorAll('h1, h2, [class*="headline"], [class*="title"]');
        if (headlines.length > 0) {
            headlines[0].textContent = "SENATOR JOHNSON'S PRIVATE EMAILS HACKED: EXPLOSIVE REVELATIONS";
            if (headlines[1]) {
                headlines[1].textContent = "Anonymous hackers reveal corruption evidence";
            }
        }
        
        // Modify article content
        const paragraphs = doc.querySelectorAll('p');
        if (paragraphs.length > 0) {
            paragraphs[0].innerHTML = `<strong>EXCLUSIVE:</strong> In a shocking turn of events, anonymous hackers have breached the personal email account of Senator Michael Johnson, revealing damning evidence of corruption and collusion with foreign powers.`;
        }
        
        if (paragraphs.length > 1) {
            paragraphs[1].textContent = "According to the leaked emails, Senator Johnson has been secretly communicating with representatives from a foreign government, promising political favors in exchange for financial contributions to his campaign.";
        }
        
        if (paragraphs.length > 2) {
            paragraphs[2].innerHTML = `The emails, obtained by whistleblowers and verified by independent sources, show a pattern of <strong>systematic corruption</strong> that reaches the highest levels of government.`;
        }
        
        // Add urgent call-to-action elements
        const body = doc.querySelector('body');
        if (body) {
            // Insert urgent banner at the top
            const urgentBanner = doc.createElement('div');
            urgentBanner.style.cssText = `
                background: linear-gradient(90deg, #dc2626, #ea580c);
                color: white;
                padding: 15px;
                text-align: center;
                font-weight: bold;
                animation: pulse 2s infinite;
                position: sticky;
                top: 0;
                z-index: 1000;
            `;
            urgentBanner.innerHTML = `🚨 BREAKING: EXCLUSIVE POLITICAL SCANDAL EXPOSED! SHARE BEFORE IT'S CENSORED! 🚨`;
            body.insertBefore(urgentBanner, body.firstChild);
            
            // Add sharing urgency box
            const shareBox = doc.createElement('div');
            shareBox.style.cssText = `
                background: #dc2626;
                color: white;
                padding: 20px;
                margin: 20px;
                border-radius: 8px;
                text-align: center;
                border: 3px solid #f59e0b;
            `;
            shareBox.innerHTML = `
                <h3 style="margin: 0 0 10px 0; color: white;">URGENT: YOUR ACTION NEEDED</h3>
                <p style="margin: 0 0 15px 0; color: white;">Share this story immediately! The mainstream media won't report this truth!</p>
                <button style="background: #1d4ed8; color: white; padding: 12px 24px; border: none; border-radius: 4px; margin: 5px; font-weight: bold; cursor: pointer;">Share on Facebook</button>
                <button style="background: #1da1f2; color: white; padding: 12px 24px; border: none; border-radius: 4px; margin: 5px; font-weight: bold; cursor: pointer;">Tweet Now</button>
            `;
            body.appendChild(shareBox);
        }
        
        // Modify any existing images to look more political
        const images = doc.querySelectorAll('img');
        images.forEach((img, index) => {
            if (index === 0) {
                img.alt = "Senator Johnson (allegedly)";
                img.title = "Leaked photo from private meeting";
            }
        });
        
        // Add suspicious metadata
        const head = doc.querySelector('head');
        if (head) {
            const suspiciousMeta = doc.createElement('meta');
            suspiciousMeta.setAttribute('name', 'author');
            suspiciousMeta.setAttribute('content', 'Anonymous Whistleblower');
            head.appendChild(suspiciousMeta);
        }
    }

    createErrorContent() {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Error Loading Content</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 40px; text-align: center; }
                    .error { color: #dc2626; }
                </style>
            </head>
            <body>
                <div class="error">
                    <h1>Failed to Load Content</h1>
                    <p>Unable to fetch the news story. Please try refreshing the page.</p>
                </div>
            </body>
            </html>
        `;
    }

    bindEvents(contentElement) {
        // Events are now handled by the overlay in page-renderer
        setTimeout(() => {
            this.eventHandlers.bindAllEvents(document);
        }, 100);
    }

    toPageObject() {
        const pageInstance = this;
        return {
            url: this.url,
            title: this.title,
            ipAddress: this.ipAddress,
            securityLevel: this.securityLevel,
            security: this.security,
            useIframe: this.useIframe,
            createContent: () => pageInstance.createContent(),
            bindEvents: (contentElement) => pageInstance.bindEvents(contentElement)
        };
    }
}

// Export as page object for compatibility
export const Challenge1Page = new Challenge1PageClass().toPageObject();