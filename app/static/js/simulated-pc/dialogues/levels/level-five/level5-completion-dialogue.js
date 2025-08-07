import { BaseDialogue } from '../base-dialogue.js';

export class Level5CompletionDialogue extends BaseDialogue {
    constructor(desktop, character = 'the-null') {
        super(desktop, character);
        this.level5Results = this.getLevel5Results();
        this.evidenceFound = this.level5Results ? this.level5Results.evidenceFound.length : 3;
        this.initializeMessages();
    }

    getLevel5Results() {
        try {
            const resultsData = localStorage.getItem('cyberquest_level5_results');
            return resultsData ? JSON.parse(resultsData) : null;
        } catch (error) {
            console.error('Failed to parse Level 5 results:', error);
            return null;
        }
    }

    initializeMessages() {
        if (this.evidenceFound >= 4) {
            this.messages = [
                {
                    text: "So... you found me. I have to admit, I'm impressed. Not many students could have followed my digital breadcrumbs so expertly.",
                    speaker: "The Null"
                },
                {
                    text: "My name is Dr. Clarice Kim. Students know me as 'Cipher.' I am your Cybersecurity Instructor here at CyberQuest Academy. But I am also O2ymandi4s - leader of The Null.",
                    speaker: "The Null"
                },
                {
                    text: "This wasn't just an examination. I've grown dissatisfied with the academy's direction. We've become complacent, teaching outdated methods while real threats evolve.",
                    speaker: "The Null"
                },
                {
                    text: "The Null represents my vision for cyberspace - a clean slate. Sometimes destruction is necessary for true progress. Every Tuesday at 2 AM, I executed my plan.",
                    speaker: "The Null"
                },
                {
                    text: "Bot networks, phishing campaigns, malware distribution, vulnerability exploitation... I orchestrated it all from my instructor workstation at 192.168.1.100.",
                    speaker: "The Null"
                },
                {
                    text: "But I left clues because I wanted someone capable to understand. To see what the academy has become - and what it could be if we started fresh.",
                    speaker: "The Null"
                },
                {
                    text: "You traced my signature 'N4LL' across every attack vector. You identified the patterns. But now you must decide - are you with the old ways, or the new?",
                    speaker: "The Null"
                },
                {
                    text: "Congratulations, student. You've uncovered the truth about O2ymandi4s and The Null. The question is - what will you do with this knowledge?",
                    speaker: "The Null"
                }
            ];
        } else if (this.evidenceFound >= 2) {
            this.messages = [
                {
                    text: "You found some of my traces, but not enough to understand the full scope of O2ymandi4s and The Null. This goes deeper than you realize, student.",
                    speaker: "The Null"
                },
                {
                    text: "You'll need more evidence than that to comprehend my vision for cyberspace. I've been planning this for years.",
                    speaker: "The Null"
                },
                {
                    text: "Better luck next time. Dr. Cipher expects more thorough investigation from her students...",
                    speaker: "The Null"
                }
            ];
        } else {
            this.messages = [
                {
                    text: "You think you can uncover the secrets of O2ymandi4s with such little evidence? You have barely scratched the surface, student.",
                    speaker: "The Null"
                },
                {
                    text: "I'm Dr. Clarice Kim - your instructor and leader of The Null. You'll need much better investigation skills to understand my vision.",
                    speaker: "The Null"
                },
                {
                    text: "You need to work on your forensics skills. The truth about The Null remains hidden from you.",
                    speaker: "The Null"
                }
            ];
        }
    }

    onComplete() {
        if (this.evidenceFound >= 4) {
            // Mark Level 5 as completed with high score
            localStorage.setItem('cyberquest_level_5_completed', 'true');
            localStorage.setItem('cyberquest_level_5_score', '100');
            
            // Award bonus XP for excellent detective work
            const currentXP = parseInt(localStorage.getItem('cyberquest_xp')) || 0;
            const bonusXP = 500 + (this.evidenceFound * 100);
            localStorage.setItem('cyberquest_xp', currentXP + bonusXP);
            
            // Award Digital Detective achievement
            this.awardAchievement('digital_detective', 'Digital Detective', 
                'Successfully identified The Null through digital forensics investigation');
            
            console.log(`Level 5 completed successfully! Evidence found: ${this.evidenceFound}/5, XP earned: ${bonusXP}`);
        } else if (this.evidenceFound >= 2) {
            // Partial completion
            localStorage.setItem('cyberquest_level_5_completed', 'true');
            localStorage.setItem('cyberquest_level_5_score', '70');
            
            const currentXP = parseInt(localStorage.getItem('cyberquest_xp')) || 0;
            const partialXP = 300;
            localStorage.setItem('cyberquest_xp', currentXP + partialXP);
            
            console.log(`Level 5 partially completed. Evidence found: ${this.evidenceFound}/5, XP earned: ${partialXP}`);
        } else {
            // Failed to find enough evidence
            localStorage.setItem('cyberquest_level_5_score', '40');
            console.log(`Level 5 investigation incomplete. Evidence found: ${this.evidenceFound}/5`);
        }

        // Show completion summary
        this.showCompletionSummary();
    }

