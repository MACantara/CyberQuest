import { BasePage } from '../base-page.js';

class MetadataAnalyzerPageClass extends BasePage {
    constructor() {
        super({
            url: 'https://tools.cyberquest.academy/metadata-analyzer',
            title: 'Image Metadata Analyzer - CyberQuest Academy',
            ipAddress: '198.51.100.19',
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
                    'Metadata analysis tool',
                    'Educational content'
                ]
            }
        });
    }

    createContent() {
        return `
            <div class="p-6 text-gray-800 bg-white">
                <header class="border-b border-gray-200 pb-4 mb-6">
                    <h1 class="text-3xl font-bold text-gray-900">Image Metadata Analyzer</h1>
                    <p class="text-gray-600">Extract and analyze technical information embedded in image files</p>
                </header>

                <div class="prose max-w-none">
                    <section class="mb-8">
                        <div class="bg-blue-50 p-4 rounded-lg mb-6">
                            <h2 class="text-xl font-semibold text-blue-800 mb-2">What is Image Metadata?</h2>
                            <p class="text-blue-700 mb-2">Metadata is information about the image that's embedded in the file, including:</p>
                            <ul class="text-blue-700 text-sm list-disc pl-5">
                                <li>When and where the photo was taken</li>
                                <li>Camera settings and equipment used</li>
                                <li>Software used to edit the image</li>
                                <li>GPS coordinates (if location services were enabled)</li>
                            </ul>
                        </div>
                        
                        <div class="grid md:grid-cols-2 gap-6 mb-6">
                            <!-- Upload Section -->
                            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                <div class="mb-4">
                                    <i class="bi bi-file-earmark-image text-4xl text-gray-400"></i>
                                </div>
                                <h3 class="text-lg font-semibold mb-2">Upload Image</h3>
                                <p class="text-gray-600 mb-4">Drag and drop an image here or click to browse</p>
                                <input type="file" id="image-upload" class="hidden" accept="image/*">
                                <button id="upload-btn" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200 cursor-pointer">
                                    Choose File
                                </button>
                            </div>
                            
                            <!-- Demo Analysis -->
                            <div class="border border-gray-300 rounded-lg p-6">
                                <h3 class="text-lg font-semibold mb-2">Demo Analysis</h3>
                                <p class="text-gray-600 mb-4">Analyze the protest image from Challenge 3</p>
                                <img src="https://via.placeholder.com/200x120?text=Protest+Demo" 
                                     alt="Demo protest image" 
                                     class="w-full h-32 object-cover rounded mb-3">
                                <button id="demo-analysis-btn" class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200 cursor-pointer">
                                    Analyze Demo Image
                                </button>
                            </div>
                        </div>
                    </section>

                    <section id="analysis-results" class="hidden">
                        <h2 class="text-2xl font-semibold mb-6">Metadata Analysis Results</h2>
                        
                        <div class="grid md:grid-cols-2 gap-6 mb-6">
                            <!-- Basic Information -->
                            <div class="bg-white border border-gray-200 rounded-lg p-6">
                                <h3 class="text-lg font-semibold text-green-800 mb-4 flex items-center">
                                    <i class="bi bi-info-circle text-green-600 mr-2"></i>
                                    Basic Information
                                </h3>
                                <div id="basic-info" class="space-y-2 text-sm">
                                    <!-- Basic info will be populated here -->
                                </div>
                            </div>
                            
                            <!-- Camera Settings -->
                            <div class="bg-white border border-gray-200 rounded-lg p-6">
                                <h3 class="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                                    <i class="bi bi-camera text-blue-600 mr-2"></i>
                                    Camera Information
                                </h3>
                                <div id="camera-info" class="space-y-2 text-sm">
                                    <!-- Camera info will be populated here -->
                                </div>
                            </div>
                        </div>
                        
                        <div class="grid md:grid-cols-2 gap-6 mb-6">
                            <!-- Location Data -->
                            <div class="bg-white border border-gray-200 rounded-lg p-6">
                                <h3 class="text-lg font-semibold text-orange-800 mb-4 flex items-center">
                                    <i class="bi bi-geo-alt text-orange-600 mr-2"></i>
                                    Location Data
                                </h3>
                                <div id="location-info" class="space-y-2 text-sm">
                                    <!-- Location info will be populated here -->
                                </div>
                            </div>
                            
                            <!-- Edit History -->
                            <div class="bg-white border border-gray-200 rounded-lg p-6">
                                <h3 class="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                                    <i class="bi bi-clock-history text-purple-600 mr-2"></i>
                                    Edit History
                                </h3>
                                <div id="edit-info" class="space-y-2 text-sm">
                                    <!-- Edit info will be populated here -->
                                </div>
                            </div>
                        </div>
                        
                        <!-- Analysis Summary -->
                        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                            <h3 class="text-lg font-semibold text-yellow-800 mb-4 flex items-center">
                                <i class="bi bi-exclamation-triangle text-yellow-600 mr-2"></i>
                                Verification Analysis
                            </h3>
                            <div id="verification-summary">
                                <!-- Verification summary will be populated here -->
                            </div>
                        </div>
                    </section>
                    
                    <!-- Educational Section -->
                    <section class="bg-gray-50 p-6 rounded-lg mt-8">
                        <h2 class="text-xl font-semibold mb-4">Understanding Metadata for Fact-Checking</h2>
                        <div class="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 class="font-semibold mb-2 text-green-800">✅ What to Look For:</h3>
                                <ul class="text-sm space-y-1 text-gray-700">
                                    <li>• Creation date and time</li>
                                    <li>• GPS coordinates for location verification</li>
                                    <li>• Camera model and settings</li>
                                    <li>• Software used for editing</li>
                                    <li>• File modification history</li>
                                </ul>
                            </div>
                            <div>
                                <h3 class="font-semibold mb-2 text-red-800">⚠️ Red Flags:</h3>
                                <ul class="text-sm space-y-1 text-gray-700">
                                    <li>• Missing or stripped metadata</li>
                                    <li>• Creation date doesn't match claimed event</li>
                                    <li>• Location data contradicts story</li>
                                    <li>• Evidence of heavy editing or manipulation</li>
                                    <li>• Inconsistent camera information</li>
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
        // Handle file upload
        const uploadBtn = contentElement.querySelector('#upload-btn');
        const imageUpload = contentElement.querySelector('#image-upload');
        
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                imageUpload.click();
            });
        }
        
        if (imageUpload) {
            imageUpload.addEventListener('change', (e) => {
                if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    this.analyzeImage('upload', file.name, contentElement);
                }
            });
        }
        
        // Handle demo analysis
        const demoBtn = contentElement.querySelector('#demo-analysis-btn');
        if (demoBtn) {
            demoBtn.addEventListener('click', () => {
                this.analyzeImage('demo', 'protest-image.jpg', contentElement);
            });
        }
    }

    analyzeImage(type, filename, contentElement) {
        const resultsSection = contentElement.querySelector('#analysis-results');
        const basicInfo = contentElement.querySelector('#basic-info');
        const cameraInfo = contentElement.querySelector('#camera-info');
        const locationInfo = contentElement.querySelector('#location-info');
        const editInfo = contentElement.querySelector('#edit-info');
        const verificationSummary = contentElement.querySelector('#verification-summary');
        
        // Show loading state
        resultsSection.classList.remove('hidden');
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        
        // Simulate analysis delay
        setTimeout(() => {
            if (type === 'demo') {
                // Demo protest image analysis
                basicInfo.innerHTML = `
                    <div class="flex justify-between"><span class="font-medium">File Name:</span><span>madrid_protest_2018.jpg</span></div>
                    <div class="flex justify-between"><span class="font-medium">File Size:</span><span>2.4 MB</span></div>
                    <div class="flex justify-between"><span class="font-medium">Dimensions:</span><span>1920 × 1080 pixels</span></div>
                    <div class="flex justify-between"><span class="font-medium">Format:</span><span>JPEG</span></div>
                    <div class="flex justify-between"><span class="font-medium">Color Space:</span><span>sRGB</span></div>
                `;
                
                cameraInfo.innerHTML = `
                    <div class="flex justify-between"><span class="font-medium">Camera Make:</span><span>Canon</span></div>
                    <div class="flex justify-between"><span class="font-medium">Camera Model:</span><span>EOS 5D Mark IV</span></div>
                    <div class="flex justify-between"><span class="font-medium">Date Taken:</span><span class="text-green-600 font-medium">May 15, 2018 15:42:33</span></div>
                    <div class="flex justify-between"><span class="font-medium">ISO Speed:</span><span>400</span></div>
                    <div class="flex justify-between"><span class="font-medium">Aperture:</span><span>f/5.6</span></div>
                    <div class="flex justify-between"><span class="font-medium">Shutter Speed:</span><span>1/250 sec</span></div>
                    <div class="flex justify-between"><span class="font-medium">Focal Length:</span><span>85mm</span></div>
                `;
                
                locationInfo.innerHTML = `
                    <div class="flex justify-between"><span class="font-medium">GPS Latitude:</span><span class="text-orange-600 font-medium">40.4200° N</span></div>
                    <div class="flex justify-between"><span class="font-medium">GPS Longitude:</span><span class="text-orange-600 font-medium">3.6928° W</span></div>
                    <div class="flex justify-between"><span class="font-medium">Location:</span><span>Madrid, Spain</span></div>
                    <div class="flex justify-between"><span class="font-medium">Altitude:</span><span>650 meters</span></div>
                    <div class="flex justify-between"><span class="font-medium">Direction:</span><span>Southeast (142°)</span></div>
                `;
                
                editInfo.innerHTML = `
                    <div class="flex justify-between"><span class="font-medium">Created:</span><span>May 15, 2018 15:42:33</span></div>
                    <div class="flex justify-between"><span class="font-medium">Modified:</span><span class="text-green-600">May 15, 2018 15:42:33</span></div>
                    <div class="flex justify-between"><span class="font-medium">Software:</span><span>Canon EOS 5D Mark IV Firmware 1.1.0</span></div>
                    <div class="flex justify-between"><span class="font-medium">Color Profile:</span><span>sRGB IEC61966-2.1</span></div>
                    <div class="bg-green-50 p-2 rounded mt-2">
                        <p class="text-green-700 text-xs">✓ No evidence of post-processing or digital manipulation</p>
                    </div>
                `;
                
                verificationSummary.innerHTML = `
                    <div class="space-y-3">
                        <div class="p-3 bg-red-100 border border-red-300 rounded">
                            <p class="font-semibold text-red-800">🚨 CONTEXT MISMATCH DETECTED</p>
                            <p class="text-red-700 text-sm mt-1">This image was taken on May 15, 2018, in Madrid, Spain - not during recent events as claimed.</p>
                        </div>
                        <div class="space-y-2">
                            <h4 class="font-medium">Key Findings:</h4>
                            <ul class="text-sm space-y-1">
                                <li class="flex items-start">
                                    <i class="bi bi-check-circle text-green-500 mr-2 mt-0.5"></i>
                                    <span>Image is authentic (no digital manipulation detected)</span>
                                </li>
                                <li class="flex items-start">
                                    <i class="bi bi-calendar-x text-red-500 mr-2 mt-0.5"></i>
                                    <span>Creation date: May 15, 2018 (6+ years old)</span>
                                </li>
                                <li class="flex items-start">
                                    <i class="bi bi-geo-alt text-orange-500 mr-2 mt-0.5"></i>
                                    <span>Location: Madrid, Spain (not claimed protest location)</span>
                                </li>
                                <li class="flex items-start">
                                    <i class="bi bi-exclamation-triangle text-yellow-500 mr-2 mt-0.5"></i>
                                    <span>Being used out of context in recent social media posts</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                `;
            } else {
                // Generic analysis for uploaded files
                basicInfo.innerHTML = `
                    <div class="flex justify-between"><span class="font-medium">File Name:</span><span>${filename}</span></div>
                    <div class="flex justify-between"><span class="font-medium">Analysis:</span><span>In progress...</span></div>
                `;
                
                cameraInfo.innerHTML = `<p class="text-gray-600">Analyzing camera information...</p>`;
                locationInfo.innerHTML = `<p class="text-gray-600">Extracting location data...</p>`;
                editInfo.innerHTML = `<p class="text-gray-600">Checking edit history...</p>`;
                verificationSummary.innerHTML = `<p class="text-gray-600">This tool demonstrates metadata analysis. Try the demo image to see a complete analysis.</p>`;
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

export const MetadataAnalyzerPage = new MetadataAnalyzerPageClass().toPageObject();
