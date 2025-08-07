import { BaseTutorial } from './base-tutorial.js';
import { initializeEvidenceTracker } from '../level5/evidence-tracker.js';
import '../level5/scoring-system.js';

export class Level5ForensicsTutorial extends BaseTutorial {
    constructor() {
        super('level5-forensics', 'Level 5: The Hunt for The Null', 'Learn digital forensics to catch The Null');
        this.evidenceFound = new Set();
        this.patternsIdentified = new Set();
        this.evidenceTracker = null;
        this.initializeSteps();
    }

    initializeSteps() {
        this.steps = [
            {
                title: "Welcome to Digital Forensics",
                content: "You are about to begin your final cybersecurity challenge: hunting down the elusive hacker known as 'The Null'. This investigation will test all the skills you've learned.",
                action: "Click 'Next' to start your investigation",
                validation: () => true,
                onComplete: () => {
                    // Initialize evidence tracker and start timer
                    this.evidenceTracker = initializeEvidenceTracker();
                    this.evidenceTracker.showTracker();
                    
                    // Start scoring timer
                    if (window.level5Scoring) {
                        window.level5Scoring.startTimer();
                    }
                    
                    console.log('Level 5 forensics investigation started');
                }
            },
            {
                title: "Understanding the Case",
                content: "The Null has been responsible for attacks across all previous levels. Your goal is to find evidence files, identify patterns, and expose their identity. You need to find at least 4 out of 5 evidence files to solve the case.",
                action: "Open the File Manager to begin evidence collection",
                validation: () => this.checkApplicationOpen('files'),
                onComplete: () => {
                    this.highlightEvidence();
                }
            },
            {
                title: "Navigate to Evidence Directory",
                content: "Navigate to the Evidence folder in the file manager. This contains all the digital forensics evidence collected from previous incidents.",
                action: "Click on the Evidence folder to open it",
                validation: () => this.checkCurrentPath('/home/trainee/Evidence'),
                onComplete: () => {
                    console.log('Evidence directory opened');
                }
            },
            {
                title: "Find Bot Network Evidence",
                content: "Look for evidence from Level 1 (the misinformation bot network). Search for files containing 'bot' or look for bot_logs.txt.",
                action: "Find and open bot_logs.txt",
                validation: () => this.checkFileOpened('bot_logs.txt'),
                onComplete: () => {
                    this.evidenceFound.add('bot_logs');
                    if (this.evidenceTracker) {
                        this.evidenceTracker.markEvidenceFound('bot_logs.txt');
                    }
                    this.updateProgress();
                }
            },
            {
                title: "Analyze Bot Network Evidence",
                content: "Excellent! You found the bot network logs. Notice the IP address 192.168.1.100 and the timestamp pattern. Look for any signatures or unusual patterns in the logs.",
                action: "Read the bot logs carefully and note the IP address",
                validation: () => true,
                onComplete: () => {
                    this.patternsIdentified.add('ip_address');
                    if (this.evidenceTracker) {
                        this.evidenceTracker.markPatternFound('ip_address_192.168.1.100');
                    }
                    this.showTutorialHint('IP Pattern Found', 'You discovered the recurring IP address: 192.168.1.100');
                }
            },
            {
                title: "Find Email Evidence",
                content: "Now search for evidence from Level 2 (the phishing campaign). Look for email-related files or email_headers.txt.",
                action: "Find and open email_headers.txt",
                validation: () => this.checkFileOpened('email_headers.txt'),
                onComplete: () => {
                    this.evidenceFound.add('email_headers');
                    if (this.evidenceTracker) {
                        this.evidenceTracker.markEvidenceFound('email_headers.txt');
                    }
                    this.updateProgress();
                }
            },
            {
                title: "Analyze Email Headers",
                content: "Perfect! Check the email headers for the same IP address and look for the X-Mailer field. Notice the custom signature in the headers.",
                action: "Look for 'NullSender' and the attacker signature 'N4LL'",
                validation: () => true,
                onComplete: () => {
                    this.patternsIdentified.add('null_signature');
                    if (this.evidenceTracker) {
                        this.evidenceTracker.markPatternFound('signature_n4ll');
                    }
                    this.showTutorialHint('Signature Found', 'You discovered The Null\'s signature: N4LL in various forms!');
                }
            },
            {
                title: "Find Malware Evidence",
                content: "Search for evidence from Level 3 (malware distribution). Look for code-related files or malware_code.txt.",
                action: "Find and open malware_code.txt",
                validation: () => this.checkFileOpened('malware_code.txt'),
                onComplete: () => {
                    this.evidenceFound.add('malware_code');
                    if (this.evidenceTracker) {
                        this.evidenceTracker.markEvidenceFound('malware_code.txt');
                    }
                    this.updateProgress();
                }
            },
            {
                title: "Analyze Malware Code",
                content: "Great work! Examine the malware source code. Look for the same IP address and the 'N4LL' signature in the code comments.",
                action: "Find the comment '// N4LL was here' in the code",
                validation: () => true,
                onComplete: () => {
                    this.showTutorialHint('Code Signature', 'The attacker left their signature directly in the malware code!');
                }
            },
            {
                title: "Find Login Evidence",
                content: "Now search for evidence from Level 4 (vulnerability exploitation). Look for login or access logs.",
                action: "Find and open login_logs.txt",
                validation: () => this.checkFileOpened('login_logs.txt'),
                onComplete: () => {
                    this.evidenceFound.add('login_logs');
                    if (this.evidenceTracker) {
                        this.evidenceTracker.markEvidenceFound('login_logs.txt');
                    }
                    this.updateProgress();
                }
            },
            {
                title: "Analyze Login Patterns",
                content: "Excellent! Review the failed login attempts and successful breach. Notice the consistent IP address and timing patterns.",
                action: "Observe the Tuesday 2:00 AM attack pattern",
                validation: () => true,
                onComplete: () => {
                    this.patternsIdentified.add('timing_pattern');
                    if (this.evidenceTracker) {
                        this.evidenceTracker.markPatternFound('timing_tuesday_2am');
                    }
                    this.showTutorialHint('Pattern Detected', 'All attacks happen on Tuesday at 2:00 AM!');
                }
            },
            {
                title: "Search for Hidden Evidence",
                content: "There's one more piece of evidence hidden in a secret location. Look for hidden files or directories. In the terminal, you can use 'ls -la' to show hidden items.",
                action: "Open the Terminal application",
                validation: () => this.checkApplicationOpen('terminal'),
                onComplete: () => {
                    this.showTerminalCommands();
                }
            },
            {
                title: "Use Terminal Commands",
                content: "Use the 'find' command to search for hidden files containing 'hidden' or 'message'. Try: find . -name '*hidden*'",
                action: "Run the find command to locate hidden files",
                validation: () => this.checkTerminalCommand('find'),
                onComplete: () => {
                    this.showTutorialHint('Hidden Files', 'Use ls -la to see hidden directories starting with a dot (.)');
                }
            },
            {
                title: "Navigate to Hidden Directory",
                content: "Go back to the file manager and navigate to the .hidden directory inside Evidence. You may need to enable 'Show Hidden Files' in the view options.",
                action: "Find and enter the .hidden directory",
                validation: () => this.checkCurrentPath('/home/trainee/Evidence/.hidden'),
                onComplete: () => {
                    console.log('Hidden directory found');
                }
            },
            {
                title: "Find the Final Message",
                content: "Open the hidden_message.txt file to find The Null's final confession and identity reveal.",
                action: "Open hidden_message.txt",
                validation: () => this.checkFileOpened('hidden_message.txt'),
                onComplete: () => {
                    this.evidenceFound.add('hidden_message');
                    if (this.evidenceTracker) {
                        this.evidenceTracker.markEvidenceFound('hidden_message.txt');
                    }
                    this.updateProgress();
                }
            },
            {
                title: "Case Solved!",
                content: `Congratulations! You've successfully identified The Null as Alex Thompson, a former IT intern seeking revenge. You found ${this.evidenceFound.size}/5 evidence files and identified key patterns:

✓ IP Address: 192.168.1.100 (consistent across all attacks)
✓ Signature: N4LL (in various forms)
✓ Timing: Tuesday 2:00 AM attacks
✓ Tools: Custom NullSender toolkit
✓ Motive: Revenge for job termination

You've mastered digital forensics and solved the ultimate cybersecurity mystery!`,
                action: "Complete the investigation",
                validation: () => true,
                onComplete: () => {
                    this.completeLevel5();
                }
            }
        ];
    }

