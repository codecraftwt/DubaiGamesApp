import React, { useEffect, useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
    Image, Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { globalColors } from '../../Theme/globalColors';
import { DubaiGames } from '../../Theme/globalImage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { loginUser } from '../../Redux/Slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ActivityIndicator } from 'react-native-paper';

const LoginScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);

    const [username, setUsername] = useState('test@example.com');
    const [password, setPassword] = useState('123456');
    const [code, setCode] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleLogin = async () => {
        // if (username === 'test' && password === '12345') {
        //     await AsyncStorage.setItem('userToken', 'dummy-token');
        //     navigation.navigate("MainApp");
        // } else {
        //     Alert.alert('Invalid Credentials', 'Please enter the correct username, password, and code.');
        // }
        dispatch(loginUser(username, password));

    };

    useEffect(() => {
        if (authState.isAuthenticated) {
            navigation.replace('MainApp'); // Navigate after login success
        }
    }, [authState.isAuthenticated, navigation]);

    return (
        <View style={styles.container}>
            <Image style={{
                width: wp('90%'),
                height: hp('30%'),
                resizeMode: "contain",
            }} source={DubaiGames} />

            <Text style={styles.subtitle}>Sign in to continue</Text>

            {/* Username Input */}
            <View style={styles.inputContainer}>
                <Icon name="account-outline" size={hp('3%')} color="#888" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor={globalColors.inputLabel}
                    value={username}
                    onChangeText={setUsername}
                />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
                <Icon name="lock-outline" size={hp('3%')} color="#888" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={globalColors.inputLabel}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!isPasswordVisible}
                />
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                    <Icon
                        name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
                        size={hp('3%')}
                        color="#888"
                    />
                </TouchableOpacity>
            </View>

            {/* Code Input */}
            <View style={styles.inputContainer}>
                <Icon name="key-outline" size={hp('3%')} color="#888" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Enter Code"
                    placeholderTextColor={globalColors.inputLabel}
                    value={code}
                    onChangeText={setCode}
                    keyboardType="numeric"
                />
            </View>

            {/* Login Button */}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                {authState.loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Login</Text>
                )}
            </TouchableOpacity>
        </View>
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
        marginBottom: hp('3%'),
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
        borderRadius: 12,
        alignItems: 'center',
        marginTop: hp('3%'),
    },
    buttonText: {
        color: globalColors.white,
        fontFamily: 'Poppins-Bold',
        fontSize: hp('1.9%'),
        fontWeight: 'bold',
    },
});

export default LoginScreen;
