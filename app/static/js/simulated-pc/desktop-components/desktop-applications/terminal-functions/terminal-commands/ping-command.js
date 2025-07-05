import { BaseCommand } from './base-command.js';
import { targetHostRegistry } from './target-hosts/target-host-registry.js';
import { pageRegistry } from '../../browser-functions/pages/page-registry.js';

export class PingCommand extends BaseCommand {
    constructor(processor) {
        super(processor);
        this.targetRegistry = targetHostRegistry;
        this.pageRegistry = pageRegistry;
        this.isRunning = false;
    }

    execute(args) {
        if (args.length === 0) {
            this.showBasicUsage();
            return;
        }

        // Parse command line arguments
        const options = this.parseArguments(args);
        
        if (options.help) {
            this.showHelp();
            return;
        }

        if (!options.target) {
            this.addOutput('ping: missing target', 'text-red-400');
            this.addOutput('Usage: ping [options] <destination>');
            return;
        }

        // Execute the ping
        this.performPing(options);
    }

    parseArguments(args) {
        const options = {
            target: null,
            count: 4,
            interval: 1000,
            timeout: 5000,
            packetSize: 32,
            verbose: false,
            flood: false,
            help: false
        };

        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            
            switch (arg) {
                case '-h':
                case '--help':
                    options.help = true;
                    break;
                case '-c':
                    if (i + 1 < args.length) {
                        options.count = parseInt(args[++i]) || 4;
                    }
                    break;
                case '-i':
                    if (i + 1 < args.length) {
                        options.interval = parseFloat(args[++i]) * 1000 || 1000;
                    }
                    break;
                case '-W':
                    if (i + 1 < args.length) {
                        options.timeout = parseInt(args[++i]) * 1000 || 5000;
                    }
                    break;
                case '-s':
                    if (i + 1 < args.length) {
                        options.packetSize = parseInt(args[++i]) || 32;
                    }
                    break;
                case '-v':
                    options.verbose = true;
                    break;
                case '-f':
                    options.flood = true;
                    options.interval = 10; // Fast flood ping
                    break;
                case '-t':
                    options.count = -1; // Continuous ping
                    break;
                default:
                    if (!arg.startsWith('-') && !options.target) {
                        options.target = arg;
                    }
                    break;
            }
        }

