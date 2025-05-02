import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import { globalColors } from '../../Theme/globalColors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DubaiGames } from '../../Theme/globalImage';
import { registerUser, resetRegistration } from '../../Redux/Slices/authSlice';
import Toast from 'react-native-toast-message';
import { t } from 'i18next';

const RegistrationScreen = ({ navigation }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone_number: '',
        pass: '',
        confirm_pass: ''
    });
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [localError, setLocalError] = useState(null);
    const dispatch = useDispatch();
    const { registrationLoading, registrationError, isRegistered } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(resetRegistration());
    }, [dispatch]);

    useEffect(() => {
        if (isRegistered) {
            setLoading(false);
            Toast.show({
                type: 'success',
                text1: t('success'),
                text2: t('registrationSuccessful'),
            });
            navigation.navigate('Login');
            setFormData({
                name: '',
                email: '',
                phone_number: '',
                pass: '',
                confirm_pass: ''
            });
        }
    }, [isRegistered, navigation]);

    useEffect(() => {
        if (registrationError) {
            setLoading(false);
            Toast.show({
                type: 'error',
                text1: t('error'),
                text2: registrationError || t('registrationFailed'),
            });
        }
    }, [registrationError]);

    useEffect(() => {
        console.log('Redux registration loading state changed:', registrationLoading);
    }, [registrationLoading]);

    useEffect(() => {
        console.log('Local loading state changed:', loading);
    }, [loading]);

    const handleChange = (name, value) => {
        if (localError) {
            setLocalError(null);
        }
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;

        if (!formData.name.trim()) {
            setLocalError(t('nameRequired'));
            Toast.show({
                type: 'error',
                text1: t('validationError'),
                text2: t('nameRequired'),
            });
            return false;
        }
        if (!emailRegex.test(formData.email)) {
            setLocalError(t('invalidEmail'));
            Toast.show({
                type: 'error',
                text1: t('validationError'),
                text2: t('invalidEmail'),
            });
            return false;
        }
        if (!phoneRegex.test(formData.phone_number)) {
            setLocalError(t('invalidPhone'));
            Toast.show({
                type: 'error',
                text1: t('validationError'),
                text2: t('invalidPhone'),
            });
            return false;
        }
        if (formData.pass.length < 8) {
            setLocalError(t('passwordLength'));
            Toast.show({
                type: 'error',
                text1: t('validationError'),
                text2: t('passwordLength'),
            });
            return false;
        }
        if (formData.pass !== formData.confirm_pass) {
            setLocalError(t('passwordsDoNotMatch'));
            Toast.show({
                type: 'error',
                text1: t('validationError'),
                text2: t('passwordsDoNotMatch'),
            });
            return false;
        }

        return true;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        // Set loading to true immediately
        setLoading(true);

        // Log the current state
        console.log('Starting registration, loading state:', true);

        // Set a safety timeout to ensure loading state is reset after 10 seconds
        // even if something goes wrong with the API call or Redux
        const safetyTimeout = setTimeout(() => {
            console.log('Safety timeout triggered - resetting loading state');
            setLoading(false);
        }, 10000);

        // Dispatch action and watch for completion
        dispatch(registerUser(formData))
            .then(() => {
                // Success is handled in the success useEffect
                console.log('Registration dispatched successfully');
                clearTimeout(safetyTimeout);
            })
            .catch((error) => {
                // Just in case the error doesn't trigger our useEffect
                console.log('Registration dispatch caught error:', error);
                clearTimeout(safetyTimeout);
                setLoading(false);
            });
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <Image
                    style={styles.logo}
                    source={DubaiGames}
                />

                <Text style={styles.title}>{t('createYourAccount')}</Text>

                <View style={styles.inputWrapper}>
                    <View style={[styles.inputContainer, localError === t('nameRequired') && styles.inputError]}>
                        <Icon name="account-outline" size={hp('2.8%')} color="#888" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder={t('name')}
                            placeholderTextColor={globalColors.inputLabel}
                            value={formData.name}
                            onChangeText={(text) => handleChange('name', text)}
                            autoCapitalize="words"
                        />
                    </View>
                </View>

                <View style={styles.inputWrapper}>
                    <View style={[styles.inputContainer, localError === t('invalidEmail') && styles.inputError]}>
                        <Icon name="email-outline" size={hp('2.8%')} color="#888" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder={t('email')}
                            placeholderTextColor={globalColors.inputLabel}
                            value={formData.email}
                            onChangeText={(text) => handleChange('email', text)}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                </View>

                <View style={styles.inputWrapper}>
                    <View style={[styles.inputContainer, localError === t('invalidPhone') && styles.inputError]}>
                        <Icon name="phone-outline" size={hp('2.8%')} color="#888" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder={t("phoneNumber")}
                            placeholderTextColor={globalColors.inputLabel}
                            value={formData.phone_number}
                            onChangeText={(text) => handleChange('phone_number', text)}
                            keyboardType="phone-pad"
                            maxLength={10}
                        />
                    </View>
                </View>

                <View style={styles.inputWrapper}>
                    <View style={[styles.inputContainer, (localError === t('passwordLength') || localError === t('passwordsDoNotMatch')) && styles.inputError]}>
                        <Icon name="lock-outline" size={hp('2.8%')} color="#888" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder={t("password")}
                            placeholderTextColor={globalColors.inputLabel}
                            value={formData.pass}
                            onChangeText={(text) => handleChange('pass', text)}
                            secureTextEntry={!isPasswordVisible}
                        />
                        <TouchableOpacity
                            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                            style={styles.eyeIcon}
                        >
                            <Icon
                                name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
                                size={hp('2.8%')}
                                color="#888"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.inputWrapper}>
                    <View style={[styles.inputContainer, localError === t('passwordsDoNotMatch') && styles.inputError]}>
                        <Icon name="lock-check-outline" size={hp('2.8%')} color="#888" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder={t('confirmPassword')}
                            placeholderTextColor={globalColors.inputLabel}
                            value={formData.confirm_pass}
                            onChangeText={(text) => handleChange('confirm_pass', text)}
                            secureTextEntry={!isConfirmPasswordVisible}
                        />
                        <TouchableOpacity
                            onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                            style={styles.eyeIcon}
                        >
                            <Icon
                                name={isConfirmPasswordVisible ? "eye-outline" : "eye-off-outline"}
                                size={hp('2.8%')}
                                color="#888"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : (
                        <Text style={styles.buttonText}>{t("register")}</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}
                    style={styles.loginLink}
                >
                    <Text style={styles.loginText}>
                        {t('alreadyHaveAccount')} <Text style={styles.loginLinkText}>Login</Text>
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: globalColors.LightWhite,
        paddingHorizontal: wp('5%'),
        paddingTop: hp('2%'),
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: hp('5%'),
    },
    logo: {
        width: wp('90%'),
        height: hp('20%'),
        resizeMode: 'contain',
        alignSelf: 'center',
        marginTop: hp('2%'),
        marginBottom: hp('1%'),
    },
    title: {
        fontSize: hp('3%'),
        fontFamily: 'Poppins-SemiBold',
        color: globalColors.primary,
        textAlign: 'center',
        marginBottom: hp('4%'),
    },
    inputWrapper: {
        width: '100%',
        marginBottom: hp('2%'),
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: hp('6.5%'),
        borderRadius: wp('2%'),
        paddingHorizontal: wp('4%'),
        borderWidth: 1,
        borderColor: globalColors.borderColor,
        backgroundColor: globalColors.inputBackground,
    },
    inputError: {
        borderColor: globalColors.vividred,
        borderWidth: 1,
    },
    icon: {
        marginRight: wp('3%'),
    },
    input: {
        flex: 1,
        fontFamily: 'Poppins-Regular',
        fontSize: hp('1.8%'),
        color: globalColors.textPrimary,
        height: '100%',
        paddingVertical: 0,
    },
    eyeIcon: {
        padding: wp('1%'),
    },
    button: {
        width: '100%',
        height: hp('6.5%'),
        backgroundColor: globalColors.blue,
        borderRadius: wp('2%'),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp('3%'),
        marginBottom: hp('1%'),
    },
    buttonDisabled: {
        backgroundColor: globalColors.grey,
    },
    buttonText: {
        color: globalColors.white,
        fontFamily: 'Poppins-SemiBold',
        fontSize: hp('2%'),
    },
    loginLink: {
        marginTop: hp('1%'),
        alignSelf: 'center',
    },
    loginText: {
        fontFamily: 'Poppins-Regular',
        fontSize: hp('1.8%'),
        color: globalColors.textSecondary,
    },
    loginLinkText: {
        color: globalColors.primary,
        fontFamily: 'Poppins-SemiBold',
    },
});

export default RegistrationScreen;