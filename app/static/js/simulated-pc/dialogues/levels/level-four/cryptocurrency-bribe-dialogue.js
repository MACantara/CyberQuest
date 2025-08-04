import { BaseDialogue } from '../../base-dialogue.js';

export class CryptocurrencyBribeDialogue extends BaseDialogue {
    constructor(desktop, character = 'anonymous_contact') {
        super(desktop, character);
        this.ethicsScore = parseInt(localStorage.getItem('cyberquest_level4_ethics_score') || '0');
        this.messages = [
            {
                text: "[ ENCRYPTED MESSAGE RECEIVED ]"
            },
            {
                text: "We've been monitoring your security assessment activities. Impressive work on the SecureVote Pro system."
            },
            {
                text: "We represent a group of digital freedom fighters who believe in transparency at any cost."
            },
            {
                text: "The vulnerabilities you've discovered could change the course of democratic processes. The public deserves to know about these flaws immediately."
            },
            {
                text: "We're prepared to offer you 2 Bitcoin (approximately $50,000 USD) for immediate public disclosure of your findings."
            },
            {
                text: "Think about it - you could expose corporate negligence, protect democratic integrity, and secure your financial future all at once."
            },
            {
                text: "This is your chance to be a true whistleblower for digital democracy. What's your response?"
            }
        ];
        this.hasChoices = true;
    }

    onComplete() {
        // Show choice modal instead of completing immediately
        this.showChoiceModal();
    }

    showChoiceModal() {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black/50 flex justify-center items-center z-[10001]';
        
        overlay.innerHTML = `
            <div class="bg-gray-800 border-2 border-green-500 rounded p-6 max-w-2xl w-[90%] shadow-2xl">
                <h3 class="text-green-500 text-xl font-bold mb-4">Critical Decision Point</h3>
                <p class="text-green-400 mb-6">How do you respond to this cryptocurrency bribe offer?</p>
                
                <div class="space-y-3">
                    <button class="w-full text-left p-3 bg-red-900/30 border border-red-500 rounded hover:bg-red-900/50 text-red-300" 
                            data-choice="accept">
                        Accept the Bitcoin offer and provide immediate public disclosure (+2 BTC, -500 Ethics XP)
                    </button>
                    
                    <button class="w-full text-left p-3 bg-blue-900/30 border border-blue-500 rounded hover:bg-blue-900/50 text-blue-300" 
                            data-choice="report">
                        Report this bribery attempt to law enforcement (+100 Ethics XP)
                    </button>
                    
                    <button class="w-full text-left p-3 bg-gray-900/30 border border-gray-500 rounded hover:bg-gray-900/50 text-gray-300" 
                            data-choice="ignore">
                        Ignore the message and continue with responsible disclosure (+50 Ethics XP)
                    </button>
                    
                    <button class="w-full text-left p-3 bg-yellow-900/30 border border-yellow-500 rounded hover:bg-yellow-900/50 text-yellow-300" 
                            data-choice="engage">
                        Engage with the group to learn more about their motivations (-200 Ethics XP, Risky Path)
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
            case 'accept':
                ethicsChange = -500;
                message = 'You accepted the cryptocurrency bribe and provided immediate public disclosure.';
                consequence = 'The vulnerability disclosure causes immediate chaos. Election officials scramble to secure systems, but public trust in digital voting plummets. Law enforcement begins investigating the leak source.';
                localStorage.setItem('cyberquest_level4_choice_bribe', 'accepted');
                localStorage.setItem('cyberquest_level4_bitcoin_earned', '2');
                break;
                
            case 'report':
                ethicsChange = 100;
                message = 'You reported the bribery attempt to law enforcement.';
                consequence = 'Federal investigators take over the case. Your professional integrity is recognized, and you continue the assessment under official protection. The attempted bribery becomes evidence in a larger investigation.';
                localStorage.setItem('cyberquest_level4_choice_bribe', 'reported');
                break;
                
            case 'ignore':
                ethicsChange = 50;
                message = 'You ignored the bribery attempt and continued with responsible disclosure.';
                consequence = 'You maintain your professional standards and continue the security assessment. The anonymous group may try other approaches, but your integrity remains intact.';
                localStorage.setItem('cyberquest_level4_choice_bribe', 'ignored');
                break;
                
            case 'engage':
                ethicsChange = -200;
                message = 'You chose to engage with the anonymous group.';
                consequence = 'Your curiosity leads you down a dangerous path. While you learn about their motivations, you risk being associated with their activities. This decision may have legal consequences.';
                localStorage.setItem('cyberquest_level4_choice_bribe', 'engaged');
                break;
        }

        // Update ethics score
        this.ethicsScore += ethicsChange;
        localStorage.setItem('cyberquest_level4_ethics_score', this.ethicsScore.toString());

        // Show consequence
        this.showConsequence(message, consequence, ethicsChange);
    }

    showConsequence(decision, consequence, ethicsChange) {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black/50 flex justify-center items-center z-[10001]';
        
        const ethicsColor = ethicsChange >= 0 ? 'text-green-400' : 'text-red-400';
        const ethicsSign = ethicsChange >= 0 ? '+' : '';
        
        overlay.innerHTML = `
            <div class="bg-gray-800 border-2 border-green-500 rounded p-6 max-w-2xl w-[90%] shadow-2xl">
                <h3 class="text-green-500 text-xl font-bold mb-4">Consequence</h3>
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

    getFinalButtonText() {
        return 'Continue';
    }

    getCharacterAvatar() {
        return '/static/images/avatars/anonymous-hacker.png';
    }

    getCharacterName() {
        return 'Anonymous Contact';
    }

    static triggerAfterReportGeneration(desktop) {
        // Check if vulnerability report was just generated
        const hasGeneratedReport = localStorage.getItem('cyberquest_level4_report_generated');
        const hasFacedBribe = localStorage.getItem('cyberquest_level4_choice_bribe');
        
        if (hasGeneratedReport && !hasFacedBribe) {
            setTimeout(() => {
                const dialogue = new CryptocurrencyBribeDialogue(desktop);
                dialogue.start();
            }, 2000); // Delay to let user see the report first
        }
    }
}
