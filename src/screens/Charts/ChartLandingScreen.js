import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const ChartLandingScreen = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Charts & Reports</Text>
                <Text style={styles.subtitle}>Explore Varthahars and previous result charts.</Text>
            </View>
            <View style={styles.menuContainer}>
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('VartharList')}
                >
                    <Icon name="file-pdf-box" size={40} color="#D32F2F" />
                    <Text style={styles.cardTitle}>Varthahar</Text>
                    <Text style={styles.cardDescription}>Download and view daily PDF reports.</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('PreviousResultChart')}
                >
                    <Icon name="chart-bar" size={40} color="#1976D2" />
                    <Text style={styles.cardTitle}>Result Chart</Text>
                    <Text style={styles.cardDescription}>View historical result data in a weekly format.</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f6f8',
    },
    header: {
        padding: 10,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#212121',
    },
    subtitle: {
        fontSize: 16,
        color: '#757575',
        marginTop: 4,
    },
    menuContainer: {
        padding: 16,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginTop: 12,
    },
    cardDescription: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
        textAlign: 'center',
    },
});

export default ChartLandingScreen;