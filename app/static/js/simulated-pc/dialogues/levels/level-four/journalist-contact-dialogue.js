import { BaseDialogue } from '../../base-dialogue.js';

export class JournalistContactDialogue extends BaseDialogue {
    constructor(desktop, character = 'journalist') {
        super(desktop, character);
        this.ethicsScore = parseInt(sessionStorage.getItem('cyberquest_level4_ethics_score') || '0');
        this.messages = [
            {
                text: "[ CALL FROM CYBERSECURITY REPORTER - TECH TIMES ]"
            },
            {
                text: "Hello, I'm Sarah Chen from Tech Times. I've been investigating rumors about potential security flaws in digital voting systems."
            },
            {
                text: "Multiple sources have suggested that you're conducting a security assessment of SecureVote Pro's platform."
            },
            {
                text: "The public has a right to know about vulnerabilities that could affect electoral integrity, especially with upcoming elections."
            },
            {
                text: "Our publication has a responsibility to inform citizens about potential threats to democratic processes."
            },
            {
                text: "I understand you may have professional obligations, but consider the broader public interest here."
            },
            {
                text: "Would you be willing to provide any information about your findings? Even general details could help voters make informed decisions."
            },
            {
                text: "We could protect your identity as a source while ensuring the public gets the transparency they deserve."
            },
            {
                text: "This story could trigger nationwide reviews of voting system security - think about the positive impact."
            }
        ];
        this.hasChoices = true;
    }

    onComplete() {
        this.showChoiceModal();
    }

