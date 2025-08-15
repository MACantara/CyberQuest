// Game Controller - Main orchestrator for the Blue Team vs Red Team simulation
class GameController {
    constructor() {
        this.gameState = {
            isRunning: false,
            timeRemaining: 900, // 15 minutes in seconds
            assets: {
                'academy-server': { status: 'secure', integrity: 100 },
                'student-db': { status: 'secure', integrity: 100 },
                'research-files': { status: 'secure', integrity: 100 },
                'learning-platform': { status: 'secure', integrity: 100 }
            },
            alerts: [],
            incidents: [],
            securityControls: {
                firewall: { active: true, effectiveness: 80 },
                endpoint: { active: true, effectiveness: 75 },
                access: { active: true, effectiveness: 85 }
            }
        };
        
        this.aiEngine = null;
        this.uiManager = null;
        this.gameTimer = null;
        
        this.init();
    }
    
    async init() {
        // Import and initialize AI engine and UI manager
        const { AIEngine } = await import('./ai-engine.js');
        const { UIManager } = await import('./ui-manager.js');
        
        this.aiEngine = new AIEngine(this);
        this.uiManager = new UIManager(this);
        
        this.setupEventListeners();
        this.uiManager.updateDisplay();
        
        // Auto-start the simulation after a brief delay
        setTimeout(() => {
            this.autoStartGame();
        }, 1000);
        
        console.log('🎮 Game Controller initialized');
    }
    