        return options;
    }

    async performPing(options) {
        const target = this.resolveTarget(options.target);
        
        if (!target) {
            this.addOutput(`ping: ${options.target}: Name or service not known`, 'text-red-400');
            return;
        }

        this.isRunning = true;
        const targetIp = target.ip || options.target;
        const targetName = target.hostname || options.target;

        // Show ping header
        this.addOutput(`PING ${targetName} (${targetIp}) ${options.packetSize}(${options.packetSize + 28}) bytes of data.`);

        let packetsSent = 0;
        let packetsReceived = 0;
        let minTime = Infinity;
        let maxTime = 0;
        let totalTime = 0;
        const startTime = Date.now();

        const sendPing = async () => {
            if (!this.isRunning || (options.count > 0 && packetsSent >= options.count)) {
                this.showPingStatistics(targetName, targetIp, packetsSent, packetsReceived, minTime, maxTime, totalTime, startTime);
                return;
            }

            packetsSent++;
            const pingResult = await this.simulatePing(target, options, packetsSent);
            
            if (pingResult.success) {
                packetsReceived++;
                const time = pingResult.time;
                minTime = Math.min(minTime, time);
                maxTime = Math.max(maxTime, time);
                totalTime += time;

                this.addOutput(
                    `64 bytes from ${targetIp}: icmp_seq=${packetsSent} ttl=${pingResult.ttl} time=${time.toFixed(1)} ms`,
                    pingResult.suspicious ? 'text-yellow-400' : 'text-green-400'
                );

                if (pingResult.warning) {
                    this.addOutput(`WARNING: ${pingResult.warning}`, 'text-yellow-400');
                }
            } else {
                this.addOutput(
                    `From ${targetIp} icmp_seq=${packetsSent} ${pingResult.error}`,
                    'text-red-400'
                );
            }

            // Schedule next ping
            setTimeout(sendPing, options.interval);
        };

        // Start pinging
        await sendPing();
    }

    resolveTarget(targetStr) {
        // Try to resolve through target registry first
        let target = this.targetRegistry.resolveTarget(targetStr);
        
        if (target) {
            return target;
        }

        // Try to resolve through page registry for web-based targets
        const page = this.pageRegistry.getPageByUrl(`https://${targetStr}`) || 
                    this.pageRegistry.getPageByUrl(`http://${targetStr}`);
        if (page) {
            return {
                hostname: targetStr,
                ip: page.ipAddress,
                security: page.security,
                isWebTarget: true
            };
        }
        
        // Check if target matches any page hostname patterns
        const allPages = this.pageRegistry.getPageList();
        for (const pageConfig of allPages) {
            try {
                const url = new URL(pageConfig.url);
                if (url.hostname === targetStr || url.hostname.includes(targetStr)) {
                    return {
                        hostname: targetStr,
                        ip: pageConfig.ipAddress,
                        security: pageConfig.security,
                        isWebTarget: true
                    };
                }
            } catch (urlError) {
                // Skip invalid URLs
                continue;
            }
        }

        // Check if the target string is an IP address that exists in page registry
        for (const pageConfig of allPages) {
            if (pageConfig.ipAddress === targetStr) {
                try {
                    const url = new URL(pageConfig.url);
                    return {
                        hostname: url.hostname,
                        ip: targetStr,
                        security: pageConfig.security,
                        isWebTarget: true
                    };
                } catch (urlError) {
                    return {
                        hostname: targetStr,
                        ip: targetStr,
                        security: pageConfig.security,
                        isWebTarget: true
                    };
                }
            }
        }

        // Handle common network targets and manually defined hosts
        const commonTargets = this.getCommonTargets();

        return commonTargets[targetStr.toLowerCase()] || null;
    }

    getCommonTargets() {
        // Get dynamic targets from page registry
        const pageTargets = {};
        const allPages = this.pageRegistry.getPageList();
        
        allPages.forEach(pageConfig => {
            try {
                const url = new URL(pageConfig.url);
                const hostname = url.hostname;
                
                // Add both hostname and IP mappings
                pageTargets[hostname] = {
                    hostname: hostname,
                    ip: pageConfig.ipAddress,
                    security: pageConfig.security,
                    isWebTarget: true
                };
                
                if (pageConfig.ipAddress) {
                    pageTargets[pageConfig.ipAddress] = {
                        hostname: hostname,
                        ip: pageConfig.ipAddress,
                        security: pageConfig.security,
                        isWebTarget: true
                    };
                }
            } catch (error) {
                // Skip invalid URLs
            }
        });
        
        // Merge with static common targets
        const staticTargets = {
            'localhost': { hostname: 'localhost', ip: '127.0.0.1' },
            '127.0.0.1': { hostname: 'localhost', ip: '127.0.0.1' },
            'google.com': { hostname: 'google.com', ip: '8.8.8.8' },
            '8.8.8.8': { hostname: 'dns.google', ip: '8.8.8.8' },
            'cloudflare.com': { hostname: 'cloudflare.com', ip: '1.1.1.1' },
            '1.1.1.1': { hostname: 'one.one.one.one', ip: '1.1.1.1' },
            'github.com': { hostname: 'github.com', ip: '140.82.114.4' }
        };
        
        return { ...staticTargets, ...pageTargets };
    }

    async simulatePing(target, options, sequence) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));

        const isHostUp = this.isHostReachable(target);
        const baseLatency = this.calculateBaseLatency(target);
        const jitter = (Math.random() - 0.5) * 10; // ±5ms jitter
        const time = Math.max(0.1, baseLatency + jitter);

        if (!isHostUp) {
            const errors = [
                'Destination Host Unreachable',
                'Request timeout',
                'Network is unreachable'
            ];
            return {
                success: false,
                error: errors[Math.floor(Math.random() * errors.length)]
            };
        }

        // Check for suspicious behavior
        const result = {
            success: true,
            time: time,
            ttl: this.calculateTTL(target),
            suspicious: false,
            warning: null
        };

        // Add security-related warnings for suspicious hosts
        if (target.hostname && this.isSuspiciousHost(target.hostname)) {
            result.suspicious = true;
            result.warning = 'Host may be associated with malicious activity';
        }

        // Add web-specific security warnings
        if (target.isWebTarget && target.security) {
            if (target.security.threats && target.security.threats.length > 0) {
                result.suspicious = true;
                result.warning = `Security threats detected: ${target.security.threats.join(', ')}`;
            } else if (target.security.riskFactors && target.security.riskFactors.length > 0) {
                result.suspicious = true;
                result.warning = `Risk factors identified: ${target.security.riskFactors.slice(0, 2).join(', ')}`;
            } else if (!target.security.isHttps) {
                result.warning = 'Insecure HTTP connection detected';
            }
        }

        // Simulate packet loss for unreliable connections
        if (Math.random() < this.getPacketLossRate(target)) {
            return {
                success: false,
                error: 'Request timeout'
            };
        }

        return result;
    }

    isHostReachable(target) {
        // Localhost is always reachable
        if (target.ip === '127.0.0.1') return true;
        
        // Targets in registry are reachable
        if (this.targetRegistry.hasHost(target.hostname) || this.targetRegistry.hasHost(target.ip)) {
            return true;
        }

        // Web targets from page registry are reachable
        if (target.isWebTarget) {
            // Simulate some unreachable malicious sites
            if (target.security && target.security.threats && target.security.threats.includes('malware')) {
                return Math.random() > 0.3; // 70% chance malicious sites are unreachable
            }
            return true;
        }

        // Common external hosts are reachable
        const reachableHosts = ['8.8.8.8', '1.1.1.1', '140.82.114.4'];
        if (reachableHosts.includes(target.ip)) return true;

        // 90% chance for unknown hosts to be reachable
        return Math.random() > 0.1;
    }

    calculateBaseLatency(target) {
        // Localhost - very low latency
        if (target.ip === '127.0.0.1') return 0.1 + Math.random() * 0.3;
        
        // Local network (192.168.x.x) - low latency
        if (target.ip && target.ip.startsWith('192.168.')) {
            return 1 + Math.random() * 3;
        }

        // Web targets - variable latency based on security level
        if (target.isWebTarget && target.security) {
            let baseLatency = 15; // Default web latency
            
            // Suspicious sites might have higher latency (overloaded servers, proxies, etc.)
            if (target.security.threats && target.security.threats.length > 0) {
                baseLatency += 20 + Math.random() * 30; // Higher latency for malicious sites
            } else if (!target.security.isHttps) {
                baseLatency += 5 + Math.random() * 10; // Slightly higher for HTTP
            }
            
            return baseLatency + Math.random() * 10;
        }

        // Internet hosts - higher latency
        const latencyMap = {
            '8.8.8.8': 15,      // Google DNS
            '1.1.1.1': 12,      // Cloudflare DNS
            '140.82.114.4': 25  // GitHub
        };

        const baseLatency = latencyMap[target.ip] || (20 + Math.random() * 50);
        return baseLatency + Math.random() * 10;
    }

    calculateTTL(target) {
        // Different operating systems have different default TTL values
        if (target.ip === '127.0.0.1') return 64; // Linux localhost
        
        // Simulate different OS TTL values
        const ttlValues = [64, 128, 255]; // Linux, Windows, Cisco
        const baseTTL = ttlValues[Math.floor(Math.random() * ttlValues.length)];
        
        // Subtract random hops (1-15)
        const hops = Math.floor(Math.random() * 15) + 1;
        return Math.max(1, baseTTL - hops);
    }

    isSuspiciousHost(hostname) {
        const suspiciousIndicators = [
            'temp', 'tmp', 'malware', 'hack', 'exploit', 'payload',
            'bot', 'spam', 'phish', 'scam', 'fraud'
        ];
        
        return suspiciousIndicators.some(indicator => 
            hostname.toLowerCase().includes(indicator)
        );
    }

    getPacketLossRate(target) {
        // Local network - very low packet loss
        if (target.ip && target.ip.startsWith('192.168.')) return 0.001;
        
        // Localhost - no packet loss
        if (target.ip === '127.0.0.1') return 0;
        
        // Web targets with security issues - higher packet loss
        if (target.isWebTarget && target.security) {
            if (target.security.threats && target.security.threats.length > 0) {
                return 0.05 + Math.random() * 0.10; // 5-15% packet loss for malicious sites
            } else if (!target.security.isHttps) {
                return 0.02 + Math.random() * 0.03; // 2-5% packet loss for HTTP sites
            }
            return 0.005 + Math.random() * 0.01; // Very low packet loss for secure sites
        }
        
        // Internet - slight packet loss
        return 0.01 + Math.random() * 0.02; // 1-3% packet loss
    }

    showPingStatistics(targetName, targetIp, sent, received, minTime, maxTime, totalTime, startTime) {
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;
        const lossPercentage = sent > 0 ? ((sent - received) / sent * 100).toFixed(1) : 0;
        const avgTime = received > 0 ? (totalTime / received).toFixed(3) : 0;

        this.addOutput('');
        this.addOutput(`--- ${targetName} ping statistics ---`);
        this.addOutput(`${sent} packets transmitted, ${received} received, ${lossPercentage}% packet loss, time ${Math.floor(duration * 1000)}ms`);
        
        if (received > 0) {
            const minTimeStr = minTime === Infinity ? '0.000' : minTime.toFixed(3);
            const maxTimeStr = maxTime.toFixed(3);
            this.addOutput(`rtt min/avg/max/mdev = ${minTimeStr}/${avgTime}/${maxTimeStr}/0.000 ms`);
        }
    }

    showBasicUsage() {
        this.addOutput('Usage: ping [OPTION...] destination');
        this.addOutput('');
        this.addOutput('Examples:');
        this.addOutput('  ping vote.municipality.gov');
        this.addOutput('  ping -c 10 192.168.100.10');
        this.addOutput('  ping -i 0.5 localhost');
        this.addOutput('');
        this.addOutput('Try `ping --help` for more options');
    }

    getHelp() {
        return {
            name: 'ping',
            description: 'Send ICMP ECHO_REQUEST packets to network hosts',
            usage: 'ping [options] destination',
            options: [
                { flag: '-c count', description: 'Stop after sending count packets' },
                { flag: '-i interval', description: 'Wait interval seconds between packets' },
                { flag: '-s packetsize', description: 'Specify packet size in bytes' },
                { flag: '-t', description: 'Ping continuously until interrupted' },
                { flag: '-v', description: 'Verbose output' },
                { flag: '-W timeout', description: 'Time to wait for response (seconds)' },
                { flag: '-f', description: 'Flood ping (fast interval)' },
                { flag: '--help', description: 'Show this help message' }
            ]
        };
    }

    showHelp() {
        const help = this.getHelp();
        this.addOutput(`${help.name} - ${help.description}`, 'text-green-400');
        this.addOutput('');
        this.addOutput(`Usage: ${help.usage}`);
        this.addOutput('');
        this.addOutput('OPTIONS:', 'text-blue-400');
        help.options.forEach(option => {
            this.addOutput(`  ${option.flag.padEnd(20)} ${option.description}`);
        });
        this.addOutput('');
        this.addOutput('EXAMPLES:', 'text-blue-400');
        this.addOutput('  ping vote.municipality.gov');
        this.addOutput('  ping -c 4 vote-db.municipality.gov');
        this.addOutput('  ping -i 0.2 192.168.100.10');
        this.addOutput('  ping -t localhost');
        this.addOutput('  ping -v -c 10 8.8.8.8');
        this.addOutput('  ping suspicious-site.com');
        this.addOutput('  ping cyberquest.com');
        this.addOutput('');
        this.addOutput('NOTE:', 'text-yellow-400');
        this.addOutput('  Use Ctrl+C to stop continuous pings');
        this.addOutput('  Ping can help identify network connectivity issues');
        this.addOutput('  Unusual response times may indicate network problems');
        this.addOutput('  Security warnings may appear for suspicious websites');
    }

    // Method to stop ping (could be called by Ctrl+C handler)
    stop() {
        this.isRunning = false;
    }
}
