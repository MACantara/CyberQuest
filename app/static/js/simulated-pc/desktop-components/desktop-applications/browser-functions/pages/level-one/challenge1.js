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
                        <h3 class="text-lg font-semibold mb-3">Analyze This Article</h3>
                        <div class="space-y-4">
                            <div class="p-4 bg-gray-50 rounded-lg">
                                <label class="block text-sm font-medium text-gray-700 mb-2">1. What makes you question the credibility of this article?</label>
                                <textarea class="w-full p-2 border border-gray-300 rounded" rows="3" placeholder="Type your analysis here..."></textarea>
                            </div>
                            
                            <div class="p-4 bg-gray-50 rounded-lg">
                                <label class="block text-sm font-medium text-gray-700 mb-2">2. What evidence would you look for to verify these claims?</label>
                                <textarea class="w-full p-2 border border-gray-300 rounded" rows="3" placeholder="List the types of evidence..."></textarea>
                            </div>
                            
                            <div class="p-4 bg-gray-50 rounded-lg">
                                <label class="block text-sm font-medium text-gray-700 mb-2">3. How would you respond if someone shared this with you?</label>
                                <div class="space-y-2">
                                    <div class="flex items-start">
                                        <input type="radio" id="response1" name="response" class="mt-1 mr-2">
                                        <label for="response1" class="cursor-pointer">Share it immediately</label>
                                    </div>
                                    <div class="flex items-start">
                                        <input type="radio" id="response2" name="response" class="mt-1 mr-2">
                                        <label for="response2" class="cursor-pointer">Report it as misinformation</label>
                                    </div>
                                    <div class="flex items-start">
                                        <input type="radio" id="response3" name="response" class="mt-1 mr-2">
                                        <label for="response3" class="cursor-pointer">Research the claims before sharing</label>
                                    </div>
                                </div>
                            </div>
                            
                            <button id="submitAnalysis" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded transition-colors duration-200">
                                Submit Analysis
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

export const Challenge1Page = new Challenge1PageClass().toPageObject();
