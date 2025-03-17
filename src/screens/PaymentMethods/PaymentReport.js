import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    ScrollView,
    StyleSheet,
    TextInput,
} from "react-native";
import { globalColors } from "../../Theme/globalColors";
import { Button } from "react-native-paper";

const PaymentReport = () => {
    const [selectedAgent, setSelectedAgent] = useState("");
    const [data, setData] = useState([]);

    const agentCodes = ["Agent 001", "Agent 002", "Agent 003"];

    const handleRefresh = () => {
        console.log("Refreshing Data...");
        setData([]);
    };

    const handleExport = (type) => {
        console.log(`Exporting as ${type}`);
    };

    const renderItem = ({ item, index }) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{index + 1}</Text>
            <Text style={styles.cell}>{item.agentName}</Text>
            <Text style={styles.cell}>{item.agentCode}</Text>
            <Text style={styles.cell}>{item.staffName}</Text>
            <Text style={styles.cell}>{item.balance}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Payment Report</Text>

            {/* Agent Code Selection */}
            <Text style={styles.label}>AGENT CODE</Text>
            <TextInput
                style={styles.input}
                placeholder="Select Agent Code"
                value={selectedAgent}
                onFocus={() => setSelectedAgent(agentCodes[0])} // Temporary example
            />

            {/* Refresh Button */}
            {/* <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
                <Text style={styles.refreshText}>Refresh</Text>
            </TouchableOpacity> */}

            {/* Export Buttons */}
            <View style={styles.exportContainer}>
                <Button mode="contained" labelStyle={styles.labelStyle}
                    style={styles.button} onPress={() => console.log("Export Excel")}>
                    Excel
                </Button>
                <Button mode="contained" labelStyle={styles.labelStyle}
                    style={styles.button} onPress={() => console.log("Export PDF")}>
                    PDF
                </Button>
                <Button mode="contained" buttonColor="red" labelStyle={styles.labelStyle} onPress={() => console.log("Refresh")}>
                    Refresh
                </Button>
            </View>

            {/* Table */}
            <ScrollView horizontal style={styles.tableContainer}>
                <View>
                    {/* Table Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerCell}>SR</Text>
                        <Text style={styles.headerCell}>AGENT NAME</Text>
                        <Text style={styles.headerCell}>AGENT CODE</Text>
                        <Text style={styles.headerCell}>STAFF NAME</Text>
                        <Text style={styles.headerCell}>BALANCE</Text>
                    </View>

                    {/* Table Rows */}
                    <FlatList
                        data={data}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItem}
                        ListEmptyComponent={
                            <View style={styles.emptyRow}>
                                <Text style={styles.emptyText}>NO DATA AVAILABLE IN TABLE</Text>
                            </View>
                        }
                    />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 22,
        fontFamily: 'Poppins-Bold',
        marginBottom: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Poppins-Bold',
        color: globalColors.inputLabel,
        textTransform: 'uppercase'
    },
    input: {
        height: 40,
        borderWidth: 1,
        fontFamily: 'Poppins-Medium',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    refreshButton: {
        backgroundColor: "#d9534f",
        padding: 10,
        borderRadius: 5,
        alignSelf: "flex-start",
    },

    labelStyle: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16
    },
    exportContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 10,
    },
    exportButton: {
        backgroundColor: "#000",
        padding: 8,
        marginHorizontal: 5,
        borderRadius: 5,
    },
    exportText: {
        color: "#fff",
        fontWeight: "bold",
    },
    tableContainer: {
        marginTop: 10,
    },
    header: {
        flexDirection: "row",
        backgroundColor: "#f0f0f0",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    headerCell: {
        width: 120,
        fontFamily: 'Poppins-Bold',
        textAlign: "center",
        color: globalColors.black
    },
    row: {
        flexDirection: "row",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    cell: {
        width: 120,
        textAlign: "center",
    },
    emptyRow: {
        padding: 20,
        alignItems: "center",
    },
    emptyText: {
        fontStyle: "italic",
        color: "#999",
    },
});

export default PaymentReport;
