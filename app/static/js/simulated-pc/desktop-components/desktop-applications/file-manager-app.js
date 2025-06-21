export class FileManagerApp {
    static createContent() {
        return `
        <div class="h-full flex flex-col bg-gray-800">
                <div class="bg-gray-700 p-2 border-b border-gray-600 flex items-center space-x-2 flex-shrink-0" id="file-toolbar">
                    <button class="px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-xs hover:bg-gray-500 transition-colors duration-200 cursor-pointer" id="back-btn"><i class="bi bi-arrow-left"></i></button>
                    <button class="px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-xs hover:bg-gray-500 transition-colors duration-200 cursor-pointer" id="forward-btn"><i class="bi bi-arrow-right"></i></button>
                    <button class="px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-xs hover:bg-gray-500 transition-colors duration-200 cursor-pointer" id="home-btn"><i class="bi bi-house"></i></button>
                    <div class="flex-1 px-3 py-1 bg-black border border-gray-600 rounded text-white text-xs font-mono" id="address-bar">/home/trainee</div>
                </div>
                <div class="flex-1 p-4 overflow-y-auto" id="file-grid">
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-max">
                        <div class="flex flex-col items-center p-3 rounded hover:bg-gray-700 cursor-pointer transition-colors duration-200 max-w-24" id="documents-folder">
                            <i class="bi bi-folder text-4xl text-blue-400 mb-2 max-h-12 flex items-center justify-center"></i>
                            <span class="text-xs text-white text-center break-words leading-tight">Documents</span>
                        </div>
                        <div class="flex flex-col items-center p-3 rounded hover:bg-gray-700 cursor-pointer transition-colors duration-200 max-w-24" id="downloads-folder">
                            <i class="bi bi-folder text-4xl text-blue-400 mb-2 max-h-12 flex items-center justify-center"></i>
                            <span class="text-xs text-white text-center break-words leading-tight">Downloads</span>
                        </div>
                        <div class="flex flex-col items-center p-3 rounded hover:bg-gray-700 cursor-pointer transition-colors duration-200 border border-red-500 bg-red-900 bg-opacity-20 max-w-24" id="suspicious-file">
                            <i class="bi bi-file-text text-4xl text-red-400 mb-2 animate-pulse max-h-12 flex items-center justify-center"></i>
                            <span class="text-xs text-red-400 text-center break-words leading-tight">suspicious_file.txt</span>
                        </div>
                        <div class="flex flex-col items-center p-3 rounded hover:bg-gray-700 cursor-pointer transition-colors duration-200 max-w-24" id="readme-file">
                            <i class="bi bi-file-text text-4xl text-gray-400 mb-2 max-h-12 flex items-center justify-center"></i>
                            <span class="text-xs text-white text-center break-words leading-tight">readme.txt</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
