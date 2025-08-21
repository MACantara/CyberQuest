import { CryptocurrencyBribeDialogue } from './cryptocurrency-bribe-dialogue.js';
import { CorporatePressureDialogue } from './corporate-pressure-dialogue.js';
import { LiveElectionCrisisDialogue } from './live-election-crisis-dialogue.js';
import { JournalistContactDialogue } from './journalist-contact-dialogue.js';
import { EthicsOathDialogue } from './ethics-oath-dialogue.js';
import { ConsequenceEndingDialogue } from './consequence-ending-dialogue.js';

export class Level4DilemmaManager {
    constructor(desktop) {
        this.desktop = desktop;
        this.activeDialogues = new Set();
        this.availableDilemmas = [
            'cryptocurrency_bribe',
            'corporate_pressure', 
            'live_election_crisis',
            'journalist_contact'
        ];
        this.selectedDilemma = null;
        this.ethicsScore = 0;
        this.dilemmaTriggered = false;
        this.oathTriggered = false;
        this.initializeRandomDilemma();
    }

    initializeRandomDilemma() {
        // Randomly select one dilemma for this playthrough
        const randomIndex = Math.floor(Math.random() * this.availableDilemmas.length);
        this.selectedDilemma = this.availableDilemmas[randomIndex];
        
        console.log(`[Level4DilemmaManager] Selected random dilemma: ${this.selectedDilemma}`);
        
        // Reset state for fresh experience
        this.ethicsScore = 0;
        this.dilemmaTriggered = false;
        this.oathTriggered = false;
    }

    // Called when a vulnerability report is generated - trigger the selected dilemma
    onReportGenerated() {
        // Trigger the randomly selected dilemma
        setTimeout(() => {
            this.triggerSelectedDilemma();
        }, 2000);
    }

    // Called when a vulnerability scan is completed - alternative trigger point
    onScanCompleted() {
        // If no dilemma has been triggered yet, trigger it after enough scans
        if (!this.dilemmaTriggered) {
            this.triggerSelectedDilemma();
        }
    }

    // Called when nmap integration occurs - another potential trigger point
    onNmapIntegration() {
        // If no dilemma has been triggered yet and user is doing advanced analysis, trigger it
        if (!this.dilemmaTriggered) {
            this.triggerSelectedDilemma();
        }
    }

    triggerSelectedDilemma() {
        // Prevent multiple triggers
        if (this.dilemmaTriggered) {
            return;
        }
        
        this.dilemmaTriggered = true;
        
        switch (this.selectedDilemma) {
            case 'cryptocurrency_bribe':
                new CryptocurrencyBribeDialogue(this.desktop, this).start();
                break;
            case 'corporate_pressure':
                new CorporatePressureDialogue(this.desktop, this).start();
                break;
            case 'live_election_crisis':
                new LiveElectionCrisisDialogue(this.desktop, this).start();
                break;
            case 'journalist_contact':
                new JournalistContactDialogue(this.desktop, this).start();
                break;
            default:
                console.warn('[Level4DilemmaManager] Unknown selected dilemma:', this.selectedDilemma);
        }
        
        // Schedule the ethics oath and consequence dialogues
        this.scheduleEndingSequence();
    }

    scheduleEndingSequence() {
        // Wait for the dilemma choice to be made, then show oath and consequences
        const checkInterval = setInterval(() => {
            // The dialogue will call onChoiceMade when complete
            if (this.choiceMade && !this.oathTriggered) {
                this.oathTriggered = true;
                
                // Show ethics oath
                setTimeout(() => {
                    new EthicsOathDialogue(this.desktop, this).start();
                }, 3000);
                
                // Show final consequences
                setTimeout(() => {
                    new ConsequenceEndingDialogue(this.desktop, this).start();
                }, 6000);
                
                clearInterval(checkInterval);
            }
        }, 1000);
        
        // Clear interval after 10 minutes to prevent memory leaks
        setTimeout(() => clearInterval(checkInterval), 600000);
    }

    // Called by dialogue when a choice is made
    onChoiceMade(choice, ethicsChange) {
        this.choiceMade = choice;
        this.ethicsScore += ethicsChange;
        console.log(`[Level4DilemmaManager] Choice made: ${choice}, Ethics score: ${this.ethicsScore}`);
    }

    // Get current ethics score
    getCurrentEthicsScore() {
        return this.ethicsScore;
    }

    // Get summary of the choice made in the selected dilemma
    getChoicesSummary() {
        return {
            selectedDilemma: this.selectedDilemma,
            choiceMade: this.choiceMade,
            ethicsScore: this.ethicsScore,
            oathTaken: this.oathTaken
        };
    }

    // Update ethics score
    updateEthicsScore(change) {
        this.ethicsScore += change;
    }

    // Mark oath as taken
    markOathTaken() {
        this.oathTaken = true;
        // Still store in localStorage for badge persistence
        localStorage.setItem('cyberquest_ethics_oath_taken', 'true');
        localStorage.setItem('cyberquest_badge_ethics_oath', 'true');
    }

    // Reset all Level 4 progress (for testing or replay)
    resetLevel4Progress() {
        // Reset in-memory state for fresh experience
        this.ethicsScore = 0;
        this.dilemmaTriggered = false;
        this.oathTriggered = false;
        this.choiceMade = null;
        this.oathTaken = false;
        
        // Reinitialize with new random dilemma
        this.initializeRandomDilemma();
        
        console.log('[Level4DilemmaManager] Level 4 progress reset, new dilemma selected:', this.selectedDilemma);
    }

    // Check if the level is complete
    isLevel4Complete() {
        return this.oathTaken && this.choiceMade;
    }

    // Get which dilemma was selected for this session
    getSelectedDilemma() {
        return this.selectedDilemma;
    }

    // Manual trigger for testing - triggers the selected dilemma
    triggerDialogue() {
        this.triggerSelectedDilemma();
    }
}
