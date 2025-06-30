import { BasePage } from '../base-page.js';

class WeatherVerifyPageClass extends BasePage {
    constructor() {
        super({
            url: 'https://tools.cyberquest.academy/weather-verify',
            title: 'Weather Verification Tool - CyberQuest Academy',
            ipAddress: '198.51.100.20',
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
                    'Weather verification tool',
                    'Educational content'
                ]
            }
        });
    }

    createContent() {
        return `
            <div class="p-6 text-gray-800 bg-white">
                <header class="border-b border-gray-200 pb-4 mb-6">
                    <h1 class="text-3xl font-bold text-gray-900">Weather Verification Tool</h1>
                    <p class="text-gray-600">Verify weather conditions in images against historical weather data</p>
                </header>

                <div class="prose max-w-none">
                    <section class="mb-8">
                        <div class="bg-blue-50 p-4 rounded-lg mb-6">
                            <h2 class="text-xl font-semibold text-blue-800 mb-2">How Weather Verification Works</h2>
                            <p class="text-blue-700 mb-2">This tool helps verify the authenticity of images by comparing visible weather conditions with historical weather records for specific dates and locations.</p>
                            <ul class="text-blue-700 text-sm list-disc pl-5">
                                <li>Check if sky conditions (sunny, cloudy, rainy) match records</li>
                                <li>Verify seasonal consistency (snow in summer, etc.)</li>
                                <li>Compare temperature indicators (clothing, plant life)</li>
                                <li>Cross-reference with multiple weather databases</li>
                            </ul>
                        </div>
                        
                        <div class="grid md:grid-cols-2 gap-6 mb-6">
                            <!-- Manual Verification -->
                            <div class="border border-gray-300 rounded-lg p-6">
                                <h3 class="text-lg font-semibold mb-3">Verify Specific Date & Location</h3>
                                <div class="space-y-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                        <input type="text" id="location-input" 
                                               class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                               placeholder="e.g., Madrid, Spain">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                        <input type="date" id="date-input" 
                                               class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    </div>
                                    <button id="verify-weather-btn" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200 cursor-pointer">
                                        Check Weather Records
                                    </button>
                                </div>
                            </div>
                            
                            <!-- Demo Verification -->
                            <div class="border border-gray-300 rounded-lg p-6 bg-green-50">
                                <h3 class="text-lg font-semibold mb-3">Demo: Protest Image Verification</h3>
                                <p class="text-sm text-gray-600 mb-4">Verify the weather conditions in the protest image against historical data for the claimed date and location.</p>
                                <div class="bg-white p-3 rounded border mb-4">
                                    <p class="text-sm"><strong>Image claims:</strong> Recent protest during rainy weather</p>
                                    <p class="text-sm"><strong>Visible conditions:</strong> Clear skies, sunny weather</p>
                                </div>
                                <button id="demo-verify-btn" class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200 cursor-pointer">
                                    Verify Demo Image
                                </button>
                            </div>
                        </div>
                    </section>

                    <section id="verification-results" class="hidden">
                        <h2 class="text-2xl font-semibold mb-6">Weather Verification Results</h2>
                        
                        <div class="grid md:grid-cols-2 gap-6 mb-6">
                            <!-- Historical Weather Data -->
                            <div class="bg-white border border-gray-200 rounded-lg p-6">
                                <h3 class="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                                    <i class="bi bi-cloud-sun text-blue-600 mr-2"></i>
                                    Historical Weather Data
                                </h3>
                                <div id="historical-weather" class="space-y-3">
                                    <!-- Historical data will be populated here -->
                                </div>
                            </div>
                            
                            <!-- Current Conditions -->
                            <div class="bg-white border border-gray-200 rounded-lg p-6">
                                <h3 class="text-lg font-semibold text-orange-800 mb-4 flex items-center">
                                    <i class="bi bi-thermometer text-orange-600 mr-2"></i>
                                    Image Analysis
                                </h3>
                                <div id="image-conditions" class="space-y-3">
                                    <!-- Image analysis will be populated here -->
                                </div>
                            </div>
                        </div>
                        
                        <!-- Verification Summary -->
                        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                            <h3 class="text-lg font-semibold text-yellow-800 mb-4 flex items-center">
                                <i class="bi bi-exclamation-triangle text-yellow-600 mr-2"></i>
                                Verification Analysis
                            </h3>
                            <div id="weather-analysis">
                                <!-- Analysis will be populated here -->
                            </div>
                        </div>
                    </section>
                    
                    <!-- Educational Section -->
                    <section class="bg-gray-50 p-6 rounded-lg mt-8">
                        <h2 class="text-xl font-semibold mb-4">Weather Verification Tips</h2>
                        <div class="grid md:grid-cols-3 gap-6">
                            <div>
                                <h3 class="font-semibold mb-2 text-green-800">☀️ Sky Conditions</h3>
                                <ul class="text-sm space-y-1 text-gray-700">
                                    <li>• Clear vs. cloudy skies</li>
                                    <li>• Visible precipitation</li>
                                    <li>• Lighting conditions</li>
                                    <li>• Shadow directions</li>
                                </ul>
                            </div>
                            <div>
                                <h3 class="font-semibold mb-2 text-blue-800">🌡️ Temperature Indicators</h3>
                                <ul class="text-sm space-y-1 text-gray-700">
                                    <li>• Clothing worn by people</li>
                                    <li>• Breath visibility in cold</li>
                                    <li>• Plant/tree conditions</li>
                                    <li>• Seasonal appropriateness</li>
                                </ul>
                            </div>
                            <div>
                                <h3 class="font-semibold mb-2 text-red-800">⚠️ Red Flags</h3>
                                <ul class="text-sm space-y-1 text-gray-700">
                                    <li>• Impossible weather combinations</li>
                                    <li>• Seasonal inconsistencies</li>
                                    <li>• Contradictory clothing</li>
                                    <li>• Mismatched environmental cues</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        `;
    }

    // Method to bind events after content is rendered
    bindEvents(contentElement) {
        // Handle manual weather verification
        const verifyBtn = contentElement.querySelector('#verify-weather-btn');
        if (verifyBtn) {
            verifyBtn.addEventListener('click', () => {
                const location = contentElement.querySelector('#location-input').value;
                const date = contentElement.querySelector('#date-input').value;
                
                if (!location || !date) {
                    alert('Please enter both location and date.');
                    return;
                }
                
                this.verifyWeather('manual', { location, date }, contentElement);
            });
        }
        
        // Handle demo verification
        const demoBtn = contentElement.querySelector('#demo-verify-btn');
        if (demoBtn) {
            demoBtn.addEventListener('click', () => {
                this.verifyWeather('demo', { location: 'Madrid, Spain', date: '2018-05-15' }, contentElement);
            });
        }
    }

    verifyWeather(type, data, contentElement) {
        const resultsSection = contentElement.querySelector('#verification-results');
        const historicalWeather = contentElement.querySelector('#historical-weather');
        const imageConditions = contentElement.querySelector('#image-conditions');
        const weatherAnalysis = contentElement.querySelector('#weather-analysis');
        
        // Show loading state
        resultsSection.classList.remove('hidden');
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        
        // Show loading
        historicalWeather.innerHTML = '<p class="text-gray-600">Loading weather data...</p>';
        imageConditions.innerHTML = '<p class="text-gray-600">Analyzing image conditions...</p>';
        weatherAnalysis.innerHTML = '<p class="text-gray-600">Processing verification...</p>';
        
        // Simulate API delay
        setTimeout(() => {
            if (type === 'demo') {
                // Demo protest image verification
                historicalWeather.innerHTML = `
                    <div class="bg-blue-50 p-3 rounded">
                        <h4 class="font-medium text-blue-800 mb-2">Madrid, Spain - May 15, 2018</h4>
                        <div class="space-y-1 text-sm">
                            <div class="flex justify-between">
                                <span>Conditions:</span>
                                <span class="font-medium text-green-600">Clear skies, sunny</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Temperature:</span>
                                <span>24°C (75°F)</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Humidity:</span>
                                <span>45%</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Wind:</span>
                                <span>Light breeze, 8 km/h SW</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Precipitation:</span>
                                <span class="font-medium text-green-600">0mm (None)</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Visibility:</span>
                                <span>10+ km (Excellent)</span>
                            </div>
                        </div>
                    </div>
                    <div class="text-xs text-gray-500 mt-2">
                        Data sources: National Weather Service, MeteoSpain, Weather Underground
                    </div>
                `;
                
                imageConditions.innerHTML = `
                    <div class="bg-green-50 p-3 rounded">
                        <h4 class="font-medium text-green-800 mb-2">Observed Conditions in Image</h4>
                        <div class="space-y-1 text-sm">
                            <div class="flex justify-between">
                                <span>Sky:</span>
                                <span class="font-medium text-green-600">Clear, bright blue</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Shadows:</span>
                                <span>Sharp, well-defined</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Lighting:</span>
                                <span>Bright sunlight</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Clothing:</span>
                                <span>Light spring/summer attire</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Precipitation:</span>
                                <span class="font-medium text-green-600">None visible</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Plant life:</span>
                                <span>Green, healthy (spring growth)</span>
                            </div>
                        </div>
                    </div>
                `;
                
                weatherAnalysis.innerHTML = `
                    <div class="space-y-4">
                        <div class="p-3 bg-green-100 border border-green-300 rounded">
                            <p class="font-semibold text-green-800">✅ WEATHER CONDITIONS MATCH</p>
                            <p class="text-green-700 text-sm mt-1">The weather conditions visible in the image perfectly match the historical weather data for Madrid on May 15, 2018.</p>
                        </div>
                        
                        <div class="p-3 bg-red-100 border border-red-300 rounded">
                            <p class="font-semibold text-red-800">🚨 CONTEXT MISMATCH DETECTED</p>
                            <p class="text-red-700 text-sm mt-1">However, recent weather at the claimed protest location shows rainy, overcast conditions - contradicting the sunny weather visible in this image.</p>
                        </div>
                        
                        <div class="space-y-2">
                            <h4 class="font-medium">Verification Summary:</h4>
                            <ul class="text-sm space-y-1">
                                <li class="flex items-start">
                                    <i class="bi bi-check-circle text-green-500 mr-2 mt-0.5"></i>
                                    <span>Image weather matches Madrid, May 15, 2018 records</span>
                                </li>
                                <li class="flex items-start">
                                    <i class="bi bi-x-circle text-red-500 mr-2 mt-0.5"></i>
                                    <span>Does NOT match recent weather at claimed protest location</span>
                                </li>
                                <li class="flex items-start">
                                    <i class="bi bi-calendar-check text-blue-500 mr-2 mt-0.5"></i>
                                    <span>Seasonal indicators consistent with May 2018</span>
                                </li>
                                <li class="flex items-start">
                                    <i class="bi bi-exclamation-triangle text-yellow-500 mr-2 mt-0.5"></i>
                                    <span>Confirms image is from 2018, not recent events</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                `;
            } else {
                // Manual verification with generic results
                historicalWeather.innerHTML = `
                    <div class="bg-gray-50 p-3 rounded">
                        <h4 class="font-medium text-gray-800 mb-2">${data.location} - ${data.date}</h4>
                        <p class="text-gray-600 text-sm">Weather data lookup in progress...</p>
                        <p class="text-gray-500 text-xs mt-2">This demo tool shows historical weather verification. Try the demo example to see a complete analysis.</p>
                    </div>
                `;
                
                imageConditions.innerHTML = `
                    <div class="bg-gray-50 p-3 rounded">
                        <p class="text-gray-600 text-sm">Image analysis requires the actual image file for weather condition assessment.</p>
                    </div>
                `;
                
                weatherAnalysis.innerHTML = `
                    <p class="text-gray-600">Complete weather verification requires both historical data and image analysis. Use the demo example to see how this tool works.</p>
                `;
            }
        }, 2000);
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

export const WeatherVerifyPage = new WeatherVerifyPageClass().toPageObject();
