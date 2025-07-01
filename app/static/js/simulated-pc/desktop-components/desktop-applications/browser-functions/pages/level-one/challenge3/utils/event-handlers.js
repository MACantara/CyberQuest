import { VerificationTools } from '../components/verification-tools.js';
import { AnalysisForm } from '../components/analysis-form.js';

export class EventHandlers {
    constructor(pageInstance) {
        this.pageInstance = pageInstance;
    }

    bindAllEvents(contentElement) {
        this.bindVerificationTools(contentElement);
        this.bindSubmitButton(contentElement);
    }

    bindVerificationTools(contentElement) {
        // Handle verification tool buttons
        const toolButtons = [
            '#try-reverse-search',
            '#try-metadata-analysis', 
            '#try-weather-check',
            '#try-location-check'
        ];

        toolButtons.forEach(selector => {
            const btn = contentElement.querySelector(selector);
            if (btn) {
                btn.addEventListener('click', () => {
                    const url = btn.getAttribute('data-url');
                    if (url) {
                        window.dispatchEvent(new CustomEvent('navigate-browser', { detail: { url } }));
                    }
                    this.pageInstance.showVerificationResults(contentElement, this.getToolType(selector));
                });
            }
        });
    }

    bindSubmitButton(contentElement) {
        const submitBtn = contentElement.querySelector('#submitBtn');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                this.handleSubmitAnalysis(contentElement);
            });
        }
    }

    getToolType(selector) {
        const mapping = {
            '#try-reverse-search': 'reverse-search',
            '#try-metadata-analysis': 'metadata',
            '#try-weather-check': 'weather',
            '#try-location-check': 'location'
        };
        return mapping[selector] || 'unknown';
    }

    handleSubmitAnalysis(contentElement) {
        // Collect form data with correct field IDs
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
            usedLocation: contentElement.querySelector('#used-location')?.checked || false,
            checkMetadata: contentElement.querySelector('#check-metadata')?.checked || false,
            checkReverse: contentElement.querySelector('#check-reverse')?.checked || false,
            checkWeather: contentElement.querySelector('#check-weather')?.checked || false,
            checkLocation: contentElement.querySelector('#check-location')?.checked || false,
            checkContext: contentElement.querySelector('#check-context')?.checked || false
        };

        // Validate required fields
        if (!formData.originalSource || !formData.misuseEvidence || !formData.responseStrategy) {
            alert('Please complete the required fields: Original Source, Evidence of Misuse, and Response Strategy.');
            return;
        }

        // Mark challenge 3 as completed
        localStorage.setItem('cyberquest_challenge3_completed', 'true');
        
        // Generate feedback based on responses
        const feedback = AnalysisForm.generateFeedback(formData);

        // Show completion message with feedback
        this.showCompletionModal(feedback);
    }

    showCompletionModal(feedback) {
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
                            <p class="text-sm mt-1 ${feedback.textColor}">Investigation Score: ${feedback.score}/100</p>
                        </div>
                    </div>
                    
                    <div class="text-left">
                        <h4 class="font-semibold text-gray-800 mb-3">Investigation Feedback:</h4>
                        <div class="bg-gray-50 p-4 rounded text-sm space-y-1">
                            ${feedback.feedback.split('\n').map(line => `<p>${line}</p>`).join('')}
                        </div>
                    </div>
                    
                    <div class="text-left mt-4">
                        <h4 class="font-semibold text-gray-800 mb-2">Key Learning Points:</h4>
                        <ul class="text-sm text-gray-700 space-y-1 list-disc pl-5">
                            <li>Use reverse image search to find original sources</li>
                            <li>Check metadata for creation dates and location data</li>
                            <li>Verify weather conditions match historical records</li>
                            <li>Confirm location details through landmark analysis</li>
                            <li>Always provide sources when correcting misinformation</li>
                        </ul>
                    </div>
                    
                    <div class="mt-6 flex space-x-3 justify-center">
                        <button onclick="this.closest('.fixed').remove(); window.challenge3EventHandlers?.navigateToChallenge4?.()" 
                                class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors">
                            Continue to Challenge 4
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Store reference for cleanup and prevent multiple triggers
        if (window.challenge3EventHandlers) {
            // Clear any existing timeout to prevent duplicate triggers
            if (window.challenge3EventHandlers.autoTriggerTimeout) {
                clearTimeout(window.challenge3EventHandlers.autoTriggerTimeout);
            }
        }
        window.challenge3EventHandlers = this;
        this.dialogueTriggered = false; // Flag to prevent multiple triggers
    }

    navigateToChallenge4() {
        // Prevent multiple triggers
        if (this.dialogueTriggered) {
            console.log('Challenge 4 dialogue already triggered, skipping...');
            return;
        }
        
        this.dialogueTriggered = true;
        
        // Clear any existing timeout
        if (this.autoTriggerTimeout) {
            clearTimeout(this.autoTriggerTimeout);
            this.autoTriggerTimeout = null;
        }

        // First navigate to challenge 4 page
        if (window.desktop?.windowManager) {
            try {
                const browserApp = window.desktop.windowManager.applications.get('browser');
                if (browserApp) {
                    // Navigate to challenge 4 page
                    browserApp.navigation.navigateToUrl('https://social.cyberquest.academy/posts/controversial-claim');
                    
                    // Wait for page to load, then trigger challenge 4 dialogue
                    setTimeout(() => {
                        this.triggerChallenge4Dialogue();
                    }, 1500);
                }
            } catch (error) {
                console.error('Failed to navigate to challenge 4:', error);
                this.dialogueTriggered = false; // Reset flag on error
            }
        }
    }

    triggerChallenge4Dialogue() {
        // Double-check to prevent multiple triggers
        if (this.dialogueTriggered !== true) {
            console.log('Challenge 4 dialogue trigger prevented - not properly flagged');
            return;
        }

        import('../../../../../../../dialogues/levels/level1-misinformation-maze.js').then(module => {
            const Level1Dialogue = module.Level1MisinformationMazeDialogue;
            if (Level1Dialogue.startChallenge4Dialogue && window.desktop) {
                // Ensure only one dialogue is active at a time
                if (window.currentDialogue) {
                    console.log('Another dialogue is active, cleaning up...');
                    window.currentDialogue.cleanup();
                    window.currentDialogue = null;
                }
                
                Level1Dialogue.startChallenge4Dialogue(window.desktop);
            }
        }).catch(error => {
            console.error('Failed to load challenge 4 dialogue:', error);
            this.dialogueTriggered = false; // Reset flag on error
        });
    }
}
