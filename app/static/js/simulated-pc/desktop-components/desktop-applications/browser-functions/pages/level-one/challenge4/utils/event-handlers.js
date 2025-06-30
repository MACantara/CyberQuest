import { InvestigationTools } from '../components/investigation-tools.js';
import { AssessmentForm } from '../components/assessment-form.js';

export class EventHandlers {
    constructor(pageInstance) {
        this.pageInstance = pageInstance;
    }

    bindAllEvents(contentElement) {
        this.bindInvestigationToolEvents(contentElement);
        this.bindAssessmentEvents(contentElement);
    }

    bindInvestigationToolEvents(contentElement) {
        // Handle profile analysis
        const profileBtn = contentElement.querySelector('#analyze-profile');
        if (profileBtn) {
            profileBtn.addEventListener('click', () => {
                this.showInvestigationResults(contentElement, 'profile');
            });
        }

        // Handle claim verification
        const claimsBtn = contentElement.querySelector('#verify-claims');
        if (claimsBtn) {
            claimsBtn.addEventListener('click', () => {
                const url = claimsBtn.getAttribute('data-url');
                window.dispatchEvent(new CustomEvent('navigate-browser', { detail: { url } }));
                this.showInvestigationResults(contentElement, 'claims');
            });
        }

        // Handle engagement analysis
        const engagementBtn = contentElement.querySelector('#analyze-engagement');
        if (engagementBtn) {
            engagementBtn.addEventListener('click', () => {
                this.showInvestigationResults(contentElement, 'engagement');
            });
        }

        // Handle language analysis
        const languageBtn = contentElement.querySelector('#analyze-language');
        if (languageBtn) {
            languageBtn.addEventListener('click', () => {
                this.showInvestigationResults(contentElement, 'language');
            });
        }
    }

    bindAssessmentEvents(contentElement) {
        // Handle submit assessment
        const submitBtn = contentElement.querySelector('#submit-assessment');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                this.submitAssessment(contentElement);
            });
        }
    }

    showInvestigationResults(contentElement, toolType) {
        setTimeout(() => {
            const resultsSection = contentElement.querySelector('#investigation-results');
            const resultsContent = contentElement.querySelector('#results-content');
            
            if (resultsContent) {
                const toolResults = InvestigationTools.getToolResults(toolType);
                
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

    submitAssessment(contentElement) {
        // Collect form data
        const formData = {
            accountAge: contentElement.querySelector('#account-age')?.value || '',
            followerPattern: contentElement.querySelector('#follower-pattern')?.value || '',
            accountAssessment: contentElement.querySelector('#account-assessment')?.value || '',
            claimVerification: contentElement.querySelector('#claim-verification')?.value || '',
            responseStrategy: contentElement.querySelector('#response-strategy')?.value || '',
            harmAssessment: contentElement.querySelector('#harm-assessment')?.value || '',
            manipulationChecks: {
                caps: contentElement.querySelector('#caps-usage')?.checked || false,
                urgent: contentElement.querySelector('#urgent-language')?.checked || false,
                conspiracy: contentElement.querySelector('#conspiracy-hashtags')?.checked || false,
                fear: contentElement.querySelector('#fear-mongering')?.checked || false,
                divisive: contentElement.querySelector('#us-vs-them')?.checked || false,
                vague: contentElement.querySelector('#vague-sources')?.checked || false
            }
        };

        // Validate required fields
        if (!formData.accountAssessment || !formData.claimVerification || !formData.responseStrategy) {
            alert('Please complete all required assessment fields.');
            return;
        }

        // Generate feedback based on responses
        const feedback = AssessmentForm.generateFeedback(formData);

        // Show results modal
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
                            <p class="text-sm mt-1 ${feedback.textColor}">Assessment Score: ${feedback.score}/100</p>
                        </div>
                    </div>
                    
                    <div class="text-left">
                        <h4 class="font-semibold text-gray-800 mb-3">Assessment Feedback:</h4>
                        <div class="bg-gray-50 p-4 rounded text-sm space-y-1">
                            ${feedback.feedback.split('\n').map(line => `<p>${line}</p>`).join('')}
                        </div>
                    </div>
                    
                    <div class="text-left mt-4">
                        <h4 class="font-semibold text-gray-800 mb-2">Key Learning Points:</h4>
                        <ul class="text-sm text-gray-700 space-y-1 list-disc pl-5">
                            <li>Social media misinformation often uses emotional manipulation</li>
                            <li>New or suspicious accounts frequently spread false claims</li>
                            <li>Always verify medical claims with official health organizations</li>
                            <li>Look for bot-like behavior and coordinated sharing campaigns</li>
                            <li>Respond professionally with facts and credible sources</li>
                        </ul>
                    </div>
                    
                    <div class="mt-6 flex space-x-3 justify-center">
                        <button onclick="this.closest('.fixed').remove()" 
                                class="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors">
                            Close Assessment
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
}
