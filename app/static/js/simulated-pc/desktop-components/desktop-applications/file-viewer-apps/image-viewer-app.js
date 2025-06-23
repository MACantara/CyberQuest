import { WindowBase } from '../../window-base.js';

export class ImageViewerApp extends WindowBase {
    constructor(fileName, fileData, fileContent) {
        super(`image-viewer-${fileName}`, `Image Viewer - ${fileName}`, {
            width: '70%',
            height: '70%'
        });
        
        this.fileName = fileName;
        this.fileData = fileData;
        this.fileContent = fileContent;
        this.zoomLevel = 100;
        this.rotation = 0;
    }

    createContent() {
        return `
            <div class="h-full flex flex-col bg-gray-800">
                <!-- Image Toolbar -->
                <div class="bg-gray-700 p-2 border-b border-gray-600 flex items-center justify-between flex-shrink-0">
                    <div class="flex items-center space-x-3">
                        <i class="bi bi-file-image text-green-400 text-xl"></i>
                        <div>
                            <h3 class="text-white text-sm font-semibold">${this.fileName}</h3>
                            <p class="text-gray-400 text-xs">${this.fileData.size || 'Unknown size'} • ${this.getImageFormat()}</p>
                        </div>
                    </div>
                    
                    <div class="flex items-center space-x-2">
                        <button id="zoom-fit-btn" class="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors text-xs cursor-pointer">
                            Fit
                        </button>
                        <button id="zoom-actual-btn" class="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors text-xs cursor-pointer">
                            1:1
                        </button>
                        <button id="zoom-out-btn" class="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors text-xs cursor-pointer">
                            <i class="bi bi-zoom-out"></i>
                        </button>
                        <span class="text-white text-xs min-w-12 text-center" id="zoom-level">${this.zoomLevel}%</span>
                        <button id="zoom-in-btn" class="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors text-xs cursor-pointer">
                            <i class="bi bi-zoom-in"></i>
                        </button>
                        <div class="w-px h-6 bg-gray-600 mx-2"></div>
                        <button id="rotate-left-btn" class="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors text-xs cursor-pointer">
                            <i class="bi bi-arrow-counterclockwise"></i>
                        </button>
                        <button id="rotate-right-btn" class="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors text-xs cursor-pointer">
                            <i class="bi bi-arrow-clockwise"></i>
                        </button>
                    </div>
                </div>
                
                <!-- Image Content Area -->
                <div class="flex-1 overflow-auto bg-gray-900 flex items-center justify-center relative" id="image-container">
                    ${this.createImageContent()}
                </div>
                
                <!-- Status Bar -->
                <div class="bg-gray-700 p-2 border-t border-gray-600 flex justify-between items-center text-xs text-gray-300 flex-shrink-0">
                    <div class="flex items-center space-x-4">
                        <span>Format: ${this.getImageFormat()}</span>
                        <span>Dimensions: ${this.getImageDimensions()}</span>
                        <span>Color Depth: 24-bit</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <span>Zoom: ${this.zoomLevel}%</span>
                        <span>Rotation: ${this.rotation}°</span>
                    </div>
                </div>
            </div>
        `;
    }

    createImageContent() {
        // Generate appropriate image content based on filename
        const imageUrl = this.getImageUrl();
        const isSuspicious = this.fileData.suspicious;
        
        return `
            <div class="text-center p-8" id="image-display">
                <div class="inline-block" style="transform: scale(${this.zoomLevel / 100}) rotate(${this.rotation}deg);">
                    ${isSuspicious ? this.createSuspiciousImageWarning() : ''}
                    <div class="bg-white p-4 rounded-lg shadow-lg">
                        <img src="${imageUrl}" 
                             alt="${this.fileName}" 
                             class="max-w-full h-auto rounded border border-gray-300"
                             style="max-width: 600px; max-height: 400px;"
                             onload="this.style.opacity = '1'" 
                             style="opacity: 0; transition: opacity 0.3s;"
                             onerror="this.parentElement.innerHTML = this.parentElement.innerHTML.replace(this.outerHTML, '<div class=\\'text-center p-8 border border-gray-300 rounded bg-gray-100\\'><i class=\\'bi bi-file-image text-gray-400 text-6xl mb-2\\'></i><p class=\\'text-gray-600\\'>Image preview not available</p><p class=\\'text-gray-500 text-sm\\'>Simulated: ${this.fileName}</p></div>')">
                        <div class="mt-2 text-sm text-gray-600">
                            <strong>${this.fileName}</strong><br>
                            ${this.getImageDimensions()} • ${this.getImageFormat()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createSuspiciousImageWarning() {
        return `
            <div class="bg-red-100 border border-red-400 rounded p-3 mb-4 text-left">
                <div class="flex items-center space-x-2">
                    <i class="bi bi-exclamation-triangle text-red-600"></i>
                    <span class="text-red-800 font-semibold">Suspicious Image File</span>
                </div>
                <p class="text-red-700 text-sm mt-1">
                    This image file has been flagged as potentially suspicious. 
                    It may contain hidden malware or be used for social engineering.
                </p>
            </div>
        `;
    }

    getImageUrl() {
        // Map specific filenames to appropriate picsum.photos images
        const imageMap = {
            'conference_2024.jpg': 'https://picsum.photos/600/400?random=1', // Business/conference
            'team_meeting.png': 'https://picsum.photos/600/400?random=2', // Office/meeting
            'security_awareness.gif': 'https://picsum.photos/600/400?random=3', // Tech/security themed
            'vacation_photo.jpg': 'https://picsum.photos/600/400?random=4', // Nature/vacation
            'network_topology.svg': 'https://picsum.photos/600/400?random=5', // Technical diagram
            'suspicious_attachment.jpg': 'https://picsum.photos/600/400?random=6', // Generic image
            'profile_photo.jpg': 'https://picsum.photos/400/400?random=7', // Square profile
            'network_diagram.png': 'https://picsum.photos/800/600?random=8', // Wide technical
            'system_screenshot.png': 'https://picsum.photos/1024/768?random=9' // Screenshot ratio
        };

        // Use mapped URL or generate based on dimensions and filename hash
        if (imageMap[this.fileName]) {
            return imageMap[this.fileName];
        }

        // Generate a consistent random seed based on filename
        const hash = this.fileName.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        const seed = Math.abs(hash) % 100;

        // Get dimensions for the image
        const dimensions = this.getImageDimensions();
        if (dimensions === 'Vector') {
            return `https://picsum.photos/600/400?random=${seed}`;
        }

