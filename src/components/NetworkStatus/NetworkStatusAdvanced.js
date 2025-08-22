import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TouchableOpacity,
    Alert,
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { globalColors } from '../../Theme/globalColors';
import useNetworkStatus from '../../utils/useNetworkStatus';

const { width, height } = Dimensions.get('window');

const NetworkStatusAdvanced = () => {
    const { isConnected, connectionType, isChecking, checkNetworkStatus } = useNetworkStatus();

    const handleRetry = () => {
        Alert.alert(
            'Retry Connection',
            'Attempting to reconnect...',
            [{ text: 'OK' }]
        );
        checkNetworkStatus();
    };

    const handleHelp = () => {
        Alert.alert(
            'Network Troubleshooting',
            'Try these steps:\n\n1. Check if WiFi is enabled\n2. Toggle WiFi off and on\n3. Check mobile data settings\n4. Restart your device\n5. Move closer to WiFi router',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Retry', onPress: handleRetry }
            ]
        );
    };

    const getConnectionIcon = () => {
        switch (connectionType) {
            case 'wifi':
                return 'wifi';
            case 'mobile':
                return 'mobile';
            case 'none':
                return 'exclamation-triangle';
            default:
                return 'question-circle';
        }
    };

    const getConnectionMessage = () => {
        switch (connectionType) {
            case 'wifi':
                return 'WiFi connected but no internet access';
            case 'mobile':
                return 'Mobile data connected but no internet access';
            case 'none':
                return 'No network connection available';
            default:
                return 'Please check your connection and try again';
        }
    };

    if (isConnected) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.leftSection}>
                    <View style={styles.iconContainer}>
                        <Icon
                            name={getConnectionIcon()}
                            size={24}
                            color={globalColors.white}
                        />
                        {isChecking && (
                            <View style={styles.checkingIndicator}>
                                <Icon name="spinner" size={12} color={globalColors.white} />
                            </View>
                        )}
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={styles.title}>No Internet Connection</Text>
                        <Text style={styles.subtitle}>{getConnectionMessage()}</Text>
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, styles.retryButton]}
                        onPress={handleRetry}
                        disabled={isChecking}
                    >
                        <Icon name="refresh" size={16} color={globalColors.white} />
                        <Text style={styles.buttonText}>
                            {isChecking ? 'Checking...' : 'Retry'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.helpButton]}
                        onPress={handleHelp}
                    >
                        <Icon name="question-circle" size={16} color={globalColors.white} />
                        <Text style={styles.buttonText}>Help</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
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
    iconContainer: {
        position: 'relative',
        marginRight: 12,
    },
    checkingIndicator: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 8,
        padding: 2,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        color: globalColors.white,
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Poppins-Bold',
    },
    subtitle: {
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
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 18,
        marginLeft: 8,
        minWidth: 60,
        justifyContent: 'center',
    },
    retryButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },
    helpButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    buttonText: {
        color: globalColors.white,
        fontSize: 12,
        fontFamily: 'Poppins-Medium',
        marginLeft: 4,
    },
});

export default NetworkStatusAdvanced; 