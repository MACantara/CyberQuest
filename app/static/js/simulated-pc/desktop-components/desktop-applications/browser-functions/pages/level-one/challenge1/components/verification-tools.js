export class VerificationTools {
    static render() {
        return `
            <!-- Fact-Check Section -->
            <div class="mt-12 pt-6 border-t border-gray-200">
                <h3 class="text-xl font-semibold mb-4 text-red-600">🕵️ FACT-CHECK THIS STORY</h3>
                <p class="mb-4 text-gray-700">Before sharing or believing this story, use the verification tools below to investigate these claims. This is your chance to practice real fact-checking techniques!</p>
                
                <div class="grid md:grid-cols-2 gap-6 mb-6">
                    <!-- Cross-Reference Tool -->
                    <div class="bg-white p-4 border border-gray-200 rounded-lg hover:border-blue-400 transition-colors shadow-sm">
                        <h4 class="font-semibold mb-2 flex items-center">
                            <i class="bi bi-search text-blue-500 mr-2"></i>
                            Cross-Reference This Story
                        </h4>
                        <p class="text-sm text-gray-600 mb-3">Check if credible news sources are reporting the same information about Senator Johnson's emails.</p>
                        <div class="mb-3">
                            <p class="text-xs text-gray-500 mb-1">Try searching for:</p>
                            <code class="bg-gray-100 text-black px-2 py-1 rounded text-xs">"Senator Johnson email scandal"</code>
                        </div>
                        <button id="try-cross-reference" 
                                class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm transition-colors duration-200 cursor-pointer"
                                data-url="https://fact-checker.cyberquest.academy/cross-reference">
                            Use Cross-Reference Tool
                        </button>
                    </div>
                    
                    <!-- Image Verification -->
                    <div class="bg-white p-4 border border-gray-200 rounded-lg hover:border-purple-400 transition-colors shadow-sm">
                        <h4 class="font-semibold mb-2 flex items-center">
                            <i class="bi bi-camera text-purple-500 mr-2"></i>
                            Verify the Photo
                        </h4>
                        <p class="text-sm text-gray-600 mb-3">Check if the image of Senator Johnson is authentic and being used in the correct context.</p>
                        <div class="mb-3">
                            <p class="text-xs text-gray-500 mb-1">Tips:</p>
                            <ul class="text-xs text-gray-500 list-disc pl-4">
                                <li>Look for reverse image search results</li>
                                <li>Check the image metadata</li>
                            </ul>
                        </div>
                        <button id="try-image-search" 
                                class="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded text-sm transition-colors duration-200 cursor-pointer"
                                data-url="https://image-verify.cyberquest.academy/reverse-search">
                            Use Image Verification
                        </button>
                    </div>
                </div>
                
                <!-- Results Section -->
                <div id="verification-results" class="hidden">
                    <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 mb-4">
                        <h4 class="font-semibold text-blue-800 mb-2">✅ Investigation Complete!</h4>
                        <p class="text-blue-700">After using the verification tools, what did you discover about this story?</p>
                    </div>
                    
                    <div class="space-y-4">
                        <div class="p-4 bg-gray-50 rounded-lg">
                            <label class="block text-sm font-medium text-gray-700 mb-2">What did the Cross-Reference Tool reveal?</label>
                            <textarea class="w-full p-2 border border-gray-300 rounded" rows="2" placeholder="Describe what you found when searching for this story across different news sources..."></textarea>
                        </div>
                        
                        <div class="p-4 bg-gray-50 rounded-lg">
                            <label class="block text-sm font-medium text-gray-700 mb-2">What red flags indicate this might be misinformation?</label>
                            <div class="space-y-2">
                                <div class="flex items-start">
                                    <input type="checkbox" id="redflag1" class="mt-1 mr-2">
                                    <label for="redflag1" class="cursor-pointer text-sm">No coverage by major news outlets</label>
                                </div>
                                <div class="flex items-start">
                                    <input type="checkbox" id="redflag2" class="mt-1 mr-2">
                                    <label for="redflag2" class="cursor-pointer text-sm">Sensational, emotionally charged language</label>
                                </div>
                                <div class="flex items-start">
                                    <input type="checkbox" id="redflag3" class="mt-1 mr-2">
                                    <label for="redflag3" class="cursor-pointer text-sm">Vague sources ("anonymous hackers")</label>
                                </div>
                                <div class="flex items-start">
                                    <input type="checkbox" id="redflag4" class="mt-1 mr-2">
                                    <label for="redflag4" class="cursor-pointer text-sm">Urgent call to action to share immediately</label>
                                </div>
                                <div class="flex items-start">
                                    <input type="checkbox" id="redflag5" class="mt-1 mr-2">
                                    <label for="redflag5" class="cursor-pointer text-sm">Suspicious domain name</label>
                                </div>
                            </div>
                        </div>
                        
                        <div class="p-4 bg-gray-50 rounded-lg">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Based on your investigation, is this story credible?</label>
                            <div class="space-y-2">
                                <div class="flex items-start">
                                    <input type="radio" id="credible-yes" name="credible" class="mt-1 mr-2">
                                    <label for="credible-yes" class="cursor-pointer text-sm">Yes, it appears to be credible</label>
                                </div>
                                <div class="flex items-start">
                                    <input type="radio" id="credible-no" name="credible" class="mt-1 mr-2">
                                    <label for="credible-no" class="cursor-pointer text-sm">No, it appears to be misinformation</label>
                                </div>
                                <div class="flex items-start">
                                    <input type="radio" id="credible-unsure" name="credible" class="mt-1 mr-2">
                                    <label for="credible-unsure" class="cursor-pointer text-sm">Unsure, need more investigation</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <button id="submitAnalysis" class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded transition-colors duration-200 cursor-pointer mt-4">
                        Submit Investigation Results
                    </button>
                </div>
                
                <!-- Hint Section -->
                <div class="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400 mt-6">
                    <h4 class="font-semibold text-yellow-800 mb-2">💡 Investigation Tips</h4>
                    <ul class="text-yellow-700 text-sm space-y-1">
                        <li>• Use both verification tools to get a complete picture</li>
                        <li>• Pay attention to what credible sources are (or aren't) reporting</li>
                        <li>• Look for specific red flags in the language and presentation</li>
                        <li>• Consider the source of this website itself</li>
                    </ul>
                </div>
            </div>
        `;
    }
}
