import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import { globalColors } from '../../Theme/globalColors';
import {
    NetworkStatus,
    NetworkStatusEnhanced,
    NetworkStatusAdvanced,
    OfflineScreen,
} from './index';

const NetworkStatusDemo = () => {
    const [selectedComponent, setSelectedComponent] = useState('advanced');
    const [showOfflineScreen, setShowOfflineScreen] = useState(false);

    const components = [
        { key: 'basic', name: 'Basic NetworkStatus', component: NetworkStatus },
        { key: 'enhanced', name: 'Enhanced NetworkStatus', component: NetworkStatusEnhanced },
        { key: 'advanced', name: 'Advanced NetworkStatus', component: NetworkStatusAdvanced },
    ];

    const SelectedComponent = components.find(c => c.key === selectedComponent)?.component;

    const simulateOffline = () => {
        Alert.alert(
            'Simulate Offline',
            'To test offline functionality, turn off your WiFi and mobile data, or use airplane mode.',
            [{ text: 'OK' }]
        );
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Network Status Components Demo</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Select Component Type:</Text>
                <View style={styles.buttonGroup}>
                    {components.map((comp) => (
                        <TouchableOpacity
                            key={comp.key}
                            style={[
                                styles.selectionButton,
                                selectedComponent === comp.key && styles.selectedButton,
                            ]}
                            onPress={() => setSelectedComponent(comp.key)}
                        >
                            <Text
                                style={[
                                    styles.selectionButtonText,
                                    selectedComponent === comp.key && styles.selectedButtonText,
                                ]}
                            >
                                {comp.key.charAt(0).toUpperCase() + comp.key.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Current Component: {components.find(c => c.key === selectedComponent)?.name}</Text>
                <View style={styles.componentContainer}>
                    {SelectedComponent && <SelectedComponent />}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Test Offline Screen:</Text>
                <TouchableOpacity
                    style={styles.demoButton}
                    onPress={() => setShowOfflineScreen(!showOfflineScreen)}
                >
                    <Text style={styles.demoButtonText}>
                        {showOfflineScreen ? 'Hide' : 'Show'} Offline Screen
                    </Text>
                </TouchableOpacity>

                {showOfflineScreen && (
                    <View style={styles.offlineContainer}>
                        <OfflineScreen>
                            <Text style={styles.onlineText}>You are online!</Text>
                        </OfflineScreen>
                    </View>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Testing Instructions:</Text>
                <View style={styles.instructions}>
                    <Text style={styles.instructionText}>
                        1. <Text style={styles.bold}>Turn off WiFi</Text> to see the network status banner
                    </Text>
                    <Text style={styles.instructionText}>
                        2. <Text style={styles.bold}>Turn off mobile data</Text> to test mobile network detection
                    </Text>
                    <Text style={styles.instructionText}>
                        3. <Text style={styles.bold}>Use airplane mode</Text> to simulate complete offline state
                    </Text>
                    <Text style={styles.instructionText}>
                        4. <Text style={styles.bold}>Try the retry buttons</Text> to test reconnection
                    </Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Features:</Text>
                <View style={styles.features}>
                    <Text style={styles.featureText}>• Real-time network monitoring</Text>
                    <Text style={styles.featureText}>• Multiple endpoint checking</Text>
                    <Text style={styles.featureText}>• Auto-retry functionality</Text>
                    <Text style={styles.featureText}>• User-friendly error messages</Text>
                    <Text style={styles.featureText}>• Retry and help buttons</Text>
                    <Text style={styles.featureText}>• Smooth animations</Text>
                    <Text style={styles.featureText}>• Customizable styling</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.simulateButton} onPress={simulateOffline}>
                <Text style={styles.simulateButtonText}>Simulate Offline Mode</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: globalColors.LightWhite,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: globalColors.darkBlue,
        textAlign: 'center',
        marginBottom: 30,
        fontFamily: 'Poppins-Bold',
    },
    section: {
        marginBottom: 30,
        backgroundColor: globalColors.white,
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: globalColors.darkBlue,
        marginBottom: 15,
        fontFamily: 'Poppins-Bold',
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    selectionButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: globalColors.inputbgColor,
        borderRadius: 8,
        marginHorizontal: 5,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: globalColors.borderColor,
    },
    selectedButton: {
        backgroundColor: globalColors.blue,
        borderColor: globalColors.blue,
    },
    selectionButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: globalColors.darkBlue,
        fontFamily: 'Poppins-Medium',
    },
    selectedButtonText: {
        color: globalColors.white,
    },
    componentContainer: {
        minHeight: 100,
        backgroundColor: globalColors.inputbgColor,
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    demoButton: {
        backgroundColor: globalColors.green,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    demoButtonText: {
        color: globalColors.white,
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Poppins-Bold',
    },
    offlineContainer: {
        marginTop: 15,
        height: 300,
        borderWidth: 1,
        borderColor: globalColors.borderColor,
        borderRadius: 8,
        overflow: 'hidden',
    },
    onlineText: {
        fontSize: 18,
        color: globalColors.green,
        textAlign: 'center',
        marginTop: 100,
        fontFamily: 'Poppins-Bold',
    },
    instructions: {
        marginTop: 10,
    },
    instructionText: {
        fontSize: 14,
        color: globalColors.inputLabel,
        marginBottom: 8,
        lineHeight: 20,
        fontFamily: 'Poppins-Medium',
    },
    bold: {
        fontWeight: 'bold',
        color: globalColors.darkBlue,
    },
    features: {
        marginTop: 10,
    },
    featureText: {
        fontSize: 14,
        color: globalColors.inputLabel,
        marginBottom: 6,
        fontFamily: 'Poppins-Medium',
    },
    simulateButton: {
        backgroundColor: globalColors.blue,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 30,
    },
    simulateButtonText: {
        color: globalColors.white,
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Poppins-Bold',
    },
});

export default NetworkStatusDemo; 