export class PacketFilter {
    constructor(networkMonitorApp) {
        this.app = networkMonitorApp;
        this.activeFilters = {
            protocol: '',
            source: '',
            destination: '',
            suspicious: false
        };
        this.filterPanelVisible = false;
    }

    showFilterPanel() {
        if (this.filterPanelVisible) {
            this.hideFilterPanel();
            return;
        }

        const filterPanel = document.createElement('div');
        filterPanel.className = 'absolute top-12 left-2 bg-gray-800 border border-gray-600 rounded p-3 shadow-lg z-50';
        filterPanel.id = 'filter-panel';
        
        filterPanel.innerHTML = `
            <div class="text-white text-sm font-medium mb-3">Packet Filters</div>
            <div class="space-y-2">
                <div>
                    <label class="text-gray-300 text-xs">Protocol:</label>
                    <select class="w-full bg-gray-700 text-white text-xs rounded px-2 py-1" id="protocol-filter">
                        <option value="">All</option>
                        <option value="DNS">DNS</option>
                        <option value="HTTP">HTTP</option>
                        <option value="HTTPS">HTTPS</option>
                        <option value="TCP">TCP</option>
                    </select>
                </div>
                <div>
                    <label class="text-gray-300 text-xs">Source IP:</label>
                    <input type="text" class="w-full bg-gray-700 text-white text-xs rounded px-2 py-1" 
                           id="source-filter" placeholder="e.g., 192.168.1.100">
                </div>
                <div>
                    <label class="text-gray-300 text-xs">Destination:</label>
                    <input type="text" class="w-full bg-gray-700 text-white text-xs rounded px-2 py-1" 
                           id="destination-filter" placeholder="e.g., google.com">
                </div>
                <div class="flex items-center space-x-2">
                    <input type="checkbox" id="suspicious-filter" class="text-red-500">
                    <label for="suspicious-filter" class="text-gray-300 text-xs">Show only suspicious</label>
                </div>
                <div class="flex space-x-2 mt-3">
                    <button class="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 cursor-pointer" 
                            id="apply-filter">Apply</button>
                    <button class="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-500 cursor-pointer" 
                            id="clear-filter">Clear</button>
                </div>
            </div>
        `;

        this.app.windowElement.appendChild(filterPanel);
        this.filterPanelVisible = true;
        
        this.bindFilterEvents(filterPanel);
    }

    hideFilterPanel() {
        const panel = this.app.windowElement?.querySelector('#filter-panel');
        if (panel) {
            panel.remove();
            this.filterPanelVisible = false;
        }
    }

    bindFilterEvents(panel) {
        const applyBtn = panel.querySelector('#apply-filter');
        const clearBtn = panel.querySelector('#clear-filter');
        
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                this.applyFilters(panel);
            });
        }
        
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearFilters(panel);
            });
        }
    }

    applyFilters(panel) {
        this.activeFilters = {
            protocol: panel.querySelector('#protocol-filter').value,
            source: panel.querySelector('#source-filter').value,
            destination: panel.querySelector('#destination-filter').value,
            suspicious: panel.querySelector('#suspicious-filter').checked
        };
        
        this.app.refreshPacketList();
        this.hideFilterPanel();
    }

    clearFilters(panel) {
        this.activeFilters = {
            protocol: '',
            source: '',
            destination: '',
            suspicious: false
        };
        
        panel.querySelector('#protocol-filter').value = '';
        panel.querySelector('#source-filter').value = '';
        panel.querySelector('#destination-filter').value = '';
        panel.querySelector('#suspicious-filter').checked = false;
        
        this.app.refreshPacketList();
    }

    filterPackets(packets) {
        return packets.filter(packet => {
            if (this.activeFilters.protocol && packet.protocol !== this.activeFilters.protocol) {
                return false;
            }
            
            if (this.activeFilters.source && !packet.source.includes(this.activeFilters.source)) {
                return false;
            }
            
            if (this.activeFilters.destination && !packet.destination.includes(this.activeFilters.destination)) {
                return false;
            }
            
            if (this.activeFilters.suspicious && !packet.suspicious) {
                return false;
            }
            
            return true;
        });
    }
}
