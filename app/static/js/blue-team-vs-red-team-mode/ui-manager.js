// UI Manager - Handles all user interface updates and interactions
class UIManager {
    constructor(gameController) {
        this.gameController = gameController;
        this.terminalOutput = [];
        this.maxTerminalLines = 20;
        
        console.log('🖥️ UI Manager initialized');
    }
    
    updateDisplay() {
        this.updateSystemStatus();
        this.updateAssetStatus();
        this.updateTimer();
        this.updateGameControls();
        this.updateAIDifficulty();
        this.updateAlerts();
        this.updateIncidents();
    }
    
    updateSystemStatus() {
        const gameState = this.gameController.getGameState();
        
        // Network status
        const networkStatus = document.getElementById('network-status');
        const networkText = document.getElementById('network-text');
        
        if (gameState.isRunning) {
            networkStatus?.classList.remove('bg-green-400', 'pulse-green');
            networkStatus?.classList.add('bg-orange-500', 'pulse-red');
            if (networkText) networkText.textContent = 'Under Attack';
            if (networkText) networkText.className = 'text-orange-400';
        } else {
            networkStatus?.classList.remove('bg-orange-500', 'pulse-red');
            networkStatus?.classList.add('bg-green-400', 'pulse-green');
            if (networkText) networkText.textContent = 'Secure';
            if (networkText) networkText.className = 'text-green-400';
        }
        
        // Assets status
        const assetsStatus = document.getElementById('assets-status');
        const assetsText = document.getElementById('assets-text');
        const compromisedAssets = Object.values(gameState.assets).filter(asset => asset.status === 'compromised').length;
        const vulnerableAssets = Object.values(gameState.assets).filter(asset => asset.status === 'vulnerable').length;
        
        if (compromisedAssets > 0) {
            assetsStatus?.classList.remove('bg-green-400', 'bg-orange-500');
            assetsStatus?.classList.add('bg-red-500');
            if (assetsText) assetsText.textContent = 'Compromised';
            if (assetsText) assetsText.className = 'text-red-400';
        } else if (vulnerableAssets > 0) {
            assetsStatus?.classList.remove('bg-green-400', 'bg-red-500');
            assetsStatus?.classList.add('bg-orange-500');
            if (assetsText) assetsText.textContent = 'Vulnerable';
            if (assetsText) assetsText.className = 'text-orange-400';
        } else {
            assetsStatus?.classList.remove('bg-red-500', 'bg-orange-500');
            assetsStatus?.classList.add('bg-green-400');
            if (assetsText) assetsText.textContent = 'Protected';
            if (assetsText) assetsText.className = 'text-green-400';
        }
        
        // Alerts count
        const alertsCount = document.getElementById('alerts-count');
        const activeAlerts = gameState.alerts.filter(alert => alert.status === 'detected').length;
        
        if (alertsCount) {
            alertsCount.textContent = `${activeAlerts} Active`;
            alertsCount.className = activeAlerts > 0 ? 'text-red-400' : 'text-gray-300';
        }
        
        const alertsStatus = document.getElementById('alerts-status');
        if (activeAlerts > 0) {
            alertsStatus?.classList.remove('bg-gray-500');
            alertsStatus?.classList.add('bg-red-500', 'pulse-red');
        } else {
            alertsStatus?.classList.remove('bg-red-500', 'pulse-red');
            alertsStatus?.classList.add('bg-gray-500');
        }
    }
    
