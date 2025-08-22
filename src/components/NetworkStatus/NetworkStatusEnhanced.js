import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TouchableOpacity,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { globalColors } from '../../Theme/globalColors';

const NetworkStatusEnhanced = () => {
    const [isConnected, setIsConnected] = useState(true);
    const [connectionType, setConnectionType] = useState('unknown');
    const [slideAnim] = useState(new Animated.Value(-100));
    const [fadeAnim] = useState(new Animated.Value(0));
    const retryTimeoutRef = useRef(null);
    const checkIntervalRef = useRef(null);

    useEffect(() => {
        checkNetworkStatus();
        startPeriodicCheck();

        return () => {
            if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
            if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
        };
    }, []);

    const startPeriodicCheck = () => {
        // Check every 10 seconds
        checkIntervalRef.current = setInterval(checkNetworkStatus, 10000);
    };

    const checkNetworkStatus = async () => {
        try {
            // Try multiple endpoints for better reliability
            const endpoints = [
                'https://www.google.com',
                'https://www.cloudflare.com',
                'https://www.apple.com'
            ];

            let connected = false;

            for (const endpoint of endpoints) {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

                    const response = await fetch(endpoint, {
                        method: 'HEAD',
                        mode: 'no-cors',
                        signal: controller.signal
                    });

                    clearTimeout(timeoutId);
                    connected = true;
                    break;
                } catch (error) {
                    continue;
                }
            }

            if (connected) {
                setIsConnected(true);
                setConnectionType('wifi');
                hideMessage();
            } else {
                throw new Error('No endpoints reachable');
            }
        } catch (error) {
            setIsConnected(false);
            setConnectionType('none');
            showMessage();

            // Auto-retry after 30 seconds
            if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
            retryTimeoutRef.current = setTimeout(() => {
                checkNetworkStatus();
            }, 30000);
        }
    };

    const showMessage = () => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const hideMessage = () => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handleRetry = () => {
        Alert.alert(
            'Retry Connection',
            'Attempting to reconnect...',
            [{ text: 'OK' }]
        );
        checkNetworkStatus();
    };

    const handleSettings = () => {
        Alert.alert(
            'Network Settings',
            'Please check:\n• WiFi is turned on\n• Mobile data is enabled\n• Airplane mode is off\n• Try toggling WiFi off and on',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Retry', onPress: handleRetry }
            ]
        );
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
                    opacity: fadeAnim,
                },
            ]}>
            <View style={styles.content}>
                <View style={styles.leftSection}>
                    <Icon
                        name={connectionType === 'wifi' ? 'wifi' : 'exclamation-triangle'}
                        size={24}
                        color={globalColors.white}
                        style={styles.icon}
                    />
                    <View style={styles.textContainer}>
                        <Text style={styles.text}>No Internet Connection</Text>
                        <Text style={styles.subText}>
                            {connectionType === 'wifi'
                                ? 'WiFi connected but no internet access'
                                : 'Please check your connection and try again'
                            }
                        </Text>
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
                        <Icon name="refresh" size={16} color={globalColors.white} />
                        <Text style={styles.buttonText}>Retry</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingsButton} onPress={handleSettings}>
                        <Icon name="cog" size={16} color={globalColors.white} />
                        <Text style={styles.buttonText}>Help</Text>
                    </TouchableOpacity>
                </View>
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
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        paddingTop: 25, // Extra padding for status bar
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    icon: {
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    text: {
        color: globalColors.white,
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Poppins-Bold',
    },
    subText: {
        color: globalColors.white,
        fontSize: 12,
        fontFamily: 'Poppins-Medium',
        opacity: 0.9,
        marginTop: 2,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
    },
    settingsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    buttonText: {
        color: globalColors.white,
        fontSize: 12,
        fontFamily: 'Poppins-Medium',
        marginLeft: 4,
    },
});

export default NetworkStatusEnhanced; 