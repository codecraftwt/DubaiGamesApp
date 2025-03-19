// import React, { useEffect, useState } from "react";
// import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
// import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
// import Feather from "react-native-vector-icons/Feather";
// import Icon from "react-native-vector-icons/FontAwesome";
// import { NavigationContainer, useNavigation } from "@react-navigation/native";
// import DashboardScreen from "../../screens/DashboardScreen/DashboardScreen";
// import SettingsScreen from "../../screens/Setting/Settings";
// import AgentList from "../../screens/Agent/AgentList";
// import StaffListScreen from "../../screens/StaffList/StaffListScreen";
// import ResultPage from "../../screens/Result/ResultPage";
// import DailyResult from "../../screens/Result/DailyResult";
// import Advance from "../../screens/Advance/Advance";
// import EntryDelete from "../../screens/EntryDelete/EntryDelete";
// import AddPayment from "../../screens/AddPayment/AddPayment";
// import { DubaiGames, DubaiGameslogo } from "../../Theme/globalImage";
// import PaymentReport from "../../screens/PaymentMethods/PaymentReport";
// import OldPaymentReport from "../../screens/PaymentMethods/OldPaymentReport";
// import BusinessReport from "../../screens/PaymentMethods/BusinessReport";
// import { globalColors } from "../../Theme/globalColors";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const Drawer = createDrawerNavigator();

// const ALL_MENU_ITEMS = [
//     { name: "Dashboard", component: DashboardScreen, icon: "home" },
//     { name: "Daily Result", component: DailyResult, icon: "clipboard" },
//     { name: "Agent List", component: AgentList, icon: "users" },
//     { name: "Client List", component: StaffListScreen, icon: "user" },
//     { name: "Reports", component: PaymentReport, icon: "file-text" },
//     { name: "My Account", component: SettingsScreen, icon: "user" },
// ];


// const MENU_ITEMS = {
//     admin: ["Dashboard", "Daily Result", "Agent List", "Client List", "Reports", "My Account"],
//     staff: ["Dashboard", "My Account", "Client List", "Daily Result", "Reports"],
//     editor: ["Dashboard", "My Account", "Daily Result"],
// };

// const CustomDrawerContent = (props) => {
//     const [role, setRole] = useState(null);
//     const navigation = useNavigation();

//     useEffect(() => {
//         const fetchUserRole = async () => {
//             const userData = await AsyncStorage.getItem('userData');
//             if (userData) {
//                 const parsedData = JSON.parse(userData);
//                 setRole(parsedData.role);
//             }
//         };
//         fetchUserRole();
//     }, []);

//     return (
//         <DrawerContentScrollView {...props}>
//             <View style={styles.drawerHeader}>
//                 <Image source={DubaiGameslogo} style={styles.drawerLogo} />
//                 <Text style={styles.drawerTitle}>Dubai Game</Text>
//             </View>
//             {ALL_MENU_ITEMS.map((item, index) => {
//                 if (role && MENU_ITEMS[role]?.includes(item.name)) {
//                     return (
//                         <DrawerItem
//                             key={index}
//                             label={item.name}
//                             icon={({ color }) => <Feather name={item.icon} size={22} color={color} />}
//                             onPress={() => props.navigation.navigate(item.name)}
//                         />
//                     );
//                 }
//                 return null;
//             })}
//         </DrawerContentScrollView>
//     );
// };


// const DrawerNavigator = () => {

//     const CustomHeaderLeft = () => {
//         const navigation = useNavigation();

//         return (
//             <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
//                 <Icon name="bars" size={24} color="white" />
//             </TouchableOpacity>
//         );
//     };

//     const CustomHeaderTitle = () => {
//         return (
//             <View style={styles.logoContainer}>
//                 {/* <Icon name="gamepad" size={24} color="white" /> */}
//                 <Text style={styles.logoText}>Dubai Game</Text>

//                 <Image source={DubaiGameslogo} style={{ height: 28, width: 40 }}></Image>
//             </View>
//         );
//     };

//     return (
//         <>
//             <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}
//                 screenOptions={{
//                     headerShown: true,
//                     headerStyle: styles.header,
//                     headerLeft: () => <CustomHeaderLeft />,
//                     headerTitle: () => <CustomHeaderTitle />,
//                     headerTitleAlign: "center",
//                     drawerInactiveTintColor: "black", // Ensures inactive labels are black
//                     drawerActiveTintColor: "red",
//                     drawerLabelStyle: ({ focused }) => ({
//                         fontFamily: 'Poppins-Medium',
//                         fontSize: 16,
//                         color: focused ? "red" : "black",
//                     }),
//                 }}>
//                 {
//                     ALL_MENU_ITEMS.map((item, index) => (
//                         <Drawer.Screen key={index} name={item.name} component={item.component} />
//                     ))
//                 }
//             </Drawer.Navigator>
//         </>
//     );
// };



