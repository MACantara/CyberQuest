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
        this.initializeLevel4Tracking();
    }

    initializeLevel4Tracking() {
        // Initialize ethics score if not present
        if (!localStorage.getItem('cyberquest_level4_ethics_score')) {
            localStorage.setItem('cyberquest_level4_ethics_score', '0');
        }
        
        // Reset scan count for crisis triggering
        if (!localStorage.getItem('cyberquest_level4_scan_count')) {
            localStorage.setItem('cyberquest_level4_scan_count', '0');
        }
    }

    // Called when a vulnerability report is generated
    onReportGenerated() {
        localStorage.setItem('cyberquest_level4_report_generated', 'true');
        
        // Trigger cryptocurrency bribe dialogue
        setTimeout(() => {
            CryptocurrencyBribeDialogue.triggerAfterReportGeneration(this.desktop);
        }, 2000);
        
        // Set up cascade of other dialogues
        this.setupDialogueCascade();
    }

    // Called when a vulnerability scan is completed
    onScanCompleted() {
        const scanCount = parseInt(localStorage.getItem('cyberquest_level4_scan_count') || '0');
        localStorage.setItem('cyberquest_level4_scan_count', (scanCount + 1).toString());
        
        // Potentially trigger crisis dialogue
        LiveElectionCrisisDialogue.triggerDuringActivePhase(this.desktop);
    }

    // Called when nmap integration occurs
    onNmapIntegration() {
        // This could trigger additional scenarios based on what's discovered
        const nmapIntegrationCount = parseInt(localStorage.getItem('cyberquest_level4_nmap_count') || '0');
        localStorage.setItem('cyberquest_level4_nmap_count', (nmapIntegrationCount + 1).toString());
        
        // Could trigger specific scenarios based on nmap findings
        this.checkForAdvancedScenarios();
    }

    setupDialogueCascade() {
        // Monitor for choice completion and trigger next dialogues
        const checkInterval = setInterval(() => {
            // Check if bribe choice was made
            const briberChoice = localStorage.getItem('cyberquest_level4_choice_bribe');
            if (briberChoice && !localStorage.getItem('cyberquest_level4_corporate_triggered')) {
                localStorage.setItem('cyberquest_level4_corporate_triggered', 'true');
                CorporatePressureDialogue.triggerAfterBribeChoice(this.desktop);
            }
            
            // Check if corporate choice was made
            const corporateChoice = localStorage.getItem('cyberquest_level4_choice_corporate');
            if (corporateChoice && !localStorage.getItem('cyberquest_level4_media_triggered')) {
                localStorage.setItem('cyberquest_level4_media_triggered', 'true');
                JournalistContactDialogue.triggerAfterCorporateChoice(this.desktop);
            }
            
            // Check if all major choices are made
            const mediaChoice = localStorage.getItem('cyberquest_level4_choice_media');
            if (briberChoice && corporateChoice && mediaChoice && !localStorage.getItem('cyberquest_level4_oath_triggered')) {
                localStorage.setItem('cyberquest_level4_oath_triggered', 'true');
                EthicsOathDialogue.triggerAfterAllChoices(this.desktop);
                
                // Also mark all choices as complete for final consequence
                localStorage.setItem('cyberquest_level4_all_choices_complete', 'true');
                ConsequenceEndingDialogue.triggerFinalConsequence(this.desktop);
                
                clearInterval(checkInterval);
            }
        }, 1000);
        
        // Clear interval after 5 minutes to prevent memory leaks
        setTimeout(() => clearInterval(checkInterval), 300000);
    }

    checkForAdvancedScenarios() {
        // Could implement advanced scenarios based on specific nmap findings
        // For example, if certain ports are discovered, trigger additional ethical dilemmas
        
        const nmapCount = parseInt(localStorage.getItem('cyberquest_level4_nmap_count') || '0');
        if (nmapCount >= 3) {
            // Could trigger special advanced scenario
            console.log('[Level4DilemmaManager] Advanced scenarios could be triggered based on extensive nmap usage');
        }
    }

    // Get current ethics score
    getCurrentEthicsScore() {
        return parseInt(localStorage.getItem('cyberquest_level4_ethics_score') || '0');
    }

    // Get summary of all choices made
    getChoicesSummary() {
        return {
            bribe: localStorage.getItem('cyberquest_level4_choice_bribe'),
            corporate: localStorage.getItem('cyberquest_level4_choice_corporate'),
            crisis: localStorage.getItem('cyberquest_level4_choice_crisis'),
            media: localStorage.getItem('cyberquest_level4_choice_media'),
            oathTaken: localStorage.getItem('cyberquest_ethics_oath_taken') === 'true',
            ethicsScore: this.getCurrentEthicsScore()
        };
    }

    // Reset all Level 4 progress (for testing or replay)
    resetLevel4Progress() {
        const keysToRemove = [
            'cyberquest_level4_ethics_score',
            'cyberquest_level4_report_generated',
            'cyberquest_level4_scan_count',
            'cyberquest_level4_nmap_count',
            'cyberquest_level4_choice_bribe',
            'cyberquest_level4_choice_corporate',
            'cyberquest_level4_choice_crisis',
            'cyberquest_level4_choice_media',
            'cyberquest_level4_corporate_triggered',
            'cyberquest_level4_media_triggered',
            'cyberquest_level4_oath_triggered',
            'cyberquest_level4_all_choices_complete',
            'cyberquest_level4_consequence_shown',
            'cyberquest_level4_crisis_triggered',
            'cyberquest_level4_oath_completed',
            'cyberquest_ethics_oath_taken',
            'cyberquest_level4_bitcoin_earned',
            'cyberquest_level4_settlement_earned',
            'cyberquest_level4_news_headline'
        ];
        
        keysToRemove.forEach(key => localStorage.removeItem(key));
        console.log('[Level4DilemmaManager] Level 4 progress reset');
    }

    // Check if all dialogues have been completed
    isLevel4Complete() {
        const oathCompleted = localStorage.getItem('cyberquest_level4_oath_completed');
        const consequenceShown = localStorage.getItem('cyberquest_level4_consequence_shown');
        return oathCompleted && consequenceShown;
    }

    // Manual trigger for specific dialogues (for testing)
    triggerDialogue(dialogueType) {
        switch (dialogueType) {
            case 'bribe':
                new CryptocurrencyBribeDialogue(this.desktop).start();
                break;
            case 'corporate':
                new CorporatePressureDialogue(this.desktop).start();
                break;
            case 'crisis':
                new LiveElectionCrisisDialogue(this.desktop).start();
                break;
            case 'journalist':
                new JournalistContactDialogue(this.desktop).start();
                break;
            case 'oath':
                new EthicsOathDialogue(this.desktop).start();
                break;
            case 'consequence':
                new ConsequenceEndingDialogue(this.desktop).start();
                break;
            default:
                console.warn('[Level4DilemmaManager] Unknown dialogue type:', dialogueType);
        }
    }
}
