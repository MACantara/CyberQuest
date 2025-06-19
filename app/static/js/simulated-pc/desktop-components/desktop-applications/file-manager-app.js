export class FileManagerApp {
    static createContent() {
        return `
            <div class="h-full flex flex-col bg-gray-800">
                <div class="bg-gray-700 p-2 border-b border-gray-600 flex items-center space-x-2">
                    <button class="px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-xs hover:bg-gray-500 transition-colors duration-200"><i class="bi bi-arrow-left"></i></button>
                    <button class="px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-xs hover:bg-gray-500 transition-colors duration-200"><i class="bi bi-arrow-right"></i></button>
                    <button class="px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-xs hover:bg-gray-500 transition-colors duration-200"><i class="bi bi-house"></i></button>
                    <div class="flex-1 px-3 py-1 bg-black border border-gray-600 rounded text-white text-xs font-mono">/home/trainee</div>
                </div>
                <div class="flex-1 p-3 grid grid-cols-4 gap-3 overflow-y-auto">
                    <div class="flex flex-col items-center p-3 rounded hover:bg-gray-700 cursor-pointer transition-colors duration-200">
                        <i class="bi bi-folder text-3xl text-blue-400 mb-2"></i>
                        <span class="text-xs text-white text-center">Documents</span>
                    </div>
                    <div class="flex flex-col items-center p-3 rounded hover:bg-gray-700 cursor-pointer transition-colors duration-200">
                        <i class="bi bi-folder text-3xl text-blue-400 mb-2"></i>
                        <span class="text-xs text-white text-center">Downloads</span>
                    </div>
                    <div class="flex flex-col items-center p-3 rounded hover:bg-gray-700 cursor-pointer transition-colors duration-200 border border-red-500 bg-red-900 bg-opacity-20">
                        <i class="bi bi-file-text text-3xl text-red-400 mb-2 animate-pulse"></i>
                        <span class="text-xs text-red-400 text-center">suspicious_file.txt</span>
                    </div>
                    <div class="flex flex-col items-center p-3 rounded hover:bg-gray-700 cursor-pointer transition-colors duration-200">
                        <i class="bi bi-file-text text-3xl text-gray-400 mb-2"></i>
                        <span class="text-xs text-white text-center">readme.txt</span>
                    </div>
                </div>
            </div>
        `;
    }
}
