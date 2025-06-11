export const gameState = {
    credibilityScore: 100,
    viralImpact: 0,
    storiesAnalyzed: 0,
    currentStory: null,
    verificationSteps: {
        headlines: 0,
        sources: 0,
        images: 0
    },
    completedStories: [],
    timeRemaining: 300 // 5 minutes
};

export function updateGameStats() {
    document.getElementById('credibility-score').textContent = gameState.credibilityScore;
    document.getElementById('viral-impact').textContent = gameState.viralImpact;
    document.getElementById('stories-analyzed').textContent = gameState.storiesAnalyzed;
    
    // Update viral meter
    const viralMeter = document.getElementById('viral-meter');
    const viralText = document.getElementById('viral-text');
    viralMeter.style.width = gameState.viralImpact + '%';
    
    if (gameState.viralImpact >= 75) {
        viralText.textContent = 'Critical - widespread misinformation';
    } else if (gameState.viralImpact >= 50) {
        viralText.textContent = 'High risk - spreading rapidly';
    } else if (gameState.viralImpact >= 25) {
        viralText.textContent = 'Moderate risk - contained';
    } else {
        viralText.textContent = 'Low risk - well controlled';
    }
}

export function updateProgress() {
    document.getElementById('headlines-count').textContent = gameState.verificationSteps.headlines;
    document.getElementById('sources-count').textContent = gameState.verificationSteps.sources;
    document.getElementById('images-count').textContent = gameState.verificationSteps.images;
    
    const totalSteps = gameState.verificationSteps.headlines + gameState.verificationSteps.sources + gameState.verificationSteps.images;
    const progressPercent = (totalSteps / 9) * 100; // 3 stories × 3 steps each
    document.getElementById('progress-bar').style.width = progressPercent + '%';
}

export function getVerificationStepsCompleted() {
    return gameState.verificationSteps.headlines + gameState.verificationSteps.sources + gameState.verificationSteps.images;
}
