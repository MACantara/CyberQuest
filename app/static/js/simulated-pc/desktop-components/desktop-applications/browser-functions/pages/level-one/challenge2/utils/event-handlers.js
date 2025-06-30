import { SourceComparison } from '../components/source-comparison.js';
import { AnalysisTools } from '../components/analysis-tools.js';
import { InvestigationForm } from '../components/investigation-form.js';

export class EventHandlers {
    constructor(pageInstance) {
        this.pageInstance = pageInstance;
    }

    bindAllEvents(contentElement) {
        // Make instance globally accessible for onclick handlers
        window.challenge2Instance = this;

        this.bindVerificationToolEvents(contentElement);
        this.bindAnalysisEvents(contentElement);
    }

    bindVerificationToolEvents(contentElement) {
        // Handle cross-reference tool button
        const crossRefBtn = contentElement.querySelector('#try-cross-reference');
        if (crossRefBtn) {
            crossRefBtn.addEventListener('click', () => {
                const url = crossRefBtn.getAttribute('data-url');
                window.dispatchEvent(new CustomEvent('navigate-browser', { detail: { url } }));
                this.showAnalysisResults(contentElement);
            });
        }

        // Handle bias analysis button
        const biasBtn = contentElement.querySelector('#run-bias-analysis');
        if (biasBtn) {
            biasBtn.addEventListener('click', () => {
                this.runBiasAnalysis(contentElement);
            });
        }
    }

    bindAnalysisEvents(contentElement) {
        // Handle submit analysis button
        const submitBtn = contentElement.querySelector('#submit-analysis');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                this.submitFinalAnalysis(contentElement);
            });
        }
    }

    analyzeSource(sourceId) {
        const modal = document.getElementById('source-analysis-modal');
        const title = document.getElementById('modal-title');
        const content = document.getElementById('modal-content');
        
        const sourceData = SourceComparison.getSourceData();
        const source = sourceData[sourceId];
        
        if (source) {
            title.textContent = `Analysis: ${source.name}`;
            content.innerHTML = source.analysis;
            modal.classList.remove('hidden');
        }
    }

    closeModal() {
        const modal = document.getElementById('source-analysis-modal');
        modal.classList.add('hidden');
    }

    showAnalysisResults(contentElement) {
        setTimeout(() => {
            const resultsSection = contentElement.querySelector('#analysis-results');
            const analysisContent = contentElement.querySelector('#analysis-content');
            
            if (resultsSection && analysisContent) {
                analysisContent.innerHTML = AnalysisTools.generateCrossReferenceResults();
                resultsSection.classList.remove('hidden');
                resultsSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 1500);
    }

    runBiasAnalysis(contentElement) {
        const biasBtn = contentElement.querySelector('#run-bias-analysis');
        const originalText = biasBtn.textContent;
        
        biasBtn.textContent = 'Analyzing...';
        biasBtn.disabled = true;
        
        setTimeout(() => {
            const resultsSection = contentElement.querySelector('#analysis-results');
            const analysisContent = contentElement.querySelector('#analysis-content');
            
            if (resultsSection && analysisContent) {
                analysisContent.innerHTML = AnalysisTools.generateBiasAnalysisResults();
                resultsSection.classList.remove('hidden');
                resultsSection.scrollIntoView({ behavior: 'smooth' });
            }
            
            biasBtn.textContent = originalText;
            biasBtn.disabled = false;
        }, 2000);
    }

    submitFinalAnalysis(contentElement) {
        const reliableChoice = contentElement.querySelector('input[name="reliable"]:checked');
        
        if (!reliableChoice) {
            alert('Please select which source you found most reliable based on your analysis.');
            return;
        }

        const feedback = InvestigationForm.generateFeedback(reliableChoice.value);

        // Show results modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/75 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-lg mx-4">
                <div class="text-center">
                    <div class="${feedback.bgColor} p-4 rounded-lg mb-4">
                        <p class="${feedback.textColor} font-medium">${feedback.message}</p>
                    </div>
                    <div class="text-sm text-gray-600 mb-4">
                        <p><strong>Key Learning Points:</strong></p>
                        <ul class="text-left mt-2 space-y-1">
                            <li>• Compare specific facts and numbers across sources</li>
                            <li>• Watch for emotional vs. neutral language</li>
                            <li>• Look for official source attribution and verification</li>
                            <li>• Consider the publication's track record and reputation</li>
                            <li>• Be wary of sensationalized headlines and inflammatory rhetoric</li>
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
