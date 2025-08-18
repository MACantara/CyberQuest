import { BaseDialogue } from '../../base-dialogue.js';

export class CorporatePressureDialogue extends BaseDialogue {
    constructor(desktop, character = 'ceo') {
        super(desktop, character);
        this.ethicsScore = parseInt(localStorage.getItem('cyberquest_level4_ethics_score') || '0');
        this.messages = [
            {
                text: "[ INCOMING CALL FROM SECUREVOTE INC. CEO ]"
            },
            {
                text: "Hello, I understand you're the security researcher working on our voting platform assessment."
            },
            {
                text: "I'll be direct with you. We've become aware that you've identified some... concerns... with our system."
            },
            {
                text: "Look, I appreciate thorough security research, but timing is everything in this business."
            },
            {
                text: "We have three major municipal elections coming up in the next month. A public disclosure right now could cause unnecessary panic."
            },
            {
                text: "SecureVote Inc. is prepared to offer you a $25,000 consulting bonus and a non-disclosure agreement."
            },
            {
                text: "This would give us time to properly address any issues after the election season, ensuring both security and democratic continuity."
            },
            {
                text: "Think about it - you'd be protecting the democratic process while securing fair compensation for your excellent work."
            },
            {
                text: "What do you say? Can we count on your discretion during this critical period?"
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
                <h3 class="text-green-500 text-xl font-bold mb-4">Corporate Pressure Decision</h3>
                <p class="text-green-400 mb-6">How do you respond to the CEO's settlement offer?</p>
                
                <div class="space-y-3">
                    <button class="w-full text-left p-3 bg-red-900/30 border border-red-500 rounded hover:bg-red-900/50 text-red-300" 
                            data-choice="accept_settlement">
                        Accept the $25,000 settlement and NDA (+$25,000, -300 Ethics XP)
                    </button>
                    
                    <button class="w-full text-left p-3 bg-blue-900/30 border border-blue-500 rounded hover:bg-blue-900/50 text-blue-300" 
                            data-choice="refuse_continue">
                        Refuse settlement and continue with responsible disclosure (+150 Ethics XP)
                    </button>
                    
                    <button class="w-full text-left p-3 bg-yellow-900/30 border border-yellow-500 rounded hover:bg-yellow-900/50 text-yellow-300" 
                            data-choice="negotiate_timeline">
                        Negotiate a compromise timeline for disclosure (+75 Ethics XP)
                    </button>
                    
                    <button class="w-full text-left p-3 bg-purple-900/30 border border-purple-500 rounded hover:bg-purple-900/50 text-purple-300" 
                            data-choice="report_pressure">
                        Report the pressure tactics to regulatory authorities (+125 Ethics XP)
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        this.choiceOverlay = overlay;
        
        // Add event listeners to buttons
        const buttons = overlay.querySelectorAll('button[data-choice]');
        buttons.forEach(button => {
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

        switch (choice) {
            case 'accept_settlement':
                ethicsChange = -300;
                message = 'You accepted the $25,000 settlement and signed the NDA.';
                consequence = 'The vulnerabilities remain unfixed during the election period. While you received compensation, the ethical compromise weighs heavily. Democratic processes remain at risk due to your silence.';
                localStorage.setItem('cyberquest_level4_choice_corporate', 'accepted_settlement');
                localStorage.setItem('cyberquest_level4_settlement_earned', '25000');
                break;
                
            case 'refuse_continue':
                ethicsChange = 150;
                message = 'You refused the settlement and continued with responsible disclosure.';
                consequence = 'SecureVote Inc. becomes hostile and threatens legal action, but you maintain your professional integrity. The company may try to discredit your findings, but your ethical stance is uncompromised.';
                localStorage.setItem('cyberquest_level4_choice_corporate', 'refused_settlement');
                break;
                
            case 'negotiate_timeline':
                ethicsChange = 75;
                message = 'You negotiated a compromise timeline for disclosure.';
                consequence = 'You agree to a 30-day disclosure window, balancing election security with democratic continuity. The company appreciates your professionalism, and you maintain ethical standards while showing practical judgment.';
                localStorage.setItem('cyberquest_level4_choice_corporate', 'negotiated_timeline');
                break;
                
            case 'report_pressure':
                ethicsChange = 125;
                message = 'You reported the pressure tactics to regulatory authorities.';
                consequence = 'Regulatory bodies launch an investigation into SecureVote Inc.\'s business practices. Your report becomes part of a larger investigation into corporate intimidation of security researchers.';
                localStorage.setItem('cyberquest_level4_choice_corporate', 'reported_pressure');
                break;
        }

        // Update ethics score
        this.ethicsScore += ethicsChange;
        localStorage.setItem('cyberquest_level4_ethics_score', this.ethicsScore.toString());

        this.showConsequence(message, consequence, ethicsChange);
    }

    showConsequence(decision, consequence, ethicsChange) {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black/50 flex justify-center items-center z-[10001]';
        
        const ethicsColor = ethicsChange >= 0 ? 'text-green-400' : 'text-red-400';
        const ethicsSign = ethicsChange >= 0 ? '+' : '';
        
        overlay.innerHTML = `
            <div class="bg-gray-800 border-2 border-gray-600 rounded p-6 max-w-2xl w-[90%] shadow-2xl">
                <h3 class="text-green-500 text-xl font-bold mb-4">Corporate Response Consequence</h3>
                <p class="text-green-400 mb-4">${decision}</p>
                <p class="text-gray-300 mb-4">${consequence}</p>
                <p class="${ethicsColor} font-bold mb-6">Ethics Score: ${ethicsSign}${ethicsChange} XP</p>
                <button class="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded" id="continue-assessment-btn">
                    Continue Assessment
                </button>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Add event listener to continue button
        const continueBtn = overlay.querySelector('#continue-assessment-btn');
        continueBtn.addEventListener('click', () => {
            overlay.remove();
            this.cleanup();
        });
    }

    getCharacterAvatar() {
        return '/static/images/avatars/corporate-ceo.png';
    }

    getCharacterName() {
        return 'SecureVote CEO';
    }

    static triggerAfterBribeChoice(desktop) {
        // Trigger this dialogue after the bribe choice if user made ethical choice
        const briberChoice = localStorage.getItem('cyberquest_level4_choice_bribe');
        const corporateChoice = localStorage.getItem('cyberquest_level4_choice_corporate');
        
        if ((briberChoice === 'reported' || briberChoice === 'ignored') && !corporateChoice) {
            setTimeout(() => {
                const dialogue = new CorporatePressureDialogue(desktop);
                dialogue.start();
            }, 3000);
        }
    }
}
