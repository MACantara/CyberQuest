export class Statistics {
    constructor(networkMonitorApp) {
        this.app = networkMonitorApp;
        this.statisticsVisible = false;
    }

    showStatistics() {
        if (this.statisticsVisible) {
            this.hideStatistics();
            return;
        }

        const packets = this.app.packetCapture.getPackets();
        const stats = this.calculateStats(packets);
        
        const statsPanel = document.createElement('div');
        statsPanel.className = 'absolute top-12 right-2 bg-gray-800 border border-gray-600 rounded p-4 shadow-lg z-50 w-80';
        statsPanel.id = 'statistics-panel';
        
        statsPanel.innerHTML = `
            <div class="text-white text-sm font-medium mb-3 flex justify-between items-center">
                <span>Network Statistics</span>
                <button class="text-gray-400 hover:text-white cursor-pointer" id="close-stats">×</button>
            </div>
            <div class="space-y-3">
                <div class="bg-gray-700 rounded p-3">
                    <div class="text-gray-300 text-xs mb-2">Total Packets</div>
                    <div class="text-white text-lg font-bold">${stats.totalPackets}</div>
                </div>
                
                <div class="bg-gray-700 rounded p-3">
                    <div class="text-gray-300 text-xs mb-2">Suspicious Activity</div>
                    <div class="text-red-400 text-lg font-bold">${stats.suspiciousPackets}</div>
                </div>
                
                <div class="bg-gray-700 rounded p-3">
                    <div class="text-gray-300 text-xs mb-2">Protocol Distribution</div>
                    ${Object.entries(stats.protocolCounts).map(([protocol, count]) => `
                        <div class="flex justify-between text-xs">
                            <span class="text-gray-300">${protocol}:</span>
                            <span class="text-white">${count}</span>
                        </div>
                    `).join('')}
                </div>
                
                <div class="bg-gray-700 rounded p-3">
                    <div class="text-gray-300 text-xs mb-2">Top Sources</div>
                    ${Object.entries(stats.topSources).slice(0, 3).map(([source, count]) => `
                        <div class="flex justify-between text-xs">
                            <span class="text-gray-300">${source}:</span>
                            <span class="text-white">${count}</span>
                        </div>
                    `).join('')}
                </div>
                
                <div class="bg-gray-700 rounded p-3">
                    <div class="text-gray-300 text-xs mb-2">Security Score</div>
                    <div class="flex items-center space-x-2">
                        <div class="flex-1 bg-gray-600 rounded h-2">
                            <div class="bg-${stats.securityScore > 70 ? 'green' : stats.securityScore > 40 ? 'yellow' : 'red'}-500 h-2 rounded" 
                                 style="width: ${stats.securityScore}%"></div>
                        </div>
                        <span class="text-white text-xs">${stats.securityScore}%</span>
                    </div>
                </div>
            </div>
        `;

        this.app.windowElement.appendChild(statsPanel);
        this.statisticsVisible = true;
        
        // Bind close event
        const closeBtn = statsPanel.querySelector('#close-stats');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideStatistics());
        }
    }

    hideStatistics() {
        const panel = this.app.windowElement?.querySelector('#statistics-panel');
        if (panel) {
            panel.remove();
            this.statisticsVisible = false;
        }
    }

    calculateStats(packets) {
        const stats = {
            totalPackets: packets.length,
            suspiciousPackets: 0,
            protocolCounts: {},
            topSources: {},
            securityScore: 100
        };
        
        packets.forEach(packet => {
            // Count suspicious packets
            if (packet.suspicious) {
                stats.suspiciousPackets++;
            }
            
            // Count protocols
            stats.protocolCounts[packet.protocol] = (stats.protocolCounts[packet.protocol] || 0) + 1;
            
            // Count sources
            stats.topSources[packet.source] = (stats.topSources[packet.source] || 0) + 1;
        });
        
        // Calculate security score (lower if more suspicious activity)
        if (stats.totalPackets > 0) {
            const suspiciousRatio = stats.suspiciousPackets / stats.totalPackets;
            stats.securityScore = Math.max(0, Math.round(100 - (suspiciousRatio * 100)));
        }
        
        return stats;
    }
}
