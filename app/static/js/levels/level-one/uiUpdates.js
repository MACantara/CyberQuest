export function updateMentorMessage(message) {
    const messageElement = document.getElementById('mentor-message');
    const toast = document.getElementById('editor-toast');
    
    // Show toast if it's hidden
    if (toast.classList.contains('-translate-y-full') || toast.classList.contains('opacity-0')) {
        if (window.showEditorToast) {
            window.showEditorToast();
        }
    }
    
    // Update message with smooth transition
    messageElement.style.opacity = '0.6';
    setTimeout(() => {
        messageElement.textContent = message;
        messageElement.style.opacity = '1';
    }, 200);
    
    // Add subtle glow effect for new messages
    toast.style.boxShadow = '0 10px 30px rgba(245, 158, 11, 0.4), 0 0 20px rgba(245, 158, 11, 0.2)';
    setTimeout(() => {
        toast.style.boxShadow = '';
    }, 2000);
    
    // Reset auto-hide timer when new message comes in
    clearTimeout(window.toastAutoHideTimer);
    window.toastAutoHideTimer = setTimeout(() => {
        if (window.hideEditorToast) {
            window.hideEditorToast();
        }
    }, 8000);
}

export function updateCredibilityMeter(score) {
    const meter = document.getElementById('credibility-meter');
    const text = document.getElementById('credibility-text');
    
    meter.style.width = score + '%';
    
    if (score >= 80) {
        meter.className = 'bg-green-600 h-2 transition-all duration-500';
        text.textContent = 'Highly credible source';
        text.className = 'text-xs font-serif mt-1 text-green-700';
    } else if (score >= 50) {
        meter.className = 'bg-yellow-600 h-2 transition-all duration-500';
        text.textContent = 'Moderately credible';
        text.className = 'text-xs font-serif mt-1 text-yellow-700';
    } else {
        meter.className = 'bg-red-600 h-2 transition-all duration-500';
        text.textContent = 'Low credibility - suspicious';
        text.className = 'text-xs font-serif mt-1 text-red-700';
    }
}

export function updateViralMeter(risk) {
    const meter = document.getElementById('viral-meter');
    const text = document.getElementById('viral-text');
    
    meter.style.width = risk + '%';
    
    if (risk >= 70) {
        meter.className = 'bg-red-600 h-2 transition-all duration-500';
        text.textContent = 'High viral risk - urgent action needed';
        text.className = 'text-xs font-serif mt-1 text-red-700';
    } else if (risk >= 30) {
        meter.className = 'bg-orange-500 h-2 transition-all duration-500';
        text.textContent = 'Moderate viral potential';
        text.className = 'text-xs font-serif mt-1 text-orange-700';
    } else {
        meter.className = 'bg-green-500 h-2 transition-all duration-500';
        text.textContent = 'Low viral risk';
        text.className = 'text-xs font-serif mt-1 text-green-700';
    }
}

export function showResultModal(icon, title, message, feedback) {
    document.getElementById('result-icon').textContent = icon;
    document.getElementById('result-title').textContent = title;
    document.getElementById('result-message').textContent = message;
    document.getElementById('result-feedback').innerHTML = feedback;
    document.getElementById('results-modal').classList.remove('hidden');
}

export function updateTimerDisplay(timeRemaining) {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const timerElement = document.getElementById('timer');
    
    timerElement.textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Add urgency styling when time is running low
    if (timeRemaining <= 60) {
        timerElement.className = 'font-mono font-bold text-red-800 animate-pulse';
    } else if (timeRemaining <= 120) {
        timerElement.className = 'font-mono font-bold text-orange-800';
    } else {
        timerElement.className = 'font-mono font-bold text-gray-800';
    }
}

export function updateProgressTrackers(headlinesCount, sourcesCount, imagesCount) {
    document.getElementById('headlines-count').textContent = headlinesCount;
    document.getElementById('sources-count').textContent = sourcesCount;
    document.getElementById('images-count').textContent = imagesCount;
    
    // Update progress bar
    const totalTasks = 9; // 3 stories × 3 verification types
    const completedTasks = headlinesCount + sourcesCount + imagesCount;
    const progressPercentage = (completedTasks / totalTasks) + 0.1;
    
    document.getElementById('progress-bar').style.width = progressPercentage + '%';
}

export function highlightSelectedStory(storyId) {
    // Remove previous selections
    document.querySelectorAll('.story-item').forEach(item => {
        item.classList.remove('border-blue-600', 'border-2', 'bg-amber-200');
        item.classList.add('border-gray-400', 'bg-amber-25');
    });
    
    // Highlight selected story
    const selectedStory = document.querySelector(`[data-story="${storyId}"]`);
    if (selectedStory) {
        selectedStory.classList.remove('border-gray-400', 'bg-amber-25');
        selectedStory.classList.add('border-blue-600', 'border-2', 'bg-amber-200');
    }
}

export function showVerificationResults(results) {
    const resultsContainer = document.getElementById('results-content');
    const verificationSection = document.getElementById('verification-results');
    
    resultsContainer.innerHTML = results.map(result => `
        <div class="border-b border-amber-300 pb-2 mb-2 last:border-b-0">
            <p class="font-bold text-gray-900">${result.tool}:</p>
            <p class="text-gray-800">${result.finding}</p>
            ${result.redFlag ? `<p class="text-red-700 text-xs mt-1">🚩 Red Flag: ${result.redFlag}</p>` : ''}
        </div>
    `).join('');
    
    verificationSection.classList.remove('hidden');
}

export function updateStoryDetails(story) {
    const detailsContainer = document.getElementById('story-details');
    
    detailsContainer.innerHTML = `
        <div class="bg-amber-100 border border-amber-300 rounded p-3">
            <h4 class="font-serif font-bold text-gray-900 mb-2">${story.headline}</h4>
            <div class="grid grid-cols-2 gap-4 text-xs font-serif text-gray-700">
                <div>
                    <p><strong>Source:</strong> ${story.source}</p>
                    <p><strong>Published:</strong> ${story.publishTime}</p>
                    <p><strong>Domain:</strong> ${story.domain}</p>
                </div>
                <div>
                    <p><strong>Shares:</strong> ${story.shares}</p>
                    <p><strong>Status:</strong> <span class="px-1 py-0.5 rounded text-white text-xs ${getStatusColor(story.verification)}">${story.verification}</span></p>
                    <p><strong>Category:</strong> ${story.category}</p>
                </div>
            </div>
        </div>
    `;
}

function getStatusColor(status) {
    switch(status) {
        case 'VERIFIED': return 'bg-green-600';
        case 'UNVERIFIED': return 'bg-red-600';
        case 'CLICKBAIT': return 'bg-yellow-600';
        default: return 'bg-gray-600';
    }
}

export function resetUI() {
    // Reset all UI elements to initial state
    document.getElementById('analysis-panel').classList.add('hidden');
    document.getElementById('verification-results').classList.add('hidden');
    document.getElementById('results-content').innerHTML = '';
    
    // Reset verification tool buttons
    document.querySelectorAll('.verification-tool').forEach(tool => {
        tool.classList.remove('opacity-75');
        tool.disabled = false;
    });
    
    // Reset story selections
    document.querySelectorAll('.story-item').forEach(item => {
        item.classList.remove('border-blue-600', 'border-2', 'bg-amber-200');
        item.classList.add('border-gray-400', 'bg-amber-25');
    });
    
    // Reset meters
    updateCredibilityMeter(0);
    updateViralMeter(0);
}
