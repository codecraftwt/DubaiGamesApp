import React from 'react';
import { View, StyleSheet, StatusBar, Platform } from 'react-native';
import { NetworkStatusAdvanced } from './index';

const GlobalNetworkWrapperAdvanced = ({ children, showNetworkStatus = true }) => {
    return (
        <View style={styles.container}>
            {/* Status Bar */}
            <StatusBar
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent={true}
            />

            {/* Network Status Banner - appears above everything when enabled */}
            {showNetworkStatus && <NetworkStatusAdvanced />}

            {/* Main app content */}
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff', // Fallback background
    },
    content: {
        flex: 1,
    },
});

export default GlobalNetworkWrapperAdvanced; 