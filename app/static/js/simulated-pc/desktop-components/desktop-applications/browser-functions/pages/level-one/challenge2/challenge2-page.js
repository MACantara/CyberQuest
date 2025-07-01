import { BasePage } from '../../base-page.js';
import { SourceComparison } from './components/source-comparison.js';
import { AnalysisTools } from './components/analysis-tools.js';
import { InvestigationForm } from './components/investigation-form.js';
import { EventHandlers } from './utils/event-handlers.js';

class Challenge2PageClass extends BasePage {
    constructor() {
        super({
            url: 'https://cyberquest.academy/level/1/challenge2',
            title: 'Source Comparison - CyberQuest Academy',
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
                    trusted: true,
                    extendedValidation: true
                },
                securityFeatures: [
                    'Secure connection',
                    'Educational content',
                    'Interactive learning'
                ]
            }
        });
        
        this.eventHandlers = new EventHandlers(this);
    }

    createContent() {
        return `
            <div class="p-6 text-gray-800 bg-white">
                <header class="border-b border-gray-200 pb-4 mb-6">
                    <h1 class="text-2xl font-bold text-gray-900">Source Comparison Exercise</h1>
                    <p class="text-gray-600">Analyze and compare different news sources about the same event</p>
                </header>

                <div class="prose max-w-none">
                    <section class="mb-8">
                        <h2 class="text-xl font-semibold mb-4">The Incident</h2>
                        <p class="mb-4">The following three articles all report on the same event: a protest that took place outside City Hall yesterday. Your task is to analyze each source and identify any discrepancies or signs of bias.</p>
                    </section>

                    ${SourceComparison.render()}
                    ${AnalysisTools.render()}
                    ${InvestigationForm.render()}
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

export const Challenge2Page = new Challenge2PageClass().toPageObject();
