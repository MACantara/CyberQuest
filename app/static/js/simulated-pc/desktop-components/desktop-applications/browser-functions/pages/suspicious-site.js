import { BasePage } from './base-page.js';

class SuspiciousSitePageClass extends BasePage {
    constructor() {
        super({
            url: 'https://suspicious-site.com',
            title: 'WIN BIG NOW!',
            ipAddress: '45.227.253.144',
            securityLevel: 'dangerous',
            security: {
                isHttps: true,
                hasValidCertificate: false,
                certificate: {
                    valid: false,
                    issuer: 'Self-signed Certificate Authority',
                    expires: BasePage.generateCertExpiration(-1), // Expired
                    algorithm: 'RSA 1024-bit',
                    trusted: false,
                    selfSigned: true,
                    warnings: ['Self-signed certificate', 'Weak encryption', 'Expired certificate']
                },
                threats: {
                    level: 'high',
                    type: 'scam',
                    description: 'Known scam website attempting to steal personal information',
                    indicators: ['Too good to be true offers', 'Urgent language', 'Suspicious domain']
                },
                riskFactors: [
                    'Fraudulent prize claims',
                    'Identity theft attempts',
                    'Credit card fraud',
                    'Personal data harvesting'
                ]
            }
        });
    }

    createContent() {
        return `
            <div class="p-5 text-center text-black bg-gradient-to-br from-red-100 to-orange-100">
                <div class="animate-pulse mb-4">
                    <h1 class="text-4xl font-bold text-red-600 mb-2" id="scam-headline">🎉 CONGRATULATIONS! YOU'VE WON! 🎉</h1>
                    <div class="text-2xl text-yellow-600 font-bold">$1,000,000 CASH PRIZE!</div>
                </div>
                
                <div class="bg-yellow-200 border-2 border-yellow-400 rounded p-4 mb-6">
                    <p class="text-lg font-semibold mb-2">🔥 LIMITED TIME OFFER! 🔥</p>
                    <p class="mb-4">You are visitor #999,999 and have been selected to receive this exclusive prize!</p>
                    <p class="text-sm text-red-600 font-bold">CLAIM NOW OR LOSE FOREVER!</p>
                </div>

                <div class="mb-6">
                    <button class="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-lg font-bold text-xl animate-bounce hover:scale-105 transition-transform duration-200 shadow-lg" id="scam-button">
                        💰 CLAIM YOUR PRIZE NOW! 💰
                    </button>
                </div>

                <div class="text-sm text-gray-600 space-y-2">
                    <p id="fake-disclaimer">* No catch, totally legitimate *</p>
                    <p>* 100% Real, Not a Scam *</p>
                    <p class="text-xs">By clicking above, you agree to provide your bank details and social security number</p>
                </div>

                <div class="mt-6 bg-red-100 border border-red-300 rounded p-3">
                    <p class="text-red-700 text-sm">⚠️ Training Alert: This is clearly a scam website. Never provide personal information to sites like this!</p>
                </div>
            </div>
        `;
    }
}

// Export as page object for compatibility
export const SuspiciousSitePage = new SuspiciousSitePageClass().toPageObject();
