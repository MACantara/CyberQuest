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
        instructions.className = 'labeling-instructions fixed top-20 right-5 w-80 bg-gray-800 border border-gray-600 rounded-lg p-5 shadow-xl text-white font-sans z-50';
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
                        ${educationalNotes}
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
                            <span>Fake/Suspicious</span>
                        </div>
                        <div class="flex items-center gap-2 text-xs text-gray-300">
                            <div class="w-4 h-4 rounded-full bg-green-600/20 border-2 border-green-500 flex items-center justify-center">
                                <i class="bi bi-check-circle text-green-500 text-xs"></i>
                            </div>
                            <span>Real/Legitimate</span>
                        </div>
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