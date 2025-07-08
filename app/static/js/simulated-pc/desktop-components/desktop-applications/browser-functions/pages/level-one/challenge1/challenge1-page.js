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
        this.articlesData = []; // Store all 15 articles
        this.currentArticleIndex = 0; // Track which article is being displayed
        this.fetchPromise = null;
    }

    async createContent() {
        // If we don't have articles data yet, fetch it
        if (this.articlesData.length === 0) {
            try {
                await this.fetchMixedNewsArticles();
            } catch (error) {
                console.error('Failed to fetch mixed news articles:', error);
                return this.createErrorContent();
            }
        }

        return this.generateNewsPageHTML();
    }

    async fetchMixedNewsArticles() {
        try {
            console.log('Fetching mixed news articles (15 total: 50% fake, 50% real)...');
            
            const response = await fetch('/levels/get-mixed-news-articles');
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            if (data.success && data.articles) {
                this.articlesData = data.articles;
                
                // Update page metadata based on the first article
                this.title = `${data.articles[0].title} - Daily Politico News`;
                this.articleData = data.articles[0]; // Set current article for overlay tools
                
                console.log('Mixed news articles loaded:', {
                    total: data.articles.length,
                    fakeCount: data.articles.filter(a => !a.is_real).length,
                    realCount: data.articles.filter(a => a.is_real).length,
                    firstArticle: {
                        title: data.articles[0].title.substring(0, 50) + '...',
                        isReal: data.articles[0].is_real,
                        source: data.articles[0].source
                    }
                });
                
                return data.articles;
            } else {
                throw new Error(data.error || 'Failed to get mixed news articles');
            }
        } catch (error) {
            console.error('Error fetching mixed news articles:', error);
            throw error;
        }
    }

    generateNewsPageHTML() {
        if (this.articlesData.length === 0) {
            return this.createErrorContent();
        }

        const currentArticle = this.articlesData[this.currentArticleIndex];
        
        // Format the date for display
        const formattedDate = this.formatDate(currentArticle.date);
        
        // Truncate text if too long for better display
        const displayText = this.truncateText(currentArticle.text, 1200);
        
        // Add suspicious elements if this is fake news
        const isFakeNews = !currentArticle.is_real;
        const sharingBox = isFakeNews ? this.createSharingUrgencyBox() : '';
        const testimonials = isFakeNews ? this.createFakeTestimonials() : '';
        
        return `
            <div style="font-family: Arial, sans-serif; background: #ffffff; min-height: 100vh;">             
                <!-- Header -->
                <header style="background: #1f2937; color: white; padding: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h1 style="margin: 0; font-size: 28px;">Daily Politico News</h1>
                            <p style="margin: 5px 0 0 0; color: #9ca3af;">Your Source for News</p>
                        </div>
                        
                        <!-- Article Navigation -->
                        <div style="background: rgba(255,255,255,0.1); padding: 10px 20px; border-radius: 8px;">
                            <div style="color: #10b981; font-size: 14px; margin-bottom: 5px;">Training Articles</div>
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <button onclick="window.challenge1Page?.previousArticle()" 
                                        style="background: #374151; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; ${this.currentArticleIndex === 0 ? 'opacity: 0.5;' : ''}"
                                        ${this.currentArticleIndex === 0 ? 'disabled' : ''}>
                                    ← Previous
                                </button>
                                
                                <span style="color: #e5e7eb; font-size: 14px; min-width: 80px; text-align: center;">
                                    ${this.currentArticleIndex + 1} of ${this.articlesData.length}
                                </span>
                                
                                <button onclick="window.challenge1Page?.nextArticle()" 
                                        style="background: #374151; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; ${this.currentArticleIndex === this.articlesData.length - 1 ? 'opacity: 0.5;' : ''}"
                                        ${this.currentArticleIndex === this.articlesData.length - 1 ? 'disabled' : ''}>
                                    Next →
                                </button>
                            </div>
                            
                            <!-- Progress Bar -->
                            <div style="background: rgba(255,255,255,0.2); height: 4px; border-radius: 2px; margin-top: 8px; overflow: hidden;">
                                <div style="background: #10b981; height: 100%; width: ${((this.currentArticleIndex + 1) / this.articlesData.length) * 100}%; transition: width 0.3s ease;"></div>
                            </div>
                        </div>
                    </div>
                </header>
                
                <!-- Main Content -->
                <main style="padding: 30px; max-width: 800px; margin: 0 auto;">
                    <h2 style="color: #374151; font-size: 32px; margin-bottom: 10px;">
                        ${currentArticle.title}
                    </h2>
                    
                    <div style="color: #6b7280; margin-bottom: 20px; font-size: 14px;">
                        <span>Published: ${formattedDate} | By: ${isFakeNews ? 'Anonymous Source' : 'Staff Reporter'}</span>
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
                    
                    <!-- Analysis Section -->
                    <div style="background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 30px 0;">
                        <h3 style="color: #374151; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
                            <span style="background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">TRAINING</span>
                            Analyze This Article
                        </h3>
                        <div style="font-size: 14px; color: #6b7280; margin-bottom: 15px;">
                            Use the CyberQuest Analysis Tools (top-right panel) to evaluate this article's credibility.
                            Look for signs of emotional manipulation, urgent language, lack of sources, and pressure to share.
                        </div>
                        
                        <!-- Quick Analysis Questions -->
                        <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #10b981;">
                            <h4 style="color: #374151; margin: 0 0 10px 0; font-size: 14px;">Quick Analysis Questions:</h4>
                            <ul style="color: #6b7280; font-size: 13px; margin: 0; padding-left: 20px; line-height: 1.5;">
                                <li>Does the headline seem sensational or emotionally charged?</li>
                                <li>Is there clear author attribution and publication date?</li>
                                <li>Are sources and evidence properly cited?</li>
                                <li>Does the language pressure you to act quickly or share immediately?</li>
                                <li>Does the story seem too good/bad to be true?</li>
                            </ul>
                        </div>
                    </div>
                </main>
                
                <!-- Footer -->
                <footer style="background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280;">
                    <p>© 2024 Daily Politico News | Contact: tips@daily-politico-news.com</p>
                    <p style="font-size: 12px;">
                        This website is for CyberQuest training purposes. Article source: ${currentArticle.source}
                    </p>
                </footer>
            </div>
        `;
    }

    // Navigation methods for articles
    nextArticle() {
        if (this.currentArticleIndex < this.articlesData.length - 1) {
            this.currentArticleIndex++;
            this.articleData = this.articlesData[this.currentArticleIndex]; // Update for overlay tools
            this.updatePageContent();
        }
    }

    previousArticle() {
        if (this.currentArticleIndex > 0) {
            this.currentArticleIndex--;
            this.articleData = this.articlesData[this.currentArticleIndex]; // Update for overlay tools
            this.updatePageContent();
        }
    }

    updatePageContent() {
        // Find the browser content element and update it
        const browserContent = document.querySelector('#browser-content');
        if (browserContent) {
            browserContent.innerHTML = this.generateNewsPageHTML();
            
            // Re-bind navigation events
            window.challenge1Page = this;
            
            // Update the training overlay to reflect the new article
            this.updateTrainingOverlay();
        }
    }

    updateTrainingOverlay() {
        // Update the article metadata in the training overlay if it exists
        const metadataBtn = document.querySelector('#check-article-metadata');
        if (metadataBtn) {
            // The button will use the updated this.articleData when clicked
            console.log('Training overlay updated for article:', this.articleData.title.substring(0, 50) + '...');
        }
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
                    <h1 style="color: #dc2626; font-size: 24px; margin-bottom: 16px;">⚠️ Error Loading Articles</h1>
                    <p style="color: #6b7280; margin-bottom: 20px;">
                        Unable to load news articles. This could be due to missing CSV data files or a server error.
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

// Set up global reference for navigation
window.challenge1Page = new Challenge1PageClass();

// Export as page object for compatibility
export const Challenge1Page = window.challenge1Page.toPageObject();