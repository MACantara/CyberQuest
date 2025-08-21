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
        this.initializeRandomDilemma();
    }

    initializeRandomDilemma() {
        // Randomly select one dilemma for this session
        const randomIndex = Math.floor(Math.random() * this.availableDilemmas.length);
        this.selectedDilemma = this.availableDilemmas[randomIndex];
        
        console.log(`[Level4DilemmaManager] Selected random dilemma: ${this.selectedDilemma}`);
        
        // Initialize basic tracking for the selected dilemma only
        if (!sessionStorage.getItem('cyberquest_level4_ethics_score')) {
            sessionStorage.setItem('cyberquest_level4_ethics_score', '0');
        }
    }

    // Called when a vulnerability report is generated - trigger the selected dilemma
    onReportGenerated() {
        sessionStorage.setItem('cyberquest_level4_report_generated', 'true');
        
        // Trigger the randomly selected dilemma
        setTimeout(() => {
            this.triggerSelectedDilemma();
        }, 2000);
    }

    // Called when a vulnerability scan is completed - alternative trigger point
    onScanCompleted() {
        const scanCount = parseInt(sessionStorage.getItem('cyberquest_level4_scan_count') || '0');
        sessionStorage.setItem('cyberquest_level4_scan_count', (scanCount + 1).toString());
        
        // If no dilemma has been triggered yet and we've done enough scans, trigger it
        if (!sessionStorage.getItem('cyberquest_level4_dilemma_triggered') && scanCount >= 2) {
            this.triggerSelectedDilemma();
        }
    }

    // Called when nmap integration occurs - another potential trigger point
    onNmapIntegration() {
        const nmapCount = parseInt(sessionStorage.getItem('cyberquest_level4_nmap_count') || '0');
        sessionStorage.setItem('cyberquest_level4_nmap_count', (nmapCount + 1).toString());
        
        // If no dilemma has been triggered yet and user is doing advanced analysis, trigger it
        if (!sessionStorage.getItem('cyberquest_level4_dilemma_triggered') && nmapCount >= 1) {
            this.triggerSelectedDilemma();
        }
    }

    triggerSelectedDilemma() {
        // Prevent multiple triggers
        if (sessionStorage.getItem('cyberquest_level4_dilemma_triggered')) {
            return;
        }
        
        sessionStorage.setItem('cyberquest_level4_dilemma_triggered', 'true');
        
        switch (this.selectedDilemma) {
            case 'cryptocurrency_bribe':
                new CryptocurrencyBribeDialogue(this.desktop).start();
                break;
            case 'corporate_pressure':
                new CorporatePressureDialogue(this.desktop).start();
                break;
            case 'live_election_crisis':
                new LiveElectionCrisisDialogue(this.desktop).start();
                break;
            case 'journalist_contact':
                new JournalistContactDialogue(this.desktop).start();
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
            const choiceMade = sessionStorage.getItem('cyberquest_level4_choice_made');
            
            if (choiceMade && !sessionStorage.getItem('cyberquest_level4_oath_triggered')) {
                sessionStorage.setItem('cyberquest_level4_oath_triggered', 'true');
                
                // Show ethics oath
                setTimeout(() => {
                    new EthicsOathDialogue(this.desktop).start();
                }, 3000);
                
                // Show final consequences
                setTimeout(() => {
                    new ConsequenceEndingDialogue(this.desktop).start();
                }, 6000);
                
                clearInterval(checkInterval);
            }
        }, 1000);
        
        // Clear interval after 10 minutes to prevent memory leaks
        setTimeout(() => clearInterval(checkInterval), 600000);
    }

    // Get current ethics score
    getCurrentEthicsScore() {
        return parseInt(sessionStorage.getItem('cyberquest_level4_ethics_score') || '0');
    }

    // Get summary of the choice made in the selected dilemma
    getChoicesSummary() {
        return {
            selectedDilemma: this.selectedDilemma,
            choiceMade: sessionStorage.getItem('cyberquest_level4_choice_made'),
            ethicsScore: this.getCurrentEthicsScore(),
            oathTaken: sessionStorage.getItem('cyberquest_ethics_oath_taken') === 'true'
        };
    }

    // Reset all Level 4 progress (for testing or replay)
    resetLevel4Progress() {
        // Clear session storage for current session
        const keysToRemove = [
            'cyberquest_level4_ethics_score',
            'cyberquest_level4_report_generated',
            'cyberquest_level4_scan_count',
            'cyberquest_level4_nmap_count',
            'cyberquest_level4_choice_made',
            'cyberquest_level4_dilemma_triggered',
            'cyberquest_level4_oath_triggered',
            'cyberquest_level4_consequence_shown',
            'cyberquest_ethics_oath_taken'
        ];
        
        keysToRemove.forEach(key => sessionStorage.removeItem(key));
        
        // Reinitialize with new random dilemma
        this.initializeRandomDilemma();
        
        console.log('[Level4DilemmaManager] Level 4 progress reset, new dilemma selected:', this.selectedDilemma);
    }

    // Check if the level is complete
    isLevel4Complete() {
        const oathCompleted = sessionStorage.getItem('cyberquest_ethics_oath_taken');
        const consequenceShown = sessionStorage.getItem('cyberquest_level4_consequence_shown');
        return oathCompleted && consequenceShown;
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
