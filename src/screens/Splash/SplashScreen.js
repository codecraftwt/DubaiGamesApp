import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { AppLogo, DubaiGames } from '../../Theme/globalImage';
import { globalColors } from '../../Theme/globalColors';


const SplashScreen = ({ navigation }) => {
    useEffect(() => {
        setTimeout(() => {
            navigation.replace('Login'); // Navigate to Login screen after 2 seconds
        }, 900);
    }, []);

    return (
        <View style={styles.container}>
            <Image source={DubaiGames} style={styles.logo} />
            <Text style={styles.text}>Dubai Games</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: globalColors.black,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    text: {
        fontSize: 26,
        fontWeight: 'bold',
        color: globalColors.white,
    },
});

export default SplashScreen;
