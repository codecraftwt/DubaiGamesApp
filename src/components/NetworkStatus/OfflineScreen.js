import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { globalColors } from '../../Theme/globalColors';
import useNetworkStatus from '../../utils/useNetworkStatus';

const { width, height } = Dimensions.get('window');

const OfflineScreen = ({ children, showOfflineMessage = true }) => {
    const { isConnected, checkNetworkStatus } = useNetworkStatus();

    if (isConnected) {
        return children;
    }

    if (!showOfflineMessage) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Icon name="wifi" size={80} color={globalColors.borderColor} />
                </View>

                <Text style={styles.title}>No Internet Connection</Text>
                <Text style={styles.subtitle}>
                    Please check your internet connection and try again
                </Text>

                <View style={styles.tipsContainer}>
                    <Text style={styles.tipsTitle}>Troubleshooting Tips:</Text>
                    <ScrollView style={styles.tipsList}>
                        <View style={styles.tipItem}>
                            <Icon name="check-circle" size={16} color={globalColors.green} />
                            <Text style={styles.tipText}>Check if WiFi is enabled</Text>
                        </View>
                        <View style={styles.tipItem}>
                            <Icon name="check-circle" size={16} color={globalColors.green} />
                            <Text style={styles.tipText}>Toggle WiFi off and on</Text>
                        </View>
                        <View style={styles.tipItem}>
                            <Icon name="check-circle" size={16} color={globalColors.green} />
                            <Text style={styles.tipText}>Check mobile data settings</Text>
                        </View>
                        <View style={styles.tipItem}>
                            <Icon name="check-circle" size={16} color={globalColors.green} />
                            <Text style={styles.tipText}>Move closer to WiFi router</Text>
                        </View>
                        <View style={styles.tipItem}>
                            <Icon name="check-circle" size={16} color={globalColors.green} />
                            <Text style={styles.tipText}>Restart your device</Text>
                        </View>
                    </ScrollView>
                </View>

                <TouchableOpacity style={styles.retryButton} onPress={checkNetworkStatus}>
                    <Icon name="refresh" size={20} color={globalColors.white} />
                    <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: globalColors.LightWhite,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    content: {
        alignItems: 'center',
        maxWidth: 300,
    },
    iconContainer: {
        marginBottom: 30,
        opacity: 0.6,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: globalColors.darkBlue,
        textAlign: 'center',
        marginBottom: 15,
        fontFamily: 'Poppins-Bold',
    },
    subtitle: {
        fontSize: 16,
        color: globalColors.inputLabel,
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 22,
        fontFamily: 'Poppins-Medium',
    },
    tipsContainer: {
        width: '100%',
        marginBottom: 30,
    },
    tipsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: globalColors.darkBlue,
        marginBottom: 15,
        textAlign: 'center',
        fontFamily: 'Poppins-Bold',
    },
    tipsList: {
        maxHeight: 200,
    },
    tipItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        paddingHorizontal: 10,
    },
    tipText: {
        fontSize: 14,
        color: globalColors.inputLabel,
        marginLeft: 10,
        fontFamily: 'Poppins-Medium',
    },
    retryButton: {
        backgroundColor: globalColors.blue,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    retryButtonText: {
        color: globalColors.white,
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
        fontFamily: 'Poppins-Bold',
    },
});

export default OfflineScreen; 