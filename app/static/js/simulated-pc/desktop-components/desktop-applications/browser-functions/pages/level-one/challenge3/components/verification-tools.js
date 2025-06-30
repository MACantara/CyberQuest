export class VerificationTools {
    static render() {
        return `
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
        `;
    }

    static getToolResults(toolType) {
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
}
