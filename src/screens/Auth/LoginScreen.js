import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
    Image, Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { globalColors } from '../../Theme/globalColors';
import { DubaiGames } from '../../Theme/globalImage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState('test');
    const [password, setPassword] = useState('12345');
    const [code, setCode] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleLogin = async () => {
        if (username === 'test' && password === '12345') {
            await AsyncStorage.setItem('userToken', 'dummy-token');
            navigation.navigate("MainApp");
        } else {
            Alert.alert('Invalid Credentials', 'Please enter the correct username, password, and code.');
        }
    };

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
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: globalColors.LightWhite,
        padding: wp('6%'),  // Responsive padding
        justifyContent: 'center',
    },
    subtitle: {
        fontSize: hp('3.5%'), // Responsive font size
        color: '#666',
        textAlign: 'center',
        marginBottom: hp('3%'), // Responsive margin
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        paddingHorizontal: wp('2%'), // Responsive padding
        marginBottom: hp('2%'), // Responsive margin
        elevation: 2,
    },
    icon: {
        marginRight: wp('3%'), // Responsive margin
    },
    input: {
        flex: 1,
        height: hp('6%'), // Responsive input height
        color: '#333',
    },
    button: {
        backgroundColor: globalColors.blue,
        paddingVertical: hp('2%'), // Responsive vertical padding
        borderRadius: 12,
        alignItems: 'center',
        marginTop: hp('3%'), // Responsive margin
    },
    buttonText: {
        color: globalColors.white,
        fontSize: wp('2%'), // Responsive font size
        fontWeight: 'bold',
    },
});

export default LoginScreen;
