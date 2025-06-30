export class AnalysisForm {
    static render() {
        return `
            <section class="bg-gray-50 p-6 rounded-lg">
                <h2 class="text-xl font-semibold mb-4">Analysis & Conclusion</h2>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">1. Is this image being used in the correct context? Why or why not?</label>
                        <textarea class="w-full p-2 border border-gray-300 rounded" rows="2" placeholder="Describe your findings from the verification tools..."></textarea>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">2. What evidence supports your conclusion about the image's authenticity?</label>
                        <div class="space-y-2">
                            <div class="flex items-start">
                                <input type="checkbox" id="evidence1" class="mt-1 mr-2">
                                <label for="evidence1" class="cursor-pointer">Date mismatch between image metadata and claimed event</label>
                            </div>
                            <div class="flex items-start">
                                <input type="checkbox" id="evidence2" class="mt-1 mr-2">
                                <label for="evidence2" class="cursor-pointer">Location doesn't match claimed event location</label>
                            </div>
                            <div class="flex items-start">
                                <input type="checkbox" id="evidence3" class="mt-1 mr-2">
                                <label for="evidence3" class="cursor-pointer">Weather conditions don't match historical records</label>
                            </div>
                            <div class="flex items-start">
                                <input type="checkbox" id="evidence4" class="mt-1 mr-2">
                                <label for="evidence4" class="cursor-pointer">Image appears in multiple unrelated contexts</label>
                            </div>
                            <div class="flex items-start">
                                <input type="checkbox" id="evidence5" class="mt-1 mr-2">
                                <label for="evidence5" class="cursor-pointer">Signs of digital manipulation in metadata</label>
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
                                <label for="response3" class="cursor-pointer">Comment with the correct information and verification sources</label>
                            </div>
                            <div class="flex items-start">
                                <input type="radio" id="response4" name="response" class="mt-1 mr-2">
                                <label for="response4" class="cursor-pointer">Ignore it and move on</label>
                            </div>
                        </div>
                    </div>
                    
                    <button id="submitBtn" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded transition-colors duration-200 mt-4 cursor-pointer">
                        Submit Analysis
                    </button>
                </div>
            </section>
        `;
    }

    static generateFeedback(responseId) {
        const feedbackData = {
            response3: {
                message: '🎉 Excellent! Providing correct information with verification sources is the best way to combat misinformation while educating others.',
                bgColor: 'bg-green-100',
                textColor: 'text-green-800'
            },
            response2: {
                message: '✅ Good choice! Reporting misinformation helps platforms take action, though combining this with education is even better.',
                bgColor: 'bg-blue-100',
                textColor: 'text-blue-800'
            },
            response1: {
                message: '⚠️ Not recommended. Sharing without verification spreads misinformation further, even if well-intentioned.',
                bgColor: 'bg-orange-100',
                textColor: 'text-orange-800'
            },
            response4: {
                message: '🤔 While ignoring might prevent spread, actively correcting misinformation helps educate others and prevent future sharing.',
                bgColor: 'bg-yellow-100',
                textColor: 'text-yellow-800'
            }
        };

        return feedbackData[responseId] || {
            message: 'Please select how you would respond to this misinformation.',
            bgColor: 'bg-gray-100',
            textColor: 'text-gray-800'
        };
    }
}
