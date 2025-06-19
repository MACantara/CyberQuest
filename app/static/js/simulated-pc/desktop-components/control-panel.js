export class ControlPanel {
    constructor(container, windowManager, desktop = null) {
        this.container = container;
        this.windowManager = windowManager;
        this.desktop = desktop;
        this.init();
    }

    init() {
        this.createControlPanel();
        this.bindEvents();
    }

    createControlPanel() {
        this.panelElement = document.createElement('div');
        this.panelElement.className = 'absolute top-5 right-5 bg-gray-800 border border-gray-600 rounded-lg p-4 shadow-xl min-w-48';
        this.panelElement.innerHTML = `
            <h3 class="text-green-400 text-sm font-bold mb-4 pb-1 border-b border-gray-600">Mission Control</h3>
            <button class="control-button w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 mb-2 text-xs text-left hover:bg-gray-600 hover:shadow-lg transition-all duration-200" id="help-btn">
                <i class="bi bi-question-circle mr-2"></i> Help
            </button>
            <button class="control-button w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 mb-2 text-xs text-left hover:bg-gray-600 hover:shadow-lg transition-all duration-200" id="hint-btn">
                <i class="bi bi-lightbulb mr-2"></i> Hint
            </button>
            <button class="control-button w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 text-xs text-left hover:bg-gray-600 hover:shadow-lg transition-all duration-200" id="progress-btn">
                <i class="bi bi-clipboard-data mr-2"></i> Progress
            </button>
        `;
        
        this.container.appendChild(this.panelElement);
    }

    bindEvents() {
        this.panelElement.querySelector('#help-btn').addEventListener('click', () => {
            this.windowManager.createWindow('help', 'Help', this.createHelpContent(), {
                width: '60%',
                height: '50%'
            });
        });

        this.panelElement.querySelector('#hint-btn').addEventListener('click', () => {
            this.windowManager.createWindow('hint', 'Hint', this.createHintContent(), {
                width: '50%',
                height: '40%'
            });
        });

        this.panelElement.querySelector('#progress-btn').addEventListener('click', () => {
            this.windowManager.createWindow('progress', 'Progress', this.createProgressContent(), {
                width: '55%',
                height: '45%'
            });
        });
    }

    createHelpContent() {
        return `
            <div class="p-5 text-white">
                <h3 class="text-xl font-bold text-green-400 mb-4">CyberQuest Training Help</h3>
                <div class="space-y-4">
                    <div>
                        <h4 class="text-lg font-semibold text-blue-400 mb-2">Navigation</h4>
                        <ul class="list-disc list-inside space-y-1 text-gray-300">
                            <li>Double-click desktop icons to open applications</li>
                            <li>Use the taskbar to switch between windows</li>
                            <li>Drag windows by their title bar to move them</li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="text-lg font-semibold text-blue-400 mb-2">Mission Controls</h4>
                        <ul class="list-disc list-inside space-y-1 text-gray-300">
                            <li><strong>Help:</strong> Show this help dialog</li>
                            <li><strong>Hint:</strong> Get guidance for current task</li>
                            <li><strong>Progress:</strong> View your mission progress</li>
                            <li><strong>Exit:</strong> Leave the simulation</li>
                        </ul>
                    </div>
                    <div class="pt-4 border-t border-gray-600">
                        <button onclick="window.restartTutorial()" class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors duration-200 flex items-center justify-center">
                            <i class="bi bi-arrow-clockwise mr-2"></i>
                            Restart Tutorial
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    restartTutorial() {
        if (this.desktop && this.desktop.tutorial) {
            // Clear any localStorage flag and restart tutorial
            localStorage.removeItem('cyberquest_tutorial_completed');
            this.desktop.tutorial.start();
        } else {
            console.error('Tutorial not available');
        }
    }

    createHintContent() {
        return `
            <div class="p-5 text-white">
                <h3 class="text-xl font-bold text-yellow-400 mb-4">💡 Training Hint</h3>
                <div class="bg-gray-700 rounded-lg p-4 border-l-4 border-yellow-400">
                    <p class="mb-3">Look for suspicious emails in the inbox. Pay attention to:</p>
                    <ul class="list-disc list-inside space-y-1 text-gray-300">
                        <li>Sender addresses that look fake</li>
                        <li>Urgent language and grammar mistakes</li>
                        <li>Requests for personal information</li>
                        <li>Suspicious attachments or links</li>
                    </ul>
                </div>
            </div>
        `;
    }

    createProgressContent() {
        return `
            <div class="p-5 text-white">
                <h3 class="text-xl font-bold text-purple-400 mb-4">📊 Mission Progress</h3>
                <div class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-gray-700 rounded-lg p-3">
                            <div class="text-sm text-gray-400">Tasks Completed:</div>
                            <div class="text-lg font-bold text-green-400">2/5</div>
                        </div>
                        <div class="bg-gray-700 rounded-lg p-3">
                            <div class="text-sm text-gray-400">Threats Identified:</div>
                            <div class="text-lg font-bold text-blue-400">1</div>
                        </div>
                        <div class="bg-gray-700 rounded-lg p-3">
                            <div class="text-sm text-gray-400">Score:</div>
                            <div class="text-lg font-bold text-yellow-400">75/100</div>
                        </div>
                        <div class="bg-gray-700 rounded-lg p-3">
                            <div class="text-sm text-gray-400">Time Remaining:</div>
                            <div class="text-lg font-bold text-red-400">15:30</div>
                        </div>
                    </div>
                    <div class="bg-gray-700 rounded-lg p-3">
                        <div class="text-sm text-gray-400 mb-2">Overall Progress</div>
                        <div class="w-full bg-gray-600 rounded-full h-3">
                            <div class="bg-gradient-to-r from-green-400 to-blue-400 h-3 rounded-full transition-all duration-500" style="width: 40%"></div>
                        </div>
                        <div class="text-xs text-gray-400 mt-1">40% Complete</div>
                    </div>
                </div>
            </div>
        `;
    }
}
