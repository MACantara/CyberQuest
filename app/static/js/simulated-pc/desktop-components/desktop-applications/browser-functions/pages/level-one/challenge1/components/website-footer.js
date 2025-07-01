export class WebsiteFooter {
    static render() {
        return `
            <!-- Website Footer -->
            <footer class="bg-gray-800 text-white mt-12">
                <div class="container mx-auto px-4 py-8">
                    <div class="grid md:grid-cols-4 gap-6">
                        <div>
                            <h4 class="font-bold mb-3 text-white">Daily Politico News</h4>
                            <p class="text-sm text-gray-300 mb-2">Your trusted source for breaking political news and exclusive investigations.</p>
                            <p class="text-xs text-gray-400">Established 2023</p>
                        </div>
                        <div>
                            <h4 class="font-bold mb-3">Sections</h4>
                            <ul class="text-sm text-gray-300 space-y-1">
                                <li><a href="#" class="hover:text-white transition-colors">Breaking News</a></li>
                                <li><a href="#" class="hover:text-white transition-colors">Politics</a></li>
                                <li><a href="#" class="hover:text-white transition-colors">Investigations</a></li>
                                <li><a href="#" class="hover:text-white transition-colors">Exclusive Reports</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="font-bold mb-3">About</h4>
                            <ul class="text-sm text-gray-300 space-y-1">
                                <li><a href="#" class="hover:text-white transition-colors">Our Team</a></li>
                                <li><a href="#" class="hover:text-white transition-colors">Editorial Standards</a></li>
                                <li><a href="#" class="hover:text-white transition-colors">Contact Us</a></li>
                                <li><a href="#" class="hover:text-white transition-colors">Advertise</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="font-bold mb-3">Legal</h4>
                            <ul class="text-sm text-gray-300 space-y-1">
                                <li><a href="#" class="hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#" class="hover:text-white transition-colors">Terms of Service</a></li>
                                <li><a href="#" class="hover:text-white transition-colors">Disclaimer</a></li>
                                <li><a href="#" class="hover:text-white transition-colors">Copyright</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="border-t border-gray-700 mt-6 pt-4 flex flex-col md:flex-row justify-between items-center">
                        <p class="text-xs text-gray-400">© 2024 Daily Politico News. All rights reserved.</p>
                        <div class="flex space-x-4 mt-2 md:mt-0">
                            <span class="text-xs text-gray-400">📧 tips@daily-politico-news.com</span>
                            <span class="text-xs text-gray-400">📞 1-800-NEWS-TIP</span>
                        </div>
                    </div>
                </div>
            </footer>
        `;
    }
}
