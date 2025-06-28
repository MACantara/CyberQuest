// TODO: Replace the multiple choice practice scenario into a practical example

import { BasePage } from '../base-page.js';

class Challenge2PageClass extends BasePage {
    constructor() {
        super({
            url: 'https://cyberquest.academy/level/1/challenge2',
            title: 'Source Comparison - CyberQuest Academy',
            ipAddress: '198.51.100.15',
            securityLevel: 'secure',
            security: {
                isHttps: true,
                hasValidCertificate: true,
                certificate: {
                    valid: true,
                    issuer: 'CyberQuest Academy',
                    expires: BasePage.generateCertExpiration(12),
                    algorithm: 'RSA-2048',
                    trusted: true
                }
            }
        });
    }

    createContent() {
        return `
            <div class="p-6 text-gray-800 bg-white">
                <header class="border-b border-gray-200 pb-4 mb-6">
                    <h1 class="text-2xl font-bold text-gray-900">Source Comparison Exercise</h1>
                    <p class="text-gray-600">Analyze and compare different news sources about the same event</p>
                </header>

                <div class="prose max-w-none">
                    <section class="mb-8">
                        <h2 class="text-xl font-semibold mb-4">The Incident</h2>
                        <p class="mb-4">The following three articles all report on the same event: a protest that took place outside City Hall yesterday. Your task is to analyze each source and identify any discrepancies or signs of bias.</p>
                    </section>

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
                            </div>
                        </div>
                    </div>

                    <section class="bg-gray-50 p-6 rounded-lg mb-8">
                        <h2 class="text-xl font-semibold mb-4">Analysis Questions</h2>
                        
                        <div class="space-y-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">1. What are the key differences in how each source reports the number of protesters?</label>
                                <textarea class="w-full p-2 border border-gray-300 rounded" rows="2"></textarea>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">2. How does the language used in each article influence the reader's perception of the event?</label>
                                <textarea class="w-full p-2 border border-gray-300 rounded" rows="2"></textarea>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">3. Which source appears to be the most reliable? Why?</label>
                                <div class="space-y-2 mt-2">
                                    <div class="flex items-center">
                                        <input type="radio" id="reliable1" name="reliable" value="metro" class="mr-2">
                                        <label for="reliable1">Metro Daily News</label>
                                    </div>
                                    <div class="flex items-center">
                                        <input type="radio" id="reliable2" name="reliable" value="clarion" class="mr-2">
                                        <label for="reliable2">The Daily Clarion</label>
                                    </div>
                                    <div class="flex items-center">
                                        <input type="radio" id="reliable3" name="reliable" value="citypress" class="mr-2">
                                        <label for="reliable3">City Press Online</label>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">4. What additional information would you need to get a complete picture of what actually happened?</label>
                                <textarea class="w-full p-2 border border-gray-300 rounded" rows="2"></textarea>
                            </div>
                        </div>
                        
                        <div class="mt-6 flex justify-between">
                            <button id="hintBtn" class="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer">
                                Need a hint?
                            </button>
                            <button id="submitBtn" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded transition-colors duration-200 cursor-pointer">
                                Submit Analysis
                            </button>
                        </div>
                    </section>
                    
                    <div id="hintSection" class="hidden bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400 mb-6">
                        <h3 class="font-semibold text-yellow-800 mb-2">Hint: Look for Specifics</h3>
                        <p class="text-yellow-700">Pay attention to specific numbers, direct quotes, and whether the sources provide verifiable details. Reliable sources will often include specific numbers, names, and direct quotes from participants or officials.</p>
                    </div>
                </div>
            </div>
            
            <script>
                document.getElementById('hintBtn').addEventListener('click', function() {
                    const hintSection = document.getElementById('hintSection');
                    hintSection.classList.toggle('hidden');
                });
            </script>
        `;
    }
}

export const Challenge2Page = new Challenge2PageClass().toPageObject();
