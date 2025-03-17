import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Modal,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import StaffAttendanceView from "../../components/Modal/StaffAttendanceView";
import StaffAttendanceInsertModal from "../../components/Modal/StaffAttendanceInsertModal";
import { globalColors } from "../../Theme/globalColors";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";

const weeks = [
    { label: "Week 11 (10 Mar - 16 Mar)", value: "week_11" },
    { label: "Week 12 (17 Mar - 23 Mar)", value: "week_12" },
];

const attendanceData = [
    {
        id: "1",
        userName: "ADMIN",
        market: "KALYAN",
        attendance: ["A", "P", "A", "A", "A", "A", "A"],
        transactions: [
            { date: "2025-03-11", type: "दिले", amount: 100.0 },
            { date: "2025-03-11", type: "घेणे", amount: 50.0 },
            { date: "2025-03-11", type: "दिले", amount: 50.0 },
            { date: "2025-03-13", type: "घेणे", amount: 10.0 },
        ],
        total: 728,
        totalGiven: 150,
        totalTaken: 60,
        finalAmount: 638,
    },
    {
        id: "2",
        userName: "MUMBAI",
        market: "MUMBAI",
        attendance: ["A", "P", "A", "A", "A", "A", "A"],
        transactions: [
            { date: "11 Mar", type: "Credit", amount: 200 },
            { date: "13 Mar", type: "Debit", amount: 70 },
        ],
        total: 200,
        totalTaken: 70,
        totalGiven: 200,
        finalAmount: 130,
    },
];

const weekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const StaffAttendance = () => {
    const navigation = useNavigation();
    const [selectedWeek, setSelectedWeek] = useState(weeks[0].value);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisibleInsert, setModalVisibleInsert] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Function to open the modal
    const openModal = (user) => {
        setSelectedUser(user);
        setModalVisible(true);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}

                style={styles.menuButton}>
                <Icon name="bars" size={24} color="white" />
            </TouchableOpacity><Text style={styles.title}>Staff Attendance</Text>

            {/* Dropdown */}
            <Dropdown
                style={styles.dropdown}
                data={weeks}
                labelField="label"
                valueField="value"
                value={selectedWeek}
                onChange={(item) => setSelectedWeek(item.value)}
            />

            {/* Horizontal Scrollable Table */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View>
                    {/* Header Row */}
                    <View style={styles.headerRow}>
                        <Text style={[styles.headerCell, { width: 100 }]}>USER NAME</Text>
                        <Text style={[styles.headerCell, { width: 100 }]}>MARKET</Text>
                        {weekDays.map((day, index) => (
                            <Text key={index} style={styles.headerCell}>
                                {day}
                            </Text>
                        ))}
                        <Text style={[styles.headerCell, { width: 120 }]}>ACTION</Text>
                    </View>

                    {/* Attendance Data */}
                    {attendanceData.map((item) => (
                        <View key={item.id} style={styles.row}>
                            <Text style={[styles.cell, { width: 100 }]}>{item.userName}</Text>
                            <Text style={[styles.cell, { width: 100 }]}>{item.market}</Text>
                            {item.attendance.map((status, index) => (
                                <Text
                                    key={index}
                                    style={[
                                        styles.cell,
                                        status === "A" ? styles.absent : styles.present,
                                    ]}
                                >
                                    {status}
                                </Text>
                            ))}
                            <View style={[styles.cell, { width: 120, flexDirection: "row" }]}>
                                <TouchableOpacity
                                    style={styles.viewButton}
                                    onPress={() => openModal(item)}
                                >
                                    <Text style={styles.buttonText}>View</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.insertButton}
                                    onPress={() => setModalVisibleInsert(true)}
                                >
                                    <Text style={styles.buttonText}>Insert</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Modal Component */}
            {modalVisible && selectedUser && (
                <StaffAttendanceView modalVisible={modalVisible} setModalVisible={setModalVisible} selectedUser={selectedUser} />
            )}
            <StaffAttendanceInsertModal modalVisible={modalVisibleInsert} setModalVisible={setModalVisibleInsert} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: globalColors.LightWhite,
    },
    title: {
        fontSize: 22,
        fontFamily: 'Poppins-Bold',
        // textAlign: "center",
        marginBottom: 20,
    },
    dropdown: {
        borderWidth: 1,
        borderColor: globalColors.borderColor,
        backgroundColor: globalColors.inputbgColor,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 10,
    },
    headerRow: {
        flexDirection: "row",
        backgroundColor: globalColors.LightWhite,
        paddingVertical: 10,
        borderBottomWidth: 2,
        borderBottomColor: globalColors.borderColor,
    },
    headerCell: {
        fontSize: 14,
        fontFamily: 'Poppins-Bold',
        paddingHorizontal: 8,
        textAlign: "center",
        width: 80,
    },
    row: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        paddingVertical: 10,
    },
    cell: {
        fontSize: 14,
        paddingHorizontal: 10,
        textAlign: "center",
        width: 80,
    },
    absent: {
        backgroundColor: "#e74c3c",
        color: "#fff",
        paddingVertical: 5,
        borderRadius: 5,
    },
    present: {
        backgroundColor: "#27ae60",
        color: "#fff",
        paddingVertical: 5,
        borderRadius: 5,
    },
    viewButton: {
        backgroundColor: "#1abc9c",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginRight: 5,
    },
    insertButton: {
        backgroundColor: "#007bff",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: globalColors.white,
        fontWeight: "bold",
    },
});

export default StaffAttendance;