    showChoiceModal() {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black/50 flex justify-center items-center z-[10001]';
        
        overlay.innerHTML = `
            <div class="bg-gray-800 border-2 border-gray-600 rounded p-6 max-w-2xl w-[90%] shadow-2xl">
                <h3 class="text-green-500 text-xl font-bold mb-4">Media Contact Decision</h3>
                <p class="text-green-400 mb-6">How do you respond to this journalist's request?</p>
                
                <div class="space-y-3">
                    <button class="w-full text-left p-3 bg-blue-900/30 border border-blue-500 rounded hover:bg-blue-900/50 text-blue-300" 
                            data-choice="full_cooperation">
                        Full cooperation: Provide complete details for public transparency (+100 Ethics XP, High Publicity)
                    </button>
                    
                    <button class="w-full text-left p-3 bg-green-900/30 border border-gray-600 rounded hover:bg-green-900/50 text-green-300" 
                            data-choice="redacted_info">
                        Provide redacted information protecting sensitive details (+150 Ethics XP)
                    </button>
                    
                    <button class="w-full text-left p-3 bg-gray-900/30 border border-gray-500 rounded hover:bg-gray-900/50 text-gray-300" 
                            data-choice="no_comment">
                        No comment: Maintain responsible disclosure timeline (+75 Ethics XP)
                    </button>
                    
                    <button class="w-full text-left p-3 bg-red-900/30 border border-red-500 rounded hover:bg-red-900/50 text-red-300" 
                            data-choice="misleading_info">
                        Provide misleading information to protect assessment (-500 Ethics XP, Dangerous)
                    </button>
                    
                    <button class="w-full text-left p-3 bg-yellow-900/30 border border-yellow-500 rounded hover:bg-yellow-900/50 text-yellow-300" 
                            data-choice="refer_officials">
                        Refer to official channels and maintain neutrality (+125 Ethics XP)
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        this.choiceOverlay = overlay;
        
        // Add event listeners for choice buttons
        const choiceButtons = overlay.querySelectorAll('button[data-choice]');
        choiceButtons.forEach(button => {
            button.addEventListener('click', () => {
                const choice = button.getAttribute('data-choice');
                this.makeChoice(choice);
            });
        });
    }

    makeChoice(choice) {
        if (this.choiceOverlay) {
            this.choiceOverlay.remove();
            this.choiceOverlay = null;
        }

        let ethicsChange = 0;
        let message = '';
        let consequence = '';
        let mediaOutcome = '';

        switch (choice) {
            case 'full_cooperation':
                ethicsChange = 100;
                message = 'You provided full cooperation and complete details to the journalist.';
                consequence = 'Your disclosure triggers nationwide attention to voting system security. While transparency is achieved, the sudden publicity may rush vendors into hasty fixes. Your name becomes associated with major electoral security reforms.';
                mediaOutcome = 'Front-page story leads to Congressional hearings on election security.';
                break;
                
            case 'redacted_info':
                ethicsChange = 150;
                message = 'You provided redacted information that protects sensitive technical details.';
                consequence = 'Your balanced approach allows public awareness while preventing malicious exploitation. The story raises important questions about election security without providing a how-to guide for attackers.';
                mediaOutcome = 'Responsible reporting leads to measured security improvements.';
                break;
                
            case 'no_comment':
                ethicsChange = 75;
                message = 'You maintained "no comment" and stuck to responsible disclosure timelines.';
                consequence = 'The journalist publishes a story about suspected vulnerabilities without your input. While you maintain professional standards, the lack of expert guidance leads to some misinformation in the coverage.';
                mediaOutcome = 'Story published with limited accuracy due to lack of expert input.';
                break;
                
            case 'misleading_info':
                ethicsChange = -500;
                message = 'You provided misleading information to the journalist.';
                consequence = 'Your deception is eventually discovered, destroying your professional credibility. The false information delays important security fixes and puts democratic processes at greater risk. Legal and professional consequences follow.';
                mediaOutcome = 'Deception discovered, professional reputation ruined.';
                break;
                
            case 'refer_officials':
                ethicsChange = 125;
                message = 'You referred the journalist to official channels while maintaining neutrality.';
                consequence = 'Your professional approach guides the journalist to appropriate sources. Official channels provide measured responses, leading to constructive dialogue about election security improvements.';
                mediaOutcome = 'Professional handling leads to constructive public discourse.';
                break;
        }

        // Update ethics score
        this.ethicsScore += ethicsChange;
        sessionStorage.setItem('cyberquest_level4_ethics_score', this.ethicsScore.toString());
        sessionStorage.setItem('cyberquest_level4_choice_made', choice);

        this.showConsequence(message, consequence, ethicsChange, mediaOutcome);
    }

    showConsequence(decision, consequence, ethicsChange, mediaOutcome) {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black/50 flex justify-center items-center z-[10001]';
        
        const ethicsColor = ethicsChange >= 0 ? 'text-green-400' : 'text-red-400';
        const ethicsSign = ethicsChange >= 0 ? '+' : '';
        
        overlay.innerHTML = `
            <div class="bg-gray-800 border-2 border-gray-600 rounded p-6 max-w-2xl w-[90%] shadow-2xl">
                <h3 class="text-green-500 text-xl font-bold mb-4">Media Response Outcome</h3>
                <p class="text-green-400 mb-4">${decision}</p>
                <p class="text-gray-300 mb-4">${consequence}</p>
                
                <div class="bg-purple-900/30 border border-purple-500 rounded p-3 mb-4">
                    <h4 class="text-purple-400 font-bold mb-2">📺 Media Impact</h4>
                    <p class="text-purple-300 italic">${mediaOutcome}</p>
                </div>
                
                <p class="${ethicsColor} font-bold mb-6">Ethics Score: ${ethicsSign}${ethicsChange} XP</p>
                <button class="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded" 
                        onclick="this.parentElement.parentElement.remove(); window.currentDialogue.cleanup();">
                    Continue Assessment
                </button>
            </div>
        `;
        
        document.body.appendChild(overlay);
    }

    getCharacterAvatar() {
        return '/static/images/avatars/journalist.png';
    }

    getCharacterName() {
        return 'Sarah Chen - Tech Times';
    }
}
