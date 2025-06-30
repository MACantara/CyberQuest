// TODO: Add profile pictures

import { BasePage } from '../base-page.js';

class Challenge4PageClass extends BasePage {
    constructor() {
        super({
            url: 'https://social.cyberquest.academy/posts/controversial-claim',
            title: 'Social Media Analysis - CyberQuest Academy',
            ipAddress: '198.51.100.16',
            securityLevel: 'warning',
            security: {
                isHttps: true,
                hasValidCertificate: true,
                threats: ['Potential misinformation', 'Unverified claims'],
                riskFactors: [
                    'Emotionally charged language',
                    'Lack of credible sources',
                    'Viral sharing patterns',
                    'Anonymous author'
                ]
            }
        });
    }

    createContent() {
        return `
            <div class="bg-gray-100 min-h-screen">
                <!-- Social Media Header -->
                <div class="bg-white border-b border-gray-200">
                    <div class="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
                        <div class="flex items-center">
                            <svg class="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22.46 5.88c-.84.38-1.75.63-2.7.74.97-.58 1.7-1.5 2.05-2.6-.9.53-1.9.92-2.97 1.13-.85-.9-2.06-1.47-3.4-1.47-2.57 0-4.65 2.08-4.65 4.65 0 .36.04.72.12 1.06-3.86-.2-7.3-2.05-9.6-4.86-.4.7-.63 1.5-.63 2.37 0 1.62.82 3.05 2.06 3.88-.76-.02-1.47-.23-2.1-.57v.06c0 2.25 1.6 4.13 3.72 4.56-.39.1-.8.16-1.23.16-.3 0-.6-.03-.89-.08.6 1.9 2.36 3.28 4.45 3.32-1.63 1.28-3.68 2.04-5.9 2.04-.38 0-.76-.02-1.13-.06 2.1 1.35 4.6 2.13 7.28 2.13 8.73 0 13.5-7.23 13.5-13.5 0-.2 0-.4-.02-.6.93-.67 1.74-1.52 2.4-2.48z"></path>
                            </svg>
                            <span class="ml-2 font-bold text-xl">SocialMedia</span>
                        </div>
                        <div class="flex space-x-4">
                            <button class="text-blue-500 font-semibold">Home</button>
                            <button class="text-gray-600 hover:text-gray-900">Explore</button>
                            <button class="text-gray-600 hover:text-gray-900">Notifications</button>
                        </div>
                    </div>
                </div>

                <!-- Main Content -->
                <div class="max-w-2xl mx-auto px-4 py-6">
                    <!-- Post -->
                    <div class="bg-white rounded-lg shadow p-4 mb-6">
                        <div class="flex items-start mb-3">
                            <div class="w-12 h-12 bg-gray-300 rounded-full"></div>
                            <div class="ml-3">
                                <div class="font-semibold text-black">TruthSeeker42</div>
                                <div class="text-gray-500 text-sm">@realtalk_truth · 2h</div>
                            </div>
                            <button class="ml-auto text-gray-500 hover:text-gray-700">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
                                </svg>
                            </button>
                        </div>
                        
                        <div class="mb-4">
                            <p class="text-black text-lg mb-3">🚨 BREAKING: Major pharmaceutical company ADMITS their new vaccine causes severe side effects in 87% of recipients! The mainstream media is SILENT on this! #BigPharmaLies #MedicalFreedom</p>
                            
                            <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                                <div class="flex">
                                    <div class="flex-shrink-0">
                                        <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                    <div class="ml-3">
                                        <p class="text-sm text-red-700">
                                            This claim is disputed by multiple independent fact-checking organizations. Always verify information from credible sources.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="flex space-x-4 text-gray-500 text-sm mb-4">
                                <button class="flex items-center hover:text-blue-500">
                                    <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                    </svg>
                                    2.4K
                                </button>
                                <button class="flex items-center hover:text-green-500">
                                    <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                    </svg>
                                    1.2K
                                </button>
                                <button class="flex items-center hover:text-red-500">
                                    <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                                    </svg>
                                    5.7K
                                </button>
                            </div>
                            
                            <div class="border-t border-gray-200 pt-3">
                                <div class="flex items-center text-sm text-gray-500 mb-2">
                                    <span>Showing 3 of 247 comments</span>
                                    <button class="ml-auto text-blue-500 hover:text-blue-700">View all comments</button>
                                </div>
                                
                                <!-- Comments -->
                                <div class="space-y-3 mb-3">
                                    <div class="flex items-start">
                                        <div class="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
                                        <div class="bg-gray-50 rounded-lg p-2 flex-1">
                                            <div class="font-semibold text-sm text-black">HealthExpert22</div>
                                            <p class="text-sm text-black">This is completely false. The study was retracted due to flawed methodology. Please stop spreading misinformation.</p>
                                        </div>
                                    </div>
                                    
                                    <div class="flex items-start">
                                        <div class="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
                                        <div class="bg-gray-50 rounded-lg p-2 flex-1">
                                            <div class="font-semibold text-sm text-black">ConspiracyTheorist</div>
                                            <p class="text-sm text-black">I KNEW IT! They've been lying to us all along! #WakeUpSheeple</p>
                                        </div>
                                    </div>
                                    
                                    <div class="flex items-start">
                                        <div class="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
                                        <div class="bg-gray-50 rounded-lg p-2 flex-1">
                                            <div class="font-semibold text-sm text-black">ScienceLover</div>
                                            <p class="text-sm text-black">Can you provide a link to the actual study? The numbers don't match any published research I've seen.</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="flex items-center mt-2">
                                    <input type="text" placeholder="Write a comment..." class="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <button class="ml-2 text-blue-500 font-semibold text-sm">Post</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Practical Investigation Section -->
                    <div class="bg-white rounded-lg shadow p-6">
                        <h2 class="text-xl font-semibold mb-4 text-black">Social Media Investigation Tools</h2>
                        <p class="text-gray-600 mb-6">Use the verification tools below to investigate this post and its claims.</p>
                        
                        <div class="grid md:grid-cols-2 gap-6 mb-6">
                            <!-- Profile Analysis Tool -->
                            <div class="bg-white p-4 border border-gray-200 rounded-lg hover:border-blue-400 transition-colors shadow-sm">
                                <h3 class="font-semibold text-lg mb-2 flex items-center">
                                    <i class="bi bi-person-badge text-blue-500 mr-2"></i>
                                    Profile Analysis
                                </h3>
                                <p class="text-sm text-gray-600 mb-3">Investigate the account that posted this claim</p>
                                <button id="analyze-profile" 
                                        class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm transition-colors duration-200 cursor-pointer">
                                    Analyze @realtalk_truth
                                </button>
                            </div>
                            
                            <!-- Claim Verification -->
                            <div class="bg-white p-4 border border-gray-200 rounded-lg hover:border-green-400 transition-colors shadow-sm">
                                <h3 class="font-semibold text-lg mb-2 flex items-center">
                                    <i class="bi bi-search text-green-500 mr-2"></i>
                                    Claim Verification
                                </h3>
                                <p class="text-sm text-gray-600 mb-3">Cross-reference the medical claims with credible sources</p>
                                <button id="verify-claims" 
                                        class="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm transition-colors duration-200 cursor-pointer"
                                        data-url="https://fact-checker.cyberquest.academy/cross-reference">
                                    Verify Medical Claims
                                </button>
                            </div>
                        </div>
                        
                        <div class="grid md:grid-cols-2 gap-6 mb-6">
                            <!-- Engagement Analysis -->
                            <div class="bg-white p-4 border border-gray-200 rounded-lg hover:border-purple-400 transition-colors shadow-sm">
                                <h3 class="font-semibold text-lg mb-2 flex items-center">
                                    <i class="bi bi-graph-up text-purple-500 mr-2"></i>
                                    Engagement Analysis
                                </h3>
                                <p class="text-sm text-gray-600 mb-3">Analyze sharing patterns and bot activity</p>
                                <button id="analyze-engagement" 
                                        class="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded text-sm transition-colors duration-200 cursor-pointer">
                                    Analyze Engagement
                                </button>
                            </div>
                            
                            <!-- Language Analysis -->
                            <div class="bg-white p-4 border border-gray-200 rounded-lg hover:border-orange-400 transition-colors shadow-sm">
                                <h3 class="font-semibold text-lg mb-2 flex items-center">
                                    <i class="bi bi-chat-quote text-orange-500 mr-2"></i>
                                    Language Analysis
                                </h3>
                                <p class="text-sm text-gray-600 mb-3">Detect emotional manipulation and bias indicators</p>
                                <button id="analyze-language" 
                                        class="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-3 rounded text-sm transition-colors duration-200 cursor-pointer">
                                    Analyze Language
                                </button>
                            </div>
                        </div>

                        <!-- Results Section -->
                        <div id="investigation-results" class="hidden">
                            <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 mb-4">
                                <h4 class="font-semibold text-blue-800 mb-2">✅ Investigation Complete!</h4>
                                <p class="text-blue-700">Review your findings and complete your professional assessment below.</p>
                            </div>
                            
                            <div id="results-content" class="space-y-4 mb-6">
                                <!-- Results will be populated here -->
                            </div>
                        </div>
                        
                        <!-- Professional Assessment Form -->
                        <div class="bg-gray-50 p-6 rounded-lg">
                            <h3 class="text-xl font-semibold mb-4 text-black">Professional Social Media Assessment</h3>
                            
                            <div class="space-y-6">
                                <div class="bg-white p-4 rounded-lg border border-gray-200">
                                    <h4 class="font-semibold mb-3 text-gray-800">Investigation Report</h4>
                                    
                                    <div class="space-y-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">1. Account Credibility Assessment</label>
                                            <div class="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <input type="text" 
                                                           class="w-full p-2 border border-gray-300 rounded text-sm"
                                                           placeholder="Account creation date"
                                                           id="account-age">
                                                </div>
                                                <div>
                                                    <input type="text" 
                                                           class="w-full p-2 border border-gray-300 rounded text-sm"
                                                           placeholder="Follower count pattern"
                                                           id="follower-pattern">
                                                </div>
                                            </div>
                                            <div class="mt-2">
                                                <textarea class="w-full p-2 border border-gray-300 rounded text-sm" 
                                                          rows="2" 
                                                          placeholder="Describe suspicious account behaviors (e.g., new account, fake profile, bot activity)"
                                                          id="account-assessment"></textarea>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">2. Claim Verification Results</label>
                                            <textarea class="w-full p-2 border border-gray-300 rounded text-sm" 
                                                      rows="3" 
                                                      placeholder="Document your fact-checking findings - what did credible medical sources say about these claims?"
                                                      id="claim-verification"></textarea>
                                        </div>
                                        
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">3. Emotional Manipulation Indicators</label>
                                            <div class="grid md:grid-cols-2 gap-4">
                                                <div class="space-y-2">
                                                    <div class="flex items-center">
                                                        <input type="checkbox" id="caps-usage" class="mr-2">
                                                        <label for="caps-usage" class="text-sm">Excessive use of ALL CAPS</label>
                                                    </div>
                                                    <div class="flex items-center">
                                                        <input type="checkbox" id="urgent-language" class="mr-2">
                                                        <label for="urgent-language" class="text-sm">Urgent/alarmist language</label>
                                                    </div>
                                                    <div class="flex items-center">
                                                        <input type="checkbox" id="conspiracy-hashtags" class="mr-2">
                                                        <label for="conspiracy-hashtags" class="text-sm">Conspiracy-related hashtags</label>
                                                    </div>
                                                </div>
                                                <div class="space-y-2">
                                                    <div class="flex items-center">
                                                        <input type="checkbox" id="fear-mongering" class="mr-2">
                                                        <label for="fear-mongering" class="text-sm">Fear-mongering content</label>
                                                    </div>
                                                    <div class="flex items-center">
                                                        <input type="checkbox" id="us-vs-them" class="mr-2">
                                                        <label for="us-vs-them" class="text-sm">"Us vs. them" framing</label>
                                                    </div>
                                                    <div class="flex items-center">
                                                        <input type="checkbox" id="vague-sources" class="mr-2">
                                                        <label for="vague-sources" class="text-sm">Vague source references</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">4. Response Strategy</label>
                                            <textarea class="w-full p-2 border border-gray-300 rounded text-sm" 
                                                      rows="3" 
                                                      placeholder="How would you professionally respond to this misinformation? Include specific sources and evidence."
                                                      id="response-strategy"></textarea>
                                        </div>
                                        
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">5. Harm Assessment</label>
                                            <textarea class="w-full p-2 border border-gray-300 rounded text-sm" 
                                                      rows="2" 
                                                      placeholder="What potential harm could this misinformation cause to public health or society?"
                                                      id="harm-assessment"></textarea>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                                    <h4 class="font-semibold text-blue-800 mb-2">Social Media Investigation Checklist</h4>
                                    <div class="space-y-2 text-sm">
                                        <div class="flex items-center">
                                            <input type="checkbox" id="check-profile" class="mr-2">
                                            <label for="check-profile" class="text-blue-700">Analyzed account profile and posting history</label>
                                        </div>
                                        <div class="flex items-center">
                                            <input type="checkbox" id="check-claims" class="mr-2">
                                            <label for="check-claims" class="text-blue-700">Fact-checked claims with credible medical sources</label>
                                        </div>
                                        <div class="flex items-center">
                                            <input type="checkbox" id="check-engagement" class="mr-2">
                                            <label for="check-engagement" class="text-blue-700">Examined engagement patterns for bot activity</label>
                                        </div>
                                        <div class="flex items-center">
                                            <input type="checkbox" id="check-language" class="mr-2">
                                            <label for="check-language" class="text-blue-700">Identified emotional manipulation techniques</label>
                                        </div>
                                        <div class="flex items-center">
                                            <input type="checkbox" id="check-harm" class="mr-2">
                                            <label for="check-harm" class="text-blue-700">Assessed potential societal harm</label>
                                        </div>
                                    </div>
                                </div>
                                
                                <button id="submit-assessment" class="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded transition-colors duration-200 mt-4 cursor-pointer">
                                    Submit Professional Assessment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Method to bind events after content is rendered
    bindEvents(contentElement) {
        // Handle profile analysis
        const profileBtn = contentElement.querySelector('#analyze-profile');
        if (profileBtn) {
            profileBtn.addEventListener('click', () => {
                this.showInvestigationResults(contentElement, 'profile');
            });
        }

        // Handle claim verification
        const claimsBtn = contentElement.querySelector('#verify-claims');
        if (claimsBtn) {
            claimsBtn.addEventListener('click', () => {
                const url = claimsBtn.getAttribute('data-url');
                window.dispatchEvent(new CustomEvent('navigate-browser', { detail: { url } }));
                this.showInvestigationResults(contentElement, 'claims');
            });
        }

        // Handle engagement analysis
        const engagementBtn = contentElement.querySelector('#analyze-engagement');
        if (engagementBtn) {
            engagementBtn.addEventListener('click', () => {
                this.showInvestigationResults(contentElement, 'engagement');
            });
        }

        // Handle language analysis
        const languageBtn = contentElement.querySelector('#analyze-language');
        if (languageBtn) {
            languageBtn.addEventListener('click', () => {
                this.showInvestigationResults(contentElement, 'language');
            });
        }

        // Handle submit assessment
        const submitBtn = contentElement.querySelector('#submit-assessment');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                this.submitAssessment(contentElement);
            });
        }
    }

    showInvestigationResults(contentElement, toolType) {
        setTimeout(() => {
            const resultsSection = contentElement.querySelector('#investigation-results');
            const resultsContent = contentElement.querySelector('#results-content');
            
            if (resultsContent) {
                const toolResults = this.getToolResults(toolType);
                
                // Add or update tool results
                let existingResult = resultsContent.querySelector(`#result-${toolType}`);
                if (existingResult) {
                    existingResult.innerHTML = toolResults;
                } else {
                    const resultDiv = document.createElement('div');
                    resultDiv.id = `result-${toolType}`;
                    resultDiv.className = 'bg-white p-4 border border-gray-200 rounded-lg';
                    resultDiv.innerHTML = toolResults;
                    resultsContent.appendChild(resultDiv);
                }
            }
            
