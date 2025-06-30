export class SocialMediaPost {
    static render() {
        return `
            <!-- Post -->
            <div class="bg-white rounded-lg shadow p-4 mb-6">
                <div class="flex items-start mb-3">
                    <div class="w-12 h-12 bg-gray-300 rounded-full"></div>
                    <div class="ml-3">
                        <div class="font-semibold text-black">TruthSeeker42</div>
                        <div class="text-gray-500 text-sm">@realtalk_truth · 2h</div>
                    </div>
                    <button class="ml-auto text-gray-500 hover:text-gray-700">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
                        </svg>
                    </button>
                </div>
                
                <div class="mb-4">
                    <p class="text-black text-lg mb-3">🚨 BREAKING: Major pharmaceutical company ADMITS their new vaccine causes severe side effects in 87% of recipients! The mainstream media is SILENT on this! #BigPharmaLies #MedicalFreedom</p>
                    
                    <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div class="ml-3">
                                <p class="text-sm text-red-700">
                                    This claim is disputed by multiple independent fact-checking organizations. Always verify information from credible sources.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex space-x-4 text-gray-500 text-sm mb-4">
                        <button class="flex items-center hover:text-blue-500">
                            <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                            </svg>
                            2.4K
                        </button>
                        <button class="flex items-center hover:text-green-500">
                            <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                            </svg>
                            1.2K
                        </button>
                        <button class="flex items-center hover:text-red-500">
                            <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                            </svg>
                            5.7K
                        </button>
                    </div>
                    
                    <div class="border-t border-gray-200 pt-3">
                        <div class="flex items-center text-sm text-gray-500 mb-2">
                            <span>Showing 3 of 247 comments</span>
                            <button class="ml-auto text-blue-500 hover:text-blue-700">View all comments</button>
                        </div>
                        
                        <!-- Comments -->
                        <div class="space-y-3 mb-3">
                            <div class="flex items-start">
                                <div class="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
                                <div class="bg-gray-50 rounded-lg p-2 flex-1">
                                    <div class="font-semibold text-sm text-black">HealthExpert22</div>
                                    <p class="text-sm text-black">This is completely false. The study was retracted due to flawed methodology. Please stop spreading misinformation.</p>
                                </div>
                            </div>
                            
                            <div class="flex items-start">
                                <div class="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
                                <div class="bg-gray-50 rounded-lg p-2 flex-1">
                                    <div class="font-semibold text-sm text-black">ConspiracyTheorist</div>
                                    <p class="text-sm text-black">I KNEW IT! They've been lying to us all along! #WakeUpSheeple</p>
                                </div>
                            </div>
                            
                            <div class="flex items-start">
                                <div class="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
                                <div class="bg-gray-50 rounded-lg p-2 flex-1">
                                    <div class="font-semibold text-sm text-black">ScienceLover</div>
                                    <p class="text-sm text-black">Can you provide a link to the actual study? The numbers don't match any published research I've seen.</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="flex items-center mt-2">
                            <input type="text" placeholder="Write a comment..." class="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <button class="ml-2 text-blue-500 font-semibold text-sm">Post</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
