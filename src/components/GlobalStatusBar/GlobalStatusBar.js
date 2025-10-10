import React from 'react';
import { StatusBar, Platform, View, StyleSheet } from 'react-native';
import { globalColors } from '../../Theme/globalColors';

const GlobalStatusBar = () => {
    return (
        <View style={styles.container}>
            <StatusBar
                barStyle='dark-content'
                backgroundColor={globalColors.commonpink}
                translucent={Platform.OS === 'android'}
            />
            <View style={styles.statusBarHeight} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: globalColors.commonpink,
    },
    statusBarHeight: {
        backgroundColor: globalColors.commonpink,
        height: Platform.OS === 'ios' ? 44 : 0, // Status bar height for iOS, 0 for Android
    },
});

export default GlobalStatusBar;
