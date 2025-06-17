export class WelcomeScreen {
    constructor(container, levelData = null) {
        this.container = container;
        this.levelData = levelData;
        this.setupContainer();
    }

    setupContainer() {
        this.container.className = 'fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center text-white font-sans overflow-hidden';
    }

    async show() {
        return new Promise((resolve) => {
            this.container.innerHTML = '';
            this.createWelcomeScreen();
            
            // Auto-proceed after 4 seconds, or when user clicks continue
            const autoTimeout = setTimeout(() => {
                resolve();
            }, 4000);

            // Allow manual continue
            const continueBtn = this.container.querySelector('#continue-btn');
            if (continueBtn) {
                continueBtn.addEventListener('click', () => {
                    clearTimeout(autoTimeout);
                    resolve();
                });
            }
        });
    }

    createWelcomeScreen() {
        // Create animated background
        this.createAnimatedBackground();

        // Main welcome content
        const welcomeContent = document.createElement('div');
        welcomeContent.className = 'flex flex-col items-center justify-center z-10 relative max-w-4xl mx-auto px-8';
        welcomeContent.innerHTML = `
            <!-- OS Logo and Branding -->
            <div class="text-center mb-8 opacity-0 animate-fade-in-up" style="animation-delay: 0.3s;">
                <div class="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                    <i class="bi bi-shield-check text-4xl text-white relative z-10"></i>
                </div>
                <h1 class="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Welcome to CyberOS
                </h1>
                <p class="text-xl text-blue-200 mb-2">Advanced Security Training Platform</p>
                <div class="flex items-center justify-center space-x-4 text-sm text-gray-400">
                    <span>🛡️ Secure Environment</span>
                    <span>•</span>
                    <span>🎮 Interactive Learning</span>
                    <span>•</span>
                    <span>🏆 Real-world Skills</span>
                </div>
            </div>

            <!-- Mission Briefing -->
            <div class="text-center mb-8 opacity-0 animate-fade-in-up" style="animation-delay: 0.5s;">
                <div class="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30 shadow-2xl">
                    <h2 class="text-2xl font-bold mb-4 text-blue-300">
                        ${this.getMissionTitle()}
                    </h2>
                    <p class="text-lg text-gray-300 mb-6 leading-relaxed">
                        ${this.getMissionDescription()}
                    </p>
                    
                    <!-- Mission Stats -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div class="bg-blue-900/30 rounded-lg p-4 border border-blue-400/20">
                            <div class="text-2xl font-bold text-green-400">${this.getMissionXP()}</div>
                            <div class="text-sm text-gray-400">XP Reward</div>
                        </div>
                        <div class="bg-purple-900/30 rounded-lg p-4 border border-purple-400/20">
                            <div class="text-2xl font-bold text-purple-400">${this.getMissionDifficulty()}</div>
                            <div class="text-sm text-gray-400">Difficulty</div>
                        </div>
                        <div class="bg-orange-900/30 rounded-lg p-4 border border-orange-400/20">
                            <div class="text-2xl font-bold text-orange-400">${this.getMissionTime()}</div>
                            <div class="text-sm text-gray-400">Est. Time</div>
                        </div>
                    </div>

                    <!-- Mission Objectives -->
                    <div class="text-left bg-gray-900/40 rounded-lg p-6 border border-gray-600/30">
                        <h3 class="text-lg font-semibold text-yellow-400 mb-3 flex items-center">
                            <i class="bi bi-target mr-2"></i>
                            Mission Objectives:
                        </h3>
                        <ul class="space-y-2 text-gray-300">
                            ${this.getMissionObjectives().map(obj => `
                                <li class="flex items-start">
                                    <i class="bi bi-check-circle text-green-400 mr-2 mt-0.5 flex-shrink-0"></i>
                                    <span>${obj}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            </div>

            <!-- System Status -->
            <div class="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 mb-8 opacity-0 animate-fade-in-up" style="animation-delay: 0.7s;">
                <div class="flex items-center space-x-2 text-green-400">
                    <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span class="text-sm">Security Systems: Online</span>
                </div>
                <div class="flex items-center space-x-2 text-blue-400">
                    <div class="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                    <span class="text-sm">Training Environment: Ready</span>
                </div>
                <div class="flex items-center space-x-2 text-purple-400">
                    <div class="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                    <span class="text-sm">Monitoring: Active</span>
                </div>
            </div>

            <!-- Continue Button -->
            <div class="text-center opacity-0 animate-fade-in-up" style="animation-delay: 0.9s;">
                <button id="continue-btn" class="group bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold px-8 py-4 rounded-xl shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500/25">
                    <span class="flex items-center">
                        <i class="bi bi-play-circle mr-3 text-xl"></i>
                        <span>Begin Mission</span>
                        <i class="bi bi-arrow-right ml-3 group-hover:translate-x-1 transition-transform duration-200"></i>
                    </span>
                </button>
                <p class="text-sm text-gray-400 mt-4">
                    Auto-continuing in <span class="countdown text-blue-400 font-mono">4</span> seconds...
                </p>
            </div>

            <!-- Footer Info -->
            <div class="absolute bottom-4 left-4 text-xs text-gray-500 opacity-0 animate-fade-in-up" style="animation-delay: 1.1s;">
                <div>Agent ID: ${this.getAgentId()}</div>
                <div>Security Clearance: Training</div>
                <div>Session: ${this.getSessionId()}</div>
            </div>

            <div class="absolute bottom-4 right-4 text-xs text-gray-500 opacity-0 animate-fade-in-up" style="animation-delay: 1.3s;">
                <div>CyberOS v2.1.0</div>
                <div>Build: 2025.01.20</div>
                <div>© CyberQuest Labs</div>
            </div>
        `;

        this.container.appendChild(welcomeContent);
        this.startCountdown();
    }

    createAnimatedBackground() {
        const bgContainer = document.createElement('div');
        bgContainer.className = 'absolute inset-0 overflow-hidden';

        // Animated grid
        const grid = document.createElement('div');
        grid.className = 'absolute inset-0 opacity-10';
        grid.style.backgroundImage = `
            linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
        `;
        grid.style.backgroundSize = '60px 60px';
        grid.style.animation = 'grid-slide 20s linear infinite';

        // Floating orbs
        for (let i = 0; i < 15; i++) {
            const orb = document.createElement('div');
            orb.className = 'absolute rounded-full opacity-20';
            orb.style.width = `${Math.random() * 100 + 20}px`;
            orb.style.height = orb.style.width;
            orb.style.left = `${Math.random() * 100}%`;
            orb.style.top = `${Math.random() * 100}%`;
            orb.style.background = `radial-gradient(circle, ${['#3b82f6', '#10b981', '#8b5cf6'][i % 3]}, transparent)`;
            orb.style.animation = `float ${5 + Math.random() * 10}s ease-in-out infinite`;
            orb.style.animationDelay = `${Math.random() * 5}s`;
            bgContainer.appendChild(orb);
        }

        bgContainer.appendChild(grid);
        this.container.appendChild(bgContainer);
    }

    startCountdown() {
        const countdownElement = this.container.querySelector('.countdown');
        if (!countdownElement) return;

        let count = 4;
        const interval = setInterval(() => {
            count--;
            if (countdownElement) {
                countdownElement.textContent = count.toString();
            }
            if (count <= 0) {
                clearInterval(interval);
            }
        }, 1000);
    }

    // Helper methods to get mission data
    getMissionTitle() {
        if (this.levelData && this.levelData.name) {
            return `Mission: ${this.levelData.name}`;
        }
        return 'CyberSecurity Training Mission';
    }

    getMissionDescription() {
        if (this.levelData && this.levelData.description) {
            return this.levelData.description;
        }
        return 'Welcome to your cybersecurity training mission. You will face real-world scenarios designed to test and improve your digital security skills.';
    }

    getMissionXP() {
        return this.levelData?.xp_reward || '100';
    }

    getMissionDifficulty() {
        return this.levelData?.difficulty || 'Beginner';
    }

    getMissionTime() {
        return this.levelData?.estimated_time || '15 min';
    }

    getMissionObjectives() {
        if (this.levelData && this.levelData.skills) {
            return this.levelData.skills.map(skill => `Master ${skill.toLowerCase()}`);
        }
        return [
            'Complete all training scenarios',
            'Identify security threats accurately',
            'Apply best security practices',
            'Achieve minimum 80% score'
        ];
    }

    getAgentId() {
        return `AGT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    }

    getSessionId() {
        return `SES-${Date.now().toString(36).toUpperCase()}`;
    }
}