    awardAchievement(id, name, description) {
        const achievements = JSON.parse(localStorage.getItem('cyberquest_achievements')) || [];
        const existing = achievements.find(a => a.id === id);
        
        if (!existing) {
            achievements.push({
                id: id,
                name: name,
                description: description,
                earned: new Date().toISOString(),
                level: 5,
                category: 'Investigation'
            });
            localStorage.setItem('cyberquest_achievements', JSON.stringify(achievements));
        }
    }

    showCompletionSummary() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/75 flex items-center justify-center z-50';
        
        let summaryContent = '';
        let statusColor = '';
        let statusIcon = '';
        
        // Use Level 5 results if available
        const scoreData = this.level5Results ? this.level5Results.score : null;
        const statusData = this.level5Results ? this.level5Results.status : null;
        
        if (this.evidenceFound >= 4) {
            statusColor = 'text-green-500';
            statusIcon = '🎉';
            summaryContent = `
                <h2 class="text-2xl font-bold text-green-500 mb-4">${statusIcon} Case Solved!</h2>
                <p class="text-gray-700 dark:text-gray-300 mb-4">
                    Outstanding detective work! You successfully identified The Null as Alex Thompson through comprehensive digital forensics investigation.
                </p>
                <div class="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded p-4 mb-4">
                    <h3 class="font-bold text-green-800 dark:text-green-400 mb-2">Investigation Results:</h3>
                    <ul class="text-sm text-green-700 dark:text-green-300 space-y-1">
                        <li>✓ Evidence Collected: ${this.evidenceFound}/5 files</li>
                        <li>✓ Final Score: ${scoreData ? scoreData.totalScore : 'N/A'} XP</li>
                        <li>✓ Grade: ${scoreData ? scoreData.grade : 'A'}</li>
                        <li>✓ Badge Earned: ${scoreData ? scoreData.badge.name : 'Digital Detective'}</li>
                        <li>✓ Perpetrator Identity: Dr. Clarice "Cipher" Kim / O2ymandi4s</li>
                        <li>✓ Motive: Revenge against academy's direction</li>
                    </ul>
                </div>
            `;
        } else if (this.evidenceFound >= 2) {
            statusColor = 'text-yellow-500';
            statusIcon = '⚠️';
            summaryContent = `
                <h2 class="text-2xl font-bold text-yellow-500 mb-4">${statusIcon} Partial Success</h2>
                <p class="text-gray-700 dark:text-gray-300 mb-4">
                    You found some evidence but not enough for a complete case. The Null remains partially identified.
                </p>
                <div class="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded p-4 mb-4">
                    <h3 class="font-bold text-yellow-800 dark:text-yellow-400 mb-2">Investigation Results:</h3>
                    <ul class="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                        <li>⚠ Evidence Collected: ${this.evidenceFound}/5 files</li>
                        <li>⚠ Final Score: ${scoreData ? scoreData.totalScore : 'N/A'} XP</li>
                        <li>⚠ Grade: ${scoreData ? scoreData.grade : 'B-'}</li>
                        <li>⚠ Some patterns identified</li>
                        <li>⚠ Incomplete case profile</li>
                    </ul>
                </div>
            `;
        } else {
            statusColor = 'text-red-500';
            statusIcon = '❌';
            summaryContent = `
                <h2 class="text-2xl font-bold text-red-500 mb-4">${statusIcon} Investigation Failed</h2>
                <p class="text-gray-700 dark:text-gray-300 mb-4">
                    Insufficient evidence collected. The Null has escaped detection and remains at large.
                </p>
                <div class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded p-4 mb-4">
                    <h3 class="font-bold text-red-800 dark:text-red-400 mb-2">Investigation Results:</h3>
                    <ul class="text-sm text-red-700 dark:text-red-300 space-y-1">
                        <li>❌ Evidence Collected: ${this.evidenceFound}/5 files</li>
                        <li>❌ Final Score: ${scoreData ? scoreData.totalScore : 'N/A'} XP</li>
                        <li>❌ Grade: ${scoreData ? scoreData.grade : 'C'}</li>
                        <li>❌ Patterns not identified</li>
                        <li>❌ Case remains unsolved</li>
                    </ul>
                </div>
            `;
        }

        modal.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4">
                <div class="text-center">
                    ${summaryContent}
                    <div class="flex space-x-3 justify-center">
                        ${this.evidenceFound < 4 ? `
                        <button onclick="this.closest('.fixed').remove(); window.location.reload();" 
                                class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                            Retry Investigation
                        </button>
                        ` : ''}
                        <button onclick="this.closest('.fixed').remove(); window.location.href='/levels';" 
                                class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors">
                            Return to Levels
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    getFinalButtonText() {
        if (this.evidenceFound >= 4) {
            return 'Close Case ✓';
        } else if (this.evidenceFound >= 2) {
            return 'End Investigation';
        } else {
            return 'Case Dismissed';
        }
    }

    static shouldAutoStart() {
        // Auto-start when Level 5 tutorial is completed
        const tutorialCompleted = localStorage.getItem('cyberquest_level5_forensics_tutorial_completed');
        const levelStarted = localStorage.getItem('cyberquest_level_5_started');
        return tutorialCompleted === 'true' && levelStarted === 'true';
    }
}