        const [width, height] = dimensions.split(' × ').map(d => parseInt(d));
        return `https://picsum.photos/${width}/${height}?random=${seed}`;
    }

    getImageFormat() {
        const ext = this.fileName.toLowerCase().split('.').pop();
        const formats = {
            'jpg': 'JPEG',
            'jpeg': 'JPEG',
            'png': 'PNG',
            'gif': 'GIF',
            'bmp': 'BMP',
            'svg': 'SVG',
            'webp': 'WebP',
            'tiff': 'TIFF',
            'ico': 'ICO'
        };
        return formats[ext] || 'Unknown';
    }

    getImageDimensions() {
        // Simulated dimensions based on file type
        const ext = this.fileName.toLowerCase().split('.').pop();
        const dimensions = {
            'jpg': '1920 × 1080',
            'jpeg': '1920 × 1080',
            'png': '1024 × 768',
            'gif': '800 × 600',
            'bmp': '1280 × 720',
            'svg': 'Vector',
            'webp': '1920 × 1080',
            'tiff': '2048 × 1536',
            'ico': '32 × 32'
        };
        return dimensions[ext] || '800 × 600';
    }

    initialize() {
        super.initialize();
        this.bindImageViewerEvents();
    }

    bindImageViewerEvents() {
        const windowElement = this.windowElement;
        if (!windowElement) return;

        const zoomInBtn = windowElement.querySelector('#zoom-in-btn');
        const zoomOutBtn = windowElement.querySelector('#zoom-out-btn');
        const zoomFitBtn = windowElement.querySelector('#zoom-fit-btn');
        const zoomActualBtn = windowElement.querySelector('#zoom-actual-btn');
        const rotateLeftBtn = windowElement.querySelector('#rotate-left-btn');
        const rotateRightBtn = windowElement.querySelector('#rotate-right-btn');

        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => this.zoomIn());
        }

        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => this.zoomOut());
        }

        if (zoomFitBtn) {
            zoomFitBtn.addEventListener('click', () => this.zoomToFit());
        }

        if (zoomActualBtn) {
            zoomActualBtn.addEventListener('click', () => this.zoomActual());
        }

        if (rotateLeftBtn) {
            rotateLeftBtn.addEventListener('click', () => this.rotateLeft());
        }

        if (rotateRightBtn) {
            rotateRightBtn.addEventListener('click', () => this.rotateRight());
        }
    }

    zoomIn() {
        if (this.zoomLevel < 400) {
            this.zoomLevel += 25;
            this.updateDisplay();
        }
    }

    zoomOut() {
        if (this.zoomLevel > 25) {
            this.zoomLevel -= 25;
            this.updateDisplay();
        }
    }

    zoomToFit() {
        this.zoomLevel = 75; // Simulated fit zoom
        this.updateDisplay();
    }

    zoomActual() {
        this.zoomLevel = 100;
        this.updateDisplay();
    }

    rotateLeft() {
        this.rotation = (this.rotation - 90) % 360;
        this.updateDisplay();
    }

    rotateRight() {
        this.rotation = (this.rotation + 90) % 360;
        this.updateDisplay();
    }

    updateDisplay() {
        const zoomLevelSpan = this.windowElement?.querySelector('#zoom-level');
        const imageContainer = this.windowElement?.querySelector('#image-container');
        const statusBar = this.windowElement?.querySelector('.bg-gray-700:last-child');
        
        if (zoomLevelSpan) {
            zoomLevelSpan.textContent = `${this.zoomLevel}%`;
        }
        
        if (imageContainer) {
            imageContainer.innerHTML = this.createImageContent();
        }
        
        // Update status bar
        if (statusBar) {
            const zoomStatus = statusBar.querySelector('span:last-child');
            if (zoomStatus) {
                zoomStatus.innerHTML = `Zoom: ${this.zoomLevel}% • Rotation: ${this.rotation}°`;
            }
        }
    }
}
