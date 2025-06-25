export class DialogueIntegration {
    constructor(desktop) {
        this.desktop = desktop;
        this.dialogueManager = desktop.dialogueManager;
    }

    // Initialize dialogue flow on desktop startup
    async initializeDialogueFlow() {
        // Check and start appropriate dialogues in sequence
        if (await this.dialogueManager.shouldAutoStartWelcome()) {
            await this.dialogueManager.startWelcomeDialogue();
        } else if (await this.dialogueManager.shouldAutoStartTutorialIntro()) {
            await this.dialogueManager.startTutorialIntroDialogue();
        } else if (await this.dialogueManager.shouldAutoStartMissionBriefing()) {
            await this.dialogueManager.startMissionBriefingDialogue();
        }
    }

    // Trigger mission briefing when all tutorials are completed
    async checkMissionBriefingTrigger() {
        const allTutorialsCompleted = [
            'cyberquest_tutorial_completed',
            'cyberquest_email_tutorial_completed', 
            'cyberquest_browser_tutorial_completed',
            'cyberquest_filemanager_tutorial_completed',
            'cyberquest_networkmonitor_tutorial_completed',
            'cyberquest_securitytools_tutorial_completed',
            'cyberquest_systemlogs_tutorial_completed',
            'cyberquest_terminal_tutorial_completed'
        ].every(key => localStorage.getItem(key));

        if (allTutorialsCompleted && await this.dialogueManager.shouldAutoStartMissionBriefing()) {
            setTimeout(async () => {
                await this.dialogueManager.startMissionBriefingDialogue();
            }, 1000);
        }
    }

    // Trigger dialogues based on specific events
    async onApplicationOpened(appName) {
        switch(appName) {
            case 'email':
                // Could trigger specific email-related dialogues
                break;
            case 'security':
                // Could trigger security tools introduction
                break;
            case 'logs':
                // Could trigger incident response dialogue
                break;
        }
    }

    // Trigger dialogues based on tutorial completion
    async onTutorialCompleted(tutorialName) {
        await this.checkMissionBriefingTrigger();
        
        // Specific tutorial completion dialogues
        switch(tutorialName) {
            case 'initial':
                // First tutorial completed - could show progress dialogue
                break;
            case 'email':
                // Email tutorial completed - could show next step guidance
                break;
        }
    }

    // Manual dialogue triggers for specific scenarios
    async triggerEmergencyBriefing() {
        await this.dialogueManager.startDialogueByName('mission-briefing', 'commander');
    }

    async triggerWelcomeBack() {
        await this.dialogueManager.startDialogueByName('welcome', 'agent');
    }

    async triggerTrainingReminder() {
        await this.dialogueManager.startDialogueByName('tutorial-intro', 'instructor');
    }
}