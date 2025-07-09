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
            '<i class="bi bi-database-check text-blue-400 mr-1"></i>Batch Analysis Data' : 
            '<i class="bi bi-exclamation-triangle text-red-400 mr-1"></i>No Analysis Data';
        
        const instructions = document.createElement('div');
        instructions.className = 'labeling-instructions fixed top-20 right-5 w-80 bg-gray-700 bg-opacity-95 backdrop-blur-sm rounded-xl border-2 border-gray-600 text-white p-5 font-sans z-50 shadow-2xl';
        instructions.innerHTML = `
            <div class="text-emerald-400 text-base font-semibold mb-4 flex items-center gap-2">
                <i class="bi bi-bullseye text-emerald-400"></i>
                <span>Interactive Analysis</span>
            </div>
            <div class="text-sm leading-6 text-gray-300 mb-4">
                ${educationalNotes}
            </div>
            <div class="flex flex-col gap-2 mb-4">
                <div class="flex items-center gap-2 text-xs text-gray-300">
                    <div class="w-4 h-4 rounded bg-red-600 bg-opacity-20 border-2 border-red-500 flex items-center justify-center">
                        <i class="bi bi-x-circle text-red-500 text-sm"></i>
                    </div>
                    <span>Fake/Suspicious</span>
                </div>
                <div class="flex items-center gap-2 text-xs text-gray-300">
                    <div class="w-4 h-4 rounded bg-green-600 bg-opacity-20 border-2 border-green-500 flex items-center justify-center">
                        <i class="bi bi-check-circle text-green-500 text-sm"></i>
                    </div>
                    <span>Real/Legitimate</span>
                </div>
            </div>
            <div class="text-xs text-gray-400 text-center p-2 bg-gray-800 bg-opacity-80 border border-gray-600 rounded mb-4">
                <div class="flex items-center justify-center mb-1">
                    <i class="bi bi-file-text text-gray-400 mr-1"></i>
                    Article ${this.labelingSystem.currentArticleIndex + 1} of ${this.labelingSystem.totalArticles}
                </div>
                <div class="flex items-center justify-center">
                    ${analysisSourceText}
                </div>
            </div>
            <button class="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white border-none p-3 rounded-lg font-semibold cursor-pointer transition-all duration-200 text-sm hover:from-emerald-700 hover:to-emerald-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/30 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2" onclick="window.interactiveLabeling?.submitAnalysis()">
                <i class="bi bi-send text-white"></i>
                Submit Analysis
            </button>
        `;
        
        document.body.appendChild(instructions);
        window.interactiveLabeling = this.labelingSystem;
    }

    updateInstructions() {
        const progressInfo = document.querySelector('.labeling-instructions .text-xs.text-gray-400');
        if (progressInfo) {
            const labeledCount = Array.from(this.labelingSystem.labeledElements.values()).filter(el => el.labeled).length;
            const totalCount = this.labelingSystem.labeledElements.size;
            const analysisSourceText = this.labelingSystem.analysisSource === 'batch-json' ? 
                '<i class="bi bi-database-check text-blue-400 mr-1"></i>Batch Analysis Data' : 
                '<i class="bi bi-exclamation-triangle text-red-400 mr-1"></i>No Analysis Data';
            progressInfo.innerHTML = `
                <div class="flex items-center justify-center mb-1">
                    <i class="bi bi-file-text text-gray-400 mr-1"></i>
                    Article ${this.labelingSystem.currentArticleIndex + 1} of ${this.labelingSystem.totalArticles}
                </div>
                <div class="flex items-center justify-center mb-1">
                    <i class="bi bi-tags text-gray-400 mr-1"></i>
                    Labeled: ${labeledCount}/${totalCount} elements
                </div>
                <div class="flex items-center justify-center">
                    ${analysisSourceText}
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