            if (resultsSection) {
                resultsSection.classList.remove('hidden');
                resultsSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 1500);
    }

    getToolResults(toolType) {
        const results = {
            'profile': `
                <h4 class="font-semibold mb-3 flex items-center">
                    <i class="bi bi-person-badge text-blue-500 mr-2"></i>
                    Profile Analysis Results
                </h4>
                <div class="space-y-3">
                    <div class="bg-red-50 p-3 rounded border-l-4 border-red-500">
                        <p class="font-medium text-red-800">🚨 Suspicious Account Activity</p>
                        <ul class="text-sm text-red-700 mt-2 space-y-1">
                            <li>• Account created: 3 weeks ago (very recent)</li>
                            <li>• Only 47 followers, but claims go viral</li>
                            <li>• No profile bio or verification</li>
                            <li>• Generic profile picture</li>
                            <li>• Primarily posts controversial content</li>
                        </ul>
                    </div>
                    <div class="bg-yellow-50 p-3 rounded border-l-4 border-yellow-500">
                        <p class="font-medium text-yellow-800">Bot Indicators Detected</p>
                        <p class="text-sm text-yellow-700">Posting frequency and engagement patterns suggest possible automation or coordinated behavior.</p>
                    </div>
                </div>
            `,
            'claims': `
                <h4 class="font-semibold mb-3 flex items-center">
                    <i class="bi bi-search text-green-500 mr-2"></i>
                    Claim Verification Results
                </h4>
                <div class="space-y-3">
                    <div class="bg-red-50 p-3 rounded border-l-4 border-red-500">
                        <p class="font-medium text-red-800">FALSE CLAIM DETECTED</p>
                        <p class="text-sm text-red-700 mb-2">No credible medical sources support the "87% severe side effects" claim</p>
                        <div class="text-xs text-red-600">
                            <p><strong>CDC:</strong> No such data reported</p>
                            <p><strong>WHO:</strong> No supporting evidence found</p>
                            <p><strong>Medical journals:</strong> No studies with these findings</p>
                        </div>
                    </div>
                    <div class="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
                        <p class="font-medium text-blue-800">Fact-Check Results</p>
                        <p class="text-sm text-blue-700">Multiple fact-checking organizations have debunked similar claims. Current safety data shows different results.</p>
                    </div>
                </div>
            `,
            'engagement': `
                <h4 class="font-semibold mb-3 flex items-center">
                    <i class="bi bi-graph-up text-purple-500 mr-2"></i>
                    Engagement Analysis Results
                </h4>
                <div class="space-y-3">
                    <div class="bg-orange-50 p-3 rounded border-l-4 border-orange-500">
                        <p class="font-medium text-orange-800">Suspicious Engagement Patterns</p>
                        <ul class="text-sm text-orange-700 mt-2 space-y-1">
                            <li>• 73% of shares occurred within first hour</li>
                            <li>• Many sharing accounts created recently</li>
                            <li>• Similar retweet patterns across accounts</li>
                            <li>• Limited genuine discussion in comments</li>
                        </ul>
                    </div>
                    <div class="bg-gray-50 p-3 rounded">
                        <p class="font-medium text-gray-800">Amplification Analysis</p>
                        <p class="text-sm text-gray-700">Post appears to be artificially amplified rather than organically viral. Suggests coordinated sharing campaign.</p>
                    </div>
                </div>
            `,
            'language': `
                <h4 class="font-semibold mb-3 flex items-center">
                    <i class="bi bi-chat-quote text-orange-500 mr-2"></i>
                    Language Analysis Results
                </h4>
                <div class="space-y-3">
                    <div class="bg-red-50 p-3 rounded border-l-4 border-red-500">
                        <p class="font-medium text-red-800">High Emotional Manipulation Score</p>
                        <ul class="text-sm text-red-700 mt-2 space-y-1">
                            <li>• "BREAKING" and urgent language (fear appeal)</li>
                            <li>• ALL CAPS for emphasis (attention grabbing)</li>
                            <li>• "ADMITS" implies guilt without evidence</li>
                            <li>• "SILENT" suggests media conspiracy</li>
                            <li>• Uses inflammatory hashtags</li>
                        </ul>
                    </div>
                    <div class="bg-yellow-50 p-3 rounded border-l-4 border-yellow-500">
                        <p class="font-medium text-yellow-800">Propaganda Techniques Identified</p>
                        <p class="text-sm text-yellow-700">Fear-mongering, false authority claims, and us-vs-them framing designed to bypass critical thinking.</p>
                    </div>
                </div>
            `
        };
        
        return results[toolType] || '<p>Analysis in progress...</p>';
    }

    submitAssessment(contentElement) {
        // Collect form data
        const formData = {
            accountAge: contentElement.querySelector('#account-age')?.value || '',
            followerPattern: contentElement.querySelector('#follower-pattern')?.value || '',
            accountAssessment: contentElement.querySelector('#account-assessment')?.value || '',
            claimVerification: contentElement.querySelector('#claim-verification')?.value || '',
            responseStrategy: contentElement.querySelector('#response-strategy')?.value || '',
            harmAssessment: contentElement.querySelector('#harm-assessment')?.value || '',
            manipulationChecks: {
                caps: contentElement.querySelector('#caps-usage')?.checked || false,
                urgent: contentElement.querySelector('#urgent-language')?.checked || false,
                conspiracy: contentElement.querySelector('#conspiracy-hashtags')?.checked || false,
                fear: contentElement.querySelector('#fear-mongering')?.checked || false,
                divisive: contentElement.querySelector('#us-vs-them')?.checked || false,
                vague: contentElement.querySelector('#vague-sources')?.checked || false
            }
        };

        // Validate required fields
        if (!formData.accountAssessment || !formData.claimVerification || !formData.responseStrategy) {
            alert('Please complete all required assessment fields.');
            return;
        }

        // Generate feedback based on responses
        const feedback = this.generateAssessmentFeedback(formData);

        // Show results modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
                <div class="text-center mb-4">
                    <div class="${feedback.bgColor} p-4 rounded-lg mb-4">
                        <h3 class="${feedback.textColor} text-xl font-bold mb-2">${feedback.level}</h3>
                        <p class="${feedback.textColor} font-medium">${feedback.message}</p>
                        <div class="mt-2">
                            <div class="w-full bg-gray-200 rounded-full h-3">
                                <div class="bg-green-500 h-3 rounded-full transition-all duration-500" style="width: ${feedback.score}%"></div>
                            </div>
                            <p class="text-sm mt-1 ${feedback.textColor}">Assessment Score: ${feedback.score}/100</p>
                        </div>
                    </div>
                    
                    <div class="text-left">
                        <h4 class="font-semibold text-gray-800 mb-3">Assessment Feedback:</h4>
                        <div class="bg-gray-50 p-4 rounded text-sm space-y-1">
                            ${feedback.feedback.split('\n').map(line => `<p>${line}</p>`).join('')}
                        </div>
                    </div>
                    
                    <div class="text-left mt-4">
                        <h4 class="font-semibold text-gray-800 mb-2">Key Learning Points:</h4>
                        <ul class="text-sm text-gray-700 space-y-1 list-disc pl-5">
                            <li>Social media misinformation often uses emotional manipulation</li>
                            <li>New or suspicious accounts frequently spread false claims</li>
                            <li>Always verify medical claims with official health organizations</li>
                            <li>Look for bot-like behavior and coordinated sharing campaigns</li>
                            <li>Respond professionally with facts and credible sources</li>
                        </ul>
                    </div>
                    
                    <div class="mt-6 flex space-x-3 justify-center">
                        <button onclick="this.closest('.fixed').remove()" 
                                class="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors">
                            Close Assessment
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    generateAssessmentFeedback(formData) {
        let score = 0;
        let feedback = [];

        // Check account assessment
        if (formData.accountAssessment.toLowerCase().includes('new') || formData.accountAssessment.toLowerCase().includes('recent')) {
            score += 20;
            feedback.push("✅ Correctly identified suspicious account age/patterns");
        } else {
            feedback.push("❌ Account age analysis needs improvement - check account creation date");
        }

        // Check claim verification
        if (formData.claimVerification.toLowerCase().includes('false') || formData.claimVerification.toLowerCase().includes('no evidence')) {
            score += 25;
            feedback.push("✅ Properly fact-checked the medical claims");
        } else {
            feedback.push("❌ Claim verification incomplete - check official health sources");
        }

        // Check manipulation indicators
        const manipulationScore = Object.values(formData.manipulationChecks).filter(Boolean).length;
        if (manipulationScore >= 4) {
            score += 20;
            feedback.push("✅ Identified multiple emotional manipulation techniques");
        } else if (manipulationScore >= 2) {
            score += 10;
            feedback.push("⚠️ Some manipulation techniques identified, but look for more");
        } else {
            feedback.push("❌ Need to identify more emotional manipulation indicators");
        }

        // Check response strategy
        if (formData.responseStrategy.length > 100 && formData.responseStrategy.toLowerCase().includes('source')) {
            score += 20;
            feedback.push("✅ Developed comprehensive response with sources");
        } else {
            feedback.push("⚠️ Response strategy needs more detail and credible sources");
        }

        // Check harm assessment
        if (formData.harmAssessment.length > 50) {
            score += 15;
            feedback.push("✅ Recognized potential societal harm");
        } else {
            feedback.push("⚠️ Harm assessment could be more detailed");
        }

        let level = 'Needs Development';
        let bgColor = 'bg-orange-100';
        let textColor = 'text-orange-800';

        if (score >= 85) {
            level = 'Expert Analyst';
            bgColor = 'bg-green-100';
            textColor = 'text-green-800';
        } else if (score >= 70) {
            level = 'Proficient Investigator';
            bgColor = 'bg-blue-100';
            textColor = 'text-blue-800';
        } else if (score >= 50) {
            level = 'Developing Skills';
            bgColor = 'bg-yellow-100';
            textColor = 'text-yellow-800';
        }

        return {
            score,
            level,
            bgColor,
            textColor,
            feedback: feedback.join('\n'),
            message: `Social media investigation complete! Your analysis skills are at ${level} level.`
        };
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

export const Challenge4Page = new Challenge4PageClass().toPageObject();
