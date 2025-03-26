
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
    Alert,
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
import { deleteEntryData, fetchMarketData } from "../../Redux/Slices/marketSlice";
import { submitEntry } from "../../Redux/Slices/entrySlice";
import EntriesList from "../../components/Dashboard/EntriesList";
import { fetchAgentByCode, fetchAgentByName } from "../../Redux/Slices/autoCompleteSlice";
import EditEntryModal from "../../components/Modal/EditEntryModal";


const DashboardScreen = ({ navigation }) => {
    const [agentId, setAgentId] = useState("");
    const [agentName, setAgentName] = useState("");
    const [market, setMarket] = useState("Kalyan");
    const [date, setDate] = useState(new Date());
    const [number, setNumber] = useState("");
    const [numbersList, setNumbersList] = useState([]);
    const [ocj, setOcj] = useState("");
    const [payloadString, setPayloadString] = useState('');

    const [amount, setAmount] = useState("");
    const [secAmount, setsecAmount] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("JODI");
    const [anotherNumber, setAnotherNumber] = useState("");
    const [saralPanNumber, setSaralPanNumber] = useState("");
    const [saralPanAmount, setSaralPanAmount] = useState("");
    const [saralPanData, setSaralPanData] = useState([]);
    const [saralPanGunule, setsaralPanGunule] = useState([]);
    const [saralPanGunuleAmount, setsaralPanGunuleAmount] = useState([]);
    const [showPicker, setShowPicker] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [agentList, setAgentList] = useState([]);
    // const [loading, setLoading] = useState(false);

    const [openDropdown, setOpenDropdown] = useState(false); // To toggle dropdown visibility
    const [submittedData, setSubmittedData] = useState(data);
    const [response, setResponse] = useState([])

    const dispatch = useDispatch();

    const { data, status } = useSelector((state) => state.market);
    const { agentInfo } = useSelector((state) => state.autoComplete)

    const { loading, error, success } = useSelector((state) => state.entry);
    const token = useSelector((state) => state.auth.token);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);
    const [editAmount, setEditAmount] = useState("");
    const [editNumber, setEditNumber] = useState("");

    console.log("market data 11------->", data)


    const formatDate = (date) => {
        return date.toISOString().split("T")[0]; // 
    };
    const categories = [
        "OPEN",
        "JODI",
        "CHOKADA",
        "CYCLE",
        "CUT",
        "RUNNING_PAN",
        "SARAL_PAN",
        "ULTA PAN",
        "BEERICH",
        "FARAK",
        "OPENPAN",
        "CLOSEPAN",
        "CLOSE",

    ];

    useEffect(() => {
        setAgentId("");
        setAgentName("");
    }, []);

    const [id, setId] = useState('')

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

    const fetchData = async () => {
        try {
            console.log("Fetch Data Is reloading====")
            const dateFormated = formatDate(date)
            const response = await dispatch(fetchMarketData({ agent_id: id, market: market, date: dateFormated, token }));
            setResponse(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {

        fetchData();
    }, [agentName, date, market, id]);


    const validateNumber = (value, category) => {
        if (!value) return true;

        if (!/^\d+$/.test(value)) return false;

        switch (category) {
            case "OPEN":
            case "BEERICH":
            case "FARAK":
                return value.length === 1;

            case "JODI":
            case "CHOKADA":
                return value.length === 2;

            case "RUNNING_PAN":
            case "OPENPAN":
            case "CLOSEPAN":
                return value.length === 3;

            case "CYCLE":
            case "CUT":
                return value.length <= 10;

            default:
                return true;
        }
    };

    const getMaxLength = (category) => {
        switch (category) {
            case "OPEN":
            case "BEERICH":
            case "FARAK":
                return 1;
            case "JODI":
            case "CHOKADA":
                return 2;
            case "RUNNING_PAN":
            case "OPENPAN":
            case "CLOSEPAN":
                return 3;
            case "CYCLE":
            case "CUT":
                return 10;
            default:
                return 100; // Default large number for other categories
        }
    };

    const handleNumberChange2 = (text) => {
        const numericValue = text.replace(/[^0-9]/g, '');
        const maxLength = getMaxLength(selectedCategory);
        const truncatedValue = numericValue.slice(0, maxLength);
        setNumber(truncatedValue);

        // Auto add when valid length is reached
        if (truncatedValue.length === maxLength) {
            if (selectedCategory === "OPEN") {
                // "OPEN" type does not allow duplicates
                if (!numbersList.includes(truncatedValue)) {
                    const updatedList = [...numbersList, truncatedValue];
                    setNumbersList(updatedList);
                    setPayloadString(updatedList.join(','));
                    setNumber('');
                    setErrorMessage('');
                } else {
                    setErrorMessage("The number already exists");
                }
            } else {
                // For other categories, duplicates are allowed
                const updatedList = [...numbersList, truncatedValue];
                setNumbersList(updatedList);
                setPayloadString(updatedList.join(','));
                setNumber('');
                setErrorMessage('');
            }
        } else {
            setErrorMessage('');
        }
    };



    const getValidationMessage = (category) => {
        switch (category) {
            case "OPEN":
            case "BEERICH":
            case "FARAK":
                return "Please enter exactly 1 digit (0-9)";

            case "JODI":
            case "CHOKADA":
                return "Please enter exactly 2 digits";

            case "RUNNING_PAN":
            case "OPENPAN":
            case "CLOSEPAN":
                return "Please enter exactly 3 digits";

            case "CYCLE":
            case "CUT":
                return "Maximum 10 digits allowed";

            default:
                return "Invalid input";
        }
    };

    const handleSubmit = async () => {

        if (!validateNumber(number, selectedCategory)) {
            alert(`Invalid number format for ${selectedCategory} category`);
            return;
        }

        if ((selectedCategory === "CYCLE" || selectedCategory === "RUNNING_PAN") &&
            !validateNumber(anotherNumber, selectedCategory)) {
            alert(`Invalid another number format for ${selectedCategory} category`);
            return;
        }

        let payload = {};

        console.log("Selected Category:", selectedCategory);
        console.log("Selected Category in Lowercase:", selectedCategory.toLowerCase());

        if (selectedCategory === "OPEN" || selectedCategory === "JODI" || selectedCategory === "CHOKADA" || selectedCategory === "BEERICH" || selectedCategory === "FARAK" || selectedCategory === "OPENPAN" || selectedCategory === "CLOSEPAN") {
            payload = {
                agent_id: id.toString(),
                agent_type: "1",
                agentcode: agentId,
                agentname: agentName,
                amount: amount,
                amount2: "",
                filterDate: formatDate(date),
                market: market,
                market_msg: "",
                msg: "",
                number: '',
                number2: "",
                ocj: payloadString,
                type: selectedCategory.toLowerCase(),
                panType: "undefined",
            };
        } else if (selectedCategory === "CYCLE" || selectedCategory === 'RUNNING_PAN') {
            payload = {
                agent_id: id.toString(),
                agent_type: "1",
                agentcode: agentId,
                agentname: agentName,
                amount: amount,
                amount2: "",
                filterDate: formatDate(date),
                market: market,
                market_msg: "",
                msg: "",
                number: number,
                number2: anotherNumber,
                ocj: '',
                type: selectedCategory.toLowerCase(),
                panType: "undefined",
            };
        } else if (selectedCategory === "CUT") {
            payload = {
                agent_id: id.toString(),
                agent_type: "1",
                agentcode: agentId,
                agentname: agentName,
                amount: amount,
                amount2: secAmount,
                filterDate: formatDate(date),
                market: market,
                market_msg: "",
                msg: "",
                number: number,
                number2: '',
                ocj: '',
                type: selectedCategory.toLowerCase(),
                panType: "undefined",
            };
        }

        console.log("Payload before dispatch:", payload);

        if (Object.keys(payload).length === 0) {
            console.error("Payload is empty, check your conditions and variables.");
        } else {
            try {
                // const response = await dispatch(submitEntry({ payload, token }));
                if (submitEntry?.fulfilled?.match(response)) {
                    fetchData();
                } else {
                    console.error("submitEntry failed:", response);
                }
            } catch (error) {
                console.error("Error during dispatch:", error);
            }
        }

        console.log("Token:", token);


    }
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


    const handleDelete = async (id) => {
        console.log("handleDelete", id)
        Alert.alert(
            "Confirm Deletion",
            "Are you sure you want to delete this entry?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Deletion cancelled"),
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            await dispatch(deleteEntryData(id));
                            fetchData();
                        } catch (error) {
                            console.error("Error while deleting:", error);
                        }
                    },
                    style: "destructive"
                }
            ],
            { cancelable: true }
        );
    }

    const handleEdit = async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/entries/${id}/edit`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const entryData = response.data;
            setEditingEntry(entryData);
            setEditAmount(entryData.amount.toString());

            // Handle different number formats
            let displayNumber = '';
            if (entryData.type === 'running_pan' && entryData.entry_number && Array.isArray(entryData.entry_number)) {
                displayNumber = entryData.entry_number.join(', '); // Join array with comma
            } else if (entryData.type === 'jodi' && entryData.number && Array.isArray(entryData.number)) {
                displayNumber = entryData.number.join(', '); // For JODI, join array with comma
            } else if (entryData.number) {
                displayNumber = Array.isArray(entryData.number) ? entryData.number.join(', ') : entryData.number.toString();
            }

            setEditNumber(displayNumber);
            setIsEditModalVisible(true);

        } catch (error) {
            console.error("Error fetching entry data:", error);
            Alert.alert("Error", "Failed to fetch entry data");
        }
    }

    const handleSaveEdit = async () => {
        if (!editingEntry) return;

        try {
            let payload = {
                amount: editAmount,
                type: editingEntry.type,
            };

            // Handle different number formats based on entry type
            switch (editingEntry.type.toLowerCase()) {
                case 'jodi':
                case 'chokada':
                    // For JODI/CHOKADA, number should be an array of strings
                    payload.number = editNumber.split(',').map(num => num.trim());
                    break;

                case 'running_pan':
                    // For RUNNING_PAN, entry_number should be an array of separate numbers
                    payload.entry_number = editNumber.split(',').map(num => num.trim());
                    break;

                case 'openpan':
                case 'closepan':
                    // For PAN types, number should be a single value
                    payload.number = [editNumber];
                    break;

                case 'open':
                case 'close':
                    // For these types, use ocj field
                    payload.number = [editNumber];
                    break;

                case 'beriz':
                case 'farak':
                    payload.entry_number = [editNumber];
                    break;

                case 'cycle':
                case 'cut':
                    // For these types, number is a single value
                    payload.number = [editNumber];
                    break;

                default:
                    // Default case for other types
                    payload.number = editNumber;
            }

            // Ensure arrays don't contain empty strings
            if (payload.number && Array.isArray(payload.number)) {
                payload.number = payload.number.filter(num => num !== '');
            }
            if (payload.entry_number && Array.isArray(payload.entry_number)) {
                payload.entry_number = payload.entry_number.filter(num => num !== '');
            }

            console.log("Final payload for handleSaveEdit:", payload);

            const response = await axios.put(`${API_BASE_URL}/entries/${editingEntry.id}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("Update response:", response);
            setIsEditModalVisible(false);
            fetchData();
            Alert.alert("Success", "Entry updated successfully");
        } catch (error) {
            console.error("Error updating entry:", error);
            let errorMessage = "Failed to update entry";
            if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            }
            Alert.alert("Error", errorMessage);
        }
    };


    const handleNumberChange = (text) => {
        const numericValue = text.replace(/[^0-9]/g, '');
        const maxLength = getMaxLength(selectedCategory);
        const truncatedValue = numericValue.slice(0, maxLength);

        setNumber(truncatedValue);
    };

    const handleAddNumber = () => {
        if (number.length === getMaxLength(selectedCategory)) {
            if (numbersList.includes(number)) {
                setErrorMessage("The number already exists");
                setNumber('');
            } else {
                setNumbersList([...numbersList, number]);
                setNumber('');
                setErrorMessage('');
            }
        }
    };

    const handleRemoveNumber = (num) => {
        setNumbersList(numbersList.filter(item => item !== num));

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
                        <Text style={styles.deleteAllButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>

                {(selectedCategory === "CYCLE" || selectedCategory === "RUNNING_PAN") && (
                    <>
                        <View style={styles.row}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>ENTER NUMBER</Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        !validateNumber(number, selectedCategory) && number.length > 0 && styles.invalidInput
                                    ]}
                                    placeholder="Enter Number"
                                    value={number}
                                    keyboardType="numeric"
                                    onChangeText={(text) => handleNumberChange(text, setNumber, selectedCategory)} />
                                {!validateNumber(number, selectedCategory) && number.length > 0 && (
                                    <Text style={styles.errorText}>
                                        {getValidationMessage(selectedCategory)}
                                    </Text>
                                )}

                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>ANOTHER NUMBER</Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        !validateNumber(anotherNumber, selectedCategory) && anotherNumber.length > 0 && styles.invalidInput
                                    ]}
                                    placeholder="Enter Another No"
                                    value={anotherNumber}
                                    keyboardType="numeric"
                                    onChangeText={(text) => handleNumberChange(text, setAnotherNumber, selectedCategory)}
                                />
                                {!validateNumber(anotherNumber, selectedCategory) && anotherNumber.length > 0 && (
                                    <Text style={styles.errorText}>
                                        {getValidationMessage(selectedCategory)}
                                    </Text>
                                )}
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
                                <TextInput
                                    style={[
                                        styles.input,
                                        !validateNumber(number, selectedCategory) && number.length > 0 && styles.invalidInput
                                    ]}
                                    placeholder="Enter Number" keyboardType="numeric"
                                    value={number}
                                    onChangeText={(text) => handleNumberChange(text, setNumber, selectedCategory)}
                                />
                                {!validateNumber(number, selectedCategory) && number.length > 0 && (
                                    <Text style={styles.errorText}>
                                        {getValidationMessage(selectedCategory)}
                                    </Text>
                                )}
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>ENTER AMOUNT</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Amount" keyboardType="numeric"
                                    value={amount}
                                    onChangeText={setAmount} />
                            </View>
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>AMOUNT SECOUND</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Amount"
                                value={secAmount}
                                onChangeText={setsecAmount}
                                keyboardType="numeric"
                            />
                        </View>
                    </>
                )}

                {selectedCategory !== "CYCLE" && selectedCategory !== "RUNNING_PAN" && selectedCategory !== "CUT" && selectedCategory !== "SARAL_PAN" && selectedCategory !== "ULTA PAN" && (
                    <>
                        <View style={styles.row}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>ENTER NUMBER</Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        !validateNumber(number, selectedCategory) && number.length > 0 && styles.invalidInput
                                    ]}
                                    keyboardType="numeric"
                                    placeholder="Enter Number"
                                    value={number}
                                    onChangeText={handleNumberChange2}
                                    maxLength={getMaxLength(selectedCategory)}
                                // onBlur={handleAddNumber
                                />
                                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>ENTER AMOUNT</Text>
                                <TextInput style={styles.input} keyboardType="numeric"
                                    placeholder="Enter Amount" value={amount} onChangeText={setAmount} />
                            </View>
                        </View>

                    </>
                )}

                {/* vlidation remains */}
                {selectedCategory === "SARAL_PAN" && (
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


                <FlatList
                    data={numbersList}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    renderItem={({ item }) => (
                        <View style={styles.numberContainer}>
                            <Text style={styles.numberText}>{item}</Text>
                            <TouchableOpacity onPress={() => handleRemoveNumber(item)}>
                                <Text style={styles.removeText}>X</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />

            </View>

            <EntriesList reversedGroupedEntries={data?.reversedGroupedEntries} Delete={handleDelete} handleEdit={handleEdit} />
            <EditEntryModal
                visible={isEditModalVisible}
                entry={editingEntry}
                onClose={() => setIsEditModalVisible(false)}
                onSave={handleSaveEdit}
                editNumber={editNumber}
                setEditNumber={setEditNumber}
                editAmount={editAmount}
                setEditAmount={setEditAmount}
            />
        </ScrollView >
    );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    numberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        marginRight: 5,
    },
    numberText: {
        fontSize: 16,
        marginRight: 5,
    },
    removeText: {
        color: 'red',
        fontWeight: 'bold',
    },
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
        backgroundColor: globalColors.Wisteria,
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
    invalidInput: {
        borderColor: 'red',
        borderWidth: 1,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
    },
});

export default DashboardScreen;
