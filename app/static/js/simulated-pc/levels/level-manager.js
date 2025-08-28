/**
 * Level Manager - Centralized loading and management of all levels
 */

import { Level1Config } from './level-one/level-config.js';
import { Level2Config } from './level-two/level-config.js';
import { Level3Config } from './level-three/level-config.js';
import { Level4Config } from './level-four/level-config.js';
import { Level5Config } from './level-five/level-config.js';

export class LevelManager {
    constructor() {
        this.levels = new Map();
        this.currentLevel = null;
        this.loadedModules = new Map();
        
        // Register all levels
        this.registerLevel(Level1Config);
        this.registerLevel(Level2Config);
        this.registerLevel(Level3Config);
        this.registerLevel(Level4Config);
        this.registerLevel(Level5Config);
    }
    
    registerLevel(config) {
        this.levels.set(config.id, config);
    }
    
    async loadLevel(levelId) {
        const config = this.levels.get(levelId);
        if (!config) {
            throw new Error(`Level ${levelId} not found`);
        }
        
        console.log(`Loading Level ${levelId}: ${config.name}`);
        
        try {
            // Load level-specific modules
            await this.loadLevelModules(levelId, config);
            this.currentLevel = config;
            return config;
        } catch (error) {
            console.error(`Failed to load level ${levelId}:`, error);
            throw error;
        }
    }
    
    async loadLevelModules(levelId, config) {
        const levelPath = `./level-${this.getLevelWord(levelId)}`;
        
        // Load dialogues
        for (const dialogue of config.dialogues) {
            try {
                const module = await import(`${levelPath}/dialogues/${dialogue}.js`);
                this.loadedModules.set(`${levelId}-dialogue-${dialogue}`, module);
            } catch (error) {
                console.warn(`Failed to load dialogue ${dialogue} for level ${levelId}:`, error);
            }
        }
        
        // Load level-specific tutorials
        const levelTutorials = config.tutorials.filter(tutorial => 
            tutorial.startsWith('level') || tutorial.includes(levelId.toString())
        );
        
        for (const tutorial of levelTutorials) {
            try {
                const module = await import(`${levelPath}/tutorials/${tutorial}.js`);
                this.loadedModules.set(`${levelId}-tutorial-${tutorial}`, module);
            } catch (error) {
                console.warn(`Failed to load tutorial ${tutorial} for level ${levelId}:`, error);
            }
        }
        
        // Load level-specific apps if they exist
        try {
            const appsModule = await import(`${levelPath}/apps/index.js`);
            this.loadedModules.set(`${levelId}-apps`, appsModule);
        } catch (error) {
            // Apps module is optional
            console.log(`No custom apps module for level ${levelId}`);
        }
        
        // Load level-specific data if it exists
        try {
            const dataModule = await import(`${levelPath}/data/index.js`);
            this.loadedModules.set(`${levelId}-data`, dataModule);
        } catch (error) {
            // Data module is optional
            console.log(`No custom data module for level ${levelId}`);
        }
        
        // Load special features for level 5
        if (levelId === 5) {
            try {
                const evidenceTracker = await import(`${levelPath}/evidence-tracker.js`);
                const scoringSystem = await import(`${levelPath}/scoring-system.js`);
                
                this.loadedModules.set(`${levelId}-evidence-tracker`, evidenceTracker);
                this.loadedModules.set(`${levelId}-scoring-system`, scoringSystem);
            } catch (error) {
                console.warn(`Failed to load level 5 special features:`, error);
            }
        }
    }
    
    getLevelWord(levelId) {
        const words = ['one', 'two', 'three', 'four', 'five'];
        return words[levelId - 1] || levelId.toString();
    }
    
    getLevel(levelId) {
        return this.levels.get(levelId);
    }
    
    getCurrentLevel() {
        return this.currentLevel;
    }
    
    getLoadedModule(key) {
        return this.loadedModules.get(key);
    }
    
    getAllLevels() {
        return Array.from(this.levels.values());
    }
    
    unloadLevel() {
        if (this.currentLevel) {
            console.log(`Unloading Level ${this.currentLevel.id}: ${this.currentLevel.name}`);
            this.loadedModules.clear();
            this.currentLevel = null;
        }
    }
}

// Global instance
export const levelManager = new LevelManager();
