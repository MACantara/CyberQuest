export class Sidebar {
    static render() {
        return `
            <!-- More Breaking News -->
            <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <h3 class="font-bold text-red-800 mb-3 flex items-center">
                    <span class="animate-pulse mr-2">🚨</span>
                    MORE BREAKING NEWS
                </h3>
                <div class="space-y-3">
                    <div class="text-sm">
                        <p class="font-medium text-black">SHOCKING: Mayor's Secret Offshore Accounts Revealed</p>
                        <p class="text-gray-600 text-xs">2 hours ago • 12K shares</p>
                    </div>
                    <div class="text-sm">
                        <p class="font-medium text-black">EXCLUSIVE: Celebrity Scandal Rocks Hollywood</p>
                        <p class="text-gray-600 text-xs">4 hours ago • 8K shares</p>
                    </div>
                    <div class="text-sm">
                        <p class="font-medium text-black">BREAKING: Tech Giant's Dark Secret Exposed</p>
                        <p class="text-gray-600 text-xs">6 hours ago • 15K shares</p>
                    </div>
                </div>
            </div>

            <!-- Newsletter Signup -->
            <div class="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-6">
                <h3 class="font-bold text-black mb-2">📰 Get Exclusive Updates!</h3>
                <p class="text-sm text-gray-600 mb-3">Be the first to know about breaking scandals and corruption!</p>
                <input type="email" placeholder="Your email..." class="w-full p-2 border border-gray-300 rounded text-sm mb-2">
                <button class="w-full bg-red-600 text-white py-2 rounded text-sm hover:bg-red-700 transition-colors">
                    Subscribe Now
                </button>
            </div>

            <!-- Social Media -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <h3 class="font-bold text-black mb-3">📱 Follow Us</h3>
                <div class="space-y-2">
                    <button class="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700 transition-colors">
                        📘 Facebook - 2.3M followers
                    </button>
                    <button class="w-full bg-blue-400 text-white py-2 rounded text-sm hover:bg-blue-500 transition-colors">
                        🐦 Twitter - 1.8M followers
                    </button>
                    <button class="w-full bg-red-600 text-white py-2 rounded text-sm hover:bg-red-700 transition-colors">
                        📺 YouTube - 890K subscribers
                    </button>
                </div>
            </div>
        `;
    }
}
