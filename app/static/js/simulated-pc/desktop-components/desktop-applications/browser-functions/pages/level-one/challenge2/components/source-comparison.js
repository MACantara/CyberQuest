export class SourceComparison {
    static render() {
        return `
            <div class="grid md:grid-cols-3 gap-6 mb-8">
                <!-- Source 1 -->
                <div class="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <div class="bg-blue-50 p-3 border-b border-gray-200">
                        <h3 class="font-semibold">Metro Daily News</h3>
                        <p class="text-xs text-gray-500">Est. 1985 • 4.2★ Trust Rating</p>
                    </div>
                    <div class="p-4">
                        <h4 class="font-semibold text-lg mb-2">Peaceful Protest at City Hall</h4>
                        <p class="text-sm text-gray-700 mb-3">Approximately 200-300 protesters gathered outside City Hall yesterday to voice their concerns about the new environmental policy. The demonstration remained peaceful throughout the day, with organizers working closely with local authorities.</p>
                        <p class="text-xs text-gray-500">By Sarah Johnson • 14 hours ago</p>
                        <button class="mt-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 cursor-pointer" 
                                data-source="metro" 
                                onclick="window.challenge2Instance.analyzeSource('metro')">
                            Analyze Source
                        </button>
                    </div>
                </div>

                <!-- Source 2 -->
                <div class="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <div class="bg-red-50 p-3 border-b border-gray-200">
                        <h3 class="font-semibold">The Daily Clarion</h3>
                        <p class="text-xs text-gray-500">Est. 1972 • 3.8★ Trust Rating</p>
                    </div>
                    <div class="p-4">
                        <h4 class="font-semibold text-lg mb-2">Chaos Erupts at City Hall</h4>
                        <p class="text-sm text-gray-700 mb-3">Violent clashes broke out as more than 1,000 angry demonstrators stormed City Hall yesterday, forcing officials to call in riot police. The mayor's new environmental policy has sparked outrage across the city, with many calling for immediate action.</p>
                        <p class="text-xs text-gray-500">By Michael Chen • 10 hours ago</p>
                        <button class="mt-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200 cursor-pointer" 
                                data-source="clarion" 
                                onclick="window.challenge2Instance.analyzeSource('clarion')">
                            Analyze Source
                        </button>
                    </div>
                </div>

                <!-- Source 3 -->
                <div class="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <div class="bg-green-50 p-3 border-b border-gray-200">
                        <h3 class="font-semibold">City Press Online</h3>
                        <p class="text-xs text-gray-500">Est. 2005 • 4.5★ Trust Rating</p>
                    </div>
                    <div class="p-4">
                        <h4 class="font-semibold text-lg mb-2">City Hall Protest Draws Mixed Reactions</h4>
                        <p class="text-sm text-gray-700 mb-3">An estimated 500 people participated in yesterday's demonstration at City Hall. While the majority of the protest was peaceful, minor scuffles were reported when a small group attempted to enter the building. Police confirmed three arrests for disorderly conduct.</p>
                        <p class="text-xs text-gray-500">By Jamal Williams • 12 hours ago</p>
                        <button class="mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200 cursor-pointer" 
                                data-source="citypress" 
                                onclick="window.challenge2Instance.analyzeSource('citypress')">
                            Analyze Source
                        </button>
                    </div>
                </div>
            </div>

            <!-- Source Analysis Modal -->
            <div id="source-analysis-modal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div class="bg-white rounded-lg p-6 max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold" id="modal-title">Source Analysis</h3>
                        <button onclick="window.challenge2Instance.closeModal()" class="text-gray-500 hover:text-gray-700">
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>
                    <div id="modal-content"></div>
                </div>
            </div>
        `;
    }

    static getSourceData() {
        return {
            metro: {
                name: 'Metro Daily News',
                credibility: 'High',
                analysis: `
                    <div class="space-y-4">
                        <div class="bg-green-50 p-3 rounded">
                            <h4 class="font-semibold text-green-800">Credibility Assessment: High</h4>
                            <ul class="text-sm text-green-700 mt-2 space-y-1">
                                <li>✓ Established publication (1985)</li>
                                <li>✓ Specific, measurable details (200-300 protesters)</li>
                                <li>✓ Neutral, factual language</li>
                                <li>✓ Author byline provided</li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="font-semibold">Language Analysis:</h4>
                            <p class="text-sm text-gray-700">Uses measured terms like "approximately" and "remained peaceful." No emotionally charged language detected.</p>
                        </div>
                        <div>
                            <h4 class="font-semibold">Source Attribution:</h4>
                            <p class="text-sm text-gray-700">References cooperation with local authorities, suggesting official sources were consulted.</p>
                        </div>
                    </div>
                `
            },
            clarion: {
                name: 'The Daily Clarion',
                credibility: 'Low',
                analysis: `
                    <div class="space-y-4">
                        <div class="bg-red-50 p-3 rounded">
                            <h4 class="font-semibold text-red-800">Credibility Assessment: Low</h4>
                            <ul class="text-sm text-red-700 mt-2 space-y-1">
                                <li>⚠ Sensationalized headline</li>
                                <li>⚠ Inflated numbers (1,000 vs others' 200-500)</li>
                                <li>⚠ Emotional, inflammatory language</li>
                                <li>⚠ No specific source attribution</li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="font-semibold">Language Analysis:</h4>
                            <p class="text-sm text-gray-700">Uses charged terms: "violent clashes," "angry demonstrators," "stormed." Language designed to provoke emotion rather than inform.</p>
                        </div>
                        <div>
                            <h4 class="font-semibold">Fact Checking:</h4>
                            <p class="text-sm text-gray-700">Claims of "riot police" and "violent clashes" contradict other sources. No evidence provided for these claims.</p>
                        </div>
                    </div>
                `
            },
            citypress: {
                name: 'City Press Online',
                credibility: 'High',
                analysis: `
                    <div class="space-y-4">
                        <div class="bg-green-50 p-3 rounded">
                            <h4 class="font-semibold text-green-800">Credibility Assessment: High</h4>
                            <ul class="text-sm text-green-700 mt-2 space-y-1">
                                <li>✓ Balanced reporting tone</li>
                                <li>✓ Official police confirmation cited</li>
                                <li>✓ Specific, verifiable details (3 arrests)</li>
                                <li>✓ Acknowledges both peaceful and problematic aspects</li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="font-semibold">Language Analysis:</h4>
                            <p class="text-sm text-gray-700">Neutral language with qualifying phrases like "minor scuffles" and "small group." Avoids sensationalism.</p>
                        </div>
                        <div>
                            <h4 class="font-semibold">Source Attribution:</h4>
                            <p class="text-sm text-gray-700">Directly cites police confirmation for arrest numbers, showing verification of claims.</p>
                        </div>
                    </div>
                `
            }
        };
    }
}
