import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ScrollView, Modal, TextInput } from 'react-native';
import { globalColors } from '../../Theme/globalColors';
import Icon from 'react-native-vector-icons/Ionicons';
import { logoutUser } from '../../Redux/Slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/Api';
import Toast from 'react-native-toast-message';

const SettingsScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        Alert.alert(
            t('confirmLogout'),
            t('confirmLogoutMessage'),
            [
                {
                    text: t('cancel'),
                    style: 'cancel',
                },
                {
                    text: t('logout'),
                    onPress: async () => {
                        await dispatch(logoutUser());
                        navigation.replace('Login');
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

    const changeLanguage = async (lng) => {
        try {
            await i18n.changeLanguage(lng);
            await AsyncStorage.setItem('user-language', lng);
            setShowLanguageModal(false);
            Alert.alert(
                t('success'),
                t('languageChanged'),
                [
                    {
                        text: t('ok'),
                    }
                ],
                { cancelable: false }
            );
        } catch (error) {
            Alert.alert(t('error'), t('languageChangeFailed'));
        }
    };

    const handleChangePassword = async () => {
        // Validation
        if (!password || !passwordConfirmation) {
            Toast.show({
                type: 'error',
                text1: t('error'),
                text2: t('allFieldsRequired'),
            });
            return;
        }

        if (password !== passwordConfirmation) {
            Toast.show({
                type: 'error',
                text1: t('error'),
                text2: t('passwordsDoNotMatch'),
            });
            return;
        }

        setIsLoading(true);
        try {
            console.log("user", user)
            const response = await axios.put(
                `${API_BASE_URL}/online_customer/${user.id}`,
                {
                    name: user?.name,
                    email: user?.email,
                    phone: user?.phone,
                    password: password,
                    password_confirmation: passwordConfirmation,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            );

            setIsLoading(false);
            setShowPasswordModal(false);
            setPassword('');
            setPasswordConfirmation('');

            Toast.show({
                type: 'success',
                text1: t('success'),
                text2: t('passwordChangedSuccessfully'),
            });
        } catch (error) {
            setIsLoading(false);
            console.error('Password change error:', error.response?.data || error.message);

            let errorMessage = t('passwordChangeFailed');
            if (error.response?.data?.messages) {
                const messages = error.response.data.messages;
                errorMessage = Object.values(messages).flat().join('\n');
            }

            Toast.show({
                type: 'error',
                text1: t('error'),
                text2: errorMessage,
            });
        }
    };

    const settingsOptions = [
        // {
        //     id: 1,
        //     title: t('profile'),
        //     icon: 'person-outline',
        //     onPress: () => navigation.navigate('Profile'),
        // },
        {
            id: 2,
            title: t('language'),
            icon: 'language-outline',
            onPress: () => setShowLanguageModal(true),
        },
        {
            id: 3,
            title: t('changePassword'),
            icon: 'lock-closed-outline',
            onPress: () => setShowPasswordModal(true),
        },
        // {
        //     id: 4,
        //     title: t('notifications'),
        //     icon: 'notifications-outline',
        //     onPress: () => navigation.navigate('Notifications'),
        // },
        // {
        //     id: 5,
        //     title: t('privacy'),
        //     icon: 'shield-outline',
        //     onPress: () => navigation.navigate('Privacy'),
        // },
        // {
        //     id: 6,
        //     title: t('help'),
        //     icon: 'help-circle-outline',
        //     onPress: () => navigation.navigate('Help'),
        // },
    ];

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'hi', name: 'हिंदी' },
        { code: 'mr', name: 'मराठी' },
        { code: 'kn', name: 'ಕನ್ನಡ' },
    ];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Profile Section */}
            <View style={styles.profileSection}>
                <View style={styles.profileImageContainer}>
                    <Image
                        source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
                        style={styles.userImage}
                    />
                    <TouchableOpacity style={styles.editIcon}>
                        <Icon name="camera-outline" size={20} color={globalColors.white} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.userName}>{user?.name}</Text>
                <Text style={styles.userEmail}>{user?.email}</Text>
            </View>

            {/* Settings Options */}
            <View style={styles.settingsSection}>
                {settingsOptions.map((option) => (
                    <TouchableOpacity
                        key={option.id}
                        style={styles.optionItem}
                        onPress={option.onPress}>
                        <View style={styles.optionLeft}>
                            <Icon name={option.icon} size={24} color={globalColors.darkBlue} />
                            <Text style={styles.optionText}>{option.title}</Text>
                        </View>
                        <Icon name="chevron-forward" size={20} color={globalColors.grey} />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Icon name="log-out-outline" size={24} color={globalColors.white} />
                <Text style={styles.logoutText}>{t('logout')}</Text>
            </TouchableOpacity>

            {/* Language Selection Modal */}
            <Modal
                visible={showLanguageModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowLanguageModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{t('selectLanguage')}</Text>
                            <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
                                <Icon name="close" size={24} color={globalColors.darkBlue} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.languageList}>
                            {languages.map((lang) => (
                                <TouchableOpacity
                                    key={lang.code}
                                    style={[
                                        styles.languageItem,
                                        i18n.language === lang.code && styles.activeLanguageItem
                                    ]}
                                    onPress={() => changeLanguage(lang.code)}
                                >
                                    <Text style={[
                                        styles.languageText,
                                        i18n.language === lang.code && styles.activeLanguageText
                                    ]}>
                                        {lang.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Password Change Modal */}
            <Modal
                visible={showPasswordModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowPasswordModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{t('changePassword')}</Text>
                            <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
                                <Icon name="close" size={24} color={globalColors.darkBlue} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.passwordForm}>
                            {/* New Password Field */}
                            <View style={styles.inputContainer}>
                                <View style={styles.passwordContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder={t('newPassword')}
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!passwordVisible}
                                        placeholderTextColor={globalColors.grey}
                                    />
                                    <TouchableOpacity
                                        style={styles.eyeIcon}
                                        onPress={() => setPasswordVisible(!passwordVisible)}
                                    >
                                        <Icon
                                            name={passwordVisible ? 'eye-outline' : 'eye-off-outline'}
                                            size={20}
                                            color={globalColors.darkBlue}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Confirm Password Field */}
                            <View style={styles.inputContainer}>
                                <View style={styles.passwordContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder={t('confirmPassword')}
                                        value={passwordConfirmation}
                                        onChangeText={setPasswordConfirmation}
                                        secureTextEntry={!confirmPasswordVisible}
                                        placeholderTextColor={globalColors.grey}
                                    />
                                    <TouchableOpacity
                                        style={styles.eyeIcon}
                                        onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                                    >
                                        <Icon
                                            name={confirmPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
                                            size={20}
                                            color={globalColors.darkBlue}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={[styles.changePasswordButton, isLoading && styles.disabledButton]}
                                onPress={handleChangePassword}
                                disabled={isLoading}
                            >
                                <Text style={styles.buttonText}>
                                    {isLoading ? t('updating') : t('updatePassword')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: globalColors.LightWhite,
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: 30,
        backgroundColor: globalColors.white,
        marginBottom: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    profileImageContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    userImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: globalColors.blue,
    },
    editIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: globalColors.blue,
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: globalColors.white,
    },
    userName: {
        fontSize: 22,
        fontFamily: 'Poppins-Bold',
        color: globalColors.darkBlue,
        marginBottom: 5,
    },
    userEmail: {
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
        color: globalColors.grey,
    },
    settingsSection: {
        backgroundColor: globalColors.white,
        borderRadius: 15,
        marginHorizontal: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: globalColors.borderColor,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionText: {
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
        color: globalColors.darkBlue,
        marginLeft: 15,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: globalColors.vividred,
        paddingVertical: 15,
        marginHorizontal: 20,
        borderRadius: 10,
        marginBottom: 30,
    },
    logoutText: {
        color: globalColors.white,
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        marginLeft: 10,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: globalColors.white,
        borderRadius: 15,
        width: '90%',
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-Bold',
        color: globalColors.darkBlue,
    },
    languageList: {
        gap: 10,
    },
    languageItem: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: globalColors.LightWhite,
        borderWidth: 1,
        borderColor: globalColors.borderColor,
    },
    activeLanguageItem: {
        backgroundColor: globalColors.blue,
        borderColor: globalColors.blue,
    },
    languageText: {
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
        color: globalColors.darkBlue,
    },
    activeLanguageText: {
        color: globalColors.white,
        fontFamily: 'Poppins-Bold',
    },
    passwordForm: {
        gap: 15,
    },
    inputContainer: {
        marginBottom: 10,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: globalColors.borderColor,
        borderRadius: 10,
        backgroundColor: globalColors.LightWhite,
        paddingHorizontal: 15,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: globalColors.darkBlue,
    },
    eyeIcon: {
        padding: 8,
    },
    changePasswordButton: {
        backgroundColor: globalColors.blue,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    disabledButton: {
        backgroundColor: globalColors.grey,
    },
    buttonText: {
        color: globalColors.white,
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
    },
});

export default SettingsScreen;
