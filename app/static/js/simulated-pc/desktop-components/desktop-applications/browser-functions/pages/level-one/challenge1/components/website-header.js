export class WebsiteHeader {
    static render() {
        return `
            <header class="bg-red-700 text-white shadow-lg">
                <div class="container mx-auto px-4">
                    <!-- Top Banner -->
                    <div class="py-2 text-center bg-red-800 text-sm">
                        <span class="animate-pulse">🚨 BREAKING NEWS ALERTS 24/7 🚨</span>
                    </div>
                    
                    <!-- Main Header -->
                    <div class="flex items-center justify-between py-4">
                        <div class="flex items-center">
                            <h1 class="text-3xl font-bold">Daily Politico News</h1>
                            <span class="ml-2 text-xs bg-yellow-400 text-black px-2 py-1 rounded">EXCLUSIVE</span>
                        </div>
                        <div class="hidden md:flex items-center space-x-6 text-sm">
                            <span>📅 ${new Date().toLocaleDateString()}</span>
                            <span>🌡️ 72°F</span>
                            <span>📊 Market: +2.1%</span>
                        </div>
                    </div>
                    
                    <!-- Navigation -->
                    <nav class="border-t border-red-600 py-3">
                        <div class="flex justify-center space-x-8 text-sm font-medium">
                            <a href="#" class="hover:text-yellow-300 transition-colors">BREAKING</a>
                            <a href="#" class="hover:text-yellow-300 transition-colors">POLITICS</a>
                            <a href="#" class="hover:text-yellow-300 transition-colors">SCANDALS</a>
                            <a href="#" class="hover:text-yellow-300 transition-colors">EXCLUSIVE</a>
                            <a href="#" class="hover:text-yellow-300 transition-colors">CORRUPTION</a>
                            <a href="#" class="hover:text-yellow-300 transition-colors">INVESTIGATIONS</a>
                        </div>
                    </nav>
                </div>
            </header>
        `;
    }
}
