import React, { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView } from "react-native";
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
import PanNumberScreen from "./PanNumberScreen";
import { addResult } from "../../Redux/Slices/panNumberSlice";

export default function ResultPage() {
    const dispatch = useDispatch();

    const [panNumber, setPanNumber] = useState("");
    const [number, setNumber] = useState("");
    const [agentId, setAgentId] = useState("");
    const [id, setId] = useState(0)
    const [market, setMarket] = useState(null);
    const [market2, setMarket2] = useState(null);

    const [date, setDate] = useState(new Date());
    const [agentCode, setAgentCode] = useState("");
    const [agentName, setAgentName] = useState("");
    const [selectedMarket, setSelectedMarket] = useState("");
    const [type, setType] = useState("open");
    const [tableData, setTableData] = useState([]);
    const [showPicker, setShowPicker] = useState(false);
    const [dataType, setDataType] = useState("beforeOpen");

    const { beforeOpenData, status, error } = useSelector((state) => state.beforeOpen);
    const { afterOpenData, status: afterOpenStatus } = useSelector((state) => state.afterOpen);
    const { agentInfo } = useSelector((state) => state.autoComplete)


    console.log("beforeOpenData=======>", beforeOpenData)
    console.log("afterOpenData=======>", afterOpenData)


    const markets = [
        { label: 'Kalyan', value: 'Kalyan' },
        { label: 'Mumbai', value: 'Mumbai' }
    ];

    const Type = [
        { label: 'open', value: 'open-pan' },
        { label: 'close', value: 'close-pan' }
    ];

    const formatDate = (date) => {
        return date.toISOString().split("T")[0];
    };

    const handleBeforeOpenClick = () => {
        const formattedDate = formatDate(date);
        dispatch(fetchBeforeOpenData({ market, id, filterDate: formattedDate }));
        setDataType("beforeOpen");
    };

    const handleAfterOpenClick = () => {
        console.log("handleAfterOpenClick")
        const formattedDate = formatDate(date);
        dispatch(fetchAfterOpenData({ market, id, filterDate: formattedDate }));
        setDataType("afterOpen");
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
        const formattedDate = format(date, 'yyyy-MM-dd');
        dispatch(addResult({
            pannumber: panNumber,
            number: number,
            market: market2,
            type: type,
            filterDate: formattedDate
        })).then(() => {
            setPanNumber("");
            setNumber("");
            setMarket2(null);
            setType("open-pan");
        });
    };

    // Render the numbers table (0-9 with values)
    const renderNumbersTable = (data) => (
        <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
                <Text style={styles.headerText}>BEFOR OPEN LOAD NUMBER</Text>
            </View>
            <Text style={styles.amountText}>AMOUNT: ₹{data?.total_play || 0}.00</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        {Array.from({ length: 10 }, (_, i) => (
                            <View key={i} style={styles.tableCell}>
                                <Text style={styles.cellHeader}>{i}</Text>
                                <Text style={styles.cellValue}>{data?.numbers?.[i] || 0}</Text>
                                <Text style={styles.cellBR}>{data?.br?.[i] || 0}.00</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );

    // Render the jodies table (grid of values)
    const renderJodiesTable = (data) => {
        // Create a structured grid for jodies
        const jodiesData = data?.jodies_data || {};
        const rows = 10;
        const cols = 10;

        return (
            <View style={styles.tableContainer}>
                <View style={styles.tableHeader}>
                    <Text style={styles.headerText}>BEFOR OPEN LOAD JODI</Text>
                </View>
                <Text style={styles.amountText}>AMOUNT: ₹{data?.jodi_total || 0}.00</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={true} // Ensure the scroll indicator is visible
                    contentContainerStyle={styles.scrollContentContainer} // Add this style for better scrolling
                >
                    <View style={styles.jodiesContainer}>
                        {Array.from({ length: rows }).map((_, row) => (
                            <View key={`row-${row}`} style={styles.jodiesRow}>
                                {Array.from({ length: cols }).map((_, col) => {
                                    const jodiNumber = `${row}${col}`;
                                    // Only render the cell if it exists in jodiesData
                                    if (jodiesData[jodiNumber] !== undefined) {
                                        return (
                                            <View key={`cell-${row}-${col}`} style={styles.jodiCell}>
                                                <Text style={styles.jodiNumber}>{jodiNumber}</Text>
                                                <Text style={styles.jodiValue}>{jodiesData[jodiNumber]}</Text>
                                            </View>
                                        );
                                    }
                                    // Return null for cells that are not in jodiesData
                                    return null;
                                })}
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        );

        // return (
        //     <View style={styles.tableContainer}>
        //         <View style={styles.tableHeader}>
        //             <Text style={styles.headerText}>BEFOR OPEN LOAD JODI</Text>
        //         </View>
        //         <Text style={styles.amountText}>AMOUNT: ₹{data?.jodi_total || 0}.00</Text>
        //         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        //             <View style={styles.jodiesContainer}>
        //                 {Array.from({ length: rows }).map((_, row) => (
        //                     <View key={`row-${row}`} style={styles.jodiesRow}>
        //                         {Array.from({ length: cols }).map((_, col) => {
        //                             const jodiNumber = `${row}${col}`;
        //                             return (
        //                                 <View key={`cell-${row}-${col}`} style={styles.jodiCell}>
        //                                     <Text style={styles.jodiNumber}>{jodiNumber}</Text>
        //                                     <Text style={styles.jodiValue}>{jodiesData[jodiNumber] || '-'}</Text>
        //                                 </View>
        //                             );
        //                         })}
        //                     </View>
        //                 ))}
        //             </View>
        //         </ScrollView>
        //     </View>
        // );
    };

    // Render the panna table (large grid with many values)
    const renderPannaTable = (data) => {
        const pannaData = data?.panarray || {};
        const pannaEntries = Object.entries(pannaData);
        const columns = 10;
        const rows = Math.ceil(pannaEntries.length / columns) || 20; // Ensure we have at least 20 rows for display

        return (
            <View style={styles.tableContainer}>
                <View style={styles.tableHeader}>
                    <Text style={styles.headerText}>BEFOR OPEN LOAD PAN</Text>
                </View>
                <Text style={styles.amountText}>AMOUNT: ₹{data?.pan_total || 0}.00</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.pannaTableContainer}>
                        <View style={styles.pannaHeaderRow}>
                            {Array.from({ length: columns }).map((_, i) => (
                                <View key={`header-${i}`} style={styles.pannaHeaderCell}>
                                    <Text style={styles.pannaHeaderText}>{i}</Text>
                                </View>
                            ))}
                        </View>
                        {Array.from({ length: rows }).map((_, rowIndex) => (
                            <View key={`row-${rowIndex}`} style={styles.pannaRow}>
                                {Array.from({ length: columns }).map((_, colIndex) => {
                                    const index = rowIndex * columns + colIndex;
                                    const [number, amount] = pannaEntries[index] || ['-', '-'];
                                    return (
                                        <View key={`cell-${rowIndex}-${colIndex}`} style={styles.pannaCell}>
                                            <Text style={styles.pannaNumber}>{number || '-'}</Text>
                                            <Text style={styles.pannaAmount}>{amount || '-'}</Text>
                                        </View>
                                    );
                                })}
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {/* Header Section */}
                    <View >
                        <Text style={styles.header}>Result Page</Text>
                    </View>
                    {/* {(beforeOpenData || afterOpenData) && (
                        <View style={styles.headerSection}>
                            <Text style={styles.headerTotal}>TOTAL PLAY: ₹{(beforeOpenData?.total_play || afterOpenData?.total_play || 0).toFixed(2)}</Text>
                            <Text style={styles.headerAmount}>AMOUNT: ₹{(beforeOpenData?.total_play || afterOpenData?.total_play || 0).toFixed(2)}</Text>
                        </View>
                    )} */}

                    {/* Form Sections */}
                    <View style={styles.formContainer}>
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
                                        maxLength={1}
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
                                        placeholder="Select Type"
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
                                        value={market2}
                                        onChange={item => setMarket2(item.value)}
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
                            <PanNumberScreen
                                date={date}
                                panNumber={panNumber}
                                number={number}
                                type={type}
                                market2={market2}
                            />
                            <Button
                                mode="contained"
                                style={styles.submitButton}
                                onPress={addEntry}>
                                Submit
                            </Button>
                        </View>

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

                            <View style={styles.buttonContainer}>
                                <Button
                                    mode="outlined"
                                    labelStyle={styles.labelStyle}
                                    style={styles.actionButton}
                                    onPress={handleBeforeOpenClick}
                                >
                                    Before Open
                                </Button>
                                <Button
                                    mode="outlined"
                                    labelStyle={styles.labelStyle}
                                    style={styles.actionButton}
                                    onPress={handleAfterOpenClick}
                                >
                                    After Open
                                </Button>
                                <TouchableOpacity style={styles.lockButton}>
                                    <Icon name="lock" size={24} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Loading and Error States */}
                    {(status === 'loading' || afterOpenStatus === 'loading') && <Text style={styles.statusText}>Loading...</Text>}
                    {(status === 'failed' || afterOpenStatus === 'failed') && <Text style={styles.errorText}>Error: {error}</Text>}

                    {/* Data Tables */}
                    {dataType === "beforeOpen" && beforeOpenData && (
                        <View style={styles.tablesContainer}>
                            {renderNumbersTable(beforeOpenData)}
                            {renderJodiesTable(beforeOpenData)}
                            {renderPannaTable(beforeOpenData)}
                        </View>
                    )}

                    {dataType === "afterOpen" && afterOpenData && (
                        <View style={styles.tablesContainer}>
                            {renderNumbersTable(afterOpenData)}
                            {renderJodiesTable(afterOpenData)}
                            {renderPannaTable(afterOpenData)}
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    scrollContentContainer: {
        flexGrow: 1, // Ensures the content can grow and scroll properly
    },
    header: {
        fontSize: 20,
        fontFamily: 'Poppins-Bold',
        color: '#1F2937',
        margin: 10
    },
    headerSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTotal: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    headerAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    formContainer: {
        padding: 10,
    },
    formSection: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    inputGroup: {
        width: '48%',
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
        marginBottom: 5,
        textTransform: 'uppercase',
    },
    input: {
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        padding: 10,
        fontSize: 14,
    },
    dropdown: {
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 4,
        marginBottom: 10,
    },
    datePicker: {
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 4,
        marginBottom: 15,
    },
    submitButton: {
        marginTop: 10,
        backgroundColor: '#2196F3',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    actionButton: {
        flex: 1,
        marginHorizontal: 5,
        borderColor: '#2196F3',
    },
    lockButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        width: 44,
    },
    labelStyle: {
        fontSize: 14,
        fontWeight: '500',
    },
    statusText: {
        textAlign: 'center',
        padding: 10,
        color: '#666',
    },
    errorText: {
        textAlign: 'center',
        padding: 10,
        color: 'red',
    },
    tablesContainer: {
        marginTop: 10,
    },
    tableContainer: {
        backgroundColor: '#fff',
        margin: 10,
        borderRadius: 8,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    tableHeader: {
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
    },
    amountText: {
        fontSize: 16,
        fontWeight: 'bold',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    table: {
        padding: 10,
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableCell: {
        width: 60,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
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
        fontSize: 12,
        color: '#999',
        marginTop: 2,
    },

    // Jodies Table Styles
    jodiesContainer: {
        padding: 5,
    },
    jodiesRow: {
        flexDirection: 'row',
    },
    jodiCell: {
        width: 60,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    jodiNumber: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
    },
    jodiValue: {
        fontSize: 10,
        color: '#666',
    },

    // Panna Table Styles
    pannaTableContainer: {
        padding: 5,
    },
    pannaHeaderRow: {
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
    },
    pannaHeaderCell: {
        width: 60,
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    pannaHeaderText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
    },
    pannaRow: {
        flexDirection: 'row',
    },
    pannaCell: {
        width: 60,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    pannaNumber: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
    },
    pannaAmount: {
        fontSize: 10,
        color: '#666',
    },
});