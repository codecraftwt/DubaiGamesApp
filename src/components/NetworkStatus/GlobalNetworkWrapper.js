import React from 'react';
import { View, StyleSheet, StatusBar, Platform } from 'react-native';
import { NetworkStatusAdvanced } from './index';

const GlobalNetworkWrapper = ({ children }) => {
    return (
        <View style={styles.container}>
            {/* Status Bar */}
            <StatusBar
                barStyle="light-content"
                backgroundColor="transparent"
                translucent={true}
            />

            {/* Network Status Banner - appears above everything */}
            <NetworkStatusAdvanced />

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
    },
    content: {
        flex: 1,
        // Add padding top to account for status bar and network banner
        paddingTop: Platform.OS === 'ios' ? 0 : 0,
    },
});

export default GlobalNetworkWrapper; 