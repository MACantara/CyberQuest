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
        // Collect form data from the practical investigation form
        const formData = {
            originalSource: contentElement.querySelector('#original-source')?.value || '',
            originalDate: contentElement.querySelector('#original-date')?.value || '',
            originalLocation: contentElement.querySelector('#original-location')?.value || '',
            misuseEvidence: contentElement.querySelector('#misuse-evidence')?.value || '',
            responseStrategy: contentElement.querySelector('#response-strategy')?.value || '',
            sourceLink: contentElement.querySelector('#source-link')?.value || '',
            factcheckLink: contentElement.querySelector('#factcheck-link')?.value || '',
            usedReverseSearch: contentElement.querySelector('#used-reverse-search')?.checked || false,
            usedMetadata: contentElement.querySelector('#used-metadata')?.checked || false,
            usedWeather: contentElement.querySelector('#used-weather')?.checked || false,
            usedLocation: contentElement.querySelector('#used-location')?.checked || false
        };

        // Validate required fields
        if (!formData.originalSource || !formData.misuseEvidence || !formData.responseStrategy) {
            alert('Please complete all required fields: Original Source, Evidence of Misuse, and Response Strategy.');
            return;
        }

        const feedback = AnalysisForm.generateFeedback(formData);

        // Show detailed results modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
                <div class="text-center mb-4">
                    <div class="${feedback.bgColor} p-4 rounded-lg mb-4">
                        <h3 class="${feedback.textColor} text-xl font-bold mb-2">${feedback.level}</h3>
                        <p class="${feedback.textColor} font-medium">${feedback.message}</p>
                        <div class="mt-2">
                            <div class="w-full bg-gray-200 rounded-full h-3">
                                <div class="bg-green-500 h-3 rounded-full transition-all duration-500" style="width: ${feedback.score}%"></div>
                            </div>
                            <p class="text-sm mt-1 ${feedback.textColor}">Score: ${feedback.score}/100</p>
                        </div>
                    </div>
                    
                    <div class="text-left">
                        <h4 class="font-semibold text-gray-800 mb-3">Detailed Feedback:</h4>
                        <div class="bg-gray-50 p-4 rounded text-sm space-y-1">
                            ${feedback.feedback.split('\n').map(line => `<p>${line}</p>`).join('')}
                        </div>
                    </div>
                    
                    <div class="text-left mt-4">
                        <h4 class="font-semibold text-gray-800 mb-2">Key Learning Points:</h4>
                        <ul class="text-sm text-gray-700 space-y-1 list-disc pl-5">
                            <li>Always use multiple verification tools for comprehensive analysis</li>
                            <li>Document original sources with specific dates and locations</li>
                            <li>Provide clear evidence when correcting misinformation</li>
                            <li>Develop professional response strategies that educate others</li>
                            <li>Include credible source links to support your corrections</li>
                        </ul>
                    </div>
                    
                    <div class="mt-6 flex space-x-3 justify-center">
                        <button onclick="this.closest('.fixed').remove()" 
                                class="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors">
                            Close
                        </button>
                        <button onclick="window.print(); this.closest('.fixed').remove();" 
                                class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">
                            Print Report
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
}
