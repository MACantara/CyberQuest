import { gameState } from './gameState.js';
import { updateMentorMessage } from './uiUpdates.js';

export let stories = {};

export async function loadStories() {
    try {
        const response = await fetch('/static/js/levels/level-1/data/stories.json');
        stories = await response.json();
    } catch (error) {
        console.error('Failed to load stories:', error);
    }
}

export function selectStory(storyId) {
    gameState.currentStory = stories[storyId];
    displayStoryInWorkspace(gameState.currentStory);
    
    // Show current article summary in left panel
    document.getElementById('current-article-summary').classList.remove('hidden');
    document.getElementById('article-title').textContent = gameState.currentStory.headline;
    
    // Enable verification tools
    document.querySelectorAll('.verification-tool').forEach(tool => {
        tool.disabled = false;
        tool.classList.remove('opacity-50');
    });
    
    // Hide tutorials
    document.getElementById('tutorial-inbox').classList.add('hidden');
    document.getElementById('tutorial-workspace').classList.add('hidden');
    
    // Switch to full article view
    document.getElementById('article-previews').classList.add('hidden');
    document.getElementById('full-article-display').classList.remove('hidden');
    
    if (storyId === 1) {
        updateMentorMessage("Good choice, Nova. This story has several red flags. Use the verification tools on the left to analyze the headline, source, and any images. Start with the headline analyzer.");
    }
}

export function displayStoryInWorkspace(story) {
    const workspace = document.getElementById('workspace');
    
    // Format publish date for article display
    const publishDate = new Date();
    const formattedDate = publishDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    workspace.innerHTML = `
        <div class="bg-white text-gray-900 p-6 rounded border border-amber-300 font-serif">
            <!-- Article Header -->
            <div class="border-b-2 border-gray-800 pb-4 mb-4">
                <div class="flex justify-between items-start mb-2">
                    <span class="text-xs font-bold bg-red-600 text-white px-2 py-1 rounded">${story.newsType}</span>
                    <span class="text-xs text-gray-600">${story.category}</span>
                </div>
                
                <!-- Headline -->
                <h1 class="text-2xl font-bold leading-tight mb-3">${story.headline}</h1>
                
                <!-- Byline and Metadata -->
                <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 border-b border-gray-300 pb-3">
                    <div class="flex items-center gap-2">
                        <span class="font-semibold">By ${story.source}</span>
                        <span class="px-2 py-1 rounded text-xs ${getStatusBadgeClass(story.verification)}">${story.verification}</span>
                    </div>
                    <div class="flex items-center gap-1">
                        <i class="bi bi-clock text-xs"></i>
                        <span>Published ${story.publishTime}</span>
                    </div>
                    <div class="flex items-center gap-1">
                        <i class="bi bi-globe text-xs"></i>
                        <span class="font-mono text-xs">${story.domain}</span>
                    </div>
                </div>
                
                <!-- Social Stats -->
                <div class="flex items-center gap-4 text-xs text-gray-500 mt-2">
                    <div class="flex items-center gap-1">
                        <i class="bi bi-share"></i>
                        <span>${story.shares}</span>
                    </div>
                    <div class="flex items-center gap-1">
                        <i class="bi bi-eye"></i>
                        <span>Reading time: ~2 min</span>
                    </div>
                    ${story.images.hasImages ? '<div class="flex items-center gap-1"><i class="bi bi-image"></i><span>Contains media</span></div>' : ''}
                </div>
            </div>

            <!-- Article Body -->
            <div class="space-y-4">
                <!-- Lead paragraph -->
                <p class="text-lg leading-relaxed font-medium text-gray-800 border-l-4 border-amber-400 pl-4 bg-amber-50 py-2">
                    ${story.fullContent.split('.')[0]}.
                </p>
                
                <!-- Image placeholder if article has images -->
                ${story.images.hasImages ? `
                <div class="my-6 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <i class="bi bi-image text-4xl text-gray-400 mb-2"></i>
                    <div class="text-sm text-gray-600">
                        <p class="font-semibold">[IMAGE: ${story.images.imageDescription}]</p>
                        <p class="text-xs mt-1 italic">Click "IMAGE VERIFY" tool to analyze this media</p>
                    </div>
                </div>
                ` : ''}
                
                <!-- Remaining content -->
                <div class="prose prose-sm max-w-none">
                    ${story.fullContent.split('.').slice(1).join('.').trim() ? 
                        '<p class="leading-relaxed">' + story.fullContent.split('.').slice(1).join('.').trim() + '</p>' : 
                        '<p class="leading-relaxed text-gray-600 italic">[Article content continues...]</p>'
                    }
                </div>
                
                <!-- Article Footer Metadata -->
                <div class="border-t border-gray-300 pt-4 mt-6">
                    <div class="grid grid-cols-2 gap-4 text-xs text-gray-500">
                        <div>
                            <p><strong>Source Domain:</strong> <span class="font-mono">${story.domain}</span></p>
                            <p><strong>Article ID:</strong> #${story.id}${Math.random().toString(36).substr(2, 6)}</p>
                            <p><strong>Last Updated:</strong> ${story.publishTime}</p>
                        </div>
                        <div>
                            <p><strong>Category:</strong> ${story.category}</p>
                            <p><strong>Language:</strong> English (US)</p>
                            <p><strong>Word Count:</strong> ~${story.fullContent.split(' ').length} words</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Verification Notice -->
            <div class="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r">
                <div class="flex items-start">
                    <i class="bi bi-info-circle text-blue-600 mr-2 mt-0.5"></i>
                    <div class="text-sm">
                        <p class="font-semibold text-blue-800">Fact-Checking Required</p>
                        <p class="text-blue-700">Use the verification tools on the left to analyze this article's credibility before making your editorial decision.</p>
                    </div>
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

function getStatusBadgeClass(status) {
    switch(status) {
        case 'VERIFIED': return 'bg-green-100 text-green-800 border border-green-300';
        case 'UNVERIFIED': return 'bg-red-100 text-red-800 border border-red-300';
        case 'CLICKBAIT': return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
        default: return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
}

export function resetWorkspace() {
    // Reset to preview mode
    document.getElementById('article-previews').classList.remove('hidden');
    document.getElementById('full-article-display').classList.add('hidden');
    
    // Hide left panel elements
    document.getElementById('current-article-summary').classList.add('hidden');
    document.getElementById('verification-results').classList.add('hidden');
    document.getElementById('editorial-decision').classList.add('hidden');
    
    // Reset and disable verification tools
    document.querySelectorAll('.verification-tool').forEach(tool => {
        tool.classList.remove('opacity-75');
        tool.disabled = true;
        tool.classList.add('opacity-50');
    });
    
    // Reset story selections
    document.querySelectorAll('.story-item').forEach(item => {
        item.classList.remove('border-blue-600', 'border-2', 'bg-amber-200');
        item.classList.add('border-gray-400');
    });
    
    // Clear results
    document.getElementById('results-content').innerHTML = '';
    
    gameState.currentStory = null;
}
