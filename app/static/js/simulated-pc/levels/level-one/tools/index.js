// Level 1 Tools Index
// Browser-based cybersecurity tools for The Misinformation Maze

export { InteractiveLabeling } from './interactive-labeling.js';
export { CrossReferenceToolPage } from './cross-reference-tool.js';
export { ReverseImageSearchPage } from './reverse-image-search.js';
export { Challenge1Page } from './challenge1/challenge1-page.js';

// Tool categories for Level 1
export const LEVEL_1_TOOLS = {
    FACT_CHECKING: {
        interactive_labeling: 'Interactive element labeling for fake news detection',
        cross_reference: 'Cross-reference tool for fact verification',
        reverse_image_search: 'Reverse image search for media verification'
    },
    CHALLENGES: {
        challenge1: 'Primary challenge: Daily Politico News misinformation detection'
    }
};

console.log('Level 1 Tools loaded: Interactive Labeling, Cross-Reference Tool, Reverse Image Search, Challenge1');
