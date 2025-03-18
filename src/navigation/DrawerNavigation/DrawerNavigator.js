import React, { useEffect, useState } from "react";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import DashboardScreen from "../../screens/DashboardScreen/DashboardScreen";
import SettingsScreen from "../../screens/Setting/Settings";
import AgentList from "../../screens/Agent/AgentList";
import StaffListScreen from "../../screens/StaffList/StaffListScreen";
import ResultPage from "../../screens/Result/ResultPage";
import DailyResult from "../../screens/Result/DailyResult";
import Advance from "../../screens/Advance/Advance";
import EntryDelete from "../../screens/EntryDelete/EntryDelete";
import AddPayment from "../../screens/AddPayment/AddPayment";
import { DubaiGames, DubaiGameslogo } from "../../Theme/globalImage";
import PaymentReport from "../../screens/PaymentMethods/PaymentReport";
import OldPaymentReport from "../../screens/PaymentMethods/OldPaymentReport";
import BusinessReport from "../../screens/PaymentMethods/BusinessReport";
import { globalColors } from "../../Theme/globalColors";

const Drawer = createDrawerNavigator();


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
            {/* <Icon name="gamepad" size={24} color="white" /> */}
            <Image source={DubaiGameslogo} style={{ height: 28, width: 40 }}></Image>
            <Text style={styles.logoText}>Dubai Game</Text>
        </View>
    );
};

// Custom Drawer Content for Nested Menus
const CustomDrawerContent = (props) => {
    const navigation = useNavigation();

    const [isAttendanceOpen, setAttendanceOpen] = useState(false);
    const [isReportsOpen, setReportsOpen] = useState(false);
    const [PaymentMethods, setPaymentMethods] = useState(false);


    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            setAttendanceOpen(false);
            setReportsOpen(false);
            setPaymentMethods(false);
        });

        return unsubscribe;
    }, [navigation]);

    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />

            <TouchableOpacity style={styles.dropdownHeader} onPress={() => setAttendanceOpen(!isAttendanceOpen)}>
                <Feather name="folder" size={24} color={globalColors.inputLabel} />
                <Text style={styles.dropdownText}>Attendance</Text>
                <Feather name={isAttendanceOpen ? "chevron-up" : "chevron-down"} size={24} color="black" />
            </TouchableOpacity>

            {isAttendanceOpen && (
                <View style={styles.nestedItem}>
                    <DrawerItem
                        label="Staff Attendance"
                        icon={({ color }) => <Feather name="file-text" size={22} color={color}
                        />}
                        onPress={() => navigation.navigate("StaffAttendance")}
                    />
                </View>
            )}



            <TouchableOpacity style={styles.dropdownHeader} onPress={() => setReportsOpen(!isReportsOpen)}>
                <Feather name="folder" size={24} color={globalColors.inputLabel} />
                <Text style={styles.dropdownText}>Reports of Week</Text>
                <Feather name={isReportsOpen ? "chevron-up" : "chevron-down"} size={24} color="black" />
            </TouchableOpacity>

            {isReportsOpen && (
                <View style={styles.nestedItem}>
                    <DrawerItem label="Weekly Report" onPress={() => navigation.navigate("WeeklyReport")} />
                    <DrawerItem label="Verify Report" onPress={() => navigation.navigate("VerifyReport")} />
                    <DrawerItem label="Add Payment Report" onPress={() => navigation.navigate("AddPaymentReport")} />
                    <DrawerItem label="Add Button Report" onPress={() => navigation.navigate("AddButtonReport")} />
                </View>
            )}


            <TouchableOpacity style={styles.dropdownHeader} onPress={() => setPaymentMethods(!PaymentMethods)}>
                <Feather name="folder" size={24} color={globalColors.inputLabel} />
                <Text style={styles.dropdownText}>Payment Methods</Text>
                <Feather name={PaymentMethods ? "chevron-up" : "chevron-down"} size={24} color="black" />
            </TouchableOpacity>

            {
                PaymentMethods &&
                <View style={styles.nestedItem}>
                    <DrawerItem
                        label="Payment Report"
                        icon={({ color }) => <Feather name="database" size={22} color={color}
                        />}
                        onPress={() => navigation.navigate("PaymentReport")}
                    />
                    <DrawerItem
                        label="Old Payment Report"
                        icon={({ color }) => <Feather name="film" size={22} color={color}
                        />}
                        onPress={() => navigation.navigate("OldPaymentReport")}
                    />
                    <DrawerItem
                        label="Business Report"
                        icon={({ color }) => <Feather name="file-text" size={22} color={color}
                        />}
                        onPress={() => navigation.navigate("BusinessReport")}
                    />

                    <DrawerItem
                        label="Payment Ledger"
                        icon={({ color }) => <Feather name="file-text" size={22} color={color}
                        />}
                        onPress={() => navigation.navigate("PaymentLedger")}
                    />


                </View>
            }
        </DrawerContentScrollView>
    );
};

const DrawerNavigator = () => (
    <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
            headerShown: true,
            headerStyle: styles.header,
            headerLeft: () => <CustomHeaderLeft />,
            headerTitle: () => <CustomHeaderTitle />,
            headerTitleAlign: "center",
            drawerLabelStyle: {
                fontFamily: 'Poppins-Medium',
                fontSize: 16
            }
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
            name="StaffList"
            component={StaffListScreen}
            options={{
                drawerIcon: ({ color }) => <Feather name="users" size={24} color={color} />,
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
            name="Logout"
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
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 8,
    },
    section: {
        marginTop: 20,
        paddingLeft: 15,
    },
    nestedItem: {
        paddingLeft: 35, // Indent for nested menu
    },
    dropdownHeader: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 5,
    },
    dropdownText: {
        flex: 1,
        fontSize: 15,
        marginLeft: 10,
        fontFamily: 'Poppins-Medium',
        color: globalColors.inputLabel
    },
    nestedItem: {
        paddingLeft: 30,
    },

});
