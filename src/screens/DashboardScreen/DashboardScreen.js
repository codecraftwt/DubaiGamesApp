
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
import { deleteSaralUltadel, resetSaralUltadelState } from "../../Redux/Slices/saralUltadelSlice";


const DashboardScreen = ({ navigation }) => {
    const [agentId, setAgentId] = useState("5");
    const [agentName, setAgentName] = useState("Online user");
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
    const [response, setResponse] = useState([])

    const dispatch = useDispatch();

    const { data, status } = useSelector((state) => state.market);
    const { agentInfo } = useSelector((state) => state.autoComplete)
    const { loading: saralUltadelLoading, error: saralUltadelError, success: saralUltadelSuccess } =
        useSelector((state) => state.saralUltadel);
    const { role } = useSelector((state) => state.auth);
    const { loading, error, success } = useSelector((state) => state.entry);
    const token = useSelector((state) => state.auth.token);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);
    const [editAmount, setEditAmount] = useState("");
    const [editNumber, setEditNumber] = useState("");

    console.log("market data 11 fetch------->", data)

    const [ultaPanNumber, setUltaPanNumber] = useState("");
    const [ultaPanAmount, setUltaPanAmount] = useState("");
    const [ultaPanGunule, setUltaPanGunule] = useState("");
    const [ultaPanGunuleAmount, setUltaPanGunuleAmount] = useState("");
    const [ultaPanEntries, setUltaPanEntries] = useState([]);
    const [ultaGunuleEntries, setUltaGunuleEntries] = useState([]);
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
    const categoryDisplayNames = {
        "OPEN": "OPEN",
        "JODI": "JODI",
        "CHOKADA": "CHOKADA",
        "CYCLE": "CYCLE",
        "CUT": "CUT",
        "RUNNING_PAN": "RUNNINGPAN",
        "SARAL_PAN": "SARAL PAN",
        "ULTA PAN": "ULTA PAN",
        "BEERICH": "BEERICH",
        "FARAK": "FARAK",
        "OPENPAN": "OPEN PAN",
        "CLOSEPAN": "CLOSE PAN",
        "CLOSE": "CLOSE"
    };
    useEffect(() => {
        setAgentId("");
        setAgentName("");
    }, []);


    const [id, setId] = useState('5')

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

    useEffect(() => {
        if (saralUltadelSuccess) {
            Alert.alert("Success", "Entries deleted successfully");
            dispatch(resetSaralUltadelState());
            fetchData();
        }
    }, [saralUltadelSuccess]);


    const getFilteredCategories = useCallback((results, userRole) => {
        if (!results || !results.length || userRole === "admin") {
            return categories;
        }
        const hasOpenPan = results.some(entry => entry.type === "open-pan");
        const hasClosePan = results.some(entry => entry.type === "close-pan");

        if (hasOpenPan && hasClosePan) {
            return [];
        } else if (hasOpenPan) {
            return categories.filter(cat =>
                cat === "CLOSE" || cat === "CLOSEPAN"
            );
        } else if (hasClosePan) {
            return categories.filter(cat =>
                cat !== "CLOSE" && cat !== "CLOSEPAN"
            );
        }

        return categories;
    }, []);
    console.log("GGGGGGGGGGGG", data?.role)

    const filteredCategories = getFilteredCategories(data?.results, data?.role);

    useEffect(() => {
        // Reset selected category if it's not in the filtered list
        if (filteredCategories.length > 0 && !filteredCategories.includes(selectedCategory)) {
            setSelectedCategory(filteredCategories[0]);
        }
    }, [filteredCategories]);

    const validateNumber = (value, category, panType) => {
        if (!value) return true;

        if (!/^\d+$/.test(value)) return false;

        switch (category) {
            case "OPEN":
            case "BEERICH":
            case "CLOSE":
            case "FARAK":
                return value.length === 1 && /^[1-9]$/.test(value);

            case "JODI":
            case "CHOKADA":
                return value.length === 2;

            case "RUNNING_PAN":
            case "OPENPAN":
            case "CLOSEPAN":
                if (panType === 'SP' || panType === 'DP' || panType === 'TP') {
                    return value.length === 1;
                }
                return value.length === 3;

            case "CYCLE":
            case "CUT":
                return value.length <= 10;

            default:
                return true;
        }
    };

    const getMaxLength = (category, panType) => {
        switch (category) {
            case "OPEN":
            case "CLOSE":
            case "BEERICH":
            case "FARAK":
                return 1;
            case "JODI":
            case "CHOKADA":
                return 2;
            case "RUNNING_PAN":
            case "OPENPAN":
            case "CLOSEPAN":
                if (panType === 'SP' || panType === 'DP' || panType === 'TP') {
                    return 1;
                }
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

    useEffect(() => {
        resetFormStates();
    }, [selectedCategory]);

    const resetFormStates = () => {
        // Reset common fields
        setNumber("");
        setAmount("");
        setNumbersList([]);
        setPayloadString("");
        setOcj("");
        setErrorMessage('');

        // Reset category-specific fields
        if (selectedCategory === "CYCLE" || selectedCategory === "RUNNING_PAN") {
            setAnotherNumber("");
        }

        if (selectedCategory === "CUT") {
            setsecAmount("");
        }

        if (selectedCategory === "SARAL_PAN") {
            setSaralPanNumber("");
            setSaralPanAmount("");
            setSaralPanData([]);
            setsaralPanGunule([]);
            setsaralPanGunuleAmount([]);
            setSaralPanEntries([])
            setGunuleEntries([])
        }

        if (selectedCategory === "ULTA PAN") {
            setSaralPanNumber("");
            setSaralPanAmount("");
            setsaralPanGunule([]);
            setsaralPanGunuleAmount([]);
        }
        if (selectedCategory === "ULTA PAN") {
            setUltaPanNumber("");
            setUltaPanAmount("");
            setUltaPanGunule("");
            setUltaPanGunuleAmount("");
            setUltaPanEntries([]);
            setUltaGunuleEntries([]);
        }
    };

    const getValidationMessage = (category) => {
        switch (category) {
            case "OPEN":
            case "BEERICH":
            case "FARAK":
            case "CLOSE":
                return "Please enter exactly 1 digit (-9)";

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

        if (!validateNumber(number, selectedCategory, selectedButton)) {
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

        if (selectedCategory === "OPEN" || selectedCategory === "JODI" || selectedCategory === "CHOKADA" || selectedCategory === "BEERICH" || selectedCategory === "FARAK" || selectedCategory === "CLOSE") {
            payload = {
                agent_id: id.toString(),
                agent_type: "1",
                agentcode: agentId,
                agentname: 'agentName',
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
                agentname: 'agentName',
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
                agentname: 'agentName',
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
        } else if (selectedCategory === "OPENPAN" || selectedCategory === "CLOSEPAN") {

            if (selectedButton !== null) {
                payload = {
                    agent_id: id.toString(),
                    agent_type: "1",
                    agentcode: agentId,
                    agentname: 'agentName',
                    amount: amount,
                    amount2: "",
                    filterDate: formatDate(date),
                    market: market,
                    market_msg: "",
                    msg: "",
                    number: number,
                    number2: "",
                    ocj: '',
                    type: selectedCategory.toLowerCase(),
                    panType: selectedButton.toLowerCase(),

                }
            } else {
                payload = {
                    agent_id: id.toString(),
                    agent_type: "1",
                    agentcode: agentId,
                    agentname: 'agentName',
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
                };
            }
        }
        else if (selectedCategory === "SARAL_PAN") {
            const saralPanNumbers = [];
            const saralPanAmounts = [];
            const gunuleNumbers = [];
            const gunuleAmounts = [];

            // Add main entries
            if (saralPanNumber && saralPanAmount) {
                saralPanNumbers.push(saralPanNumber);
                saralPanAmounts.push(saralPanAmount);
            }

            // Add gunule entries if they exist
            if (saralPanGunule && saralPanGunuleAmount) {
                gunuleNumbers.push(saralPanGunule);
                gunuleAmounts.push(saralPanGunuleAmount);
            }

            // Add entries from the table
            saralPanData.forEach(item => {
                saralPanNumbers.push(item.number);
                saralPanAmounts.push(item.amount);
            });

            payload = {
                agent_id: id.toString(),
                agent_type: "1",
                agentcode: agentId,
                agentname: agentName,
                type: "saral_pan",
                market: market,
                filterDate: formatDate(date),
                number: number || "1",
                amount: amount || "1",
                saral_pan: saralPanEntries.map(entry => entry.number),
                saral_pan_amount: saralPanEntries.map(entry => entry.amount),
                gunule: gunuleEntries.map(entry => entry.number),
                gunule_amount: gunuleEntries.map(entry => entry.amount),
                msg: null,
                market_msg: null
            };
        } else if (selectedCategory === "ULTA PAN") {
            payload = {
                agent_id: id.toString(),
                agent_type: "1",
                agentcode: agentId,
                agentname: 'agentName',
                type: "ulta_pan",
                market: market,
                filterDate: formatDate(date),
                number: number || "1",
                amount: amount || "1",
                gunule: ultaPanEntries.map(entry => entry.number),
                gunule_amount: ultaPanEntries.map(entry => entry.amount),
                saral_pan_amount: ultaGunuleEntries.map(entry => entry.amount),
                saral_pan: ultaGunuleEntries.map(entry => entry.number),
                msg: null,
                market_msg: null
            };
            // gunule_amount: ultaGunuleEntries.map(entry => entry.amount),
            // saral_pan: ultaPanEntries.map(entry => entry.number),
            // saral_pan_amount: ultaPanEntries.map(entry => entry.amount),
            // gunule: ultaGunuleEntries.map(entry => entry.number),
        }

        console.log("Payload before dispatch:", payload);

        if (Object.keys(payload).length === 0) {
            console.error("Payload is empty, check your conditions and variables.");
        } else {
            try {
                const response = await dispatch(submitEntry({ payload, token }));
                if (submitEntry?.fulfilled?.match(response)) {
                    resetFormStates();
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

    const [saralPanEntries, setSaralPanEntries] = useState([]);
    const [gunuleEntries, setGunuleEntries] = useState([]);

    const handleAddSaralPan = () => {
        if (saralPanNumber && saralPanAmount) {
            const newEntry = {
                number: saralPanNumber,
                amount: saralPanAmount
            };
            setSaralPanEntries([...saralPanEntries, newEntry]);
            setSaralPanNumber("");
            setSaralPanAmount("");
        } else {
            Alert.alert("Error", "Please enter both number and amount");
        }
    };

    const handleAddGunule = () => {
        if (saralPanGunule && saralPanGunuleAmount) {
            const newEntry = {
                number: saralPanGunule,
                amount: saralPanGunuleAmount
            };
            setGunuleEntries([...gunuleEntries, newEntry]);
            setsaralPanGunule("");
            setsaralPanGunuleAmount("");
        } else {
            Alert.alert("Error", "Please enter both gunule and amount");
        }
    };
    const handleRemoveSaralPan = (index) => {
        const updatedEntries = [...saralPanEntries];
        updatedEntries.splice(index, 1);
        setSaralPanEntries(updatedEntries);
    };

    // Remove Gunule entry
    const handleRemoveGunule = (index) => {
        const updatedEntries = [...gunuleEntries];
        updatedEntries.splice(index, 1);
        setGunuleEntries(updatedEntries);
    };


    const handleClear = () => {
        // navigation.navigate("StaffList")
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
                            // Check if the id is a stringified array (for saral/ulta pan)
                            if (typeof id === 'string' && id.startsWith('[')) {
                                const ids = JSON.parse(id);
                                await dispatch(deleteSaralUltadel({ ids, token }));
                            } else {
                                // Regular entry deletion
                                await dispatch(deleteEntryData(id));
                            }
                            fetchData();
                        } catch (error) {
                            console.error("Error while deleting:", error);
                            Alert.alert("Error", "Failed to delete entry");
                        }
                    },
                    style: "destructive"
                }
            ],
            { cancelable: true }
        );
    }

    const handleEdit = async (id) => {
        //handle Edit Inside change numbers.
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
            if (entryData.type === 'running_pan' || entryData.type === 'beerich' && entryData.entry_number && Array.isArray(entryData.entry_number)) {
                displayNumber = entryData.entry_number.join(', '); // Join array with comma
            }
            else if (entryData.type === 'jodi' && entryData.number && Array.isArray(entryData.number)) {
                displayNumber = entryData.number.join(', '); // For JODI, join array with comma
            }
            else if (entryData.type === 'chokada' && entryData.number && Array.isArray(entryData.number)) {
                displayNumber = entryData.entry_number.join(','); // For JODI, join array with comma
            }

            else if (entryData.type === 'closepan_dp' || entryData.type === 'closepan_sp' || entryData.type === 'closepan_tp' && entryData.number && Array.isArray(entryData.number)) {
                displayNumber = entryData.entry_number.join(','); // For JODI, join array with comma
            }
            else if (entryData.type === 'cycle' || entryData.type === 'farak' && entryData.entry_number && Array.isArray(entryData.entry_number)) {
                displayNumber = entryData.entry_number.join(','); // For JODI, join array with comma
            }
            else if (entryData.number) {
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
                    payload.number = editNumber.split(',').map(num => num.trim());
                    break;

                case 'chokada':
                    payload.entry_number = editNumber.split(',').map(num => num.trim());
                    break;

                case 'cut':
                    payload.number = editNumber.split(',').map(num => num.trim());
                    break;
                case 'cut_open':
                case 'cut_close':
                    payload.number = editNumber.split(',').map(num => num.trim());
                    break;


                case 'cycle':
                    payload.entry_number = editNumber.split(',').map(num => num.trim());
                    break;
                // case 'cycle':
                //     payload.number = [editNumber];
                //     break;

                case 'running_pan':
                    // For RUNNING_PAN, entry_number should be an array of separate numbers
                    payload.entry_number = editNumber.split(',').map(num => num.trim());
                    break;

                case 'openpan':
                case 'closepan':
                case 'farak':
                    // For PAN types, number should be a single value
                    payload.entry_number = [editNumber];
                    break;

                case 'open':
                case 'close':
                    // For these types, use ocj field
                    payload.number = [editNumber];
                    break;

                case 'beerich':
                    payload.entry_number = [editNumber];
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

    const handleNumberChangeAnother = (text) => {
        const numericValue = text.replace(/[^0-9]/g, '');
        const maxLength = getMaxLength(selectedCategory);
        const truncatedValue = numericValue.slice(0, maxLength);

        setAnotherNumber(truncatedValue);
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
        const updatedNumbersList = numbersList.filter(item => item !== num);
        setNumbersList(updatedNumbersList);

        setPayloadString(updatedNumbersList.join(','));
    };

    const handleAddUltaPan = () => {
        if (ultaPanNumber && ultaPanAmount) {
            const newEntry = {
                number: ultaPanNumber,
                amount: ultaPanAmount
            };
            setUltaPanEntries([...ultaPanEntries, newEntry]);
            setUltaPanNumber("");
            setUltaPanAmount("");
        } else {
            Alert.alert("Error", "Please enter both number and amount");
        }
    };

    const handleAddUltaGunule = () => {
        if (ultaPanGunule && ultaPanGunuleAmount) {
            const newEntry = {
                number: ultaPanGunule,
                amount: ultaPanGunuleAmount
            };
            setUltaGunuleEntries([...ultaGunuleEntries, newEntry]);
            setUltaPanGunule("");
            setUltaPanGunuleAmount("");
        } else {
            Alert.alert("Error", "Please enter both gunule and amount");
        }
    };

    const handleRemoveUltaPan = (index) => {
        const updatedEntries = [...ultaPanEntries];
        updatedEntries.splice(index, 1);
        setUltaPanEntries(updatedEntries);
    };

    const handleRemoveUltaGunule = (index) => {
        const updatedEntries = [...ultaGunuleEntries];
        updatedEntries.splice(index, 1);
        setUltaGunuleEntries(updatedEntries);
    };

    const [selectedButton, setSelectedButton] = useState(null);

    useEffect(() => {
        setSelectedButton(null);
    }, [selectedCategory]);

    const ButtonGroup = ({ onSelect }) => {
        return (
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[
                        styles.button,
                        selectedButton === 'SP' && styles.selectedButton
                    ]}
                    onPress={() => {
                        setSelectedButton('SP');
                        onSelect('SP');
                    }}
                >
                    <Text style={[
                        styles.buttonText,
                        selectedButton === 'SP' && styles.selectedButtonText
                    ]}>SP</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.button,
                        selectedButton === 'DP' && styles.selectedButton
                    ]}
                    onPress={() => {
                        setSelectedButton('DP');
                        onSelect('DP');
                    }}
                >
                    <Text style={[
                        styles.buttonText,
                        selectedButton === 'DP' && styles.selectedButtonText
                    ]}>DP</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.button,
                        selectedButton === 'TP' && styles.selectedButton
                    ]}
                    onPress={() => {
                        setSelectedButton('TP');
                        onSelect('TP');
                    }}
                >
                    <Text style={[
                        styles.buttonText,
                        selectedButton === 'TP' && styles.selectedButtonText
                    ]}>TP</Text>
                </TouchableOpacity>
            </View>
        );
    };


    return (
        <ScrollView style={styles.container}>
            <Text style={styles.sectionTitle}>Agent Details</Text>
            <View style={styles.formContainer}>
                {
                    data?.role !== "online_customer" ? <View style={styles.row}>
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
                        : ''


                }


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
                    data={filteredCategories}
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
                                {categoryDisplayNames[item]}
                            </Text>
                        </TouchableOpacity>
                    )}
                />

                {/* Action Buttons */}


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
                                <Text style={styles.label}>ANOTHER NUMBERs</Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        !validateNumber(anotherNumber, selectedCategory) && anotherNumber.length > 0 && styles.invalidInput
                                    ]}
                                    placeholder="Enter Another No"
                                    value={anotherNumber}
                                    keyboardType="numeric"
                                    onChangeText={(text) => handleNumberChangeAnother(text, setAnotherNumber, selectedCategory)}
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

                {selectedCategory !== "CYCLE" && selectedCategory !== "RUNNING_PAN" && selectedCategory !== "CUT" && selectedCategory !== "SARAL_PAN" && selectedCategory !== "ULTA PAN" && selectedCategory !== "OPENPAN" && selectedCategory !== "CLOSEPAN" && (
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

                {(selectedCategory === "OPENPAN" || selectedCategory === "CLOSEPAN") && (
                    <>
                        <ButtonGroup onSelect={(type) => setSelectedButton(type)}
                        />
                        <View style={styles.row}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>ENTER NUMBER</Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        !validateNumber(number, selectedCategory, selectedButton) &&
                                        number.length > 0 && styles.invalidInput
                                    ]}
                                    keyboardType="numeric"
                                    placeholder="Enter Number"
                                    value={number}
                                    onChangeText={handleNumberChange2}
                                    maxLength={getMaxLength(selectedCategory, selectedButton)}
                                // onBlur={handleAddNumber
                                />
                                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
                                {!validateNumber(number, selectedCategory, selectedButton) && number.length > 0 && (
                                    <Text style={styles.errorText}>
                                        {selectedButton ? "Please enter exactly 1 digit" : "Please enter exactly 3 digits"}
                                    </Text>
                                )}
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
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={handleAddSaralPan}
                            >
                                <Text style={styles.addButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>



                        {/* Display Saral-Pan Table */}

                        {saralPanEntries.length !== 0 ? <View style={styles.table}>
                            <View style={styles.tableHeader}>
                                <Text style={styles.tableHeaderText}>Number</Text>
                                <Text style={styles.tableHeaderText}>Amount</Text>
                                <Text style={styles.tableHeaderText}>Action</Text>
                            </View>
                            {saralPanEntries.map((entry, index) => (
                                <View key={`saral-${index}`} style={styles.tableRow}>
                                    <Text style={styles.tableCell}>{entry.number}</Text>
                                    <Text style={styles.tableCell}>{entry.amount}</Text>
                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => handleRemoveSaralPan(index)}
                                    >
                                        <Icon name="trash" size={18} color="red" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View> : ''
                        }


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
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={handleAddGunule}
                            >
                                <Text style={styles.addButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>


                        {
                            gunuleEntries.length !== 0 ? <View style={styles.table}>
                                <View style={styles.tableHeader}>
                                    <Text style={styles.tableHeaderText}>Gunule</Text>
                                    <Text style={styles.tableHeaderText}>Amount</Text>
                                    <Text style={styles.tableHeaderText}>Action</Text>
                                </View>
                                {gunuleEntries.map((entry, index) => (
                                    <View key={`gunule-${index}`} style={styles.tableRow}>
                                        <Text style={styles.tableCell}>{entry.number}</Text>
                                        <Text style={styles.tableCell}>{entry.amount}</Text>
                                        <TouchableOpacity
                                            style={styles.deleteButton}
                                            onPress={() => handleRemoveGunule(index)}
                                        >
                                            <Icon name="trash" size={18} color="red" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View> : ''
                        }


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
                                    value={ultaPanGunule} onChangeText={setUltaPanGunule}
                                    keyboardType="numeric"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>AMOUNT</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Amount"
                                    value={ultaPanGunuleAmount}
                                    onChangeText={setUltaPanGunuleAmount}

                                    keyboardType="numeric"
                                />
                            </View>

                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={handleAddUltaGunule}
                            >
                                <Text style={styles.addButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>


                        {ultaGunuleEntries.length > 0 && (
                            <View style={styles.table}>
                                <View style={styles.tableHeader}>
                                    <Text style={styles.tableHeaderText}>Gunule</Text>
                                    <Text style={styles.tableHeaderText}>Amount</Text>
                                    <Text style={styles.tableHeaderText}>Action</Text>
                                </View>
                                {ultaGunuleEntries.map((entry, index) => (
                                    <View key={`ulta-gunule-${index}`} style={styles.tableRow}>
                                        <Text style={styles.tableCell}>{entry.number}</Text>
                                        <Text style={styles.tableCell}>{entry.amount}</Text>
                                        <TouchableOpacity
                                            style={styles.deleteButton}
                                            onPress={() => handleRemoveUltaGunule(index)}
                                        >
                                            <Icon name="trash" size={18} color="red" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        )}

                        <View style={styles.row}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>ULTA PAN NUMBER</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Saral-Pan No"
                                    value={ultaPanNumber}
                                    onChangeText={setUltaPanNumber}
                                    keyboardType="numeric"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>AMOUNT</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Amount"
                                    value={ultaPanAmount}
                                    onChangeText={setUltaPanAmount}
                                    keyboardType="numeric"
                                />
                            </View>

                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={handleAddUltaPan}
                            >
                                <Text style={styles.addButtonText}>+</Text>
                            </TouchableOpacity>

                        </View>

                        {ultaPanEntries.length > 0 && (
                            <View style={styles.table}>
                                <View style={styles.tableHeader}>
                                    <Text style={styles.tableHeaderText}>Number</Text>
                                    <Text style={styles.tableHeaderText}>Amount</Text>
                                    <Text style={styles.tableHeaderText}>Action</Text>
                                </View>
                                {ultaPanEntries.map((entry, index) => (
                                    <View key={`ulta-${index}`} style={styles.tableRow}>
                                        <Text style={styles.tableCell}>{entry.number}</Text>
                                        <Text style={styles.tableCell}>{entry.amount}</Text>
                                        <TouchableOpacity
                                            style={styles.deleteButton}
                                            onPress={() => handleRemoveUltaPan(index)}
                                        >
                                            <Icon name="trash" size={18} color="red" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        )}


                        {/* <TouchableOpacity style={styles.addButton} onPress={handleAddSaralPan}>
                            <Text style={styles.addButtonText}>Add Saral-Pan</Text>
                        </TouchableOpacity> */}

                        {/* Display Saral-Pan Table */}
                        {/* <View style={styles.table}>
                            <Text style={styles.tableHeader}>ulta-Pan</Text> */}
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
                        {/* </View> */}
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

            <View style={styles.buttonGroup}>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>SUBMIT</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteAllButton} onPress={handleClear}>
                    {/* <Icon name="payment" size={16} color="white" /> */}
                    <Text style={styles.deleteAllButtonText}>Payment</Text>
                </TouchableOpacity>
            </View>
            <EntriesList reversedGroupedEntries={data?.reversedGroupedEntries} Delete={handleDelete} handleEdit={handleEdit} userRole={data.role}
                marketResults={data?.results}
            />
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
        marginVertical: 10,
        width: '42%'
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
    subSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 10,
        color: '#333',
    },
    table: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginBottom: 15,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    tableHeaderText: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    tableCell: {
        flex: 1,
        textAlign: 'center',
    },
    deleteButton: {
        flex: 1,
        alignItems: 'center',
    },
    addButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        marginTop: 30,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '60%',
        marginTop: 20,
    },
    button: {
        borderWidth: 1,
        borderColor: 'blue',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'blue',
        fontSize: 16,
    },
    selectedButton: {
        backgroundColor: globalColors.blue,
        borderColor: globalColors.blue,
    },
    selectedButtonText: {
        color: globalColors.white,
    },
});

export default DashboardScreen;
