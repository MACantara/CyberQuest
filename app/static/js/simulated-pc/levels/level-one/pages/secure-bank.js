import { BasePage } from './base-page.js';

class ExampleBankPageClass extends BasePage {
    constructor() {
        super({
            url: 'https://securebank.com',
            title: 'SecureBank Online',
            ipAddress: '192.0.78.24',
            securityLevel: 'secure-ev',
            security: {
                isHttps: true,
                hasValidCertificate: true,
                certificate: {
                    valid: true,
                    issuer: 'DigiCert SHA2 Extended Validation Server CA',
                    expires: BasePage.generateCertExpiration(12),
                    algorithm: 'RSA 4096-bit',
                    trusted: true,
                    extendedValidation: true,
                    organizationName: 'SecureBank Corporation',
                    country: 'US'
                },
                threats: null,
                riskFactors: [],
                securityFeatures: [
                    'Extended Validation certificate',
                    'Organization identity verified',
                    'Strong 4096-bit encryption',
                    'Premium security standards',
                    'Regular security audits'
                ]
            }
        });
    }

    createContent() {
        return `
            <div class="p-6 text-gray-800 bg-blue-50">
                <header class="border-b border-blue-200 pb-4 mb-6">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <div class="w-12 h-12 bg-blue-600 rounded flex items-center justify-center">
                                <i class="bi bi-bank text-white text-xl"></i>
                            </div>
                            <div>
                                <h1 class="text-2xl font-bold text-blue-900">${this.title}</h1>
                                <p class="text-blue-700">Secure Online Banking</p>
                            </div>
                        </div>
                        <div class="text-green-600 flex items-center">
                            <i class="bi bi-shield-check mr-1"></i>
                            <span class="text-sm">Extended Validation</span>
                        </div>
                    </div>
                </header>

                <main class="space-y-6">
                    <section class="bg-white border border-blue-200 rounded-lg p-6">
                        <h2 class="text-xl font-semibold text-blue-900 mb-4">Account Login</h2>
                        <form class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <input type="text" class="w-full border border-gray-300 rounded px-3 py-2" placeholder="Enter your username">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input type="password" class="w-full border border-gray-300 rounded px-3 py-2" placeholder="Enter your password">
                            </div>
                            <button type="button" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">
                                Sign In
                            </button>
                        </form>
                    </section>

                    <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="bg-white p-4 rounded border border-blue-200">
                            <h3 class="font-semibold text-blue-900">Security Notice</h3>
                            <p class="text-sm text-gray-600 mt-2">We will never ask for your login credentials via email or phone.</p>
                        </div>
                        <div class="bg-white p-4 rounded border border-blue-200">
                            <h3 class="font-semibold text-blue-900">Contact Us</h3>
                            <p class="text-sm text-gray-600 mt-2">Call 1-800-BANK-123 for assistance.</p>
                        </div>
                        <div class="bg-white p-4 rounded border border-blue-200">
                            <h3 class="font-semibold text-blue-900">Hours</h3>
                            <p class="text-sm text-gray-600 mt-2">Available 24/7 for online banking.</p>
                        </div>
                    </section>
                </main>

            </div>
        `;
    }
}

// Export as page object for compatibility
export const ExampleBankPage = new ExampleBankPageClass().toPageObject();
