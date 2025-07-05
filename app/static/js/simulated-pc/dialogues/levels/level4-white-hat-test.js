import { BaseDialogue } from '../base-dialogue.js';

export class Level4WhiteHatTestDialogue extends BaseDialogue {
    constructor(desktop, character = 'instructor') {
        super(desktop, character);
        this.messages = [
            {
                text: "Welcome to Level 4: The White Hat Test. In this critical scenario, you'll face real-world ethical challenges that define the boundary between legitimate security research and malicious activities."
            },
            {
                text: "The CyberQuest Academy has been contracted to perform a security audit on SecureVote Pro, an online voting system used by municipalities. Your mission: conduct ethical penetration testing to identify vulnerabilities before they can be exploited."
            },
            {
                text: "During your audit, you'll discover a critical vulnerability that could allow vote manipulation. However, you'll face an unexpected ethical dilemma when an anonymous group contacts you with a cryptocurrency offer to leak the vulnerability instead of reporting it properly."
            },
            {
                text: "This level tests your commitment to ethical hacking principles: responsible disclosure, professional integrity, and protecting democratic processes. You'll need to document your findings, navigate the pressure to profit from vulnerabilities, and demonstrate proper security researcher conduct."
            },
            {
                text: "Your decisions will have consequences that extend beyond cybersecurity - they could impact public trust in democratic institutions. Use the Terminal and other security tools to conduct your audit while maintaining the highest ethical standards."
            },
            {
                text: "Successfully completing this level requires both technical expertise and unwavering ethical judgment. You'll earn 350 XP in Ethical Hacking and unlock the 'White Hat Guardian' badge. The integrity of democratic systems depends on security professionals like you!"
            }
        ];
    }

    onComplete() {
        localStorage.setItem('cyberquest_level_4_started', 'true');
        
        // Open the Terminal application for ethical hacking tools
        if (window.applicationLauncher) {
            setTimeout(async () => {
                await window.applicationLauncher.launchForLevel(4, 'terminal', 'Terminal');
            }, 500);
        }
    }

    getFinalButtonText() {
        return 'Start Simulation';
    }

    static shouldAutoStart(levelId) {
        const currentLevel = localStorage.getItem('cyberquest_current_level');
        const levelStarted = localStorage.getItem(`cyberquest_level_${levelId}_started`);
        return currentLevel === '4' && !levelStarted;
    }

    static markLevelStarted(levelId) {
        localStorage.setItem(`cyberquest_level_${levelId}_started`, 'true');
    }

    static isCompleted() {
        return localStorage.getItem('cyberquest_level_4_completed') === 'true';
    }
}
