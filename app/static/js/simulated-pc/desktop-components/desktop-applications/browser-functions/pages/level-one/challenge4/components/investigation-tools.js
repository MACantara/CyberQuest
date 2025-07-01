export class InvestigationTools {
    static render() {
        return `
            <div class="grid md:grid-cols-2 gap-6 mb-6">
                <!-- Profile Analysis Tool -->
                <div class="bg-white p-4 border border-gray-200 rounded-lg hover:border-blue-400 transition-colors shadow-sm">
                    <h3 class="font-semibold text-lg mb-2 flex items-center">
                        <i class="bi bi-person-badge text-blue-500 mr-2"></i>
                        Profile Analysis
                    </h3>
                    <p class="text-sm text-black mb-3">Investigate the account that posted this claim</p>
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
                    <p class="text-sm text-black mb-3">Cross-reference the medical claims with credible sources</p>
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
                    <p class="text-sm text-black mb-3">Analyze sharing patterns and bot activity</p>
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
                    <p class="text-sm text-black mb-3">Detect emotional manipulation and bias indicators</p>
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
        `;
    }

    static getToolResults(toolType) {
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
}
