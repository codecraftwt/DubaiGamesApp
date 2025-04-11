import React, { useEffect, useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
    Image, Dimensions,
    ScrollView,
    KeyboardAvoidingView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { globalColors } from '../../Theme/globalColors';
import { DubaiGames } from '../../Theme/globalImage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { loginUser } from '../../Redux/Slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ActivityIndicator } from 'react-native-paper';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import { useTranslation } from 'react-i18next';


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
        } else if (password.length < 8) {
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

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
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
                        placeholder={t('username')}
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
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={[styles.subtitle, { fontSize: hp('2%'), color: globalColors.black, marginTop: hp('1.5%') }]}>
                        {t('createNewAccount')}</Text>
                </TouchableOpacity>


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
        marginBottom: hp('2%'),
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
});

export default LoginScreen;



