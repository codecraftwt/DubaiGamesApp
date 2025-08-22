import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { globalColors } from '../../Theme/globalColors';

const { width } = Dimensions.get('window');

const NetworkStatus = () => {
    const [isConnected, setIsConnected] = useState(true);
    const [slideAnim] = useState(new Animated.Value(-100));

    useEffect(() => {
        // Simulate network check - you can replace this with actual NetInfo implementation
        checkNetworkStatus();

        // Check network status every 5 seconds
        const interval = setInterval(checkNetworkStatus, 5000);

        return () => clearInterval(interval);
    }, []);

    const checkNetworkStatus = async () => {
        try {
            // This is a simple check - you can replace with actual NetInfo
            const response = await fetch('https://www.google.com', {
                method: 'HEAD',
                mode: 'no-cors'
            });
            setIsConnected(true);
            hideMessage();
        } catch (error) {
            setIsConnected(false);
            showMessage();
        }
    };

    const showMessage = () => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const hideMessage = () => {
        Animated.timing(slideAnim, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    if (isConnected) {
        return null;
    }

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{ translateY: slideAnim }],
                },
            ]}>
            <View style={styles.content}>
                <Icon name="wifi" size={20} color={globalColors.white} style={styles.icon} />
                <Text style={styles.text}>No Internet Connection</Text>
                <Text style={styles.subText}>Please check your connection and try again</Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FF3B30',
        zIndex: 9999,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        paddingTop: 25, // Extra padding for status bar
    },
    icon: {
        marginRight: 12,
    },
    text: {
        color: globalColors.white,
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Poppins-Bold',
        flex: 1,
    },
    subText: {
        color: globalColors.white,
        fontSize: 12,
        fontFamily: 'Poppins-Medium',
        opacity: 0.9,
        marginTop: 2,
    },
});

export default NetworkStatus; 