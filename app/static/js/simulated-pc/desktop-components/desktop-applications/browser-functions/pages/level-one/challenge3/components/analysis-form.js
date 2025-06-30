export class AnalysisForm {
    static render() {
        return `
            <section class="bg-gray-50 p-6 rounded-lg">
                <h2 class="text-xl font-semibold mb-4">Practical Image Investigation</h2>
                
                <div class="space-y-6">
                    <div class="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 class="font-semibold mb-3 text-gray-800">Investigation Report</h3>
                        <p class="text-sm text-gray-600 mb-4">Based on your use of the verification tools above, complete this investigation report:</p>
                        
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">1. Original Source Information</label>
                                <div class="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <input type="text" 
                                               class="w-full p-2 border border-gray-300 rounded text-sm"
                                               placeholder="Original publication (e.g., Reuters, Getty Images)"
                                               id="original-source">
                                    </div>
                                    <div>
                                        <input type="date" 
                                               class="w-full p-2 border border-gray-300 rounded text-sm"
                                               id="original-date">
                                    </div>
                                </div>
                                <div class="mt-2">
                                    <input type="text" 
                                           class="w-full p-2 border border-gray-300 rounded text-sm"
                                           placeholder="Original location (city, country)"
                                           id="original-location">
                                </div>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">2. Evidence of Misuse</label>
                                <textarea class="w-full p-2 border border-gray-300 rounded text-sm" 
                                          rows="3" 
                                          placeholder="Describe how the image is being misused (e.g., wrong date, wrong location, false context)"
                                          id="misuse-evidence"></textarea>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">3. Verification Methods Used</label>
                                <div class="grid md:grid-cols-2 gap-4">
                                    <div class="space-y-2">
                                        <div class="flex items-center">
                                            <input type="checkbox" id="used-reverse-search" class="mr-2">
                                            <label for="used-reverse-search" class="text-sm">Reverse image search</label>
                                        </div>
                                        <div class="flex items-center">
                                            <input type="checkbox" id="used-metadata" class="mr-2">
                                            <label for="used-metadata" class="text-sm">Metadata analysis</label>
                                        </div>
                                    </div>
                                    <div class="space-y-2">
                                        <div class="flex items-center">
                                            <input type="checkbox" id="used-weather" class="mr-2">
                                            <label for="used-weather" class="text-sm">Weather verification</label>
                                        </div>
                                        <div class="flex items-center">
                                            <input type="checkbox" id="used-location" class="mr-2">
                                            <label for="used-location" class="text-sm">Location verification</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">4. Response Strategy</label>
                                <textarea class="w-full p-2 border border-gray-300 rounded text-sm" 
                                          rows="3" 
                                          placeholder="How would you respond to someone sharing this misinformation? Include specific sources and evidence you would provide."
                                          id="response-strategy"></textarea>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">5. Supporting Evidence Links</label>
                                <div class="space-y-2">
                                    <input type="url" 
                                           class="w-full p-2 border border-gray-300 rounded text-sm"
                                           placeholder="Link to original source (e.g., news article, stock photo site)"
                                           id="source-link">
                                    <input type="url" 
                                           class="w-full p-2 border border-gray-300 rounded text-sm"
                                           placeholder="Link to fact-check article or verification report"
                                           id="factcheck-link">
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <h4 class="font-semibold text-blue-800 mb-2">Professional Verification Checklist</h4>
                        <p class="text-blue-700 text-sm mb-3">Check off each verification step as you complete it:</p>
                        <div class="space-y-2 text-sm">
                            <div class="flex items-center">
                                <input type="checkbox" id="check-metadata" class="mr-2">
                                <label for="check-metadata" class="text-blue-700">Analyzed image metadata for date, location, and camera info</label>
                            </div>
                            <div class="flex items-center">
                                <input type="checkbox" id="check-reverse" class="mr-2">
                                <label for="check-reverse" class="text-blue-700">Performed reverse image search to find original source</label>
                            </div>
                            <div class="flex items-center">
                                <input type="checkbox" id="check-weather" class="mr-2">
                                <label for="check-weather" class="text-blue-700">Cross-referenced weather conditions with historical data</label>
                            </div>
                            <div class="flex items-center">
                                <input type="checkbox" id="check-location" class="mr-2">
                                <label for="check-location" class="text-blue-700">Verified location through landmark and geographical analysis</label>
                            </div>
                            <div class="flex items-center">
                                <input type="checkbox" id="check-context" class="mr-2">
                                <label for="check-context" class="text-blue-700">Confirmed whether image context matches the current claim</label>
                            </div>
                        </div>
                    </div>
                    
                    <button id="submitBtn" class="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded transition-colors duration-200 mt-4 cursor-pointer">
                        Submit Investigation Report
                    </button>
                </div>
            </section>
        `;
    }

    static generateFeedback(formData) {
        // Analyze the form data to provide personalized feedback
        const hasOriginalSource = formData.originalSource && formData.originalSource.toLowerCase().includes('reuters');
        const hasCorrectDate = formData.originalDate === '2018-05-15';
        const hasCorrectLocation = formData.originalLocation && formData.originalLocation.toLowerCase().includes('madrid');
        const hasMisuseEvidence = formData.misuseEvidence && formData.misuseEvidence.length > 50;
        const hasGoodStrategy = formData.responseStrategy && formData.responseStrategy.length > 100;
        const usedMultipleTools = (formData.usedReverseSearch || false) + (formData.usedMetadata || false) + 
                                 (formData.usedWeather || false) + (formData.usedLocation || false) >= 2;

        let score = 0;
        let feedback = [];

        if (hasOriginalSource) {
            score += 20;
            feedback.push("✅ Correctly identified Reuters as the original source");
        } else {
            feedback.push("❌ Original source not identified - check reverse image search results");
        }

        if (hasCorrectDate) {
            score += 20;
            feedback.push("✅ Correctly identified the original date (May 15, 2018)");
        } else {
            feedback.push("❌ Original date not identified - check image metadata results");
        }

        if (hasCorrectLocation) {
            score += 20;
            feedback.push("✅ Correctly identified Madrid, Spain as the original location");
        } else {
            feedback.push("❌ Original location not identified - check location verification results");
        }

        if (hasMisuseEvidence) {
            score += 15;
            feedback.push("✅ Provided detailed evidence of image misuse");
        } else {
            feedback.push("⚠️ Need more detailed explanation of how the image is being misused");
        }

        if (hasGoodStrategy) {
            score += 15;
            feedback.push("✅ Developed a comprehensive response strategy");
        } else {
            feedback.push("⚠️ Response strategy needs more detail about sources and evidence");
        }

        if (usedMultipleTools) {
            score += 10;
            feedback.push("✅ Used multiple verification tools for thorough analysis");
        } else {
            feedback.push("⚠️ Try using more verification tools for complete analysis");
        }

        let level = 'Needs Improvement';
        let bgColor = 'bg-orange-100';
        let textColor = 'text-orange-800';

        if (score >= 80) {
            level = 'Expert Level';
            bgColor = 'bg-green-100';
            textColor = 'text-green-800';
        } else if (score >= 60) {
            level = 'Proficient';
            bgColor = 'bg-blue-100';
            textColor = 'text-blue-800';
        } else if (score >= 40) {
            level = 'Developing';
            bgColor = 'bg-yellow-100';
            textColor = 'text-yellow-800';
        }

        return {
            score,
            level,
            bgColor,
            textColor,
            feedback: feedback.join('\n'),
            message: `Investigation complete! Your verification skills are at ${level} (${score}/100 points).`
        };
    }
}