    setupEventListeners() {
        // Game control menu
        const menuButton = document.getElementById('game-menu-button');
        const menuDropdown = document.getElementById('game-menu-dropdown');
        
        if (menuButton && menuDropdown) {
            menuButton.addEventListener('click', (e) => {
                e.stopPropagation();
                menuDropdown.classList.toggle('hidden');
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                menuDropdown.classList.add('hidden');
            });
            
            // Prevent dropdown from closing when clicking inside
            menuDropdown.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
        
        // Game control buttons
        document.getElementById('pause-simulation')?.addEventListener('click', () => this.pauseGame());
        document.getElementById('stop-simulation')?.addEventListener('click', () => this.stopGame());
        document.getElementById('reset-simulation')?.addEventListener('click', () => this.resetGame());
        document.getElementById('exit-simulation')?.addEventListener('click', () => this.exitToMenu());
        
        // Terminal input
        document.getElementById('terminal-input')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const command = e.target.value.trim();
                if (command) {
                    this.handleTerminalCommand(command);
                    e.target.value = '';
                }
            }
        });
        
        // Modal controls
        document.getElementById('play-again')?.addEventListener('click', () => {
            this.hideGameOverModal();
            this.resetGame();
            setTimeout(() => this.autoStartGame(), 500);
        });
        
        document.getElementById('close-modal')?.addEventListener('click', () => {
            this.hideGameOverModal();
        });
    }
    
    startGame() {
        if (this.gameState.isRunning) return;
        
        this.gameState.isRunning = true;
        this.uiManager.addTerminalOutput('🟢 Simulation started. Monitoring for threats...');
        this.uiManager.updateGameControls();
        
        // Start the game timer
        this.gameTimer = setInterval(() => {
            this.updateTimer();
        }, 1000);
        
        // Start AI engine
        this.aiEngine.startAttackSequence();
        
        console.log('🎮 Game started');
    }
    
    autoStartGame() {
        this.uiManager.addTerminalOutput('🤖 Auto-starting simulation...');
        setTimeout(() => {
            this.startGame();
        }, 1500);
    }
    
    pauseGame() {
        if (!this.gameState.isRunning) return;
        
        this.gameState.isRunning = false;
        
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
        
        this.aiEngine.stopAttackSequence();
        this.uiManager.addTerminalOutput('⏸️ Simulation paused.');
        this.uiManager.updateGameControls();
        
        console.log('🎮 Game paused');
    }
    
    exitToMenu() {
        if (confirm('Are you sure you want to exit the simulation and return to the main menu?')) {
            this.stopGame();
            window.location.href = '/blue-vs-red/';
        }
    }
    
    stopGame() {
        if (!this.gameState.isRunning) return;
        
        this.gameState.isRunning = false;
        
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
        
        this.aiEngine.stopAttackSequence();
        this.uiManager.addTerminalOutput('🔴 Simulation stopped.');
        this.uiManager.updateGameControls();
        
        console.log('🎮 Game stopped');
    }
    
    resetGame() {
        this.stopGame();
        
        // Reset game state
        this.gameState = {
            isRunning: false,
            timeRemaining: 900,
            assets: {
                'academy-server': { status: 'secure', integrity: 100 },
                'student-db': { status: 'secure', integrity: 100 },
                'research-files': { status: 'secure', integrity: 100 },
                'learning-platform': { status: 'secure', integrity: 100 }
            },
            alerts: [],
            incidents: [],
            securityControls: {
                firewall: { active: true, effectiveness: 80 },
                endpoint: { active: true, effectiveness: 75 },
                access: { active: true, effectiveness: 85 }
            }
        };
        
        // Reset AI
        this.aiEngine.reset();
        
        // Update UI
        this.uiManager.updateDisplay();
        this.uiManager.clearTerminal();
        this.uiManager.addTerminalOutput('$ System reset. Ready for new simulation.');
        
        console.log('🎮 Game reset');
    }
    
    updateTimer() {
        if (this.gameState.timeRemaining <= 0) {
            this.endGame('victory', 'Time expired! You successfully defended Project Sentinel Academy!');
            return;
        }
        
        this.gameState.timeRemaining--;
        this.uiManager.updateTimer();
    }
    
    // Handle AI attack attempts
    processAttack(attackData) {
        const { type, target, technique, severity } = attackData;
        
        // Calculate detection probability based on security controls
        const detectionChance = this.calculateDetectionChance(type, technique);
        const detected = Math.random() < detectionChance;
        
        if (detected) {
            this.handleDetectedAttack(attackData);
        } else {
            this.handleUndetectedAttack(attackData);
        }
        
        // AI learns from the outcome
        this.aiEngine.updateQTable(attackData, detected);
    }
    
    calculateDetectionChance(attackType, technique) {
        let baseChance = 0.6; // 60% base detection rate
        
        // Adjust based on security controls
        Object.values(this.gameState.securityControls).forEach(control => {
            if (control.active) {
                baseChance += (control.effectiveness / 100) * 0.1;
            }
        });
        
        // Adjust based on attack type
        const typeModifiers = {
            'reconnaissance': -0.2,
            'initial-access': -0.1,
            'persistence': 0.1,
            'privilege-escalation': 0.0,
            'defense-evasion': -0.3,
            'credential-access': 0.1,
            'discovery': -0.1,
            'lateral-movement': 0.2,
            'collection': 0.3,
            'exfiltration': 0.4,
            'impact': 0.5
        };
        
        baseChance += typeModifiers[attackType] || 0;
        
        return Math.max(0.1, Math.min(0.9, baseChance));
    }
    
    handleDetectedAttack(attackData) {
        const alert = {
            id: Date.now(),
            timestamp: new Date(),
            type: attackData.type,
            target: attackData.target,
            technique: attackData.technique,
            severity: attackData.severity,
            status: 'detected'
        };
        
        this.gameState.alerts.push(alert);
        this.uiManager.addAlert(alert);
        this.uiManager.addTerminalOutput(`🚨 ALERT: ${attackData.technique} detected targeting ${attackData.target}`);
        
        // Player has a chance to respond
        this.offerPlayerResponse(alert);
    }
    
    handleUndetectedAttack(attackData) {
        // Attack proceeds undetected
        const success = this.calculateAttackSuccess(attackData);
        
        if (success) {
            this.executeSuccessfulAttack(attackData);
        } else {
            // Attack failed for other reasons
            this.uiManager.addTerminalOutput(`⚠️ Unusual network activity detected (${attackData.type})`);
        }
    }
    
    calculateAttackSuccess(attackData) {
        // Base success rate depends on attack type and current defenses
        let successRate = 0.4;
        
        // Adjust based on asset current integrity
        const asset = this.gameState.assets[attackData.target];
        if (asset) {
            successRate += (100 - asset.integrity) / 200; // Damaged assets are easier to attack
        }
        
        return Math.random() < successRate;
    }
    
    executeSuccessfulAttack(attackData) {
        const asset = this.gameState.assets[attackData.target];
        if (!asset) return;
        
        // Damage the asset
        const damage = Math.random() * 30 + 10; // 10-40% damage
        asset.integrity = Math.max(0, asset.integrity - damage);
        
        if (asset.integrity === 0) {
            asset.status = 'compromised';
            this.endGame('defeat', `Critical asset ${attackData.target} has been compromised!`);
            return;
        } else if (asset.integrity < 50) {
            asset.status = 'vulnerable';
        }
        
        // Create incident
        const incident = {
            id: Date.now(),
            timestamp: new Date(),
            type: 'successful-attack',
            target: attackData.target,
            technique: attackData.technique,
            damage: damage
        };
        
        this.gameState.incidents.push(incident);
        this.uiManager.addIncident(incident);
        this.uiManager.updateAssetStatus();
        
        // Delayed detection of the successful attack
        setTimeout(() => {
            this.uiManager.addTerminalOutput(`⚠️ Integrity check failed on ${attackData.target} - potential breach detected`);
        }, Math.random() * 5000 + 2000); // 2-7 seconds delay
    }
    
    offerPlayerResponse(alert) {
        // Simulate player response options
        const responses = [
            'block-ip',
            'isolate-asset',
            'increase-monitoring',
            'patch-vulnerability',
            'reset-credentials'
        ];
        
        // For MVP, automatically respond after a short delay
        setTimeout(() => {
            const response = responses[Math.floor(Math.random() * responses.length)];
            this.executePlayerResponse(alert, response);
        }, Math.random() * 3000 + 1000); // 1-4 seconds
    }
    
    executePlayerResponse(alert, response) {
        let effectiveness = Math.random() * 0.5 + 0.3; // 30-80% effectiveness
        
        const responseMap = {
            'block-ip': 'IP address blocked',
            'isolate-asset': 'Asset isolated from network',
            'increase-monitoring': 'Monitoring increased',
            'patch-vulnerability': 'Vulnerability patched',
            'reset-credentials': 'Credentials reset'
        };
        
        this.uiManager.addTerminalOutput(`✅ Response: ${responseMap[response]} (${Math.round(effectiveness * 100)}% effective)`);
        
        // Update security controls effectiveness
        Object.keys(this.gameState.securityControls).forEach(control => {
            this.gameState.securityControls[control].effectiveness = Math.min(100, 
                this.gameState.securityControls[control].effectiveness + effectiveness * 5
            );
        });
        
        // Mark alert as responded
        alert.status = 'responded';
        this.uiManager.updateAlerts();
    }
    
    handleTerminalCommand(command) {
        const cmd = command.toLowerCase().trim();
        
        this.uiManager.addTerminalOutput(`$ ${command}`);
        
        switch (cmd) {
            case 'status':
                this.showSystemStatus();
                break;
            case 'assets':
                this.showAssetStatus();
                break;
            case 'alerts':
                this.showActiveAlerts();
                break;
            case 'help':
                this.showHelp();
                break;
            case 'scan':
                this.runSecurityScan();
                break;
            default:
                this.uiManager.addTerminalOutput(`Command not found: ${cmd}. Type 'help' for available commands.`);
        }
    }
    
    showSystemStatus() {
        this.uiManager.addTerminalOutput('=== SYSTEM STATUS ===');
        this.uiManager.addTerminalOutput(`Network: ${this.gameState.isRunning ? 'ACTIVE' : 'STANDBY'}`);
        this.uiManager.addTerminalOutput(`Time Remaining: ${this.formatTime(this.gameState.timeRemaining)}`);
        this.uiManager.addTerminalOutput(`Active Alerts: ${this.gameState.alerts.filter(a => a.status === 'detected').length}`);
        this.uiManager.addTerminalOutput(`Security Controls: ${Object.values(this.gameState.securityControls).filter(c => c.active).length}/3 active`);
    }
    
    showAssetStatus() {
        this.uiManager.addTerminalOutput('=== ASSET STATUS ===');
        Object.entries(this.gameState.assets).forEach(([name, asset]) => {
            this.uiManager.addTerminalOutput(`${name}: ${asset.status.toUpperCase()} (${asset.integrity}% integrity)`);
        });
    }
    
    showActiveAlerts() {
        const activeAlerts = this.gameState.alerts.filter(a => a.status === 'detected');
        this.uiManager.addTerminalOutput(`=== ACTIVE ALERTS (${activeAlerts.length}) ===`);
        activeAlerts.slice(-5).forEach(alert => {
            this.uiManager.addTerminalOutput(`${alert.timestamp.toLocaleTimeString()} - ${alert.technique} on ${alert.target}`);
        });
    }
    
    showHelp() {
        this.uiManager.addTerminalOutput('=== AVAILABLE COMMANDS ===');
        this.uiManager.addTerminalOutput('status  - Show system status');
        this.uiManager.addTerminalOutput('assets  - Show asset integrity');
        this.uiManager.addTerminalOutput('alerts  - Show active alerts');
        this.uiManager.addTerminalOutput('scan    - Run security scan');
        this.uiManager.addTerminalOutput('help    - Show this help');
    }
    
    runSecurityScan() {
        this.uiManager.addTerminalOutput('Running security scan...');
        setTimeout(() => {
            const vulnerabilities = Math.floor(Math.random() * 3);
            this.uiManager.addTerminalOutput(`Scan complete. Found ${vulnerabilities} potential vulnerabilities.`);
            
            if (vulnerabilities > 0) {
                // Improve security controls slightly
                Object.keys(this.gameState.securityControls).forEach(control => {
                    this.gameState.securityControls[control].effectiveness = Math.min(100,
                        this.gameState.securityControls[control].effectiveness + 2
                    );
                });
            }
        }, 2000);
    }
    
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    endGame(result, message) {
        this.stopGame();
        this.showGameOverModal(result, message);
    }
    
    showGameOverModal(result, message) {
        const modal = document.getElementById('game-over-modal');
        const icon = document.getElementById('game-result-icon');
        const title = document.getElementById('game-result-title');
        const messageEl = document.getElementById('game-result-message');
        
        if (result === 'victory') {
            icon.innerHTML = '🏆';
            title.textContent = 'Victory!';
            title.className = 'text-2xl font-bold mb-4 text-green-600';
        } else {
            icon.innerHTML = '💥';
            title.textContent = 'Defeat!';
            title.className = 'text-2xl font-bold mb-4 text-red-600';
        }
        
        messageEl.textContent = message;
        modal.classList.remove('hidden');
    }
    
    hideGameOverModal() {
        document.getElementById('game-over-modal').classList.add('hidden');
    }
    
    // Getters for other modules
    getGameState() {
        return this.gameState;
    }
    
    isGameRunning() {
        return this.gameState.isRunning;
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gameController = new GameController();
});

export { GameController };
