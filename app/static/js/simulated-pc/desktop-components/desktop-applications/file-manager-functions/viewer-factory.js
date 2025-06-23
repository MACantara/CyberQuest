import { FileTypeDetector } from './file-type-detector.js';

export class ViewerFactory {
    static async createViewer(fileName, fileData, fileContent) {
        const fileType = FileTypeDetector.getFileType(fileName);
        
        switch (fileType) {
            case 'executable':
                const { ExecutableViewerApp } = await import('../file-viewer-apps/executable-viewer-app.js');
                return new ExecutableViewerApp(fileName, fileData, fileContent);
                
            case 'pdf':
                const { PdfViewerApp } = await import('../file-viewer-apps/pdf-viewer-app.js');
                return new PdfViewerApp(fileName, fileData, fileContent);
                
            case 'image':
                const { ImageViewerApp } = await import('../file-viewer-apps/image-viewer-app.js');
                return new ImageViewerApp(fileName, fileData, fileContent);
                
            case 'log':
                const { LogViewerApp } = await import('../file-viewer-apps/log-viewer-app.js');
                return new LogViewerApp(fileName, fileData, fileContent);
                
            case 'text':
            default:
                const { TextViewerApp } = await import('../file-viewer-apps/text-viewer-app.js');
                return new TextViewerApp(fileName, fileData, fileContent);
        }
    }
    
    static getViewerType(fileName) {
        return FileTypeDetector.getFileType(fileName);
    }
    
    static getSupportedTypes() {
        return ['text', 'pdf', 'image', 'executable', 'log', 'archive'];
    }
    
    static isTypeSupported(fileName) {
        const type = FileTypeDetector.getFileType(fileName);
        return this.getSupportedTypes().includes(type);
    }
}
