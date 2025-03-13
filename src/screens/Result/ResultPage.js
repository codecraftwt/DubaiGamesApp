import React, { useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Button } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Dropdown } from "react-native-element-dropdown";
import { format } from "date-fns";
import { globalColors } from "../../Theme/globalColors";

export default function ResultPage() {
    const [panNumber, setPanNumber] = useState("");
    const [number, setNumber] = useState("");
    const [market, setMarket] = useState(null);
    const [date, setDate] = useState(new Date());
    const [agentCode, setAgentCode] = useState("");
    const [agentName, setAgentName] = useState("");
    const [selectedMarket, setSelectedMarket] = useState("");
    const [type, setType] = useState("open");
    const [tableData, setTableData] = useState([]);
    const [showPicker, setShowPicker] = useState(false);

    const markets = [
        { label: 'Market 1', value: 'market1' },
        { label: 'Market 2', value: 'market2' },
        { label: 'Market 3', value: 'market3' }
    ];

    const Type = [
        { label: 'Type 1', value: 'Type 1' },
        { label: 'Type 2', value: 'Type 2' }

    ]

    const addEntry = () => {
        if (panNumber && number && market) {
            setTableData([...tableData, { panNumber, number, market, agentCode, agentName, type, selectedMarket }]);
            setPanNumber("");
            setNumber("");
            setMarket("");
            setAgentCode("");
            setAgentName("");
            setSelectedMarket("");
            setType("open");
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.container}>
                    <Text style={styles.title}>RESULT PAGE</Text>

                    <View style={styles.formSection}>
                        <View style={styles.row}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>PAN NUMBER</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="PAN NUMBER (3 digits)"
                                    keyboardType="numeric"
                                    maxLength={3}
                                    value={panNumber}
                                    onChangeText={setPanNumber}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>NUMBER</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="NUMBER"
                                    keyboardType="numeric"
                                    value={number}
                                    onChangeText={setNumber}
                                />
                            </View>

                        </View>

                        <View style={styles.row}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>TYPE</Text>
                                <Dropdown
                                    data={Type}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select Market"
                                    value={type}
                                    onChange={item => setType(item.value)}
                                    style={styles.dropdown}
                                />
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>MARKET</Text>
                                <Dropdown
                                    data={markets}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select Market"
                                    value={market}
                                    onChange={item => setMarket(item.value)}
                                    style={styles.dropdown}
                                />
                            </View>

                        </View>


                        <Text style={styles.label}>DATE</Text>
                        <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.datePicker}>
                            <Text>{format(date, 'dd-MM-yyyy')}</Text>
                        </TouchableOpacity>

                        {showPicker && (
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display="default"
                                onChange={(event, selectedDate) => {
                                    setShowPicker(false);
                                    if (selectedDate) {
                                        setDate(selectedDate);
                                    }
                                }}
                            />
                        )}

                        <Button
                            mode="contained"
                            onPress={addEntry}>Submit
                        </Button>


                    </View>
                </View >
                <View style={styles.container}>
                    <View style={styles.formSection}>

                        <View style={styles.row}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Agent Code</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Agent Code"
                                    value={agentCode}
                                    onChangeText={setAgentCode}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Agent Name</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Agent Name"
                                    value={agentName}
                                    onChangeText={setAgentName}
                                />
                            </View>

                        </View>

                        <Text style={styles.label}>MARKET</Text>
                        <Dropdown
                            data={markets}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Market"
                            value={market}
                            onChange={item => setMarket(item.value)}
                            style={styles.dropdown}
                        />

                        <Button
                            mode="contained"
                            onPress={addEntry}>
                            Submit
                        </Button>
                        <View style={styles.buttonContainer}>

                            <Button mode="outlined">Before Open</Button>
                            <Button mode="outlined">After Open</Button>
                            <TouchableOpacity style={styles.lockButton}>
                                <Icon name="lock" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}

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
    formSection: {
        backgroundColor: globalColors.white,
        padding: 15,
        borderRadius: 10
    },
    input: {
        backgroundColor: globalColors.inputbgColor,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: globalColors.borderColor,
    },

    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10
    },
    lockButton: {
        backgroundColor: "red",
        padding: 10,
        borderRadius: 5
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: globalColors.inputLabel,
        marginBottom: 6,
        textTransform: 'uppercase'
    },
    dropdown: {
        borderWidth: 1,
        borderColor: globalColors.borderColor,
        backgroundColor: globalColors.inputbgColor,
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    datePicker: {
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
    inputGroup: {
        marginBottom: 10,
        width: '48%'
    },
});
