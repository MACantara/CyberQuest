import { BasePage } from '../../base-page.js';
import { EventHandlers } from './utils/event-handlers.js';

class Challenge1PageClass extends BasePage {
    constructor() {
        super({
            url: 'https://daily-politico-news.com/breaking-news',
            title: 'BREAKING: Senator Johnson Hacking Scandal - Daily Politico News',
            ipAddress: '192.0.2.47',
            securityLevel: 'suspicious',
            security: {
                isHttps: false,
                hasValidCertificate: false,
                threats: ['Phishing attempt', 'Suspicious domain'],
                riskFactors: [
                    'No HTTPS',
                    'New domain (registered 2 weeks ago)',
                    'Sensational headline',
                    'No author information',
                    'No contact information'
                ]
            }
        });
        
        this.eventHandlers = new EventHandlers(this);
    }

    createContent() {
        return `
            <div class="min-h-screen bg-white">
                ${this.renderWebsiteHeader()}
                
                <!-- Main Content -->
                <div class="container mx-auto px-4 py-6">
                    <!-- Trending Alert Bar -->
                    <div class="mb-6 bg-gradient-to-r from-red-500 to-orange-500 text-white p-3 rounded-lg">
                        <div class="flex items-center justify-center">
                            <span class="animate-pulse mr-2">🔥</span>
                            <span class="font-bold">TRENDING NOW:</span>
                            <span class="ml-2">This story is going VIRAL! Over 50K shares in the last hour!</span>
                        </div>
                    </div>

                    <div class="grid lg:grid-cols-3 gap-6">
                        <!-- Main Article -->
                        <div class="lg:col-span-2">
                            ${this.renderArticleContent()}
                            ${this.renderVerificationTools()}
                        </div>

                        <!-- Sidebar -->
                        <div class="lg:col-span-1">
                            ${this.renderSidebar()}
                        </div>
                    </div>
                </div>

                ${this.renderWebsiteFooter()}
            </div>
        `;
    }

