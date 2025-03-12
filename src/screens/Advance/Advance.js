import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Dropdown } from "react-native-element-dropdown";
import { StyleSheet } from 'react-native';
import { globalColors } from '../../Theme/globalColors';

const Advance = () => {
    const [agentCode, setAgentCode] = useState('');
    const [agentName, setAgentName] = useState('');
    const [paymentMedium, setPaymentMedium] = useState(null);

    const [advance, setAdvance] = useState('');
    const [amount, setAmount] = useState('');
    const [agents, setAgents] = useState([]);

    const paymentOptions = [
        { label: 'Cash', value: "Cash" },
        { label: 'Cheque', value: "Cheque" },
        { label: 'Card', value: "Card" }
    ];
    const advanceOptions = [
        { label: 'DENE', value: 'DENE' },
        { label: 'PAID', value: 'PAID' }
    ];
    const handleSubmit = () => {
        const newAgent = {
            id: `${agents.length + 1}`,
            agentCode,
            agentName,
            paymentMedium,
            advance,
            amount,
            date: new Date().toLocaleDateString(),
        };
        setAgents([...agents, newAgent]);
        setAgentCode('');
        setAgentName('');
        setPaymentMedium('');
        setAdvance('');
        setAmount('');
    };

    const handleDeleteAgent = (id) => {
        const filteredAgents = agents.filter(agent => agent.id !== id);
        setAgents(filteredAgents);
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.srNo}>{item.id}</Text>
            <Text style={styles.name}>{item.agentName}</Text>
            <Text style={styles.agentCode}>{item.agentCode}</Text>
            <Text style={styles.rent}>{item.advance}</Text>
            <Text style={styles.fixedExpenses}>{item.amount}</Text>
            <Text style={styles.commission}>{item.paymentMedium}</Text>
            <View style={styles.actionContainer}>
                <TouchableOpacity onPress={() => { /* handle edit logic here */ }} style={styles.editButton}>
                    <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteAgent(item.id)} style={styles.deleteButton}>
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <ScrollView style={styles.container}>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Agent Code</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Agent Code"
                    value={agentCode}
                    onChangeText={setAgentCode}
                />

                <Text style={styles.label}>Agent Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Agent Name"
                    value={agentName}
                    onChangeText={setAgentName}
                />


                <Text style={styles.label}>Payment Medium</Text>
                <Dropdown
                    data={paymentOptions}
                    value={paymentMedium}
                    onChange={item => setPaymentMedium(item.value)}
                    style={styles.dropdown}
                    placeholder="Payment Medium"
                    labelField="label"
                    valueField="value"
                />


                <Text style={styles.label}>Advance</Text>
                <Dropdown
                    data={advanceOptions}
                    value={advance}
                    onChange={item => setAdvance(item.value)}
                    style={styles.dropdown}
                    placeholder="Advance"
                    labelField="label"
                    valueField="value"
                />

                <Text style={styles.label}>Amount</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Amount"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>

            <View style={styles.card}>
                <ScrollView horizontal>
                    <View style={styles.tableContainer}>
                        <View style={styles.tableHeader}>
                            <Text style={styles.tableHeaderText}>SR.NO</Text>
                            <Text style={styles.tableHeaderText}>NAME</Text>
                            <Text style={styles.tableHeaderText}>AGENT CODE</Text>
                            <Text style={styles.tableHeaderText}>ADVANCE</Text>
                            <Text style={styles.tableHeaderText}>AMOUNT</Text>
                            <Text style={styles.tableHeaderText}>PAYMENT MEDIUM</Text>
                            <Text style={styles.tableHeaderText}>ACTION</Text>
                        </View>
                        <FlatList
                            data={agents}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                        />
                    </View>
                </ScrollView>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: globalColors.white,
        padding: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: globalColors.black,
        marginBottom: 24,
    },
    card: {
        backgroundColor: globalColors.white,
        borderRadius: 12,
        padding: 10,
        shadowColor: globalColors.black,
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    addButton: {
        backgroundColor: globalColors.blue,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    buttonText: {
        color: globalColors.white,
        fontWeight: 'bold',
    },
    tableContainer: {
        minWidth: '100%',
        backgroundColor: globalColors.white,
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: globalColors.borderColor,
        paddingVertical: 12,
    },
    tableHeaderText: {
        color: globalColors.black,
        paddingHorizontal: 16,
        textAlign: 'left',
        fontWeight: 'bold',
    },
    itemContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: globalColors.borderColor,
        paddingVertical: 12,
    },
    itemText: {
        color: '#333',
        paddingHorizontal: 16,
        textAlign: 'left',
    },
    srNo: {
        width: 60,
    },
    name: {
        width: 120,
    },
    agentCode: {
        width: 120,
    },
    rent: {
        width: 100,
    },
    fixedExpenses: {
        width: 120,
    },
    commission: {
        width: 120,
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    editButton: {
        backgroundColor: globalColors.pancypurple,
        padding: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    deleteButton: {
        backgroundColor: globalColors.vividred,
        padding: 8,
        borderRadius: 4,
    },
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: globalColors.borderColor,
        backgroundColor: globalColors.inputbgColor,
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: globalColors.inputLabel,
        marginBottom: 6,
        textTransform: 'uppercase',
    },
    dropdown: {
        borderWidth: 1,
        borderColor: globalColors.borderColor,
        backgroundColor: globalColors.inputbgColor,
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    submitButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20,
    },
});

export default Advance;
