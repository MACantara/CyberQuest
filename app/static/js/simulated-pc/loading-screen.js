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
            <div class="mb-8 opacity-0 animate-fade-in-up" style="animation-delay: 0.2s;">
                <div class="w-32 h-32 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300 relative overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-br from-green-400/20 to-purple-600/20 animate-pulse"></div>
                    <div class="w-20 h-20 bg-black rounded-2xl flex items-center justify-center relative z-10">
                        <i class="bi bi-shield-check text-green-400 text-4xl animate-pulse"></i>
                    </div>
                    <!-- Floating particles around logo -->
                    <div class="absolute top-2 left-2 w-2 h-2 bg-white rounded-full animate-ping"></div>
                    <div class="absolute bottom-3 right-3 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-bounce" style="animation-delay: 0.5s;"></div>
                    <div class="absolute top-1/2 left-1 w-1 h-1 bg-blue-300 rounded-full animate-pulse" style="animation-delay: 1s;"></div>
                </div>
            </div>

            <!-- OS Name and Version -->
            <div class="text-center mb-8 opacity-0 animate-fade-in-up" style="animation-delay: 0.4s;">
                <h1 class="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                    CyberOS
                </h1>
                <p class="text-lg text-gray-400 mb-2">Security Training Environment</p>
                <p class="text-sm text-gray-500">Version 2.1.0 - Build 2025.01</p>
            </div>

            <!-- Loading Animation -->
            <div class="flex flex-col items-center opacity-0 animate-fade-in-up" style="animation-delay: 0.6s;">
                <!-- Progress Bar -->
                <div class="w-64 h-2 bg-gray-800 rounded-full overflow-hidden mb-4 shadow-inner">
                    <div class="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-loading-bar shadow-lg"></div>
                </div>
                
                <!-- Loading Dots -->
                <div class="flex space-x-2 mb-6">
                    <div class="w-3 h-3 bg-green-400 rounded-full animate-bounce"></div>
                    <div class="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 0.1s;"></div>
                    <div class="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 0.2s;"></div>
                </div>

                <!-- Loading Text -->
                <div class="text-center">
                    <p class="text-lg text-green-400 mb-2 loading-text">Initializing Security Protocols...</p>
                    <p class="text-sm text-gray-500">Please wait while we prepare your training environment</p>
                </div>
            </div>

            <!-- System Info -->
            <div class="absolute bottom-8 left-8 text-xs text-gray-600 opacity-0 animate-fade-in-up" style="animation-delay: 1s;">
                <div>CyberQuest Security Labs</div>
                <div>Training Mode: Active</div>
                <div>Security Level: Maximum</div>
            </div>

            <!-- Version Info -->
            <div class="absolute bottom-8 right-8 text-xs text-gray-600 opacity-0 animate-fade-in-up" style="animation-delay: 1.2s;">
                <div>Build: 2025.01.20</div>
                <div>Kernel: CyberCore v2.1</div>
                <div>© 2025 CyberQuest</div>
            </div>
        `;

        this.container.appendChild(loadingContent);
        this.animateLoadingText();
    }

    createBackgroundParticles() {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'absolute inset-0 overflow-hidden';

        // Create floating particles
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'absolute w-1 h-1 bg-green-400 rounded-full opacity-30';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 3}s`;
            particle.style.animationDuration = `${3 + Math.random() * 4}s`;
            particle.classList.add('animate-ping');
            particleContainer.appendChild(particle);
        }

        // Create grid pattern
        const gridPattern = document.createElement('div');
        gridPattern.className = 'absolute inset-0 opacity-5';
        gridPattern.style.backgroundImage = `
            linear-gradient(rgba(34, 197, 94, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.5) 1px, transparent 1px)
        `;
        gridPattern.style.backgroundSize = '50px 50px';
        gridPattern.style.animation = 'grid-move 10s linear infinite';

        particleContainer.appendChild(gridPattern);
        this.container.appendChild(particleContainer);
    }

    animateLoadingText() {
        const loadingTexts = [
            'Initializing Security Protocols...',
            'Loading Threat Detection Systems...',
            'Calibrating Defense Matrices...',
            'Preparing Training Scenarios...',
            'Establishing Secure Connection...',
            'Finalizing Environment Setup...'
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
                }, 200);
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
