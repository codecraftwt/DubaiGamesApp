import React, { useState } from "react";
import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { Button, Menu, Provider as PaperProvider } from "react-native-paper";
import { globalColors } from "../../Theme/globalColors";

const OldPaymentReport = () => {
    const [selectedAgent, setSelectedAgent] = useState("");
    const [menuVisible, setMenuVisible] = useState(false);

    const data = [
        {
            sr: 1,
            agentName: "John Doecccccccccccccccccccccc",
            agentCode: "A101",
            staffName: "Alice",
            balance: "$500",
        },
        {
            sr: 1,
            agentName: "John Doecccccccccccccccccccccc",
            agentCode: "A101",
            staffName: "Alice",
            balance: "$500",
        }, {
            sr: 1,
            agentName: "John Doecccccccccccccccccccccc",
            agentCode: "A101",
            staffName: "Alice",
            balance: "$500",
        }, {
            sr: 1,
            agentName: "John Doecccccccccccccccccccccc",
            agentCode: "A101",
            staffName: "Alice",
            balance: "$500",
        }, {
            sr: 1,
            agentName: "John Doecccccccccccccccccccccc",
            agentCode: "A101",
            staffName: "Alice",
            balance: "$500",
        }, {
            sr: 1,
            agentName: "John Doecccccccccccccccccccccc",
            agentCode: "A101",
            staffName: "Alice",
            balance: "$500",
        }, {
            sr: 1,
            agentName: "John Doecccccccccccccccccccccc",
            agentCode: "A101",
            staffName: "Alice",
            balance: "$500",
        }, {
            sr: 1,
            agentName: "John Doecccccccccccccccccccccc",
            agentCode: "A101",
            staffName: "Alice",
            balance: "$500",
        }, {
            sr: 1,
            agentName: "John Doecccccccccccccccccccccc",
            agentCode: "A101",
            staffName: "Alice",
            balance: "$500",
        }, {
            sr: 1,
            agentName: "John Doecccccccccccccccccccccc",
            agentCode: "A101",
            staffName: "Alice",
            balance: "$500",
        }, {
            sr: 1,
            agentName: "John Doecccccccccccccccccccccc",
            agentCode: "A101",
            staffName: "Alice",
            balance: "$500",
        }, {
            sr: 1,
            agentName: "John Doecccccccccccccccccccccc",
            agentCode: "A101",
            staffName: "Alice",
            balance: "$500",
        }, {
            sr: 1,
            agentName: "John Doecccccccccccccccccccccc",
            agentCode: "A101",
            staffName: "Alice",
            balance: "$500",
        }, {
            sr: 1,
            agentName: "John Doecccccccccccccccccccccc",
            agentCode: "A101",
            staffName: "Alice",
            balance: "$500",
        }, {
            sr: 1,
            agentName: "John Doecccccccccccccccccccccc",
            agentCode: "A101",
            staffName: "Alice",
            balance: "$500",
        }, {
            sr: 1,
            agentName: "John Doecccccccccccccccccccccc",
            agentCode: "A101",
            staffName: "Alice",
            balance: "$500",
        }, {
            sr: 1,
            agentName: "John Doecccccccccccccccccccccc",
            agentCode: "A101",
            staffName: "Alice",
            balance: "$500",
        }, {
            sr: 1,
            agentName: "John Doecccccccccccccccccccccc",
            agentCode: "A101",
            staffName: "Alice",
            balance: "$500",
        }, {
            sr: 1,
            agentName: "John Doecccccccccccccccccccccc",
            agentCode: "A101",
            staffName: "Alice",
            balance: "$500",
        }, {
            sr: 1,
            agentName: "John Doecccccccccccccccccccccc",
            agentCode: "A101",
            staffName: "Alice",
            balance: "$500",
        }, {
            sr: 1,
            agentName: "John Doecccccccccccccccccccccc",
            agentCode: "A101",
            staffName: "Alice",
            balance: "$500",
        },
        { sr: 2, agentName: "Jane Smith", agentCode: "A102", staffName: "Bob", balance: "$300" },
    ];

    return (
        <PaperProvider>
            <View style={styles.container}>
                <Text style={styles.title}>Payment Report</Text>

                {/* Agent Code Selection */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>AGENT CODE</Text>
                    <Menu
                        visible={menuVisible}
                        onDismiss={() => setMenuVisible(false)}
                        anchor={
                            <TouchableOpacity
                                style={styles.dropdown}
                                onPress={() => setMenuVisible(true)}
                            >
                                <Text>{selectedAgent || "Select Agent Code"}</Text>
                            </TouchableOpacity>
                        }
                    >
                        <Menu.Item onPress={() => setSelectedAgent("Agent 1")} title="Agent 1" />
                        <Menu.Item onPress={() => setSelectedAgent("Agent 2")} title="Agent 2" />
                    </Menu>
                </View>

                {/* Scrollable Table */}
                <ScrollView horizontal>
                    <View>
                        {/* Table Header */}
                        <View style={[styles.row, styles.header]}>
                            <Text style={[styles.cell, styles.headerText, { width: 50 }]}>SR</Text>
                            <Text style={[styles.cell, styles.headerText, { width: 200 }]}>Agent Name</Text>
                            <Text style={[styles.cell, styles.headerText, { width: 100 }]}>Agent Code</Text>
                            <Text style={[styles.cell, styles.headerText, { width: 150 }]}>Staff Name</Text>
                            <Text style={[styles.cell, styles.headerText, { width: 120 }]}>Balance</Text>
                        </View>

                        {/* Scrollable Content */}
                        <ScrollView style={{ maxHeight: 400 }}>
                            {data.map((item, index) => (
                                <View key={index} style={styles.row}>
                                    <Text style={[styles.cell, { width: 50 }]}>{item.sr}</Text>
                                    <Text style={[styles.cell, { width: 200 }]} numberOfLines={1} ellipsizeMode="tail">
                                        {item.agentName}
                                    </Text>
                                    <Text style={[styles.cell, { width: 100 }]}>{item.agentCode}</Text>
                                    <Text style={[styles.cell, { width: 150 }]}>{item.staffName}</Text>
                                    <Text style={[styles.cell, { width: 120 }]}>{item.balance}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </ScrollView>


                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    <Button mode="contained" labelStyle={styles.labelStyle} style={styles.button} onPress={() => console.log("Export Excel")}>
                        Excel
                    </Button>
                    <Button mode="contained" labelStyle={styles.labelStyle} style={styles.button} onPress={() => console.log("Export PDF")}>
                        PDF
                    </Button>
                    <Button mode="contained" buttonColor="red" labelStyle={styles.labelStyle} onPress={() => console.log("Refresh")}>
                        Refresh
                    </Button>
                </View>
            </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontFamily: 'Poppins-Bold',
        color: globalColors.inputLabel,
        textTransform: 'uppercase'
    },
    dropdown: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        fontFamily: 'Poppins-Bold',
        borderColor: "#ccc",
    },
    tableContainer: {
        marginBottom: 20,
    },
    row: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    header: {
        backgroundColor: "#ddd",
        fontWeight: "700",
        paddingVertical: 8,
    },
    headerText: {
        fontFamily: 'Poppins-Bold',
        textAlign: "center",
    },
    cell: {
        padding: 10,
        textAlign: "center",
        fontFamily: 'Poppins-Medium',
        color: globalColors.black,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    button: {
        flex: 1,
        marginHorizontal: 5,
    },
    labelStyle: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16
    }
});

export default OldPaymentReport;
