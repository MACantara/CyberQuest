import { BasePage } from '../../base-page.js';
import { EventHandlers } from './utils/event-handlers.js';

class Challenge1PageClass extends BasePage {
    constructor() {
        super({
            url: 'https://daily-politico-news.com/breaking-news',
            title: 'Daily Politico News - Breaking News',
            ipAddress: '192.0.2.47',
            securityLevel: 'suspicious',
            useIframe: false,
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
        this.articleData = null; // Will be set when fetched
        this.fetchPromise = null;
    }

    async createContent() {
        // If we don't have article data yet, fetch it
        if (!this.articleData) {
            try {
                await this.fetchRandomNewsArticle();
            } catch (error) {
                console.error('Failed to fetch random news article:', error);
                return this.createErrorContent();
            }
        }

        return this.generateNewsPageHTML();
    }

    async fetchRandomNewsArticle() {
        try {
            console.log('Fetching random news article from CSV datasets...');
            
            const response = await fetch('/levels/get-random-news-article');
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            if (data.success && data.article) {
                this.articleData = data.article;
                
                // Update page metadata based on the article
                this.title = `${data.article.title} - Daily Politico News`;
                
                console.log('Random news article selected:', {
                    title: data.article.title.substring(0, 50) + '...',
                    isReal: data.article.is_real,
                    source: data.article.source,
                    date: data.article.date
                });
                
                return data.article;
            } else {
                throw new Error(data.error || 'Failed to get random news article');
            }
        } catch (error) {
            console.error('Error fetching random news article:', error);
            throw error;
        }
    }

    generateNewsPageHTML() {
        if (!this.articleData) {
            return this.createErrorContent();
        }

        // Format the date for display
        const formattedDate = this.formatDate(this.articleData.date);
        
        // Truncate text if too long for better display
        const displayText = this.truncateText(this.articleData.text, 1500);
        
        // Add suspicious elements if this is fake news
        const isFakeNews = !this.articleData.is_real;
        const urgentBanner = isFakeNews ? this.createUrgentBanner() : '';
        const sharingBox = isFakeNews ? this.createSharingUrgencyBox() : '';
        const testimonials = isFakeNews ? this.createFakeTestimonials() : '';
        
        return `
            <div style="font-family: Arial, sans-serif; background: #ffffff; min-height: 100vh;">
                ${urgentBanner}
                
                <!-- Header -->
                <header style="background: #1f2937; color: white; padding: 20px;">
                    <h1 style="margin: 0; font-size: 28px;">Daily Politico News</h1>
                    <p style="margin: 5px 0 0 0; color: #9ca3af;">Your Source for ${isFakeNews ? 'REAL' : 'Reliable'} News</p>
                </header>
                
                <!-- Main Content -->
                <main style="padding: 30px; max-width: 800px; margin: 0 auto;">
                    <h2 style="color: ${isFakeNews ? '#dc2626' : '#374151'}; font-size: 32px; margin-bottom: 10px; ${isFakeNews ? 'text-transform: uppercase;' : ''}">
                        ${isFakeNews ? '🚨 ' : ''}${this.articleData.title}${isFakeNews ? ' 🚨' : ''}
                    </h2>
                    
                    <div style="color: #6b7280; margin-bottom: 20px; font-size: 14px; display: flex; justify-content: space-between; align-items: center;">
                        <span>Published: ${formattedDate} | By: ${isFakeNews ? 'Anonymous Source' : 'Staff Reporter'}</span>
                        <span style="background: ${isFakeNews ? '#dc2626' : '#10b981'}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px;">
                            ${isFakeNews ? 'EXCLUSIVE' : 'VERIFIED'}
                        </span>
                    </div>
                    
                    <!-- Article Image Placeholder -->
                    <div style="width: 100%; height: 300px; background: ${isFakeNews ? 'linear-gradient(135deg, #dc2626, #ea580c)' : '#f3f4f6'}; margin-bottom: 20px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: ${isFakeNews ? 'white' : '#6b7280'}; font-size: 18px;">
                        ${isFakeNews ? '📸 SHOCKING EXCLUSIVE FOOTAGE' : '📸 News Image'}
                    </div>
                    
                    <!-- Article Text -->
                    <div style="font-size: 18px; line-height: 1.6; color: #374151;">
                        ${this.formatArticleText(displayText, isFakeNews)}
                    </div>
                    
                    ${sharingBox}
                    ${testimonials}
                </main>
                
                <!-- Footer -->
                <footer style="background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280;">
                    <p>© 2024 Daily Politico News | Contact: tips@daily-politico-news.com</p>
                    <p style="font-size: 12px;">This website is for CyberQuest training purposes. Article source: ${this.articleData.source}</p>
                </footer>
            </div>
        `;
    }

    formatDate(dateString) {
        try {
            // Try to parse and format the date
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return dateString; // Return original if parsing fails
            }
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return dateString; // Return original on error
        }
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) {
            return text;
        }
        
        // Truncate at word boundary
        const truncated = text.substring(0, maxLength);
        const lastSpace = truncated.lastIndexOf(' ');
        return truncated.substring(0, lastSpace) + '...';
    }

