export class PacketFilter {
    constructor() {
        this.filters = {
            protocol: '',
            source: '',
            destination: '',
            showThreats: true,
            showNormal: true
        };
    }

    setFilter(filterType, value) {
        this.filters[filterType] = value;
    }

    applyFilters(packets) {
        return packets.filter(packet => {
            // Protocol filter
            if (this.filters.protocol && !packet.protocol.toLowerCase().includes(this.filters.protocol.toLowerCase())) {
                return false;
            }

            // Source filter
            if (this.filters.source && !packet.source.toLowerCase().includes(this.filters.source.toLowerCase())) {
                return false;
            }

            // Destination filter
            if (this.filters.destination && !packet.destination.toLowerCase().includes(this.filters.destination.toLowerCase())) {
                return false;
            }

            // Threat filter
            if (packet.threat && !this.filters.showThreats) {
                return false;
            }

            if (!packet.threat && !this.filters.showNormal) {
                return false;
            }

            return true;
        });
    }

    detectThreats(packets) {
        return packets.filter(packet => packet.threat);
    }

    getStatistics(packets) {
        const stats = {
            total: packets.length,
            threats: packets.filter(p => p.threat).length,
            protocols: {}
        };

        packets.forEach(packet => {
            stats.protocols[packet.protocol] = (stats.protocols[packet.protocol] || 0) + 1;
        });

        return stats;
    }
}
