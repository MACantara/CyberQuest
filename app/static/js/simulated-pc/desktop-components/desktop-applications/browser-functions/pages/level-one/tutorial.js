// TODO: Replace the multiple choice practice scenario into a practical example

import { BasePage } from '../base-page.js';

class TutorialPageClass extends BasePage {
    constructor() {
        super({
            url: 'https://cyberquest.academy/level/1/tutorial',
            title: 'Media Literacy 101 - CyberQuest Academy',
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
    }

    createContent() {
        return `
            <div class="p-6 text-gray-800 bg-white">
                <header class="border-b border-gray-200 pb-4 mb-6">
                    <h1 class="text-3xl font-bold text-gray-900">Media Literacy 101</h1>
                    <p class="text-gray-600">Your first step in identifying misinformation</p>
                </header>

                <div class="prose max-w-none">
                    <section class="mb-8">
                        <h2 class="text-2xl font-semibold mb-4">Welcome, Cadet!</h2>
                        <p class="mb-4">You've been assigned to investigate a viral story about a major political figure being hacked. Before we dive in, let's cover some basics of media literacy.</p>
                        
                        <div class="bg-blue-50 p-4 rounded-lg mb-6">
                            <h3 class="font-semibold text-blue-800 mb-2">Your Mission:</h3>
                            <p class="text-blue-700">Learn to identify fake news and stop misinformation from influencing the upcoming election.</p>
                        </div>
                    </section>

                    <section class="mb-8">
                        <h2 class="text-2xl font-semibold mb-4">Key Concepts</h2>
                        
                        <div class="grid md:grid-cols-2 gap-6 mb-6">
                            <div class="bg-white p-4 rounded-lg shadow border border-gray-200">
                                <h3 class="font-semibold text-lg mb-2">1. Source Verification</h3>
                                <p class="text-gray-700 mb-3">Always check the source of information. Reputable news organizations have editorial standards and fact-checking processes.</p>
                                <div class="text-sm bg-gray-100 p-2 rounded">
                                    <p class="font-medium">Tip:</p>
                                    <p>Look for "About Us" pages and author credentials.</p>
                                </div>
                            </div>
                            
                            <div class="bg-white p-4 rounded-lg shadow border border-gray-200">
                                <h3 class="font-semibold text-lg mb-2">2. Cross-Referencing</h3>
                                <p class="text-gray-700 mb-3">Check if other reliable sources are reporting the same information.</p>
                                <div class="text-sm bg-gray-100 p-2 rounded">
                                    <p class="font-medium">Tip:</p>
                                    <p>Use fact-checking websites like Snopes or FactCheck.org.</p>
                                </div>
                            </div>
                            
                            <div class="bg-white p-4 rounded-lg shadow border border-gray-200">
                                <h3 class="font-semibold text-lg mb-2">3. Emotional Language</h3>
                                <p class="text-gray-700 mb-3">Sensational or emotionally charged language is often a red flag for misinformation.</p>
                                <div class="text-sm bg-gray-100 p-2 rounded">
                                    <p class="font-medium">Example:</p>
                                    <p>"SHOCKING REVELATION!" vs. "New report suggests..."</p>
                                </div>
                            </div>
                            
                            <div class="bg-white p-4 rounded-lg shadow border border-gray-200">
                                <h3 class="font-semibold text-lg mb-2">4. Image Verification</h3>
                                <p class="text-gray-700 mb-3">Images can be manipulated or taken out of context.</p>
                                <div class="text-sm bg-gray-100 p-2 rounded">
                                    <p class="font-medium">Tip:</p>
                                    <p>Use reverse image search to verify when and where an image was first published.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section class="mb-8">
                        <h2 class="text-2xl font-semibold mb-4">Hands-On Practice</h2>
                        <div class="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400 mb-6">
                            <p class="font-medium text-yellow-800">Breaking News: Senator's Private Emails Leaked!</p>
                            <p class="text-yellow-700">A website you've never heard of claims to have exclusive access to private emails from a senator's personal account.</p>
                        </div>
                        
                        <div class="space-y-4">
                            <p class="font-medium">Try the verification tools to investigate this claim:</p>
                            
                            <div class="grid md:grid-cols-2 gap-4">
                                <div class="bg-white p-4 border border-gray-200 rounded-lg hover:border-blue-400 transition-colors">
                                    <h4 class="font-semibold mb-2 flex items-center">
                                        <i class="bi bi-search text-blue-500 mr-2"></i>
                                        Cross-Reference Tool
                                    </h4>
                                    <p class="text-sm text-gray-600 mb-3">Check if credible news sources are reporting this story</p>
                                    <button id="try-cross-reference" 
                                            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm transition-colors duration-200 cursor-pointer"
                                            data-url="https://fact-checker.cyberquest.academy/cross-reference">
                                        Try Cross-Reference
                                    </button>
                                </div>
                                
                                <div class="bg-white p-4 border border-gray-200 rounded-lg hover:border-purple-400 transition-colors">
                                    <h4 class="font-semibold mb-2 flex items-center">
                                        <i class="bi bi-camera text-purple-500 mr-2"></i>
                                        Image Verification
                                    </h4>
                                    <p class="text-sm text-gray-600 mb-3">Verify if images are authentic and in correct context</p>
                                    <button id="try-image-search" 
                                            class="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded text-sm transition-colors duration-200 cursor-pointer"
                                            data-url="https://image-verify.cyberquest.academy/reverse-search">
                                        Try Image Search
                                    </button>
                                </div>
                            </div>
                            
                            <div class="bg-gray-50 p-4 rounded-lg mt-4">
                                <h4 class="font-semibold mb-2 text-gray-800">Quick Tips for This Scenario:</h4>
                                <ul class="text-sm text-gray-700 space-y-1">
                                    <li>• Look up "Senator Johnson email scandal" in the cross-reference tool</li>
                                    <li>• Check if major news outlets like Reuters, BBC, or AP are covering this</li>
                                    <li>• Be suspicious of stories that only appear on unknown websites</li>
                                    <li>• Verify any images associated with the story</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <div class="bg-green-50 p-4 rounded-lg border-l-4 border-green-500 mt-8">
                        <h3 class="font-semibold text-green-800 mb-2">Ready for the real challenge?</h3>
                        <p class="text-green-700 mb-4">After practicing with the tools above, test your skills on the actual suspicious news story.</p>
                        <button id="startChallenge" class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200 cursor-pointer" data-url="https://daily-politico-news.com/breaking-news">
                            Start Challenge 1
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Method to bind events after content is rendered
    bindEvents(contentElement) {
        // Handle cross-reference tool button
        const crossRefBtn = contentElement.querySelector('#try-cross-reference');
        if (crossRefBtn) {
            crossRefBtn.addEventListener('click', () => {
                const url = crossRefBtn.getAttribute('data-url');
                // Navigate to cross-reference tool (this will be handled by the browser navigation)
                window.dispatchEvent(new CustomEvent('navigate-browser', { detail: { url } }));
            });
        }

        // Handle image search tool button
        const imageSearchBtn = contentElement.querySelector('#try-image-search');
        if (imageSearchBtn) {
            imageSearchBtn.addEventListener('click', () => {
                const url = imageSearchBtn.getAttribute('data-url');
                // Navigate to image search tool
                window.dispatchEvent(new CustomEvent('navigate-browser', { detail: { url } }));
            });
        }

        // Handle start challenge button
        const startBtn = contentElement.querySelector('#startChallenge');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                const url = startBtn.getAttribute('data-url');
                window.dispatchEvent(new CustomEvent('navigate-browser', { detail: { url } }));
            });
        }
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

export const TutorialPage = new TutorialPageClass().toPageObject();
