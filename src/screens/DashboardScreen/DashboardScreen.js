
import React, { useCallback, useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    FlatList,
    Dimensions,
    SectionList,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Header from "../../components/Header/Header";
import { globalColors } from "../../Theme/globalColors";
import { format } from "date-fns";
import DateTimePicker from "@react-native-community/datetimepicker";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import axios from "axios";
import DynamicDropdown from "../DynamicDropdown";
import { Dropdown } from "react-native-element-dropdown";
import { fetchMarketData } from "../../Redux/Slices/marketSlice";
import { useDispatch, useSelector } from "react-redux";


const DashboardScreen = ({ navigation }) => {
    const [agentId, setAgentId] = useState("");
    const [agentName, setAgentName] = useState("");
    const [market, setMarket] = useState("Kalyan");
    const [date, setDate] = useState(new Date());
    const [number, setNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("JODI");
    const [anotherNumber, setAnotherNumber] = useState("");
    const [saralPanNumber, setSaralPanNumber] = useState("");
    const [saralPanAmount, setSaralPanAmount] = useState("");
    const [saralPanData, setSaralPanData] = useState([]);
    const [saralPanGunule, setsaralPanGunule] = useState([]);
    const [saralPanGunuleAmount, setsaralPanGunuleAmount] = useState([]);
    const [showPicker, setShowPicker] = useState(false);

    const [agentList, setAgentList] = useState([]);
    const [loading, setLoading] = useState(false);

    const [openDropdown, setOpenDropdown] = useState(false); // To toggle dropdown visibility
    const [submittedData, setSubmittedData] = useState(data);
    const [response, setResponse] = useState([])

    const dispatch = useDispatch();

    const { data, status } = useSelector((state) => state.market);
    console.log("market data 11------->", data)

    // useEffect(() => {
    //     dispatch(fetchMarketData({ agent_id: 1, market: 'Kalyan', date: '2025-03-14' }));
    // }, [dispatch]);

    // setResponse(data)

    const formatDate = (date) => {
        return date.toISOString().split("T")[0]; // Extracts YYYY-MM-DD
    };
    const categories = [
        "OPEN",
        "JODI",
        "CHOKADA",
        "CYCLE",
        "CUT",
        "RUNNING PAN",
        "SARALPAN",
        "ULTA PAN",
        "BERIZ",
        "FARAK",
        "OPEN PAN",
        "CLOSE PAN",
        "CLOSE",
    ];

    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [error, setError] = useState(null);
    const [id, setId] = useState('')

    const handleSelect = async (value) => {
        setLoading(true);
        try {
            const response = await axios.get(`https://staging.rdnidhi.com/agent/getByCode/${value}`);
            const { name, agentcode } = response.data;
            console.log("handleSelect   api Printinted", response.data)
            setAgentName(name); // Set name field
            setAgentId(agentcode); // Set agentID field
            setId(id)
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false); // Set loading to false when API request finishes
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("date ==========", formatDate(date))
                const dateFormated = formatDate(date)

                const response = await dispatch(fetchMarketData({ agent_id: 1, market: market, date: dateFormated }));
                setResponse(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [date, agentId, market]);

    const handleSubmit = async () => {
        // navigation.navigate("AgentList");
        try {
            console.log("date ==========", formatDate(date))
            const dateFormated = formatDate(date)
            await dispatch(fetchMarketData({ agent_id: 1, market: market, date: dateFormated }));

            console.log("market data 22------->", data)

        } catch (error) {
            console.error("Error fetching market data:", error);
        }

        console.log({
            agentId,
            agentName,
            market,
            date,
            openMsg,
            closeMsg,
            selectedCategory,
            amount,
            anotherNumber,
            number,
        });
        const newEntry = {
            id: agentId,
            category: selectedCategory,
            number: number,
            amount: amount
        };

        setSubmittedData([...submittedData, newEntry]);
        // setAgentId(agentId + 1); // Increment ID for uniqueness
        // setNumber(""); // Clear inputs
        // setAmount("");



    };

    const handleAddSaralPan = () => {
        if (saralPanNumber && saralPanAmount) {
            const newSaralPan = {
                number: saralPanNumber,
                amount: saralPanAmount,
            };
            setSaralPanData([...saralPanData, newSaralPan]);
            setSaralPanNumber("");  // Reset inputs after adding
            setSaralPanAmount("");
        }
    };
    const handleClear = () => {
        navigation.navigate("StaffList")
    }

    const groupedData = Object.values(data?.reversedGroupedEntries || {}).reduce((acc, group) => {
        Object.values(group).forEach((item) => {
            if (item.msg_no) {
                if (!acc[item.msg_no]) {
                    acc[item.msg_no] = [];
                }
                acc[item.msg_no].push(item);
            }
        });
        return acc;
    }, {});

    // Convert grouped data into sections for SectionList
    const sections = Object.keys(groupedData).map((msg_no) => ({
        title: `OPEN MSG - ${msg_no}`,
        data: groupedData[msg_no],
    }));


    return (
        <ScrollView style={styles.container}>
            <Text style={styles.sectionTitle}>Agent Details</Text>
            <View style={styles.formContainer}>


                <View style={styles.row}>
                    <View style={styles.halfWidthInput}>
                        <Text style={styles.label}>AGENT ID</Text>
                        <DynamicDropdown
                            onSelect={handleSelect}
                            placeholder="Agent Code"
                        />
                    </View>
                    <View style={styles.halfWidthInput}>
                        <Text style={styles.label}>AGENT NAME</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Agent Name"
                            value={agentName}
                            onChangeText={setAgentName}
                        />
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.halfWidthInput}>
                        <Text style={styles.label}>MARKET</Text>
                        {/* <TextInput
                            style={styles.input}
                            placeholder="Enter Market Name"
                            value={market}
                            onChangeText={setMarket}
                        /> */}
                        <Dropdown
                            data={[
                                { label: 'Kalyan', value: 'Kalyan' },
                                { label: 'Mumbai', value: 'Mumbai' }
                            ]}
                            value={market} labelField="label"
                            valueField="value"
                            style={styles.dropdown}
                            onChange={item => setMarket(item.value)}
                        />
                    </View>
                    <View style={styles.halfWidthInput}>
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
                                        console.log("Selected Date:", formatDate(selectedDate));

                                    }
                                }}
                            />
                        )}
                    </View>
                </View>
                <Text style={styles.sectionTitle}>Select Category</Text>
                <FlatList
                    data={categories}
                    numColumns={3}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.radioButton,
                                selectedCategory === item && styles.selectedRadioButton,
                            ]}
                            onPress={() => setSelectedCategory(item)}
                        >
                            <Text
                                style={[
                                    styles.radioText,
                                    selectedCategory === item && styles.selectedRadioText,
                                ]}
                            >
                                {item}
                            </Text>
                        </TouchableOpacity>
                    )}
                />

                {/* Action Buttons */}
                <View style={styles.buttonGroup}>
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>SUBMIT</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteAllButton} onPress={handleClear}>
                        <Icon name="trash" size={16} color="white" />
                        <Text style={styles.deleteAllButtonText}>CLEAR</Text>
                    </TouchableOpacity>
                </View>
                {(selectedCategory === "CYCLE" || selectedCategory === "RUNNING PAN") && (
                    <>
                        <View style={styles.row}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>ENTER NUMBER</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Number"
                                    value={number}
                                    keyboardType="numeric"
                                    onChangeText={setNumber} />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>ANOTHER NUMBER</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Another No"
                                    value={anotherNumber}
                                    keyboardType="numeric"
                                    onChangeText={setAnotherNumber} />
                            </View>
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>ENTER AMOUNT</Text>
                            <TextInput style={styles.input} placeholder="Enter Amount" keyboardType="numeric"
                                value={amount} onChangeText={setAmount} />
                        </View>
                    </>
                )}

                {selectedCategory === "CUT" && (
                    <>
                        <View style={styles.row}>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>ENTER NUMBER</Text>
                                <TextInput style={styles.input} placeholder="Enter Number" keyboardType="numeric"
                                    value={number} onChangeText={setNumber} />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>ENTER AMOUNT</Text>
                                <TextInput style={styles.input} placeholder="Enter Amount" keyboardType="numeric"
                                    value={amount} onChangeText={setAmount} />
                            </View>
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>ENTER ANOTHER NUMBER</Text>
                            <TextInput style={styles.input} placeholder="Enter Another No" keyboardType="numeric"
                                value={anotherNumber} onChangeText={setAnotherNumber} />
                        </View>
                    </>
                )}

                {selectedCategory !== "CYCLE" && selectedCategory !== "RUNNING PAN" && selectedCategory !== "CUT" && selectedCategory !== "SARALPAN" && selectedCategory !== "ULTA PAN" && (
                    <>
                        <View style={styles.row}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>ENTER NUMBER</Text>
                                <TextInput style={styles.input} keyboardType="numeric"
                                    placeholder="Enter Number" value={number} onChangeText={setNumber} />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>ENTER AMOUNT</Text>
                                <TextInput style={styles.input} keyboardType="numeric"
                                    placeholder="Enter Amount" value={amount} onChangeText={setAmount} />
                            </View>
                        </View>

                    </>
                )}

                {selectedCategory === "SARALPAN" && (
                    <View>
                        <View style={styles.row}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>SARALPAN NUMBER</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Saral-Pan No"
                                    value={saralPanNumber}
                                    onChangeText={setSaralPanNumber}
                                    keyboardType="numeric"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>AMOUNT</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Amount"
                                    value={saralPanAmount}
                                    onChangeText={setSaralPanAmount}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>GUNULE</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Gunule"
                                    value={saralPanGunule}
                                    onChangeText={setsaralPanGunule}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>AMOUNT</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Amount"
                                    value={saralPanGunuleAmount}
                                    onChangeText={setsaralPanGunuleAmount}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>


                        <TouchableOpacity style={styles.addButton} onPress={handleAddSaralPan}>
                            <Text style={styles.addButtonText}>Add Saral-Pan</Text>
                        </TouchableOpacity>

                        {/* Display Saral-Pan Table */}
                        <View style={styles.table}>
                            <Text style={styles.tableHeader}>Saral-Pan</Text>
                            {saralPanData.map((item, index) => (
                                <View key={index} style={styles.tableRow}>
                                    <Text style={styles.tableCell}>{item.number}</Text>
                                    <Text style={styles.tableCell}>{item.amount}</Text>
                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => {
                                            const updatedData = saralPanData.filter((_, i) => i !== index);
                                            setSaralPanData(updatedData);
                                        }}
                                    >
                                        <Icon name="trash" size={18} color="red" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </View>
                )}


                {selectedCategory === "ULTA PAN" && (
                    <View>

                        <View style={styles.row}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>GUNULE</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Gunule"
                                    value={saralPanGunule}
                                    onChangeText={setsaralPanGunule}
                                    keyboardType="numeric"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>AMOUNT</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Amount"
                                    value={saralPanGunuleAmount}
                                    onChangeText={setsaralPanGunuleAmount}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>


                        <View style={styles.row}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>ULTA PAN NUMBER</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Saral-Pan No"
                                    value={saralPanNumber}
                                    onChangeText={setSaralPanNumber}
                                    keyboardType="numeric"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>AMOUNT</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Amount"
                                    value={saralPanAmount}
                                    onChangeText={setSaralPanAmount}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>


                        {/* <TouchableOpacity style={styles.addButton} onPress={handleAddSaralPan}>
                            <Text style={styles.addButtonText}>Add Saral-Pan</Text>
                        </TouchableOpacity> */}

                        {/* Display Saral-Pan Table */}
                        <View style={styles.table}>
                            <Text style={styles.tableHeader}>ulta-Pan</Text>
                            {/* {saralPanData.map((item, index) => (
                                <View key={index} style={styles.tableRow}>
                                    <Text style={styles.tableCell}>{item.number}</Text>
                                    <Text style={styles.tableCell}>{item.amount}</Text>
                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => {
                                            const updatedData = saralPanData.filter((_, i) => i !== index);
                                            setSaralPanData(updatedData);
                                        }}
                                    >
                                        <Icon name="trash" size={18} color="red" />
                                    </TouchableOpacity>
                                </View>
                            ))} */}
                        </View>
                    </View>
                )}


            </View>

            {data?.reversedGroupedEntries ? (
                <SectionList
                    sections={sections}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.cardText}><Text style={styles.bold}>Type:</Text> {item.type}</Text>
                            <Text style={styles.cardText}>
                                <Text style={styles.bold}>Number:</Text>
                                {Array.isArray(item?.number)
                                    ? item.number.join(", ")
                                    : (typeof item?.number === "string" && item.number.startsWith("[")
                                        ? JSON.parse(item.number).join(", ")
                                        : item?.number || "N/A"
                                    )}
                            </Text>

                            <Text style={styles.cardText}><Text style={styles.bold}>Amount:</Text> {item.amount}</Text>
                        </View>
                    )}
                    renderSectionHeader={({ section }) => (
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionHeaderText}>{section.title}</Text>
                            <Text style={styles.sectionHeaderTotal}>TOTAL = {section.data.reduce((sum, item) => sum + item.amount, 0)}</Text>
                        </View>
                    )}
                />
            ) : (
                <Text></Text>
            )}

        </ScrollView >
    );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: globalColors.LightWhite,
        height: '50%',
        padding: 10,
    },
    header: {
        backgroundColor: globalColors.bluegrey,
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    logoContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    logoText: {
        color: globalColors.white,
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 8,
    },
    menuButton: {
        padding: 8,
    },
    datePicker: {
        borderWidth: 1,
        borderColor: globalColors.borderColor,
        backgroundColor: globalColors.inputbgColor,
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    formContainer: {
        // backgroundColor: globalColors.white,
        // margin: 10,
        padding: 10,
        // borderRadius: 12,
        // shadowColor: globalColors.black,
        // shadowOffset: { width: 0, height: 4 },
        // shadowOpacity: 0.1,
        // shadowRadius: 6,
        // elevation: 3,
    },
    sectionTitle: {
        fontSize: 21,
        fontFamily: 'Poppins-Bold',
        marginBottom: 10,
        color: globalColors.darkBlue,
    },
    inputGroup: {
        marginBottom: 16,
        width: '48%'
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        fontFamily: 'Poppins-Bold',
        color: globalColors.inputLabel,
        textTransform: 'uppercase'
    },
    input: {
        fontSize: 14,
        borderWidth: 1,
        fontFamily: 'Poppins-Medium',
        borderColor: globalColors.borderColor,
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: globalColors.inputbgColor

    },
    radioButton: {
        flex: 1,
        minWidth: width / 4 - 10,
        margin: 4,
        paddingVertical: 10,
        alignItems: "center",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: globalColors.borderColor,
        backgroundColor: globalColors.white,
    },
    selectedRadioButton: {
        backgroundColor: globalColors.blue,
        borderColor: globalColors.blue,
    },
    radioText: {
        fontSize: 14,
        fontWeight: "500",
        fontFamily: 'Poppins-Medium',
        color: globalColors.darkBlue,
    },
    selectedRadioText: {
        color: globalColors.white,
        fontFamily: 'Poppins-Medium',
    },
    buttonGroup: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 15,
    },
    submitButton: {
        backgroundColor: globalColors.green,
        padding: 14,
        borderRadius: 8,
        flex: 1,
        alignItems: "center",
        marginRight: 10,
    },
    submitButtonText: {
        color: globalColors.white,
        fontSize: 16,
        lineHeight: 19,
        fontFamily: 'Poppins-Bold',
    },
    deleteAllButton: {
        backgroundColor: globalColors.vividred,
        flexDirection: "row",
        alignItems: "center",
        padding: 14,
        borderRadius: 8,
        flex: 1,
        justifyContent: "center",
    },
    deleteAllButtonText: {
        color: globalColors.white,
        fontSize: 16,
        lineHeight: 19,
        fontFamily: 'Poppins-Bold',
        marginLeft: 6,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        marginBottom: 10,
    },
    halfWidthInput: {
        width: "48%"
    },
    resultContainer: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    resultTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    resultText: {
        fontSize: 16,
        color: "#444",
        marginBottom: 5,
    },
    listContainer: {
        // paddingBottom: 20,
        // flexDirection: 'row',
        // flexWrap: 'wrap'

        flexDirection: "row",
        // justifyContent: "space-between",
        // alignItems: 'center',
        marginBottom: 10,
    },
    card: {
        backgroundColor: "#fff",
        // width: '48%',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,

    },
    cardTitle: {
        fontSize: 18,
        lineHeight: 19,
        fontFamily: 'Poppins-Medium',
        marginBottom: 10,
        textAlign: "center",
    },
    cardText: {
        fontSize: 16,
        color: "#444",
        lineHeight: 19,
        fontFamily: 'Poppins-Medium',
        marginBottom: 5,
    },
    bold: {
        fontWeight: "bold",
    },
    flatListContainer: {

        justifyContent: 'space-evenly',
    },
    dropdown: {
        borderWidth: 1,
        borderColor: globalColors.borderColor,
        backgroundColor: globalColors.inputbgColor,
        padding: 11,
        borderRadius: 8,
        marginBottom: 12,
    },
    sectionHeader: {
        backgroundColor: "#e0e0e0",
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    sectionHeaderText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    sectionHeaderTotal: {
        fontSize: 14,
        color: "#666",
        marginTop: 5,
    },
    card: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 5,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    cardText: {
        fontSize: 14,
        color: "#444",
        marginBottom: 5,
    },
    bold: {
        fontWeight: "bold",
    },
});

export default DashboardScreen;
