import { VerificationTools } from '../components/verification-tools.js';
import { AnalysisForm } from '../components/analysis-form.js';

export class EventHandlers {
    constructor(pageInstance) {
        this.pageInstance = pageInstance;
    }

    bindAllEvents(contentElement) {
        this.bindVerificationToolEvents(contentElement);
        this.bindAnalysisEvents(contentElement);
    }

    bindVerificationToolEvents(contentElement) {
        // Handle reverse image search tool
        const reverseSearchBtn = contentElement.querySelector('#try-reverse-search');
        if (reverseSearchBtn) {
            reverseSearchBtn.addEventListener('click', () => {
                const url = reverseSearchBtn.getAttribute('data-url');
                window.dispatchEvent(new CustomEvent('navigate-browser', { detail: { url } }));
                this.showVerificationResults(contentElement, 'reverse-search');
            });
        }

        // Handle metadata analysis tool
        const metadataBtn = contentElement.querySelector('#try-metadata-analysis');
        if (metadataBtn) {
            metadataBtn.addEventListener('click', () => {
                const url = metadataBtn.getAttribute('data-url');
                window.dispatchEvent(new CustomEvent('navigate-browser', { detail: { url } }));
                this.showVerificationResults(contentElement, 'metadata');
            });
        }

        // Handle weather verification tool
        const weatherBtn = contentElement.querySelector('#try-weather-check');
        if (weatherBtn) {
            weatherBtn.addEventListener('click', () => {
                const url = weatherBtn.getAttribute('data-url');
                window.dispatchEvent(new CustomEvent('navigate-browser', { detail: { url } }));
                this.showVerificationResults(contentElement, 'weather');
            });
        }

        // Handle location verification tool
        const locationBtn = contentElement.querySelector('#try-location-check');
        if (locationBtn) {
            locationBtn.addEventListener('click', () => {
                const url = locationBtn.getAttribute('data-url');
                window.dispatchEvent(new CustomEvent('navigate-browser', { detail: { url } }));
                this.showVerificationResults(contentElement, 'location');
            });
        }
    }

    bindAnalysisEvents(contentElement) {
        // Handle submit analysis button
        const submitBtn = contentElement.querySelector('#submitBtn');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                this.submitAnalysis(contentElement);
            });
        }
    }

    showVerificationResults(contentElement, toolType) {
        setTimeout(() => {
            const resultsSection = contentElement.querySelector('#verification-results');
            const resultsContent = contentElement.querySelector('#results-content');
            
            if (resultsContent) {
                const toolResults = VerificationTools.getToolResults(toolType);
                
                // Add or update tool results
                let existingResult = resultsContent.querySelector(`#result-${toolType}`);
                if (existingResult) {
                    existingResult.innerHTML = toolResults;
                } else {
                    const resultDiv = document.createElement('div');
                    resultDiv.id = `result-${toolType}`;
                    resultDiv.className = 'bg-white p-4 border border-gray-200 rounded-lg';
                    resultDiv.innerHTML = toolResults;
                    resultsContent.appendChild(resultDiv);
                }
            }
            
            if (resultsSection) {
                resultsSection.classList.remove('hidden');
                resultsSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 1500);
    }

    submitAnalysis(contentElement) {
        const responseChoice = contentElement.querySelector('input[name="response"]:checked');
        
        if (!responseChoice) {
            alert('Please select how you would respond to this misinformation.');
            return;
        }

        const feedback = AnalysisForm.generateFeedback(responseChoice.id);

        // Show results modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-lg mx-4">
                <div class="text-center">
                    <div class="${feedback.bgColor} p-4 rounded-lg mb-4">
                        <p class="${feedback.textColor} font-medium">${feedback.message}</p>
                    </div>
                    <div class="text-sm text-gray-600 mb-4">
                        <p><strong>Key Learning Points:</strong></p>
                        <ul class="text-left mt-2 space-y-1">
                            <li>• Use reverse image search to find original sources</li>
                            <li>• Check metadata for creation dates and location data</li>
                            <li>• Verify weather conditions match historical records</li>
                            <li>• Confirm location details through landmark analysis</li>
                            <li>• Always provide sources when correcting misinformation</li>
                        </ul>
                    </div>
                    <button onclick="this.closest('.fixed').remove()" 
                            class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">
                        Continue Training
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
}
