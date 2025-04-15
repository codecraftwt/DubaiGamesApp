
import React, { useEffect, useState } from "react";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Icon from "react-native-vector-icons/FontAwesome";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import DashboardScreen from "../../screens/DashboardScreen/DashboardScreen";
import SettingsScreen from "../../screens/Setting/Settings";
import AgentList from "../../screens/Agent/AgentList";
import StaffListScreen from "../../screens/StaffList/StaffListScreen";
import ResultPage from "../../screens/Result/ResultPage";
import DailyResult from "../../screens/Result/DailyResult";

import WeeklyReport from "../../screens/ReportsOfWeek/WeeklyReport";
import AddButtonReport from '../../screens/ReportsOfWeek/AddButtonReport';
import AddPaymentReport from '../../screens/ReportsOfWeek/AddPaymentReport';
import VerifyReport from '../../screens/ReportsOfWeek/VerifyReport';

import Advance from "../../screens/Advance/Advance";
import EntryDelete from "../../screens/EntryDelete/EntryDelete";
import AddPayment from "../../screens/AddPayment/AddPayment";
import { DubaiGames, DubaiGameslogo } from "../../Theme/globalImage";
import PaymentReport from "../../screens/PaymentMethods/PaymentReport";
import OldPaymentReport from "../../screens/PaymentMethods/OldPaymentReport";
import BusinessReport from "../../screens/PaymentMethods/BusinessReport";
import { globalColors } from "../../Theme/globalColors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomerList from "../../screens/Customer/CustomerList";

const Drawer = createDrawerNavigator();

const ALL_MENU_ITEMS = [
    { name: "Dashboard", component: DashboardScreen, icon: "home" },
    { name: "Daily Result", component: DailyResult, icon: "clipboard" },
    { name: "ResultPage", component: ResultPage, icon: "clipboard" },
    { name: "Agent List", component: AgentList, icon: "users" },
    { name: "Client List", component: StaffListScreen, icon: "user" },
    { name: "My Account", component: SettingsScreen, icon: "user" },
    { name: "Customer List", component: CustomerList, icon: "user" },
    { name: "Reports", component: null, icon: "file-text", isDropdown: true },  // Dropdown Item
];

// const MENU_ITEMS = {
//     admin: ["Dashboard", "Daily Result", "ResultPage", "Agent List", "Client List", "Reports", "My Account", "CustomerList"],
//     staff: ["Dashboard", "My Account", "Client List", "Daily Result", "Reports"],
//     editor: ["Dashboard", "My Account", "Daily Result"],
// };

const MENU_ITEMS = {
    admin: ["Dashboard", "Daily Result", "My Account", "Customer List"],
    staff: ["Dashboard", "My Account", "Client List", "Daily Result", "Reports"],
    editor: ["Dashboard", "My Account", "Daily Result"],
    online_customer: ["Dashboard", "My Account", "Customer List"],
    agent: ["Dashboard", "My Account", "Customer List"],


};

