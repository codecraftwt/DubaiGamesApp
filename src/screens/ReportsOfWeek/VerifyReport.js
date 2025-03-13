import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView, Platform, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Dropdown } from "react-native-element-dropdown";
import { globalColors } from "../../Theme/globalColors";

const VerifyReport = () => {
    const [agentCode, setAgentCode] = useState("");
    const [agentName, setAgentName] = useState("");
    const [market, setMarket] = useState(null);
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const markets = [
        { label: "Kalyan", value: "Kalyan" },
        { label: "Mumbai", value: "Mumbai" },
        { label: "Pune", value: "Pune" },
    ];

    const tableData = [
        { id: "1", agentCode: "A001", agentName: "John Doe", market: "Kalyan", userIds: "1234", verifiedBy: "Admin", verificationCount: "5", notVerifiedCount: "2", openMsg: "Yes", closeMsg: "No" },
        { id: "2", agentCode: "A002", agentName: "Jane Smith", market: "Mumbai", userIds: "5678", verifiedBy: "Manager", verificationCount: "8", notVerifiedCount: "1", openMsg: "No", closeMsg: "Yes" },
    ];

    const onChangeDate = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) setDate(selectedDate);
    };

    return (
        <View style={styles.container}>

            <Text style={styles.title}>VERIFY PAGE 🔵</Text>
            <View style={styles.formSection}>
                <View style={styles.row}>
                    <View style={styles.inputGroup}>
                        <TextInput
                            placeholder="Agent Code"
                            value={agentCode}
                            onChangeText={setAgentCode}
                            style={styles.input}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <TextInput
                            placeholder="Agent Name"
                            value={agentName}
                            onChangeText={setAgentName}
                            style={styles.input}

                        />
                    </View>


                </View>

                {/* Dropdown & Date Picker */}

                <Dropdown
                    style={styles.dropdown}
                    data={markets}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Market"
                    value={market}
                    onChange={(item) => setMarket(item.value)}
                />

                <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={styles.datePicker}>
                    <Text>
                        {date.toDateString()}
                    </Text>
                </TouchableOpacity>

            </View>

            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={onChangeDate}
                />
            )}


            {/* Show Button */}
            <TouchableOpacity style={{ backgroundColor: "green", padding: 12, alignItems: "center", borderRadius: 5, marginBottom: 10 }}>
                <Text style={{ color: "#fff", fontSize: 16 }}>Show</Text>
            </TouchableOpacity>

            {/* Table Header */}
            <ScrollView horizontal>
                <View style={{ flexDirection: "row", borderBottomWidth: 2, paddingVertical: 5, backgroundColor: "#f5f5f5" }}>
                    {["SR.NO", "AGENT CODE", "AGENT NAME", "MARKET", "USER IDS", "VERIFIED BY", "VERIFICATION COUNT", "NOT VERIFIED COUNT", "OPEN_MSG", "CLOSE_MSG"].map((header, index) => (
                        <Text key={index} style={{ width: 100, fontWeight: "bold", padding: 5, textAlign: "center", borderRightWidth: 1 }}>
                            {header}
                        </Text>
                    ))}
                </View>
            </ScrollView>

            {/* Table Data */}
            <ScrollView horizontal>
                <FlatList
                    data={tableData}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <View style={{ flexDirection: "row", borderBottomWidth: 1, paddingVertical: 5 }}>
                            <Text style={{ width: 120, padding: 5, textAlign: "center" }}>{index + 1}</Text>
                            <Text style={{ width: 120, padding: 5, textAlign: "center" }}>{item.agentCode}</Text>
                            <Text style={{ width: 120, padding: 5, textAlign: "center" }}>{item.agentName}</Text>
                            <Text style={{ width: 120, padding: 5, textAlign: "center" }}>{item.market}</Text>
                            <Text style={{ width: 120, padding: 5, textAlign: "center" }}>{item.userIds}</Text>
                            <Text style={{ width: 120, padding: 5, textAlign: "center" }}>{item.verifiedBy}</Text>
                            <Text style={{ width: 120, padding: 5, textAlign: "center" }}>{item.verificationCount}</Text>
                            <Text style={{ width: 120, padding: 5, textAlign: "center" }}>{item.notVerifiedCount}</Text>
                            <Text style={{ width: 120, padding: 5, textAlign: "center" }}>{item.openMsg}</Text>
                            <Text style={{ width: 120, padding: 5, textAlign: "center" }}>{item.closeMsg}</Text>
                        </View>
                    )}
                />
            </ScrollView>
        </View>
    );
};


const styles = StyleSheet.create({





    container: {
        flex: 1,
        padding: 10,
        backgroundColor: globalColors.LightWhite
    },
    title:
    {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10
    },
    input: {
        backgroundColor: globalColors.inputbgColor,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: globalColors.borderColor,
    },
    dropdown: {
        borderWidth: 1,
        borderColor: globalColors.borderColor,
        backgroundColor: globalColors.inputbgColor,
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        marginBottom: 10,
    },
    formSection: {
        backgroundColor: globalColors.white,
        padding: 15,
        borderRadius: 10
    },
    datePicker: {
        borderWidth: 1,
        borderColor: globalColors.borderColor,
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    inputGroup: {
        marginBottom: 10,
        width: '48%'
    },
})

export default VerifyReport;
