import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { globalColors } from '../../Theme/globalColors';
import Header from '../../components/Header/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = ({ navigation }) => {
    const handleLogout = () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Logout",
                onPress: async () => {
                    await AsyncStorage.clear(); // Clears all data from AsyncStorage
                    navigation.replace("Login"); // Navigate to Login screen after clearing
                }
            },
        ]);
    };

    return (
        <View style={styles.container}>
            {/* <Header /> */}
            <Image
                source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
                style={styles.userImage}
            />

            {/* User Name */}
            <Text style={styles.userName}>John Doe</Text>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: globalColors.white,

    },
    userImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    logoutButton: {
        backgroundColor: globalColors.vividred,
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    logoutText: {
        color: globalColors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default SettingsScreen;
