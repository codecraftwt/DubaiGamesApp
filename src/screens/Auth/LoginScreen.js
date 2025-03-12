import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { globalColors } from '../../Theme/globalColors';

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
            <Text style={styles.title}>Welcome To Dubai Games</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>

            {/* Username Input */}
            <View style={styles.inputContainer}>
                <Icon name="account-outline" size={24} color="#888" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor={globalColors.inputLabel} value={username}
                    onChangeText={setUsername}
                />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
                <Icon name="lock-outline" size={24} color="#888" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={globalColors.inputLabel} value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!isPasswordVisible}
                />
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                    <Icon
                        name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
                        size={24}
                        color="#888"
                    />
                </TouchableOpacity>
            </View>

            {/* Code Input */}
            <View style={styles.inputContainer}>
                <Icon name="key-outline" size={24} color="#888" style={styles.icon} />
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

            {/* Forgot Password */}
            {/* <TouchableOpacity onPress={() => Alert.alert('Reset Password', 'Reset link sent to your email.')}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: globalColors.LightWhite,
        padding: 24,
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: globalColors.inputLabel,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: '#FFF',
        borderRadius: 10,
        paddingHorizontal: 16,
        marginBottom: 16,
        elevation: 2,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        color: '#333',

    },
    button: {
        backgroundColor: globalColors.blue,
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
        // shadowColor: '#007BFF',
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    buttonText: {
        color: globalColors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },

});

export default LoginScreen;





// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// const LoginScreen = ({ navigation }) => {
//     const [username, setUsername] = useState('test');
//     const [password, setPassword] = useState('12345');
//     const [code, setCode] = useState('');
//     const [isPasswordVisible, setIsPasswordVisible] = useState(false); // ✅ State for password visibility

//     const handleLogin = async () => {
//         if (username === 'test' && password === '12345') {
//             await AsyncStorage.setItem('userToken', 'dummy-token');
//             navigation.navigate("MainApp");
//         } else {
//             Alert.alert('Invalid Credentials', 'Please enter the correct username, password, and code.');
//         }
//     };

//     return (
//         <View style={styles.container}>
//             <View style={styles.header}>
//                 <Text style={styles.welcomeText}>Login</Text>
//             </View>

//             <View style={styles.inputContainer}>
//                 <Icon name="account-outline" size={24} color="#888888" style={styles.icon} />
//                 <TextInput
//                     style={styles.input}
//                     placeholder="Username"
//                     placeholderTextColor="#888888"
//                     value={username}
//                     onChangeText={setUsername}
//                 />
//             </View>

//             <View style={styles.inputContainer}>
//                 <Icon name="lock-outline" size={24} color="#888888" style={styles.icon} />
//                 <TextInput
//                     style={styles.input}
//                     placeholder="Password"
//                     placeholderTextColor="#888888"
//                     value={password}
//                     onChangeText={setPassword}
//                     secureTextEntry={!isPasswordVisible} // ✅ Toggle password visibility
//                 />
//                 <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
//                     <Icon
//                         name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
//                         size={24}
//                         color="#888888"
//                     />
//                 </TouchableOpacity>
//             </View>

//             <View style={styles.inputContainer}>
//                 <Icon name="key-outline" size={24} color="#888888" style={styles.icon} />
//                 <TextInput
//                     style={styles.input}
//                     placeholder="Enter Code"
//                     placeholderTextColor="#888888"
//                     value={code}
//                     onChangeText={setCode}
//                     keyboardType="numeric"
//                 />
//             </View>

//             <TouchableOpacity style={styles.button} onPress={handleLogin}>
//                 <Text style={styles.buttonText}>Login</Text>
//             </TouchableOpacity>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#1A1A1A',
//         padding: 20,
//         justifyContent: 'center',
//     },
//     header: {
//         alignItems: 'center',
//         marginBottom: 24,
//     },
//     welcomeText: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: '#FFFFFF',
//     },
//     inputContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: '#2A2A2A',
//         borderRadius: 12,
//         paddingHorizontal: 16,
//         marginBottom: 16,
//     },
//     icon: {
//         marginRight: 10,
//     },
//     input: {
//         flex: 1,
//         height: 50,
//         color: '#FFFFFF',
//     },
//     button: {
//         backgroundColor: '#4CAF50',
//         padding: 14,
//         borderRadius: 12,
//         alignItems: 'center',
//         marginTop: 10,
//     },
//     buttonText: {
//         color: '#FFFFFF',
//         fontSize: 18,
//         fontWeight: 'bold',
//     },
// });