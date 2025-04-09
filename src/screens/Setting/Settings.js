import React, { use } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { globalColors } from '../../Theme/globalColors';
import Header from '../../components/Header/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logoutUser } from '../../Redux/Slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import { useTranslation } from 'react-i18next';

const SettingsScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const user = useSelector((state) => state.auth.user);
    console.log("user======>", user)
    const handleLogout = async () => {
        await dispatch(logoutUser());
        navigation.replace('Login');
    };

    return (
        <View style={styles.container}>
            {/* <Header /> */}
            {/* <LanguageSelector /> */}

            <Image
                source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
                style={styles.userImage}
            />

            {/* User Name */}
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userName}>{user?.email}</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>{t("logout"
                )}</Text>
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
        fontFamily: 'Poppins-Bold',
        marginBottom: 10,
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
        fontFamily: 'Poppins-Bold',
    },
});

export default SettingsScreen;
