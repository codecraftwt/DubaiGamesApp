import React, { useState } from 'react';
import {
    View,
    TextInput,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../Redux/Slices/authSlice';
import api from '../../utils/Api';

const LogoutAllDevicesScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);

    const handleLogoutAllDevices = async () => {
        try {
            const response = await api.post(`/logout-all-devices`, {
                email,
                password,
            });
            Alert.alert('Success', 'You have been logged out from all devices.', [
                {
                    text: 'OK',
                    onPress: async () => {
                        await dispatch(logoutUser());
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        });
                    },
                },
            ]);
        } catch (error) {
            Alert.alert(
                'Error',
                error.response?.data?.message || 'Something went wrong.'
            );
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            {/* Back Button fixed at top */}
            <View style={styles.backButtonContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="#007bff" />
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
            </View>

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.title}>Logout All Devices</Text>

                    <View style={styles.inputContainer}>
                        <Icon name="email" size={20} color="#555" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Icon name="lock" size={20} color="#555" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Icon
                                name={showPassword ? "visibility" : "visibility-off"}
                                size={20}
                                color="#555"
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleLogoutAllDevices}>
                        <Icon name="logout" size={20} color="#fff" />
                        <Text style={styles.buttonText}>Logout All Devices</Text>
                    </TouchableOpacity>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default LogoutAllDevicesScreen;

const styles = StyleSheet.create({
    backButtonContainer: {
        paddingTop: Platform.OS === 'ios' ? 50 : 20, // adjust for notch/status bar
        paddingHorizontal: 24,
        backgroundColor: '#f9f9f9',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButtonText: {
        color: '#007bff',
        fontSize: 16,
        marginLeft: 5,
    },
    container: {
        flexGrow: 1,
        padding: 24,
        justifyContent: 'center',
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        marginBottom: 20,
        paddingBottom: 8,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
    button: {
        flexDirection: 'row',
        backgroundColor: '#007bff',
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        gap: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});
