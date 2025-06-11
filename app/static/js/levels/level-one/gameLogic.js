import { gameState, updateGameStats } from './gameState.js';
import { updateMentorMessage, showResultModal } from './uiUpdates.js';
import { resetWorkspace } from './storyHandler.js';

export function makeDecision(decision) {
    const story = gameState.currentStory;
    const isCorrect = decision === story.correctAnswer;
    
    gameState.storiesAnalyzed++;
    gameState.completedStories.push(story.id);
    
    if (isCorrect) {
        handleCorrectAnswer(story);
    } else {
        handleWrongAnswer(story);
    }
    
    updateGameStats();
    
    // Check if level complete
    if (gameState.storiesAnalyzed >= 3 || gameState.completedStories.length >= 2) {
        setTimeout(() => endGame(true), 2000);
    } else {
        setTimeout(() => resetWorkspace(), 2000);
    }
}

export function handleCorrectAnswer(story) {
    gameState.credibilityScore += 20;
    gameState.viralImpact = Math.max(0, gameState.viralImpact - 15);
    
    showResultModal(
        '✅',
        'Excellent Analysis!',
        'You correctly identified this story. Truth needs guardians like you.',
        `
            <div class="text-left space-y-2">
                <p class="text-green-700 font-bold font-serif">✅ Correct Decision</p>
                <p class="text-sm text-gray-800 font-serif">Key evidence you found:</p>
                <ul class="text-sm text-gray-700 space-y-1 font-serif">
                    ${story.redFlags.map(flag => `<li>• ${flag}</li>`).join('')}
                </ul>
                <p class="text-green-700 text-sm mt-3 font-bold">+20 Credibility Points</p>
            </div>
        `
    );
    
    updateMentorMessage("Verified. Good catch, Nova. Truth needs guardians like you.");
}

export function handleWrongAnswer(story) {
    gameState.credibilityScore -= 15;
    gameState.viralImpact += 25;
    
    showResultModal(
        '❌',
        'Misinformation Spread!',
        'The story went viral before you could stop it. Learn from this mistake.',
        `
            <div class="text-left space-y-2">
                <p class="text-red-700 font-bold font-serif">❌ Incorrect Decision</p>
                <p class="text-sm text-gray-800 font-serif">What you missed:</p>
                <ul class="text-sm text-gray-700 space-y-1 font-serif">
                    ${story.redFlags.map(flag => `<li>• ${flag}</li>`).join('')}
                </ul>
                <p class="text-red-700 text-sm mt-3 font-bold">-15 Credibility Points, +25% Viral Impact</p>
            </div>
        `
    );
    
    updateMentorMessage("Misinformation spreads faster than caution. Cross-check next time, Nova.");
}

export function endGame(success, message = null) {
    if (success) {
        updateMentorMessage("Outstanding work, Nova! You've successfully contained the misinformation threat. The Academy is proud of your media literacy skills.");
        document.getElementById('complete-level').disabled = false;
        
        // Show completion modal
        showResultModal(
            '🏆',
            'Mission Complete!',
            'You\'ve successfully completed the Misinformation Maze and earned the Fact Hunter badge.',
            `
                <div class="text-left space-y-3">
                    <div class="bg-amber-200 border-2 border-amber-500 rounded p-3">
                        <p class="text-amber-900 font-bold font-serif">🏆 Digital Badge Earned</p>
                        <p class="text-amber-800 text-sm font-serif">Fact Hunter - Level 1 Cleared</p>
                    </div>
                    <div class="text-sm space-y-1 font-serif text-gray-700">
                        <p><strong class="text-gray-900">Final Score:</strong> ${gameState.credibilityScore}/100</p>
                        <p><strong class="text-gray-900">Viral Impact:</strong> ${gameState.viralImpact}% (${gameState.viralImpact < 30 ? 'Contained' : 'Needs improvement'})</p>
                        <p><strong class="text-gray-900">Stories Analyzed:</strong> ${gameState.storiesAnalyzed}/3</p>
                    </div>
                </div>
            `
        );
    } else {
        updateMentorMessage(message || "Time's up! The misinformation campaign succeeded. Review your analysis and try again.");
    }
}
