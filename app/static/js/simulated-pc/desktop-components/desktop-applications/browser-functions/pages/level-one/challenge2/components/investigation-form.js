export class InvestigationForm {
    static render() {
        return `
            <!-- Investigation Form -->
            <div class="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                <h4 class="font-semibold mb-3">Your Investigation Report</h4>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Which source appears most reliable and why?</label>
                        <div class="space-y-2">
                            <div class="flex items-start">
                                <input type="radio" id="reliable-metro" name="reliable" value="metro" class="mt-1 mr-2">
                                <label for="reliable-metro" class="cursor-pointer text-sm">Metro Daily News - Provides specific numbers and neutral language</label>
                            </div>
                            <div class="flex items-start">
                                <input type="radio" id="reliable-clarion" name="reliable" value="clarion" class="mt-1 mr-2">
                                <label for="reliable-clarion" class="cursor-pointer text-sm">The Daily Clarion - Most detailed coverage of the events</label>
                            </div>
                            <div class="flex items-start">
                                <input type="radio" id="reliable-citypress" name="reliable" value="citypress" class="mt-1 mr-2">
                                <label for="reliable-citypress" class="cursor-pointer text-sm">City Press Online - Balanced reporting with official confirmation</label>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">What discrepancies did you notice between the sources?</label>
                        <textarea class="w-full p-2 border border-gray-300 rounded text-sm" rows="3" placeholder="Describe the main differences in numbers, language, and framing..."></textarea>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">How would you verify which account is most accurate?</label>
                        <div class="space-y-2">
                            <div class="flex items-start">
                                <input type="checkbox" id="verify1" class="mt-1 mr-2">
                                <label for="verify1" class="cursor-pointer text-sm">Check official police records and statements</label>
                            </div>
                            <div class="flex items-start">
                                <input type="checkbox" id="verify2" class="mt-1 mr-2">
                                <label for="verify2" class="cursor-pointer text-sm">Look for video evidence from multiple angles</label>
                            </div>
                            <div class="flex items-start">
                                <input type="checkbox" id="verify3" class="mt-1 mr-2">
                                <label for="verify3" class="cursor-pointer text-sm">Cross-reference with other news outlets</label>
                            </div>
                            <div class="flex items-start">
                                <input type="checkbox" id="verify4" class="mt-1 mr-2">
                                <label for="verify4" class="cursor-pointer text-sm">Contact event organizers and witnesses</label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <button id="submit-comparison" class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded transition-colors duration-200 cursor-pointer mt-4">
                    Submit Analysis
                </button>
            </div>
        `;
    }

    static generateFeedback(choice) {
        const feedbackData = {
            citypress: {
                message: '🎉 Excellent analysis! City Press Online shows the best journalistic practices: balanced reporting, official source verification, and neutral language while acknowledging multiple perspectives.',
                bgColor: 'bg-green-100',
                textColor: 'text-green-800'
            },
            metro: {
                message: '✅ Good choice! Metro Daily News is also reliable with neutral reporting and specific details. City Press Online edges ahead with official verification and more complete coverage.',
                bgColor: 'bg-blue-100',
                textColor: 'text-blue-800'
            },
            clarion: {
                message: '⚠️ Not quite. The Daily Clarion shows clear bias with sensationalized language, inflated numbers, and emotionally charged reporting that prioritizes drama over accuracy.',
                bgColor: 'bg-orange-100',
                textColor: 'text-orange-800'
            }
        };

        return feedbackData[choice] || {
            message: 'Please select which source you found most reliable based on your analysis.',
            bgColor: 'bg-gray-100',
            textColor: 'text-gray-800'
        };
    }
}
