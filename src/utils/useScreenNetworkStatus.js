import { useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import useNetworkStatus from './useNetworkStatus';
import { shouldShowNetworkStatus, getScreenNetworkConfig } from '../components/NetworkStatus/NetworkStatusConfig';

const useScreenNetworkStatus = (options = {}) => {
    const navigation = useNavigation();
    const route = useRoute();
    const { isConnected, connectionType, checkNetworkStatus } = useNetworkStatus();

    const screenName = route?.name || 'Unknown';
    const shouldShow = shouldShowNetworkStatus(screenName);
    const screenConfig = getScreenNetworkConfig(screenName);

    // Merge screen config with options
    const config = {
        showOfflineScreen: false,
        showBanner: true,
        customMessage: null,
        autoRetry: true,
        ...screenConfig,
        ...options,
    };

    // Handle navigation when network status changes
    useEffect(() => {
        if (!shouldShow) return;

        // If offline and screen requires internet, you can handle navigation
        if (!isConnected && config.requireInternet) {
            // You can navigate to an offline screen or show a modal
            console.log(`Screen ${screenName} requires internet connection`);
        }
    }, [isConnected, shouldShow, config.requireInternet, screenName]);

    // Return network status and configuration
    return {
        isConnected,
        connectionType,
        checkNetworkStatus,
        shouldShowNetworkStatus: shouldShow,
        screenConfig: config,
        screenName,

        // Helper methods
        isOnline: isConnected,
        isOffline: !isConnected,
        hasInternet: isConnected,

        // Screen-specific methods
        showOfflineScreen: config.showOfflineScreen,
        showBanner: config.showBanner,
        customMessage: config.customMessage,
        requireInternet: config.requireInternet,
    };
};

export default useScreenNetworkStatus; 