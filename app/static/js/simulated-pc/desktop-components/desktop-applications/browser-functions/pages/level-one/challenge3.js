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
                            <div class="border border-gray-200 rounded-lg p-4">
                                <h3 class="font-semibold text-lg mb-2 flex items-center">
                                    <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                    Reverse Image Search
                                </h3>
                                <p class="text-sm text-gray-600 mb-3">Search for other instances of this image online to check its original context.</p>
                                <button id="reverseSearchBtn" class="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded">
                                    Search for this image
                                </button>
                                <div id="searchResults" class="mt-3 text-sm text-gray-700 hidden">
                                    <div class="bg-white p-3 border border-gray-200 rounded mb-2">
                                        <p class="font-medium">Search Results:</p>
                                        <ul class="list-disc pl-5 mt-1 space-y-1">
                                            <li>First appeared on <span class="font-medium">Reuters</span> in 2018</li>
                                            <li>Original caption: "Protest in Madrid, Spain - May 2018"</li>
                                            <li>No matches found for recent protests</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Image Metadata -->
                            <div class="border border-gray-200 rounded-lg p-4">
                                <h3 class="font-semibold text-lg mb-2 flex items-center">
                                    <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    Image Metadata
                                </h3>
                                <p class="text-sm text-gray-600 mb-3">View the technical details embedded in the image file.</p>
                                <button id="viewMetadataBtn" class="bg-green-600 hover:bg-green-700 text-white text-sm py-1 px-3 rounded">
                                    View Metadata
                                </button>
                                <div id="metadataResults" class="mt-3 text-sm text-gray-700 hidden">
                                    <div class="bg-white p-3 border border-gray-200 rounded">
                                        <p class="font-medium">Metadata Analysis:</p>
                                        <ul class="space-y-1 mt-1">
                                            <li>Created: May 15, 2018</li>
                                            <li>Camera: Canon EOS 5D Mark IV</li>
                                            <li>Location: Madrid, Spain</li>
                                            <li>Last Modified: June 25, 2023</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Additional Tools -->
                        <div class="border border-gray-200 rounded-lg p-4 mb-6">
                            <h3 class="font-semibold text-lg mb-3">Additional Verification Tools</h3>
                            <div class="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Check Weather Data</label>
                                    <button id="weatherBtn" class="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm py-1 px-3 rounded w-full text-left">
                                        <span class="flex items-center">
                                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                                            </svg>
                                            Verify weather conditions
                                        </span>
                                    </button>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Check Location</label>
                                    <button id="locationBtn" class="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm py-1 px-3 rounded w-full text-left">
                                        <span class="flex items-center">
                                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            </svg>
                                            Verify location details
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section class="bg-gray-50 p-6 rounded-lg">
                        <h2 class="text-xl font-semibold mb-4">Analysis & Conclusion</h2>
                        
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">1. Is this image being used in the correct context? Why or why not?</label>
                                <textarea class="w-full p-2 border border-gray-300 rounded" rows="2"></textarea>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">2. What evidence supports your conclusion about the image's authenticity?</label>
                                <div class="space-y-2">
                                    <div class="flex items-start">
                                        <input type="checkbox" id="evidence1" class="mt-1 mr-2">
                                        <label for="evidence1" class="cursor-pointer">Date mismatch between image and claimed event</label>
                                    </div>
                                    <div class="flex items-start">
                                        <input type="checkbox" id="evidence2" class="mt-1 mr-2">
                                        <label for="evidence2" class="cursor-pointer">Location doesn't match claimed event</label>
                                    </div>
                                    <div class="flex items-start">
                                        <input type="checkbox" id="evidence3" class="mt-1 mr-2">
                                        <label for="evidence3" class="cursor-pointer">Image appears in multiple unrelated contexts</label>
                                    </div>
                                    <div class="flex items-start">
                                        <input type="checkbox" id="evidence4" class="mt-1 mr-2">
                                        <label for="evidence4" class="cursor-pointer">Signs of digital manipulation</label>
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
                                        <label for="response3" class="cursor-pointer">Comment with the correct information and sources</label>
                                    </div>
                                </div>
                            </div>
                            
                            <button id="submitBtn" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded transition-colors duration-200 mt-4">
                                Submit Analysis
                            </button>
                        </div>
                    </section>
                </div>
            </div>
            
            <script>
                // Toggle search results
                document.getElementById('reverseSearchBtn').addEventListener('click', function() {
                    const results = document.getElementById('searchResults');
                    results.classList.toggle('hidden');
                });
                
                // Toggle metadata results
                document.getElementById('viewMetadataBtn').addEventListener('click', function() {
                    const results = document.getElementById('metadataResults');
                    results.classList.toggle('hidden');
                });
                
                // Simulate weather check
                document.getElementById('weatherBtn').addEventListener('click', function() {
                    alert('Weather records for Madrid on May 15, 2018 show clear skies and 75°F (24°C), which matches the image. This contradicts claims of recent weather conditions at the protest location.');
                });
                
                // Simulate location check
                document.getElementById('locationBtn').addEventListener('click', function() {
                    alert('Landmark analysis confirms this is Plaza de Cibeles in Madrid, Spain, not the claimed protest location.');
                });
            </script>
        `;
    }
}

export const Challenge3Page = new Challenge3PageClass().toPageObject();