// export default DrawerNavigator;

// // 🔹 Styles
// const styles = StyleSheet.create({
//     header: {
//         backgroundColor: "#1e293b",
//     },
//     menuButton: {
//         paddingLeft: 16,
//     },
//     logoContainer: {
//         flexDirection: "row",
//         alignItems: "flex-end",
//     },
//     logoText: {
//         color: "white",
//         fontSize: 18,
//         fontWeight: "bold",
//         marginLeft: 8,
//     },
//     section: {
//         marginTop: 20,
//         paddingLeft: 15,
//     },
//     nestedItem: {
//         paddingLeft: 35, // Indent for nested menu
//     },
//     dropdownHeader: {
//         flexDirection: "row",
//         alignItems: "center",
//         paddingVertical: 12,
//         paddingHorizontal: 16,
//         borderRadius: 5,
//     },
//     dropdownText: {
//         flex: 1,
//         fontSize: 15,
//         marginLeft: 10,
//         fontFamily: 'Poppins-Medium',
//         color: globalColors.inputLabel
//     },
//     nestedItem: {
//         paddingLeft: 30,
//     },

//     drawerHeader: {
//         alignItems: "center",
//         justifyContent: 'center',
//         paddingVertical: 10,
//         flexDirection: 'row',
//         borderBottomWidth: 1,
//         borderBottomColor: globalColors.borderColor,
//         backgroundColor: globalColors.LightWhite,
//         marginBottom: 10,
//     },
//     drawerLogo: {
//         height: 50,
//         width: 80,
//         resizeMode: "contain",
//     },
//     drawerTitle: {
//         fontSize: 18,
//         fontWeight: "bold",
//         marginTop: 5,
//         color: "#333",
//     },

// });





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

const Drawer = createDrawerNavigator();

const ALL_MENU_ITEMS = [
    { name: "Dashboard", component: DashboardScreen, icon: "home" },
    { name: "Daily Result", component: DailyResult, icon: "clipboard" },
    { name: "Agent List", component: AgentList, icon: "users" },
    { name: "Client List", component: StaffListScreen, icon: "user" },
    { name: "My Account", component: SettingsScreen, icon: "user" },
    { name: "Reports", component: null, icon: "file-text", isDropdown: true },  // Dropdown Item
];

const MENU_ITEMS = {
    admin: ["Dashboard", "Daily Result", "Agent List", "Client List", "Reports", "My Account"],
    staff: ["Dashboard", "My Account", "Client List", "Daily Result", "Reports"],
    editor: ["Dashboard", "My Account", "Daily Result"],
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
        <DrawerContentScrollView {...props}>
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
                                    icon={({ color }) => <Feather name={item.icon} size={22} color={color} />}
                                    onPress={handleToggleDropdown}
                                />
                                {dropdownOpen && (
                                    <View style={styles.dropdownItems}>
                                        <DrawerItem
                                            label="Weekly Report"
                                            icon={({ color }) => <Feather name="file-text" size={22} color={color} />}
                                            onPress={() => props.navigation.navigate('WeeklyReport')}
                                        />
                                        <DrawerItem
                                            label="Verify Report"
                                            icon={({ color }) => <Feather name="file-text" size={22} color={color} />}
                                            onPress={() => props.navigation.navigate('VerifyReport')}
                                        />
                                        <DrawerItem
                                            label="Add Payment report"
                                            icon={({ color }) => <Feather name="file-text" size={22} color={color} />}
                                            onPress={() => props.navigation.navigate('AddPaymentReport')}
                                        />

                                        <DrawerItem
                                            label="Add Button Report"
                                            icon={({ color }) => <Feather name="file-text" size={22} color={color} />}
                                            onPress={() => props.navigation.navigate('AddButtonReport')}
                                        />
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
                            icon={({ color }) => <Feather name={item.icon} size={22} color={color} />}
                            onPress={() => props.navigation.navigate(item.name)}
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
                drawerInactiveTintColor: "black",
                drawerActiveTintColor: "red",
                drawerLabelStyle: ({ focused }) => ({
                    fontFamily: 'Poppins-Medium',
                    fontSize: 16,
                    color: focused ? "red" : "black",
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
            <Drawer.Screen name="VerifyReport" component={VerifyReport} />
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
        fontSize: 20,
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
