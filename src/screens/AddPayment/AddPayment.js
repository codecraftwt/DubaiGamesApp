import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';
import { globalColors } from '../../Theme/globalColors';

const AddPayment = () => {
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [market, setMarket] = useState('Kalyan');
    const [paymentMedium, setPaymentMedium] = useState('Cash');
    const [transactionHead, setTransactionHead] = useState('');
    const [transactionType, setTransactionType] = useState('');
    const [agentId, setAgentId] = useState('');
    const [agentName, setAgentName] = useState('');
    const [amount, setAmount] = useState('');
    const [addNote, setAddNote] = useState('');

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(false);
        setDate(currentDate);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>ADD PAYMENT</Text>

            <View style={styles.row}>
                <Text style={styles.label}>MARKET</Text>
                <Dropdown
                    data={[
                        { label: 'Kalyan', value: 'Kalyan' },
                        { label: 'Market 2', value: 'Market 2' }
                    ]}
                    value={market}
                    style={styles.input}
                    onChange={item => setMarket(item.value)}
                />
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>DATE</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
                    <Text>{date.toLocaleDateString()}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={onChangeDate}
                    />
                )}
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>AGENT ID</Text>
                <TextInput
                    style={styles.input}
                    value={agentId}
                    onChangeText={setAgentId}
                />
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>AGENT NAME</Text>
                <TextInput
                    style={styles.input}
                    value={agentName}
                    onChangeText={setAgentName}
                />
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>PAYMENT MEDIUM</Text>
                <Dropdown
                    data={[
                        { label: 'Cash', value: 'Cash' },
                        { label: 'Credit', value: 'Credit' }
                    ]}
                    value={paymentMedium}
                    style={styles.input}
                    onChange={item => setPaymentMedium(item.value)}
                    labelField="label"
                    valueField="value"
                />
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>TRANSACTION HEAD</Text>
                <Dropdown
                    data={[
                        { label: 'Select Transaction Head', value: '' },
                        { label: 'Head 1', value: 'Head 1' }
                    ]}
                    labelField="label"
                    valueField="value"
                    value={transactionHead}
                    style={styles.input}
                    onChange={item => setTransactionHead(item.value)}
                />
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>TRANSACTION TYPE</Text>
                <Dropdown
                    data={[
                        { label: 'Select Transaction Type', value: '' },
                        { label: 'Type 1', value: 'Type 1' }
                    ]}
                    labelField="label"
                    valueField="value"
                    value={transactionType}
                    style={styles.input}
                    onChange={item => setTransactionType(item.value)}
                />
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>AMOUNT</Text>
                <TextInput
                    style={styles.input}
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>ADD NOTE</Text>
                <TextInput
                    style={styles.textArea}
                    value={addNote}
                    onChangeText={setAddNote}
                    multiline
                />
            </View>

            <TouchableOpacity style={styles.submitButton}>
                <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: globalColors.LightWhite,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    row: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: globalColors.inputLabel
    },
    input: {
        height: 40,
        borderColor: globalColors.borderColor,
        backgroundColor: globalColors.inputbgColor,
        borderWidth: 1,
        paddingLeft: 10,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingLeft: 10,
        fontSize: 16,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 15,
        marginTop: 20,
        alignItems: 'center',
        borderRadius: 5,
    },
    submitText: {
        color: 'white',
        fontSize: 18,
    },
});

export default AddPayment;
