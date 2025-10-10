import React, { useEffect, useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
    Image, Dimensions,
    ScrollView,
    KeyboardAvoidingView,
    Modal,
    TouchableWithoutFeedback
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { globalColors } from '../../Theme/globalColors';
import { DubaiGames } from '../../Theme/globalImage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { loginFailure, loginUser, resetRegistration } from '../../Redux/Slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ActivityIndicator } from 'react-native-paper';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { API_BASE_URL } from '../../utils/Api';

const LoginScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const authState = useSelector((state) => state.auth);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [errors, setErrors] = useState({
        username: '',
        password: '',
        form: ''
    });
    const [touched, setTouched] = useState({
        username: false,
        password: false
    });
    const [submitAttempted, setSubmitAttempted] = useState(false);

    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [isForgotLoading, setIsForgotLoading] = useState(false);


    const handleForgotPassword = async () => {
        // Validation
        if (!forgotPasswordEmail) {
            Toast.show({
                type: 'error',
                text1: t('error'),
                text2: t('emailRequired'),
            });
            return;
        }

        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(forgotPasswordEmail)) {
            Toast.show({
                type: 'error',
                text1: t('error'),
                text2: t('invalidEmail'),
            });
            return;
        }

        setIsForgotLoading(true);
        try {
            const response = await axios.post(
                `${API_BASE_URL}/forgot-password`,
                {
                    email: forgotPasswordEmail,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            );

            setIsForgotLoading(false);
            setShowForgotPasswordModal(false);
            setForgotPasswordEmail('');

            Toast.show({
                type: 'success',
                text1: t('success'),
                text2: response.data?.status || t('passwordResetLinkSent'),
            });
        } catch (error) {
            setIsForgotLoading(false);
            console.error('Forgot password error:', error.response?.data || error.message);

            // let errorMessage = t('forgotPasswordFailed');
            // if (error.response?.data?.message) {
            //     errorMessage = error.response.data.message;
            // } else if (error.response?.data?.status) {
            //     errorMessage = error.response.data.status;
            // }

            Toast.show({
                type: 'error',
                text1: t('error'),
                text2: error.response?.data?.message || error.message || t('forgotPasswordFailed'),

                text2: error.response.data.message,
            });
        }
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = {
            username: '',
            password: '',
            form: ''
        };

        // Username validation
        if (!username.trim()) {
            newErrors.username = t('usernameRequired');
            valid = false;
        } else if (username.length < 1) {
            newErrors.username = t('usernameTooShort');
            valid = false;
        }

        // Password validation
        if (!password.trim()) {
            newErrors.password = t('passwordRequired');
            valid = false;
        } else if (password.length < 5) {
            newErrors.password = t('passwordTooShort');
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleBlur = (field) => {
        setTouched({ ...touched, [field]: true });
        if (submitAttempted) {
            validateForm();
        }
    };

    const handleLogin = async () => {
        setSubmitAttempted(true);

        // Validate form before submission
        if (!validateForm()) {
            return;
        }

        dispatch(loginUser(username, password, code));
    };

    useEffect(() => {
        if (authState.isAuthenticated) {
            navigation.replace('MainApp'); // Navigate after login success
        } else if (authState.error) {
            Alert.alert('Login Failed', authState.error);
            // setErrors({ ...errors, form: authState.error });
        }
    }, [authState.isAuthenticated, authState.error, navigation]);

    useEffect(() => {
        dispatch(resetRegistration());
        dispatch(loginFailure(null));
    }, [dispatch]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                <Image style={{
                    width: wp('90%'),
                    height: hp('24%'),
                    resizeMode: "contain",
                }} source={DubaiGames} />

                <Text style={styles.subtitle}>{t('signInToContinue')}</Text>

                {/* Form error message */}
                {errors.form && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{errors.form}</Text>
                    </View>
                )}

                {/* Username Input */}
                <View style={[
                    styles.inputContainer,
                    (submitAttempted && errors.username) ? styles.inputError : null
                ]}>
                    <Icon name="account-outline" size={hp('3%')} color="#888" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder={t('Email or Mobile')}
                        placeholderTextColor={globalColors.inputLabel}
                        value={username}
                        onChangeText={(text) => {
                            setUsername(text);
                            if (submitAttempted) validateForm();
                        }}
                        onBlur={() => handleBlur('username')}
                        autoCapitalize="none"
                    />
                </View>
                {(submitAttempted && errors.username) && (
                    <Text style={styles.fieldError}>{errors.username}</Text>
                )}

                {/* Password Input */}
                <View style={[
                    styles.inputContainer,
                    (submitAttempted && errors.password) ? styles.inputError : null
                ]}>
                    <Icon name="lock-outline" size={hp('3%')} color="#888" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder={t('password')}
                        placeholderTextColor={globalColors.inputLabel}
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            if (submitAttempted) validateForm();
                        }}
                        onBlur={() => handleBlur('password')}
                        secureTextEntry={!isPasswordVisible}
                        autoCapitalize="none"
                    />
                    <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                        <Icon
                            name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
                            size={hp('3%')}
                            color="#888"
                        />
                    </TouchableOpacity>
                </View>
                {(submitAttempted && errors.password) && (
                    <Text style={styles.fieldError}>{errors.password}</Text>
                )}




                {/* Login Button - Always visible now */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleLogin}
                    disabled={authState.loading}
                >
                    {authState.loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Login</Text>
                    )}
                </TouchableOpacity>
                <LanguageSelector></LanguageSelector>

                {/* Forgot Password Link */}
                <TouchableOpacity
                    style={styles.forgotPasswordLink}
                    onPress={() => setShowForgotPasswordModal(true)}
                >
                    <Text style={[styles.subtitle, { fontSize: hp('2%'), color: globalColors.black, }]}>{t('forgotPassword')}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                    dispatch(loginFailure(null));
                    dispatch(resetRegistration());
                    navigation.navigate('Register');
                }}>
                    <Text style={[styles.subtitle, { fontSize: hp('2%'), color: globalColors.black }]}>
                        {t('createNewAccount')}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                    dispatch(loginFailure(null));
                    dispatch(resetRegistration());
                    navigation.navigate('LogoutAllDevices');
                }}>
                    <Text style={[styles.subtitle, { fontSize: hp('2%'), color: globalColors.black }]}>
                        {t('LogoutallDevicesText')}</Text>
                </TouchableOpacity>


                {/* Forgot Password Modal */}
                <Modal
                    visible={showForgotPasswordModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowForgotPasswordModal(false)}
                >
                    <TouchableWithoutFeedback onPress={() => setShowForgotPasswordModal(false)}>
                        <View style={styles.modalContainer}>
                            <TouchableWithoutFeedback onPress={() => { }}>
                                {/* Prevents closing when clicking inside modal */}
                                <View style={styles.modalContent}>
                                    <View style={styles.modalHeader}>
                                        <Text style={styles.modalTitle}>{t('forgotPassword')}</Text>
                                        <TouchableOpacity
                                            style={styles.closeButton}
                                            onPress={() => setShowForgotPasswordModal(false)}
                                        >
                                            <Icon name="close" size={24} color={globalColors.darkGrey} />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.modalBody}>
                                        <View style={styles.modalInputContainer}>
                                            <Icon
                                                name="email-outline"
                                                size={20}
                                                color={globalColors.darkGrey}
                                                style={styles.inputIcon}
                                            />
                                            <TextInput
                                                style={styles.modalInput}
                                                placeholder={t('email')}
                                                placeholderTextColor={globalColors.black}
                                                value={forgotPasswordEmail}
                                                onChangeText={setForgotPasswordEmail}
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                                autoFocus={true}
                                            />
                                        </View>
                                    </View>

                                    <View style={styles.modalFooter}>
                                        <TouchableOpacity
                                            style={[
                                                styles.submitButton,
                                                isForgotLoading && styles.submitButtonDisabled
                                            ]}
                                            onPress={handleForgotPassword}
                                            disabled={isForgotLoading}
                                        >
                                            {isForgotLoading ? (
                                                <ActivityIndicator size="small" color={globalColors.white} />
                                            ) : (
                                                <Text style={styles.submitButtonText}>
                                                    {t('sendResetLink')}
                                                </Text>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </ScrollView>

        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: globalColors.LightWhite,
        padding: wp('6%'),
        justifyContent: 'center',
    },
    subtitle: {
        fontSize: hp('3.5%'),
        fontFamily: 'Poppins-Light',
        color: '#666',
        textAlign: 'center',
        // marginBottom: hp('2%'),
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        paddingHorizontal: wp('2%'),
        borderWidth: 1,
        borderColor: globalColors.borderColor,
        marginBottom: hp('2%'),
        borderRadius: 5,

    },
    errorContainer: {
        backgroundColor: '#FFEBEE',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: globalColors.error,
        width: '100%',
    },
    errorText: {
        color: globalColors.error,
        fontSize: hp('1.8%'),
        fontFamily: 'Poppins-Medium',
        textAlign: 'left',
    },
    fieldError: {
        color: globalColors.error,
        fontSize: hp('1.5%'),
        marginTop: -10,
        marginBottom: 12,
        alignSelf: 'flex-start',
        fontFamily: 'Poppins-Regular',
        paddingLeft: 8,
    },
    inputError: {
        borderColor: globalColors.error,
        backgroundColor: '#FFF5F5',
    },
    icon: {
        marginRight: wp('3%'),
    },
    input: {
        flex: 1,
        fontFamily: 'Poppins-Medium',
        height: hp('6%'),
        color: '#333',
    },
    button: {
        backgroundColor: globalColors.blue,
        paddingVertical: hp('2%'),
        paddingHorizontal: wp('20%'),
        borderRadius: 12,
        alignItems: 'center',
        marginTop: hp('2%'),
    },
    buttonText: {
        color: globalColors.white,
        fontFamily: 'Poppins-Bold',
        fontSize: hp('1.9%'),
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: wp('4%'),
    },
    modalContent: {
        backgroundColor: globalColors.white,
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: wp('3%'),
        // borderBottomWidth: 1,
        borderBottomColor: globalColors.lightgrey,
    },
    modalTitle: {
        fontSize: hp('2.2%'),
        fontFamily: 'Poppins-SemiBold',
        color: globalColors.darkBlue,
    },
    closeButton: {
        padding: 5,
    },
    modalBody: {
        padding: wp('5%'),
    },
    modalDescription: {
        fontSize: hp('1.8%'),
        fontFamily: 'Poppins-Regular',
        color: globalColors.darkGrey,
        marginBottom: hp('2%'),
        lineHeight: hp('2.4%'),
    },
    modalInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: globalColors.borderColor,
        borderRadius: 8,
        paddingHorizontal: wp('3%'),
        marginBottom: hp('2%'),
    },
    inputIcon: {
        marginRight: wp('2%'),
    },
    modalInput: {
        flex: 1,
        height: hp('6%'),
        fontFamily: 'Poppins-Regular',
        fontSize: hp('1.8%'),
        color: globalColors.darkBlue,
    },
    modalFooter: {
        padding: wp('5%'),
        paddingTop: 0,
    },
    submitButton: {
        backgroundColor: globalColors.blue,
        borderRadius: 8,
        height: hp('6%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButtonDisabled: {
        backgroundColor: globalColors.lightgrey,
    },
    submitButtonText: {
        color: globalColors.white,
        fontFamily: 'Poppins-Bold',
        fontSize: 16,
    },
    forgotPasswordLink: {
        alignSelf: 'center',
        marginTop: hp('-1%'),
        marginBottom: hp('1%'),
        // marginRight: wp('5%'),
    },
    forgotPasswordText: {
        color: globalColors.primary,
        fontSize: hp('1.7%'),
        fontFamily: 'Poppins-Medium',
        textDecorationLine: 'underline',
    },
});

export default LoginScreen;



