export class AssessmentForm {
    static render() {
        return `
            <!-- Professional Assessment Form -->
            <div class="bg-gray-50 p-6 rounded-lg">
                <h3 class="text-xl font-semibold mb-4 text-black">Professional Social Media Assessment</h3>
                
                <div class="space-y-6">
                    <div class="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 class="font-semibold mb-3 text-black">Investigation Report</h4>
                        
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-black mb-2">1. Account Credibility Assessment</label>
                                <div class="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <input type="text" 
                                               class="w-full p-2 border border-gray-300 rounded text-sm text-black"
                                               placeholder="Account creation date"
                                               id="account-age">
                                    </div>
                                    <div>
                                        <input type="text" 
                                               class="w-full p-2 border border-gray-300 rounded text-sm text-black"
                                               placeholder="Follower count pattern"
                                               id="follower-pattern">
                                    </div>
                                </div>
                                <div class="mt-2">
                                    <textarea class="w-full p-2 border border-gray-300 rounded text-sm text-black" 
                                              rows="2" 
                                              placeholder="Describe suspicious account behaviors (e.g., new account, fake profile, bot activity)"
                                              id="account-assessment"></textarea>
                                </div>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-black mb-2">2. Claim Verification Results</label>
                                <textarea class="w-full p-2 border border-gray-300 rounded text-sm text-black" 
                                          rows="3" 
                                          placeholder="Document your fact-checking findings - what did credible medical sources say about these claims?"
                                          id="claim-verification"></textarea>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-black mb-2">3. Emotional Manipulation Indicators</label>
                                <div class="grid md:grid-cols-2 gap-4">
                                    <div class="space-y-2">
                                        <div class="flex items-center">
                                            <input type="checkbox" id="caps-usage" class="mr-2">
                                            <label for="caps-usage" class="text-sm text-black">Excessive use of ALL CAPS</label>
                                        </div>
                                        <div class="flex items-center">
                                            <input type="checkbox" id="urgent-language" class="mr-2">
                                            <label for="urgent-language" class="text-sm text-black">Urgent/alarmist language</label>
                                        </div>
                                        <div class="flex items-center">
                                            <input type="checkbox" id="conspiracy-hashtags" class="mr-2">
                                            <label for="conspiracy-hashtags" class="text-sm text-black">Conspiracy-related hashtags</label>
                                        </div>
                                    </div>
                                    <div class="space-y-2">
                                        <div class="flex items-center">
                                            <input type="checkbox" id="fear-mongering" class="mr-2">
                                            <label for="fear-mongering" class="text-sm text-black">Fear-mongering content</label>
                                        </div>
                                        <div class="flex items-center">
                                            <input type="checkbox" id="us-vs-them" class="mr-2">
                                            <label for="us-vs-them" class="text-sm text-black">"Us vs. them" framing</label>
                                        </div>
                                        <div class="flex items-center">
                                            <input type="checkbox" id="vague-sources" class="mr-2">
                                            <label for="vague-sources" class="text-sm text-black">Vague source references</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-black mb-2">4. Response Strategy</label>
                                <textarea class="w-full p-2 border border-gray-300 rounded text-sm text-black" 
                                          rows="3" 
                                          placeholder="How would you professionally respond to this misinformation? Include specific sources and evidence."
                                          id="response-strategy"></textarea>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-black mb-2">5. Harm Assessment</label>
                                <textarea class="w-full p-2 border border-gray-300 rounded text-sm text-black" 
                                          rows="2" 
                                          placeholder="What potential harm could this misinformation cause to public health or society?"
                                          id="harm-assessment"></textarea>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <h4 class="font-semibold text-blue-800 mb-2">Social Media Investigation Checklist</h4>
                        <div class="space-y-2 text-sm">
                            <div class="flex items-center">
                                <input type="checkbox" id="check-profile" class="mr-2">
                                <label for="check-profile" class="text-blue-700">Analyzed account profile and posting history</label>
                            </div>
                            <div class="flex items-center">
                                <input type="checkbox" id="check-claims" class="mr-2">
                                <label for="check-claims" class="text-blue-700">Fact-checked claims with credible medical sources</label>
                            </div>
                            <div class="flex items-center">
                                <input type="checkbox" id="check-engagement" class="mr-2">
                                <label for="check-engagement" class="text-blue-700">Examined engagement patterns for bot activity</label>
                            </div>
                            <div class="flex items-center">
                                <input type="checkbox" id="check-language" class="mr-2">
                                <label for="check-language" class="text-blue-700">Identified emotional manipulation techniques</label>
                            </div>
                            <div class="flex items-center">
                                <input type="checkbox" id="check-harm" class="mr-2">
                                <label for="check-harm" class="text-blue-700">Assessed potential societal harm</label>
                            </div>
                        </div>
                    </div>
                    
                    <button id="submit-assessment" class="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded transition-colors duration-200 mt-4 cursor-pointer">
                        Submit Professional Assessment
                    </button>
                </div>
            </div>
        `;
    }

    static generateFeedback(formData) {
        let score = 0;
        let feedback = [];

        // Check account assessment
        if (formData.accountAssessment.toLowerCase().includes('new') || formData.accountAssessment.toLowerCase().includes('recent')) {
            score += 20;
            feedback.push("✅ Correctly identified suspicious account age/patterns");
        } else {
            feedback.push("❌ Account age analysis needs improvement - check account creation date");
        }

        // Check claim verification
        if (formData.claimVerification.toLowerCase().includes('false') || formData.claimVerification.toLowerCase().includes('no evidence')) {
            score += 25;
            feedback.push("✅ Properly fact-checked the medical claims");
        } else {
            feedback.push("❌ Claim verification incomplete - check official health sources");
        }

        // Check manipulation indicators
        const manipulationScore = Object.values(formData.manipulationChecks).filter(Boolean).length;
        if (manipulationScore >= 4) {
            score += 20;
            feedback.push("✅ Identified multiple emotional manipulation techniques");
        } else if (manipulationScore >= 2) {
            score += 10;
            feedback.push("⚠️ Some manipulation techniques identified, but look for more");
        } else {
            feedback.push("❌ Need to identify more emotional manipulation indicators");
        }

        // Check response strategy
        if (formData.responseStrategy.length > 100 && formData.responseStrategy.toLowerCase().includes('source')) {
            score += 20;
            feedback.push("✅ Developed comprehensive response with sources");
        } else {
            feedback.push("⚠️ Response strategy needs more detail and credible sources");
        }

        // Check harm assessment
        if (formData.harmAssessment.length > 50) {
            score += 15;
            feedback.push("✅ Recognized potential societal harm");
        } else {
            feedback.push("⚠️ Harm assessment could be more detailed");
        }

        let level = 'Needs Development';
        let bgColor = 'bg-orange-100';
        let textColor = 'text-orange-800';

        if (score >= 85) {
            level = 'Expert Analyst';
            bgColor = 'bg-green-100';
            textColor = 'text-green-800';
        } else if (score >= 70) {
            level = 'Proficient Investigator';
            bgColor = 'bg-blue-100';
            textColor = 'text-blue-800';
        } else if (score >= 50) {
            level = 'Developing Skills';
            bgColor = 'bg-yellow-100';
            textColor = 'text-yellow-800';
        }

        return {
            score,
            level,
            bgColor,
            textColor,
            feedback: feedback.join('\n'),
            message: `Social media investigation complete! Your analysis skills are at ${level} level.`
        };
    }
}
