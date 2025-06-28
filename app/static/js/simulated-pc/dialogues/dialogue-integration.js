export class DialogueIntegration {
    constructor(desktop) {
        this.desktop = desktop;
        this.dialogueManager = desktop.dialogueManager;
    }

    // Initialize dialogue flow on desktop startup
    async initializeDialogueFlow() {
        // Only check for welcome dialogue
        if (await this.dialogueManager.shouldAutoStartWelcome()) {
            await this.dialogueManager.startWelcomeDialogue();
        }
    }

    // Trigger welcome dialogue
    async triggerWelcomeBack() {
        await this.dialogueManager.startDialogueByName('welcome', 'agent');
    }

    // Reset dialogue completion flags in localStorage
    restartDialogues() {
        localStorage.removeItem('cyberquest_welcome_dialogue_completed');
        return 'Welcome dialogue has been reset. Refresh the page to see it again.';
    }
}