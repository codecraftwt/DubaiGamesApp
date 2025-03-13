
import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    FlatList,
    Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Header from "../../components/Header/Header";
import { globalColors } from "../../Theme/globalColors";

const DashboardScreen = ({ navigation }) => {
    const [agentId, setAgentId] = useState("");
    const [agentName, setAgentName] = useState("");
    const [market, setMarket] = useState("");
    const [date, setDate] = useState("");
    const [openMsg, setOpenMsg] = useState("");
    const [closeMsg, setCloseMsg] = useState("");
    const [number, setNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("JODI");
    const [anotherNumber, setAnotherNumber] = useState("");
    const [saralPanNumber, setSaralPanNumber] = useState("");
    const [saralPanAmount, setSaralPanAmount] = useState("");
    const [saralPanData, setSaralPanData] = useState([]);
    const [saralPanGunule, setsaralPanGunule] = useState([]);
    const [saralPanGunuleAmount, setsaralPanGunuleAmount] = useState([]);

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

    const handleSubmit = () => {
        navigation.navigate("AgentList");
        console.log({
            agentId,
            agentName,
            market,
            date,
            openMsg,
            closeMsg,
            selectedCategory,
            number,
            amount,
        });
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

    return (
        <ScrollView style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.sectionTitle}>Agent Details</Text>

                <View style={styles.row}>
                    <View style={styles.halfWidthInput}>
                        <Text style={styles.label}>AGENT ID</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Agent ID"
                            value={agentId}
                            onChangeText={setAgentId}
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
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Market Name"
                            value={market}
                            onChangeText={setMarket}
                        />
                    </View>
                    <View style={styles.halfWidthInput}>
                        <Text style={styles.label}>DATE</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="DD-MM-YYYY"
                            value={date}
                            onChangeText={setDate}
                        />
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.halfWidthInput}>
                        <Text style={styles.label}>OPEN MSG</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Open Message"
                            value={openMsg}
                            onChangeText={setOpenMsg}
                        />
                    </View>
                    <View style={styles.halfWidthInput}>
                        <Text style={styles.label}>CLOSE MSG</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Close Message"
                            value={closeMsg}
                            onChangeText={setCloseMsg}
                        />
                    </View>
                </View>


                {/* Category Selection */}
                <Text style={styles.sectionTitle}>Select Category</Text>
                <FlatList
                    data={categories}
                    numColumns={3}
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
                                <TextInput style={styles.input} placeholder="Enter Number" value={number} onChangeText={setNumber} />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>ANOTHER NUMBER</Text>
                                <TextInput style={styles.input} placeholder="Enter Another Number" value={anotherNumber} onChangeText={setAnotherNumber} />
                            </View>
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>ENTER AMOUNT</Text>
                            <TextInput style={styles.input} placeholder="Enter Amount" value={amount} onChangeText={setAmount} />
                        </View>
                    </>
                )}

                {selectedCategory === "CUT" && (
                    <>
                        <View style={styles.row}>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>ENTER NUMBER</Text>
                                <TextInput style={styles.input} placeholder="Enter Number" value={number} onChangeText={setNumber} />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>ENTER AMOUNT</Text>
                                <TextInput style={styles.input} placeholder="Enter Amount" value={amount} onChangeText={setAmount} />
                            </View>
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>ENTER ANOTHER NUMBER</Text>
                            <TextInput style={styles.input} placeholder="Enter Another Number" value={anotherNumber} onChangeText={setAnotherNumber} />
                        </View>
                    </>
                )}

                {selectedCategory !== "CYCLE" && selectedCategory !== "RUNNING PAN" && selectedCategory !== "CUT" && selectedCategory !== "SARALPAN" && selectedCategory !== "ULTA PAN" && (
                    <>
                        <View style={styles.row}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>ENTER NUMBER</Text>
                                <TextInput style={styles.input} placeholder="Enter Number" value={number} onChangeText={setNumber} />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>ENTER AMOUNT</Text>
                                <TextInput style={styles.input} placeholder="Enter Amount" value={amount} onChangeText={setAmount} />
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
                                    placeholder="Enter Saral-Pan Number"
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
                                    placeholder="Enter Saral-Pan Number"
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
        </ScrollView >
    );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: globalColors.LightWhite,
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
    formContainer: {
        backgroundColor: globalColors.white,
        margin: 10,
        padding: 10,
        borderRadius: 12,
        shadowColor: globalColors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 21,
        fontWeight: "bold",
        marginBottom: 12,
        color: globalColors.darkBlue,
    },
    inputGroup: {
        marginBottom: 16,
        width: '48%'
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: globalColors.inputLabel,
        marginBottom: 6,
        textTransform: 'uppercase'
    },
    input: {
        height: 40,
        borderWidth: 1,
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
        color: globalColors.darkBlue,
    },
    selectedRadioText: {
        color: globalColors.white,
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
        fontWeight: "bold",
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
        fontWeight: "bold",
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
});

export default DashboardScreen;
