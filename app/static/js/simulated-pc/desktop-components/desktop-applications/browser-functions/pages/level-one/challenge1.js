// TODO: Add webside header and footer sections
// TODO: Create a realistic leaked email instead of directly saying it

import { BasePage } from '../base-page.js';

class Challenge1PageClass extends BasePage {
    constructor() {
        super({
            url: 'https://daily-politico-news.com/breaking-news',
            title: 'BREAKING: Senator Johnson Hacking Scandal - Daily Politico News',
            ipAddress: '192.0.2.47',
            securityLevel: 'suspicious',
            security: {
                isHttps: false,
                hasValidCertificate: false,
                threats: ['Phishing attempt', 'Suspicious domain'],
                riskFactors: [
                    'No HTTPS',
                    'New domain (registered 2 weeks ago)',
                    'Sensational headline',
                    'No author information',
                    'No contact information'
                ]
            }
        });
    }

    createContent() {
        return `
            <div class="p-6 text-gray-800 bg-white">
                <header class="border-b border-red-200 pb-4 mb-6">
                    <div class="flex items-center mb-2">
                        <span class="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">EXCLUSIVE</span>
                        <span class="text-xs text-gray-500 ml-2">Updated 15 minutes ago</span>
                    </div>
                    <h1 class="text-3xl font-bold text-gray-900">SENATOR JOHNSON'S PRIVATE EMAILS HACKED: EXPLOSIVE REVELATIONS</h1>
                    <p class="text-gray-500">By Staff Reporter | <span id="article-date">${new Date().toLocaleDateString()}</span></p>
                </header>

                <div class="prose max-w-none">
                    <div class="float-right ml-6 mb-4 w-1/3 bg-gray-100 p-4 rounded-lg">
                        <img src="/static/images/level-one/senator-johnson.jpeg" alt="Senator Johnson" class="w-full h-auto rounded mb-2">
                        <p class="text-sm text-gray-600 italic">Senator Johnson in a private meeting (allegedly)</p>
                    </div>

                    <p class="lead"><strong>EXCLUSIVE:</strong> In a shocking turn of events, anonymous hackers have breached the personal email account of Senator Michael Johnson, revealing damning evidence of corruption and collusion with foreign powers.</p>
                    
                    <h2 class="text-2xl font-bold mt-6 mb-3">The Leaked Documents</h2>
                    <p>According to the leaked emails, Senator Johnson has been secretly communicating with representatives from a foreign government, promising political favors in exchange for financial contributions to his campaign.</p>
                    
                    <div class="bg-yellow-50 p-4 my-6 border-l-4 border-yellow-400">
                        <p class="font-medium">"The time has come to move forward with our plan. The payment will be processed through the usual channels. - MJ"</p>
                        <p class="text-sm text-gray-600 mt-1">- Alleged email from Senator Johnson's account</p>
                    </div>

                    <h2 class="text-2xl font-bold mt-8 mb-3">What This Means for the Election</h2>
                    <p>With the election just weeks away, this scandal could have devastating consequences for Senator Johnson's campaign. Political analysts suggest this could lead to his immediate resignation.</p>
                    <p class="mt-3">The emails also mention several other high-profile politicians who may be involved in the conspiracy.</p>

                    <div class="bg-red-50 p-4 my-6 rounded-lg border border-red-200">
                        <h3 class="font-bold text-red-700 mb-2">URGENT: YOUR ACTION NEEDED</h3>
                        <p class="text-red-700">Share this story immediately to spread awareness about government corruption! The mainstream media won't report on this!</p>
                        <div class="mt-3 flex space-x-2">
                            <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm flex items-center">
                                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
                                Tweet
                            </button>
                            <button class="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded text-sm flex items-center">
                                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path></svg>
                                Share
                            </button>
                        </div>
                    </div>

                    <div class="mt-12 pt-6 border-t border-gray-200">
                        <h3 class="text-xl font-semibold mb-4 text-red-600">🕵️ FACT-CHECK THIS STORY</h3>
                        <p class="mb-4 text-gray-700">Before sharing or believing this story, use the verification tools below to investigate these claims. This is your chance to practice real fact-checking techniques!</p>
                        
                        <div class="grid md:grid-cols-2 gap-6 mb-6">
                            <!-- Cross-Reference Tool -->
                            <div class="bg-white p-4 border border-gray-200 rounded-lg hover:border-blue-400 transition-colors shadow-sm">
                                <h4 class="font-semibold mb-2 flex items-center">
                                    <i class="bi bi-search text-blue-500 mr-2"></i>
                                    Cross-Reference This Story
                                </h4>
                                <p class="text-sm text-gray-600 mb-3">Check if credible news sources are reporting the same information about Senator Johnson's emails.</p>
                                <div class="mb-3">
                                    <p class="text-xs text-gray-500 mb-1">Try searching for:</p>
                                    <code class="bg-gray-100 px-2 py-1 rounded text-xs">"Senator Johnson email scandal"</code>
                                </div>
                                <button id="try-cross-reference" 
                                        class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm transition-colors duration-200 cursor-pointer"
                                        data-url="https://fact-checker.cyberquest.academy/cross-reference">
                                    Use Cross-Reference Tool
                                </button>
                            </div>
                            
                            <!-- Image Verification -->
                            <div class="bg-white p-4 border border-gray-200 rounded-lg hover:border-purple-400 transition-colors shadow-sm">
                                <h4 class="font-semibold mb-2 flex items-center">
                                    <i class="bi bi-camera text-purple-500 mr-2"></i>
                                    Verify the Photo
                                </h4>
                                <p class="text-sm text-gray-600 mb-3">Check if the image of Senator Johnson is authentic and being used in the correct context.</p>
                                <div class="mb-3">
                                    <p class="text-xs text-gray-500 mb-1">Tips:</p>
                                    <ul class="text-xs text-gray-500 list-disc pl-4">
                                        <li>Look for reverse image search results</li>
                                        <li>Check the image metadata</li>
                                    </ul>
                                </div>
                                <button id="try-image-search" 
                                        class="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded text-sm transition-colors duration-200 cursor-pointer"
                                        data-url="https://image-verify.cyberquest.academy/reverse-search">
                                    Use Image Verification
                                </button>
                            </div>
                        </div>
                        
                        <!-- Results Section -->
                        <div id="verification-results" class="hidden">
                            <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 mb-4">
                                <h4 class="font-semibold text-blue-800 mb-2">✅ Investigation Complete!</h4>
                                <p class="text-blue-700">After using the verification tools, what did you discover about this story?</p>
                            </div>
                            
                            <div class="space-y-4">
                                <div class="p-4 bg-gray-50 rounded-lg">
                                    <label class="block text-sm font-medium text-gray-700 mb-2">What did the Cross-Reference Tool reveal?</label>
                                    <textarea class="w-full p-2 border border-gray-300 rounded" rows="2" placeholder="Describe what you found when searching for this story across different news sources..."></textarea>
                                </div>
                                
                                <div class="p-4 bg-gray-50 rounded-lg">
                                    <label class="block text-sm font-medium text-gray-700 mb-2">What red flags indicate this might be misinformation?</label>
                                    <div class="space-y-2">
                                        <div class="flex items-start">
                                            <input type="checkbox" id="redflag1" class="mt-1 mr-2">
                                            <label for="redflag1" class="cursor-pointer text-sm">No coverage by major news outlets</label>
                                        </div>
                                        <div class="flex items-start">
                                            <input type="checkbox" id="redflag2" class="mt-1 mr-2">
                                            <label for="redflag2" class="cursor-pointer text-sm">Sensational, emotionally charged language</label>
                                        </div>
                                        <div class="flex items-start">
                                            <input type="checkbox" id="redflag3" class="mt-1 mr-2">
                                            <label for="redflag3" class="cursor-pointer text-sm">Vague sources ("anonymous hackers")</label>
                                        </div>
                                        <div class="flex items-start">
                                            <input type="checkbox" id="redflag4" class="mt-1 mr-2">
                                            <label for="redflag4" class="cursor-pointer text-sm">Urgent call to action to share immediately</label>
                                        </div>
                                        <div class="flex items-start">
                                            <input type="checkbox" id="redflag5" class="mt-1 mr-2">
                                            <label for="redflag5" class="cursor-pointer text-sm">Suspicious domain name</label>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="p-4 bg-gray-50 rounded-lg">
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Based on your investigation, is this story credible?</label>
                                    <div class="space-y-2">
                                        <div class="flex items-start">
                                            <input type="radio" id="credible-yes" name="credible" class="mt-1 mr-2">
                                            <label for="credible-yes" class="cursor-pointer text-sm">Yes, it appears to be credible</label>
                                        </div>
                                        <div class="flex items-start">
                                            <input type="radio" id="credible-no" name="credible" class="mt-1 mr-2">
                                            <label for="credible-no" class="cursor-pointer text-sm">No, it appears to be misinformation</label>
                                        </div>
                                        <div class="flex items-start">
                                            <input type="radio" id="credible-unsure" name="credible" class="mt-1 mr-2">
                                            <label for="credible-unsure" class="cursor-pointer text-sm">Unsure, need more investigation</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <button id="submitAnalysis" class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded transition-colors duration-200 cursor-pointer mt-4">
                                Submit Investigation Results
                            </button>
                        </div>
                        
                        <!-- Hint Section -->
                        <div class="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400 mt-6">
                            <h4 class="font-semibold text-yellow-800 mb-2">💡 Investigation Tips</h4>
                            <ul class="text-yellow-700 text-sm space-y-1">
                                <li>• Use both verification tools to get a complete picture</li>
                                <li>• Pay attention to what credible sources are (or aren't) reporting</li>
                                <li>• Look for specific red flags in the language and presentation</li>
                                <li>• Consider the source of this website itself</li>
                            </ul>
                        </div>
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
                window.dispatchEvent(new CustomEvent('navigate-browser', { detail: { url } }));
                this.showVerificationResults(contentElement);
            });
        }

        // Handle image search tool button
        const imageSearchBtn = contentElement.querySelector('#try-image-search');
        if (imageSearchBtn) {
            imageSearchBtn.addEventListener('click', () => {
                const url = imageSearchBtn.getAttribute('data-url');
                window.dispatchEvent(new CustomEvent('navigate-browser', { detail: { url } }));
                this.showVerificationResults(contentElement);
            });
        }

        // Handle submit analysis button
        const submitBtn = contentElement.querySelector('#submitAnalysis');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                this.showAnalysisResults(contentElement);
            });
        }
    }

    showVerificationResults(contentElement) {
        // Show the results section after a short delay to simulate tool usage
        setTimeout(() => {
            const resultsSection = contentElement.querySelector('#verification-results');
            if (resultsSection) {
                resultsSection.classList.remove('hidden');
                resultsSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 1000);
    }

    showAnalysisResults(contentElement) {
        const credibleChoice = contentElement.querySelector('input[name="credible"]:checked');
        
        let message = '';
        let bgColor = '';
        let textColor = '';
        
        if (credibleChoice) {
            if (credibleChoice.id === 'credible-no') {
                message = '🎉 Excellent work! You correctly identified this as misinformation. The cross-reference tool shows no credible sources are reporting this story, and it has multiple red flags.';
                bgColor = 'bg-green-100';
                textColor = 'text-green-800';
            } else if (credibleChoice.id === 'credible-yes') {
                message = '⚠️ Not quite. This story is actually misinformation. Review the cross-reference results - no credible news sources are reporting this story, which is a major red flag.';
                bgColor = 'bg-orange-100';
                textColor = 'text-orange-800';
            } else {
                message = '🤔 Good to be cautious! The verification tools show clear evidence this is misinformation - check the cross-reference results showing zero credible sources.';
                bgColor = 'bg-blue-100';
                textColor = 'text-blue-800';
            }
        } else {
            message = 'Please select whether you think this story is credible based on your investigation.';
            bgColor = 'bg-gray-100';
            textColor = 'text-gray-800';
            return;
        }

        // Show results modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-lg mx-4">
                <div class="text-center">
                    <div class="${bgColor} p-4 rounded-lg mb-4">
                        <p class="${textColor} font-medium">${message}</p>
                    </div>
                    <div class="text-sm text-gray-600 mb-4">
                        <p><strong>Key Learning Points:</strong></p>
                        <ul class="text-left mt-2 space-y-1">
                            <li>• Always cross-reference suspicious claims with credible sources</li>
                            <li>• Be wary of emotional language and urgent calls to action</li>
                            <li>• Check the website's credibility and security status</li>
                            <li>• Verify images and their original context</li>
                        </ul>
                    </div>
                    <button onclick="this.closest('.fixed').remove()" 
                            class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">
                        Continue Training
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
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

export const Challenge1Page = new Challenge1PageClass().toPageObject();
