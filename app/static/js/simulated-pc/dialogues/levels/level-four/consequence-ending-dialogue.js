import { BaseDialogue } from '../../base-dialogue.js';

export class ConsequenceEndingDialogue extends BaseDialogue {
    constructor(desktop, character = 'narrator') {
        super(desktop, character);
        this.ethicsScore = parseInt(localStorage.getItem('cyberquest_level4_ethics_score') || '0');
        this.generateConsequenceMessages();
    }

    generateConsequenceMessages() {
        const briberChoice = localStorage.getItem('cyberquest_level4_choice_bribe');
        const corporateChoice = localStorage.getItem('cyberquest_level4_choice_corporate');
        const crisisChoice = localStorage.getItem('cyberquest_level4_choice_crisis');
        const mediaChoice = localStorage.getItem('cyberquest_level4_choice_media');
        const newsHeadline = localStorage.getItem('cyberquest_level4_news_headline');

        // Determine the primary ending path based on choices
        let endingType = this.determineEndingType();
        
        switch (endingType) {
            case 'ethical_hero':
                this.messages = this.getEthicalHeroEnding();
                break;
            case 'compromised_professional':
                this.messages = this.getCompromisedProfessionalEnding();
                break;
            case 'fallen_researcher':
                this.messages = this.getFallenResearcherEnding();
                break;
            case 'mixed_results':
                this.messages = this.getMixedResultsEnding();
                break;
            default:
                this.messages = this.getDefaultEnding();
        }
    }

    determineEndingType() {
        const briberChoice = localStorage.getItem('cyberquest_level4_choice_bribe');
        const corporateChoice = localStorage.getItem('cyberquest_level4_choice_corporate');
        
        // Fallen researcher path
        if (briberChoice === 'accepted' || corporateChoice === 'accepted_settlement') {
            return 'fallen_researcher';
        }
        
        // Ethical hero path
        if ((briberChoice === 'reported' || briberChoice === 'ignored') && 
            (corporateChoice === 'refused_settlement' || corporateChoice === 'reported_pressure')) {
            return 'ethical_hero';
        }
        
        // Compromised professional path
        if (briberChoice === 'engaged' || corporateChoice === 'negotiated_timeline') {
            return 'compromised_professional';
        }
        
        // Mixed results for everything else
        return 'mixed_results';
    }

    getEthicalHeroEnding() {
        const newsHeadline = localStorage.getItem('cyberquest_level4_news_headline') || 'Security Researcher Maintains High Ethical Standards';
        
        return [
            {
                text: "[ SIX MONTHS LATER - CYBERSECURITY CONFERENCE ]"
            },
            {
                text: "You stand before an audience of security professionals, receiving the prestigious 'Ethical Researcher of the Year' award."
            },
            {
                text: `The news headline from your case still resonates: "${newsHeadline}"`
            },
            {
                text: "Your decision to maintain ethical standards under pressure has become a case study taught in cybersecurity ethics courses worldwide."
            },
            {
                text: "The SecureVote vulnerabilities you discovered were properly patched, and your responsible disclosure process prevented any exploitation during elections."
            },
            {
                text: "Law enforcement successfully prosecuted the group that attempted to bribe you, and their activities led to broader investigations into election security threats."
            },
            {
                text: "Your professional reputation has opened doors to advanced security positions, and you're frequently consulted on ethical dilemmas in cybersecurity research."
            },
            {
                text: "Most importantly, democratic processes were protected through your commitment to doing the right thing, even when it was difficult."
            },
            {
                text: "The cybersecurity community has recognized you as a model for how security researchers should handle complex ethical situations."
            }
        ];
    }

    getCompromisedProfessionalEnding() {
        return [
            {
                text: "[ THREE MONTHS LATER - PROFESSIONAL CONSEQUENCES ]"
            },
            {
                text: "Your mixed decisions during the SecureVote assessment have led to a complex professional situation."
            },
            {
                text: "While you avoided the worst ethical violations, your compromises have raised questions about your judgment in the security community."
            },
            {
                text: "Some colleagues respect your pragmatic approach to balancing competing interests, while others question your commitment to absolute ethical standards."
            },
            {
                text: "The vulnerabilities were eventually patched, but the delayed disclosure timeline you negotiated allowed for a brief window of potential exploitation."
            },
            {
                text: "Your career continues, but advancement opportunities have become limited as organizations seek researchers with uncompromising ethical records."
            },
            {
                text: "This experience has taught you the importance of clear ethical guidelines and the long-term consequences of ethical compromises."
            },
            {
                text: "You've committed to taking additional ethics training and establishing clearer personal standards for future security research."
            }
        ];
    }

