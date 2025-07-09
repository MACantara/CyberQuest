export class InteractiveUI {
    constructor(labelingSystem) {
        this.labelingSystem = labelingSystem;
    }

    addInteractiveStyles() {
        if (document.getElementById('interactive-labeling-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'interactive-labeling-styles';
        style.textContent = `
            .interactive-element {
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
                border-radius: 4px;
                padding: 2px 4px;
                margin: -2px -4px;
            }
            
            .interactive-element:hover {
                background-color: rgba(59, 130, 246, 0.1);
                box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
            }
            
            .interactive-element.labeled-fake {
                background-color: rgba(239, 68, 68, 0.2);
                border: 2px solid #ef4444;
            }
            
            .interactive-element.labeled-real {
                background-color: rgba(34, 197, 94, 0.2);
                border: 2px solid #22c55e;
            }
            
            .interactive-element.correct {
                background-color: rgba(34, 197, 94, 0.3);
                border: 2px solid #22c55e;
            }
            
            .interactive-element.incorrect {
                background-color: rgba(239, 68, 68, 0.3);
                border: 2px solid #ef4444;
            }
            
            .labeling-instructions {
                position: fixed;
                top: 80px;
                right: 20px;
                width: 320px;
                background: rgba(55, 65, 81, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 12px;
                border: 2px solid #374151;
                color: white;
                padding: 20px;
                font-family: 'Inter', sans-serif;
                z-index: 1000;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            }
            
            .instructions-header {
                color: #10b981;
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .instructions-content {
                font-size: 14px;
                line-height: 1.5;
                color: #d1d5db;
                margin-bottom: 15px;
            }
            
            .labeling-legend {
                display: flex;
                flex-direction: column;
                gap: 8px;
                margin-bottom: 15px;
            }
            
            .legend-item {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 13px;
                color: #d1d5db;
            }
            
            .legend-color {
                width: 16px;
                height: 16px;
                border-radius: 4px;
                border: 2px solid;
            }
            
            .legend-fake {
                background: rgba(239, 68, 68, 0.2);
                border-color: #ef4444;
            }
            
            .legend-real {
                background: rgba(34, 197, 94, 0.2);
                border-color: #22c55e;
            }
            
            .progress-info {
                font-size: 12px;
                color: #9ca3af;
                text-align: center;
                padding: 8px;
                background: rgba(31, 41, 55, 0.8);
                border: 1px solid #4b5563;
                border-radius: 6px;
                margin-bottom: 15px;
            }
            
            .submit-analysis-btn {
                width: 100%;
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                border: none;
                padding: 12px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 14px;
            }
            
            .submit-analysis-btn:hover {
                background: linear-gradient(135deg, #059669 0%, #047857 100%);
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
            }
            
            .submit-analysis-btn:disabled {
                background: #4b5563;
                cursor: not-allowed;
                transform: none;
                box-shadow: none;
            }
        `;
        document.head.appendChild(style);
    }

    showInstructions() {
        const existing = document.querySelector('.labeling-instructions');
        if (existing) existing.remove();
        
        const educationalNotes = this.labelingSystem.batchAnalysis?.educational_focus || 
                               'Click on different parts of the article to label them as fake or real. This data comes from pre-analyzed batch training data.';
        
        const analysisSourceText = this.labelingSystem.analysisSource === 'batch-json' ? 
            '📊 Batch Analysis Data' : '❌ No Analysis Data';
        
        const instructions = document.createElement('div');
        instructions.className = 'labeling-instructions';
        instructions.innerHTML = `
            <div class="instructions-header">
                <span>🎯</span>
                <span>Interactive Analysis</span>
            </div>
            <div class="instructions-content">
                ${educationalNotes}
            </div>
            <div class="labeling-legend">
                <div class="legend-item">
                    <div class="legend-color legend-fake"></div>
                    <span>Fake/Suspicious</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color legend-real"></div>
                    <span>Real/Legitimate</span>
                </div>
            </div>
            <div class="progress-info">
                Article ${this.labelingSystem.currentArticleIndex + 1} of ${this.labelingSystem.totalArticles}
                <br>${analysisSourceText}
            </div>
            <button class="submit-analysis-btn" onclick="window.interactiveLabeling?.submitAnalysis()">
                Submit Analysis
            </button>
        `;
        
        document.body.appendChild(instructions);
        window.interactiveLabeling = this.labelingSystem;
    }

    updateInstructions() {
        const progressInfo = document.querySelector('.progress-info');
        if (progressInfo) {
            const labeledCount = Array.from(this.labelingSystem.labeledElements.values()).filter(el => el.labeled).length;
            const totalCount = this.labelingSystem.labeledElements.size;
            progressInfo.innerHTML = `
                Article ${this.labelingSystem.currentArticleIndex + 1} of ${this.labelingSystem.totalArticles}<br>
                Labeled: ${labeledCount}/${totalCount} elements
            `;
        }
    }

    cleanupStyles() {
        const styles = document.getElementById('interactive-labeling-styles');
        if (styles && !document.querySelector('.labeling-instructions')) {
            styles.remove();
        }
    }

    cleanup() {
        const instructions = document.querySelector('.labeling-instructions');
        if (instructions) instructions.remove();
        
        this.cleanupStyles();
    }
}
