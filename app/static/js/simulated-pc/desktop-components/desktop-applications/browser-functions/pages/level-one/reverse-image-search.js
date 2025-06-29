import { BasePage } from '../base-page.js';

class ReverseImageSearchPageClass extends BasePage {
    constructor() {
        super({
            url: 'https://image-verify.cyberquest.academy/reverse-search',
            title: 'Reverse Image Search - CyberQuest Academy',
            ipAddress: '198.51.100.18',
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
                    'Image verification tool',
                    'Educational content'
                ]
            }
        });
    }

    createContent() {
        return `
            <div class="p-6 text-gray-800 bg-white">
                <header class="border-b border-gray-200 pb-4 mb-6">
                    <h1 class="text-3xl font-bold text-gray-900">Reverse Image Search Tool</h1>
                    <p class="text-gray-600">Verify the authenticity and original context of images</p>
                </header>

                <div class="prose max-w-none">
                    <section class="mb-8">
                        <div class="bg-blue-50 p-4 rounded-lg mb-6">
                            <h2 class="text-xl font-semibold text-blue-800 mb-2">How to Use This Tool</h2>
                            <p class="text-blue-700">Upload an image or enter an image URL to find where else it appears online and verify its original context.</p>
                        </div>
                        
                        <div class="grid md:grid-cols-2 gap-6 mb-6">
                            <!-- Upload Section -->
                            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                <div class="mb-4">
                                    <i class="bi bi-cloud-upload text-4xl text-gray-400"></i>
                                </div>
                                <h3 class="text-lg font-semibold mb-2">Upload Image</h3>
                                <p class="text-gray-600 mb-4">Drag and drop an image here or click to browse</p>
                                <input type="file" id="image-upload" class="hidden" accept="image/*">
                                <button id="upload-btn" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200 cursor-pointer">
                                    Choose File
                                </button>
                            </div>
                            
                            <!-- URL Section -->
                            <div class="border border-gray-300 rounded-lg p-6">
                                <h3 class="text-lg font-semibold mb-2">Or Enter Image URL</h3>
                                <input type="url" 
                                       id="image-url" 
                                       class="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                       placeholder="https://example.com/image.jpg">
                                <button id="url-search-btn" class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200 cursor-pointer">
                                    Search by URL
                                </button>
                            </div>
                        </div>
                        
                        <!-- Demo Images -->
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h3 class="text-lg font-semibold mb-3">Try with Demo Images</h3>
                            <div class="grid grid-cols-3 gap-4">
                                <div class="text-center">
                                    <img src="https://via.placeholder.com/150x100?text=Protest+Scene" 
                                         alt="Demo protest image" 
                                         class="demo-image w-full h-24 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                                         data-demo="protest">
                                    <p class="text-xs text-gray-600 mt-1">Protest Scene</p>
                                </div>
                                <div class="text-center">
                                    <img src="https://via.placeholder.com/150x100?text=News+Photo" 
                                         alt="Demo news image" 
                                         class="demo-image w-full h-24 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                                         data-demo="news">
                                    <p class="text-xs text-gray-600 mt-1">News Photo</p>
                                </div>
                                <div class="text-center">
                                    <img src="https://via.placeholder.com/150x100?text=Social+Media" 
                                         alt="Demo social media image" 
                                         class="demo-image w-full h-24 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                                         data-demo="social">
                                    <p class="text-xs text-gray-600 mt-1">Social Media</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="search-results" class="hidden">
                        <h2 class="text-2xl font-semibold mb-6">Reverse Search Results</h2>
                        
                        <div class="mb-6">
                            <div class="bg-white border border-gray-200 rounded-lg p-4">
                                <h3 class="font-semibold mb-3">Analyzed Image</h3>
                                <div class="flex items-start gap-4">
                                    <div id="analyzed-image" class="flex-shrink-0">
                                        <!-- Image will be shown here -->
                                    </div>
                                    <div id="image-info" class="flex-1">
                                        <!-- Image information will be shown here -->
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="grid md:grid-cols-1 gap-6 mb-8">
                            <!-- Search Results -->
                            <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                <h3 class="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                                    <i class="bi bi-search text-blue-600 mr-2"></i>
                                    Where This Image Appears Online
                                </h3>
                                <div id="image-matches" class="space-y-4">
                                    <!-- Results will be populated here -->
                                </div>
                            </div>
                            
                            <!-- Timeline -->
                            <div class="bg-green-50 border border-green-200 rounded-lg p-6">
                                <h3 class="text-lg font-semibold text-green-800 mb-4 flex items-center">
                                    <i class="bi bi-clock-history text-green-600 mr-2"></i>
                                    Image Timeline
                                </h3>
                                <div id="image-timeline" class="space-y-4">
                                    <!-- Timeline will be populated here -->
                                </div>
                            </div>
                            
                            <!-- Analysis -->
                            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                                <h3 class="text-lg font-semibold text-yellow-800 mb-4 flex items-center">
                                    <i class="bi bi-exclamation-triangle text-yellow-600 mr-2"></i>
                                    Verification Analysis
                                </h3>
                                <div id="verification-analysis">
                                    <!-- Analysis will be populated here -->
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            
            <script>
                // Handle file upload
                document.getElementById('upload-btn').addEventListener('click', function() {
                    document.getElementById('image-upload').click();
                });
                
                document.getElementById('image-upload').addEventListener('change', function(e) {
                    if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        performImageSearch('upload', file.name);
                    }
                });
                
                // Handle URL search
                document.getElementById('url-search-btn').addEventListener('click', function() {
                    const url = document.getElementById('image-url').value.trim();
                    if (!url) {
                        alert('Please enter an image URL.');
                        return;
                    }
                    performImageSearch('url', url);
                });
                
                // Handle demo image clicks
                document.querySelectorAll('.demo-image').forEach(img => {
                    img.addEventListener('click', function() {
                        const demoType = this.getAttribute('data-demo');
                        performImageSearch('demo', demoType);
                    });
                });
                
                function performImageSearch(type, data) {
                    const resultsSection = document.getElementById('search-results');
                    const analyzedImage = document.getElementById('analyzed-image');
                    const imageInfo = document.getElementById('image-info');
                    const imageMatches = document.getElementById('image-matches');
                    const imageTimeline = document.getElementById('image-timeline');
                    const verificationAnalysis = document.getElementById('verification-analysis');
                    
                    // Show loading state
                    resultsSection.classList.remove('hidden');
                    resultsSection.scrollIntoView({ behavior: 'smooth' });
                    
                    // Simulate different scenarios based on demo type
                    if (type === 'demo' && data === 'protest') {
                        // Protest image scenario (misused old image)
                        analyzedImage.innerHTML = \`
                            <img src="https://via.placeholder.com/200x150?text=Protest+Scene" 
                                 alt="Analyzed image" 
                                 class="w-48 h-36 object-cover rounded border">
                        \`;
                        
                        imageInfo.innerHTML = \`
                            <div class="space-y-2">
                                <p><strong>Image Dimensions:</strong> 1920x1080 pixels</p>
                                <p><strong>File Type:</strong> JPEG</p>
                                <p><strong>Estimated Date:</strong> May 15, 2018</p>
                                <p><strong>Camera Info:</strong> Canon EOS 5D Mark IV</p>
                            </div>
                        \`;
                        
                        imageMatches.innerHTML = \`
                            <div class="bg-white p-4 border border-blue-200 rounded">
                                <div class="flex items-start justify-between mb-2">
                                    <h4 class="font-semibold text-blue-800">Reuters</h4>
                                    <span class="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Original Source</span>
                                </div>
                                <p class="text-sm text-gray-700 mb-2">"Protest in Madrid, Spain" - May 15, 2018</p>
                                <p class="text-xs text-gray-500">First appearance: May 15, 2018, 3:42 PM</p>
                            </div>
                            <div class="bg-white p-4 border border-blue-200 rounded">
                                <div class="flex items-start justify-between mb-2">
                                    <h4 class="font-semibold text-blue-800">Getty Images</h4>
                                    <span class="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Stock Photo</span>
                                </div>
                                <p class="text-sm text-gray-700 mb-2">Licensed for editorial use - Madrid protest coverage</p>
                                <p class="text-xs text-gray-500">Available since: May 16, 2018</p>
                            </div>
                            <div class="bg-white p-4 border border-red-200 rounded">
                                <div class="flex items-start justify-between mb-2">
                                    <h4 class="font-semibold text-red-800">Social Media Posts</h4>
                                    <span class="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">Misused</span>
                                </div>
                                <p class="text-sm text-gray-700 mb-2">Used in 47 recent posts claiming "yesterday's protest" (incorrect context)</p>
                                <p class="text-xs text-gray-500">Recent misuse: Last 72 hours</p>
                            </div>
                        \`;
                        
                        imageTimeline.innerHTML = \`
                            <div class="relative">
                                <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-green-300"></div>
                                <div class="relative flex items-center mb-4">
                                    <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4">
                                        <i class="bi bi-camera text-white text-sm"></i>
                                    </div>
                                    <div>
                                        <p class="font-semibold">May 15, 2018</p>
                                        <p class="text-sm text-gray-600">Original photo taken during Madrid protest</p>
                                    </div>
                                </div>
                                <div class="relative flex items-center mb-4">
                                    <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                                        <i class="bi bi-newspaper text-white text-sm"></i>
                                    </div>
                                    <div>
                                        <p class="font-semibold">May 15, 2018</p>
                                        <p class="text-sm text-gray-600">Published by Reuters with proper context</p>
                                    </div>
                                </div>
                                <div class="relative flex items-center">
                                    <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-4">
                                        <i class="bi bi-exclamation-triangle text-white text-sm"></i>
                                    </div>
                                    <div>
                                        <p class="font-semibold">Recent (2024)</p>
                                        <p class="text-sm text-gray-600">Misused in social media posts with false context</p>
                                    </div>
                                </div>
                            </div>
                        \`;
                        
                        verificationAnalysis.innerHTML = \`
                            <div class="p-3 bg-red-100 border border-red-300 rounded mb-3">
                                <p class="font-semibold text-red-800">⚠️ IMAGE BEING MISUSED</p>
                                <p class="text-red-700 text-sm mt-1">This image is from 2018 and is being used out of context in recent social media posts.</p>
                            </div>
                            <ul class="space-y-2 text-gray-700">
                                <li class="flex items-start">
                                    <i class="bi bi-check-circle text-green-500 mr-2 mt-0.5"></i>
                                    <span>Original source identified: Reuters (May 15, 2018)</span>
                                </li>
                                <li class="flex items-start">
                                    <i class="bi bi-x-circle text-red-500 mr-2 mt-0.5"></i>
                                    <span>Image is 6+ years old, not from recent events</span>
                                </li>
                                <li class="flex items-start">
                                    <i class="bi bi-exclamation-triangle text-yellow-500 mr-2 mt-0.5"></i>
                                    <span>Being shared with false context claiming recent events</span>
                                </li>
                            </ul>
                        \`;
                    } else {
                        // Default scenario for other searches
                        analyzedImage.innerHTML = \`
                            <img src="https://via.placeholder.com/200x150?text=Analyzing..." 
                                 alt="Analyzing..." 
                                 class="w-48 h-36 object-cover rounded border">
                        \`;
                        
                        imageInfo.innerHTML = \`
                            <div class="space-y-2">
                                <p><strong>Status:</strong> Analyzing image...</p>
                                <p class="text-sm text-gray-600">This tool helps verify images by finding their original source and tracking their usage across the web.</p>
                            </div>
                        \`;
                        
                        imageMatches.innerHTML = \`
                            <div class="bg-white p-4 border border-blue-200 rounded">
                                <p class="text-sm text-gray-700">Searching for matches across the web...</p>
                            </div>
                        \`;
                        
                        imageTimeline.innerHTML = \`
                            <p class="text-gray-700">Building timeline of image appearances...</p>
                        \`;
                        
                        verificationAnalysis.innerHTML = \`
                            <p class="text-gray-700">Try clicking on the "Protest Scene" demo image to see how this tool identifies misused images.</p>
                        \`;
                    }
                }
            </script>
        `;
    }
}

export const ReverseImageSearchPage = new ReverseImageSearchPageClass().toPageObject();
