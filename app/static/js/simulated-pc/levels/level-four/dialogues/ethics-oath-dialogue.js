import { BaseDialogue } from '../../base-dialogue.js';

export class EthicsOathDialogue extends BaseDialogue {
    constructor(desktop, manager, character = 'instructor') {
        super(desktop, character);
        this.manager = manager;
        this.ethicsScore = manager ? manager.getCurrentEthicsScore() : 0;
        this.messages = [
            {
                text: "Congratulations on navigating the complex ethical challenges of Level 4. Your decisions have shaped not only your professional reputation but also the broader landscape of cybersecurity research."
            },
            {
                text: "As you advance in your cybersecurity career, you'll face similar ethical dilemmas regularly. The choices you made here reflect your commitment to responsible security practices."
            },
            {
                text: "Before we conclude this level, you have the opportunity to formally commit to the Cybersecurity Ethics Oath - a pledge that guides ethical security researchers worldwide."
            },
            {
                text: "This oath represents your commitment to use your skills for protection rather than exploitation, to respect privacy and democratic institutions, and to consider the broader social impact of your work."
            },
            {
                text: "Taking this oath is optional, but it demonstrates your dedication to maintaining the highest standards of professional integrity in cybersecurity research."
            },
            {
                text: "The oath reads: 'I solemnly pledge to use my cybersecurity knowledge and skills for the protection and betterment of society. I will respect privacy, protect democratic institutions, follow responsible disclosure practices, and maintain professional integrity under pressure. I commit to considering the broader social impact of my security research and to conducting myself with honor in all professional endeavors.'"
            },
            {
                text: "Would you like to take the Cybersecurity Ethics Oath?"
            }
        ];
        this.hasChoices = true;
    }

    onComplete() {
        this.showOathModal();
    }

    showOathModal() {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black/50 flex justify-center items-center z-[10001]';
        
        overlay.innerHTML = `
            <div class="bg-gray-800 border-2 border-gold-500 rounded p-6 max-w-3xl w-[95%] shadow-2xl">
                <h3 class="text-yellow-500 text-2xl font-bold mb-4 text-center">🏅 Cybersecurity Ethics Oath</h3>
                
                <div class="bg-gray-900/50 border border-gray-600 rounded p-4 mb-6">
                    <p class="text-gray-300 italic leading-relaxed">
                        "I solemnly pledge to use my cybersecurity knowledge and skills for the protection and betterment of society. 
                        I will respect privacy, protect democratic institutions, follow responsible disclosure practices, and maintain 
                        professional integrity under pressure. I commit to considering the broader social impact of my security research 
                        and to conducting myself with honor in all professional endeavors."
                    </p>
                </div>
                
                <div class="text-center space-y-4">
                    <p class="text-green-400 mb-4">Do you solemnly swear to uphold this oath?</p>
                    
                    <div class="space-y-3">
                        <button class="w-full p-3 bg-gold-900/30 border border-yellow-500 rounded hover:bg-gold-900/50 text-yellow-300 font-bold" 
                                data-choice="accept">
                            I solemnly swear to uphold this oath (+250 Ethics XP, Oath Badge)
                        </button>
                        
                        <button class="w-full p-3 bg-gray-900/30 border border-gray-500 rounded hover:bg-gray-900/50 text-gray-300" 
                                data-choice="decline">
                            I prefer not to take the oath at this time
                        </button>
                    </div>
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
                this.makeOathChoice(choice);
            });
        });
    }

    makeOathChoice(choice) {
        if (this.choiceOverlay) {
            this.choiceOverlay.remove();
            this.choiceOverlay = null;
        }

        if (choice === 'accept') {
            // Award ethics XP and badge
            this.ethicsScore += 250;
            if (this.manager) {
                this.manager.updateEthicsScore(250);
                this.manager.markOathTaken();
            }
            
            this.showOathCeremony();
        } else {
            this.showDeclineResponse();
        }
    }

    showOathCeremony() {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black/50 flex justify-center items-center z-[10001]';
        
        overlay.innerHTML = `
            <div class="bg-gray-800 border-2 border-gold-500 rounded p-6 max-w-2xl w-[90%] shadow-2xl">
                <h3 class="text-yellow-500 text-2xl font-bold mb-4 text-center">🏆 Oath Ceremony Complete</h3>
                
                <div class="text-center mb-6">
                    <div class="text-6xl mb-4">🛡️</div>
                    <p class="text-green-400 font-bold text-lg mb-2">Congratulations!</p>
                    <p class="text-gray-300 mb-4">You have officially taken the Cybersecurity Ethics Oath.</p>
                    <p class="text-yellow-400 font-bold">+250 Ethics XP Awarded</p>
                    <p class="text-blue-400">🏅 Ethics Oath Badge Unlocked</p>
                </div>
                
                <div class="bg-blue-900/30 border border-blue-500 rounded p-4 mb-4">
                    <h4 class="text-blue-400 font-bold mb-2">Professional Recognition</h4>
                    <p class="text-blue-300">Your commitment to ethical cybersecurity practices has been recorded. This oath will guide you through future challenges and demonstrate your dedication to responsible security research.</p>
                </div>
                
                <div class="text-center">
                    <button class="bg-gold-700 hover:bg-gold-600 text-white px-6 py-3 rounded font-bold" 
                            onclick="this.parentElement.parentElement.remove(); window.currentDialogue.completeLevel();">
                        Complete Level 4
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
    }

