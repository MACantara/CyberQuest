export class Taskbar {
    constructor(container, windowManager) {
        this.container = container;
        this.windowManager = windowManager;
        this.init();
    }

    init() {
        this.createTaskbar();
        this.startClock();
        this.bindEvents();
    }

    createTaskbar() {
        this.taskbarElement = document.createElement('div');
        this.taskbarElement.className = 'absolute bottom-0 left-0 w-full h-12 bg-gray-800 border-t border-gray-600 flex items-center px-2.5 shadow-lg';
        this.taskbarElement.innerHTML = `
            <button class="bg-gray-700 border border-gray-600 text-white px-4 py-2 text-xs font-mono hover:bg-green-400 hover:text-black transition-all duration-200 hover:shadow-lg" id="start-btn">
                <i class="bi bi-grid-3x3-gap mr-1"></i> Start
            </button>
            <div class="flex-1 flex items-center space-x-2.5 ml-5" id="taskbar-items"></div>
            <div class="flex items-center space-x-4">
                <span class="text-gray-300 text-xs text-center leading-tight" id="system-clock"></span>
            </div>
        `;
        
        this.container.appendChild(this.taskbarElement);
    }

    bindEvents() {
        // Start button functionality - now includes exit simulation
        const startBtn = this.taskbarElement.querySelector('#start-btn');
        startBtn.addEventListener('click', () => {
            this.exitSimulation();
        });
    }

    exitSimulation() {
        if (confirm('Are you sure you want to exit the simulation?')) {
            window.dispatchEvent(new CustomEvent('exitSimulation'));
        }
    }

    addWindow(id, title, iconClass) {
        const taskbarItems = this.taskbarElement.querySelector('#taskbar-items');
        const taskbarItem = document.createElement('button');
        taskbarItem.className = 'bg-gray-700 border border-gray-600 text-white px-3 py-1.5 text-xs hover:bg-gray-600 transition-colors duration-200 rounded';
        taskbarItem.dataset.windowId = id;
        taskbarItem.innerHTML = `<i class="bi ${iconClass} mr-1"></i> ${title}`;
        
        taskbarItem.addEventListener('click', () => {
            this.windowManager.toggleWindow(id);
        });
        
        taskbarItems.appendChild(taskbarItem);
        return taskbarItem;
    }

    removeWindow(id) {
        const taskbarItem = this.taskbarElement.querySelector(`[data-window-id="${id}"]`);
        if (taskbarItem) {
            taskbarItem.remove();
        }
    }

    setWindowActive(id, active) {
        const taskbarItem = this.taskbarElement.querySelector(`[data-window-id="${id}"]`);
        if (taskbarItem) {
            if (active) {
                taskbarItem.classList.add('bg-green-400', 'text-black');
                taskbarItem.classList.remove('bg-gray-700', 'text-white');
            } else {
                taskbarItem.classList.remove('bg-green-400', 'text-black');
                taskbarItem.classList.add('bg-gray-700', 'text-white');
            }
        }
    }

    startClock() {
        const updateClock = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
            });
            const dateString = now.toLocaleDateString([], {
                month: '2-digit',
                day: '2-digit'
            });
            
            const clockElement = this.taskbarElement.querySelector('#system-clock');
            if (clockElement) {
                clockElement.innerHTML = `${timeString}<br>${dateString}`;
            }
        };

        updateClock();
        setInterval(updateClock, 1000);
    }
}
