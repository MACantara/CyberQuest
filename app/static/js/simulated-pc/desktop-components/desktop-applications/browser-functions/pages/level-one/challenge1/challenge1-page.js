import { BasePage } from '../../base-page.js';
import { EventHandlers } from './utils/event-handlers.js';
import { ArticleFormatter } from './utils/article-formatter.js';
import { ArticleImage } from './components/article-image.js';
import { SharingBox } from './components/sharing-box.js';
import { ProgressBar } from './components/progress-bar.js';
import { ArticleService } from './services/article-service.js';

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
                this.articlesData = await ArticleService.fetchMixedNewsArticles();
                
                // Log batch analysis availability
                const batchAnalysisCount = this.articlesData.filter(article => 
                    article.batchAnalysis && Object.keys(article.batchAnalysis).length > 0
                ).length;
                console.log(`Articles loaded: ${this.articlesData.length}, Batch analysis available: ${batchAnalysisCount}`);
                
                // Log detailed info about first article's batch analysis
                if (this.articlesData.length > 0 && this.articlesData[0].batchAnalysis) {
                    console.log('First article batch analysis:', {
                        clickableElements: this.articlesData[0].batchAnalysis.clickable_elements?.length || 0,
                        metadata: this.articlesData[0].batchAnalysis.article_metadata?.title?.substring(0, 50) || 'No title'
                    });
                }
                
                // Update page metadata based on the first article
                this.title = `${this.articlesData[0].title} - Daily Politico News`;
                this.articleData = this.articlesData[0]; // Set current article for overlay tools
            } catch (error) {
                console.error('Failed to fetch mixed news articles:', error);
                return ArticleService.createErrorContent();
            }
        }

        return this.generateNewsPageHTML();
    }

    generateNewsPageHTML() {
        if (this.articlesData.length === 0) {
            return ArticleService.createErrorContent();
        }

        const currentArticle = this.articlesData[this.currentArticleIndex];
        
        // Format the published date for display
        const formattedDate = ArticleFormatter.formatDate(currentArticle.published);
        
        // Truncate text if too long for better display
        const displayText = ArticleFormatter.truncateText(currentArticle.text, 1200);
        
        // Add suspicious elements only subtly for fake news
        const isFakeNews = !currentArticle.is_real;
        
        return `
            <div style="font-family: Arial, sans-serif; background: #ffffff; min-height: 100vh;">
                <!-- Header -->
                <header style="background: #1f2937; color: white; padding: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h1 style="margin: 0; font-size: 28px;">Daily Politico News</h1>
                            <p style="margin: 5px 0 0 0; color: #9ca3af;">Your Source for News and Analysis</p>
                        </div>
                        
                        <!-- Progress Bar -->
                        ${ProgressBar.create(this.currentArticleIndex, this.articlesData.length)}
                    </div>
                </header>
                
                <!-- Main Content -->
                <main style="padding: 30px; max-width: 800px; margin: 0 auto;">
                    <h2 style="color: #374151; font-size: 32px; margin-bottom: 10px;" data-element-type="title" data-element-id="title_analysis">
                        ${ArticleFormatter.toTitleCase(currentArticle.title)}
                    </h2>
                    
                    <div style="color: #6b7280; margin-bottom: 20px; font-size: 14px; display: flex; gap: 10px; flex-wrap: wrap;">
                        <span data-element-type="date" data-element-id="date_analysis" style="padding: 2px 4px; border-radius: 3px;">Published: ${formattedDate}</span>
                        <span style="color: #d1d5db;">|</span>
                        <span data-element-type="author" data-element-id="author_analysis" style="padding: 2px 4px; border-radius: 3px;">By: ${currentArticle.author || 'Staff Reporter'}</span>
                    </div>
                    
                    <!-- Article Image -->
                    ${ArticleImage.create(currentArticle, isFakeNews)}
                    
                    <!-- Article Text -->
                    <div style="font-size: 18px; line-height: 1.6; color: #374151;" data-element-type="content" data-element-id="content_analysis">
                        ${ArticleFormatter.formatArticleText(displayText, isFakeNews, currentArticle)}
                    </div>
                    
                    <!-- Social Media Sharing Box -->
                    ${SharingBox.create(isFakeNews)}
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
        }
    }

    updateTrainingOverlay() {
        // Check if we have an analysis overlay and update it
        const pageRenderer = this.getPageRenderer();
        if (pageRenderer && pageRenderer.analysisOverlay) {
            pageRenderer.analysisOverlay.updateForNewArticle(this.toPageObject());
        }
    }

    getPageRenderer() {
        // Get the page renderer from the browser app
        const browserApp = document.querySelector('#browser-content')?.closest('.window')?.browserApp;
        return browserApp?.pageRenderer;
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
            bindEvents: (contentElement) => pageInstance.bindEvents(contentElement),
            articleData: pageInstance.articleData // Make sure articleData is accessible
        };
    }
}

// Set up global reference for navigation
window.challenge1Page = new Challenge1PageClass();

// Export as page object for compatibility
export const Challenge1Page = window.challenge1Page.toPageObject();