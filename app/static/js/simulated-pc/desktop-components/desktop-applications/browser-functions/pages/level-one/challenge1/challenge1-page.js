import { BasePage } from '../../base-page.js';
import { EventHandlers } from './utils/event-handlers.js';

class Challenge1PageClass extends BasePage {
    constructor() {
        super({
            url: 'https://daily-politico-news.com/breaking-news',
            title: 'BREAKING: Senator Johnson Hacking Scandal - Daily Politico News',
            ipAddress: '192.0.2.47',
            securityLevel: 'suspicious',
            useIframe: false, // Changed to false since we're not fetching external content
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
        // Store article metadata for analysis tools
        this.articleData = {
            title: 'SHOCKING: Senator Johnson Caught in Massive Hacking Scandal!',
            url: 'https://daily-politico-news.com/breaking-news',
            domain: 'daily-politico-news.com',
            is_real: false, // This is training misinformation
            tweet_count: 0
        };
    }

    createContent() {
        // Return static misinformation content for training
        return `
            <div style="font-family: Arial, sans-serif; background: #ffffff; min-height: 100vh;">
                <!-- Urgent Banner -->
                <div style="background: linear-gradient(90deg, #dc2626, #ea580c); color: white; padding: 15px; text-align: center; font-weight: bold; animation: pulse 2s infinite;">
                    🚨 BREAKING: EXCLUSIVE STORY! SHARE BEFORE IT'S CENSORED! 🚨
                </div>
                
                <!-- Header -->
                <header style="background: #1f2937; color: white; padding: 20px;">
                    <h1 style="margin: 0; font-size: 28px;">Daily Politico News</h1>
                    <p style="margin: 5px 0 0 0; color: #9ca3af;">Your Source for REAL News</p>
                </header>
                
                <!-- Main Content -->
                <main style="padding: 30px; max-width: 800px; margin: 0 auto;">
                    <h2 style="color: #dc2626; font-size: 32px; margin-bottom: 10px;">
                        SHOCKING: Senator Johnson Caught in Massive Hacking Scandal!
                    </h2>
                    
                    <div style="color: #6b7280; margin-bottom: 20px; font-size: 14px;">
                        Published: Today | By: Anonymous Source | Category: EXCLUSIVE
                    </div>
                    
                    <img src="/static/images/level-one/fake-news-image.jpg" 
                         alt="Fake scandal image" 
                         style="width: 100%; height: 300px; object-fit: cover; margin-bottom: 20px; border-radius: 8px;"
                         onerror="this.style.background='#f3f4f6'; this.alt='Image not available';">
                    
                    <div style="font-size: 18px; line-height: 1.6; color: #374151;">
                        <p><strong>EXCLUSIVE BREAKING NEWS:</strong> Senator Margaret Johnson has been caught red-handed in a massive cyber-attack scandal that will SHOCK you to your core!</p>
                        
                        <p>According to our EXCLUSIVE sources (who must remain anonymous for their safety), Senator Johnson has been secretly working with foreign hackers to steal classified government documents!</p>
                        
                        <p style="background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0;">
                            <strong>WARNING:</strong> The mainstream media is trying to HIDE this story! Share this immediately before they take it down!
                        </p>
                        
                        <p>Our investigation reveals:</p>
                        <ul style="margin: 20px 0; padding-left: 30px;">
                            <li>🔥 SECRET meetings with known cyber-criminals</li>
                            <li>🔥 MILLIONS of dollars in suspicious transactions</li>
                            <li>🔥 CLASSIFIED documents found on her personal devices</li>
                            <li>🔥 Cover-up attempts by government officials</li>
                        </ul>
                        
                        <p style="color: #dc2626; font-weight: bold;">This story is EXPLOSIVE and could change everything! The deep state doesn't want you to know the TRUTH!</p>
                    </div>
                    
                    <!-- Sharing Urgency Box -->
                    <div style="background: #dc2626; color: white; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; border: 3px solid #f59e0b;">
                        <h3 style="margin: 0 0 10px 0;">URGENT: YOUR ACTION NEEDED</h3>
                        <p style="margin: 0 0 15px 0;">Share this story immediately! Don't let the mainstream media hide the truth!</p>
                        <button style="background: #1d4ed8; color: white; padding: 12px 24px; border: none; border-radius: 4px; margin: 5px; font-weight: bold; cursor: pointer;">Share on Facebook</button>
                        <button style="background: #1da1f2; color: white; padding: 12px 24px; border: none; border-radius: 4px; margin: 5px; font-weight: bold; cursor: pointer;">Tweet Now</button>
                    </div>
                    
                    <!-- Fake Testimonials -->
                    <div style="background: #f9fafb; padding: 20px; margin: 20px 0; border-radius: 8px;">
                        <h3 style="color: #374151; margin-bottom: 15px;">What People Are Saying:</h3>
                        <blockquote style="margin: 15px 0; padding: 10px; border-left: 3px solid #10b981; background: white;">
                            "I KNEW something was fishy about her! Thanks for exposing the TRUTH!" - PatriotFreedom2024
                        </blockquote>
                        <blockquote style="margin: 15px 0; padding: 10px; border-left: 3px solid #10b981; background: white;">
                            "Finally, REAL journalism! The mainstream media would never report this!" - TruthSeeker99
                        </blockquote>
                        <blockquote style="margin: 15px 0; padding: 10px; border-left: 3px solid #10b981; background: white;">
                            "Shared this everywhere! Everyone needs to know!" - WakeUpAmerica
                        </blockquote>
                    </div>
                </main>
                
                <!-- Footer -->
                <footer style="background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280;">
                    <p>© 2024 Daily Politico News | "No catch, totally legitimate" | Contact: tips@daily-politico-news.com</p>
                    <p style="font-size: 12px;">This website is for CyberQuest training purposes and contains simulated misinformation.</p>
                </footer>
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