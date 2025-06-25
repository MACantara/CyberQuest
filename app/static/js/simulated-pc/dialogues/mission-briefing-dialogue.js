import { BaseDialogue } from '../base-dialogue.js';

export class MissionBriefingDialogue extends BaseDialogue {
    constructor(desktop, character = 'commander') {
        super(desktop, character);
        this.messages = [
            {
                text: "Agent, we have a critical situation. Our intelligence indicates a sophisticated cyber attack is underway."
            },
            {
                text: "Multiple organizations have reported suspicious email activity, network intrusions, and potential data breaches."
            },
            {
                text: "Your mission: Investigate these incidents, identify the attack vectors, and neutralize the threats before they cause further damage."
            },
            {
                text: "You'll have access to various cybersecurity tools including email analysis, network monitoring, file scanners, and system logs."
            },
            {
                text: "Remember your training: Look for patterns, trust your instincts, and document everything. The safety of our digital infrastructure depends on you."
            },
            {
                text: "Time is critical, Agent. The attackers are counting on us being slow to respond. Prove them wrong."
            }
        ];
    }

    onComplete() {
        // Store completion in localStorage
        localStorage.setItem('cyberquest_mission_briefing_completed', 'true');
        
        // Could trigger specific mission start or return to desktop
        console.log('Mission briefing completed - Agent ready for deployment');
    }

    getFinalButtonText() {
        return 'Accept Mission';
    }

    // Static methods
    static shouldAutoStart() {
        return !localStorage.getItem('cyberquest_mission_briefing_completed');
    }

    static restart() {
        localStorage.removeItem('cyberquest_mission_briefing_completed');
    }
}