    updateAssetStatus() {
        const gameState = this.gameController.getGameState();
        const assetStatusContainer = document.getElementById('asset-status');
        
        if (!assetStatusContainer) return;
        
        assetStatusContainer.innerHTML = '';
        
        Object.entries(gameState.assets).forEach(([name, asset]) => {
            const statusClass = this.getAssetStatusClass(asset.status);
            const displayName = this.formatAssetName(name);
            
            const assetElement = document.createElement('div');
            assetElement.className = `flex items-center justify-between p-3 bg-gray-700 border border-gray-600`;
            assetElement.innerHTML = `
                <div class="flex items-center space-x-2">
                    <span class="text-sm font-medium text-white">${displayName}</span>
                    <div class="w-16 bg-gray-600 rounded-full h-2">
                        <div class="h-2 rounded-full ${statusClass.bar}" style="width: ${asset.integrity}%"></div>
                    </div>
                </div>
                <span class="text-xs px-2 py-1 ${statusClass.badge} rounded-full">${asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}</span>
            `;
            
            assetStatusContainer.appendChild(assetElement);
            
            // Update network map nodes
            const networkNode = document.querySelector(`[data-asset="${name}"]`);
            if (networkNode) {
                networkNode.className = `network-node p-4 rounded-lg border-2 cursor-pointer hover:bg-gray-600 transition-colors ${statusClass.node}`;
            }
        });
    }
    
    getAssetStatusClass(status) {
        const classes = {
            'secure': {
                badge: 'bg-green-400 text-black',
                bar: 'bg-green-400',
                node: 'bg-gray-700 border-green-400',
                text: 'text-white'
            },
            'vulnerable': {
                badge: 'bg-orange-400 text-black',
                bar: 'bg-orange-400',
                node: 'bg-gray-700 border-orange-400',
                text: 'text-white'
            },
            'compromised': {
                badge: 'bg-red-400 text-black',
                bar: 'bg-red-400',
                node: 'bg-gray-700 border-red-400',
                text: 'text-white'
            }
        };
        
        return classes[status] || classes['secure'];
    }
    
