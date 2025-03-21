import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Button } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Dropdown } from "react-native-element-dropdown";
import { format } from "date-fns";
import { globalColors } from "../../Theme/globalColors";
import { fetchBeforeOpenData } from "../../Redux/Slices/beforeOpenSlice";
import { fetchAfterOpenData } from "../../Redux/Slices/afterOpenSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchAgentByCode, fetchAgentByName } from "../../Redux/Slices/autoCompleteSlice";
import DynamicDropdown from "../DynamicDropdown";

export default function ResultPage() {
    const dispatch = useDispatch();

    const [panNumber, setPanNumber] = useState("");
    const [number, setNumber] = useState("");
    const [agentId, setAgentId] = useState("");
    const [id, setId] = useState(0)
    const [market, setMarket] = useState(null);
    const [date, setDate] = useState(new Date());
    const [agentCode, setAgentCode] = useState("");
    const [agentName, setAgentName] = useState("");
    const [selectedMarket, setSelectedMarket] = useState("");
    const [type, setType] = useState("open");
    const [tableData, setTableData] = useState([]);
    const [showPicker, setShowPicker] = useState(false);
    const { beforeOpenData, status, error } = useSelector((state) => state.beforeOpen);
    const { afterOpenData, status: afterOpenStatus } = useSelector((state) => state.afterOpen);
    const { agentInfo } = useSelector((state) => state.autoComplete)

    const markets = [
        { label: 'Kalyan', value: 'Kalyan' },
        { label: 'Mumbai', value: 'Mumbai' }
    ];


    const Type = [
        { label: 'Type 1', value: 'Type 1' },
        { label: 'Type 2', value: 'Type 2' }

    ]
    const formatDate = (date) => {
        return date.toISOString().split("T")[0];
    };

    const handleBeforeOpenClick = () => {
        const formattedDate = formatDate(date);
        dispatch(fetchBeforeOpenData({ market, agentId, filterDate: formattedDate }));
    };

    const handleAfterOpenClick = () => {
        const formattedDate = formatDate(date);
        dispatch(fetchAfterOpenData({ market, agentId, filterDate: formattedDate }));
    };

    const handleSelectByCode = (code) => {
        dispatch(fetchAgentByCode(code));
    };

    const handleSelectByName = (name) => {
        dispatch(fetchAgentByName(name));
    };

    useEffect(() => {
        if (agentInfo) {
            setAgentName(agentInfo.name);
            setAgentId(agentInfo.agentcode);
            setId(agentInfo.id);
        }
    }, [agentInfo]);

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


    const renderNumbersTable = (data) => (
        <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
                <Text style={styles.headerText}>BEFOR OPEN LOAD NUMBER</Text>
            </View>
            <Text style={styles.amountText}>AMOUNT: ₹{data?.total_play}.00</Text>
            <View style={styles.table}>
                <View style={styles.tableRow}>
                    {data?.counter.map((num) => (
                        <View key={num} style={styles.tableCell}>
                            <Text style={styles.cellHeader}>{num}</Text>
                            <Text style={styles.cellValue}>{data.numbers[num] || 0}</Text>
                            <Text style={styles.cellBR}>{data.br[num] || 0}.00</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );

    const renderJodiesTable = (data) => (
        <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
                <Text style={styles.headerText}>BEFOR OPEN LOAD JODI</Text>
            </View>
            <Text style={styles.amountText}>AMOUNT: ₹270.00</Text>
            <View style={styles.jodiesGrid}>
                {Object?.entries(data?.jodies_data)?.map(([key, value]) => (
                    <View key={key} style={styles.jodiCell}>
                        <Text style={styles.jodiNumber}>{key}</Text>
                        <Text style={styles.jodiValue}>{value}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
    const renderPannaTable = (data) => {
        const pannaEntries = Object.entries(data.panarray);
        const columns = 10;
        const rows = Math.ceil(pannaEntries.length / columns);

        return (
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>BEFOR OPEN LOAD PAN</Text>
                    <Text style={styles.amount}>AMOUNT: ₹0.00</Text>
                </View>
                <ScrollView horizontal>
                    <View>
                        <View style={styles.pannaHeader}>
                            {Array.from({ length: columns }, (_, i) => (
                                <View key={i} style={styles.pannaHeaderCell}>
                                    <Text style={styles.headerText}>{i}</Text>
                                    <Text style={styles.headerText}>₹</Text>
                                </View>
                            ))}
                        </View>
                        {Array.from({ length: rows }).map((_, rowIndex) => (
                            <View key={rowIndex} style={styles.pannaRow}>
                                {pannaEntries
                                    .slice(rowIndex * columns, (rowIndex + 1) * columns)
                                    .map(([number, amount], colIndex) => (
                                        <View key={`${rowIndex}-${colIndex}`} style={styles.pannaCell}>
                                            <Text style={styles.pannaNumber}>{number}</Text>
                                            <Text style={styles.pannaAmount}>{amount}</Text>
                                        </View>
                                    ))}
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.container}>
                    <Text style={styles.title}>Result Page</Text>

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
                            style={styles.label}
                            onPress={addEntry}>Submit
                        </Button>


                    </View>
                </View >
                <View style={styles.container}>
                    <View style={styles.formSection}>

                        <View style={styles.row}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Agent Code</Text>
                                <DynamicDropdown
                                    onSelect={handleSelectByCode}
                                    placeholder="Agent Code"
                                    searchType="code"
                                    value={agentId}
                                    setAgentId={setAgentId}

                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Agent Name</Text>
                                <DynamicDropdown
                                    onSelect={handleSelectByName}
                                    placeholder="Agent Name"
                                    searchType="name"
                                    value={agentName}
                                />
                            </View>

                        </View>

                        <Text style={styles.label}>MARKETss</Text>
                        <Dropdown
                            data={markets}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Market"
                            value={market}
                            onChange={item => setMarket(item.value)}
                            style={styles.dropdown}
                        />


                        <View style={styles.buttonContainer}>

                            <Button mode="outlined"
                                labelStyle={styles.labelStyle}
                                onPress={handleBeforeOpenClick}
                            >Before Open
                            </Button>
                            <Button mode="outlined"
                                labelStyle={styles.labelStyle}
                                onPress={handleAfterOpenClick}
                            >After Open
                            </Button>
                            <TouchableOpacity style={styles.lockButton}>
                                <Icon name="lock" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>


                {status === 'loading' && <Text>Loading...</Text>}
                {status === 'failed' && <Text style={styles.errorText}>Error: {error}</Text>}

                {beforeOpenData && (
                    <>
                        <View style={styles.header}>
                            <Text style={styles.headerTotal}>TOTAL PLAY: ₹{beforeOpenData?.total_play?.toFixed(2)}</Text>
                            <Text style={styles.headerAmount}>AMOUNT: ₹{beforeOpenData?.total_play?.toFixed(2)}</Text>
                        </View>
                        {renderNumbersTable(beforeOpenData)}
                        {renderJodiesTable(beforeOpenData)}
                        {renderPannaTable(beforeOpenData)}
                    </>
                )}

                {afterOpenData && (
                    <>
                        <View style={styles.header}>
                            <Text style={styles.headerTotal}>TOTAL PLAY: ₹{afterOpenData?.total_play?.toFixed(2)}</Text>
                            <Text style={styles.headerAmount}>AMOUNT: ₹{afterOpenData?.total_play?.toFixed(2)}</Text>
                        </View>
                        {renderNumbersTable(afterOpenData)}
                        {renderJodiesTable(afterOpenData)}
                        {renderPannaTable(afterOpenData)}
                    </>
                )}
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
        fontFamily: 'Poppins-Bold',
        marginBottom: 8
    },
    formSection: {
        // backgroundColor: globalColors.white,
        padding: 10,
        borderRadius: 10
    },
    input: {
        backgroundColor: globalColors.inputbgColor,
        borderRadius: 8,
        fontFamily: 'Poppins-Medium',
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
        fontFamily: 'Poppins-Bold',
        color: globalColors.inputLabel,
        marginBottom: 6,
        textTransform: 'uppercase'
    },
    dropdown: {
        borderWidth: 1,
        borderColor: globalColors.borderColor,
        backgroundColor: globalColors.inputbgColor,
        padding: 12,
        color: globalColors.inputLabel,
        fontFamily: 'Poppins-Medium',
        borderRadius: 8,
        marginBottom: 10,
    },
    datePicker: {
        borderWidth: 1,
        borderColor: globalColors.borderColor,
        backgroundColor: globalColors.inputbgColor,
        padding: 12,
        fontFamily: 'Poppins-Medium',
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
    labelStyle: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16
    },





    section: {
        backgroundColor: '#fff',
        marginTop: 16,
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionHeader: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 4,
    },
    amount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingBottom: 8,
    },
    tableHeaderCell: {
        flex: 1,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
    },
    table: {
        padding: 8,
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    tableCell: {
        width: '10%',
        padding: 8,
        alignItems: 'center',
    },
    cellText: {
        fontSize: 16,
        color: '#333',
    },
    cellTextSmall: {
        fontSize: 12,
        color: '#666',
    },
    jodiContainer: {
        marginTop: 8,
    },
    jodiRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    jodiCell: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#f8f8f8',
        borderRadius: 4,
        marginHorizontal: 4,
    },
    jodiNumber: {
        fontSize: 14,
        color: '#333',
    },
    jodiAmount: {
        fontSize: 14,
        color: '#0066cc',
        fontWeight: 'bold',
    },
    pannaHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingBottom: 8,
    },
    pannaHeaderCell: {
        width: 80,
        alignItems: 'center',
    },
    pannaRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    pannaCell: {
        width: 80,
        paddingVertical: 8,
        alignItems: 'center',
    },
    pannaNumber: {
        fontSize: 14,
        color: '#333',
        marginBottom: 2,
    },
    pannaAmount: {
        fontSize: 12,
        color: '#666',
    },




    tableContainer: {
        backgroundColor: '#fff',
        margin: 16,
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 2,
    },
    cellHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    cellValue: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    cellBR: {
        fontSize: 14,
        color: '#999',
        marginTop: 2,
    },
});
