import { WindowBase } from '../window-base.js';
import { PacketGenerator } from './network-monitor-functions/packet-generator.js';
import { PacketFilter } from './network-monitor-functions/packet-filter.js';
import { LiveCapture } from './network-monitor-functions/live-capture.js';

export class NetworkMonitorApp extends WindowBase {
    constructor() {
        super('wireshark', 'Network Monitor', {
            width: '85%',
            height: '75%'
        });
        
        this.packets = [];
        this.packetGenerator = new PacketGenerator();
        this.packetFilter = new PacketFilter();
        this.liveCapture = new LiveCapture(this.packetGenerator, (packet) => this.addPacket(packet));
    }

    createContent() {
        return `
        <div class="h-full flex flex-col bg-gray-900">
            <div class="bg-gray-700 p-2 border-b border-gray-600 flex space-x-2" id="network-toolbar">
                <button class="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors duration-200 cursor-pointer" id="live-capture-btn">Start Capture</button>
                <button class="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-500 transition-colors duration-200 cursor-pointer" id="filters-btn">Filters</button>
                <button class="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-500 transition-colors duration-200 cursor-pointer" id="statistics-btn">Statistics</button>
                <button class="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors duration-200 cursor-pointer" id="clear-btn">Clear</button>
            </div>
            <div class="flex-1 overflow-auto font-mono text-xs" id="packet-list">
                <div class="grid grid-cols-5 gap-2 p-2 bg-gray-800 border-b border-gray-600 font-bold text-gray-300" id="packet-headers">
                    <span>Time</span>
                    <span>Source</span>
                    <span>Destination</span>
                    <span>Protocol</span>
                    <span>Info</span>
                </div>
                <div id="packet-container">
                    <!-- Initial packets will be replaced by dynamic content -->
                </div>
            </div>
        </div>
        `;
    }

    setupEventListeners() {
        super.setupEventListeners();
        
        const liveCaptureBtn = this.element.querySelector('#live-capture-btn');
        const filtersBtn = this.element.querySelector('#filters-btn');
        const statisticsBtn = this.element.querySelector('#statistics-btn');
        const clearBtn = this.element.querySelector('#clear-btn');

        liveCaptureBtn.addEventListener('click', () => this.toggleCapture());
        filtersBtn.addEventListener('click', () => this.showFilters());
        statisticsBtn.addEventListener('click', () => this.showStatistics());
        clearBtn.addEventListener('click', () => this.clearPackets());

        // Load initial packets
        this.loadInitialPackets();
    }

    loadInitialPackets() {
        // Add some initial packets for demonstration
        for (let i = 0; i < 5; i++) {
            this.addPacket(this.packetGenerator.generatePacket());
        }
    }

    addPacket(packet) {
        this.packets.push(packet);
        if (this.packets.length > 100) {
            this.packets.shift(); // Keep only last 100 packets
        }
        this.updatePacketDisplay();
    }

    updatePacketDisplay() {
        const container = this.element.querySelector('#packet-container');
        const filteredPackets = this.packetFilter.applyFilters(this.packets);
        
        container.innerHTML = filteredPackets.map(packet => this.renderPacket(packet)).join('');
        
        // Auto-scroll to bottom
        const packetList = this.element.querySelector('#packet-list');
        packetList.scrollTop = packetList.scrollHeight;
    }

    renderPacket(packet) {
        const threatClass = packet.threat ? 'bg-red-900 bg-opacity-20 border-l-4 border-red-500' : '';
        const threatTextClass = packet.threat ? 'text-red-400' : '';
        
        return `
            <div class="grid grid-cols-5 gap-2 p-2 border-b border-gray-700 hover:bg-gray-800 transition-colors duration-200 ${threatClass}" data-packet-id="${packet.id}">
                <span class="text-gray-400">${packet.time}</span>
                <span class="${threatTextClass}">${packet.source}</span>
                <span class="${threatTextClass}">${packet.destination}</span>
                <span class="${packet.threat ? 'text-red-400' : this.getProtocolColor(packet.protocol)}">${packet.protocol}</span>
                <span class="${threatTextClass}">${packet.info}</span>
            </div>
        `;
    }

    getProtocolColor(protocol) {
        const colors = {
            'DNS': 'text-blue-400',
            'HTTP': 'text-yellow-400',
            'HTTPS': 'text-green-400',
            'TCP': 'text-purple-400',
            'UDP': 'text-cyan-400'
        };
        return colors[protocol] || 'text-gray-400';
    }

    toggleCapture() {
        const btn = this.element.querySelector('#live-capture-btn');
        const isCapturing = this.liveCapture.toggle();
        
        btn.textContent = isCapturing ? 'Stop Capture' : 'Start Capture';
        btn.className = isCapturing 
            ? 'px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors duration-200 cursor-pointer'
            : 'px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors duration-200 cursor-pointer';
    }

    showFilters() {
        // Simple filter dialog implementation
        const protocol = prompt('Filter by protocol (leave empty for all):') || '';
        const source = prompt('Filter by source (leave empty for all):') || '';
        const destination = prompt('Filter by destination (leave empty for all):') || '';
        
        this.packetFilter.setFilter('protocol', protocol);
        this.packetFilter.setFilter('source', source);
        this.packetFilter.setFilter('destination', destination);
        
        this.updatePacketDisplay();
    }

    showStatistics() {
        const stats = this.packetFilter.getStatistics(this.packets);
        const protocolStats = Object.entries(stats.protocols)
            .map(([protocol, count]) => `${protocol}: ${count}`)
            .join('\n');
        
        alert(`Network Statistics:\n\nTotal Packets: ${stats.total}\nThreat Packets: ${stats.threats}\n\nProtocol Breakdown:\n${protocolStats}`);
    }

    clearPackets() {
        this.packets = [];
        this.updatePacketDisplay();
    }

    cleanup() {
        if (this.liveCapture) {
            this.liveCapture.stop();
        }
        super.cleanup();
    }
}