    formatAssetName(name) {
        return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    
    updateTimer() {
        const gameState = this.gameController.getGameState();
        const timerElement = document.getElementById('round-timer');
        
        if (timerElement) {
            const minutes = Math.floor(gameState.timeRemaining / 60);
            const seconds = gameState.timeRemaining % 60;
            const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            timerElement.textContent = timeString;
            
            // Change color based on remaining time
            if (gameState.timeRemaining < 300) { // Less than 5 minutes
                timerElement.className = 'text-red-600';
            } else if (gameState.timeRemaining < 600) { // Less than 10 minutes
                timerElement.className = 'text-orange-600';
            } else {
                timerElement.className = 'text-green-400';
            }
        }
    }
    
    updateGameControls() {
        const gameState = this.gameController.getGameState();
        const menuButton = document.getElementById('game-menu-button');
        const pauseButton = document.getElementById('pause-simulation');
        const stopButton = document.getElementById('stop-simulation');
        const resetButton = document.getElementById('reset-simulation');
        
        // Update menu button text based on game state
        if (menuButton) {
            const buttonText = menuButton.querySelector('span');
            if (buttonText) {
                buttonText.textContent = gameState.isRunning ? 'Simulation Active' : 'Simulation Paused';
            }
        }
        
        // Update button states in dropdown
        if (pauseButton) {
            pauseButton.disabled = !gameState.isRunning;
            if (gameState.isRunning) {
                pauseButton.innerHTML = '<i class="bi bi-pause-fill mr-2 text-orange-400"></i>Pause Simulation';
            } else {
                pauseButton.innerHTML = '<i class="bi bi-play-fill mr-2 text-green-400"></i>Resume Simulation';
                pauseButton.onclick = () => this.gameController.startGame();
            }
        }
        
        if (stopButton) {
            stopButton.disabled = !gameState.isRunning;
            if (!gameState.isRunning) {
                stopButton.classList.add('opacity-50');
            } else {
                stopButton.classList.remove('opacity-50');
            }
        }
    }
    
    updateAIDifficulty() {
        if (!this.gameController.aiEngine) return;
        
        const difficulty = this.gameController.aiEngine.getDifficulty();
        const difficultyBar = document.getElementById('difficulty-bar');
        const difficultyText = document.getElementById('difficulty-text');
        
        if (difficultyBar) {
            difficultyBar.style.width = `${difficulty.value}%`;
            
            // Update color based on difficulty
            difficultyBar.className = 'h-2 rounded-full transition-all duration-500';
            if (difficulty.value < 40) {
                difficultyBar.classList.add('bg-green-500');
            } else if (difficulty.value < 70) {
                difficultyBar.classList.add('bg-orange-500');
            } else {
                difficultyBar.classList.add('bg-red-500');
            }
        }
        
        if (difficultyText) {
            difficultyText.textContent = difficulty.level;
            difficultyText.className = `text-sm ${difficulty.value < 40 ? 'text-green-600' : difficulty.value < 70 ? 'text-orange-600' : 'text-red-600'}`;
        }
    }
    
    updateAITactics(tactics) {
        const tacticsElement = document.getElementById('ai-tactics');
        if (tacticsElement && tactics) {
            const formattedTactics = tactics.map(tactic => 
                tactic.charAt(0).toUpperCase() + tactic.slice(1).replace('-', ' ')
            ).join(', ');
            tacticsElement.textContent = formattedTactics;
        }
    }
    
    addAlert(alert) {
        const alertCenter = document.getElementById('alert-center');
        if (!alertCenter) return;
        
        // Remove "no alerts" message if present
        if (alertCenter.querySelector('.italic')) {
            alertCenter.innerHTML = '';
        }
        
        const severityClass = this.getSeverityClass(alert.severity);
        const alertElement = document.createElement('div');
        alertElement.className = `p-3 rounded-lg border-l-4 ${severityClass.bg} ${severityClass.border} mb-2`;
        alertElement.dataset.alertId = alert.id || Date.now();
        alertElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <div class="text-sm font-medium ${severityClass.text}">${alert.technique}</div>
                    <div class="text-xs text-white">${this.formatAssetName(alert.target)} • ${alert.timestamp.toLocaleTimeString()}</div>
                </div>
                <div class="flex items-center space-x-2">
                    <span class="text-xs px-2 py-1 ${severityClass.badge} rounded-full">${alert.severity.toUpperCase()}</span>
                    <button class="text-xs text-gray-400 hover:text-white" onclick="this.parentElement.parentElement.parentElement.remove()">
                        <i class="bi bi-x-lg cursor-pointer"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Add flash animation for new alerts
        alertElement.style.animation = 'flash 0.5s ease-in-out';
        
        alertCenter.insertBefore(alertElement, alertCenter.firstChild);
        
        // Keep only last 15 alerts (increased from 10)
        const alerts = alertCenter.children;
        if (alerts.length > 15) {
            alertCenter.removeChild(alerts[alerts.length - 1]);
        }
    }

    // Render player response buttons for a detected alert
    showResponseOptions(alert, responses = []) {
        const alertCenter = document.getElementById('alert-center');
        if (!alertCenter) return;

        // Find the alert element by data attribute
        const alertEl = alertCenter.querySelector(`[data-alert-id="${alert.id}"]`);
        if (!alertEl) return;

        // Create response container
        const responseContainer = document.createElement('div');
        responseContainer.className = 'mt-3 flex flex-wrap gap-2';

        responses.forEach(response => {
            const btn = document.createElement('button');
            btn.className = 'px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer';
            btn.textContent = response.replace('-', ' ');
            btn.addEventListener('click', () => {
                // Disable all buttons to avoid double actions
                responseContainer.querySelectorAll('button').forEach(b => b.disabled = true);
                // Call back into game controller
                try {
                    this.gameController.executePlayerResponse(alert, response);
                } catch (err) {
                    console.error('Error executing player response', err);
                }

                // Visually remove the options
                responseContainer.remove();
            });

            responseContainer.appendChild(btn);
        });

        // Append to the alert element (below the content)
        alertEl.appendChild(responseContainer);

        // Auto-hide options after 20 seconds if no selection
        setTimeout(() => {
            if (responseContainer.parentElement) responseContainer.remove();
        }, 20000);
    }
    
    getSeverityClass(severity) {
        const classes = {
            'low': {
                bg: 'bg-gray-700',
                border: 'border-blue-400',
                text: 'text-blue-400',
                badge: 'bg-blue-400 text-black'
            },
            'medium': {
                bg: 'bg-gray-700',
                border: 'border-yellow-400',
                text: 'text-yellow-400',
                badge: 'bg-yellow-400 text-black'
            },
            'high': {
                bg: 'bg-gray-700',
                border: 'border-orange-400',
                text: 'text-orange-400',
                badge: 'bg-orange-400 text-black'
            },
            'critical': {
                bg: 'bg-gray-700',
                border: 'border-red-400',
                text: 'text-red-400',
                badge: 'bg-red-400 text-black'
            }
        };
        
        return classes[severity] || classes['medium'];
    }
    
    updateAlerts() {
        const gameState = this.gameController.getGameState();
        const alertCenter = document.getElementById('alert-center');
        
        if (!alertCenter) return;
        
        // Only show "no alerts" message if there are truly no alerts at all
        const hasAnyAlerts = alertCenter.children.length > 0 && 
                           !alertCenter.querySelector('.italic');
        
        if (gameState.alerts.length === 0 && !hasAnyAlerts) {
            alertCenter.innerHTML = '<div class="text-sm text-gray-600 dark:text-gray-400 italic">No active alerts.</div>';
        }
    }
    
    addIncident(incident) {
        const incidentPanel = document.getElementById('incident-panel');
        if (!incidentPanel) return;
        
        // Remove "no incidents" message if present
        if (incidentPanel.querySelector('.italic')) {
            incidentPanel.innerHTML = '';
        }
        
        const incidentElement = document.createElement('div');
        incidentElement.className = 'p-3 bg-gray-700 border border-red-400 rounded-lg mb-2';
        incidentElement.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="bi bi-exclamation-triangle-fill text-red-400"></i>
                <div>
                    <div class="text-sm font-medium text-red-400">Security Breach Detected</div>
                    <div class="text-xs text-white">
                        ${incident.technique} affected ${this.formatAssetName(incident.target)} • 
                        ${Math.round(incident.damage)}% integrity loss • 
                        ${incident.timestamp.toLocaleTimeString()}
                    </div>
                </div>
            </div>
        `;
        
        incidentPanel.insertBefore(incidentElement, incidentPanel.firstChild);
        
        // Keep only last 5 incidents
        const incidents = incidentPanel.children;
        if (incidents.length > 5) {
            incidentPanel.removeChild(incidents[incidents.length - 1]);
        }
    }
    
    updateIncidents() {
        const gameState = this.gameController.getGameState();
        const incidentPanel = document.getElementById('incident-panel');
        
        if (!incidentPanel) return;
        
        if (gameState.incidents.length === 0) {
            incidentPanel.innerHTML = '<div class="text-sm text-gray-600 dark:text-gray-400 italic">No incidents detected. Monitoring for suspicious activity...</div>';
        }
    }
    
    addTerminalOutput(text) {
        this.terminalOutput.push(text);
        
        // Keep only last N lines
        if (this.terminalOutput.length > this.maxTerminalLines) {
            this.terminalOutput.shift();
        }
        
        this.updateTerminal();
    }
    
    updateTerminal() {
        const terminalOutput = document.getElementById('terminal-output');
        if (!terminalOutput) return;
        
        // Preserve the input line
        const inputLine = terminalOutput.querySelector('div:last-child');
        
        // Update output
        terminalOutput.innerHTML = this.terminalOutput.map(line => `<div>${line}</div>`).join('');
        
        // Re-add input line
        if (inputLine) {
            terminalOutput.appendChild(inputLine);
        }
        
        // Scroll to bottom
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
    
    clearTerminal() {
        this.terminalOutput = [];
        this.updateTerminal();
        
        // Re-add input line
        const terminalOutput = document.getElementById('terminal-output');
        if (terminalOutput) {
            const inputDiv = document.createElement('div');
            inputDiv.className = 'flex items-center';
            inputDiv.innerHTML = `
                <span>$ </span>
                <input type="text" id="terminal-input" class="bg-transparent border-none outline-none text-green-400 flex-1 ml-1" placeholder="Enter command...">
            `;
            terminalOutput.appendChild(inputDiv);
            
            // Re-attach event listener
            const input = document.getElementById('terminal-input');
            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.gameController.handleTerminalCommand(e.target.value);
                        e.target.value = '';
                    }
                });
            }
        }
    }
}

export { UIManager };
