import { gameState, updateProgress, getVerificationStepsCompleted } from './gameState.js';
import { updateMentorMessage, updateCredibilityMeter } from './uiUpdates.js';

export function handleVerificationTool(toolType) {
    const story = gameState.currentStory;
    let results = '';
    let mentorMessage = '';

    switch(toolType) {
        case 'headline':
            gameState.verificationSteps.headlines++;
            if (story.isFake) {
                const headlineFlags = story.redFlags.filter(flag => 
                    flag.includes('emotional') || flag.includes('CAPS') || flag.includes('clickbait') || flag.includes('sensational')
                );
                results = `
                    <div class="bg-red-100 border-2 border-red-400 rounded p-3">
                        <h6 class="text-red-800 font-bold font-serif mb-2">⚠️ Headline Analysis: SUSPICIOUS</h6>
                        <ul class="text-red-700 text-sm space-y-1 font-serif">
                            ${headlineFlags.map(flag => `<li>• ${flag}</li>`).join('')}
                            <li>• Designed for viral sharing, not information</li>
                        </ul>
                        <p class="text-red-600 text-xs mt-2 font-bold">Risk Score: ${story.viralRisk}% viral potential</p>
                    </div>
                `;
                mentorMessage = `Excellent analysis! Those emotional triggers score ${story.viralRisk}% on our viral risk meter. Now check the source credibility.`;
            } else {
                results = `
                    <div class="bg-green-100 border-2 border-green-400 rounded p-3">
                        <h6 class="text-green-800 font-bold font-serif mb-2">✅ Headline Analysis: LEGITIMATE</h6>
                        <ul class="text-green-700 text-sm space-y-1 font-serif">
                            <li>• Clear, factual language without emotional manipulation</li>
                            <li>• Professional news format and structure</li>
                            <li>• Specific and verifiable claims</li>
                            <li>• Appropriate tone for government announcement</li>
                        </ul>
                        <p class="text-green-600 text-xs mt-2 font-bold">Risk Score: ${story.viralRisk}% viral potential (Low)</p>
                    </div>
                `;
                mentorMessage = "Good work! This headline shows professional journalism standards with low viral manipulation.";
            }
            break;

        case 'source':
            gameState.verificationSteps.sources++;
            const sourceData = story.sourceAnalysis;
            if (story.credibilityScore < 50) {
                results = `
                    <div class="bg-red-100 border-2 border-red-400 rounded p-3">
                        <h6 class="text-red-800 font-bold font-serif mb-2">⚠️ Source Check: UNRELIABLE</h6>
                        <div class="text-red-700 text-sm space-y-1 font-serif">
                            <p><strong>Domain Analysis:</strong></p>
                            <ul class="ml-2 space-y-1">
                                <li>• Age: ${sourceData.domainAge} (New domain - red flag)</li>
                                <li>• Registration: ${sourceData.whoisData}</li>
                                <li>• SSL: ${sourceData.sslCertificate}</li>
                            </ul>
                            <p><strong>Author Credentials:</strong></p>
                            <ul class="ml-2">
                                <li>• ${sourceData.authorCredentials}</li>
                            </ul>
                            <p class="text-red-600 font-bold">Credibility Score: ${story.credibilityScore}/100</p>
                        </div>
                    </div>
                `;
                mentorMessage = "Red flag confirmed! This source has no legitimate credentials and the domain is suspiciously new.";
            } else {
                results = `
                    <div class="bg-green-100 border-2 border-green-400 rounded p-3">
                        <h6 class="text-green-800 font-bold font-serif mb-2">✅ Source Check: VERIFIED</h6>
                        <div class="text-green-700 text-sm space-y-1 font-serif">
                            <p><strong>Domain Analysis:</strong></p>
                            <ul class="ml-2 space-y-1">
                                <li>• Age: ${sourceData.domainAge} (Established domain)</li>
                                <li>• Registration: ${sourceData.whoisData}</li>
                                <li>• SSL: ${sourceData.sslCertificate}</li>
                            </ul>
                            <p><strong>Author Credentials:</strong></p>
                            <ul class="ml-2">
                                <li>• ${sourceData.authorCredentials}</li>
                            </ul>
                            <p class="text-green-600 font-bold">Credibility Score: ${story.credibilityScore}/100</p>
                        </div>
                    </div>
                `;
                mentorMessage = "Excellent! This is a verified official source with proper credentials and domain verification.";
            }
            updateCredibilityMeter(story.credibilityScore);
            break;

        case 'image':
            gameState.verificationSteps.images++;
            const imageData = story.images;
            if (!imageData.imageVerification.authentic) {
                results = `
                    <div class="bg-red-100 border-2 border-red-400 rounded p-3">
                        <h6 class="text-red-800 font-bold font-serif mb-2">⚠️ Image Verification: SUSPICIOUS</h6>
                        <div class="text-red-700 text-sm space-y-1 font-serif">
                            <p><strong>Image Description:</strong> ${imageData.imageDescription}</p>
                            <p><strong>Reverse Search:</strong> ${imageData.imageVerification.reverseSearchResults}</p>
                            <p><strong>Metadata:</strong> ${imageData.imageVerification.metadata}</p>
                            <p><strong>Red Flags:</strong></p>
                            <ul class="ml-2">
                                ${imageData.imageVerification.redFlags.map(flag => `<li>• ${flag}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                `;
                mentorMessage = "Great detective work! The image analysis reveals this is recycled content with no connection to the actual story.";
            } else {
                results = `
                    <div class="bg-green-100 border-2 border-green-400 rounded p-3">
                        <h6 class="text-green-800 font-bold font-serif mb-2">✅ Image Verification: AUTHENTIC</h6>
                        <div class="text-green-700 text-sm space-y-1 font-serif">
                            <p><strong>Image Description:</strong> ${imageData.imageDescription}</p>
                            <p><strong>Reverse Search:</strong> ${imageData.imageVerification.reverseSearchResults}</p>
                            <p><strong>Metadata:</strong> ${imageData.imageVerification.metadata}</p>
                            <p><strong>Verification Status:</strong> Original, authentic image with proper attribution</p>
                        </div>
                    </div>
                `;
                mentorMessage = "Good verification! The image is authentic and supports the story's credibility.";
            }
            break;

        case 'metadata':
            const metaData = story.metadataAnalysis;
            const isVerified = story.credibilityScore > 70;
            results = `
                <div class="bg-blue-100 border-2 border-blue-400 rounded p-3">
                    <h6 class="text-blue-800 font-bold font-serif mb-2">📊 Metadata Analysis</h6>
                    <div class="text-blue-700 text-sm space-y-1 font-serif">
                        <p><strong>Publication Details:</strong></p>
                        <ul class="ml-2 space-y-1">
                            <li>• Time: ${metaData.publishTime}</li>
                            <li>• Location: ${metaData.ipGeolocation}</li>
                            <li>• Server: ${metaData.serverResponse}</li>
                        </ul>
                        <p><strong>Content Analysis:</strong></p>
                        <ul class="ml-2 space-y-1">
                            <li>• Uniqueness: ${metaData.contentHash}</li>
                            <li>• Traffic: ${metaData.trafficSpike}</li>
                        </ul>
                        <p class="font-bold ${isVerified ? 'text-green-600' : 'text-red-600'}">
                            Assessment: ${isVerified ? 'Legitimate metadata pattern' : 'Suspicious publishing patterns detected'}
                        </p>
                    </div>
                </div>
            `;
            mentorMessage = `Metadata analysis reveals ${isVerified ? 'normal' : 'suspicious'} publishing patterns. Look at timing and traffic patterns.`;
            break;
    }

    // Add results to verification panel
    const resultsContent = document.getElementById('results-content');
    resultsContent.innerHTML += results;
    document.getElementById('verification-results').classList.remove('hidden');
    
    updateMentorMessage(mentorMessage);
    updateProgress();
    
    // Check if enough verification steps completed
    if (getVerificationStepsCompleted() >= 2) {
        enableFinalDecision();
    }
}

export function enableFinalDecision() {
    document.getElementById('editorial-decision').classList.remove('hidden');
    document.getElementById('mark-fake').disabled = false;
    document.getElementById('mark-real').disabled = false;
    document.getElementById('mark-fake').classList.remove('opacity-50');
    document.getElementById('mark-real').classList.remove('opacity-50');
    updateMentorMessage("You've gathered enough evidence. Now make your decision: Is this story fake or real?");
}
