import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { globalColors } from '../../Theme/globalColors';

const TestGlobalNetwork = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>🌐 Global Network Status Test</Text>
            <Text style={styles.subtitle}>
                The network status banner should appear above this screen when offline
            </Text>

            <View style={styles.testSection}>
                <Text style={styles.testTitle}>Testing Instructions:</Text>
                <Text style={styles.testText}>1. Turn off WiFi</Text>
                <Text style={styles.testText}>2. Turn off mobile data</Text>
                <Text style={styles.testText}>3. Use airplane mode</Text>
                <Text style={styles.testText}>4. Look for red banner at top</Text>
            </View>

            <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>What You Should See:</Text>
                <Text style={styles.infoText}>• Red banner slides down from top</Text>
                <Text style={styles.infoText}>• "No Internet Connection" message</Text>
                <Text style={styles.infoText}>• Retry and Help buttons</Text>
                <Text style={styles.infoText}>• Banner appears above ALL content</Text>
            </View>

            <Text style={styles.note}>
                💡 This banner will appear on EVERY screen in your app when offline!
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: globalColors.LightWhite,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: globalColors.darkBlue,
        textAlign: 'center',
        marginBottom: 20,
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
    testSection: {
        backgroundColor: globalColors.white,
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    testTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: globalColors.darkBlue,
        marginBottom: 15,
        fontFamily: 'Poppins-Bold',
    },
    testText: {
        fontSize: 14,
        color: globalColors.inputLabel,
        marginBottom: 8,
        fontFamily: 'Poppins-Medium',
    },
    infoSection: {
        backgroundColor: globalColors.white,
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: globalColors.darkBlue,
        marginBottom: 15,
        fontFamily: 'Poppins-Bold',
    },
    infoText: {
        fontSize: 14,
        color: globalColors.inputLabel,
        marginBottom: 8,
        fontFamily: 'Poppins-Medium',
    },
    note: {
        fontSize: 16,
        color: globalColors.blue,
        textAlign: 'center',
        fontFamily: 'Poppins-Bold',
        backgroundColor: 'rgba(0, 102, 255, 0.1)',
        padding: 15,
        borderRadius: 8,
    },
});

export default TestGlobalNetwork; 