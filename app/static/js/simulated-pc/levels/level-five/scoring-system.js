export class Level5ScoringSystem {
    constructor() {
        this.baseScore = 0;
        this.evidencePoints = {
            'bot_logs.txt': 100,
            'email_headers.txt': 100,
            'malware_code.txt': 100,
            'login_logs.txt': 100,
            'hidden_message.txt': 200  // Hidden evidence worth more
        };
        this.patternPoints = {
            'ip_address_192.168.1.100': 50,
            'signature_n4ll': 50,
            'timing_tuesday_2am': 50
        };
        this.completionBonuses = {
            'perfect_investigator': 300,  // All evidence found
            'master_detective': 200,      // 4+ evidence found
            'junior_detective': 100       // 3+ evidence found
        };
    }

    calculateScore(evidenceFound, patternsFound) {
        let totalScore = this.baseScore;
        
        // Score for evidence files
        evidenceFound.forEach(evidence => {
            if (this.evidencePoints[evidence]) {
                totalScore += this.evidencePoints[evidence];
            }
        });
        
        // Score for patterns identified
        patternsFound.forEach(pattern => {
            if (this.patternPoints[pattern]) {
                totalScore += this.patternPoints[pattern];
            }
        });
        
        // Completion bonuses
        const evidenceCount = evidenceFound.length;
        if (evidenceCount === 5) {
            totalScore += this.completionBonuses.perfect_investigator;
        } else if (evidenceCount >= 4) {
            totalScore += this.completionBonuses.master_detective;
        } else if (evidenceCount >= 3) {
            totalScore += this.completionBonuses.junior_detective;
        }
        
        return {
            totalScore,
            breakdown: this.getScoreBreakdown(evidenceFound, patternsFound),
            grade: this.getGrade(evidenceCount),
            badge: this.getBadge(evidenceCount, patternsFound.length)
        };
    }

    getScoreBreakdown(evidenceFound, patternsFound) {
        const breakdown = {
            evidence: {},
            patterns: {},
            bonuses: {},
            total: 0
        };
        
        // Evidence points
        evidenceFound.forEach(evidence => {
            if (this.evidencePoints[evidence]) {
                breakdown.evidence[evidence] = this.evidencePoints[evidence];
                breakdown.total += this.evidencePoints[evidence];
            }
        });
        
        // Pattern points
        patternsFound.forEach(pattern => {
            if (this.patternPoints[pattern]) {
                breakdown.patterns[pattern] = this.patternPoints[pattern];
                breakdown.total += this.patternPoints[pattern];
            }
        });
        
        // Completion bonuses
        const evidenceCount = evidenceFound.length;
        if (evidenceCount === 5) {
            breakdown.bonuses.perfect_investigator = this.completionBonuses.perfect_investigator;
            breakdown.total += this.completionBonuses.perfect_investigator;
        } else if (evidenceCount >= 4) {
            breakdown.bonuses.master_detective = this.completionBonuses.master_detective;
            breakdown.total += this.completionBonuses.master_detective;
        } else if (evidenceCount >= 3) {
            breakdown.bonuses.junior_detective = this.completionBonuses.junior_detective;
            breakdown.total += this.completionBonuses.junior_detective;
        }
        
        return breakdown;
    }

    getGrade(evidenceCount) {
        if (evidenceCount === 5) return 'A+';
        if (evidenceCount === 4) return 'A';
        if (evidenceCount === 3) return 'B+';
        if (evidenceCount === 2) return 'B-';
        return 'C';
    }

    getBadge(evidenceCount, patternCount) {
        if (evidenceCount === 5 && patternCount === 3) {
            return {
                id: 'digital_forensics_master',
                name: 'Digital Forensics Master',
                description: 'Found all evidence and identified all patterns',
                icon: '🏆',
                rarity: 'legendary'
            };
        } else if (evidenceCount >= 4) {
            return {
                id: 'master_detective',
                name: 'Master Detective',
                description: 'Excellent investigative work',
                icon: '🕵️',
                rarity: 'epic'
            };
        } else if (evidenceCount >= 3) {
            return {
                id: 'junior_detective',
                name: 'Junior Detective',
                description: 'Good investigative skills',
                icon: '🔍',
                rarity: 'rare'
            };
        } else {
            return {
                id: 'evidence_collector',
                name: 'Evidence Collector',
                description: 'Basic evidence collection',
                icon: '📁',
                rarity: 'common'
            };
        }
    }

    getInvestigationStatus(evidenceCount) {
        if (evidenceCount >= 4) {
            return {
                status: 'Case Solved',
                description: 'The Null has been successfully identified',
                outcome: 'success',
                message: 'Outstanding detective work! You have enough evidence to prosecute The Null.'
            };
        } else if (evidenceCount >= 2) {
            return {
                status: 'Partial Success',
                description: 'Some evidence collected but case incomplete',
                outcome: 'partial',
                message: 'You found some clues but need more evidence for a conviction.'
            };
        } else {
            return {
                status: 'Investigation Failed',
                description: 'Insufficient evidence to identify The Null',
                outcome: 'failed',
                message: 'The Null remains at large. You need to find more evidence.'
            };
        }
    }

    saveScore(evidenceFound, patternsFound) {
        const scoreData = this.calculateScore(evidenceFound, patternsFound);
        const investigationStatus = this.getInvestigationStatus(evidenceFound.length);
        
        // Save to localStorage
        const level5Data = {
            score: scoreData,
            status: investigationStatus,
            evidenceFound: evidenceFound,
            patternsFound: patternsFound,
            completedAt: new Date().toISOString(),
            timeSpent: this.calculateTimeSpent()
        };
        
        localStorage.setItem('cyberquest_level5_results', JSON.stringify(level5Data));
        localStorage.setItem('cyberquest_level_5_score', scoreData.totalScore.toString());
        
        // Update global XP
        const currentXP = parseInt(localStorage.getItem('cyberquest_xp')) || 0;
        localStorage.setItem('cyberquest_xp', currentXP + scoreData.totalScore);
        
        return level5Data;
    }

    calculateTimeSpent() {
        const startTime = localStorage.getItem('cyberquest_level5_start_time');
        if (startTime) {
            return Math.round((Date.now() - parseInt(startTime)) / 1000); // in seconds
        }
        return 0;
    }

    startTimer() {
        localStorage.setItem('cyberquest_level5_start_time', Date.now().toString());
    }

    getLeaderboardEntry(evidenceFound, patternsFound) {
        const scoreData = this.calculateScore(evidenceFound, patternsFound);
        return {
            score: scoreData.totalScore,
            grade: scoreData.grade,
            evidenceCount: evidenceFound.length,
            patternCount: patternsFound.length,
            timeSpent: this.calculateTimeSpent(),
            badge: scoreData.badge
        };
    }

    // Static method to get scoring thresholds
    static getScoringGuide() {
        return {
            evidenceFiles: [
                { name: 'bot_logs.txt', points: 100, difficulty: 'Easy' },
                { name: 'email_headers.txt', points: 100, difficulty: 'Easy' },
                { name: 'malware_code.txt', points: 100, difficulty: 'Medium' },
                { name: 'login_logs.txt', points: 100, difficulty: 'Medium' },
                { name: 'hidden_message.txt', points: 200, difficulty: 'Hard' }
            ],
            patterns: [
                { name: 'IP Address Pattern', points: 50, description: '192.168.1.100 in multiple files' },
                { name: 'Signature Pattern', points: 50, description: 'N4LL variations' },
                { name: 'Timing Pattern', points: 50, description: 'Tuesday 2:00 AM attacks' }
            ],
            grades: {
                'A+': '5 evidence files (Perfect Investigation)',
                'A': '4 evidence files (Excellent Investigation)',
                'B+': '3 evidence files (Good Investigation)',
                'B-': '2 evidence files (Adequate Investigation)',
                'C': '0-1 evidence files (Incomplete Investigation)'
            }
        };
    }
}

// Create global scoring system for Level 5
window.level5Scoring = new Level5ScoringSystem();
