import { WindowBase } from '../window-base.js';
import { PacketCapture } from './network-monitor-functions/packet-capture.js';
import { PacketFilter } from './network-monitor-functions/packet-filter.js';
import { Statistics } from './network-monitor-functions/statistics.js';

export class NetworkMonitorApp extends WindowBase {
    constructor() {
        super('wireshark', 'Network Monitor', {
            width: '85%',
            height: '75%'
        });
        
        this.packetCapture = null;
        this.packetFilter = null;
        this.statistics = null;
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
                    <!-- Initial sample packets -->
                    <div class="grid grid-cols-5 gap-2 p-2 border-b border-gray-700 hover:bg-gray-800 transition-colors duration-200" id="normal-packet-1">
                        <span class="text-gray-400">10:30:45</span>
                        <span>192.168.1.100</span>
                        <span>8.8.8.8</span>
                        <span class="text-blue-400">DNS</span>
                        <span>Standard query A google.com</span>
                    </div>
                    <div class="grid grid-cols-5 gap-2 p-2 border-b border-gray-700 hover:bg-gray-800 transition-colors duration-200 bg-red-900 bg-opacity-20 border-l-4 border-red-500" id="malicious-packet">
                        <span class="text-gray-400">10:30:47</span>
                        <span class="text-red-400">192.168.1.100</span>
                        <span class="text-red-400">malicious-site.com</span>
                        <span class="text-red-400">HTTP</span>
                        <span class="text-red-400">GET /malware.exe</span>
                    </div>
                    <div class="grid grid-cols-5 gap-2 p-2 border-b border-gray-700 hover:bg-gray-800 transition-colors duration-200" id="normal-packet-2">
                        <span class="text-gray-400">10:30:48</span>
                        <span>192.168.1.1</span>
                        <span>192.168.1.100</span>
                        <span class="text-green-400">TCP</span>
                        <span>ACK</span>
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
                } else {
                    this.packetCapture.startCapture();
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

        const packetElement = document.createElement('div');
        packetElement.className = `grid grid-cols-5 gap-2 p-2 border-b border-gray-700 hover:bg-gray-800 transition-colors duration-200 ${
            packet.suspicious ? 'bg-red-900 bg-opacity-20 border-l-4 border-red-500' : ''
        }`;
        
        const textClass = packet.suspicious ? 'text-red-400' : '';
        
        packetElement.innerHTML = `
            <span class="text-gray-400">${packet.time}</span>
            <span class="${textClass}">${packet.source}</span>
            <span class="${textClass}">${packet.destination}</span>
            <span class="${packet.suspicious ? 'text-red-400' : this.getProtocolColor(packet.protocol)}">${packet.protocol}</span>
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
            packetData.innerHTML = '';
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
