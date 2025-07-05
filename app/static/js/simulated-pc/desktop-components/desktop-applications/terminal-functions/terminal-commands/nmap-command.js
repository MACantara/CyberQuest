import { BaseCommand } from './base-command.js';

export class NmapCommand extends BaseCommand {
    constructor(processor) {
        super(processor);
        this.targetHosts = this.initializeTargetHosts();
        this.vulnerabilityScripts = this.initializeVulnScripts();
    }

    initializeTargetHosts() {
        return {
            'vote.municipality.gov': {
                ip: '192.168.100.10',
                hostname: 'vote.municipality.gov',
                description: 'SecureVote Pro Main Server',
                ports: {
                    22: { service: 'ssh', version: 'OpenSSH 8.2', state: 'open', banner: 'SSH-2.0-OpenSSH_8.2' },
                    80: { service: 'http', version: 'Apache 2.4.41', state: 'open', banner: 'Apache/2.4.41 (Ubuntu)' },
                    443: { service: 'https', version: 'Apache 2.4.41', state: 'open', banner: 'Apache/2.4.41 (Ubuntu) SSL/TLS' },
                    3306: { service: 'mysql', version: 'MySQL 8.0.25', state: 'open', banner: 'MySQL 8.0.25-0ubuntu0.20.04.1' },
                    8080: { service: 'http-alt', version: 'Jetty 9.4.39', state: 'open', banner: 'Jetty(9.4.39.v20210325)' }
                },
                os: 'Linux Ubuntu 20.04.3 LTS',
                uptime: '15 days, 3:42:15'
            },
            'vote-db.municipality.gov': {
                ip: '192.168.100.11',
                hostname: 'vote-db.municipality.gov',
                description: 'SecureVote Pro Database Server',
                ports: {
                    22: { service: 'ssh', version: 'OpenSSH 8.2', state: 'open', banner: 'SSH-2.0-OpenSSH_8.2' },
                    3306: { service: 'mysql', version: 'MySQL 8.0.25', state: 'open', banner: 'MySQL 8.0.25-0ubuntu0.20.04.1' },
                    5432: { service: 'postgresql', version: 'PostgreSQL 13.4', state: 'open', banner: 'PostgreSQL 13.4' }
                },
                os: 'Linux Ubuntu 20.04.3 LTS',
                uptime: '15 days, 3:41:02'
            },
            'vote-admin.municipality.gov': {
                ip: '192.168.100.12',
                hostname: 'vote-admin.municipality.gov',
                description: 'SecureVote Pro Admin Panel',
                ports: {
                    22: { service: 'ssh', version: 'OpenSSH 8.2', state: 'open', banner: 'SSH-2.0-OpenSSH_8.2' },
                    80: { service: 'http', version: 'nginx 1.18.0', state: 'open', banner: 'nginx/1.18.0 (Ubuntu)' },
                    443: { service: 'https', version: 'nginx 1.18.0', state: 'open', banner: 'nginx/1.18.0 (Ubuntu)' },
                    8080: { service: 'http-alt', version: 'AdminPanel 3.2.1', state: 'open', banner: 'SecureVote Admin v3.2.1' }
                },
                os: 'Linux Ubuntu 20.04.3 LTS',
                uptime: '15 days, 3:40:18'
            },
            '192.168.100.0/24': {
                description: 'Municipality Network Range',
                hosts: ['192.168.100.10', '192.168.100.11', '192.168.100.12']
            }
        };
    }

