import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Platform, ScrollView, StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import { DataTable } from "react-native-paper";
import { globalColors } from "../../Theme/globalColors";

const WeeklyReport = () => {
    const [agentCode, setAgentCode] = useState("AG123");
    const [market, setMarket] = useState("Kalyan");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [tableData, setTableData] = useState([]);

    const marketOptions = [
        { label: "Kalyan", value: "Kalyan" },
        { label: "Mumbai", value: "Mumbai" },
        { label: "Delhi", value: "Delhi" },
    ];

    const fetchResults = () => {
        setTableData([
            { id: "1", agent: "John Doe", market: "Kalyan", kam: "0.00", win: "0.00", date: startDate.toLocaleDateString() },
            { id: "2", agent: "Jane Smith", market: "Mumbai", kam: "10.50", win: "5.20", date: endDate.toLocaleDateString() },
        ]);
    };

    return (
        <View style={{ padding: 20, backgroundColor: "#fff", flex: 1 }}>
            <Text style={{
                fontSize: 22,
                fontFamily: 'Poppins-Bold',
                marginBottom: 10
            }}>
                Report</Text>

            {/* Input Fields */}
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Agent Code</Text>
                    <TextInput
                        value={agentCode}
                        onChangeText={setAgentCode}
                        style={styles.input}
                        placeholder="Agent Code"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Market</Text>
                    <Dropdown
                        data={marketOptions}
                        labelField="label"
                        valueField="value"
                        value={market}
                        onChange={(item) => setMarket(item.value)}
                        style={styles.dropdown}

                    />
                </View>

                {/* Date Pickers */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Start Date</Text>
                    <TouchableOpacity
                        style={{
                            borderWidth: 1,
                            borderColor: "#ccc",
                            padding: 10,
                            fontFamily: 'Poppins-Bold',
                            borderRadius: 5,
                            marginBottom: 10,
                        }}
                        onPress={() => setShowStartDatePicker(true)}
                    >
                        <Text>{startDate.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                    {showStartDatePicker && (
                        <DateTimePicker
                            value={startDate}
                            mode="date"
                            display={Platform.OS === "ios" ? "spinner" : "default"}
                            onChange={(event, date) => {
                                setShowStartDatePicker(false);
                                if (date) setStartDate(date);
                            }}
                        />
                    )}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>End Date</Text>
                    <TouchableOpacity
                        style={{
                            borderWidth: 1,
                            borderColor: "#ccc",
                            padding: 10,
                            borderRadius: 5,
                            marginBottom: 10,
                        }}
                        onPress={() => setShowEndDatePicker(true)}
                    >
                        <Text>{endDate.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                    {showEndDatePicker && (
                        <DateTimePicker
                            value={endDate}
                            mode="date"
                            display={Platform.OS === "ios" ? "spinner" : "default"}
                            onChange={(event, date) => {
                                setShowEndDatePicker(false);
                                if (date) setEndDate(date);
                            }}
                        />
                    )}
                </View>
            </View>
            <TouchableOpacity
                style={{ backgroundColor: "#28a745", padding: 10, borderRadius: 5 }}
                onPress={fetchResults}
            >
                <Text style={{ color: "#fff", textAlign: "center" }}>Show Result</Text>
            </TouchableOpacity>
            {/* Buttons */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10, marginTop: 10 }}>
                <TouchableOpacity
                    style={{ backgroundColor: "#007bff", padding: 10, borderRadius: 5 }}
                    onPress={() => console.log("PDF Exported")}
                >
                    <Text style={{
                        color: "#fff", textAlign: "center", fontFamily: 'Poppins-Medium',
                    }}>PDF</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ backgroundColor: "#007bff", padding: 10, borderRadius: 5 }}
                    onPress={() => console.log("Excel Exported")}
                >
                    <Text style={{
                        color: "#fff", textAlign: "center", fontFamily: 'Poppins-Medium',

                    }}>Export to Excel</Text>
                </TouchableOpacity>


            </View>

            {/* Table with Horizontal Scrolling */}
            <ScrollView horizontal={true} style={{ marginTop: 10 }}>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title style={styles.dataTableTitle}>SR</DataTable.Title>
                        <DataTable.Title
                            style={styles.dataTableTitle}>Agent Name</DataTable.Title>
                        <DataTable.Title style={styles.dataTableTitle}>Market</DataTable.Title>
                        <DataTable.Title style={styles.dataTableTitle}>KAM</DataTable.Title>
                        <DataTable.Title style={styles.dataTableTitle}>Win</DataTable.Title>
                        <DataTable.Title style={styles.dataTableTitle}>Date</DataTable.Title>
                    </DataTable.Header>

                    {tableData.length === 0 ? (
                        <Text style={{
                            textAlign: "center", fontFamily: 'Poppins-Medium',
                            marginTop: 10
                        }}>No Data Available</Text>
                    ) : (
                        <FlatList
                            data={tableData}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item, index }) => (
                                <DataTable.Row>
                                    <DataTable.Cell style={{ width: 50 }}>{index + 1}</DataTable.Cell>
                                    <DataTable.Cell style={{ width: 120 }}>{item.agent}</DataTable.Cell>
                                    <DataTable.Cell style={{ width: 100 }}>{item.market}</DataTable.Cell>
                                    <DataTable.Cell style={{ width: 80 }}>{item.kam}</DataTable.Cell>
                                    <DataTable.Cell style={{ width: 80 }}>{item.win}</DataTable.Cell>
                                    <DataTable.Cell style={{ width: 120 }}>{item.date}</DataTable.Cell>
                                </DataTable.Row>
                            )}
                        />
                    )}
                </DataTable>
            </ScrollView>
        </View >
    );
};


const styles = StyleSheet.create({
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
    label: {
        fontSize: 14,
        fontFamily: 'Poppins-Bold',
        color: globalColors.inputLabel,
        textTransform: 'uppercase'
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        marginBottom: 10,
    },
    inputGroup: {
        marginBottom: 10,
        width: '48%'
    },
    dataTableTitle: {
        fontFamily: 'Poppins-Medium',
        width: 80,
        fontSize: 14
    }
})




export default WeeklyReport;
