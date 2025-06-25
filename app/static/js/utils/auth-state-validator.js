/**
 * Authentication State Validator
 * Prevents authenticated pages from being accessible via back button after logout
 */

export class AuthStateValidator {
    constructor() {
        this.isInitialized = false;
        this.authCheckInterval = null;
        this.lastAuthCheck = Date.now();
        this.authCheckFrequency = 30000; // Check every 30 seconds
    }

    /**
     * Initialize authentication state validation
     */
    init() {
        if (this.isInitialized) return;
        
        this.setupPageVisibilityHandler();
        this.setupPeriodicAuthCheck();
        this.validateAuthOnLoad();
        this.preventCaching();
        
        this.isInitialized = true;
        console.log('Auth state validator initialized');
    }

    /**
     * Validate authentication status on page load
     */
    validateAuthOnLoad() {
        // Check if we're on an authenticated page
        const isAuthPage = this.isAuthenticatedPage();
        
        if (isAuthPage) {
            // Add a small delay to ensure DOM is ready
            setTimeout(() => {
                this.checkAuthStatus()
                    .then(isAuthenticated => {
                        if (!isAuthenticated) {
                            console.warn('Authentication expired, redirecting to login');
                            this.redirectToLogin();
                        }
                    })
                    .catch(error => {
                        console.error('Auth check failed:', error);
                        // On error, redirect to login for safety
                        this.redirectToLogin();
                    });
            }, 100);
        }
    }

    /**
     * Setup periodic authentication checking
     */
    setupPeriodicAuthCheck() {
        // Only run periodic checks on authenticated pages
        if (!this.isAuthenticatedPage()) return;

        this.authCheckInterval = setInterval(() => {
            this.checkAuthStatus()
                .then(isAuthenticated => {
                    if (!isAuthenticated) {
                        console.warn('Session expired, redirecting to login');
                        this.redirectToLogin();
                    }
                })
                .catch(error => {
                    console.error('Periodic auth check failed:', error);
                });
        }, this.authCheckFrequency);
    }

    /**
     * Setup page visibility change handler
     * Check auth when user returns to tab
     */
    setupPageVisibilityHandler() {
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.isAuthenticatedPage()) {
                // Page became visible, check auth if it's been a while
                const timeSinceLastCheck = Date.now() - this.lastAuthCheck;
                if (timeSinceLastCheck > 10000) { // 10 seconds
                    this.checkAuthStatus()
                        .then(isAuthenticated => {
                            if (!isAuthenticated) {
                                console.warn('Session expired while away, redirecting to login');
                                this.redirectToLogin();
                            }
                        })
                        .catch(error => {
                            console.error('Visibility auth check failed:', error);
                        });
                }
            }
        });
    }

    /**
     * Check authentication status with server
     * @returns {Promise<boolean>} Whether user is authenticated
     */
    async checkAuthStatus() {
        try {
            this.lastAuthCheck = Date.now();
            
            const response = await fetch('/api/auth/status', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'same-origin',
                cache: 'no-cache'
            });

            if (response.ok) {
                const data = await response.json();
                return data.authenticated === true;
            } else if (response.status === 401 || response.status === 403) {
                return false;
            } else {
                throw new Error(`Auth check failed with status: ${response.status}`);
            }
        } catch (error) {
            console.error('Auth status check error:', error);
            // On network error, assume not authenticated for safety
            return false;
        }
    }

    /**
     * Check if current page requires authentication
     * @returns {boolean} Whether page requires authentication
     */
    isAuthenticatedPage() {
        // Check URL patterns that require authentication
        const authPaths = ['/admin', '/profile', '/levels', '/dashboard'];
        const currentPath = window.location.pathname;
        
        // Check if page has auth indicators in DOM
        const hasAuthIndicators = 
            document.querySelector('[data-requires-auth]') !== null ||
            document.querySelector('.user-avatar') !== null ||
            document.querySelector('.admin-only') !== null ||
            document.querySelector('#user-dropdown') !== null;

        // Check if URL matches auth patterns
        const matchesAuthPath = authPaths.some(path => currentPath.startsWith(path));
        
        return hasAuthIndicators || matchesAuthPath;
    }

    /**
     * Prevent caching of authenticated pages
     */
    preventCaching() {
        if (this.isAuthenticatedPage()) {
            // Add cache-busting meta tags if not already present
            if (!document.querySelector('meta[http-equiv="Cache-Control"]')) {
                const cacheControl = document.createElement('meta');
                cacheControl.setAttribute('http-equiv', 'Cache-Control');
                cacheControl.setAttribute('content', 'no-cache, no-store, must-revalidate');
                document.head.appendChild(cacheControl);
            }

            if (!document.querySelector('meta[http-equiv="Pragma"]')) {
                const pragma = document.createElement('meta');
                pragma.setAttribute('http-equiv', 'Pragma');
                pragma.setAttribute('content', 'no-cache');
                document.head.appendChild(pragma);
            }

            if (!document.querySelector('meta[http-equiv="Expires"]')) {
                const expires = document.createElement('meta');
                expires.setAttribute('http-equiv', 'Expires');
                expires.setAttribute('content', '0');
                document.head.appendChild(expires);
            }
        }
    }

    /**
     * Redirect to login page
     */
    redirectToLogin() {
        // Clear any auth-related storage
        this.clearAuthData();
        
        // Redirect to login with return URL
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
        const loginUrl = `/auth/login?next=${returnUrl}`;
        
        // Use replace to prevent back button issues
        window.location.replace(loginUrl);
    }

    /**
     * Clear authentication-related data
     */
    clearAuthData() {
        // Clear localStorage items that might contain auth data
        const keysToRemove = ['auth_token', 'user_data', 'session_id', 'remember_token'];
        keysToRemove.forEach(key => {
            localStorage.removeItem(key);
            sessionStorage.removeItem(key);
        });

        // Clear any cookies if needed (browser will handle httpOnly cookies)
        document.cookie.split(";").forEach(cookie => {
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            if (name.trim().includes('session') || name.trim().includes('auth')) {
                document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
            }
        });
    }

    /**
     * Cleanup and destroy validator
     */
    destroy() {
        if (this.authCheckInterval) {
            clearInterval(this.authCheckInterval);
            this.authCheckInterval = null;
        }
        this.isInitialized = false;
    }
}

// Create and export singleton instance
const authStateValidator = new AuthStateValidator();

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => authStateValidator.init());
} else {
    authStateValidator.init();
}

export default authStateValidator;

// Global export for non-module usage
if (typeof window !== 'undefined') {
    window.authStateValidator = authStateValidator;
}
