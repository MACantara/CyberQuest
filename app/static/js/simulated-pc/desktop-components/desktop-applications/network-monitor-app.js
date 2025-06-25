import { WindowBase } from '../window-base.js';
import { PacketCapture } from './network-monitor-functions/packet-capture.js';
import { PacketFilter } from './network-monitor-functions/packet-filter.js';
import { Statistics } from './network-monitor-functions/statistics.js';
import { TrafficCorrelator } from './network-monitor-functions/traffic-correlator.js';

export class NetworkMonitorApp extends WindowBase {
    constructor() {
        super('wireshark', 'Network Monitor', {
            width: '85%',
            height: '75%'
        });
        
        this.packetCapture = null;
        this.packetFilter = null;
        this.statistics = null;
        this.trafficCorrelator = null;
    }

    createContent() {
        return `
        <div class="h-full flex flex-col bg-gray-900">
            <div class="bg-gray-700 p-2 border-b border-gray-600 flex space-x-2" id="network-toolbar">
                <button class="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors duration-200 cursor-pointer" id="live-capture-btn">Live Capture</button>
                <button class="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-500 transition-colors duration-200 cursor-pointer" id="filters-btn">Filters</button>
                <button class="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-500 transition-colors duration-200 cursor-pointer" id="statistics-btn">Statistics</button>
                <button class="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors duration-200 cursor-pointer" id="clear-packets-btn">Clear</button>
            </div>
            <div class="flex-1 overflow-auto font-mono text-xs" id="packet-list">
                <div class="grid grid-cols-5 gap-2 p-2 bg-gray-800 border-b border-gray-600 font-bold text-gray-300" id="packet-headers">
                    <span>Time</span>
                    <span>Source</span>
                    <span>Destination</span>
                    <span>Protocol</span>
                    <span>Info</span>
                </div>
                <div id="packet-data">
                    <!-- Packets will be captured and displayed here when user performs actions -->
                    <div class="p-4 text-center text-gray-400">
                        <i class="bi bi-play-circle text-2xl mb-2"></i>
                        <p>Start live capture to monitor network traffic</p>
                        <p class="text-xs mt-1">Traffic will appear when you browse websites or check emails</p>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    initialize() {
        super.initialize();
        
        // Initialize network monitor components
        this.packetCapture = new PacketCapture(this);
        this.packetFilter = new PacketFilter(this);
        this.statistics = new Statistics(this);
        this.trafficCorrelator = new TrafficCorrelator(this);
        
        this.bindEvents();
    }

    bindEvents() {
        const windowElement = this.windowElement;
        if (!windowElement) return;

        // Live capture button
        const captureBtn = windowElement.querySelector('#live-capture-btn');
        if (captureBtn) {
            captureBtn.addEventListener('click', () => {
                if (this.packetCapture.isCapturing) {
                    this.packetCapture.stopCapture();
                    // Emit network monitoring event
                    document.dispatchEvent(new CustomEvent('network-scan-started', {
                        detail: { 
                            action: 'stopped',
                            target: 'All network interfaces'
                        }
                    }));
                } else {
                    this.packetCapture.startCapture();
                    // Emit network monitoring event
                    document.dispatchEvent(new CustomEvent('network-scan-started', {
                        detail: { 
                            action: 'started',
                            target: 'All network interfaces'
                        }
                    }));
                }
            });
        }

        // Filters button
        const filtersBtn = windowElement.querySelector('#filters-btn');
        if (filtersBtn) {
            filtersBtn.addEventListener('click', () => {
                this.packetFilter.showFilterPanel();
            });
        }

        // Statistics button
        const statisticsBtn = windowElement.querySelector('#statistics-btn');
        if (statisticsBtn) {
            statisticsBtn.addEventListener('click', () => {
                this.statistics.showStatistics();
            });
        }

        // Clear packets button
        const clearBtn = windowElement.querySelector('#clear-packets-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.packetCapture.clearPackets();
            });
        }
    }

    addPacketToList(packet) {
        const packetData = this.windowElement?.querySelector('#packet-data');
        if (!packetData) return;

        // Hide initial message if it exists
        const initialMessage = packetData.querySelector('.text-center');
        if (initialMessage) {
            initialMessage.remove();
        }

        // Check for suspicious traffic and emit event
        if (packet.suspicious) {
            document.dispatchEvent(new CustomEvent('suspicious-traffic-detected', {
                detail: { 
                    source: packet.source,
                    destination: packet.destination,
                    protocol: packet.protocol,
                    reason: 'Suspicious traffic pattern detected'
                }
            }));
        }

        const packetElement = document.createElement('div');
        
        // Special styling for alert packets
        let baseClass = 'grid grid-cols-5 gap-2 p-2 border-b border-gray-700 hover:bg-gray-800 transition-colors duration-200';
        if (packet.isAlert) {
            baseClass += packet.suspicious ? 
                ' bg-red-900 bg-opacity-30 border-l-4 border-red-400' : 
                ' bg-blue-900 bg-opacity-30 border-l-4 border-blue-400';
        } else if (packet.suspicious) {
            baseClass += ' bg-red-900 bg-opacity-20 border-l-4 border-red-500';
        }
        
        packetElement.className = baseClass;
        
        const textClass = packet.suspicious ? 'text-red-400' : 
                         packet.isAlert ? (packet.suspicious ? 'text-red-300' : 'text-blue-300') : '';
        
        packetElement.innerHTML = `
            <span class="text-gray-400">${packet.time}</span>
            <span class="${textClass}">${packet.source}</span>
            <span class="${textClass}">${packet.destination}</span>
            <span class="${packet.suspicious ? 'text-red-400' : packet.isAlert ? 'text-yellow-400' : this.getProtocolColor(packet.protocol)}">${packet.protocol}</span>
            <span class="${textClass}">${packet.info}</span>
        `;

        packetData.appendChild(packetElement);
        
        // Auto-scroll to bottom
        const packetList = this.windowElement?.querySelector('#packet-list');
        if (packetList) {
            packetList.scrollTop = packetList.scrollHeight;
        }
    }

    getProtocolColor(protocol) {
        const colors = {
            'DNS': 'text-blue-400',
            'HTTP': 'text-yellow-400',
            'HTTPS': 'text-green-400',
            'TCP': 'text-green-400',
            'UDP': 'text-purple-400'
        };
        return colors[protocol] || 'text-white';
    }

    clearPacketList() {
        const packetData = this.windowElement?.querySelector('#packet-data');
        if (packetData) {
            packetData.innerHTML = `
                <div class="p-4 text-center text-gray-400">
                    <i class="bi bi-play-circle text-2xl mb-2"></i>
                    <p>Start live capture to monitor network traffic</p>
                    <p class="text-xs mt-1">Traffic will appear when you browse websites or check emails</p>
                </div>
            `;
        }
    }

    refreshPacketList() {
        const packets = this.packetCapture.getPackets();
        const filteredPackets = this.packetFilter.filterPackets(packets);
        
        this.clearPacketList();
        filteredPackets.forEach(packet => this.addPacketToList(packet));
    }

    cleanup() {
        // Stop packet capture when window is closed
        if (this.packetCapture) {
            this.packetCapture.stopCapture();
        }
        
        // Hide any open panels
        if (this.packetFilter) {
            this.packetFilter.hideFilterPanel();
        }
        
        if (this.statistics) {
            this.statistics.hideStatistics();
        }
        
        super.cleanup();
    }
}