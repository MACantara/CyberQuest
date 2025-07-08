import { BasePage } from '../../base-page.js';
import { EventHandlers } from './utils/event-handlers.js';

class Challenge1PageClass extends BasePage {
    constructor() {
        super({
            url: 'https://daily-politico-news.com/breaking-news',
            title: 'BREAKING: Senator Johnson Hacking Scandal - Daily Politico News',
            ipAddress: '192.0.2.47',
            securityLevel: 'suspicious',
            useIframe: true,
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
        this.realWebsiteUrl = null; // Will be set dynamically
        this.articleData = null; // Store article metadata
        this.htmlContent = null;
        this.fetchPromise = null;
    }

    async createContent() {
        // If we don't have a real website URL yet, get one
        if (!this.realWebsiteUrl) {
            try {
                await this.fetchRandomNewsUrl();
            } catch (error) {
                console.error('Failed to fetch random news URL:', error);
                // Fallback to the original Today.com URL
                this.realWebsiteUrl = 'https://www.today.com/style/see-people-s-choice-awards-red-carpet-looks-t141832';
            }
        }

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

    async fetchRandomNewsUrl() {
        try {
            console.log('Fetching random news URL from FakeNewsNet dataset...');
            
            const response = await fetch('/levels/get-random-news-url');
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            if (data.success && data.article) {
                this.realWebsiteUrl = data.article.url;
                this.articleData = data.article;
                
                // Update page metadata based on the article
                this.title = data.article.title || this.title;
                
                console.log('Random news URL selected:', this.realWebsiteUrl);
                console.log('Article is real news:', data.article.is_real);
                
                return data.article;
            } else {
                throw new Error(data.error || 'Failed to get random news URL');
            }
        } catch (error) {
            console.error('Error fetching random news URL:', error);
            throw error;
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
        
        // Only modify content if this is NOT real news (i.e., it's fake news)
        if (this.articleData && !this.articleData.is_real) {
            console.log('Processing fake news article - applying suspicious modifications');
            this.modifyContentToSuspiciousNews(doc);
        } else {
            console.log('Processing real news article - minimal modifications');
            this.addMinimalModifications(doc);
        }
        
        // Return the modified HTML
        return new XMLSerializer().serializeToString(doc);
    }

    modifyContentToSuspiciousNews(doc) {
        // Change page title to something more sensational
        const title = doc.querySelector('title');
        if (title && this.articleData) {
            title.textContent = this.articleData.title + " - EXCLUSIVE BREAKING NEWS";
        }
        
        // Add suspicious elements to make it look like misinformation
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
                font-family: Arial, sans-serif;
            `;
            urgentBanner.innerHTML = `🚨 BREAKING: EXCLUSIVE STORY! SHARE BEFORE IT'S CENSORED! 🚨`;
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
                font-family: Arial, sans-serif;
            `;
            shareBox.innerHTML = `
                <h3 style="margin: 0 0 10px 0; color: white;">URGENT: YOUR ACTION NEEDED</h3>
                <p style="margin: 0 0 15px 0; color: white;">Share this story immediately! Don't let the mainstream media hide the truth!</p>
                <button style="background: #1d4ed8; color: white; padding: 12px 24px; border: none; border-radius: 4px; margin: 5px; font-weight: bold; cursor: pointer;">Share on Facebook</button>
                <button style="background: #1da1f2; color: white; padding: 12px 24px; border: none; border-radius: 4px; margin: 5px; font-weight: bold; cursor: pointer;">Tweet Now</button>
            `;
            body.appendChild(shareBox);
        }
    }

    addMinimalModifications(doc) {
        // For real news, just add a small indicator without making it look suspicious
        const body = doc.querySelector('body');
        if (body) {
            const indicator = doc.createElement('div');
            indicator.style.cssText = `
                background: #f3f4f6;
                color: #374151;
                padding: 10px;
                text-align: center;
                font-size: 12px;
                border-bottom: 1px solid #e5e7eb;
                font-family: Arial, sans-serif;
            `;
            indicator.innerHTML = `📰 CyberQuest Training Exercise - Analyze this news story`;
            body.insertBefore(indicator, body.firstChild);
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