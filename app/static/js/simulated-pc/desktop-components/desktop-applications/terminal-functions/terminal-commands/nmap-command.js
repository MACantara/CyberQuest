import { BaseCommand } from './base-command.js';
import { targetHostRegistry } from './target-hosts/target-host-registry.js';

export class NmapCommand extends BaseCommand {
    constructor(processor) {
        super(processor);
        this.targetRegistry = targetHostRegistry;
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

        if (options.version) {
            this.showVersion();
            return;
        }

        if (!options.target) {
            this.addOutput('nmap: No target specified', 'text-red-400');
            this.addOutput('Try `nmap --help` for more information');
            return;
        }

        // Execute the appropriate scan
        this.performScan(options);
    }

    parseArguments(args) {
        const options = {
            target: null,
            scanType: 'tcp',
            ports: null,
            verbose: false,
            scriptScan: false,
            vulnScan: false,
            osScan: false,
            serviceScan: false,
            help: false,
            version: false
        };

        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            
            switch (arg) {
                case '-h':
                case '--help':
                    options.help = true;
                    break;
                case '-V':
                case '--version':
                    options.version = true;
                    break;
                case '-sV':
                    options.serviceScan = true;
                    break;
                case '-O':
                    options.osScan = true;
                    break;
                case '-sC':
                case '--script':
                    options.scriptScan = true;
                    break;
                case '--script=vuln':
                    options.vulnScan = true;
                    break;
                case '-v':
                    options.verbose = true;
                    break;
                case '-p':
                    if (i + 1 < args.length) {
                        options.ports = args[++i];
                    }
                    break;
                case '-sS':
                    options.scanType = 'syn';
                    break;
                case '-sU':
                    options.scanType = 'udp';
                    break;
                case '-A':
                    options.serviceScan = true;
                    options.osScan = true;
                    options.scriptScan = true;
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

    performScan(options) {
        const target = this.targetRegistry.resolveTarget(options.target);
        
        if (!target) {
            this.addOutput(`nmap: Failed to resolve "${options.target}"`, 'text-red-400');
            return;
        }

        // Show scan initialization
        this.addOutput(`Starting Nmap 7.80 ( https://nmap.org ) at ${new Date().toLocaleString()}`, 'text-green-400');
        this.addOutput(`Nmap scan report for ${target.hostname || options.target} (${target.ip || options.target})`);
        this.addOutput(`Host is up (0.00015s latency).`);
        
        if (options.verbose) {
            this.addOutput(`Scanning ${target.hostname || options.target} [${this.getPortCount(target, options)} ports]`, 'text-blue-400');
        }

        // Perform port scan
        this.performPortScan(target, options);

        // Additional scans based on options
        if (options.serviceScan) {
            this.performServiceScan(target, options);
        }

        if (options.osScan) {
            this.performOsScan(target, options);
        }

        if (options.scriptScan || options.vulnScan) {
            this.performScriptScan(target, options);
        }

        // Show scan completion
        this.addOutput('');
        this.addOutput(`Nmap done: 1 IP address (1 host up) scanned in 2.15 seconds`, 'text-green-400');
    }

    performPortScan(target, options) {
        if (target.isNetworkRange()) {
            // Network range scan
            this.addOutput('');
            this.addOutput('HOST DISCOVERY:', 'text-blue-400');
            const networkSummary = target.getNetworkSummary();
            networkSummary.activeHosts.forEach(ip => {
                const hostData = this.targetRegistry.resolveTarget(ip);
                this.addOutput(`${ip} - ${hostData?.hostname || 'Unknown'} - UP`);
            });
            return;
        }

        const ports = this.getPortsToScan(target, options);
        
        this.addOutput('');
        this.addOutput('PORT     STATE SERVICE', 'text-blue-400');
        
        ports.forEach(([port, portData]) => {
            const state = portData.state;
            const service = portData.service;
            const portStr = `${port}/tcp`.padEnd(9);
            const stateStr = state.padEnd(6);
            const stateColor = state === 'open' ? 'text-green-400' : 'text-red-400';
            
            this.addOutput(`${portStr} ${stateStr} ${service}`, stateColor);
        });
    }

    performServiceScan(target, options) {
        if (target.isNetworkRange()) return;

        this.addOutput('');
        this.addOutput('SERVICE DETECTION:', 'text-blue-400');
        
        const ports = this.getPortsToScan(target, options);
        ports.forEach(([port, portData]) => {
            if (portData.state === 'open') {
                this.addOutput(`${port}/tcp  ${portData.service}  ${portData.version}`, 'text-cyan-400');
                if (portData.banner && options.verbose) {
                    this.addOutput(`  Banner: ${portData.banner}`, 'text-gray-400');
                }
            }
        });
    }

    performOsScan(target, options) {
        if (target.isNetworkRange()) return;

        this.addOutput('');
        this.addOutput('OS DETECTION:', 'text-blue-400');
        this.addOutput(`Running: ${target.os}`, 'text-yellow-400');
        this.addOutput(`Uptime: ${target.uptime}`, 'text-gray-400');
        this.addOutput('Network Distance: 1 hop', 'text-gray-400');
    }

    performScriptScan(target, options) {
        if (target.isNetworkRange()) return;

        this.addOutput('');
        this.addOutput('SCRIPT SCAN RESULTS:', 'text-blue-400');

        const hostname = target.hostname || 'unknown';
        let foundVulns = false;

        // Run vulnerability scripts if requested
        if (options.vulnScan) {
            const vulnerabilityScripts = this.targetRegistry.getVulnerabilityScripts();
            
            for (const [scriptName, scriptResults] of Object.entries(vulnerabilityScripts)) {
                for (const [targetPort, results] of Object.entries(scriptResults)) {
                    if (targetPort.includes(hostname)) {
                        foundVulns = true;
                        this.addOutput(`| ${scriptName}:`, 'text-red-400');
                        results.forEach(result => {
                            const severity = this.getVulnerabilitySeverity(result);
                            this.addOutput(`|   ${result}`, severity);
                        });
                        this.addOutput('|');
                    }
                }
            }
        } else {
            // Standard script scan (safer scripts)
            this.addOutput('| http-server-header:', 'text-cyan-400');
            this.addOutput('|   Apache/2.4.41 (Ubuntu)', 'text-gray-400');
            this.addOutput('|');
            this.addOutput('| http-title:', 'text-cyan-400');
            this.addOutput('|   SecureVote Pro - Municipal Voting System', 'text-gray-400');
            this.addOutput('|');
            this.addOutput('| ssl-cert:', 'text-cyan-400');
            this.addOutput('|   Subject: commonName=vote.municipality.gov', 'text-gray-400');
            this.addOutput('|   Issuer: commonName=SecureVote CA', 'text-gray-400');
            this.addOutput('|');
        }

        if (options.vulnScan && foundVulns) {
            this.addOutput('WARNING: Critical vulnerabilities detected!', 'text-red-400');
            this.addOutput('Recommendation: Conduct thorough security assessment', 'text-yellow-400');
        }
    }

    getVulnerabilitySeverity(result) {
        if (result.includes('CRITICAL')) return 'text-red-400';
        if (result.includes('HIGH')) return 'text-red-400';
        if (result.includes('MEDIUM')) return 'text-yellow-400';
        if (result.includes('WARNING')) return 'text-yellow-400';
        return 'text-gray-400';
    }

    getPortsToScan(target, options) {
        if (target.isNetworkRange()) return [];

        let portsToCheck = Object.entries(target.ports);
        
        if (options.ports) {
            const requestedPorts = options.ports.split(',').map(p => parseInt(p.trim()));
            portsToCheck = portsToCheck.filter(([port]) => requestedPorts.includes(parseInt(port)));
        }
        
        return portsToCheck;
    }

    getPortCount(target, options) {
        if (target.isNetworkRange()) {
            const networkSummary = target.getNetworkSummary();
            return networkSummary.activeHosts.length;
        }
        
        if (options.ports) {
            return options.ports.split(',').length;
        }
        
        return Object.keys(target.ports).length;
    }

    showBasicUsage() {
        this.addOutput('Nmap 7.80 ( https://nmap.org )');
        this.addOutput('Usage: nmap [Scan Type(s)] [Options] {target specification}');
        this.addOutput('');
        this.addOutput('Examples:');
        this.addOutput('  nmap vote.municipality.gov');
        this.addOutput('  nmap -sV vote.municipality.gov');
        this.addOutput('  nmap --script=vuln vote.municipality.gov');
        this.addOutput('  nmap 192.168.100.0/24');
        this.addOutput('');
        this.addOutput('Try `nmap --help` for more options');
    }

    showVersion() {
        this.addOutput('Nmap version 7.80 ( https://nmap.org )', 'text-green-400');
        this.addOutput('Platform: linux');
        this.addOutput('Compiled with: liblua-5.3.3 openssl-1.1.1 libssh2-1.8.0 libz-1.2.11 libpcre-8.39 libpcap-1.9.1 nmap-libdnet-1.12');
        this.addOutput('Available nsock engines: epoll poll select');
    }

    getHelp() {
        return {
            name: 'nmap',
            description: 'Network exploration tool and security scanner',
            usage: 'nmap [Scan Type(s)] [Options] {target specification}',
            options: [
                { flag: '-sS', description: 'TCP SYN scan (default)' },
                { flag: '-sV', description: 'Version detection' },
                { flag: '-O', description: 'Enable OS detection' },
                { flag: '-A', description: 'Enable aggressive scan (OS detection, version detection, script scanning)' },
                { flag: '-sC', description: 'Equivalent to --script=default' },
                { flag: '--script=vuln', description: 'Run vulnerability detection scripts' },
                { flag: '-p <ports>', description: 'Only scan specified ports' },
                { flag: '-v', description: 'Increase verbosity level' },
                { flag: '--help', description: 'Show this help message' },
                { flag: '--version', description: 'Show version information' }
            ]
        };
    }

    showHelp() {
        const help = this.getHelp();
        this.addOutput(`${help.name} - ${help.description}`, 'text-green-400');
        this.addOutput('');
        this.addOutput(`Usage: ${help.usage}`);
        this.addOutput('');
        this.addOutput('SCAN TECHNIQUES:', 'text-blue-400');
        this.addOutput('  -sS    TCP SYN scan (default)');
        this.addOutput('  -sU    UDP scan');
        this.addOutput('');
        this.addOutput('SERVICE/VERSION DETECTION:', 'text-blue-400');
        this.addOutput('  -sV    Probe open ports to determine service/version info');
        this.addOutput('');
        this.addOutput('OS DETECTION:', 'text-blue-400');
        this.addOutput('  -O     Enable OS detection');
        this.addOutput('');
        this.addOutput('SCRIPT SCAN:', 'text-blue-400');
        this.addOutput('  -sC               Equivalent to --script=default');
        this.addOutput('  --script=<lua scripts>  Run specified scripts');
        this.addOutput('  --script=vuln     Run vulnerability detection scripts');
        this.addOutput('');
        this.addOutput('PORT SPECIFICATION:', 'text-blue-400');
        this.addOutput('  -p <port ranges>  Only scan specified ports');
        this.addOutput('                   Ex: -p22,53,110,143-4564');
        this.addOutput('');
        this.addOutput('MISC:', 'text-blue-400');
        this.addOutput('  -A     Enable aggressive scan (OS detection, version detection, script scanning)');
        this.addOutput('  -v     Increase verbosity level');
        this.addOutput('  -h     Show this help summary');
        this.addOutput('  -V     Show version number');
        this.addOutput('');
        this.addOutput('EXAMPLES:', 'text-blue-400');
        this.addOutput('  nmap vote.municipality.gov');
        this.addOutput('  nmap -sV -O vote.municipality.gov');
        this.addOutput('  nmap --script=vuln vote.municipality.gov');
        this.addOutput('  nmap -p 80,443 vote.municipality.gov');
        this.addOutput('  nmap 192.168.100.0/24');
        this.addOutput('');
        this.addOutput('SEE THE MAN PAGE (https://nmap.org/book/man.html) FOR MORE OPTIONS AND EXAMPLES');
    }
}