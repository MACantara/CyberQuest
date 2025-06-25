export class LogAnalyzer {
    constructor(app) {
        this.app = app;
    }

    showAnalysis() {
        const analysis = this.performAnalysis();
        
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        overlay.innerHTML = `
            <div class="bg-gray-800 rounded-lg p-6 max-w-4xl mx-4 max-h-96 overflow-y-auto">
                <h3 class="text-white text-lg font-semibold mb-4">System Log Analysis</h3>
                
                <div class="grid md:grid-cols-2 gap-6">
                    <!-- Summary Statistics -->
                    <div class="bg-gray-900 p-4 rounded">
                        <h4 class="text-green-400 font-semibold mb-3">Summary Statistics</h4>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span class="text-gray-400">Total Logs:</span>
                                <span class="text-white">${analysis.total}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Critical Events:</span>
                                <span class="text-red-400">${analysis.critical}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Error Events:</span>
                                <span class="text-red-300">${analysis.errors}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Warnings:</span>
                                <span class="text-yellow-400">${analysis.warnings}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Security Events:</span>
                                <span class="text-orange-400">${analysis.security}</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Security Assessment -->
                    <div class="bg-gray-900 p-4 rounded">
                        <h4 class="text-red-400 font-semibold mb-3">Security Assessment</h4>
                        <div class="space-y-3">
                            <div class="flex items-center justify-between">
                                <span class="text-gray-400 text-sm">Risk Level:</span>
                                <span class="px-2 py-1 rounded text-xs font-semibold ${this.getRiskLevelClass(analysis.riskLevel)}">
                                    ${analysis.riskLevel.toUpperCase()}
                                </span>
                            </div>
                            <div class="text-sm">
                                <span class="text-gray-400">Top Threats:</span>
                                <ul class="mt-1 space-y-1">
                                    ${analysis.threats.map(threat => 
                                        `<li class="text-red-300">• ${threat}</li>`
                                    ).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Patterns & Trends -->
                    <div class="bg-gray-900 p-4 rounded">
                        <h4 class="text-blue-400 font-semibold mb-3">Detected Patterns</h4>
                        <div class="space-y-2 text-sm">
                            ${analysis.patterns.map(pattern => 
                                `<div class="flex items-start">
                                    <i class="bi bi-info-circle text-blue-400 mr-2 mt-0.5"></i>
                                    <span class="text-gray-300">${pattern}</span>
                                </div>`
                            ).join('')}
                        </div>
                    </div>
                    
                    <!-- Recommendations -->
                    <div class="bg-gray-900 p-4 rounded">
                        <h4 class="text-yellow-400 font-semibold mb-3">Recommendations</h4>
                        <div class="space-y-2 text-sm">
                            ${analysis.recommendations.map(rec => 
                                `<div class="flex items-start">
                                    <i class="bi bi-lightbulb text-yellow-400 mr-2 mt-0.5"></i>
                                    <span class="text-gray-300">${rec}</span>
                                </div>`
                            ).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="flex justify-end space-x-2 mt-6">
                    <button id="export-analysis" 
                            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors cursor-pointer">
                        Export Report
                    </button>
                    <button onclick="this.closest('.fixed').remove()" 
                            class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors cursor-pointer">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        const exportBtn = overlay.querySelector('#export-analysis');
        exportBtn.addEventListener('click', () => {
            this.exportAnalysisReport(analysis);
        });
    }

    performAnalysis() {
        const entries = this.app.windowElement?.querySelectorAll('.log-entry');
        if (!entries) return this.getEmptyAnalysis();

        const visibleEntries = Array.from(entries).filter(entry => entry.style.display !== 'none');
        
        const analysis = {
            total: visibleEntries.length,
            critical: 0,
            errors: 0,
            warnings: 0,
            security: 0,
            sources: {},
            categories: {},
            timeDistribution: {},
            threats: [],
            patterns: [],
            recommendations: [],
            riskLevel: 'low'
        };

        // Count by level and collect data
        visibleEntries.forEach(entry => {
            const level = entry.dataset.level.toLowerCase();
            const source = entry.dataset.source;
            const category = entry.dataset.category;
            
            // Count levels
            if (level === 'critical') analysis.critical++;
            if (level === 'error') analysis.errors++;
            if (level === 'warn') analysis.warnings++;
            if (source === 'security' || category === 'authentication' || category === 'malware') {
                analysis.security++;
            }
            
            // Count sources and categories
            analysis.sources[source] = (analysis.sources[source] || 0) + 1;
            analysis.categories[category] = (analysis.categories[category] || 0) + 1;
        });

        // Analyze threats and patterns
        this.analyzeThreats(analysis);
        this.analyzePatterns(analysis);
        this.generateRecommendations(analysis);
        this.calculateRiskLevel(analysis);

        return analysis;
    }

    analyzeThreats(analysis) {
        if (analysis.critical > 0) {
            analysis.threats.push('Critical security events detected');
        }
        if (analysis.security > 3) {
            analysis.threats.push('High frequency of security events');
        }
        if (analysis.categories.malware > 0) {
            analysis.threats.push('Malware activity detected');
        }
        if (analysis.categories.authentication > 2) {
            analysis.threats.push('Multiple authentication failures');
        }
        if (analysis.threats.length === 0) {
            analysis.threats.push('No immediate threats identified');
        }
    }

    analyzePatterns(analysis) {
        if (analysis.sources.network > analysis.sources.system) {
            analysis.patterns.push('Network events dominate system logs');
        }
        if (analysis.errors > analysis.warnings) {
            analysis.patterns.push('Error rate exceeds warning rate');
        }
        if (analysis.categories.authentication > 1) {
            analysis.patterns.push('Repeated authentication events detected');
        }
        if (Object.keys(analysis.sources).length > 3) {
            analysis.patterns.push('Activity across multiple system sources');
        }
        if (analysis.patterns.length === 0) {
            analysis.patterns.push('Normal activity patterns observed');
        }
    }

    generateRecommendations(analysis) {
        if (analysis.critical > 0) {
            analysis.recommendations.push('Investigate critical events immediately');
        }
        if (analysis.security > 2) {
            analysis.recommendations.push('Review security policies and controls');
        }
        if (analysis.categories.malware > 0) {
            analysis.recommendations.push('Run full system malware scan');
        }
        if (analysis.categories.authentication > 2) {
            analysis.recommendations.push('Review user access logs and policies');
        }
        if (analysis.errors + analysis.critical > 5) {
            analysis.recommendations.push('Consider system health check');
        }
        if (analysis.recommendations.length === 0) {
            analysis.recommendations.push('Continue regular monitoring');
            analysis.recommendations.push('Maintain current security practices');
        }
    }

    calculateRiskLevel(analysis) {
        let riskScore = 0;
        
        riskScore += analysis.critical * 3;
        riskScore += analysis.errors * 2;
        riskScore += analysis.security * 1.5;
        riskScore += analysis.warnings * 0.5;
        
        if (riskScore >= 10) {
            analysis.riskLevel = 'high';
        } else if (riskScore >= 5) {
            analysis.riskLevel = 'medium';
        } else {
            analysis.riskLevel = 'low';
        }
    }

    getRiskLevelClass(level) {
        const classes = {
            'low': 'bg-green-600 text-white',
            'medium': 'bg-yellow-600 text-black',
            'high': 'bg-red-600 text-white'
        };
        return classes[level] || 'bg-gray-600 text-white';
    }

    getEmptyAnalysis() {
        return {
            total: 0,
            critical: 0,
            errors: 0,
            warnings: 0,
            security: 0,
            threats: ['No log data available'],
            patterns: ['Insufficient data for analysis'],
            recommendations: ['Ensure log collection is functioning'],
            riskLevel: 'unknown'
        };
    }

    exportAnalysisReport(analysis) {
        const report = this.generateAnalysisReport(analysis);
        
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        overlay.innerHTML = `
            <div class="bg-gray-800 rounded-lg p-6 max-w-md mx-4">
                <div class="text-center">
                    <i class="bi bi-file-text text-blue-400 text-4xl mb-3"></i>
                    <h3 class="text-white text-lg font-semibold mb-2">Analysis Report Generated</h3>
                    <p class="text-gray-300 text-sm mb-4">
                        Security analysis report has been generated and is ready for review.
                    </p>
                    <button onclick="this.closest('.fixed').remove()" 
                            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer">
                        Close
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    generateAnalysisReport(analysis) {
        const timestamp = new Date().toISOString();
        return `SYSTEM LOG ANALYSIS REPORT
Generated: ${timestamp}

SUMMARY STATISTICS
=================
Total Logs: ${analysis.total}
Critical Events: ${analysis.critical}
Error Events: ${analysis.errors}
Warnings: ${analysis.warnings}
Security Events: ${analysis.security}

SECURITY ASSESSMENT
==================
Risk Level: ${analysis.riskLevel.toUpperCase()}

Identified Threats:
${analysis.threats.map(threat => `- ${threat}`).join('\n')}

DETECTED PATTERNS
================
${analysis.patterns.map(pattern => `- ${pattern}`).join('\n')}

RECOMMENDATIONS
==============
${analysis.recommendations.map(rec => `- ${rec}`).join('\n')}

This analysis is part of the CyberQuest training simulation.
`;
    }
}
