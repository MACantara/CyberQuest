export class LoadingScreen {
    constructor(container) {
        this.container = container;
        this.setupContainer();
    }

    setupContainer() {
        this.container.className = 'fixed inset-0 bg-black flex flex-col items-center justify-center text-green-400 font-mono overflow-hidden';
    }

    async show() {
        return new Promise((resolve) => {
            this.container.innerHTML = '';
            this.createLoadingScreen();
            
            // Show loading animation for 3 seconds
            setTimeout(() => {
                resolve();
            }, 3000);
        });
    }

    createLoadingScreen() {
        // Create animated background particles
        this.createBackgroundParticles();

        // Main loading content
        const loadingContent = document.createElement('div');
        loadingContent.className = 'flex flex-col items-center justify-center z-10 relative';
        loadingContent.innerHTML = `
            <!-- OS Logo -->
            <div class="mb-8 opacity-0 animate-fade-in-up" style="animation-delay: 0.1s;">
                <div class="w-32 h-32 bg-gray-700 border-2 border-gray-600 rounded flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-200 relative overflow-hidden">
                    <div class="absolute inset-0 bg-gray-800 opacity-50 animate-pulse" style="animation-duration: 1s;"></div>
                    <div class="w-20 h-20 bg-gray-800 border border-gray-600 rounded flex items-center justify-center relative z-10">
                        <i class="bi bi-shield-check text-green-400 text-4xl animate-pulse" style="animation-duration: 1s;"></i>
                    </div>
                    <!-- Floating particles around logo -->
                    <div class="absolute top-2 left-2 w-2 h-2 bg-green-400 rounded-full animate-ping" style="animation-duration: 1s;"></div>
                    <div class="absolute bottom-3 right-3 w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce" style="animation-delay: 0.2s; animation-duration: 0.8s;"></div>
                    <div class="absolute top-1/2 left-1 w-1 h-1 bg-green-400 rounded-full animate-pulse" style="animation-delay: 0.4s; animation-duration: 0.6s;"></div>
                </div>
            </div>

            <!-- OS Name and Version -->
            <div class="text-center mb-12 opacity-0 animate-fade-in-up" style="animation-delay: 0.2s;">
                <h1 class="text-5xl md:text-6xl font-bold mb-2 text-white font-mono">
                    CyberOS
                </h1>
                <p class="text-lg text-gray-400 font-mono">Version 2.1.0</p>
            </div>

            <!-- Loading Animation -->
            <div class="flex flex-col items-center opacity-0 animate-fade-in-up" style="animation-delay: 0.3s;">
                <!-- Progress Bar -->
                <div class="w-64 h-3 bg-gray-700 border border-gray-600 rounded overflow-hidden mb-6 shadow-inner">
                    <div class="h-full bg-green-400 rounded animate-loading-bar shadow-lg" style="animation-duration: 3s;"></div>
                </div>
                
                <!-- Loading Dots -->
                <div class="flex space-x-3 mb-8">
                    <div class="w-4 h-4 bg-green-400 rounded-full animate-bounce" style="animation-duration: 0.8s;"></div>
                    <div class="w-4 h-4 bg-green-400 rounded-full animate-bounce" style="animation-delay: 0.1s; animation-duration: 0.8s;"></div>
                    <div class="w-4 h-4 bg-green-400 rounded-full animate-bounce" style="animation-delay: 0.2s; animation-duration: 0.8s;"></div>
                </div>

                <!-- Loading Text -->
                <div class="text-center">
                    <p class="text-xl text-green-400 loading-text font-mono">Initializing System...</p>
                </div>
            </div>
        `;

        this.container.appendChild(loadingContent);
        this.animateLoadingText();
    }

    createBackgroundParticles() {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'absolute inset-0 overflow-hidden';

        // Create floating particles
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'absolute w-1 h-1 bg-green-400 rounded-full opacity-20';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 2}s`;
            particle.style.animationDuration = `${2 + Math.random() * 2}s`;
            particle.classList.add('animate-ping');
            particleContainer.appendChild(particle);
        }

        // Create grid pattern
        const gridPattern = document.createElement('div');
        gridPattern.className = 'absolute inset-0 opacity-5';
        gridPattern.style.backgroundImage = `
            linear-gradient(rgba(16, 185, 129, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.3) 1px, transparent 1px)
        `;
        gridPattern.style.backgroundSize = '50px 50px';
        gridPattern.style.animation = 'grid-move 6s linear infinite';

        particleContainer.appendChild(gridPattern);
        this.container.appendChild(particleContainer);
    }

    animateLoadingText() {
        const loadingTexts = [
            'Initializing System...',
            'Loading Components...',
            'Starting Environment...',
            'Preparing Interface...',
            'Almost Ready...'
        ];

        const textElement = this.container.querySelector('.loading-text');
        let currentIndex = 0;

        const updateText = () => {
            if (textElement) {
                textElement.style.opacity = '0';
                setTimeout(() => {
                    textElement.textContent = loadingTexts[currentIndex];
                    textElement.style.opacity = '1';
                    currentIndex = (currentIndex + 1) % loadingTexts.length;
                }, 150);
            }
        };

        // Update text every 500ms
        const interval = setInterval(updateText, 500);

        // Clear interval after 3 seconds
        setTimeout(() => {
            clearInterval(interval);
        }, 3000);
    }
}
