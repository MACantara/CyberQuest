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
        
        this.init();
    }
    
    init() {
        this.getCsrfToken();
        this.updateTimestamp();
        this.checkExistingSession();
        this.startAutoRefresh();
        
        // Set up event listeners
        document.addEventListener('DOMContentLoaded', () => {
            this.setupEventListeners();
        });
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
        // Close modal when clicking the X
        document.querySelectorAll('.cursor-pointer').forEach(closeBtn => {
            if (closeBtn.textContent === '×') {
                closeBtn.addEventListener('click', (e) => {
                    const modal = e.target.closest('.fixed');
                    if (modal) {
                        modal.classList.add('hidden');
                    }
                });
            }
        });
        
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
                this.showAlert('success', 'New Blue vs Red session started!');
            }
        } catch (error) {
            console.error('Error starting session:', error);
            this.showAlert('error', 'Failed to start new session');
        }
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
            const hostCard = document.querySelector(`[data-host="${hostId}"]`);
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
                this.selectAlert(alert.id);
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
            const selectedHostCard = document.querySelector(`[data-host="${this.selectedHost}"]`);
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
    document.querySelectorAll('[data-host]').forEach(card => {
        card.classList.remove('ring-2', 'ring-green-500', 'ring-opacity-75');
    });
    
    // Add selection to clicked host
    const hostCard = document.querySelector(`[data-host="${hostId}"]`);
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
        document.querySelectorAll('[data-host]').forEach(card => {
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
    
    html += '<div><h4 class="text-lg mb-2">🔍 Findings</h4><ul class="list-disc list-inside">';
    results.findings.forEach(finding => {
        html += `<li class="mb-1">${finding}</li>`;
    });
    html += '</ul></div>';
    
    html += '<div><h4 class="text-lg mb-2">💡 Recommendations</h4><ul class="list-disc list-inside">';
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

// Initialize dashboard when page loads
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new BlueTeamDashboard();
});
