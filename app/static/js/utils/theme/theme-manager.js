/**
 * Theme Manager Utility
 * Handles dark/light theme switching and persistence
 */

export class ThemeManager {
    constructor() {
        this.themes = ['light', 'dark', 'system'];
        this.currentTheme = this.getThemePreference();
    }

    /**
     * Initialize theme management
     */
    init() {
        // Apply initial theme immediately to prevent FOUC
        this.applyTheme(this.currentTheme);
        
        // Setup event listeners when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
        } else {
            this.setupEventListeners();
        }

        // Listen for system theme changes
        this.setupSystemThemeListener();
    }

    /**
     * Apply theme to document
     * @param {string} theme - Theme to apply (light, dark, system)
     */
    applyTheme(theme) {
        const isDark = theme === 'dark' || 
                      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        document.documentElement.classList.toggle('dark', isDark);
    }

    /**
     * Get theme preference from localStorage
     * @returns {string} - Current theme preference
     */
    getThemePreference() {
        const savedTheme = localStorage.getItem('theme');
        return this.themes.includes(savedTheme) ? savedTheme : 'system';
    }

    /**
     * Save theme preference to localStorage
     * @param {string} theme - Theme to save
     */
    saveTheme(theme) {
        if (theme === 'system') {
            localStorage.removeItem('theme');
        } else {
            localStorage.setItem('theme', theme);
        }
    }

    /**
     * Get current effective theme (resolves system to actual theme)
     * @returns {string} - Effective theme (light or dark)
     */
    getCurrentEffectiveTheme() {
        if (this.currentTheme === 'system') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return this.currentTheme;
    }

    /**
     * Set theme and update UI
     * @param {string} theme - Theme to set
     */
    setTheme(theme) {
        if (!this.themes.includes(theme)) return;

        this.currentTheme = theme;
        this.applyTheme(theme);
        this.saveTheme(theme);
        this.updateThemeButtons(theme);
        this.closeThemeDropdowns();

        // Dispatch custom event
        this.dispatchThemeChangeEvent(theme);
    }

    /**
     * Setup event listeners for theme controls
     */
    setupEventListeners() {
        // Update initial button states
        this.updateThemeButtons(this.currentTheme);

        // Handle theme selection
        document.querySelectorAll('[data-theme]').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const selectedTheme = button.dataset.theme;
                this.setTheme(selectedTheme);
            });
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', () => {
            this.closeThemeDropdowns();
        });

        // Prevent dropdown from closing when clicking inside
        const themeMenus = document.querySelectorAll('#theme-menu, #theme-menu-mobile');
        themeMenus.forEach(menu => {
            menu?.addEventListener('click', (e) => e.stopPropagation());
        });
    }

    /**
     * Setup system theme change listener
     */
    setupSystemThemeListener() {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            // Apply system theme change if currently using system preference
            if (this.currentTheme === 'system') {
                this.applyTheme('system');
                this.updateThemeButtons('system');
            }
        });
    }

    /**
     * Update theme button states
     * @param {string} theme - Current theme
     */
    updateThemeButtons(theme) {
        // Update toggle button icons
        document.querySelectorAll('#theme-toggle, #theme-toggle-mobile').forEach(button => {
            // Hide all theme icons first
            button.querySelectorAll('.theme-light, .theme-dark, .theme-system').forEach(icon => {
                icon.classList.add('hidden');
            });
            
            // Show the appropriate icon based on current theme preference
            const iconToShow = button.querySelector(`.theme-${theme}`);
            if (iconToShow) {
                iconToShow.classList.remove('hidden');
            }
        });

        // Update dropdown menu items to show current selection
        document.querySelectorAll('[data-theme]').forEach(item => {
            const isSelected = item.dataset.theme === theme;
            item.classList.toggle('bg-blue-50', isSelected);
            item.classList.toggle('dark:bg-blue-900/30', isSelected);
            item.classList.toggle('text-blue-600', isSelected);
            item.classList.toggle('dark:text-blue-400', isSelected);
        });
    }

    /**
     * Close theme dropdowns
     */
    closeThemeDropdowns() {
        document.getElementById('theme-menu')?.classList.add('hidden');
        document.getElementById('theme-menu-mobile')?.classList.add('hidden');
    }

    /**
     * Dispatch theme change event
     * @param {string} theme - New theme
     */
    dispatchThemeChangeEvent(theme) {
        const event = new CustomEvent('themeChange', {
            detail: {
                theme: theme,
                effectiveTheme: this.getCurrentEffectiveTheme()
            }
        });
        document.dispatchEvent(event);
    }

    /**
     * Toggle between light and dark themes
     */
    toggleTheme() {
        const effectiveTheme = this.getCurrentEffectiveTheme();
        const newTheme = effectiveTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    /**
     * Cycle through all themes
     */
    cycleTheme() {
        const currentIndex = this.themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % this.themes.length;
        this.setTheme(this.themes[nextIndex]);
    }
}

// Create and export default instance
const themeManager = new ThemeManager();

export { themeManager };
export default themeManager;

// Global utility for non-module scripts
if (typeof window !== 'undefined') {
    window.ThemeManager = ThemeManager;
    window.themeManager = themeManager;
    
    // Global utility functions
    window.setTheme = function(theme) {
        themeManager.setTheme(theme);
    };
    
    window.toggleTheme = function() {
        themeManager.toggleTheme();
    };
}
