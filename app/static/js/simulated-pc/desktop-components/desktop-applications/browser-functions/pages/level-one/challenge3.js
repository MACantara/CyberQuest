// TODO: Replace the multiple choice practice scenario into a practical example
// TODO: Add protest image
// TODO: Implement reverse image search
// TODO: Implement metadata analysis
// TODO: Implement weather detail verification
// TODO: Implement location detail verification

import { BasePage } from '../base-page.js';

class Challenge3PageClass extends BasePage {
    constructor() {
        super({
            url: 'https://cyberquest.academy/level/1/challenge3',
            title: 'Image Verification Challenge - CyberQuest Academy',
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
                    trusted: true
                }
            }
        });
    }

    createContent() {
        return `
            <div class="p-6 text-gray-800 bg-white">
                <header class="border-b border-gray-200 pb-4 mb-6">
                    <h1 class="text-2xl font-bold text-gray-900">Image Verification Challenge</h1>
                    <p class="text-gray-600">Learn to spot manipulated or misused images</p>
                </header>

                <div class="prose max-w-none">
                    <section class="mb-8">
                        <h2 class="text-xl font-semibold mb-4">The Viral Image</h2>
                        <p class="mb-4">The following image has been circulating on social media with the caption: "Shocking moment from yesterday's protest - police using excessive force against peaceful demonstrators."</p>
                        
                        <div class="bg-gray-100 p-4 rounded-lg mb-6">
                            <img src="https://via.placeholder.com/800x450?text=PROTEST+IMAGE" alt="Protest scene" class="w-full h-auto rounded mb-3">
                            <p class="text-sm text-gray-600 text-center">Image shared on various social media platforms</p>
                        </div>
                        
                        <div class="bg-blue-50 p-4 rounded-lg mb-6">
                            <h3 class="font-semibold text-blue-800 mb-2">Your Task:</h3>
                            <p class="text-blue-700">Use the tools below to verify the authenticity of this image and determine if it's being used in the correct context.</p>
                        </div>
                    </section>

                    <section class="mb-8">
                        <h2 class="text-xl font-semibold mb-4">Verification Tools</h2>
                        
                        <div class="grid md:grid-cols-2 gap-6 mb-6">
                            <!-- Reverse Image Search -->
                            <div class="bg-white p-4 border border-gray-200 rounded-lg hover:border-purple-400 transition-colors shadow-sm">
                                <h3 class="font-semibold text-lg mb-2 flex items-center">
                                    <i class="bi bi-camera text-purple-500 mr-2"></i>
                                    Reverse Image Search
                                </h3>
                                <p class="text-sm text-gray-600 mb-3">Search for other instances of this image online to check its original context.</p>
                                <button id="try-reverse-search" 
                                        class="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded text-sm transition-colors duration-200 cursor-pointer"
                                        data-url="https://image-verify.cyberquest.academy/reverse-search">
                                    Use Reverse Image Search
                                </button>
                            </div>
                            
                            <!-- Image Metadata -->
                            <div class="bg-white p-4 border border-gray-200 rounded-lg hover:border-green-400 transition-colors shadow-sm">
                                <h3 class="font-semibold text-lg mb-2 flex items-center">
                                    <i class="bi bi-info-circle text-green-500 mr-2"></i>
                                    Image Metadata Analysis
                                </h3>
                                <p class="text-sm text-gray-600 mb-3">View the technical details embedded in the image file.</p>
                                <button id="try-metadata-analysis" 
                                        class="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm transition-colors duration-200 cursor-pointer"
                                        data-url="https://tools.cyberquest.academy/metadata-analyzer">
                                    Analyze Metadata
                                </button>
                            </div>
                        </div>
                        
                        <!-- Additional Tools -->
                        <div class="grid md:grid-cols-2 gap-6 mb-6">
                            <!-- Weather Verification -->
                            <div class="bg-white p-4 border border-gray-200 rounded-lg hover:border-blue-400 transition-colors shadow-sm">
                                <h3 class="font-semibold text-lg mb-2 flex items-center">
                                    <i class="bi bi-cloud-sun text-blue-500 mr-2"></i>
                                    Weather Verification
                                </h3>
                                <p class="text-sm text-gray-600 mb-3">Check if weather conditions in the image match historical records for the claimed date and location.</p>
                                <button id="try-weather-check" 
                                        class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm transition-colors duration-200 cursor-pointer"
                                        data-url="https://tools.cyberquest.academy/weather-verify">
                                    Verify Weather Data
                                </button>
                            </div>
                            
                            <!-- Location Verification -->
                            <div class="bg-white p-4 border border-gray-200 rounded-lg hover:border-orange-400 transition-colors shadow-sm">
                                <h3 class="font-semibold text-lg mb-2 flex items-center">
                                    <i class="bi bi-geo-alt text-orange-500 mr-2"></i>
                                    Location Verification
                                </h3>
                                <p class="text-sm text-gray-600 mb-3">Verify location details by analyzing landmarks, architecture, and geographical features.</p>
                                <button id="try-location-check" 
                                        class="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-3 rounded text-sm transition-colors duration-200 cursor-pointer"
                                        data-url="https://tools.cyberquest.academy/location-verify">
                                    Verify Location
                                </button>
                            </div>
                        </div>

                        <!-- Results Section -->
                        <div id="verification-results" class="hidden">
                            <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 mb-4">
                                <h4 class="font-semibold text-blue-800 mb-2">✅ Investigation Complete!</h4>
                                <p class="text-blue-700">Review your findings from the verification tools and complete your analysis below.</p>
                            </div>
                            
                            <div id="results-content" class="space-y-4">
                                <!-- Results will be populated here -->
                            </div>
                        </div>
                    </section>

                    <section class="bg-gray-50 p-6 rounded-lg">
                        <h2 class="text-xl font-semibold mb-4">Analysis & Conclusion</h2>
                        
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">1. Is this image being used in the correct context? Why or why not?</label>
                                <textarea class="w-full p-2 border border-gray-300 rounded" rows="2" placeholder="Describe your findings from the verification tools..."></textarea>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">2. What evidence supports your conclusion about the image's authenticity?</label>
                                <div class="space-y-2">
                                    <div class="flex items-start">
                                        <input type="checkbox" id="evidence1" class="mt-1 mr-2">
                                        <label for="evidence1" class="cursor-pointer">Date mismatch between image metadata and claimed event</label>
                                    </div>
                                    <div class="flex items-start">
                                        <input type="checkbox" id="evidence2" class="mt-1 mr-2">
                                        <label for="evidence2" class="cursor-pointer">Location doesn't match claimed event location</label>
                                    </div>
                                    <div class="flex items-start">
                                        <input type="checkbox" id="evidence3" class="mt-1 mr-2">
                                        <label for="evidence3" class="cursor-pointer">Weather conditions don't match historical records</label>
                                    </div>
                                    <div class="flex items-start">
                                        <input type="checkbox" id="evidence4" class="mt-1 mr-2">
                                        <label for="evidence4" class="cursor-pointer">Image appears in multiple unrelated contexts</label>
                                    </div>
                                    <div class="flex items-start">
                                        <input type="checkbox" id="evidence5" class="mt-1 mr-2">
                                        <label for="evidence5" class="cursor-pointer">Signs of digital manipulation in metadata</label>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">3. How would you respond if you saw someone sharing this image with the current caption?</label>
                                <div class="space-y-2">
                                    <div class="flex items-start">
                                        <input type="radio" id="response1" name="response" class="mt-1 mr-2">
                                        <label for="response1" class="cursor-pointer">Share it to spread awareness</label>
                                    </div>
                                    <div class="flex items-start">
                                        <input type="radio" id="response2" name="response" class="mt-1 mr-2">
                                        <label for="response2" class="cursor-pointer">Report it as misinformation</label>
                                    </div>
                                    <div class="flex items-start">
                                        <input type="radio" id="response3" name="response" class="mt-1 mr-2">
                                        <label for="response3" class="cursor-pointer">Comment with the correct information and verification sources</label>
                                    </div>
                                    <div class="flex items-start">
                                        <input type="radio" id="response4" name="response" class="mt-1 mr-2">
                                        <label for="response4" class="cursor-pointer">Ignore it and move on</label>
                                    </div>
                                </div>
                            </div>
                            
                            <button id="submitBtn" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded transition-colors duration-200 mt-4 cursor-pointer">
                                Submit Analysis
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        `;
    }

    // Method to bind events after content is rendered
    bindEvents(contentElement) {
        // Handle reverse image search tool
        const reverseSearchBtn = contentElement.querySelector('#try-reverse-search');
        if (reverseSearchBtn) {
            reverseSearchBtn.addEventListener('click', () => {
                const url = reverseSearchBtn.getAttribute('data-url');
                window.dispatchEvent(new CustomEvent('navigate-browser', { detail: { url } }));
                this.showVerificationResults(contentElement, 'reverse-search');
            });
        }

        // Handle metadata analysis tool
        const metadataBtn = contentElement.querySelector('#try-metadata-analysis');
        if (metadataBtn) {
            metadataBtn.addEventListener('click', () => {
                const url = metadataBtn.getAttribute('data-url');
                window.dispatchEvent(new CustomEvent('navigate-browser', { detail: { url } }));
                this.showVerificationResults(contentElement, 'metadata');
            });
        }

        // Handle weather verification tool
        const weatherBtn = contentElement.querySelector('#try-weather-check');
        if (weatherBtn) {
            weatherBtn.addEventListener('click', () => {
                const url = weatherBtn.getAttribute('data-url');
                window.dispatchEvent(new CustomEvent('navigate-browser', { detail: { url } }));
                this.showVerificationResults(contentElement, 'weather');
            });
        }

        // Handle location verification tool
        const locationBtn = contentElement.querySelector('#try-location-check');
        if (locationBtn) {
            locationBtn.addEventListener('click', () => {
                const url = locationBtn.getAttribute('data-url');
                window.dispatchEvent(new CustomEvent('navigate-browser', { detail: { url } }));
                this.showVerificationResults(contentElement, 'location');
            });
        }

        // Handle submit analysis button
        const submitBtn = contentElement.querySelector('#submitBtn');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                this.submitAnalysis(contentElement);
            });
        }
    }

    showVerificationResults(contentElement, toolType) {
        setTimeout(() => {
            const resultsSection = contentElement.querySelector('#verification-results');
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
            'reverse-search': `
                <h4 class="font-semibold mb-3 flex items-center">
                    <i class="bi bi-camera text-purple-500 mr-2"></i>
                    Reverse Image Search Results
                </h4>
                <div class="space-y-3">
                    <div class="bg-green-50 p-3 rounded border-l-4 border-green-500">
                        <p class="font-medium text-green-800">Original Source Found:</p>
                        <p class="text-sm text-green-700">Reuters - May 15, 2018: "Madrid protest against environmental policy"</p>
                        <p class="text-xs text-green-600">Location: Plaza de Cibeles, Madrid, Spain</p>
                    </div>
                    <div class="bg-red-50 p-3 rounded border-l-4 border-red-500">
                        <p class="font-medium text-red-800">Misuse Detected:</p>
                        <p class="text-sm text-red-700">Image is 6+ years old, not from recent events as claimed</p>
                        <p class="text-xs text-red-600">Being shared with false context in 47 recent posts</p>
                    </div>
                </div>
            `,
            'metadata': `
                <h4 class="font-semibold mb-3 flex items-center">
                    <i class="bi bi-info-circle text-green-500 mr-2"></i>
                    Metadata Analysis Results
                </h4>
                <div class="space-y-3">
                    <div class="bg-blue-50 p-3 rounded">
                        <p class="font-medium text-blue-800">Image Information:</p>
                        <ul class="text-sm text-blue-700 mt-2 space-y-1">
                            <li>• Created: May 15, 2018, 3:42 PM UTC</li>
                            <li>• Camera: Canon EOS 5D Mark IV</li>
                            <li>• GPS Coordinates: 40.4200° N, 3.6928° W (Madrid, Spain)</li>
                            <li>• Last Modified: May 15, 2018 (no digital manipulation detected)</li>
                            <li>• Original dimensions: 1920x1080 pixels</li>
                        </ul>
                    </div>
                </div>
            `,
            'weather': `
                <h4 class="font-semibold mb-3 flex items-center">
                    <i class="bi bi-cloud-sun text-blue-500 mr-2"></i>
                    Weather Verification Results
                </h4>
                <div class="space-y-3">
                    <div class="bg-green-50 p-3 rounded border-l-4 border-green-500">
                        <p class="font-medium text-green-800">Madrid Weather - May 15, 2018:</p>
                        <ul class="text-sm text-green-700 mt-2 space-y-1">
                            <li>• Temperature: 24°C (75°F)</li>
                            <li>• Conditions: Clear skies, sunny</li>
                            <li>• Wind: Light breeze from southwest</li>
                            <li>• Humidity: 45%</li>
                        </ul>
                        <p class="text-xs text-green-600 mt-2">✓ Weather conditions in image match historical records</p>
                    </div>
                    <div class="bg-yellow-50 p-3 rounded border-l-4 border-yellow-500">
                        <p class="font-medium text-yellow-800">Current Location Weather (claimed protest site):</p>
                        <p class="text-sm text-yellow-700">Weather conditions at claimed recent protest location show rain and overcast skies, contradicting the sunny conditions visible in the image.</p>
                    </div>
                </div>
            `,
            'location': `
                <h4 class="font-semibold mb-3 flex items-center">
                    <i class="bi bi-geo-alt text-orange-500 mr-2"></i>
                    Location Verification Results
                </h4>
                <div class="space-y-3">
                    <div class="bg-green-50 p-3 rounded border-l-4 border-green-500">
                        <p class="font-medium text-green-800">Landmark Analysis:</p>
                        <ul class="text-sm text-green-700 mt-2 space-y-1">
                            <li>• Identified: Plaza de Cibeles fountain (background)</li>
                            <li>• Location: Madrid, Spain</li>
                            <li>• Architecture matches: Palacio de Comunicaciones</li>
                            <li>• Street layout confirmed via satellite imagery</li>
                        </ul>
                    </div>
                    <div class="bg-red-50 p-3 rounded border-l-4 border-red-500">
                        <p class="font-medium text-red-800">Location Mismatch:</p>
                        <p class="text-sm text-red-700">Image was taken in Madrid, Spain, not at the claimed recent protest location. This confirms the image is being used out of context.</p>
                    </div>
                </div>
            `
        };
        
        return results[toolType] || '<p>Analysis in progress...</p>';
    }

    submitAnalysis(contentElement) {
        const responseChoice = contentElement.querySelector('input[name="response"]:checked');
        
        let message = '';
        let bgColor = '';
        let textColor = '';
        
        if (responseChoice) {
            if (responseChoice.id === 'response3') {
                message = '🎉 Excellent! Providing correct information with verification sources is the best way to combat misinformation while educating others.';
                bgColor = 'bg-green-100';
                textColor = 'text-green-800';
            } else if (responseChoice.id === 'response2') {
                message = '✅ Good choice! Reporting misinformation helps platforms take action, though combining this with education is even better.';
                bgColor = 'bg-blue-100';
                textColor = 'text-blue-800';
            } else if (responseChoice.id === 'response1') {
                message = '⚠️ Not recommended. Sharing without verification spreads misinformation further, even if well-intentioned.';
                bgColor = 'bg-orange-100';
                textColor = 'text-orange-800';
            } else {
                message = '🤔 While ignoring might prevent spread, actively correcting misinformation helps educate others and prevent future sharing.';
                bgColor = 'bg-yellow-100';
                textColor = 'text-yellow-800';
            }
        } else {
            message = 'Please select how you would respond to this misinformation.';
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
                            <li>• Use reverse image search to find original sources</li>
                            <li>• Check metadata for creation dates and location data</li>
                            <li>• Verify weather conditions match historical records</li>
                            <li>• Confirm location details through landmark analysis</li>
                            <li>• Always provide sources when correcting misinformation</li>
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

export const Challenge3Page = new Challenge3PageClass().toPageObject();
