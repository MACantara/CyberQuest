// TODO: Replace the multiple choice practice scenario into a practical example

import { BasePage } from '../base-page.js';

class Challenge2PageClass extends BasePage {
    constructor() {
        super({
            url: 'https://cyberquest.academy/level/1/challenge2',
            title: 'Source Comparison - CyberQuest Academy',
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
                    <h1 class="text-2xl font-bold text-gray-900">Source Comparison Exercise</h1>
                    <p class="text-gray-600">Analyze and compare different news sources about the same event</p>
                </header>

                <div class="prose max-w-none">
                    <section class="mb-8">
                        <h2 class="text-xl font-semibold mb-4">The Incident</h2>
                        <p class="mb-4">The following three articles all report on the same event: a protest that took place outside City Hall yesterday. Your task is to analyze each source and identify any discrepancies or signs of bias.</p>
                    </section>

                    <div class="grid md:grid-cols-3 gap-6 mb-8">
                        <!-- Source 1 -->
                        <div class="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                            <div class="bg-blue-50 p-3 border-b border-gray-200">
                                <h3 class="font-semibold">Metro Daily News</h3>
                                <p class="text-xs text-gray-500">Est. 1985 • 4.2★ Trust Rating</p>
                            </div>
                            <div class="p-4">
                                <h4 class="font-semibold text-lg mb-2">Peaceful Protest at City Hall</h4>
                                <p class="text-sm text-gray-700 mb-3">Approximately 200-300 protesters gathered outside City Hall yesterday to voice their concerns about the new environmental policy. The demonstration remained peaceful throughout the day, with organizers working closely with local authorities.</p>
                                <p class="text-xs text-gray-500">By Sarah Johnson • 14 hours ago</p>
                                <button class="mt-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 cursor-pointer" 
                                        data-source="metro" 
                                        onclick="window.challenge2Instance.analyzeSource('metro')">
                                    Analyze Source
                                </button>
                            </div>
                        </div>

                        <!-- Source 2 -->
                        <div class="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                            <div class="bg-red-50 p-3 border-b border-gray-200">
                                <h3 class="font-semibold">The Daily Clarion</h3>
                                <p class="text-xs text-gray-500">Est. 1972 • 3.8★ Trust Rating</p>
                            </div>
                            <div class="p-4">
                                <h4 class="font-semibold text-lg mb-2">Chaos Erupts at City Hall</h4>
                                <p class="text-sm text-gray-700 mb-3">Violent clashes broke out as more than 1,000 angry demonstrators stormed City Hall yesterday, forcing officials to call in riot police. The mayor's new environmental policy has sparked outrage across the city, with many calling for immediate action.</p>
                                <p class="text-xs text-gray-500">By Michael Chen • 10 hours ago</p>
                                <button class="mt-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200 cursor-pointer" 
                                        data-source="clarion" 
                                        onclick="window.challenge2Instance.analyzeSource('clarion')">
                                    Analyze Source
                                </button>
                            </div>
                        </div>

                        <!-- Source 3 -->
                        <div class="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                            <div class="bg-green-50 p-3 border-b border-gray-200">
                                <h3 class="font-semibold">City Press Online</h3>
                                <p class="text-xs text-gray-500">Est. 2005 • 4.5★ Trust Rating</p>
                            </div>
                            <div class="p-4">
                                <h4 class="font-semibold text-lg mb-2">City Hall Protest Draws Mixed Reactions</h4>
                                <p class="text-sm text-gray-700 mb-3">An estimated 500 people participated in yesterday's demonstration at City Hall. While the majority of the protest was peaceful, minor scuffles were reported when a small group attempted to enter the building. Police confirmed three arrests for disorderly conduct.</p>
                                <p class="text-xs text-gray-500">By Jamal Williams • 12 hours ago</p>
                                <button class="mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200 cursor-pointer" 
                                        data-source="citypress" 
                                        onclick="window.challenge2Instance.analyzeSource('citypress')">
                                    Analyze Source
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Source Analysis Modal -->
                    <div id="source-analysis-modal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div class="bg-white rounded-lg p-6 max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
                            <div class="flex justify-between items-center mb-4">
                                <h3 class="text-lg font-semibold" id="modal-title">Source Analysis</h3>
                                <button onclick="window.challenge2Instance.closeModal()" class="text-gray-500 hover:text-gray-700">
                                    <i class="bi bi-x-lg"></i>
                                </button>
                            </div>
                            <div id="modal-content"></div>
                        </div>
                    </div>

                    <!-- Interactive Analysis Section -->
                    <section class="bg-gray-50 p-6 rounded-lg mb-8">
                        <h2 class="text-xl font-semibold mb-4">Hands-On Source Comparison</h2>
                        <p class="mb-4 text-gray-700">Use the tools below to investigate the credibility and bias of each source reporting on this event.</p>
                        
                        <div class="grid md:grid-cols-2 gap-6 mb-6">
                            <!-- Cross-Reference Tool -->
                            <div class="bg-white p-4 border border-gray-200 rounded-lg hover:border-blue-400 transition-colors shadow-sm">
                                <h4 class="font-semibold mb-2 flex items-center">
                                    <i class="bi bi-search text-blue-500 mr-2"></i>
                                    Cross-Reference Sources
                                </h4>
                                <p class="text-sm text-gray-600 mb-3">Compare how different outlets report the same story</p>
                                <div class="mb-3">
                                    <p class="text-xs text-gray-500 mb-1">Try searching for:</p>
                                    <code class="bg-gray-100 px-2 py-1 rounded text-xs">"City Hall protest yesterday"</code>
                                </div>
                                <button id="try-cross-reference" 
                                        class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm transition-colors duration-200 cursor-pointer"
                                        data-url="https://fact-checker.cyberquest.academy/cross-reference">
                                    Use Cross-Reference Tool
                                </button>
                            </div>
                            
                            <!-- Bias Detection -->
                            <div class="bg-white p-4 border border-gray-200 rounded-lg hover:border-orange-400 transition-colors shadow-sm">
                                <h4 class="font-semibold mb-2 flex items-center">
                                    <i class="bi bi-exclamation-triangle text-orange-500 mr-2"></i>
                                    Bias Analysis Tool
                                </h4>
                                <p class="text-sm text-gray-600 mb-3">Identify language patterns that indicate bias or agenda</p>
                                <div class="mb-3">
                                    <p class="text-xs text-gray-500 mb-1">Analyzes:</p>
                                    <ul class="text-xs text-gray-500 list-disc pl-4">
                                        <li>Emotional language usage</li>
                                        <li>Source attribution</li>
                                        <li>Fact vs. opinion balance</li>
                                    </ul>
                                </div>
                                <button id="run-bias-analysis" 
                                        class="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-3 rounded text-sm transition-colors duration-200 cursor-pointer">
                                    Analyze for Bias
                                </button>
                            </div>
                        </div>

                        <!-- Results Section -->
                        <div id="analysis-results" class="hidden">
                            <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 mb-4">
                                <h4 class="font-semibold text-blue-800 mb-2">✅ Analysis Complete!</h4>
                                <p class="text-blue-700">Review the findings below and draw your conclusions about source reliability.</p>
                            </div>
                            
                            <div class="space-y-4" id="analysis-content">
                                <!-- Analysis results will be populated here -->
                            </div>
                        </div>
                        
                        <!-- Investigation Form -->
                        <div class="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                            <h4 class="font-semibold mb-3">Your Investigation Report</h4>
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Which source appears most reliable and why?</label>
                                    <div class="space-y-2">
                                        <div class="flex items-start">
                                            <input type="radio" id="reliable-metro" name="reliable" value="metro" class="mt-1 mr-2">
                                            <label for="reliable-metro" class="cursor-pointer text-sm">Metro Daily News - Provides specific numbers and neutral language</label>
                                        </div>
                                        <div class="flex items-start">
                                            <input type="radio" id="reliable-clarion" name="reliable" value="clarion" class="mt-1 mr-2">
                                            <label for="reliable-clarion" class="cursor-pointer text-sm">The Daily Clarion - Most detailed coverage of the events</label>
                                        </div>
                                        <div class="flex items-start">
                                            <input type="radio" id="reliable-citypress" name="reliable" value="citypress" class="mt-1 mr-2">
                                            <label for="reliable-citypress" class="cursor-pointer text-sm">City Press Online - Balanced reporting with official confirmation</label>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">What discrepancies did you notice between the sources?</label>
                                    <textarea class="w-full p-2 border border-gray-300 rounded text-sm" rows="3" placeholder="Describe the main differences in numbers, language, and framing..."></textarea>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">How would you verify which account is most accurate?</label>
                                    <div class="space-y-2">
                                        <div class="flex items-start">
                                            <input type="checkbox" id="verify1" class="mt-1 mr-2">
                                            <label for="verify1" class="cursor-pointer text-sm">Check official police records and statements</label>
                                        </div>
                                        <div class="flex items-start">
                                            <input type="checkbox" id="verify2" class="mt-1 mr-2">
                                            <label for="verify2" class="cursor-pointer text-sm">Look for video evidence from multiple angles</label>
                                        </div>
                                        <div class="flex items-start">
                                            <input type="checkbox" id="verify3" class="mt-1 mr-2">
                                            <label for="verify3" class="cursor-pointer text-sm">Cross-reference with other news outlets</label>
                                        </div>
                                        <div class="flex items-start">
                                            <input type="checkbox" id="verify4" class="mt-1 mr-2">
                                            <label for="verify4" class="cursor-pointer text-sm">Contact event organizers and witnesses</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <button id="submit-analysis" class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded transition-colors duration-200 cursor-pointer mt-4">
                                Submit Analysis
                            </button>
                        </div>
                        
                        <!-- Hint Section -->
                        <div class="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400 mt-6">
                            <h4 class="font-semibold text-yellow-800 mb-2">💡 Analysis Tips</h4>
                            <ul class="text-yellow-700 text-sm space-y-1">
                                <li>• Compare specific numbers (crowd size, arrests) between sources</li>
                                <li>• Look for emotional vs. neutral language choices</li>
                                <li>• Notice which sources cite official confirmations</li>
                                <li>• Consider the reputation and track record of each outlet</li>
                            </ul>
                        </div>
                    </section>
                </div>
            </div>
        `;
    }

    // Method to bind events after content is rendered
    bindEvents(contentElement) {
        // Make instance globally accessible for onclick handlers
        window.challenge2Instance = this;

        // Handle cross-reference tool button
        const crossRefBtn = contentElement.querySelector('#try-cross-reference');
        if (crossRefBtn) {
            crossRefBtn.addEventListener('click', () => {
                const url = crossRefBtn.getAttribute('data-url');
                window.dispatchEvent(new CustomEvent('navigate-browser', { detail: { url } }));
                this.showAnalysisResults(contentElement);
            });
        }

        // Handle bias analysis button
        const biasBtn = contentElement.querySelector('#run-bias-analysis');
        if (biasBtn) {
            biasBtn.addEventListener('click', () => {
                this.runBiasAnalysis(contentElement);
            });
        }

        // Handle submit analysis button
        const submitBtn = contentElement.querySelector('#submit-analysis');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                this.submitFinalAnalysis(contentElement);
            });
        }
    }

    analyzeSource(sourceId) {
        const modal = document.getElementById('source-analysis-modal');
        const title = document.getElementById('modal-title');
        const content = document.getElementById('modal-content');
        
        const sourceData = {
            metro: {
                name: 'Metro Daily News',
                credibility: 'High',
                analysis: `
                    <div class="space-y-4">
                        <div class="bg-green-50 p-3 rounded">
                            <h4 class="font-semibold text-green-800">Credibility Assessment: High</h4>
                            <ul class="text-sm text-green-700 mt-2 space-y-1">
                                <li>✓ Established publication (1985)</li>
                                <li>✓ Specific, measurable details (200-300 protesters)</li>
                                <li>✓ Neutral, factual language</li>
                                <li>✓ Author byline provided</li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="font-semibold">Language Analysis:</h4>
                            <p class="text-sm text-gray-700">Uses measured terms like "approximately" and "remained peaceful." No emotionally charged language detected.</p>
                        </div>
                        <div>
                            <h4 class="font-semibold">Source Attribution:</h4>
                            <p class="text-sm text-gray-700">References cooperation with local authorities, suggesting official sources were consulted.</p>
                        </div>
                    </div>
                `
            },
            clarion: {
                name: 'The Daily Clarion',
                credibility: 'Low',
                analysis: `
                    <div class="space-y-4">
                        <div class="bg-red-50 p-3 rounded">
                            <h4 class="font-semibold text-red-800">Credibility Assessment: Low</h4>
                            <ul class="text-sm text-red-700 mt-2 space-y-1">
                                <li>⚠ Sensationalized headline</li>
                                <li>⚠ Inflated numbers (1,000 vs others' 200-500)</li>
                                <li>⚠ Emotional, inflammatory language</li>
                                <li>⚠ No specific source attribution</li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="font-semibold">Language Analysis:</h4>
                            <p class="text-sm text-gray-700">Uses charged terms: "violent clashes," "angry demonstrators," "stormed." Language designed to provoke emotion rather than inform.</p>
                        </div>
                        <div>
                            <h4 class="font-semibold">Fact Checking:</h4>
                            <p class="text-sm text-gray-700">Claims of "riot police" and "violent clashes" contradict other sources. No evidence provided for these claims.</p>
                        </div>
                    </div>
                `
            },
            citypress: {
                name: 'City Press Online',
                credibility: 'High',
                analysis: `
                    <div class="space-y-4">
                        <div class="bg-green-50 p-3 rounded">
                            <h4 class="font-semibold text-green-800">Credibility Assessment: High</h4>
                            <ul class="text-sm text-green-700 mt-2 space-y-1">
                                <li>✓ Balanced reporting tone</li>
                                <li>✓ Official police confirmation cited</li>
                                <li>✓ Specific, verifiable details (3 arrests)</li>
                                <li>✓ Acknowledges both peaceful and problematic aspects</li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="font-semibold">Language Analysis:</h4>
                            <p class="text-sm text-gray-700">Neutral language with qualifying phrases like "minor scuffles" and "small group." Avoids sensationalism.</p>
                        </div>
                        <div>
                            <h4 class="font-semibold">Source Attribution:</h4>
                            <p class="text-sm text-gray-700">Directly cites police confirmation for arrest numbers, showing verification of claims.</p>
                        </div>
                    </div>
                `
            }
        };
        
        const source = sourceData[sourceId];
        title.textContent = `Analysis: ${source.name}`;
        content.innerHTML = source.analysis;
        
        modal.classList.remove('hidden');
    }

    closeModal() {
        const modal = document.getElementById('source-analysis-modal');
        modal.classList.add('hidden');
    }

    showAnalysisResults(contentElement) {
        setTimeout(() => {
            const resultsSection = contentElement.querySelector('#analysis-results');
            const analysisContent = contentElement.querySelector('#analysis-content');
            
            analysisContent.innerHTML = `
                <div class="bg-white p-4 border border-gray-200 rounded-lg">
                    <h4 class="font-semibold mb-3">Cross-Reference Results</h4>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center p-2 bg-green-50 rounded">
                            <span class="text-sm">Metro Daily News</span>
                            <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Consistent with other credible sources</span>
                        </div>
                        <div class="flex justify-between items-center p-2 bg-red-50 rounded">
                            <span class="text-sm">The Daily Clarion</span>
                            <span class="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Significant discrepancies found</span>
                        </div>
                        <div class="flex justify-between items-center p-2 bg-green-50 rounded">
                            <span class="text-sm">City Press Online</span>
                            <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Well-sourced and verified</span>
                        </div>
                    </div>
                </div>
            `;
            
            resultsSection.classList.remove('hidden');
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }, 1500);
    }

    runBiasAnalysis(contentElement) {
        const biasBtn = contentElement.querySelector('#run-bias-analysis');
        const originalText = biasBtn.textContent;
        
        biasBtn.textContent = 'Analyzing...';
        biasBtn.disabled = true;
        
        setTimeout(() => {
            const resultsSection = contentElement.querySelector('#analysis-results');
            const analysisContent = contentElement.querySelector('#analysis-content');
            
            analysisContent.innerHTML = `
                <div class="bg-white p-4 border border-gray-200 rounded-lg">
                    <h4 class="font-semibold mb-3">Bias Analysis Results</h4>
                    <div class="space-y-4">
                        <div class="border-l-4 border-blue-500 pl-4">
                            <h5 class="font-medium text-blue-800">Metro Daily News</h5>
                            <p class="text-sm text-gray-700">Bias Score: Low (2/10)</p>
                            <p class="text-xs text-gray-600">Neutral language, specific facts, balanced reporting</p>
                        </div>
                        <div class="border-l-4 border-red-500 pl-4">
                            <h5 class="font-medium text-red-800">The Daily Clarion</h5>
                            <p class="text-sm text-gray-700">Bias Score: High (8/10)</p>
                            <p class="text-xs text-gray-600">Emotional language, sensationalized numbers, inflammatory tone</p>
                        </div>
                        <div class="border-l-4 border-green-500 pl-4">
                            <h5 class="font-medium text-green-800">City Press Online</h5>
                            <p class="text-sm text-gray-700">Bias Score: Low (3/10)</p>
                            <p class="text-xs text-gray-600">Balanced perspective, official sources, measured language</p>
                        </div>
                    </div>
                </div>
            `;
            
            resultsSection.classList.remove('hidden');
            resultsSection.scrollIntoView({ behavior: 'smooth' });
            
            biasBtn.textContent = originalText;
            biasBtn.disabled = false;
        }, 2000);
    }

    submitFinalAnalysis(contentElement) {
        const reliableChoice = contentElement.querySelector('input[name="reliable"]:checked');
        
        let message = '';
        let bgColor = '';
        let textColor = '';
        
        if (reliableChoice) {
            if (reliableChoice.value === 'citypress') {
                message = '🎉 Excellent analysis! City Press Online shows the best journalistic practices: balanced reporting, official source verification, and neutral language while acknowledging multiple perspectives.';
                bgColor = 'bg-green-100';
                textColor = 'text-green-800';
            } else if (reliableChoice.value === 'metro') {
                message = '✅ Good choice! Metro Daily News is also reliable with neutral reporting and specific details. City Press Online edges ahead with official verification and more complete coverage.';
                bgColor = 'bg-blue-100';
                textColor = 'text-blue-800';
            } else if (reliableChoice.value === 'clarion') {
                message = '⚠️ Not quite. The Daily Clarion shows clear bias with sensationalized language, inflated numbers, and emotionally charged reporting that prioritizes drama over accuracy.';
                bgColor = 'bg-orange-100';
                textColor = 'text-orange-800';
            }
        } else {
            message = 'Please select which source you found most reliable based on your analysis.';
            bgColor = 'bg-gray-100';
            textColor = 'text-gray-800';
            return;
        }

        // Show results modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/75 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-lg mx-4">
                <div class="text-center">
                    <div class="${bgColor} p-4 rounded-lg mb-4">
                        <p class="${textColor} font-medium">${message}</p>
                    </div>
                    <div class="text-sm text-gray-600 mb-4">
                        <p><strong>Key Learning Points:</strong></p>
                        <ul class="text-left mt-2 space-y-1">
                            <li>• Compare specific facts and numbers across sources</li>
                            <li>• Watch for emotional vs. neutral language</li>
                            <li>• Look for official source attribution and verification</li>
                            <li>• Consider the publication's track record and reputation</li>
                            <li>• Be wary of sensationalized headlines and inflammatory rhetoric</li>
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

export const Challenge2Page = new Challenge2PageClass().toPageObject();
