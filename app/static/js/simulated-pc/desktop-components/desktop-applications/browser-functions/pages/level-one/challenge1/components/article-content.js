export class ArticleContent {
    static render() {
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
                    
                    <div class="bg-yellow-50 p-4 my-6 border-l-4 border-yellow-400">
                        <p class="font-medium text-black">"The time has come to move forward with our plan. The payment will be processed through the usual channels. - MJ"</p>
                        <p class="text-sm text-gray-600 mt-1">- Alleged email from Senator Johnson's account</p>
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
}
