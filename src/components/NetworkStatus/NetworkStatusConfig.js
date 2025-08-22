// Network Status Configuration
export const NETWORK_STATUS_CONFIG = {
    // Global settings
    ENABLED: true,
    AUTO_RETRY: true,
    AUTO_RETRY_INTERVAL: 30000, // 30 seconds
    CHECK_INTERVAL: 10000, // 10 seconds

    // UI settings
    SHOW_ANIMATIONS: true,
    BANNER_HEIGHT: 60,
    BANNER_COLOR: '#FF3B30',
    TEXT_COLOR: '#FFFFFF',

    // Endpoints to check
    ENDPOINTS: [
        'https://www.google.com',
        'https://www.cloudflare.com',
        'https://www.apple.com'
    ],

    // Timeout settings
    REQUEST_TIMEOUT: 5000, // 5 seconds

    // Messages
    MESSAGES: {
        NO_INTERNET: 'No Internet Connection',
        WIFI_NO_INTERNET: 'WiFi connected but no internet access',
        MOBILE_NO_INTERNET: 'Mobile data connected but no internet access',
        NO_NETWORK: 'No network connection available',
        DEFAULT: 'Please check your connection and try again',
        RETRY: 'Retry',
        HELP: 'Help',
        CHECKING: 'Checking...',
    },

    // Icons
    ICONS: {
        WIFI: 'wifi',
        MOBILE: 'mobile',
        NONE: 'exclamation-triangle',
        DEFAULT: 'question-circle',
        REFRESH: 'refresh',
        HELP: 'question-circle',
        SPINNER: 'spinner',
    },

    // Troubleshooting tips
    TROUBLESHOOTING_TIPS: [
        'Check if WiFi is enabled',
        'Toggle WiFi off and on',
        'Check mobile data settings',
        'Move closer to WiFi router',
        'Restart your device',
    ],
};

// Screen-specific configurations
export const SCREEN_NETWORK_CONFIG = {
    // Screens where network status should always show
    ALWAYS_SHOW: [
        'Dashboard',
        'Login',
        'MainApp',
        'MyWallet',
        'ResultPage',
    ],

    // Screens where network status should be hidden
    HIDE: [
        'Splash',
        'OfflineMode',
    ],

    // Screens with custom network status behavior
    CUSTOM: {
        'Dashboard': {
            showOfflineScreen: false,
            showBanner: true,
            customMessage: 'Dashboard requires internet connection',
        },
        'Login': {
            showOfflineScreen: true,
            showBanner: false,
            customMessage: 'Please connect to internet to login',
        },
    },
};

// Helper function to check if network status should be shown for a screen
export const shouldShowNetworkStatus = (screenName) => {
    if (NETWORK_STATUS_CONFIG.ENABLED === false) return false;
    if (SCREEN_NETWORK_CONFIG.HIDE.includes(screenName)) return false;
    if (SCREEN_NETWORK_CONFIG.ALWAYS_SHOW.includes(screenName)) return true;
    return true; // Default to showing
};

// Helper function to get custom configuration for a screen
export const getScreenNetworkConfig = (screenName) => {
    return SCREEN_NETWORK_CONFIG.CUSTOM[screenName] || {};
}; 