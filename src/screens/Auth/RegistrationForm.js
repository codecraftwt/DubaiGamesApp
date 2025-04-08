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
    const dispatch = useDispatch();
    const { registrationLoading, registrationError, isRegistered } = useSelector((state) => state.auth);

    useEffect(() => {
        // Reset registration state when component mounts
        dispatch(resetRegistration());
    }, [dispatch]);

    useEffect(() => {
        if (isRegistered) {
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

    // useEffect(() => {
    //     if (registrationError) {
    //         Alert.alert('Error', registrationError);
    //     }
    // }, [registrationError]);


    const handleChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;

        if (!formData.name.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: 'Name is required',
            });
            return false;
        }
        if (!emailRegex.test(formData.email)) {
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: 'Invalid email address',
            });
            return false;
        }
        if (!phoneRegex.test(formData.phone_number)) {
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: 'Invalid phone number (10 digits required)',
            });
            return false;
        }
        if (formData.pass.length < 8) {
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: 'Password must be at least 8 characters',
            });
            return false;
        }
        if (formData.pass !== formData.confirm_pass) {
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: 'Passwords do not match',
            });
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            // Simulate API call
            console.log("formData", formData)
            await dispatch(registerUser(formData)).unwrap();


            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Registration successful!',
            });
            navigation.navigate('Login');

            setFormData({
                name: '',
                email: '',
                phone_number: '',
                pass: '',
                confirm_pass: ''
            });
        } catch (err) {
            console.log('Error', 'Registration failed. Please try again.', err);
        }
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

                <Text style={styles.title}>Create your account</Text>

                {/* Name Input */}
                <View style={styles.inputWrapper}>
                    <View style={styles.inputContainer}>
                        <Icon name="account-outline" size={hp('2.8%')} color="#888" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            placeholderTextColor={globalColors.inputLabel}
                            value={formData.name}
                            onChangeText={(text) => handleChange('name', text)}
                            autoCapitalize="words"
                        />
                    </View>
                </View>

                {/* Email Input */}
                <View style={styles.inputWrapper}>
                    <View style={styles.inputContainer}>
                        <Icon name="email-outline" size={hp('2.8%')} color="#888" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor={globalColors.inputLabel}
                            value={formData.email}
                            onChangeText={(text) => handleChange('email', text)}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                </View>

                {/* Phone Input */}
                <View style={styles.inputWrapper}>
                    <View style={styles.inputContainer}>
                        <Icon name="phone-outline" size={hp('2.8%')} color="#888" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Phone Number"
                            placeholderTextColor={globalColors.inputLabel}
                            value={formData.phone_number}
                            onChangeText={(text) => handleChange('phone_number', text)}
                            keyboardType="phone-pad"
                            maxLength={10}
                        />
                    </View>
                </View>

                {/* Password Input */}
                <View style={styles.inputWrapper}>
                    <View style={styles.inputContainer}>
                        <Icon name="lock-outline" size={hp('2.8%')} color="#888" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
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

                {/* Confirm Password Input */}
                <View style={styles.inputWrapper}>
                    <View style={styles.inputContainer}>
                        <Icon name="lock-check-outline" size={hp('2.8%')} color="#888" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
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

                {/* Register Button */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSubmit}
                    disabled={registrationLoading}
                >
                    {registrationLoading ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : (
                        <Text style={styles.buttonText}>Register</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}
                    style={styles.loginLink}
                >
                    <Text style={styles.loginText}>
                        Already have an account? <Text style={styles.loginLinkText}>Login</Text>
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