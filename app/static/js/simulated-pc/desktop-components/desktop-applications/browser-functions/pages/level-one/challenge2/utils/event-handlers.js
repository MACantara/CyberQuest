import { SourceComparison } from '../components/source-comparison.js';
import { AnalysisTools } from '../components/analysis-tools.js';
import { InvestigationForm } from '../components/investigation-form.js';

export class EventHandlers {
    constructor(pageInstance) {
        this.pageInstance = pageInstance;
    }

    bindAllEvents(contentElement) {
        this.bindAnalysisTools(contentElement);
        this.bindSubmitButton(contentElement);
    }

    bindAnalysisTools(contentElement) {
        // Handle cross-reference tool
        const crossRefBtn = contentElement.querySelector('#try-cross-reference');
        if (crossRefBtn) {
            crossRefBtn.addEventListener('click', () => {
                const url = crossRefBtn.getAttribute('data-url');
                if (url) {
                    window.dispatchEvent(new CustomEvent('navigate-browser', { detail: { url } }));
                }
            });
        }

        // Handle bias analysis
        const biasBtn = contentElement.querySelector('#run-bias-analysis');
        if (biasBtn) {
            biasBtn.addEventListener('click', () => {
                this.showAnalysisResults(contentElement);
            });
        }

        // Handle source analysis buttons
        contentElement.querySelectorAll('.analyze-source').forEach(btn => {
            btn.addEventListener('click', () => {
                this.analyzeSource(btn.dataset.source, contentElement);
            });
        });
    }

    bindSubmitButton(contentElement) {
        const submitBtn = contentElement.querySelector('#submit-comparison');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                this.handleSubmitComparison(contentElement);
            });
        }
    }

    showAnalysisResults(contentElement) {
        const resultsSection = contentElement.querySelector('#analysis-results');
        if (resultsSection) {
            resultsSection.classList.remove('hidden');
            
            // Add analysis content
            const analysisContent = contentElement.querySelector('#analysis-content');
            if (analysisContent) {
                analysisContent.innerHTML = `
                    <div class="bg-white p-4 border border-gray-200 rounded-lg">
                        <h4 class="font-semibold mb-3">Cross-Reference Results</h4>
                        <div class="space-y-3">
                            <div class="flex justify-between items-center p-2 bg-green-50 rounded">
                                <span class="text-sm">Metro Daily News</span>
                                <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Consistent with other credible sources</span>
                            </div>
                            <div class="flex justify-between items-center p-2 bg-red-50 rounded">
                                <span class="text-sm">The Daily Clarion</span>
                                <span class="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Significant discrepancies found</span>
                            </div>
                            <div class="flex justify-between items-center p-2 bg-green-50 rounded">
                                <span class="text-sm">City Press Online</span>
                                <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Well-sourced and verified</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white p-4 border border-gray-200 rounded-lg">
                        <h4 class="font-semibold mb-3">Bias Analysis Results</h4>
                        <div class="space-y-4">
                            <div class="border-l-4 border-blue-500 pl-4">
                                <h5 class="font-medium text-blue-800">Metro Daily News</h5>
                                <p class="text-sm text-gray-700">Bias Score: Low (2/10)</p>
                                <p class="text-xs text-gray-600">Neutral language, specific facts, balanced reporting</p>
                            </div>
                            <div class="border-l-4 border-red-500 pl-4">
                                <h5 class="font-medium text-red-800">The Daily Clarion</h5>
                                <p class="text-sm text-gray-700">Bias Score: High (8/10)</p>
                                <p class="text-xs text-gray-600">Emotional language, sensationalized numbers, inflammatory tone</p>
                            </div>
                            <div class="border-l-4 border-green-500 pl-4">
                                <h5 class="font-medium text-green-800">City Press Online</h5>
                                <p class="text-sm text-gray-700">Bias Score: Low (3/10)</p>
                                <p class="text-xs text-gray-600">Balanced perspective, official sources, measured language</p>
                            </div>
                        </div>
                    </div>
                `;
            }
            
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    analyzeSource(source, contentElement) {
        // Show analysis results for the clicked source
        const resultsSection = contentElement.querySelector('#analysis-results');
        if (resultsSection) {
            resultsSection.classList.remove('hidden');
            resultsSection.innerHTML = `
                <div class="bg-blue-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-blue-800 mb-2">Analysis: ${source}</h4>
                    <p class="text-blue-700">Source analysis completed. Review the bias indicators and credibility factors.</p>
                </div>
            `;
        }
    }

    handleSubmitComparison(contentElement) {
        // Mark challenge 2 as completed
        localStorage.setItem('cyberquest_challenge2_completed', 'true');
        
        // Show completion message
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md mx-4">
                <div class="text-center">
                    <i class="bi bi-check-circle text-6xl text-green-500 mb-4"></i>
                    <h2 class="text-xl font-bold text-green-600 mb-4">✅ Challenge 2 Complete!</h2>
                    <p class="text-gray-700 mb-4">
                        Excellent source comparison! You've learned to identify bias and cross-reference multiple perspectives. 
                        Next up: image verification techniques.
                    </p>
                    <button onclick="this.closest('.fixed').remove(); window.challenge2EventHandlers?.navigateToChallenge3?.()" 
                            class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors">
                        Continue to Challenge 3
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Store reference for cleanup
        window.challenge2EventHandlers = this;
    }

    navigateToChallenge3() {
        // First navigate to challenge 3 page
        if (window.desktop?.windowManager) {
            try {
                const browserApp = window.desktop.windowManager.applications.get('browser');
                if (browserApp) {
                    // Navigate to challenge 3 page
                    browserApp.navigation.navigateToUrl('https://cyberquest.academy/level/1/challenge3');
                    
                    // Wait for page to load, then trigger challenge 3 dialogue
                    setTimeout(() => {
                        this.triggerChallenge3Dialogue();
                    }, 1500);
                }
            } catch (error) {
                console.error('Failed to navigate to challenge 3:', error);
            }
        }
    }

    triggerChallenge3Dialogue() {
        import('../../../../../../../dialogues/levels/level1-misinformation-maze.js').then(module => {
            const Level1Dialogue = module.Level1MisinformationMazeDialogue;
            if (Level1Dialogue.startChallenge3Dialogue && window.desktop) {
                Level1Dialogue.startChallenge3Dialogue(window.desktop);
            }
        }).catch(error => {
            console.error('Failed to load challenge 3 dialogue:', error);
        });
    }
}
