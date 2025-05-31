/**
 * Pagination Helper Utility
 * Main entry point that composes all pagination modules
 */

import { PaginationCore } from './pagination/core.js';
import { PaginationControls } from './pagination/controls.js';
import { PaginationMobile } from './pagination/mobile.js';
import { PaginationInteractions } from './pagination/interactions.js';

export class PaginationHelper {
    constructor(options = {}) {
        this.options = {
            pageParam: 'page',
            perPageParam: 'per_page',
            defaultPerPage: 25,
            maxPagesVisible: 5,
            showJumpToPage: true,
            jumpToPageThreshold: 10,
            ...options
        };

        // Initialize modules
        this.core = new PaginationCore(this.options);
        this.controls = new PaginationControls(this.core);
        this.mobile = new PaginationMobile();
        this.interactions = new PaginationInteractions(this.options);
    }

    /**
     * Generate pagination HTML
     */
    generatePaginationHTML(paginationData, baseUrl, extraParams = {}, position = 'main') {
        const { pagination } = paginationData;
        
        if (!pagination || pagination.total === 0) {
            return '';
        }

        const buildUrl = (page, perPage = null) => {
            return this.core.buildUrl(baseUrl, page, extraParams, perPage);
        };

        const controlsContent = this.controls.generateControls(pagination, buildUrl, position);
        const jumpToPageContent = this.interactions.generateJumpToPage(pagination, position);

        return this.core.generateContainer(pagination, controlsContent, position) + jumpToPageContent;
    }

    /**
     * Initialize pagination functionality
     */
    initializePagination(container) {
        this.interactions.initialize(container);
    }

    // Backward compatibility methods
    generatePaginationControls(pagination, buildUrl, position) {
        return this.controls.generateControls(pagination, buildUrl, position);
    }

    generateMobilePageInfo(pagination) {
        return this.mobile.generateMobilePageInfo(pagination);
    }

    shouldShowJumpToPage(pagination, position) {
        return this.interactions.shouldShowJumpToPage(pagination, position);
    }

    generateJumpToPage(pagination, position) {
        return this.interactions.generateJumpToPage(pagination, position);
    }
}

// Create and export a default instance
const paginationHelper = new PaginationHelper();

export { paginationHelper };
export default paginationHelper;

// Global utility for non-module scripts
if (typeof window !== 'undefined') {
    window.PaginationHelper = PaginationHelper;
    window.paginationHelper = paginationHelper;
}
