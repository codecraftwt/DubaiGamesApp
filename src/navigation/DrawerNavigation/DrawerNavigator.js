import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/FontAwesome';
import DashboardScreen from '../../screens/DashboardScreen/DashboardScreen';
import SettingsScreen from '../../screens/Setting/Settings';
import { useNavigation } from '@react-navigation/native';
import { globalColors } from '../../Theme/globalColors';
import AgentList from '../../screens/Agent/AgentList';
import StaffListScreen from '../../screens/StaffList/StaffListScreen';
import DailyResult from '../../screens/Result/DailyResult';
import ResultPage from '../../screens/Result/ResultPage';
import Advance from '../../screens/Advance/Advance';
import EntryDelete from '../../screens/EntryDelete/EntryDelete';
import AddPayment from '../../screens/AddPayment/AddPayment';

const Drawer = createDrawerNavigator();

// Custom Left Menu Button
const CustomHeaderLeft = () => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
            <Icon name="bars" size={24} color="white" />
        </TouchableOpacity>
    );
};

const CustomHeaderTitle = () => {
    return (
        <View style={styles.logoContainer}>
            <Icon name="gamepad" size={24} color="white" />
            <Text style={styles.logoText}>Dubai Game</Text>
        </View>
    );
};

const DrawerNavigator = () => (
    <Drawer.Navigator
        screenOptions={{
            headerShown: true,
            headerStyle: styles.header,
            headerLeft: () => <CustomHeaderLeft />,
            headerTitle: () => <CustomHeaderTitle />,
            headerTitleAlign: 'center',
        }}
    >
        <Drawer.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{
                drawerIcon: ({ color }) => <Feather name="home" size={24} color={color} />,
            }}
        />
        <Drawer.Screen
            name="AgentList"
            component={AgentList}
            options={{
                drawerIcon: ({ color }) => <Feather name="users" size={24} color={color} />,
            }}
        />
        <Drawer.Screen
            name="StaffList"
            component={StaffListScreen}
            options={{
                drawerIcon: ({ color }) => <Feather name="users" size={24} color={color} />,
            }}

        />
        <Drawer.Screen
            name="ResultPage"
            component={ResultPage}
            options={{
                drawerIcon: ({ color }) => <Feather name="clipboard" size={24} color={color} />,
            }}
        />
        <Drawer.Screen
            name="DailyResult"
            component={DailyResult}
            options={{
                drawerIcon: ({ color }) => <Feather name="list" size={24} color={color} />,
            }}
        />
        <Drawer.Screen
            name="Advance"
            component={Advance}
            options={{
                drawerIcon: ({ color }) => <Feather name="shield" size={24} color={color} />,
            }}
        />
        <Drawer.Screen
            name="EntryDelete"
            component={EntryDelete}
            options={{
                drawerIcon: ({ color }) => <Feather name="delete" size={24} color={color} />,
            }}
        />
        <Drawer.Screen
            name="AddPayment"
            component={AddPayment}
            options={{
                drawerIcon: ({ color }) => <Feather name="credit-card" size={24} color={color} />,
            }}
        />

        <Drawer.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
                drawerIcon: ({ color }) => <Feather name="settings" size={24} color={color} />,
            }}
        />



    </Drawer.Navigator>
);

export default DrawerNavigator;

// 🔹 Styles
const styles = StyleSheet.create({
    header: {
        backgroundColor: "#1e293b",
    },
    menuButton: {
        paddingLeft: 16,
    },
    logoContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
    },
    logoText: {
        color: globalColors.white,
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 8,
    },
});