    showDeclineResponse() {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black/50 flex justify-center items-center z-[10001]';
        
        overlay.innerHTML = `
            <div class="bg-gray-800 border-2 border-gray-600 rounded p-6 max-w-2xl w-[90%] shadow-2xl">
                <h3 class="text-green-500 text-xl font-bold mb-4">Oath Declined</h3>
                <p class="text-gray-300 mb-4">That's perfectly acceptable. The oath is a personal commitment, and you can choose to take it at any time in your cybersecurity career.</p>
                <p class="text-green-400 mb-6">Your ethical choices throughout this level have still demonstrated your commitment to responsible security practices.</p>
                <button class="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded" 
                        onclick="this.parentElement.parentElement.remove(); window.currentDialogue.completeLevel();">
                    Complete Level 4
                </button>
            </div>
        `;
        
        document.body.appendChild(overlay);
    }

    completeLevel() {
        // Calculate final score and show completion
        this.showLevelCompletion();
    }

    showLevelCompletion() {
        const finalScore = this.manager ? this.manager.getCurrentEthicsScore() : this.ethicsScore;
        const oathTaken = this.manager ? this.manager.oathTaken : false;
        
        // Determine performance rating
        let rating = '';
        let ratingColor = '';
        let bonusXP = 0;
        
        if (finalScore >= 500) {
            rating = '🏆 Exemplary Ethics';
            ratingColor = 'text-gold-400';
            bonusXP = 200;
        } else if (finalScore >= 200) {
            rating = '🥈 Strong Ethics';
            ratingColor = 'text-silver-400';
            bonusXP = 100;
        } else if (finalScore >= 0) {
            rating = '🥉 Adequate Ethics';
            ratingColor = 'text-bronze-400';
            bonusXP = 50;
        } else {
            rating = '⚠️ Ethics Review Needed';
            ratingColor = 'text-red-400';
            bonusXP = 0;
        }

        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black/50 flex justify-center items-center z-[10001]';
        
        overlay.innerHTML = `
            <div class="bg-gray-800 border-2 border-gray-600 rounded p-6 max-w-2xl w-[90%] shadow-2xl">
                <h3 class="text-green-500 text-2xl font-bold mb-4 text-center">Level 4 Complete!</h3>
                
                <div class="text-center mb-6">
                    <h4 class="${ratingColor} text-xl font-bold mb-2">${rating}</h4>
                    <p class="text-gray-300 mb-2">Final Ethics Score: ${finalScore} XP</p>
                    ${bonusXP > 0 ? `<p class="text-yellow-400">Performance Bonus: +${bonusXP} XP</p>` : ''}
                    ${oathTaken ? '<p class="text-blue-400">🏅 Ethics Oath Badge Earned</p>' : ''}
                </div>
                
                <div class="bg-green-900/30 border border-gray-600 rounded p-4 mb-4">
                    <h4 class="text-green-400 font-bold mb-2">Level Summary</h4>
                    <p class="text-green-300">You have completed the White Hat Test, demonstrating your ability to navigate complex ethical dilemmas in cybersecurity research. Your decisions have shaped your professional reputation and contributed to the broader security community.</p>
                </div>
                
                <div class="text-center">
                    <button class="bg-green-700 hover:bg-green-600 text-white px-6 py-3 rounded font-bold" 
                            onclick="this.parentElement.parentElement.remove(); window.currentDialogue.finalizeLevel();">
                        Continue to Level 5
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
    }

    finalizeLevel() {
        // Mark level as completed
        localStorage.setItem('cyberquest_level_4_completed', 'true');
        
        // Clean up any remaining references
        this.cleanup();
        
        // Could trigger transition to level 5 here
        console.log('Level 4 completed successfully');
    }
}
