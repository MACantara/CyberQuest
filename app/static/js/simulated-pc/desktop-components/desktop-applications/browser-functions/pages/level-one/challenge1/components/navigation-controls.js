export class NavigationControls {
    static create(currentIndex, totalArticles) {
        return `
            <div class="bg-white/10 backdrop-blur-sm rounded p-4 border border-white border-opacity-20">
                <div class="flex justify-between items-center mb-3">
                    <div class="text-emerald-400 text-sm font-semibold tracking-wide">
                        Training Progress
                    </div>
                    <span class="text-gray-300 text-xs font-medium bg-gray-800 bg-opacity-50 px-2 py-1 rounded ml-2">
                        Article ${currentIndex + 1} of ${totalArticles}
                    </span>
                </div>
                
                <!-- Progress Bar Container -->
                <div class="bg-white/20 h-2 rounded-full overflow-hidden shadow-inner">
                    <div class="
                        bg-gradient-to-r from-emerald-500 to-emerald-400 
                        h-full 
                        rounded-full
                        transition-all duration-300 ease-out
                        shadow-sm
                    " style="width: ${((currentIndex + 1) / totalArticles) * 100}%"></div>
                </div>
                
                <!-- Progress Percentage -->
                <div class="text-gray-400 text-xs text-center mt-2 font-medium">
                    <span class="text-emerald-300">${Math.round(((currentIndex + 1) / totalArticles) * 100)}%</span>
                    Complete
                </div>
            </div>
        `;
    }
}
