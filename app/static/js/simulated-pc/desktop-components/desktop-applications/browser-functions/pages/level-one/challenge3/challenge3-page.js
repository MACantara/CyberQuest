import { BasePage } from '../../base-page.js';
import { ImageDisplay } from './components/image-display.js';
import { VerificationTools } from './components/verification-tools.js';
import { AnalysisForm } from './components/analysis-form.js';
import { EventHandlers } from './utils/event-handlers.js';

class Challenge3PageClass extends BasePage {
    constructor() {
        super({
            url: 'https://cyberquest.academy/level/1/challenge3',
            title: 'Image Verification Challenge - CyberQuest Academy',
            ipAddress: '198.51.100.15',
            securityLevel: 'secure',
            security: {
                isHttps: true,
                hasValidCertificate: true,
                certificate: {
                    valid: true,
                    issuer: 'CyberQuest Academy',
                    expires: BasePage.generateCertExpiration(12),
                    algorithm: 'RSA-2048',
                    trusted: true
                }
            }
        });
        
        this.eventHandlers = new EventHandlers(this);
    }

    createContent() {
        return `
            <div class="p-6 text-gray-800 bg-white">
                <header class="border-b border-gray-200 pb-4 mb-6">
                    <h1 class="text-2xl font-bold text-gray-900">Image Verification Challenge</h1>
                    <p class="text-gray-600">Learn to spot manipulated or misused images</p>
                </header>

                <div class="prose max-w-none">
                    <section class="mb-8">
                        <h2 class="text-xl font-semibold mb-4">The Viral Image</h2>
                        <p class="mb-4">The following image has been circulating on social media with the caption: "Shocking moment from yesterday's protest - police using excessive force against peaceful demonstrators."</p>
                        
                        ${ImageDisplay.render()}
                        
                        <div class="bg-blue-50 p-4 rounded-lg mb-6">
                            <h3 class="font-semibold text-blue-800 mb-2">Your Task:</h3>
                            <p class="text-blue-700">Use the tools below to verify the authenticity of this image and determine if it's being used in the correct context.</p>
                        </div>
                    </section>

                    ${VerificationTools.render()}
                    ${AnalysisForm.render()}
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

export const Challenge3Page = new Challenge3PageClass().toPageObject();
