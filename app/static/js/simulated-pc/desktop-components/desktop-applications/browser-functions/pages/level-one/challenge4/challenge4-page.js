import { BasePage } from '../../base-page.js';
import { SocialMediaPost } from './components/social-media-post.js';
import { InvestigationTools } from './components/investigation-tools.js';
import { AssessmentForm } from './components/assessment-form.js';
import { EventHandlers } from './utils/event-handlers.js';

class Challenge4PageClass extends BasePage {
    constructor() {
        super({
            url: 'https://social.cyberquest.academy/posts/controversial-claim',
            title: 'Social Media Analysis - CyberQuest Academy',
            ipAddress: '198.51.100.16',
            securityLevel: 'warning',
            security: {
                isHttps: true,
                hasValidCertificate: true,
                certificate: {
                    valid: true,
                    issuer: 'CyberQuest Academy',
                    expires: BasePage.generateCertExpiration(12),
                    algorithm: 'RSA-2048',
                    trusted: true,
                    extendedValidation: false
                },
            }
        });
        
        this.eventHandlers = new EventHandlers(this);
    }

    createContent() {
        return `
            <div class="bg-gray-100 min-h-screen">
                <!-- Social Media Header -->
                <div class="bg-white border-b border-gray-200">
                    <div class="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
                        <div class="flex items-center">
                            <svg class="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22.46 5.88c-.84.38-1.75.63-2.7.74.97-.58 1.7-1.5 2.05-2.6-.9.53-1.9.92-2.97 1.13-.85-.9-2.06-1.47-3.4-1.47-2.57 0-4.65 2.08-4.65 4.65 0 .36.04.72.12 1.06-3.86-.2-7.3-2.05-9.6-4.86-.4.7-.63 1.5-.63 2.37 0 1.62.82 3.05 2.06 3.88-.76-.02-1.47-.23-2.1-.57v.06c0 2.25 1.6 4.13 3.72 4.56-.39.1-.8.16-1.23.16-.3 0-.6-.03-.89-.08.6 1.9 2.36 3.28 4.45 3.32-1.63 1.28-3.68 2.04-5.9 2.04-.38 0-.76-.02-1.13-.06 2.1 1.35 4.6 2.13 7.28 2.13 8.73 0 13.5-7.23 13.5-13.5 0-.2 0-.4-.02-.6.93-.67 1.74-1.52 2.4-2.48z"></path>
                            </svg>
                            <span class="ml-2 font-bold text-xl">SocialMedia</span>
                        </div>
                        <div class="flex space-x-4">
                            <button class="text-blue-500 font-semibold">Home</button>
                            <button class="text-gray-600 hover:text-gray-900">Explore</button>
                            <button class="text-gray-600 hover:text-gray-900">Notifications</button>
                        </div>
                    </div>
                </div>

                <!-- Main Content -->
                <div class="max-w-2xl mx-auto px-4 py-6">
                    ${SocialMediaPost.render()}
                    
                    <!-- Practical Investigation Section -->
                    <div class="bg-white rounded-lg shadow p-6">
                        <h2 class="text-xl font-semibold mb-4 text-black">Social Media Investigation Tools</h2>
                        <p class="text-gray-600 mb-6">Use the verification tools below to investigate this post and its claims.</p>
                        
                        ${InvestigationTools.render()}
                        ${AssessmentForm.render()}
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents(contentElement) {
        this.eventHandlers.bindAllEvents(contentElement);
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

export const Challenge4Page = new Challenge4PageClass().toPageObject();