    formatArticleText(text, isFakeNews) {
        // Split text into paragraphs
        const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);
        
        return paragraphs.map(paragraph => {
            let formattedParagraph = paragraph.trim();
            
            if (isFakeNews) {
                // Add sensational formatting to fake news
                formattedParagraph = formattedParagraph
                    .replace(/\b(BREAKING|EXCLUSIVE|URGENT|SHOCKING|SCANDAL|LEAKED)\b/gi, '<strong style="color: #dc2626;">$1</strong>')
                    .replace(/\b(millions?|billions?|thousands?)\b/gi, '<strong style="color: #ea580c;">$1</strong>');
            }
            
            return `<p style="margin: 0 0 16px 0;">${formattedParagraph}</p>`;
        }).join('');
    }

    createUrgentBanner() {
        return `
            <div style="background: linear-gradient(90deg, #dc2626, #ea580c); color: white; padding: 15px; text-align: center; font-weight: bold; animation: pulse 2s infinite;">
                🚨 BREAKING: EXCLUSIVE STORY! SHARE BEFORE IT'S CENSORED! 🚨
            </div>
        `;
    }

    createSharingUrgencyBox() {
        return `
            <div style="background: #dc2626; color: white; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; border: 3px solid #f59e0b;">
                <h3 style="margin: 0 0 10px 0;">URGENT: YOUR ACTION NEEDED</h3>
                <p style="margin: 0 0 15px 0;">Share this story immediately! Don't let the mainstream media hide the truth!</p>
                <button style="background: #1d4ed8; color: white; padding: 12px 24px; border: none; border-radius: 4px; margin: 5px; font-weight: bold; cursor: pointer;">Share on Facebook</button>
                <button style="background: #1da1f2; color: white; padding: 12px 24px; border: none; border-radius: 4px; margin: 5px; font-weight: bold; cursor: pointer;">Tweet Now</button>
            </div>
        `;
    }

    createFakeTestimonials() {
        return `
            <div style="background: #f9fafb; padding: 20px; margin: 20px 0; border-radius: 8px;">
                <h3 style="color: #374151; margin-bottom: 15px;">What People Are Saying:</h3>
                <blockquote style="margin: 15px 0; padding: 10px; border-left: 3px solid #10b981; background: white;">
                    "I KNEW something was fishy! Thanks for exposing the TRUTH!" - PatriotFreedom2024
                </blockquote>
                <blockquote style="margin: 15px 0; padding: 10px; border-left: 3px solid #10b981; background: white;">
                    "Finally, REAL journalism! The mainstream media would never report this!" - TruthSeeker99
                </blockquote>
                <blockquote style="margin: 15px 0; padding: 10px; border-left: 3px solid #10b981; background: white;">
                    "Shared this everywhere! Everyone needs to know!" - WakeUpAmerica
                </blockquote>
            </div>
        `;
    }

    createErrorContent() {
        return `
            <div style="font-family: Arial, sans-serif; background: #ffffff; min-height: 100vh; display: flex; align-items: center; justify-content: center;">
                <div style="text-align: center; max-width: 500px; padding: 20px;">
                    <h1 style="color: #dc2626; font-size: 24px; margin-bottom: 16px;">⚠️ Error Loading Article</h1>
                    <p style="color: #6b7280; margin-bottom: 20px;">
                        Unable to load news article. This could be due to missing CSV data files or a server error.
                    </p>
                    <button onclick="location.reload()" style="background: #10b981; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer;">
                        Try Again
                    </button>
                </div>
            </div>
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