    renderWebsiteHeader() {
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
                            <span>🌡️ 24°C</span>
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

    renderArticleContent() {
        return `
            <article class="bg-white">
                <header class="border-b border-red-200 pb-4 mb-6">
                    <div class="flex items-center mb-3">
                        <span class="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded animate-pulse">EXCLUSIVE BREAKING</span>
                        <span class="text-xs text-gray-500 ml-2">Updated 15 minutes ago</span>
                        <span class="ml-auto text-xs text-red-600 font-bold">👀 47,832 views</span>
                    </div>
                    <h1 class="text-4xl font-bold text-black leading-tight">SENATOR JOHNSON'S PRIVATE EMAILS HACKED: EXPLOSIVE REVELATIONS</h1>
                    <div class="flex items-center justify-between mt-4">
                        <p class="text-gray-500">By <span class="font-medium">Staff Reporter</span> | <span id="article-date">${new Date().toLocaleDateString()}</span></p>
                        <div class="flex space-x-2">
                            <span class="bg-gray-100 text-black text-xs px-2 py-1 rounded">#EmailGate</span>
                            <span class="bg-gray-100 text-black text-xs px-2 py-1 rounded">#Corruption</span>
                        </div>
                    </div>
                </header>

                <div class="prose max-w-none">
                    <div class="float-right ml-6 mb-4 w-1/3 bg-gray-100 p-4 rounded-lg">
                        <img src="/static/images/level-one/senator-johnson.jpeg" alt="Senator Johnson" class="w-full h-auto rounded mb-2">
                        <p class="text-sm text-gray-600 italic">Senator Johnson in a private meeting (allegedly)</p>
                    </div>

                    <p class="lead text-lg font-medium mb-4 text-black"><strong>EXCLUSIVE:</strong> In a shocking turn of events, anonymous hackers have breached the personal email account of Senator Michael Johnson, revealing damning evidence of corruption and collusion with foreign powers.</p>
                    
                    <h2 class="text-2xl font-bold mt-6 mb-3 text-black">The Leaked Documents</h2>
                    <p class="mb-4 text-black">According to the leaked emails, Senator Johnson has been secretly communicating with representatives from a foreign government, promising political favors in exchange for financial contributions to his campaign.</p>
                    
                    <div class="bg-gray-50 p-4 my-6 border border-gray-300 rounded-lg">
                        <h3 class="font-semibold text-gray-800 mb-3 flex items-center">
                            <i class="bi bi-envelope text-gray-600 mr-2"></i>
                            Leaked Email Communication
                        </h3>
                        <div class="bg-white border border-gray-200 rounded p-4 font-mono text-sm">
                            <div class="border-b border-gray-200 pb-2 mb-3">
                                <div class="flex items-center mb-1">
                                    <span class="text-gray-600 text-xs w-16">From:</span>
                                    <span class="text-black">mj.senate@email-server.gov</span>
                                </div>
                                <div class="flex items-center mb-1">
                                    <span class="text-gray-600 text-xs w-16">To:</span>
                                    <span class="text-black">delegate.kozlov@international-affairs.org</span>
                                </div>
                                <div class="flex items-center mb-1">
                                    <span class="text-gray-600 text-xs w-16">Date:</span>
                                    <span class="text-black">October 15, 2024, 11:47 PM</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="text-gray-600 text-xs w-16">Subject:</span>
                                    <span class="text-black">Re: Infrastructure Discussion - Phase 2</span>
                                </div>
                            </div>
                            <div class="text-black">
                                <p class="mb-2">Dmitri,</p>
                                <p class="mb-2">The committee meeting went as expected. The energy bill will be on the floor next Tuesday.</p>
                                <p class="mb-2">As we discussed, the time has come to move forward with our arrangement. The consulting payment of $2.5M will be processed through the usual channels within 48 hours of the vote.</p>
                                <p class="mb-2">Remember - discretion is key. No direct communication until after the legislation passes.</p>
                                <p class="mb-2">The Senator appreciates your organization's continued partnership.</p>
                                <p class="mt-4">- MJ</p>
                                <div class="mt-4 pt-2 border-t border-gray-200 text-xs text-gray-500">
                                    <p>CONFIDENTIAL - This email contains privileged and confidential information</p>
                                </div>
                            </div>
                        </div>
                        <p class="text-sm text-gray-600 mt-2 italic">- Email allegedly from Senator Johnson's private account, leaked by anonymous hackers</p>
                    </div>

                    <h2 class="text-2xl font-bold mt-8 mb-3 text-black">What This Means for the Election</h2>
                    <p class="mb-4 text-black">With the election just weeks away, this scandal could have devastating consequences for Senator Johnson's campaign. Political analysts suggest this could lead to his immediate resignation.</p>
                    <p class="mb-4 text-black">The emails also mention several other high-profile politicians who may be involved in the conspiracy.</p>

                    <div class="bg-red-50 p-4 my-6 rounded-lg border border-red-200">
                        <h3 class="font-bold text-red-700 mb-2">URGENT: YOUR ACTION NEEDED</h3>
                        <p class="text-red-700 mb-3">Share this story immediately to spread awareness about government corruption! The mainstream media won't report on this!</p>
                        <div class="flex space-x-2">
                            <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm flex items-center transition-colors">
                                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
                                Tweet
                            </button>
                            <button class="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded text-sm flex items-center transition-colors">
                                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path></svg>
                                Share
                            </button>
                            <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm flex items-center transition-colors">
                                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"></path></svg>
                                WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        `;
    }

    renderVerificationTools() {
        return `
            <!-- Investigation Tools -->
            <section class="bg-gray-50 p-6 rounded-lg">
                <h2 class="text-xl font-semibold mb-4">Investigation Tools</h2>
                <p class="text-gray-600 mb-6">Use these tools to verify the authenticity of this news story.</p>
                
                <div class="grid md:grid-cols-2 gap-6 mb-6">
                    <div class="bg-white p-4 border border-gray-200 rounded-lg hover:border-blue-400 transition-colors shadow-sm">
                        <h3 class="font-semibold text-lg mb-2 flex items-center">
                            <i class="bi bi-search text-blue-500 mr-2"></i>
                            Cross-Reference Tool
                        </h3>
                        <p class="text-sm text-gray-600 mb-3">Check if other credible news sources are reporting this story</p>
                        <button id="cross-reference-tool" 
                                class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm transition-colors duration-200 cursor-pointer"
                                data-url="https://fact-checker.cyberquest.academy/cross-reference">
                            Cross-Reference Story
                        </button>
                    </div>
                    
                    <div class="bg-white p-4 border border-gray-200 rounded-lg hover:border-green-400 transition-colors shadow-sm">
                        <h3 class="font-semibold text-lg mb-2 flex items-center">
                            <i class="bi bi-shield-check text-green-500 mr-2"></i>
                            Source Analysis
                        </h3>
                        <p class="text-sm text-gray-600 mb-3">Analyze the credibility and history of this website</p>
                        <button class="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm transition-colors duration-200 cursor-pointer">
                            Analyze Source
                        </button>
                    </div>
                </div>

                <!-- Analysis Form -->
                <div class="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 class="font-semibold mb-3">Your Analysis</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                What did you discover about this story?
                            </label>
                            <textarea class="w-full p-2 border border-gray-300 rounded text-sm" 
                                      rows="3" 
                                      placeholder="Describe your findings from the verification tools..."
                                      id="analysis-notes"></textarea>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Is this story credible?
                            </label>
                            <div class="space-y-2">
                                <div class="flex items-center">
                                    <input type="radio" id="credible-yes" name="credibility" value="yes" class="mr-2">
                                    <label for="credible-yes" class="text-sm">Yes, it appears to be legitimate news</label>
                                </div>
                                <div class="flex items-center">
                                    <input type="radio" id="credible-no" name="credibility" value="no" class="mr-2">
                                    <label for="credible-no" class="text-sm">No, this appears to be misinformation</label>
                                </div>
                                <div class="flex items-center">
                                    <input type="radio" id="credible-unsure" name="credibility" value="unsure" class="mr-2">
                                    <label for="credible-unsure" class="text-sm">I need more information to decide</label>
                                </div>
                            </div>
                        </div>
                        
                        <button id="submit-analysis" 
                                class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded transition-colors duration-200 cursor-pointer">
                            Submit Analysis
                        </button>
                    </div>
                </div>
            </section>
        `;
    }

    renderSidebar() {
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

    renderWebsiteFooter() {
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

    bindEvents(contentElement) {
        this.eventHandlers.bindAllEvents(contentElement);
    }

    // Create page object compatible with existing system
    toPageObject() {
        const pageInstance = this;
        return {
            url: this.url,
            title: this.title,
            ipAddress: this.ipAddress,
            securityLevel: this.securityLevel,
            security: this.security,
            createContent: () => this.createContent(),
            bindEvents: (contentElement) => pageInstance.bindEvents(contentElement)
        };
    }
}

export const Challenge1Page = new Challenge1PageClass().toPageObject();
