export class BrowserApp {
    static createContent() {
        return `
            <div class="h-full flex flex-col">
                <div class="bg-gray-700 p-2 border-b border-gray-600 flex items-center space-x-3">
                    <div class="flex space-x-1">
                        <button class="px-1.5 py-1 bg-gray-600 border border-gray-500 rounded text-white text-xs hover:bg-gray-500 transition-colors duration-200 cursor-pointer"><i class="bi bi-arrow-left"></i></button>
                        <button class="px-1.5 py-1 bg-gray-600 border border-gray-500 rounded text-white text-xs hover:bg-gray-500 transition-colors duration-200 cursor-pointer"><i class="bi bi-arrow-right"></i></button>
                        <button class="px-1.5 py-1 bg-gray-600 border border-gray-500 rounded text-white text-xs hover:bg-gray-500 transition-colors duration-200 cursor-pointer"><i class="bi bi-arrow-clockwise"></i></button>
                    </div>                    <div class="flex-1">
                        <input type="text" value="https://suspicious-site.com" readonly class="w-full px-3 py-1 bg-black border border-gray-600 rounded text-white text-xs font-mono" id="browser-url-bar">
                    </div>
                </div>
                <div class="flex-1 overflow-auto bg-white" id="browser-content">
                    <div class="p-5 text-center text-black">
                        <h2 class="text-2xl font-bold text-red-600 mb-4" id="scam-headline">🎉 CONGRATULATIONS! YOU'VE WON! 🎉</h2>
                        <p class="mb-4">Click here to claim your $1,000,000 prize!</p>
                        <button class="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded font-bold text-lg animate-pulse hover:scale-105 transition-transform duration-200" id="scam-button">CLAIM NOW!</button>
                        <p class="text-sm text-gray-600 mt-2" id="fake-disclaimer">* No catch, totally legitimate *</p>
                    </div>
                </div>
            </div>
        `;
    }
}