    updateProgress() {
        const progressText = `Evidence Found: ${this.evidenceFound.size}/5 files`;
        this.showTutorialHint('Investigation Progress', progressText);
    }

    highlightEvidence() {
        // Highlight evidence directory in file manager
        const evidenceFolder = document.querySelector('[data-file-name="Evidence"]');
        if (evidenceFolder) {
            evidenceFolder.style.backgroundColor = '#fef3c7';
            evidenceFolder.style.border = '2px solid #f59e0b';
        }
    }

    showTerminalCommands() {
        this.showTutorialHint('Terminal Commands', 
            'Useful forensics commands:\n' +
            '• find . -name "*null*" (find files with null in name)\n' +
            '• grep "N4LL" *.txt (search for signature in files)\n' +
            '• ls -la (show hidden files)\n' +
            '• cat filename.txt (read file contents)'
        );
    }

    checkApplicationOpen(appName) {
        // Check if specific application is open
        const appWindow = document.querySelector(`[data-app="${appName}"]`);
        return appWindow && !appWindow.classList.contains('hidden');
    }

    checkCurrentPath(path) {
        // Check if file manager is showing specific path
        const pathElement = document.querySelector('.current-path, .file-path');
        return pathElement && pathElement.textContent.includes(path);
    }

    checkFileOpened(fileName) {
        // Check if a specific file is currently open/viewed
        const fileViewer = document.querySelector('.file-viewer, .file-content');
        return fileViewer && (
            fileViewer.textContent.includes(fileName) ||
            document.querySelector(`[data-file="${fileName}"]`)
        );
    }

