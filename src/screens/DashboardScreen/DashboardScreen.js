
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
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../utils/Api";
import { fetchMarketData } from "../../Redux/Slices/marketSlice";
import { submitEntry } from "../../Redux/Slices/entrySlice";
import EntriesList from "../../components/Dashboard/EntriesList";


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
    // const [loading, setLoading] = useState(false);

    const [openDropdown, setOpenDropdown] = useState(false); // To toggle dropdown visibility
    const [submittedData, setSubmittedData] = useState(data);
    const [response, setResponse] = useState([])

    const dispatch = useDispatch();

    const { data, status } = useSelector((state) => state.market);
    const { loading, error, success } = useSelector((state) => state.entry);
    const token = useSelector((state) => state.auth.token);


    console.log("market data 11------->", data)


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
    const [id, setId] = useState(0)

    const handleSelectByCode = async (item) => {
        try {
            console.log("Selected Item by Code:", item);
            const response = await axios.get(`${API_BASE_URL}/agent/getByCode/${item}`
                , {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const { name, agentcode, id
            } = response.data;
            setAgentName(name);
            setAgentId(agentcode);
            setId(id)
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            // setLoading(false);
        }
    };

    const handleSelectByName = async (item) => {
        try {

            const response = await axios.get(`${API_BASE_URL}/agent/getByName/${item}`
                , {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const { name, agentcode, id } = response.data;
            setAgentName(name);
            setAgentId(agentcode);
            setId(id);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dateFormated = formatDate(date)
                const response = await dispatch(fetchMarketData({ agent_id: id, market: market, date: dateFormated, token }));
                setResponse(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [agentName, date, market, id]);

    const handleSubmit = async () => {

        console.log("Handle submit clicking......................")
        const payload = {
            agent_id: "1",
            agent_type: "1",
            agentcode: "AG123",
            agentname: agentName,
            amount: amount,
            amount2: "",
            filterDate: formatDate(date),
            market: market,
            market_msg: "",
            msg: "",
            number: number,
            number2: "",
            ocj: 1,
            type: selectedCategory.toLowerCase(),
            panType: "undefined",
        };
        console.log("payload inside the handle submit", payload)
        try {
            await dispatch(submitEntry({ payload, token }));

        } catch (error) {
            console.error("error", error)
        }
        console.log("payload inside the handle submit", token)

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



    const formatNumbers = (numbers) => {
        if (!numbers) return 'N/A';
        try {
            if (typeof numbers === 'string') {
                if (numbers.startsWith('[')) {
                    return JSON.parse(numbers).join(', ');
                }
                return numbers;
            }
            if (Array.isArray(numbers)) {
                return numbers.join(', ');
            }
            return numbers;
        } catch (e) {
            return numbers;
        }
    };


    const renderEntries = () => {
        if (!data?.reversedGroupedEntries) return null;

        return Object.entries(data.reversedGroupedEntries).map(([key, group]) => {
            const totalAmount = Object.values(group).reduce((sum, item) => {
                return sum + (typeof item === 'object' && 'amount' in item ? Number(item.amount) : 0);
            }, 0);


            const firstItem = Object.values(group).find(item => typeof item === 'object' && 'msg_no' in item && 'market_msg' in item);

            const msg_no = firstItem?.msg_no || 'NULL';
            const market_msg = firstItem?.market_msg || 'NULL';

            const title = `${market_msg} MSG ${msg_no}`;

            return (
                <ScrollView horizontal style={{ alignContent: 'space-around', gap: 10 }}>
                    <View key={key} style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>{title}</Text>
                            <Text style={styles.totalAmount}>TOTAL = {totalAmount}</Text>
                        </View>

                        <View style={styles.cardsContainer}>
                            {Object.values(group).map((item, index) => {
                                if (typeof item === 'object' && 'type' in item) {
                                    return (
                                        <View key={index} style={styles.cardStyle}>
                                            <View style={styles.cardHeader}>
                                                <View style={styles.checkbox} />
                                                <Text style={styles.cardType}>{item.type?.toUpperCase()}</Text>
                                            </View>

                                            <View style={styles.cardContent}>
                                                <Text style={styles.numbers}>{formatNumbers(item.number)}</Text>
                                                <Text style={styles.amount}>₹ {item.amount}</Text>
                                            </View>

                                            <View style={styles.cardActions}>
                                                <TouchableOpacity style={styles.actionButton}>
                                                    <Icon name="refresh" size={20} color="#FFB800" />
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.actionButton}>
                                                    <Icon name="edit" size={20} color="#0066FF" />
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.actionButton}>
                                                    <Icon name="trash" size={20} color="#FF0000" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    );
                                }
                                return null;
                            })}
                        </View>
                    </View>
                </ScrollView>

            );
        });
    };


    return (
        <ScrollView style={styles.container}>
            <Text style={styles.sectionTitle}>Agent Details</Text>
            <View style={styles.formContainer}>


                <View style={styles.row}>
                    <View style={styles.halfWidthInput}>
                        <Text style={styles.label}>AGENT ID</Text>
                        <DynamicDropdown
                            onSelect={handleSelectByCode}
                            placeholder="Agent Code"
                            searchType="code"
                            value={agentId}
                            setAgentId={setAgentId}

                        />
                    </View>
                    <View style={styles.halfWidthInput}>
                        <Text style={styles.label}>AGENT NAME</Text>

                        <DynamicDropdown
                            onSelect={handleSelectByName}
                            placeholder="Agent Name"
                            searchType="name"
                            value={agentName}
                        />

                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.halfWidthInput}>
                        <Text style={styles.label}>MARKET</Text>
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
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            style={[
                                styles.radioButton,
                                selectedCategory === item && styles.selectedRadioButton,
                                {
                                    flex: 1,
                                    marginRight: (index + 1) % 3 === 0 ? 0 : 10,
                                },
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




            <EntriesList reversedGroupedEntries={data?.reversedGroupedEntries} />
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
    summaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    summaryText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    reverifyButton: {
        backgroundColor: '#FFB800',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 5,
    },
    reverifyText: {
        color: '#fff',
        fontWeight: '600',
    },
    section: {
        marginBottom: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#F5F5F5',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    totalAmount: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    cardsContainer: {
        padding: 10,
        flexDirection: 'row'
    },
    cardStyle: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        width: 200
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: '#999',
        borderRadius: 4,
        marginRight: 10,
    },
    cardType: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    cardContent: {
        padding: 10,
    },
    numbers: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    amount: {
        fontSize: 14,
        color: '#666',
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    actionButton: {
        marginLeft: 15,
    },

});

export default DashboardScreen;
