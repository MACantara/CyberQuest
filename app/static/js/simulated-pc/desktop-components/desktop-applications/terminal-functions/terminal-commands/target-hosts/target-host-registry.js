import { VoteMainServer } from './vote-main-server.js';
import { VoteDatabaseServer } from './vote-database-server.js';
import { VoteAdminServer } from './vote-admin-server.js';
import { MunicipalityNetwork } from './municipality-network.js';

export class TargetHostRegistry {
    constructor() {
        this.hosts = new Map();
        this.vulnerabilityScripts = new Map();
        this.initializeHosts();
        this.initializeVulnerabilityScripts();
    }

    initializeHosts() {
        // Register individual hosts
        const voteMainServer = new VoteMainServer();
        const voteDatabaseServer = new VoteDatabaseServer();
        const voteAdminServer = new VoteAdminServer();
        const municipalityNetwork = new MunicipalityNetwork();

        // Register by hostname
        this.hosts.set('vote.municipality.gov', voteMainServer);
        this.hosts.set('vote-db.municipality.gov', voteDatabaseServer);
        this.hosts.set('vote-admin.municipality.gov', voteAdminServer);
        this.hosts.set('192.168.100.0/24', municipalityNetwork);

        // Register by IP address for reverse lookups
        this.hosts.set('192.168.100.10', voteMainServer);
        this.hosts.set('192.168.100.11', voteDatabaseServer);
        this.hosts.set('192.168.100.12', voteAdminServer);
    }

    initializeVulnerabilityScripts() {
        // Aggregate all vulnerabilities from hosts for script-based lookup
        this.hosts.forEach(host => {
            const vulns = host.vulnerabilities;
            for (const [scriptName, targets] of Object.entries(vulns)) {
                if (!this.vulnerabilityScripts.has(scriptName)) {
                    this.vulnerabilityScripts.set(scriptName, {});
                }
                const scriptVulns = this.vulnerabilityScripts.get(scriptName);
                Object.assign(scriptVulns, targets);
            }
        });
    }

    // Get host by hostname or IP
    getHost(identifier) {
        return this.hosts.get(identifier) || null;
    }

    // Get all registered hosts
    getAllHosts() {
        const uniqueHosts = new Set();
        this.hosts.forEach(host => uniqueHosts.add(host));
        return Array.from(uniqueHosts);
    }

    // Get hosts by category
    getHostsByCategory(category) {
        return this.getAllHosts().filter(host => host.getCategory() === category);
    }

    // Resolve target (handles both hostnames and IPs)
    resolveTarget(targetStr) {
        // Handle network ranges
        if (targetStr.includes('/')) {
            return this.getHost(targetStr);
        }

        // Direct lookup
        const host = this.getHost(targetStr);
        if (host) {
            return host;
        }

        // Try to find by IP if hostname was provided, or vice versa
        for (const [key, hostObj] of this.hosts.entries()) {
            if (hostObj.ip === targetStr || hostObj.hostname === targetStr) {
                return hostObj;
            }
        }

        return null;
    }

    // Get vulnerability information for scripts
    getVulnerabilityScripts() {
        return Object.fromEntries(this.vulnerabilityScripts);
    }

    // Get all vulnerabilities for a specific script
    getScriptVulnerabilities(scriptName) {
        return this.vulnerabilityScripts.get(scriptName) || {};
    }

    // Register a new host
    registerHost(identifier, host) {
        this.hosts.set(identifier, host);
        
        // Update vulnerability scripts
        const vulns = host.vulnerabilities;
        for (const [scriptName, targets] of Object.entries(vulns)) {
            if (!this.vulnerabilityScripts.has(scriptName)) {
                this.vulnerabilityScripts.set(scriptName, {});
            }
            const scriptVulns = this.vulnerabilityScripts.get(scriptName);
            Object.assign(scriptVulns, targets);
        }
    }

    // Remove a host
    unregisterHost(identifier) {
        const host = this.hosts.get(identifier);
        if (host) {
            this.hosts.delete(identifier);
            // Note: Vulnerability cleanup would require more complex logic
            return true;
        }
        return false;
    }

    // Get security summary for all hosts
    getNetworkSecuritySummary() {
        const allHosts = this.getAllHosts();
        const summaries = allHosts.map(host => ({
            hostname: host.hostname,
            ip: host.ip,
            category: host.getCategory(),
            ...host.getSecuritySummary()
        }));

        const totalVulns = summaries.reduce((sum, s) => sum + s.totalVulnerabilities, 0);
        const highRiskHosts = summaries.filter(s => s.riskLevel === 'HIGH').length;

        return {
            totalHosts: allHosts.length,
            totalVulnerabilities: totalVulns,
            highRiskHosts: highRiskHosts,
            hostSummaries: summaries,
            overallRisk: highRiskHosts > 0 ? 'HIGH' : totalVulns > 3 ? 'MEDIUM' : 'LOW'
        };
    }

    // Get available script names
    getAvailableScripts() {
        return Array.from(this.vulnerabilityScripts.keys());
    }

    // Check if host exists
    hasHost(identifier) {
        return this.hosts.has(identifier);
    }

    // Get host count
    getHostCount() {
        return new Set(this.hosts.values()).size;
    }

    // Export registry data for debugging
    exportRegistryData() {
        return {
            hosts: Object.fromEntries(
                Array.from(this.hosts.entries()).map(([key, host]) => [
                    key, 
                    host.toHostObject()
                ])
            ),
            vulnerabilityScripts: Object.fromEntries(this.vulnerabilityScripts),
            securitySummary: this.getNetworkSecuritySummary()
        };
    }
}

// Export singleton instance
export const targetHostRegistry = new TargetHostRegistry();

// Export class for custom instances
export default TargetHostRegistry;
