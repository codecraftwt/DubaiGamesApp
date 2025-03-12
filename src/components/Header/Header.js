
import React from 'react'
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from '@react-navigation/native';
import { globalColors } from '../../Theme/globalColors';

const Header = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ paddingLeft: 16 }}>
                <Icon name="bars" size={24} color={globalColors.white} />
            </TouchableOpacity>

            <View style={styles.logoContainer}>
                <Icon name="gamepad" size={24} color="white" />
                <Text style={styles.logoText}>Dubai Game</Text>
            </View>

        </View>)
}


const styles = StyleSheet.create({
    header: {
        backgroundColor: "#1e293b",
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    logoContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    logoText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 8,
    },
})


export default Header