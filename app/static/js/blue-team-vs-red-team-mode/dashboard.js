// Dashboard functionality for Blue Team vs Red Team mode
class BlueTeamDashboard {
    constructor() {
        this.sessionId = null;
        this.score = 0;
        this.startTime = null;
        this.selectedHost = null;
        this.selectedAlert = null;
        this.timer = null;
        this.autoRefresh = null;
        this.csrfToken = null;
        this.gameEngine = null;
        
        this.init();
    }
    
    init() {
        this.getCsrfToken();
        this.updateTimestamp();
        this.initializeGameEngine();
        this.checkExistingSession();
        this.startAutoRefresh();
        
        // Set up event listeners when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupEventListeners();
            });
        } else {
            // DOM is already loaded
            this.setupEventListeners();
        }
    }
    
    initializeGameEngine() {
        // Initialize game engine if available
        if (typeof BlueRedGameEngine !== 'undefined') {
            this.gameEngine = new BlueRedGameEngine();
            
            // Listen for game events
            this.gameEngine.addEventListener('gameEnded', (endData) => {
                console.log('Game ended:', endData);
                showGameOverModal(endData);
            });
            
            this.gameEngine.addEventListener('stateChanged', (gameState) => {
                // Update UI based on game state changes
                this.updateUIFromGameState(gameState);
            });
            
            this.gameEngine.addEventListener('alertGenerated', (alert) => {
                // Handle new alerts from game engine
                this.handleGameAlert(alert);
            });
        }
    }
    
    updateUIFromGameState(gameState) {
        if (gameState.score !== undefined) {
            this.score = gameState.score;
            const scoreElement = document.getElementById('current-score');
            if (scoreElement) {
                scoreElement.textContent = gameState.score;
            }
        }
        
        if (gameState.hosts) {
            this.updateHostsDisplay(gameState.hosts);
        }
        
        if (gameState.alerts) {
            this.updateAlertsDisplay(gameState.alerts);
        }
    }
    
    handleGameAlert(alert) {
        // Add the alert to the UI immediately
        const alertsContainer = document.getElementById('alerts-container');
        if (alertsContainer) {
            const alertElement = document.createElement('div');
            
            let severityClasses = 'bg-orange-900 bg-opacity-50 border border-orange-500';
            if (alert.severity === 'high' || alert.severity === 'critical') {
                severityClasses = 'bg-red-900 bg-opacity-50 border border-red-500';
            } else if (alert.severity === 'low') {
                severityClasses = 'bg-green-900 bg-opacity-50 border border-green-500';
            }
            
            alertElement.className = `${severityClasses} p-2 my-0.5 rounded text-xs cursor-pointer hover:bg-opacity-70`;
            alertElement.dataset.alertId = alert.id;
            alertElement.innerHTML = `
                <div><strong>[${alert.severity.toUpperCase()}]</strong> ${alert.message}</div>
                <div>Source: ${alert.source} | Time: ${this.formatTimestamp(alert.timestamp)}</div>
            `;
            
            alertElement.addEventListener('click', () => {
                selectAlert(alert.id);
            });
            
            alertsContainer.appendChild(alertElement);
            alertsContainer.scrollTop = alertsContainer.scrollHeight;
        }
    }
    
    getCsrfToken() {
        const metaTag = document.querySelector('meta[name="csrf-token"]');
        this.csrfToken = metaTag ? metaTag.getAttribute('content') : null;
    }
    
    // Helper method for making POST requests with CSRF token
    async postRequest(url, data = {}) {
        const headers = {
            'Content-Type': 'application/json',
        };
        
        if (this.csrfToken) {
            headers['X-CSRFToken'] = this.csrfToken;
        }
        
        return fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });
    }
    
    setupEventListeners() {
        // Host selection event listeners
        this.setupHostEventListeners();
        
        // Action button event listeners
        this.setupActionButtonEventListeners();
        
        // Modal event listeners
        this.setupModalEventListeners();
    }
    
    setupHostEventListeners() {
        // Add event listeners for host cards
        document.addEventListener('click', (e) => {
            const hostCard = e.target.closest('.host-card');
            if (hostCard) {
                const hostId = hostCard.dataset.host;
                selectHost(hostId);
            }
        });
    }
    
    setupActionButtonEventListeners() {
        // Scan Network button
        const scanNetworkBtn = document.getElementById('scan-network-btn');
        if (scanNetworkBtn) {
            scanNetworkBtn.addEventListener('click', scanNetwork);
        }
        
        // Patch Systems button
        const patchBtn = document.getElementById('patch-btn');
        if (patchBtn) {
            patchBtn.addEventListener('click', patchVulnerabilities);
        }
        
        // Quarantine button
        const quarantineBtn = document.getElementById('quarantine-btn');
        if (quarantineBtn) {
            quarantineBtn.addEventListener('click', quarantineHost);
        }
        
        // Investigate button
        const investigateBtn = document.getElementById('investigate-btn');
        if (investigateBtn) {
            investigateBtn.addEventListener('click', investigateAlert);
        }
        
        // Session Summary button
        const sessionSummaryBtn = document.getElementById('session-summary-btn');
        if (sessionSummaryBtn) {
            sessionSummaryBtn.addEventListener('click', showSessionSummary);
        }
        
        // New Session button
        const newSessionBtn = document.getElementById('new-session-btn');
        if (newSessionBtn) {
            newSessionBtn.addEventListener('click', newSession);
        }
    }
    
    setupModalEventListeners() {
        // Modal close button event listeners
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-close')) {
                const modalId = e.target.dataset.modal;
                if (modalId) {
                    closeModal(modalId);
                }
            }
        });
        
        // Play Again button
        const playAgainBtn = document.getElementById('play-again-btn');
        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => {
                closeModal('game-over-modal');
                newSession();
            });
        }
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('fixed') && e.target.classList.contains('bg-black')) {
                e.target.classList.add('hidden');
            }
        });
    }
    
    async checkExistingSession() {
        try {
            const response = await fetch('/blue-vs-red/session-status');
            if (response.ok) {
                const data = await response.json();
                this.sessionId = data.session_id;
                this.score = data.score;
                this.startTime = new Date(Date.now() - (data.duration * 1000));
                this.updateUI(data);
                this.startTimer();
            } else {
                // No existing session, start a new one
                this.startNewSession();
            }
        } catch (error) {
            console.error('Error checking session:', error);
            this.startNewSession();
        }
    }
    
    async startNewSession() {
        try {
            const response = await this.postRequest('/blue-vs-red/start-session');
            
            if (response.ok) {
                const data = await response.json();
                this.sessionId = data.session_id;
                this.score = 0;
                this.startTime = new Date();
                this.updateSessionId();
                this.startTimer();
                
                // Initialize game engine with session data
                if (this.gameEngine) {
                    this.gameEngine.startGame({
                        session_id: data.session_id,
                        hosts: data.hosts || this.getDefaultHosts(),
                        score: 0,
                        ai_personality: data.ai_personality || 'aggressive'
                    });
                }
                
                this.showAlert('success', 'New Blue vs Red session started!');
            }
        } catch (error) {
            console.error('Error starting session:', error);
            this.showAlert('error', 'Failed to start new session');
        }
    }
    
    getDefaultHosts() {
        return {
            'web-server': {
                id: 'web-server',
                name: 'Web Server',
                ip: '192.168.1.10',
                services: ['HTTP', 'HTTPS'],
                status: 'online',
                compromised: false,
                vulnerabilities: ['CVE-2023-1234', 'CVE-2023-5678']
            },
            'database': {
                id: 'database',
                name: 'Database Server',
                ip: '192.168.1.20',
                services: ['MySQL'],
                status: 'online',
                compromised: false,
                vulnerabilities: ['CVE-2023-9999']
            },
            'workstation': {
                id: 'workstation',
                name: 'User Workstation',
                ip: '192.168.1.100',
                services: ['RDP', 'SMB'],
                status: 'online',
                compromised: false,
                vulnerabilities: ['CVE-2023-1111', 'CVE-2023-2222']
            }
        };
    }
    
    startTimer() {
        if (this.timer) clearInterval(this.timer);
        
        this.timer = setInterval(() => {
            if (this.startTime) {
                const elapsed = Date.now() - this.startTime.getTime();
                const minutes = Math.floor(elapsed / 60000);
                const seconds = Math.floor((elapsed % 60000) / 1000);
                const timerElement = document.getElementById('session-timer');
                if (timerElement) {
                    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                }
            }
        }, 1000);
    }
    
    startAutoRefresh() {
        if (this.autoRefresh) clearInterval(this.autoRefresh);
        
        this.autoRefresh = setInterval(async () => {
            await this.refreshSessionData();
            // Trigger AI action occasionally for demo
            if (Math.random() < 0.3) {
                await this.triggerAIAction();
            }
        }, 5000);
    }
    
    async refreshSessionData() {
        try {
            const response = await fetch('/blue-vs-red/session-status');
            if (response.ok) {
                const data = await response.json();
                this.updateUI(data);
            }
        } catch (error) {
            console.error('Error refreshing session data:', error);
        }
    }
    
    updateUI(data) {
        // Update score
        const scoreElement = document.getElementById('current-score');
        if (scoreElement) {
            scoreElement.textContent = data.score;
        }
        this.score = data.score;
        
        // Update hosts
        this.updateHostsDisplay(data.hosts);
        
        // Update alerts
        this.updateAlertsDisplay(data.alerts);
        
        // Update action buttons based on selected items
        this.updateActionButtons();
    }
    
    updateHostsDisplay(hosts) {
        Object.entries(hosts).forEach(([hostId, hostData]) => {
            const hostCard = document.querySelector(`.host-card[data-host="${hostId}"]`);
            if (hostCard) {
                const statusIndicator = hostCard.querySelector('span');
                const statusText = document.getElementById(`${hostId}-status`);
                
                // Remove existing status classes
                hostCard.classList.remove('bg-red-900', 'border-red-500', 'bg-yellow-900', 'border-yellow-500');
                statusIndicator.classList.remove('bg-green-500', 'bg-yellow-500', 'bg-red-500');
                
                if (hostData.status === 'quarantined') {
                    hostCard.classList.add('bg-yellow-900', 'bg-opacity-50', 'border-yellow-500');
                    statusIndicator.classList.add('bg-yellow-500');
                    if (statusText) statusText.textContent = 'Quarantined';
                } else if (hostData.compromised) {
                    hostCard.classList.add('bg-red-900', 'bg-opacity-50', 'border-red-500');
                    statusIndicator.classList.add('bg-red-500');
                    if (statusText) statusText.textContent = 'Compromised';
                } else {
                    statusIndicator.classList.add('bg-green-500');
                    if (statusText) statusText.textContent = 'Online';
                }
            }
        });
    }
    
    updateAlertsDisplay(alerts) {
        const alertsContainer = document.getElementById('alerts-container');
        if (!alertsContainer) return;
        
        // Keep the initial system alert and add new ones
        const existingAlerts = alertsContainer.querySelectorAll('[data-alert-id]');
        const newAlerts = alerts.slice(existingAlerts.length);
        
        newAlerts.forEach(alert => {
            const alertElement = document.createElement('div');
            
            // Set Tailwind classes based on severity
            let severityClasses = 'bg-orange-900 bg-opacity-50 border border-orange-500';
            if (alert.severity === 'high') {
                severityClasses = 'bg-red-900 bg-opacity-50 border border-red-500';
            } else if (alert.severity === 'low') {
                severityClasses = 'bg-green-900 bg-opacity-50 border border-green-500';
            }
            
            alertElement.className = `${severityClasses} p-2 my-0.5 rounded text-xs cursor-pointer hover:bg-opacity-70`;
            alertElement.dataset.alertId = alert.id;
            alertElement.innerHTML = `
                <div><strong>[${alert.severity.toUpperCase()}]</strong> ${alert.message}</div>
                <div>Source: ${alert.source} | Time: ${this.formatTimestamp(alert.timestamp)}</div>
            `;
            
            // Make alert clickable
            alertElement.addEventListener('click', () => {
                selectAlert(alert.id);
            });
            
            alertsContainer.appendChild(alertElement);
        });
        
        // Scroll to bottom to show latest alerts
        alertsContainer.scrollTop = alertsContainer.scrollHeight;
    }
    
    updateActionButtons() {
        const quarantineBtn = document.getElementById('quarantine-btn');
        const investigateBtn = document.getElementById('investigate-btn');
        
        // Enable quarantine if a host is selected and not already quarantined
        if (quarantineBtn) {
            const selectedHostCard = document.querySelector(`.host-card[data-host="${this.selectedHost}"]`);
            const isQuarantined = selectedHostCard?.classList.contains('bg-yellow-900');
            quarantineBtn.disabled = !this.selectedHost || isQuarantined;
        }
        
        // Enable investigate if host or alert is selected
        if (investigateBtn) {
            investigateBtn.disabled = !this.selectedHost && !this.selectedAlert;
        }
    }
    
    updateSessionId() {
        const sessionIdElement = document.getElementById('session-id');
        if (sessionIdElement && this.sessionId) {
            sessionIdElement.textContent = this.sessionId.split('_')[1];
        }
    }
    
    updateTimestamp() {
        document.querySelectorAll('.timestamp').forEach(element => {
            element.textContent = new Date().toLocaleTimeString();
        });
    }
    
    formatTimestamp(timestamp) {
        return new Date(timestamp).toLocaleTimeString();
    }
    
    showAlert(type, message) {
        // Create a temporary alert notification
        const alert = document.createElement('div');
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? 'rgba(0, 200, 0, 0.9)' : 'rgba(200, 0, 0, 0.9)'};
            color: white;
            border-radius: 5px;
            z-index: 10000;
            font-family: 'Courier New', monospace;
        `;
        alert.textContent = message;
        
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }
    
    async triggerAIAction() {
        try {
            const response = await this.postRequest('/blue-vs-red/ai-action');
            
            if (response.ok) {
                const data = await response.json();
                // AI action will be reflected in the next refresh
            }
        } catch (error) {
            console.error('Error triggering AI action:', error);
        }
    }
}

// Global functions for button actions
function selectHost(hostId) {
    // Remove previous selection
    document.querySelectorAll('.host-card').forEach(card => {
        card.classList.remove('ring-2', 'ring-green-500', 'ring-opacity-75');
    });
    
    // Add selection to clicked host
    const hostCard = document.querySelector(`.host-card[data-host="${hostId}"]`);
    if (hostCard) {
        hostCard.classList.add('ring-2', 'ring-green-500', 'ring-opacity-75');
        dashboard.selectedHost = hostId;
        dashboard.selectedAlert = null; // Clear alert selection
        
        // Clear alert selection visual
        document.querySelectorAll('[data-alert-id]').forEach(alert => {
            alert.classList.remove('ring-2', 'ring-orange-500', 'ring-opacity-75');
        });
        
        dashboard.updateActionButtons();
    }
}

function selectAlert(alertId) {
    // Remove previous selection
    document.querySelectorAll('[data-alert-id]').forEach(alert => {
        alert.classList.remove('ring-2', 'ring-orange-500', 'ring-opacity-75');
    });
    
    // Add selection to clicked alert
    const alertElement = document.querySelector(`[data-alert-id="${alertId}"]`);
    if (alertElement) {
        alertElement.classList.add('ring-2', 'ring-orange-500', 'ring-opacity-75');
        dashboard.selectedAlert = alertId;
        dashboard.selectedHost = null; // Clear host selection
        
        // Clear host selection visual
        document.querySelectorAll('.host-card').forEach(card => {
            card.classList.remove('ring-2', 'ring-green-500', 'ring-opacity-75');
        });
        
        dashboard.updateActionButtons();
    }
}

async function scanNetwork() {
    try {
        const response = await dashboard.postRequest('/blue-vs-red/scan-network');
        
        if (response.ok) {
            const data = await response.json();
            dashboard.showAlert('success', data.message);
            dashboard.score = data.score;
            document.getElementById('current-score').textContent = data.score;
            
            // Notify game engine
            if (dashboard.gameEngine) {
                dashboard.gameEngine.handleBlueTeamAction('scan', {});
            }
        }
    } catch (error) {
        console.error('Error scanning network:', error);
        dashboard.showAlert('error', 'Network scan failed');
    }
}

async function patchVulnerabilities() {
    try {
        const target = dashboard.selectedHost || 'all';
        const response = await dashboard.postRequest('/blue-vs-red/patch-vulnerabilities', { host: target });
        
        if (response.ok) {
            const data = await response.json();
            dashboard.showAlert('success', data.message);
            dashboard.score = data.score;
            document.getElementById('current-score').textContent = data.score;
            
            // Notify game engine
            if (dashboard.gameEngine) {
                dashboard.gameEngine.handleBlueTeamAction('patch', { 
                    host: target,
                    patchedCount: data.patchedCount || 1
                });
            }
        }
    } catch (error) {
        console.error('Error patching vulnerabilities:', error);
        dashboard.showAlert('error', 'Patching failed');
    }
}

async function quarantineHost() {
    if (!dashboard.selectedHost) {
        dashboard.showAlert('error', 'Please select a host to quarantine');
        return;
    }
    
    try {
        const response = await dashboard.postRequest('/blue-vs-red/quarantine-host', { host: dashboard.selectedHost });
        
        if (response.ok) {
            const data = await response.json();
            dashboard.showAlert('success', data.message);
            dashboard.score = data.score;
            document.getElementById('current-score').textContent = data.score;
            
            // Notify game engine
            if (dashboard.gameEngine) {
                dashboard.gameEngine.handleBlueTeamAction('quarantine', { 
                    host: dashboard.selectedHost
                });
            }
        } else {
            const error = await response.json();
            dashboard.showAlert('error', error.error);
        }
    } catch (error) {
        console.error('Error quarantining host:', error);
        dashboard.showAlert('error', 'Quarantine failed');
    }
}

async function investigateAlert() {
    if (!dashboard.selectedAlert && !dashboard.selectedHost) {
        dashboard.showAlert('error', 'Please select an alert or host to investigate');
        return;
    }
    
    try {
        const body = {};
        if (dashboard.selectedAlert) body.alert_id = dashboard.selectedAlert;
        if (dashboard.selectedHost) body.host = dashboard.selectedHost;
        
        const response = await dashboard.postRequest('/blue-vs-red/investigate-alert', body);
        
        if (response.ok) {
            const data = await response.json();
            showInvestigationResults(data.investigation_results);
            dashboard.score = data.score;
            document.getElementById('current-score').textContent = data.score;
            
            // Mark alert as handled in game engine
            if (dashboard.gameEngine && dashboard.selectedAlert) {
                const alertIndex = dashboard.gameEngine.gameState.alerts.findIndex(
                    alert => alert.id == dashboard.selectedAlert
                );
                if (alertIndex !== -1) {
                    dashboard.gameEngine.gameState.alerts[alertIndex].handled = true;
                }
                
                dashboard.gameEngine.handleBlueTeamAction('investigation', { 
                    alertId: dashboard.selectedAlert,
                    host: dashboard.selectedHost
                });
            }
        }
    } catch (error) {
        console.error('Error investigating:', error);
        dashboard.showAlert('error', 'Investigation failed');
    }
}

function showInvestigationResults(results) {
    const modal = document.getElementById('investigation-modal');
    const content = document.getElementById('investigation-content');
    
    let html = '<div class="grid grid-cols-2 gap-5">';
    
    html += '<div><h4 class="text-lg mb-2"><i class="bi bi-search"></i> Findings</h4><ul class="list-disc list-inside">';
    results.findings.forEach(finding => {
        html += `<li class="mb-1">${finding}</li>`;
    });
    html += '</ul></div>';
    
    html += '<div><h4 class="text-lg mb-2"><i class="bi bi-lightbulb"></i> Recommendations</h4><ul class="list-disc list-inside">';
    results.recommendations.forEach(rec => {
        html += `<li class="mb-1">${rec}</li>`;
    });
    html += '</ul></div>';
    
    html += '</div>';
    
    content.innerHTML = html;
    modal.classList.remove('hidden');
}

async function showSessionSummary() {
    try {
        const response = await fetch('/blue-vs-red/session-summary');
        if (response.ok) {
            const data = await response.json();
            displaySessionSummary(data);
        }
    } catch (error) {
        console.error('Error getting session summary:', error);
        dashboard.showAlert('error', 'Failed to load session summary');
    }
}

function displaySessionSummary(summary) {
    // Update summary content
    document.getElementById('final-score').textContent = summary.final_score;
    document.getElementById('detection-speed').textContent = summary.detection_speed;
    document.getElementById('response-time').textContent = summary.response_time;
    document.getElementById('system-uptime').textContent = summary.system_uptime;
    document.getElementById('attacks-detected').textContent = summary.attacks_detected;
    document.getElementById('alerts-handled').textContent = summary.alerts_handled;
    document.getElementById('compromised-hosts').textContent = summary.compromised_hosts;
    
    const learningPoints = document.getElementById('learning-points');
    learningPoints.innerHTML = '';
    summary.learning_points.forEach(point => {
        const li = document.createElement('p');
        li.textContent = `• ${point}`;
        learningPoints.appendChild(li);
    });
    
    // Show modal
    document.getElementById('summary-modal').classList.remove('hidden');
}

async function newSession() {
    if (confirm('Are you sure you want to start a new session? Current progress will be lost.')) {
        try {
            await dashboard.postRequest('/blue-vs-red/end-session');
            location.reload();
        } catch (error) {
            console.error('Error starting new session:', error);
            dashboard.showAlert('error', 'Failed to start new session');
        }
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

// Game Over Modal Functions
function showGameOverModal(gameData) {
    const modal = document.getElementById('game-over-modal');
    const container = modal.querySelector('.game-over-container');
    
    // Set result-specific styling and content
    updateGameOverTitle(gameData.result, gameData.reason);
    updateGameOverBadge(gameData.result, gameData.finalScore, gameData.bonusScore);
    updateGameOverStats(gameData);
    updateGameOverRecommendations(gameData.recommendedActions);
    
    // Show the modal
    modal.classList.remove('hidden');
}

function updateGameOverTitle(result, reason) {
    const title = document.getElementById('game-result-title');
    const reasonEl = document.getElementById('game-result-reason');
    
    switch (result) {
        case 'perfect_victory':
            title.textContent = '🏆 PERFECT VICTORY!';
            title.className = 'text-3xl font-bold mb-2 text-yellow-400';
            break;
        case 'victory':
            title.textContent = '✅ VICTORY!';
            title.className = 'text-3xl font-bold mb-2 text-green-400';
            break;
        case 'partial_victory':
            title.textContent = '⚡ PARTIAL SUCCESS';
            title.className = 'text-3xl font-bold mb-2 text-blue-400';
            break;
        case 'defeat':
            title.textContent = '❌ MISSION FAILED';
            title.className = 'text-3xl font-bold mb-2 text-red-400';
            break;
        default:
            title.textContent = 'GAME OVER';
            title.className = 'text-3xl font-bold mb-2 text-gray-400';
    }
    
    reasonEl.textContent = reason;
}

function updateGameOverBadge(result, finalScore, bonusScore) {
    const badge = document.getElementById('game-result-badge');
    const scoreEl = document.getElementById('game-result-score');
    
    let badgeClass = 'mt-4 p-4 rounded-lg ';
    
    switch (result) {
        case 'perfect_victory':
            badgeClass += 'bg-gradient-to-r from-yellow-600 to-yellow-500 border-2 border-yellow-400';
            break;
        case 'victory':
            badgeClass += 'bg-gradient-to-r from-green-600 to-green-500 border-2 border-green-400';
            break;
        case 'partial_victory':
            badgeClass += 'bg-gradient-to-r from-blue-600 to-blue-500 border-2 border-blue-400';
            break;
        case 'defeat':
            badgeClass += 'bg-gradient-to-r from-red-600 to-red-500 border-2 border-red-400';
            break;
        default:
            badgeClass += 'bg-gradient-to-r from-gray-600 to-gray-500 border-2 border-gray-400';
    }
    
    badge.className = badgeClass;
    
    if (bonusScore !== 0) {
        scoreEl.innerHTML = `${finalScore} Points <span class="text-sm">(${bonusScore > 0 ? '+' : ''}${bonusScore} bonus)</span>`;
    } else {
        scoreEl.textContent = `${finalScore} Points`;
    }
}

function updateGameOverStats(gameData) {
    document.getElementById('final-duration').textContent = 
        `${gameData.durationMinutes}:${gameData.durationSeconds.toString().padStart(2, '0')}`;
    document.getElementById('final-uptime').textContent = `${gameData.systemUptime}%`;
    document.getElementById('final-alert-rate').textContent = `${gameData.alertHandlingRate}%`;
    
    document.getElementById('final-total-alerts').textContent = gameData.totalAlerts;
    document.getElementById('final-handled-alerts').textContent = gameData.handledAlerts;
    document.getElementById('final-compromised').textContent = gameData.compromisedHosts;
    document.getElementById('final-total-hosts').textContent = gameData.totalHosts;
    document.getElementById('final-response-time').textContent = gameData.avgResponseTime;
    document.getElementById('final-detection-speed').textContent = gameData.detectionSpeed;
}

function updateGameOverRecommendations(recommendations) {
    const container = document.getElementById('final-recommendations');
    container.innerHTML = '';
    
    if (recommendations && recommendations.length > 0) {
        recommendations.forEach(rec => {
            const p = document.createElement('p');
            p.textContent = `• ${rec}`;
            p.className = 'mb-1';
            container.appendChild(p);
        });
    } else {
        container.innerHTML = '<p>• No specific recommendations at this time</p>';
    }
}

// Initialize dashboard when page loads
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new BlueTeamDashboard();
});
