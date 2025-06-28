import { BasePage } from '../base-page.js';

class TutorialPageClass extends BasePage {
    constructor() {
        super({
            url: 'https://cyberquest.academy/level/1/tutorial',
            title: 'Media Literacy 101 - CyberQuest Academy',
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
                        <h2 class="text-2xl font-semibold mb-4">Practice Scenario</h2>
                        <div class="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400 mb-6">
                            <p class="font-medium text-yellow-800">Breaking News: Senator's Private Emails Leaked!</p>
                            <p class="text-yellow-700">A website you've never heard of claims to have exclusive access to private emails from a senator's personal account.</p>
                        </div>
                        
                        <div class="space-y-4">
                            <p class="font-medium">What would you do?</p>
                            <div class="space-y-2">
                                <div class="flex items-start">
                                    <input type="radio" id="option1" name="scenario" class="mt-1 mr-2" checked>
                                    <label for="option1" class="cursor-pointer">Share it immediately because it's important people know</label>
                                </div>
                                <div class="flex items-start">
                                    <input type="radio" id="option2" name="scenario" class="mt-1 mr-2">
                                    <label for="option2" class="cursor-pointer">Check if reputable news sources are reporting the same information</label>
                                </div>
                                <div class="flex items-start">
                                    <input type="radio" id="option3" name="scenario" class="mt-1 mr-2">
                                    <label for="option3" class="cursor-pointer">Look for the original source and verify its credibility</label>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div class="bg-green-50 p-4 rounded-lg border-l-4 border-green-500 mt-8">
                        <h3 class="font-semibold text-green-800 mb-2">Ready to test your skills?</h3>
                        <p class="text-green-700 mb-4">In the next exercise, you'll analyze a real-world example and apply what you've learned.</p>
                        <button id="startChallenge" class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200">
                            Start Challenge 1
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}

export const TutorialPage = new TutorialPageClass().toPageObject();
