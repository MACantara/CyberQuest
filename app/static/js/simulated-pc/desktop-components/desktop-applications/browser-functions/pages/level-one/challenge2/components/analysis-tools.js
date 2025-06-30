export class AnalysisTools {
    static render() {
        return `
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
        `;
    }

    static generateCrossReferenceResults() {
        return `
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
    }

    static generateBiasAnalysisResults() {
        return `
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
    }
}