const CustomDrawerContent = (props) => {
    const [role, setRole] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);  // State for dropdown toggle
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserRole = async () => {
            const userData = await AsyncStorage.getItem('userData');
            if (userData) {
                const parsedData = JSON.parse(userData);
                setRole(parsedData.role);
            }
        };
        fetchUserRole();
    }, []);

    const handleToggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);  // Toggle dropdown state
    };

    return (
        <DrawerContentScrollView {...props} style={{ backgroundColor: globalColors.LightWhite }}>
            <View style={styles.drawerHeader}>
                <Image source={DubaiGameslogo} style={styles.drawerLogo} />
                <Text style={styles.drawerTitle}>Dubai Game</Text>
            </View>

            {/* Render menu items */}
            {ALL_MENU_ITEMS.map((item, index) => {
                if (role && MENU_ITEMS[role]?.includes(item.name)) {
                    // If the item is a dropdown
                    if (item.isDropdown) {
                        return (
                            <View key={index}>
                                <DrawerItem
                                    label="Reports"
                                    icon={({ focused }) => <Feather name={item.icon} size={22} color={focused ? globalColors.blue : "black"}
                                    />}
                                    onPress={handleToggleDropdown}
                                    focused={props.state.routes[props.state.index].name === item.name}
                                    style={{
                                        backgroundColor: props.state.routes[props.state.index].name === item.name ? globalColors.blue : "transparent",
                                    }}
                                    labelStyle={{
                                        color: props.state.routes[props.state.index].name === item.name ? globalColors.blue : "black",
                                    }}
                                />
                                {dropdownOpen && (
                                    <View style={styles.dropdownItems}>
                                        {[
                                            { name: "Weekly Report", route: "WeeklyReport" },
                                            { name: "Verify Report", route: "VerifyReport" },
                                            { name: "Add Payment Report", route: "AddPaymentReport" },
                                            { name: "Add Button Report", route: "AddButtonReport" }
                                        ].map((subItem, idx) => (
                                            <DrawerItem
                                                key={idx}
                                                label={subItem.name}
                                                icon={({ focused }) => (
                                                    <Feather name="file-text" size={22} color={focused ? globalColors.white : "black"} />
                                                )}
                                                onPress={() => props.navigation.navigate(subItem.route)}
                                                focused={props.state.routes[props.state.index].name === subItem.route}
                                                style={{
                                                    backgroundColor: props.state.routes[props.state.index].name === subItem.route ? globalColors.Charcoal : "transparent",
                                                }}
                                                labelStyle={{
                                                    color: props.state.routes[props.state.index].name === subItem.route ? globalColors.white : "black",
                                                }}
                                            />
                                        ))}
                                    </View>
                                )}

                            </View>
                        );
                    }

                    // Render regular item
                    return (
                        <DrawerItem
                            key={index}
                            label={item.name}
                            icon={({ focused }) => <Feather name={item.icon} size={22}
                                color={focused ? "white" : "black"}
                            />}
                            onPress={() => props.navigation.navigate(item.name)}
                            focused={props.state.routes[props.state.index].name === item.name}
                            style={{
                                backgroundColor: props.state.routes[props.state.index].name === item.name ? globalColors.Charcoal : "transparent",
                            }}
                            labelStyle={{ color: props.state.routes[props.state.index].name === item.name ? "white" : "black" }}
                        />
                    );
                }
                return null;
            })}
        </DrawerContentScrollView>
    );
};

const DrawerNavigator = () => {
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
                <Image source={DubaiGameslogo} style={{ height: 28, width: 40 }}></Image>
                <Text style={styles.logoText}>Dubai Game </Text>
            </View>
        );
    };
    return (
        <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerShown: true,
                headerStyle: styles.header,
                headerLeft: () => <CustomHeaderLeft />,
                headerTitle: () => <CustomHeaderTitle />,
                headerTitleAlign: "center",
                // drawerInactiveTintColor: globalColors.blue,
                // drawerActiveTintColor: globalColors.Magnolia,
                // drawerActiveBackgroundColor: "red",

                drawerLabelStyle: ({ focused }) => ({
                    fontFamily: 'Poppins-Medium',
                    fontSize: 16,
                }),
            }}>
            <Drawer.Screen name="Dashboard" component={DashboardScreen} />
            <Drawer.Screen name="Daily Result" component={DailyResult} />
            <Drawer.Screen name="Agent List" component={AgentList} />
            <Drawer.Screen name="Client List" component={StaffListScreen} />
            <Drawer.Screen name="My Account" component={SettingsScreen} />


            <Drawer.Screen name="WeeklyReport" component={WeeklyReport} />
            <Drawer.Screen name="AddButtonReport" component={AddButtonReport} />
            <Drawer.Screen name="AddPaymentReport" component={AddPaymentReport} />
            <Drawer.Screen name="VerifyReport" component={VerifyReport}

            />
            <Drawer.Screen name="ResultPage" component={ResultPage} />
            <Drawer.Screen name="Customer List" component={CustomerList} />
            {/* ResultPage */}
        </Drawer.Navigator>
    );
};

const styles = StyleSheet.create({
    drawerHeader: {
        alignItems: "center",
        justifyContent: 'center',
        paddingVertical: 10,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: globalColors.borderColor,
        backgroundColor: globalColors.LightWhite,
        marginBottom: 10,
    },
    drawerLogo: {
        height: 40,
        width: 60,
        marginBottom: 10,
    },
    drawerTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
    },
    dropdownItems: {
        marginLeft: 20, // Indent dropdown items
    },
    menuButton: {
        paddingLeft: 16,
    },
    logoContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
        alignSelf: 'center'
    },
    logoText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 8,
    },
    header: {
        backgroundColor: "#1e293b",
    },
});

export default DrawerNavigator;
