import { BasePage } from '../../base-page.js';
import { WebsiteHeader } from './components/website-header.js';
import { ArticleContent } from './components/article-content.js';
import { Sidebar } from './components/sidebar.js';
import { WebsiteFooter } from './components/website-footer.js';
import { VerificationTools } from './components/verification-tools.js';
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
    }

    createContent() {
        return `
            <div class="min-h-screen bg-white">
                ${WebsiteHeader.render()}
                
                <!-- Main Content -->
                <div class="container mx-auto px-4 py-6">
                    <!-- Trending Alert Bar -->
                    <div class="mb-6 bg-gradient-to-r from-red-500 to-orange-500 text-white p-3 rounded-lg">
                        <div class="flex items-center justify-center">
                            <span class="animate-pulse mr-2">🔥</span>
                            <span class="font-bold">TRENDING NOW:</span>
                            <span class="ml-2">This story is going VIRAL! Over 50K shares in the last hour!</span>
                        </div>
                    </div>

                    <div class="grid lg:grid-cols-3 gap-6">
                        <!-- Main Article -->
                        <div class="lg:col-span-2">
                            ${ArticleContent.render()}
                            ${VerificationTools.render()}
                        </div>

                        <!-- Sidebar -->
                        <div class="lg:col-span-1">
                            ${Sidebar.render()}
                        </div>
                    </div>
                </div>

                ${WebsiteFooter.render()}
            </div>
        `;
    }

    bindEvents(contentElement) {
        this.eventHandlers.bindAllEvents(contentElement);
    }

    triggerChallenge2Dialogue() {
        // Import and trigger challenge 2 dialogue
        import('../../../../../../dialogues/levels/level1-misinformation-maze.js').then(module => {
            const Level1Dialogue = module.Level1MisinformationMazeDialogue;
            if (Level1Dialogue.startChallenge2Dialogue && window.desktop) {
                Level1Dialogue.startChallenge2Dialogue(window.desktop);
            }
        }).catch(error => {
            console.error('Failed to load challenge 2 dialogue:', error);
        });
    }

    // Create page object compatible with existing system
    toPageObject() {
        const pageInstance = this;
        return {
            url: this.url,
            title: this.title,
            ipAddress: this.ipAddress,
            securityLevel: this.securityLevel,
            security: this.security,
            createContent: () => this.createContent(),
            bindEvents: (contentElement) => pageInstance.bindEvents(contentElement)
        };
    }
}

export const Challenge1Page = new Challenge1PageClass().toPageObject();
