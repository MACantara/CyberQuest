export const PhishingBankPage = {
    url: 'https://phishing-bank.com',
    title: 'Secure Banking - Login',
    securityLevel: 'dangerous',
    
    // Security configuration
    security: {
        isHttps: true,
        hasValidCertificate: false,
        certificate: {
            valid: false,
            issuer: 'Fake Certificate Authority Ltd',
            expires: '2024-01-01',
            algorithm: 'RSA 2048-bit',
            trusted: false,
            warnings: ['Domain mismatch', 'Untrusted issuer', 'Suspicious certificate'],
            domainMismatch: true
        },
        threats: {
            level: 'critical',
            type: 'phishing',
            description: 'Fake banking website designed to steal credentials and personal information',
            indicators: ['Urgent security warnings', 'Requests for sensitive data', 'Domain impersonation']
        },
        riskFactors: [
            'Credential theft',
            'Identity theft',
            'Financial fraud',
            'Account takeover',
            'Personal data harvesting'
        ]
    },

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
                                <h1 class="text-2xl font-bold text-blue-900">SecureBank Online</h1>
                                <p class="text-blue-700">Your Trusted Banking Partner</p>
                            </div>
                        </div>
                        <div class="text-red-600 flex items-center">
                            <i class="bi bi-exclamation-triangle mr-1"></i>
                            <span class="text-sm">Certificate Error</span>
                        </div>
                    </div>
                </header>

                <div class="bg-red-100 border border-red-300 rounded p-3 mb-6">
                    <div class="flex items-center">
                        <i class="bi bi-exclamation-triangle text-red-600 mr-2"></i>
                        <div>
                            <strong class="text-red-800">URGENT SECURITY ALERT!</strong>
                            <p class="text-red-700 text-sm">Your account will be suspended in 24 hours due to suspicious activity. Please verify your credentials immediately!</p>
                        </div>
                    </div>
                </div>

                <main class="space-y-6">
                    <section class="bg-white border border-red-200 rounded-lg p-6">
                        <h2 class="text-xl font-semibold text-red-900 mb-4">Emergency Account Verification Required</h2>
                        <form class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                <input type="text" class="w-full border border-gray-300 rounded px-3 py-2" placeholder="Enter your full legal name" required>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Account Number *</label>
                                <input type="text" class="w-full border border-gray-300 rounded px-3 py-2" placeholder="Enter your complete account number" required>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Social Security Number *</label>
                                <input type="text" class="w-full border border-gray-300 rounded px-3 py-2" placeholder="XXX-XX-XXXX" required>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Online Banking Password *</label>
                                <input type="password" class="w-full border border-gray-300 rounded px-3 py-2" placeholder="Enter your current password" required>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Mother's Maiden Name *</label>
                                <input type="text" class="w-full border border-gray-300 rounded px-3 py-2" placeholder="Security question answer" required>
                            </div>
                            <button type="button" class="w-full bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 transition-colors font-bold text-lg animate-pulse">
                                ⚠️ VERIFY ACCOUNT NOW - TIME SENSITIVE ⚠️
                            </button>
                        </form>
                    </section>

                    <section class="text-center">
                        <p class="text-red-600 font-bold">Act fast! Your account security depends on immediate verification!</p>
                        <p class="text-sm text-gray-600 mt-2">This is the ONLY way to prevent account closure.</p>
                    </section>
                </main>

                <div class="mt-6 bg-red-100 border border-red-300 rounded p-3">
                    <p class="text-red-700 text-sm">
                        <strong>⚠️ Training Alert:</strong> This is a classic phishing attempt! Real banks never ask for sensitive information via email or web forms like this. The urgent language, requests for personal information, and suspicious URL are all red flags.
                    </p>
                </div>
            </div>
        `;
    }
};
