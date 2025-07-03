import { FileTypeDetector } from './file-type-detector.js';
import { LogViewerApp } from '../file-viewer-apps/log-viewer-app.js';

export class FileOpener {
    static async openFile(fileName, fileData, fileContent, registry) {
        const fileType = FileTypeDetector.getFileType(fileName);
        
        try {
            switch (fileType) {
                case 'log':
                    return this.openLogFile(fileName, fileData, fileContent);
                case 'image':
                    return this.openImageFile(fileName, fileData, fileContent);
                case 'pdf':
                    return this.openPdfFile(fileName, fileData, fileContent);
                case 'text':
                    return this.openTextFile(fileName, fileData, fileContent);
                case 'executable':
                    return this.openExecutableFile(fileName, fileData, fileContent);
                default:
                    return this.openTextFile(fileName, fileData, fileContent);
            }
        } catch (error) {
            console.error(`Error opening file ${fileName}:`, error);
            this.showErrorDialog(fileName, error.message);
            return null;
        }
    }
    
    static openLogFile(fileName, fileData, fileContent) {
        console.log(`Opening log file: ${fileName} with LogViewerApp`);
        
        // Create and initialize the log viewer app
        const logViewer = new LogViewerApp(fileName, fileData, fileContent);
        logViewer.initialize();
        
        return logViewer;
    }
    
    static openImageFile(fileName, fileData, fileContent) {
        console.log(`Opening image file: ${fileName}`);
        
        // For now, show a placeholder dialog
        this.showInfoDialog('Image Viewer', `Opening image: ${fileName}\n\nImage viewer not yet implemented.`);
        return null;
    }
    
    static openPdfFile(fileName, fileData, fileContent) {
        console.log(`Opening PDF file: ${fileName}`);
        
        // For now, show a placeholder dialog
        this.showInfoDialog('PDF Viewer', `Opening PDF: ${fileName}\n\nPDF viewer not yet implemented.`);
        return null;
    }
    
    static openTextFile(fileName, fileData, fileContent) {
        console.log(`Opening text file: ${fileName}`);
        
        // For now, show content in a simple dialog
        this.showTextDialog(fileName, fileContent);
        return null;
    }
    
    static openExecutableFile(fileName, fileData, fileContent) {
        console.log(`Opening executable file: ${fileName}`);
        
        if (FileTypeDetector.isSuspiciousType(fileName, fileData)) {
            this.showSecurityWarning(fileName);
        } else {
            this.showInfoDialog('Executable Runner', `Running: ${fileName}\n\nExecutable runner not yet implemented.`);
        }
        return null;
    }
    
    static showErrorDialog(fileName, errorMessage) {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
        overlay.innerHTML = `
            <div class="bg-red-800 rounded-lg p-6 max-w-md mx-4 border border-red-600">
                <div class="text-center">
                    <i class="bi bi-exclamation-triangle text-red-400 text-4xl mb-3"></i>
                    <h3 class="text-white text-lg font-semibold mb-2">Error Opening File</h3>
                    <p class="text-red-100 text-sm mb-2">File: ${fileName}</p>
                    <p class="text-red-200 text-sm mb-4">${errorMessage}</p>
                    <button onclick="this.closest('.fixed').remove()" 
                            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors cursor-pointer">
                        Close
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }
    
    static showInfoDialog(title, message) {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
        overlay.innerHTML = `
            <div class="bg-gray-800 rounded-lg p-6 max-w-md mx-4">
                <div class="text-center">
                    <i class="bi bi-info-circle text-blue-400 text-4xl mb-3"></i>
                    <h3 class="text-white text-lg font-semibold mb-2">${title}</h3>
                    <p class="text-gray-300 text-sm mb-4 whitespace-pre-line">${message}</p>
                    <button onclick="this.closest('.fixed').remove()" 
                            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer">
                        Close
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }
    
    static showTextDialog(fileName, content) {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
        overlay.innerHTML = `
            <div class="bg-gray-800 rounded-lg p-6 max-w-2xl max-h-96 mx-4">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-white text-lg font-semibold">${fileName}</h3>
                    <button onclick="this.closest('.fixed').remove()" 
                            class="text-gray-400 hover:text-white text-xl cursor-pointer">
                        <i class="bi bi-x"></i>
                    </button>
                </div>
                <div class="bg-black p-4 rounded max-h-64 overflow-auto">
                    <pre class="text-green-400 text-sm font-mono whitespace-pre-wrap">${content}</pre>
                </div>
                <div class="mt-4 text-center">
                    <button onclick="this.closest('.fixed').remove()" 
                            class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors cursor-pointer">
                        Close
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }
    
    static showSecurityWarning(fileName) {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
        overlay.innerHTML = `
            <div class="bg-red-900 rounded-lg p-6 max-w-md mx-4 border border-red-600">
                <div class="text-center">
                    <i class="bi bi-shield-exclamation text-red-400 text-4xl mb-3"></i>
                    <h3 class="text-white text-lg font-semibold mb-2">Security Warning</h3>
                    <p class="text-red-100 text-sm mb-2">File: ${fileName}</p>
                    <p class="text-red-200 text-sm mb-4">
                        This file has been flagged as suspicious and may contain malware. 
                        Execution has been blocked for your safety.
                    </p>
                    <div class="space-y-2">
                        <button onclick="this.closest('.fixed').remove()" 
                                class="block w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors cursor-pointer">
                            Block & Close
                        </button>
                        <button onclick="alert('Quarantine feature not implemented yet'); this.closest('.fixed').remove()" 
                                class="block w-full px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors cursor-pointer">
                            Quarantine File
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }
    
    // Static method to check if a file should use log viewer
    static shouldUseLogViewer(fileName) {
        return FileTypeDetector.shouldUseLogViewer(fileName);
    }
    
    // Method to get file content from registry
    static getFileContent(fileName, filePath, registry) {
        try {
            return registry.getFileContent(filePath, fileName);
        } catch (error) {
            console.error(`Error getting file content for ${fileName}:`, error);
            return `Error loading file content: ${error.message}`;
        }
    }
}