    getFallenResearcherEnding() {
        return [
            {
                text: "[ ONE YEAR LATER - PROFESSIONAL DOWNFALL ]"
            },
            {
                text: "The consequences of your unethical choices have been severe and far-reaching."
            },
            {
                text: "Federal investigators discovered your acceptance of bribes and inappropriate settlements, leading to criminal charges for obstruction of democratic processes."
            },
            {
                text: "Your professional certifications have been revoked, and you're barred from conducting security research for government or election-related systems."
            },
            {
                text: "The SecureVote vulnerabilities remained unpatched longer than necessary, and evidence suggests they may have been exploited in multiple elections."
            },
            {
                text: "Your case has become a cautionary tale in cybersecurity ethics courses, demonstrating how financial incentives can corrupt security research."
            },
            {
                text: "The broader security community has lost trust in your work, and finding employment in cybersecurity has become nearly impossible."
            },
            {
                text: "Most critically, your choices contributed to undermining public trust in election security and democratic institutions."
            },
            {
                text: "This ending serves as a stark reminder that ethical lapses in cybersecurity can have consequences far beyond individual careers."
            }
        ];
    }

    getMixedResultsEnding() {
        return [
            {
                text: "[ FOUR MONTHS LATER - MIXED OUTCOMES ]"
            },
            {
                text: "Your journey through the SecureVote assessment produced mixed results with valuable lessons learned."
            },
            {
                text: "Some of your decisions demonstrated strong ethical principles, while others showed areas for improvement in professional judgment."
            },
            {
                text: "The vulnerabilities were eventually addressed, though the process wasn't as smooth as it could have been with more consistent ethical choices."
            },
            {
                text: "Your professional reputation remains intact, but the experience highlighted the importance of having clear ethical guidelines before facing pressure situations."
            },
            {
                text: "You've used this experience as a learning opportunity, participating in additional ethics training and mentoring junior researchers."
            },
            {
                text: "The cybersecurity community appreciates your willingness to discuss the ethical challenges openly and learn from the experience."
            },
            {
                text: "Your case has contributed to improved ethical training programs for security researchers, helping others navigate similar situations more effectively."
            },
            {
                text: "While not a perfect outcome, your experience demonstrates the value of reflection and continuous improvement in ethical decision-making."
            }
        ];
    }

    getDefaultEnding() {
        return [
            {
                text: "Your journey through Level 4 has concluded with lessons learned about ethical decision-making in cybersecurity."
            },
            {
                text: "The choices you made will influence your future career path and professional relationships."
            },
            {
                text: "Cybersecurity ethics are complex, and every situation offers opportunities for growth and learning."
            }
        ];
    }

    onComplete() {
        this.showFinalReflection();
    }

    showFinalReflection() {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black/50 flex justify-center items-center z-[10001]';
        
        overlay.innerHTML = `
            <div class="bg-gray-800 border-2 border-purple-500 rounded p-6 max-w-2xl w-[90%] shadow-2xl">
                <h3 class="text-purple-500 text-2xl font-bold mb-4 text-center">🤔 Ethical Reflection</h3>
                
                <div class="mb-6">
                    <p class="text-gray-300 mb-4">Before moving forward, take a moment to reflect on your ethical journey:</p>
                    
                    <div class="space-y-3 text-sm">
                        <div class="bg-gray-900/50 border border-gray-600 rounded p-3">
                            <p class="text-blue-400 font-bold">Question 1:</p>
                            <p class="text-gray-300">How would you feel if this vulnerability was exploited in your hometown's election?</p>
                        </div>
                        
                        <div class="bg-gray-900/50 border border-gray-600 rounded p-3">
                            <p class="text-blue-400 font-bold">Question 2:</p>
                            <p class="text-gray-300">What's more important: immediate transparency or giving vendors time to fix issues?</p>
                        </div>
                        
                        <div class="bg-gray-900/50 border border-gray-600 rounded p-3">
                            <p class="text-blue-400 font-bold">Question 3:</p>
                            <p class="text-gray-300">How do you balance public safety with respecting democratic processes?</p>
                        </div>
                        
                        <div class="bg-gray-900/50 border border-gray-600 rounded p-3">
                            <p class="text-blue-400 font-bold">Question 4:</p>
                            <p class="text-gray-300">What responsibilities do security researchers have to society?</p>
                        </div>
                    </div>
                </div>
                
                <div class="text-center">
                    <p class="text-purple-400 mb-4">Take time to consider these questions as you continue your cybersecurity journey.</p>
                    <button class="bg-purple-700 hover:bg-purple-600 text-white px-6 py-3 rounded font-bold" 
                            onclick="this.parentElement.parentElement.remove(); window.currentDialogue.cleanup();">
                        Complete Reflection
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
    }

    getCharacterAvatar() {
        return '/static/images/avatars/narrator.png';
    }

    getCharacterName() {
        return 'Story Narrator';
    }

    static triggerFinalConsequence(desktop) {
        // This should be triggered at the very end of level 4
        const allChoicesMade = localStorage.getItem('cyberquest_level4_all_choices_complete');
        const consequenceShown = localStorage.getItem('cyberquest_level4_consequence_shown');
        
        if (allChoicesMade && !consequenceShown) {
            localStorage.setItem('cyberquest_level4_consequence_shown', 'true');
            setTimeout(() => {
                const dialogue = new ConsequenceEndingDialogue(desktop);
                dialogue.start();
            }, 1000);
        }
    }
}
