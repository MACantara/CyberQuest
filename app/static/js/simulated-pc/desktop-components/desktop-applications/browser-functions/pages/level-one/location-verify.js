import { BasePage } from '../base-page.js';

class LocationVerifyPageClass extends BasePage {
    constructor() {
        super({
            url: 'https://tools.cyberquest.academy/location-verify',
            title: 'Location Verification Tool - CyberQuest Academy',
            ipAddress: '198.51.100.21',
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
                    'Location verification tool',
                    'Educational content'
                ]
            }
        });
    }

    createContent() {
        return `
            <div class="p-6 text-gray-800 bg-white">
                <header class="border-b border-gray-200 pb-4 mb-6">
                    <h1 class="text-3xl font-bold text-gray-900">Location Verification Tool</h1>
                    <p class="text-gray-600">Verify location claims in images through landmark and geographical analysis</p>
                </header>

                <div class="prose max-w-none">
                    <section class="mb-8">
                        <div class="bg-blue-50 p-4 rounded-lg mb-6">
                            <h2 class="text-xl font-semibold text-blue-800 mb-2">How Location Verification Works</h2>
                            <p class="text-blue-700 mb-2">This tool helps verify if images were taken at claimed locations by analyzing landmarks, architecture, and geographical features visible in the image.</p>
                            <ul class="text-blue-700 text-sm list-disc pl-5">
                                <li>Identify landmarks and architectural features</li>
                                <li>Compare with satellite imagery and street views</li>
                                <li>Analyze geographical consistency (terrain, vegetation)</li>
                                <li>Cross-reference with known location databases</li>
                            </ul>
                        </div>
                        
                        <div class="grid md:grid-cols-2 gap-6 mb-6">
                            <!-- Manual Location Check -->
                            <div class="border border-gray-300 rounded-lg p-6">
                                <h3 class="text-lg font-semibold mb-3">Verify Specific Location</h3>
                                <div class="space-y-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Claimed Location</label>
                                        <input type="text" id="claimed-location" 
                                               class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                               placeholder="e.g., Times Square, New York">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Observed Features</label>
                                        <textarea id="observed-features" 
                                                  class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                  rows="3"
                                                  placeholder="Describe landmarks, buildings, signs, or geographical features visible in the image..."></textarea>
                                    </div>
                                    <button id="verify-location-btn" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200 cursor-pointer">
                                        Verify Location Match
                                    </button>
                                </div>
                            </div>
                            
                            <!-- Demo Verification -->
                            <div class="border border-gray-300 rounded-lg p-6 bg-orange-50">
                                <h3 class="text-lg font-semibold mb-3">Demo: Protest Image Location</h3>
                                <p class="text-sm text-gray-600 mb-4">Verify if the protest image was actually taken at the claimed location using landmark analysis.</p>
                                <div class="bg-white p-3 rounded border mb-4">
                                    <p class="text-sm"><strong>Claim:</strong> Recent protest at local City Hall</p>
                                    <p class="text-sm"><strong>Visible features:</strong> Fountain, classical architecture, plaza setting</p>
                                </div>
                                <button id="demo-location-btn" class="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200 cursor-pointer">
                                    Analyze Demo Location
                                </button>
                            </div>
                        </div>
                    </section>

                    <section id="location-results" class="hidden">
                        <h2 class="text-2xl font-semibold mb-6">Location Verification Results</h2>
                        
                        <div class="grid md:grid-cols-2 gap-6 mb-6">
                            <!-- Location Analysis -->
                            <div class="bg-white border border-gray-200 rounded-lg p-6">
                                <h3 class="text-lg font-semibold text-orange-800 mb-4 flex items-center">
                                    <i class="bi bi-geo-alt text-orange-600 mr-2"></i>
                                    Landmark Analysis
                                </h3>
                                <div id="landmark-analysis" class="space-y-3">
                                    <!-- Landmark data will be populated here -->
                                </div>
                            </div>
                            
                            <!-- Geographical Features -->
                            <div class="bg-white border border-gray-200 rounded-lg p-6">
                                <h3 class="text-lg font-semibold text-green-800 mb-4 flex items-center">
                                    <i class="bi bi-map text-green-600 mr-2"></i>
                                    Geographical Features
                                </h3>
                                <div id="geographical-features" class="space-y-3">
                                    <!-- Geographical data will be populated here -->
                                </div>
                            </div>
                        </div>
                        
                        <!-- Location Match Summary -->
                        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                            <h3 class="text-lg font-semibold text-yellow-800 mb-4 flex items-center">
                                <i class="bi bi-exclamation-triangle text-yellow-600 mr-2"></i>
                                Location Verification Summary
                            </h3>
                            <div id="location-summary">
                                <!-- Summary will be populated here -->
                            </div>
                        </div>
                    </section>
                    
                    <!-- Educational Section -->
                    <section class="bg-gray-50 p-6 rounded-lg mt-8">
                        <h2 class="text-xl font-semibold mb-4">Location Verification Techniques</h2>
                        <div class="grid md:grid-cols-3 gap-6">
                            <div>
                                <h3 class="font-semibold mb-2 text-blue-800">🏛️ Landmarks</h3>
                                <ul class="text-sm space-y-1 text-gray-700">
                                    <li>• Distinctive buildings</li>
                                    <li>• Monuments and statues</li>
                                    <li>• Street signs and names</li>
                                    <li>• Architectural styles</li>
                                </ul>
                            </div>
                            <div>
                                <h3 class="font-semibold mb-2 text-green-800">🌍 Geography</h3>
                                <ul class="text-sm space-y-1 text-gray-700">
                                    <li>• Terrain and elevation</li>
                                    <li>• Vegetation types</li>
                                    <li>• Climate indicators</li>
                                    <li>• Natural features</li>
                                </ul>
                            </div>
                            <div>
                                <h3 class="font-semibold mb-2 text-red-800">⚠️ Verification Tips</h3>
                                <ul class="text-sm space-y-1 text-gray-700">
                                    <li>• Compare with satellite imagery</li>
                                    <li>• Check street view data</li>
                                    <li>• Look for unique features</li>
                                    <li>• Verify through multiple sources</li>
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
        // Handle manual location verification
        const verifyBtn = contentElement.querySelector('#verify-location-btn');
        if (verifyBtn) {
            verifyBtn.addEventListener('click', () => {
                const location = contentElement.querySelector('#claimed-location').value;
                const features = contentElement.querySelector('#observed-features').value;
                
                if (!location || !features) {
                    alert('Please enter both the claimed location and observed features.');
                    return;
                }
                
                this.verifyLocation('manual', { location, features }, contentElement);
            });
        }
        
        // Handle demo verification
        const demoBtn = contentElement.querySelector('#demo-location-btn');
        if (demoBtn) {
            demoBtn.addEventListener('click', () => {
                this.verifyLocation('demo', { location: 'Local City Hall', features: 'Fountain, classical architecture, plaza' }, contentElement);
            });
        }
    }

    verifyLocation(type, data, contentElement) {
        const resultsSection = contentElement.querySelector('#location-results');
        const landmarkAnalysis = contentElement.querySelector('#landmark-analysis');
        const geographicalFeatures = contentElement.querySelector('#geographical-features');
        const locationSummary = contentElement.querySelector('#location-summary');
        
        // Show loading state
        resultsSection.classList.remove('hidden');
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        
        // Show loading
        landmarkAnalysis.innerHTML = '<p class="text-gray-600">Analyzing landmarks...</p>';
        geographicalFeatures.innerHTML = '<p class="text-gray-600">Analyzing geographical features...</p>';
        locationSummary.innerHTML = '<p class="text-gray-600">Processing location verification...</p>';
        
        // Simulate analysis delay
        setTimeout(() => {
            if (type === 'demo') {
                // Demo protest image location verification
                landmarkAnalysis.innerHTML = `
                    <div class="bg-green-50 p-3 rounded">
                        <h4 class="font-medium text-green-800 mb-2">Identified Landmarks</h4>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span class="font-medium">Plaza de Cibeles Fountain:</span>
                                <span class="text-green-600">✓ Confirmed</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="font-medium">Palacio de Comunicaciones:</span>
                                <span class="text-green-600">✓ Confirmed</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="font-medium">Classical Architecture Style:</span>
                                <span class="text-green-600">✓ Matches</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="font-medium">Plaza Layout:</span>
                                <span class="text-green-600">✓ Consistent</span>
                            </div>
                        </div>
                    </div>
                    <div class="text-xs text-gray-500 mt-2">
                        Cross-referenced with: Google Maps, Satellite imagery, Street View data
                    </div>
                `;
                
                geographicalFeatures.innerHTML = `
                    <div class="bg-blue-50 p-3 rounded">
                        <h4 class="font-medium text-blue-800 mb-2">Geographical Analysis</h4>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span class="font-medium">Location:</span>
                                <span class="text-blue-600">Madrid, Spain</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="font-medium">Coordinates:</span>
                                <span>40.4200° N, 3.6928° W</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="font-medium">Elevation:</span>
                                <span>650 meters</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="font-medium">Urban Environment:</span>
                                <span class="text-blue-600">Metropolitan center</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="font-medium">Vegetation:</span>
                                <span>Mediterranean urban landscape</span>
                            </div>
                        </div>
                    </div>
                `;
                
                locationSummary.innerHTML = `
                    <div class="space-y-4">
                        <div class="p-3 bg-red-100 border border-red-300 rounded">
                            <p class="font-semibold text-red-800">🚨 LOCATION MISMATCH DETECTED</p>
                            <p class="text-red-700 text-sm mt-1">The image was taken in Madrid, Spain, not at the claimed "local City Hall" protest location.</p>
                        </div>
                        
                        <div class="space-y-2">
                            <h4 class="font-medium">Verification Results:</h4>
                            <ul class="text-sm space-y-1">
                                <li class="flex items-start">
                                    <i class="bi bi-check-circle text-green-500 mr-2 mt-0.5"></i>
                                    <span>Landmarks confirmed: Plaza de Cibeles, Madrid</span>
                                </li>
                                <li class="flex items-start">
                                    <i class="bi bi-x-circle text-red-500 mr-2 mt-0.5"></i>
                                    <span>Does NOT match claimed local protest location</span>
                                </li>
                                <li class="flex items-start">
                                    <i class="bi bi-geo-alt text-blue-500 mr-2 mt-0.5"></i>
                                    <span>Actual location: Madrid, Spain (verified)</span>
                                </li>
                                <li class="flex items-start">
                                    <i class="bi bi-exclamation-triangle text-yellow-500 mr-2 mt-0.5"></i>
                                    <span>Image being used out of geographical context</span>
                                </li>
                            </ul>
                        </div>
                        
                        <div class="bg-gray-100 p-3 rounded">
                            <h4 class="font-medium text-gray-800 mb-1">Confidence Level:</h4>
                            <div class="flex items-center">
                                <div class="flex-1 bg-gray-300 rounded-full h-2 mr-2">
                                    <div class="bg-green-500 h-2 rounded-full" style="width: 95%"></div>
                                </div>
                                <span class="text-sm font-medium">95% confident</span>
                            </div>
                            <p class="text-xs text-gray-600 mt-1">Based on landmark matching and geographical analysis</p>
                        </div>
                    </div>
                `;
            } else {
                // Manual verification with generic results
                landmarkAnalysis.innerHTML = `
                    <div class="bg-gray-50 p-3 rounded">
                        <h4 class="font-medium text-gray-800 mb-2">${data.location}</h4>
                        <p class="text-gray-600 text-sm">Landmark analysis in progress...</p>
                        <p class="text-gray-500 text-xs mt-2">This demo tool shows location verification analysis. Try the demo example to see a complete verification.</p>
                    </div>
                `;
                
                geographicalFeatures.innerHTML = `
                    <div class="bg-gray-50 p-3 rounded">
                        <p class="text-gray-600 text-sm">Geographical analysis requires image processing capabilities not available in this demo.</p>
                    </div>
                `;
                
                locationSummary.innerHTML = `
                    <p class="text-gray-600">Complete location verification requires image analysis capabilities. Use the demo example to see how this tool works.</p>
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

export const LocationVerifyPage = new LocationVerifyPageClass().toPageObject();
