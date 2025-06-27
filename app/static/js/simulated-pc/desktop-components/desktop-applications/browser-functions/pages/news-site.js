import { BasePage } from './base-page.js';

class NewsSitePageClass extends BasePage {
    constructor() {
        super({
            url: 'https://news-site.com',
            title: 'Tech News Daily',
            ipAddress: '104.21.92.161',
            securityLevel: 'secure',
            security: {
                isHttps: true,
                hasValidCertificate: true,
                certificate: {
                    valid: true,
                    issuer: 'CloudFlare Inc ECC CA-3',
                    expires: BasePage.generateCertExpiration(12),
                    algorithm: 'ECDSA P-256',
                    trusted: true,
                    extendedValidation: false
                },
                threats: null,
                riskFactors: [],
                securityFeatures: [
                    'Modern ECC encryption',
                    'CloudFlare security protection',
                    'Content delivery network',
                    'DDoS protection'
                ]
            }
        });
    }

    createContent() {
        return `
            <div class="p-6 text-gray-800 bg-white">
                <header class="border-b border-gray-200 pb-4 mb-6">
                    <h1 class="text-3xl font-bold text-gray-900">${this.title}</h1>
                    <p class="text-gray-600">Latest in Technology and Cybersecurity</p>
                </header>

                <main class="space-y-6">
                    <article class="border-b border-gray-200 pb-6">
                        <h2 class="text-xl font-semibold mb-2">Cybersecurity Threats on the Rise</h2>
                        <p class="text-gray-600 text-sm mb-3">Published 2 hours ago</p>
                        <p class="text-gray-700">Security experts warn of increasing phishing attempts targeting remote workers...</p>
                        <a href="#" class="text-blue-600 hover:underline">Read more</a>
                    </article>

                    <article class="border-b border-gray-200 pb-6">
                        <h2 class="text-xl font-semibold mb-2">New Browser Security Features</h2>
                        <p class="text-gray-600 text-sm mb-3">Published 5 hours ago</p>
                        <p class="text-gray-700">Major browsers implement enhanced protection against malicious websites...</p>
                        <a href="#" class="text-blue-600 hover:underline">Read more</a>
                    </article>

                    <article>
                        <h2 class="text-xl font-semibold mb-2">Best Practices for Online Safety</h2>
                        <p class="text-gray-600 text-sm mb-3">Published 1 day ago</p>
                        <p class="text-gray-700">Learn essential tips to protect yourself from online threats...</p>
                        <a href="#" class="text-blue-600 hover:underline">Read more</a>
                    </article>
                </main>

                <div class="mt-8 bg-green-50 border border-green-200 rounded p-4">
                    <p class="text-green-700 text-sm">
                        <i class="bi bi-info-circle mr-1"></i>
                        <strong>Training Note:</strong> This is a legitimate news website. Notice the professional design, valid HTTPS certificate, and credible content focused on cybersecurity awareness.
                    </p>
                </div>
            </div>
        `;
    }
}

// Export as page object for compatibility
export const NewsSitePage = new NewsSitePageClass().toPageObject();
