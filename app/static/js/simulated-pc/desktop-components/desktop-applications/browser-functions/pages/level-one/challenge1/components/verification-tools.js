export class VerificationTools {
    static render() {
        return `
            <!-- Investigation Tools -->
            <section class="bg-gray-50 p-6 rounded-lg">
                <h2 class="text-xl font-semibold mb-4">Investigation Tools</h2>
                <p class="text-gray-600 mb-6">Use these tools to verify the authenticity of this news story.</p>
                
                <div class="grid md:grid-cols-2 gap-6 mb-6">
                    <div class="bg-white p-4 border border-gray-200 rounded-lg hover:border-blue-400 transition-colors shadow-sm">
                        <h3 class="font-semibold text-lg mb-2 flex items-center">
                            <i class="bi bi-search text-blue-500 mr-2"></i>
                            Cross-Reference Tool
                        </h3>
                        <p class="text-sm text-gray-600 mb-3">Check if other credible news sources are reporting this story</p>
                        <button id="cross-reference-tool" 
                                class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm transition-colors duration-200 cursor-pointer"
                                data-url="https://fact-checker.cyberquest.academy/cross-reference">
                            Cross-Reference Story
                        </button>
                    </div>
                    
                    <div class="bg-white p-4 border border-gray-200 rounded-lg hover:border-green-400 transition-colors shadow-sm">
                        <h3 class="font-semibold text-lg mb-2 flex items-center">
                            <i class="bi bi-shield-check text-green-500 mr-2"></i>
                            Source Analysis
                        </h3>
                        <p class="text-sm text-gray-600 mb-3">Analyze the credibility and history of this website</p>
                        <button class="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm transition-colors duration-200 cursor-pointer">
                            Analyze Source
                        </button>
                    </div>
                </div>

                <!-- Analysis Form -->
                <div class="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 class="font-semibold mb-3">Your Analysis</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                What did you discover about this story?
                            </label>
                            <textarea class="w-full p-2 border border-gray-300 rounded text-sm" 
                                      rows="3" 
                                      placeholder="Describe your findings from the verification tools..."
                                      id="analysis-notes"></textarea>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Is this story credible?
                            </label>
                            <div class="space-y-2">
                                <div class="flex items-center">
                                    <input type="radio" id="credible-yes" name="credibility" value="yes" class="mr-2">
                                    <label for="credible-yes" class="text-sm">Yes, it appears to be legitimate news</label>
                                </div>
                                <div class="flex items-center">
                                    <input type="radio" id="credible-no" name="credibility" value="no" class="mr-2">
                                    <label for="credible-no" class="text-sm">No, this appears to be misinformation</label>
                                </div>
                                <div class="flex items-center">
                                    <input type="radio" id="credible-unsure" name="credibility" value="unsure" class="mr-2">
                                    <label for="credible-unsure" class="text-sm">I need more information to decide</label>
                                </div>
                            </div>
                        </div>
                        
                        <button id="submit-analysis" 
                                class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded transition-colors duration-200 cursor-pointer">
                            Submit Analysis
                        </button>
                    </div>
                </div>
            </section>
        `;
    }
}
