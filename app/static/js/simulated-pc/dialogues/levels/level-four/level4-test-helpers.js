/**
 * Level 4 Ethical Dilemma Integration Helper
    // Show current ethics score
    getEthicsScore() {
        const app = this.getVulnApp();
        if (app && app.level4DilemmaManager) {
            return app.level4DilemmaManager.getCurrentEthicsScore();
        }
        return 0;
    }

    // Show all Level 4 data (now mostly in memory)
    getLevel4Data() {
        const app = this.getVulnApp();
        if (app && app.level4DilemmaManager) {
            return app.level4DilemmaManager.getChoicesSummary();
        }
        
        // Fallback to localStorage for persistent data
        const keys = Object.keys(localStorage).filter(key => 
            key.includes('ethics_oath') || 
            key.includes('badge_ethics') ||
            key.includes('level_4_completed')
        );
        const data = {};
        keys.forEach(key => {
            data[key] = localStorage.getItem(key);
        });
        return data;
    }sy access to Level 4 features for testing and debugging
 */

// Global helper functions for Level 4 testing
window.Level4TestHelpers = {
    // Get the vulnerability scanner app instance
    getVulnApp() {
        return document.querySelector('#vulnerability-scanner-container')?._vulnerabilityApp;
    },

    // Trigger specific ethical dilemmas
    triggerDilemma(type) {
        const app = this.getVulnApp();
        if (app) {
            app.triggerLevel4Dilemma(type);
        } else {
            console.warn('Vulnerability scanner app not found or Level 4 not active');
        }
    },

    // Quick access to specific dialogues
    triggerBribe() { this.triggerDilemma('bribe'); },
    triggerCorporate() { this.triggerDilemma('corporate'); },
    triggerCrisis() { this.triggerDilemma('crisis'); },
    triggerJournalist() { this.triggerDilemma('journalist'); },
    triggerOath() { this.triggerDilemma('oath'); },
    triggerConsequence() { this.triggerDilemma('consequence'); },

    // Progress management
    getProgress() {
        const app = this.getVulnApp();
        return app ? app.getLevel4Progress() : { error: 'App not found' };
    },

    resetProgress() {
        const app = this.getVulnApp();
        if (app && app.level4DilemmaManager) {
            app.level4DilemmaManager.resetLevel4Progress();
            console.log('Level 4 progress reset - new random dilemma selected');
        } else {
            console.warn('Vulnerability scanner app not found');
        }
    },

    // Force Level 4 mode (for testing outside normal level progression)
    enableLevel4Mode() {
        localStorage.setItem('cyberquest_level_4_started', 'true');
        localStorage.removeItem('cyberquest_level_4_completed');
        console.log('Level 4 mode enabled. Refresh the vulnerability scanner to activate.');
    },

    // Show current ethics score
    getEthicsScore() {
        return parseInt(localStorage.getItem('cyberquest_level4_ethics_score') || '0');
    },

    // Show all Level 4 localStorage data
    getLevel4Data() {
        const keys = Object.keys(localStorage).filter(key => key.includes('level4') || key.includes('ethics_oath'));
        const data = {};
        keys.forEach(key => {
            data[key] = localStorage.getItem(key);
        });
        return data;
    },

    // Simulate report generation trigger
    simulateReportGeneration() {
        const app = this.getVulnApp();
        if (app && app.level4DilemmaManager) {
            app.level4DilemmaManager.onReportGenerated();
            console.log('Report generation trigger simulated');
        } else {
            console.warn('Level 4 dilemma manager not active');
        }
    },

    // Simulate scan completion trigger
    simulateScanCompletion() {
        const app = this.getVulnApp();
        if (app && app.level4DilemmaManager) {
            app.level4DilemmaManager.onScanCompleted();
            console.log('Scan completion trigger simulated');
        } else {
            console.warn('Level 4 dilemma manager not active');
        }
    },

    // Print help information
    help() {
        console.log(`
Level 4 Ethical Dilemma Test Helpers:

Basic Usage:
- Level4TestHelpers.triggerBribe()         // Trigger cryptocurrency bribe
- Level4TestHelpers.triggerCorporate()     // Trigger corporate pressure
- Level4TestHelpers.triggerCrisis()        // Trigger election crisis
- Level4TestHelpers.triggerJournalist()    // Trigger journalist contact
- Level4TestHelpers.triggerOath()          // Trigger ethics oath
- Level4TestHelpers.triggerConsequence()   // Trigger consequence ending

Progress Management:
- Level4TestHelpers.getProgress()          // Get current progress
- Level4TestHelpers.resetProgress()        // Reset all progress
- Level4TestHelpers.getEthicsScore()       // Get current ethics score
- Level4TestHelpers.getLevel4Data()        // Get all Level 4 data

Testing:
- Level4TestHelpers.enableLevel4Mode()     // Force enable Level 4
- Level4TestHelpers.simulateReportGeneration()  // Trigger report event
- Level4TestHelpers.simulateScanCompletion()    // Trigger scan event

For detailed information, see: docs/LEVEL4_ETHICAL_DILEMMAS.md
        `);
    }
};

// Auto-display help on load if in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('Level 4 Ethical Dilemma System Loaded. Type Level4TestHelpers.help() for testing commands.');
}
