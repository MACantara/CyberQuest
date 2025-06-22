export class PageRenderer {
    constructor(browserApp) {
        this.browserApp = browserApp;
        this.pages = new Map();
        this.initializePages();
    }

    initializePages() {
        // Predefined pages for the simulation
        this.pages.set('https://suspicious-site.com', {
            title: 'WIN BIG NOW!',
            content: this.createSuspiciousPage(),
            securityLevel: 'dangerous'
        });

        this.pages.set('https://cyberquest.com', {
            title: 'CyberQuest Training',
            content: this.createLegitimateePage(),
            securityLevel: 'safe'
        });

        this.pages.set('https://example-bank.com', {
            title: 'Example Bank',
            content: this.createBankPage(),
            securityLevel: 'legitimate'
        });

        this.pages.set('https://phishing-bank.com', {
            title: 'Secure Banking - Login',
            content: this.createPhishingBankPage(),
            securityLevel: 'dangerous'
        });

        this.pages.set('https://news-site.com', {
            title: 'News Site',
            content: this.createNewsPage(),
            securityLevel: 'safe'
        });
    }

    renderPage(url) {
        const page = this.pages.get(url) || this.createNotFoundPage(url);
        const contentElement = this.browserApp.windowElement?.querySelector('#browser-content');
        
        if (contentElement) {
            contentElement.innerHTML = page.content;
            this.updatePageTitle(page.title);
            this.bindPageEvents(url);
        }
    }

    createSuspiciousPage() {
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
                    <p class="text-red-700 text-sm">⚠️ Warning: This is clearly a scam website. Never provide personal information to sites like this!</p>
                </div>
            </div>
        `;
    }

    createLegitimateePage() {
        return `
            <div class="p-6 text-gray-800 bg-white">
                <header class="border-b border-gray-200 pb-4 mb-6">
                    <div class="flex items-center space-x-4">
                        <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                            <i class="bi bi-shield-check text-white text-xl"></i>
                        </div>
                        <div>
                            <h1 class="text-2xl font-bold text-gray-900">CyberQuest Training Platform</h1>
                            <p class="text-gray-600">Professional Cybersecurity Education</p>
                        </div>
                    </div>
                </header>

                <main class="space-y-6">
                    <section class="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h2 class="text-lg font-semibold text-green-800 mb-2">✅ Secure Connection</h2>
                        <p class="text-green-700">This is a legitimate educational website with proper security measures.</p>
                    </section>

                    <section>
                        <h2 class="text-xl font-semibold mb-3">Training Modules</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="border border-gray-200 rounded p-4">
                                <h3 class="font-semibold">Email Security</h3>
                                <p class="text-sm text-gray-600">Learn to identify phishing attempts</p>
                            </div>
                            <div class="border border-gray-200 rounded p-4">
                                <h3 class="font-semibold">Web Security</h3>
                                <p class="text-sm text-gray-600">Recognize malicious websites</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 class="text-xl font-semibold mb-3">Contact Information</h2>
                        <div class="bg-gray-50 p-4 rounded">
                            <p><strong>Email:</strong> support@cyberquest.com</p>
                            <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                            <p><strong>Address:</strong> 123 Security Blvd, Cyber City, CC 12345</p>
                        </div>
                    </section>
                </main>
            </div>
        `;
    }

    createBankPage() {
        return `
            <div class="p-6 text-gray-800 bg-blue-50">
                <header class="border-b border-blue-200 pb-4 mb-6">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <div class="w-12 h-12 bg-blue-600 rounded flex items-center justify-center">
                                <i class="bi bi-bank text-white text-xl"></i>
                            </div>
                            <div>
                                <h1 class="text-2xl font-bold text-blue-900">Example Bank</h1>
                                <p class="text-blue-700">Secure Online Banking</p>
                            </div>
                        </div>
                        <div class="text-green-600 flex items-center">
                            <i class="bi bi-shield-check mr-1"></i>
                            <span class="text-sm">Secure</span>
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

    createPhishingBankPage() {
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
                            <span class="text-sm">Suspicious</span>
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

    createNewsPage() {
        return `
            <div class="p-6 text-gray-800 bg-white">
                <header class="border-b border-gray-200 pb-4 mb-6">
                    <h1 class="text-3xl font-bold text-gray-900">Tech News Daily</h1>
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
            </div>
        `;
    }

    createNotFoundPage(url) {
        return {
            title: 'Page Not Found',
            content: `
                <div class="p-6 text-center text-gray-800 bg-gray-100">
                    <div class="max-w-md mx-auto">
                        <i class="bi bi-exclamation-triangle text-6xl text-yellow-500 mb-4"></i>
                        <h1 class="text-2xl font-bold mb-4">Page Not Found</h1>
                        <p class="text-gray-600 mb-4">The page at <code class="bg-gray-200 px-2 py-1 rounded">${url}</code> could not be found.</p>
                        <p class="text-sm text-gray-500">This might be because the website doesn't exist in our simulation or the URL was mistyped.</p>
                        
                        <div class="mt-6">
                            <button onclick="window.browserApp?.navigation.navigateToUrl('https://cyberquest.com')" 
                                    class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                                Go to CyberQuest Home
                            </button>
                        </div>
                    </div>
                </div>
            `,
            securityLevel: 'neutral'
        };
    }

    updatePageTitle(title) {
        const windowTitle = this.browserApp.windowElement?.querySelector('.window-title span');
        if (windowTitle) {
            windowTitle.textContent = `Web Browser - ${title}`;
        }
    }
    
    bindPageEvents(url) {
        const contentElement = this.browserApp.windowElement?.querySelector('#browser-content');
        if (!contentElement) return;

        // Handle scam button clicks
        const scamButton = contentElement.querySelector('#scam-button');
        if (scamButton) {
            scamButton.addEventListener('click', () => {
                this.showScamWarning();
            });
        }

        // Handle form submissions
        const forms = contentElement.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(form, url);
            });
        });

        // Handle link clicks
        const links = contentElement.querySelectorAll('a[href]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                if (href && href !== '#') {
                    this.browserApp.navigation.navigateToUrl(href);
                }
            });
        });
    }

    showScamWarning() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md mx-4">
                <div class="text-center">
                    <i class="bi bi-shield-x text-6xl text-red-500 mb-4"></i>
                    <h2 class="text-xl font-bold text-red-600 mb-4">🚨 SCAM DETECTED! 🚨</h2>
                    <p class="text-gray-700 mb-4">
                        Good job! You've identified a scam website. In real life, clicking this button would 
                        likely lead to identity theft or financial fraud.
                    </p>
                    <div class="bg-red-50 border border-red-200 rounded p-3 mb-4">
                        <p class="text-sm text-red-700">
                            <strong>Red flags you should notice:</strong><br>
                            • Too good to be true offers<br>
                            • Urgent/pressure language<br>
                            • Suspicious domain name<br>
                            • Poor grammar/spelling
                        </p>
                    </div>
                    <button onclick="this.closest('.fixed').remove()" 
                            class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors">
                        Continue Training
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    handleFormSubmission(form, url) {
        // Show warning for sensitive forms
        if (url.includes('suspicious') || form.querySelector('input[type="password"]')) {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
            modal.innerHTML = `
                <div class="bg-white rounded-lg p-6 max-w-md mx-4">
                    <div class="text-center">
                        <i class="bi bi-exclamation-triangle text-6xl text-yellow-500 mb-4"></i>
                        <h2 class="text-xl font-bold text-yellow-600 mb-4">⚠️ SECURITY WARNING</h2>
                        <p class="text-gray-700 mb-4">
                            You're about to submit sensitive information. In a real scenario, 
                            make sure you trust the website and verify the URL before proceeding.
                        </p>
                        <div class="space-x-3">
                            <button onclick="this.closest('.fixed').remove()" 
                                    class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors">
                                Cancel
                            </button>
                            <button onclick="this.closest('.fixed').remove()" 
                                    class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                                Continue (Training)
                            </button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }
    }
}