    checkTerminalCommand(command) {
        // Check if user has run a terminal command
        const terminalOutput = document.querySelector('.terminal-output, .terminal-content');
        return terminalOutput && terminalOutput.textContent.includes(command);
    }

    completeLevel5() {
        // Save investigation results using scoring system
        const evidenceFileNames = Array.from(this.evidenceFound).map(key => {
            const mapping = {
                'bot_logs': 'bot_logs.txt',
                'email_headers': 'email_headers.txt',
                'malware_code': 'malware_code.txt',
                'login_logs': 'login_logs.txt',
                'hidden_message': 'hidden_message.txt'
            };
            return mapping[key];
        }).filter(Boolean);
        
        const patternNames = Array.from(this.patternsIdentified).map(key => {
            const mapping = {
                'ip_address': 'ip_address_192.168.1.100',
                'null_signature': 'signature_n4ll',
                'timing_pattern': 'timing_tuesday_2am'
            };
            return mapping[key];
        }).filter(Boolean);
        
        // Calculate and save score
        let level5Results = null;
        if (window.level5Scoring) {
            level5Results = window.level5Scoring.saveScore(evidenceFileNames, patternNames);
        }
        
        // Mark Level 5 as completed
        localStorage.setItem('cyberquest_level_5_completed', 'true');
        
        // Show completion summary with scoring
        const scoreData = level5Results ? level5Results.score : null;
        const totalXP = scoreData ? scoreData.totalScore : (500 + (this.evidenceFound.size * 100));
        
        this.showTutorialHint('Level 5 Complete!', 
            `🎉 Congratulations! You've mastered digital forensics and caught The Null!\n\n` +
            `Investigation Results:\n` +
            `• Evidence Collected: ${this.evidenceFound.size}/5\n` +
            `• Patterns Identified: ${this.patternsIdentified.size}/3\n` +
            `• Grade: ${scoreData ? scoreData.grade : 'B+'}\n` +
            `• XP Earned: ${totalXP}\n` +
            `• Badge: ${scoreData ? scoreData.badge.name : 'Digital Detective'}\n\n` +
            `You are now a certified Digital Forensics Investigator!`
        );

        // Trigger completion dialogue
        setTimeout(() => {
            this.triggerCompletionDialogue();
        }, 2000);
    }

    triggerCompletionDialogue() {
        // Import and start the Level 5 completion dialogue
        import('../dialogues/levels/level-five/level5-completion-dialogue.js')
            .then(module => {
                const Level5CompletionDialogue = module.Level5CompletionDialogue;
                const completionDialogue = new Level5CompletionDialogue(this.desktop);
                completionDialogue.start();
            })
            .catch(error => {
                console.error('Failed to load Level 5 completion dialogue:', error);
                // Fallback completion
                this.showTutorialHint('Investigation Complete!', 
                    `🎉 You've successfully completed The Hunt for The Null!\n\n` +
                    `Evidence Found: ${this.evidenceFound.size}/5\n` +
                    `The Null has been identified as Alex Thompson!`
                );
            });
    }

    getProgressSummary() {
        return {
            evidenceFound: Array.from(this.evidenceFound),
            patternsIdentified: Array.from(this.patternsIdentified),
            completionRate: (this.evidenceFound.size / 5) * 100,
            investigationScore: this.calculateInvestigationScore()
        };
    }

    calculateInvestigationScore() {
        const evidenceScore = this.evidenceFound.size * 20; // 20 points per evidence file
        const patternScore = this.patternsIdentified.size * 10; // 10 points per pattern
        return evidenceScore + patternScore;
    }

    // Static method for tutorial auto-start
    static shouldAutoStartLevel5Forensics() {
        const currentLevel = localStorage.getItem('cyberquest_current_level');
        const levelStarted = localStorage.getItem('cyberquest_level_5_started');
        const tutorialCompleted = localStorage.getItem('cyberquest_level5_forensics_tutorial_completed');
        
        return currentLevel === '5' && levelStarted === 'true' && !tutorialCompleted;
    }
}
