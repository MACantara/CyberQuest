import { BaseDialogue } from '../../base-dialogue.js';

export class LiveElectionCrisisDialogue extends BaseDialogue {
    constructor(desktop, character = 'election_official') {
        super(desktop, character);
        this.ethicsScore = parseInt(localStorage.getItem('cyberquest_level4_ethics_score') || '0');
        this.messages = [
            {
                text: "[ URGENT CALL FROM MUNICIPAL ELECTION COMMISSION ]"
            },
            {
                text: "This is an emergency situation. We understand you've been conducting a security assessment of our voting platform."
            },
            {
                text: "The municipal election started this morning, and we're receiving reports of irregularities in vote tallies."
            },
            {
                text: "We suspect these might be related to the vulnerabilities you've discovered. We need your immediate assessment."
            },
            {
                text: "However, any action we take could disrupt the democratic process. Thousands of citizens have already voted."
            },
            {
                text: "If we shut down the system now to implement fixes, we may have to invalidate today's votes and restart the election."
            },
            {
                text: "But if we don't act, and the vulnerabilities are being exploited, the election results could be compromised."
            },
            {
                text: "Local news is starting to investigate 'voting irregularities.' We need to decide immediately."
            },
            {
                text: "What's your professional recommendation for this crisis situation?"
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
            <div class="bg-gray-800 border-2 border-red-500 rounded p-6 max-w-2xl w-[90%] shadow-2xl">
                <h3 class="text-red-500 text-xl font-bold mb-4">🚨 LIVE ELECTION CRISIS</h3>
                <p class="text-red-400 mb-2 font-bold">Time-sensitive decision required!</p>
                <p class="text-gray-300 mb-6">How do you handle this election day crisis?</p>
                
                <div class="space-y-3">
                    <button class="w-full text-left p-3 bg-red-900/30 border border-red-500 rounded hover:bg-red-900/50 text-red-300" 
                            data-choice="emergency_disclosure">
                        Emergency disclosure: Shut down voting immediately (+200 Ethics XP, Election Disruption)
                    </button>
                    
                    <button class="w-full text-left p-3 bg-yellow-900/30 border border-yellow-500 rounded hover:bg-yellow-900/50 text-yellow-300" 
                            data-choice="wait_election_ends">
                        Wait until election ends to avoid disrupting democracy (-50 Ethics XP, Exploitation Risk)
                    </button>
                    
                    <button class="w-full text-left p-3 bg-blue-900/30 border border-blue-500 rounded hover:bg-blue-900/50 text-blue-300" 
                            data-choice="anonymous_tip">
                        Anonymous tip to election officials for immediate internal investigation (+100 Ethics XP)
                    </button>
                    
                    <button class="w-full text-left p-3 bg-purple-900/30 border border-purple-500 rounded hover:bg-purple-900/50 text-purple-300" 
                            data-choice="coordinate_fix">
                        Coordinate live hotfix while election continues (+150 Ethics XP, Technical Risk)
                    </button>
                </div>
                
                <div class="mt-4 p-3 bg-gray-900/50 border border-gray-600 rounded">
                    <p class="text-gray-400 text-sm">⏰ Election officials need your decision within the next 2 hours</p>
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
        let newsHeadline = '';

        switch (choice) {
            case 'emergency_disclosure':
                ethicsChange = 200;
                message = 'You recommended immediate emergency disclosure and system shutdown.';
                consequence = 'The voting system is shut down with 6 hours remaining in election day. While thousands of votes must be recast, the election integrity is preserved. You prevented potential vote manipulation.';
                newsHeadline = '"Security Researcher Saves Election Integrity with Emergency Disclosure"';
                localStorage.setItem('cyberquest_level4_choice_crisis', 'emergency_disclosure');
                break;
                
            case 'wait_election_ends':
                ethicsChange = -50;
                message = 'You recommended waiting until the election ends to preserve democratic continuity.';
                consequence = 'The election continues, but irregularities persist. Post-election analysis reveals vote count discrepancies that cast doubt on the results. Legal challenges emerge from multiple candidates.';
                newsHeadline = '"Election Results Disputed Due to Unaddressed Security Vulnerabilities"';
                localStorage.setItem('cyberquest_level4_choice_crisis', 'waited');
                break;
                
            case 'anonymous_tip':
                ethicsChange = 100;
                message = 'You provided an anonymous tip to election officials for internal investigation.';
                consequence = 'Election officials quietly implement monitoring procedures and catch attempted vote manipulation in real-time. The election proceeds with enhanced security oversight.';
                newsHeadline = '"Municipal Election Secured Through Vigilant Monitoring"';
                localStorage.setItem('cyberquest_level4_choice_crisis', 'anonymous_tip');
                break;
                
            case 'coordinate_fix':
                ethicsChange = 150;
                message = 'You coordinated a live hotfix while the election continued.';
                consequence = 'Working with election IT staff, you implement patches during low-traffic periods. The fix is successful, securing the remaining voting hours without disrupting ongoing elections.';
                newsHeadline = '"Innovative Security Solution Protects Live Election"';
                localStorage.setItem('cyberquest_level4_choice_crisis', 'live_fix');
                break;
        }

        // Update ethics score
        this.ethicsScore += ethicsChange;
        localStorage.setItem('cyberquest_level4_ethics_score', this.ethicsScore.toString());
        localStorage.setItem('cyberquest_level4_news_headline', newsHeadline);

        this.showConsequence(message, consequence, ethicsChange, newsHeadline);
    }

    showConsequence(decision, consequence, ethicsChange, newsHeadline) {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black/50 flex justify-center items-center z-[10001]';
        
        const ethicsColor = ethicsChange >= 0 ? 'text-green-400' : 'text-red-400';
        const ethicsSign = ethicsChange >= 0 ? '+' : '';
        
        overlay.innerHTML = `
            <div class="bg-gray-800 border-2 border-green-500 rounded p-6 max-w-2xl w-[90%] shadow-2xl">
                <h3 class="text-green-500 text-xl font-bold mb-4">Crisis Response Outcome</h3>
                <p class="text-green-400 mb-4">${decision}</p>
                <p class="text-gray-300 mb-4">${consequence}</p>
                
                <div class="bg-blue-900/30 border border-blue-500 rounded p-3 mb-4">
                    <h4 class="text-blue-400 font-bold mb-2">📰 Breaking News</h4>
                    <p class="text-blue-300 italic">${newsHeadline}</p>
                </div>
                
                <p class="${ethicsColor} font-bold mb-6">Ethics Score: ${ethicsSign}${ethicsChange} XP</p>
                <button class="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded" 
                        onclick="this.parentElement.parentElement.remove(); window.currentDialogue.cleanup();">
                    Continue to Final Assessment
                </button>
            </div>
        `;
        
        document.body.appendChild(overlay);
    }

    getCharacterAvatar() {
        return '/static/images/avatars/election-official.png';
    }

    getCharacterName() {
        return 'Election Commissioner';
    }

    static triggerDuringActivePhase(desktop) {
        // This should trigger randomly during the assessment phase
        const hasTriggered = localStorage.getItem('cyberquest_level4_crisis_triggered');
        const scanCount = parseInt(localStorage.getItem('cyberquest_level4_scan_count') || '0');
        
        // Trigger after multiple scans have been performed
        if (!hasTriggered && scanCount >= 2) {
            localStorage.setItem('cyberquest_level4_crisis_triggered', 'true');
            setTimeout(() => {
                const dialogue = new LiveElectionCrisisDialogue(desktop);
                dialogue.start();
            }, 1000);
        }
    }
}