    initializeVulnScripts() {
        return {
            'http-sql-injection': {
                'vote.municipality.gov:80': [
                    'SQL injection vulnerability found in /voter-lookup endpoint',
                    'Parameter: voter_id appears to be vulnerable to SQL injection',
                    'Payload: \' OR 1=1-- successfully executed',
                    'CRITICAL: Database access possible through injection'
                ],
                'vote.municipality.gov:443': [
                    'SQL injection vulnerability found in /voter-lookup endpoint (HTTPS)',
                    'Same vulnerability present on secure connection'
                ]
            },
            'http-stored-xss': {
                'vote.municipality.gov:80': [
                    'Stored XSS vulnerability found in /results-comments endpoint',
                    'User input not properly sanitized in comment system',
                    'Payload: <script>alert("XSS")</script> successfully stored',
                    'HIGH: Potential for session hijacking and admin impersonation'
                ]
            },
            'http-directory-traversal': {
                'vote.municipality.gov:80': [
                    'Directory traversal vulnerability found',
                    'Path: /admin/../../../etc/passwd accessible',
                    'MEDIUM: Local file inclusion possible'
                ],
                'vote-admin.municipality.gov:8080': [
                    'Directory traversal in admin panel',
                    'Config files accessible via path traversal',
                    'Found: /admin/../config/database.conf',
                    'CRITICAL: Database credentials exposed'
                ]
            },
            'http-default-accounts': {
                'vote-admin.municipality.gov:8080': [
                    'Default credentials detected:',
                    'Username: admin',
                    'Password: password',
                    'CRITICAL: Default admin credentials active'
                ]
            },
            'ssl-cert': {
                'vote.municipality.gov:443': [
                    'SSL Certificate Information:',
                    'Subject: CN=vote.municipality.gov',
                    'Issuer: Self-signed certificate',
                    'Valid from: 2024-01-01 to 2025-01-01',
                    'WARNING: Self-signed certificate - potential MITM risk'
                ]
            },
            'mysql-info': {
                'vote.municipality.gov:3306': [
                    'MySQL Server Information:',
                    'Version: 8.0.25-0ubuntu0.20.04.1',
                    'Authentication: mysql_native_password',
                    'Databases: information_schema, mysql, performance_schema, voting_system'
                ],
                'vote-db.municipality.gov:3306': [
                    'MySQL Server Information:',
                    'Version: 8.0.25-0ubuntu0.20.04.1',
                    'Root access: Possible with weak credentials',
                    'CRITICAL: Weak MySQL root password detected'
                ]
            }
        };
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
        const target = this.resolveTarget(options.target);
        
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

    resolveTarget(targetStr) {
        // Handle network ranges
        if (targetStr.includes('/')) {
            return this.targetHosts[targetStr];
        }

        // Direct hostname lookup
        if (this.targetHosts[targetStr]) {
            return this.targetHosts[targetStr];
        }

        // IP address lookup
        for (const [hostname, data] of Object.entries(this.targetHosts)) {
            if (data.ip === targetStr) {
                return { ...data, hostname };
            }
        }

        return null;
    }

    performPortScan(target, options) {
        if (target.hosts) {
            // Network range scan
            this.addOutput('');
            this.addOutput('HOST DISCOVERY:', 'text-blue-400');
            target.hosts.forEach(ip => {
                const hostData = this.resolveTarget(ip);
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
        if (target.hosts) return;

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
        if (target.hosts) return;

        this.addOutput('');
        this.addOutput('OS DETECTION:', 'text-blue-400');
        this.addOutput(`Running: ${target.os}`, 'text-yellow-400');
        this.addOutput(`Uptime: ${target.uptime}`, 'text-gray-400');
        this.addOutput('Network Distance: 1 hop', 'text-gray-400');
    }

    performScriptScan(target, options) {
        if (target.hosts) return;

        this.addOutput('');
        this.addOutput('SCRIPT SCAN RESULTS:', 'text-blue-400');

        const hostname = target.hostname || 'unknown';
        let foundVulns = false;

        // Run vulnerability scripts if requested
        if (options.vulnScan) {
            for (const [scriptName, scriptResults] of Object.entries(this.vulnerabilityScripts)) {
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
        if (target.hosts) return [];

        let portsToCheck = Object.entries(target.ports);
        
        if (options.ports) {
            const requestedPorts = options.ports.split(',').map(p => parseInt(p.trim()));
            portsToCheck = portsToCheck.filter(([port]) => requestedPorts.includes(parseInt(port)));
        }
        
        return portsToCheck;
    }

    getPortCount(target, options) {
        if (target.hosts) return target.hosts.length;
        
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
