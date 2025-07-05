import { BaseDialogue } from '../../base-dialogue.js';

export class RansomwareDecryptionIntroDialogue extends BaseDialogue {
    constructor(desktop, character = 'instructor') {
        super(desktop, character);
        this.messages = [
            { text: 'Excellent work! You\'ve successfully quarantined and removed all detected malware threats from the infected systems.' },
            { text: 'However, we\'ve discovered that some critical tournament files were encrypted by the ransomware before it was contained. The gaming championship data needs to be recovered immediately.' },
            { text: 'Final challenge: Use the Ransomware Decryptor tool to restore the encrypted files and complete the malware cleanup operation.' },
            { text: 'This specialized tool can decrypt files that were locked by the Gaming Optimizer Pro ransomware. Time is critical - the tournament must resume within the hour!' }
        ];
    }

    getCharacterName() {
        // Force return the instructor name if dialogue manager isn't working
        if (this.desktop?.dialogueManager) {
            const name = this.desktop.dialogueManager.getCharacterName(this.character);
            console.log(`[RansomwareDecryptionIntro] Character: ${this.character}, Name: ${name}`);
            return name;
        }
        
        // Fallback to hardcoded instructor name
        console.warn('[RansomwareDecryptionIntro] Dialogue manager not available, using fallback');
        return 'Dr. Cipher';
    }

    onComplete() {
        // Mark final level-three stage started
        localStorage.setItem('cyberquest_level_3_decryption_started', 'true');

        // Launch the ransomware decryptor app using application launcher
        if (window.applicationLauncher) {
            setTimeout(async () => {
                await window.applicationLauncher.launchForLevel(3, 'ransomware-decryptor', 'Ransomware Decryptor');
            }, 500);
        }
    }

    getFinalButtonText() {
        return 'Launch Decryptor';
    }

    static shouldAutoStart() {
        // don't auto–start; only invoked manually after malware cleanup
        return false;
    }
}
