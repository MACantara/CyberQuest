import { BasePage } from '../pages/base-page.js';

class CrossReferenceToolPageClass extends BasePage {
    constructor() {
        super({
            url: 'https://fact-checker.cyberquest.academy/cross-reference',
            title: 'Cross-Reference Tool - CyberQuest Academy',
            ipAddress: '198.51.100.17',
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
                    'Fact-checking tool',
                    'Educational content'
                ]
            }
        });
    }

    createContent() {
        return `
            <div class="p-6 text-gray-800 bg-white">
                <header class="border-b border-gray-200 pb-4 mb-6">
                    <h1 class="text-3xl font-bold text-gray-900">Cross-Reference Tool</h1>
                    <p class="text-gray-600">Verify information by checking multiple reliable sources</p>
                </header>

                <div class="prose max-w-none">
                    <section class="mb-8">
                        <div class="bg-blue-50 p-4 rounded-lg mb-6">
                            <h2 class="text-xl font-semibold text-blue-800 mb-2">How to Use This Tool</h2>
                            <p class="text-blue-700">Enter a news claim or headline below to see how it's being reported across different news sources.</p>
                        </div>
                        
                        <div class="mb-6">
                            <label for="search-query" class="block text-sm font-medium text-gray-700 mb-2">Enter claim or headline to verify:</label>
                            <div class="flex gap-3">
                                <input type="text" 
                                       id="search-query" 
                                       class="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                       placeholder="e.g., 'Senator Johnson email scandal'">
                                <button id="search-btn" 
                                        class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 cursor-pointer">
                                    Search Sources
                                </button>
                            </div>
                        </div>
                    </section>

                    <section id="search-results" class="hidden">
                        <h2 class="text-2xl font-semibold mb-6">Cross-Reference Results</h2>
                        
                        <div class="grid md:grid-cols-1 gap-6 mb-8">
                            <!-- Credible Sources -->
                            <div class="bg-green-50 border border-green-200 rounded-lg p-6">
                                <h3 class="text-lg font-semibold text-green-800 mb-4 flex items-center">
                                    <i class="bi bi-check-circle-fill text-green-600 mr-2"></i>
                                    Credible News Sources
                                </h3>
                                <div id="credible-sources" class="space-y-4">
                                    <!-- Results will be populated here -->
                                </div>
                            </div>
                            
                            <!-- Questionable Sources -->
                            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                                <h3 class="text-lg font-semibold text-yellow-800 mb-4 flex items-center">
                                    <i class="bi bi-exclamation-triangle-fill text-yellow-600 mr-2"></i>
                                    Questionable Sources
                                </h3>
                                <div id="questionable-sources" class="space-y-4">
                                    <!-- Results will be populated here -->
                                </div>
                            </div>
                            
                            <!-- No Coverage -->
                            <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
                                <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <i class="bi bi-info-circle-fill text-gray-600 mr-2"></i>
                                    Analysis Summary
                                </h3>
                                <div id="analysis-summary">
                                    <!-- Analysis will be populated here -->
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-blue-50 p-4 rounded-lg">
                            <h3 class="font-semibold text-blue-800 mb-2">What This Tells Us</h3>
                            <div id="credibility-assessment" class="text-blue-700">
                                <!-- Assessment will be populated here -->
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        `;
    }

    // Method to bind events after content is rendered
    bindEvents(contentElement) {
        const searchBtn = contentElement.querySelector('#search-btn');
        const searchQuery = contentElement.querySelector('#search-query');
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.performSearch(contentElement);
            });
        }

        if (searchQuery) {
            searchQuery.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(contentElement);
                }
            });
        }
    }

    performSearch(contentElement) {
        const query = contentElement.querySelector('#search-query').value.trim();
        if (!query) {
            alert('Please enter a claim or headline to search for.');
            return;
        }
        
        // Show loading state
        const btn = contentElement.querySelector('#search-btn');
        const originalText = btn.textContent;
        btn.textContent = 'Searching...';
        btn.disabled = true;
        
        // Simulate search delay
        setTimeout(() => {
            this.performCrossReference(query, contentElement);
            btn.textContent = originalText;
            btn.disabled = false;
        }, 2000);
    }

    performCrossReference(query, contentElement) {
        const resultsSection = contentElement.querySelector('#search-results');
        const credibleSources = contentElement.querySelector('#credible-sources');
        const questionableSources = contentElement.querySelector('#questionable-sources');
        const analysisSummary = contentElement.querySelector('#analysis-summary');
        const credibilityAssessment = contentElement.querySelector('#credibility-assessment');
        
        // Simulate different results based on query content
        if (query.toLowerCase().includes('senator') && query.toLowerCase().includes('email')) {
            // Scenario: Senator email scandal (fake news)
            credibleSources.innerHTML = `
                <div class="bg-white p-4 border border-green-200 rounded">
                    <div class="flex items-start justify-between mb-2">
                        <h4 class="font-semibold text-green-800">Reuters</h4>
                        <span class="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">High Trust</span>
                    </div>
                    <p class="text-sm text-gray-700 mb-2">No articles found matching this claim.</p>
                    <p class="text-xs text-gray-500">Last updated: 2 hours ago</p>
                </div>
                <div class="bg-white p-4 border border-green-200 rounded">
                    <div class="flex items-start justify-between mb-2">
                        <h4 class="font-semibold text-green-800">Associated Press</h4>
                        <span class="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">High Trust</span>
                    </div>
                    <p class="text-sm text-gray-700 mb-2">No coverage of this story found.</p>
                    <p class="text-xs text-gray-500">Last updated: 1 hour ago</p>
                </div>
                <div class="bg-white p-4 border border-green-200 rounded">
                    <div class="flex items-start justify-between mb-2">
                        <h4 class="font-semibold text-green-800">BBC News</h4>
                        <span class="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">High Trust</span>
                    </div>
                    <p class="text-sm text-gray-700 mb-2">No recent articles about Senator Johnson email controversy.</p>
                    <p class="text-xs text-gray-500">Last updated: 3 hours ago</p>
                </div>
            `;
            
            questionableSources.innerHTML = `
                <div class="bg-white p-4 border border-yellow-200 rounded">
                    <div class="flex items-start justify-between mb-2">
                        <h4 class="font-semibold text-yellow-800">Daily Politico News</h4>
                        <span class="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">Low Trust</span>
                    </div>
                    <p class="text-sm text-gray-700 mb-2">"SENATOR JOHNSON'S PRIVATE EMAILS HACKED: EXPLOSIVE REVELATIONS"</p>
                    <p class="text-xs text-gray-500">Domain registered: 2 weeks ago | No author listed</p>
                </div>
                <div class="bg-white p-4 border border-yellow-200 rounded">
                    <div class="flex items-start justify-between mb-2">
                        <h4 class="font-semibold text-yellow-800">Truth-Seekers-Blog.net</h4>
                        <span class="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">Unreliable</span>
                    </div>
                    <p class="text-sm text-gray-700 mb-2">"BREAKING: Senator's Corruption EXPOSED in Leaked Emails!"</p>
                    <p class="text-xs text-gray-500">Anonymous blog | No verification</p>
                </div>
            `;
            
            analysisSummary.innerHTML = `
                <ul class="space-y-2 text-gray-700">
                    <li class="flex items-start">
                        <i class="bi bi-x-circle text-red-500 mr-2 mt-0.5"></i>
                        <span><strong>0 out of 10</strong> major news outlets are reporting this story</span>
                    </li>
                    <li class="flex items-start">
                        <i class="bi bi-exclamation-triangle text-yellow-500 mr-2 mt-0.5"></i>
                        <span>Story only appears on <strong>2 questionable websites</strong></span>
                    </li>
                    <li class="flex items-start">
                        <i class="bi bi-calendar-x text-orange-500 mr-2 mt-0.5"></i>
                        <span>No established news organization has covered this claim</span>
                    </li>
                </ul>
            `;
            
            credibilityAssessment.innerHTML = `
                <div class="p-3 bg-red-100 border border-red-300 rounded mb-3">
                    <p class="font-semibold text-red-800">🚨 HIGH PROBABILITY OF MISINFORMATION</p>
                    <p class="text-red-700 text-sm mt-1">This claim is likely false or unverified. Major news organizations are not reporting this story, and it only appears on questionable sources.</p>
                </div>
                <p class="text-sm"><strong>Recommendation:</strong> Do not share this information without verification from credible sources.</p>
            `;
        } else {
            // Default scenario for other queries
            credibleSources.innerHTML = `
                <div class="bg-white p-4 border border-green-200 rounded">
                    <div class="flex items-start justify-between mb-2">
                        <h4 class="font-semibold text-green-800">Search Results</h4>
                        <span class="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">Analyzing...</span>
                    </div>
                    <p class="text-sm text-gray-700">Cross-referencing your query across major news sources...</p>
                </div>
            `;
            
            questionableSources.innerHTML = `
                <div class="bg-white p-4 border border-yellow-200 rounded">
                    <p class="text-sm text-gray-700">Checking questionable and low-trust sources...</p>
                </div>
            `;
            
            analysisSummary.innerHTML = `
                <p class="text-gray-700">Analysis in progress. This tool helps identify misinformation by checking if credible news sources are reporting the same information.</p>
            `;
            
            credibilityAssessment.innerHTML = `
                <p>Try searching for "Senator Johnson email scandal" to see a demonstration of how this tool works.</p>
            `;
        }
        
        // Show results section
        resultsSection.classList.remove('hidden');
        resultsSection.scrollIntoView({ behavior: 'smooth' });
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

export const CrossReferenceToolPage = new CrossReferenceToolPageClass().toPageObject();
