import { gameState } from './gameState.js';
import { loadStories, selectStory, resetWorkspace } from './storyHandler.js';
import { handleVerificationTool } from './verificationTools.js';
import { makeDecision, endGame } from './gameLogic.js';
import { updateMentorMessage, updateTimerDisplay, showResultModal } from './uiUpdates.js';

document.addEventListener('DOMContentLoaded', async function() {
    // Load story data
    await loadStories();
    
    // Initialize game
    function initGame() {
        startTimer();
        showTutorial();
    }

    // Timer function
    function startTimer() {
        const timer = setInterval(() => {
            gameState.timeRemaining--;
            updateTimerDisplay(gameState.timeRemaining);
            
            if (gameState.timeRemaining <= 0) {
                clearInterval(timer);
                endGame(false, "Time's up! The misinformation spread unchecked.");
            }
        }, 1000);
    }

    // Tutorial system
    function showTutorial() {
        setTimeout(() => {
            document.getElementById('tutorial-inbox').classList.remove('hidden');
            updateMentorMessage("Let's start with the first story. Click on the BREAKING news about Senator Williams to analyze it.");
        }, 2000);
    }

    // Event Listeners
    // Story selection
    document.querySelectorAll('.story-item').forEach(item => {
        item.addEventListener('click', function() {
            const storyId = parseInt(this.dataset.story);
            selectStory(storyId);
            
            // Visual feedback
            document.querySelectorAll('.story-item').forEach(s => {
                s.classList.remove('border-blue-600', 'border-2');
                s.classList.add('border-gray-400');
            });
            this.classList.remove('border-gray-400');
            this.classList.add('border-blue-600', 'border-2');
        });
    });

    // Back to previews button
    document.getElementById('back-to-previews').addEventListener('click', function() {
        document.getElementById('article-previews').classList.remove('hidden');
        document.getElementById('full-article-display').classList.add('hidden');
        
        // Reset selection visuals
        document.querySelectorAll('.story-item').forEach(s => {
            s.classList.remove('border-blue-600', 'border-2');
            s.classList.add('border-gray-400');
        });
        
        // Clear current story
        gameState.currentStory = null;
        document.getElementById('current-article-summary').classList.add('hidden');
        
        // Disable tools
        document.querySelectorAll('.verification-tool').forEach(tool => {
            tool.disabled = true;
            tool.classList.add('opacity-50');
        });
    });

    // Verification tools
    document.querySelectorAll('.verification-tool').forEach(tool => {
        tool.addEventListener('click', function() {
            const toolType = this.dataset.tool;
            if (gameState.currentStory) {
                handleVerificationTool(toolType);
                this.classList.add('opacity-75');
                this.disabled = true;
            }
        });
    });

    // Final decision buttons
    document.getElementById('mark-fake').addEventListener('click', () => makeDecision('fake'));
    document.getElementById('mark-real').addEventListener('click', () => makeDecision('real'));

    // Modal event handlers
    document.getElementById('start-mission').addEventListener('click', function() {
        document.getElementById('cutscene-modal').classList.add('hidden');
        initGame();
    });

    document.getElementById('continue-btn').addEventListener('click', function() {
        document.getElementById('results-modal').classList.add('hidden');
    });

    document.getElementById('clear-workspace').addEventListener('click', resetWorkspace);

    document.getElementById('complete-level').addEventListener('click', function() {
        // Show transition cutscene
        showResultModal(
            '📧',
            'Incoming Message',
            'As you finish scrubbing the false story, you receive a new email...',
            `
                <div class="text-left bg-gray-800 border-2 border-gray-700 rounded p-3">
                    <p class="text-red-400 font-semibold font-serif">🚨 URGENT MESSAGE</p>
                    <p class="text-amber-100 text-sm mt-2 font-serif">"Commander X wants immediate action—check your inbox now."</p>
                    <p class="text-gray-400 text-xs mt-2 font-serif">Sender: Unknown</p>
                </div>
                <p class="text-gray-800 text-sm mt-3 font-serif font-bold">Ready for Level 2: Shadow in the Inbox?</p>
            `
        );
        
        // Override continue button to go to next level
        document.getElementById('continue-btn').onclick = function() {
            window.location.href = '/level/2';
        };
    });

    // Show opening cutscene
    document.getElementById('cutscene-modal').classList.remove('hidden');
});