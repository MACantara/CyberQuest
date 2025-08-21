export class InteractiveUI {
    constructor(labelingSystem) {
        this.labelingSystem = labelingSystem;
    }

    showInstructions() {
        const existing = document.querySelector('.labeling-instructions');
        if (existing) existing.remove();
        
        const educationalNotes = this.labelingSystem.batchAnalysis?.educational_focus || 
                               'Click on different parts of the article to label them as fake or real. This data comes from pre-analyzed batch training data.';
        
        const analysisSourceText = this.labelingSystem.analysisSource === 'batch-json' ? 
            'Batch Analysis Data' : 'No Analysis Data';
        
        const analysisIcon = this.labelingSystem.analysisSource === 'batch-json' ? 
            'bi-database-check text-blue-400' : 'bi-exclamation-triangle text-red-400';
        
        const instructions = document.createElement('div');
        instructions.className = 'labeling-instructions fixed top-20 right-5 w-96 bg-gray-800 border border-gray-600 rounded p-5 shadow-xl text-white font-sans z-50';
        instructions.innerHTML = `
            <h3 class="text-emerald-400 text-sm font-bold mb-4 pb-1 border-b border-gray-600 flex items-center gap-2">
                <i class="bi bi-bullseye"></i>
                Interactive Analysis
            </h3>
            
            <div class="space-y-4">
                <!-- Instructions Section -->
                <div>
                    <h4 class="text-sm font-semibold text-blue-400 mb-2">How to Use</h4>
                    <p class="text-xs text-gray-300 leading-relaxed">
                        Click on different parts of the article to select them, then use the label selector buttons to mark them as "Fake News", "Real News", or "No Label". Analyze each element carefully to identify misinformation.
                    </p>
                </div>
                
                <!-- Legend Section -->
                <div>
                    <h4 class="text-sm font-semibold text-blue-400 mb-2">Legend</h4>
                    <div class="space-y-2">
                        <div class="flex items-center gap-2 text-xs text-gray-300">
                            <div class="w-4 h-4 rounded-full bg-red-600/20 border-2 border-red-500 flex items-center justify-center">
                                <i class="bi bi-x-circle text-red-500 text-xs"></i>
                            </div>
                            <span>Fake News</span>
                        </div>
                        <div class="flex items-center gap-2 text-xs text-gray-300">
                            <div class="w-4 h-4 rounded-full bg-green-600/20 border-2 border-green-500 flex items-center justify-center">
                                <i class="bi bi-check-circle text-green-500 text-xs"></i>
                            </div>
                            <span>Real News</span>
                        </div>
                        <div class="flex items-center gap-2 text-xs text-gray-300">
                            <div class="w-4 h-4 rounded-full bg-gray-600/20 border-2 border-gray-400 flex items-center justify-center">
                                <i class="bi bi-question-circle text-gray-400 text-xs"></i>
                            </div>
                            <span>No Label</span>
                        </div>
                    </div>
                </div>
                
                <!-- Label Selection Panel -->
                <div id="label-selection-panel" class="hidden">
                    <h4 class="text-sm font-semibold text-blue-400 mb-2">Select Label</h4>
                    <div class="space-y-2">
                        <button class="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer text-xs" onclick="window.interactiveLabeling?.applyLabel('fake')">
                            <i class="bi bi-x-circle"></i>
                            Fake News
                        </button>
                        <button class="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer text-xs" onclick="window.interactiveLabeling?.applyLabel('real')">
                            <i class="bi bi-check-circle"></i>
                            Real News
                        </button>
                        <button class="w-full bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer text-xs" onclick="window.interactiveLabeling?.applyLabel('none')">
                            <i class="bi bi-question-circle"></i>
                            No Label
                        </button>
                    </div>
                    <div class="mt-2 pt-2 border-t border-gray-600">
                        <p id="selected-element-name" class="text-xs text-gray-400 italic">Click an element to label it</p>
                    </div>
                </div>
                
                <!-- Progress Section -->
                <div>
                    <h4 class="text-sm font-semibold text-blue-400 mb-2">Progress</h4>
                    <div class="bg-gray-700 border border-gray-600 rounded p-3 text-xs">
                        <div class="flex items-center gap-1 mb-1">
                            <i class="bi bi-file-text text-gray-400"></i>
                            <span class="text-gray-300">Article ${this.labelingSystem.currentArticleIndex + 1} of ${this.labelingSystem.totalArticles}</span>
                        </div>
                        <div class="flex items-center gap-1">
                            <i class="${analysisIcon}"></i>
                            <span class="text-gray-300">${analysisSourceText}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Action Button -->
            <div class="pt-4 border-t border-gray-600 mt-4">
                <button class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer" onclick="window.interactiveLabeling?.submitAnalysis()">
                    <i class="bi bi-send"></i>
                    Submit Analysis
                </button>
            </div>
        `;
        
        document.body.appendChild(instructions);
        window.interactiveLabeling = this.labelingSystem;
    }

    showLabelSelector(elementId, elementName) {
        const panel = document.querySelector('#label-selection-panel');
        const nameDisplay = document.querySelector('#selected-element-name');
        
        if (panel && nameDisplay) {
            panel.classList.remove('hidden');
            nameDisplay.textContent = `Selected: ${elementName}`;
            
            // Store the current element ID for labeling
            this.labelingSystem.selectedElementId = elementId;
        }
    }

    hideLabelSelector() {
        const panel = document.querySelector('#label-selection-panel');
        const nameDisplay = document.querySelector('#selected-element-name');
        
        if (panel && nameDisplay) {
            panel.classList.add('hidden');
            nameDisplay.textContent = 'Click an element to label it';
            this.labelingSystem.selectedElementId = null;
        }
    }

    updateInstructions() {
        const progressSection = document.querySelector('.labeling-instructions .bg-gray-700');
        if (progressSection) {
            const labeledCount = Array.from(this.labelingSystem.labeledElements.values()).filter(el => el.labeled).length;
            const totalCount = this.labelingSystem.labeledElements.size;
            const analysisSourceText = this.labelingSystem.analysisSource === 'batch-json' ? 
                'Batch Analysis Data' : 'No Analysis Data';
            const analysisIcon = this.labelingSystem.analysisSource === 'batch-json' ? 
                'bi-database-check text-blue-400' : 'bi-exclamation-triangle text-red-400';
            
            progressSection.innerHTML = `
                <div class="flex items-center gap-1 mb-1">
                    <i class="bi bi-file-text text-gray-400"></i>
                    <span class="text-gray-300">Article ${this.labelingSystem.currentArticleIndex + 1} of ${this.labelingSystem.totalArticles}</span>
                </div>
                <div class="flex items-center gap-1 mb-1">
                    <i class="bi bi-tags text-gray-400"></i>
                    <span class="text-gray-300">Labeled: ${labeledCount}/${totalCount} elements</span>
                </div>
                <div class="flex items-center gap-1">
                    <i class="${analysisIcon}"></i>
                    <span class="text-gray-300">${analysisSourceText}</span>
                </div>
            `;
        }
    }

    cleanupStyles() {
        // No custom styles to clean up
        return;
    }

    cleanup() {
        const instructions = document.querySelector('.labeling-instructions');
        if (instructions) instructions.remove();
    }
}