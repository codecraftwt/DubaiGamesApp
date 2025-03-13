import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Button, StyleSheet, Dimensions } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';

const { width } = Dimensions.get('window');

const AddPaymentReport = () => {
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState(null);

    const agents = [
        { label: 'Agent 1', value: '1' },
        { label: 'Agent 2', value: '2' },
        { label: 'Agent 3', value: '3' }
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>AGENT ADD PAYMENT</Text>
            <Text style={styles.label}>AGENT CODE</Text>
            <Dropdown
                data={agents}
                labelField="label"
                valueField="value"
                placeholder="Select Agent Code"
                value={selectedAgent}
                onChange={item => setSelectedAgent(item.value)}
                style={styles.dropdown}
            />


            <Text style={styles.sectionTitle}>AGENT TRANSACTIONS</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={[styles.tableContainer, { minWidth: width * 1.2 }]}>
                    <View style={styles.tableHeader}>
                        {['SR', 'TRANSACTION DATE', 'AGENT CODE', 'AGENT NAME', 'PAYMENT TYPE', 'YENE / DENE', 'AMOUNT'].map((header, index) => (
                            <Text key={index} style={styles.headerCell}>{header}</Text>
                        ))}
                    </View>
                    <Text style={styles.noData}>NO DATA AVAILABLE IN TABLE</Text>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flex: 1
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007bff',
        marginBottom: 10
    },
    label: {
        fontSize: 16,
        marginTop: 10
    },
    dropdown: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        marginTop: 5
    },
    sectionTitle: {
        backgroundColor:
            '#007bff',
        color: '#fff',
        padding: 10,
        marginVertical: 10
    },
    tableContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        paddingVertical: 10
    },
    headerCell: {
        flex: 1,
        padding: 10,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    noData: {
        textAlign: 'center',
        padding: 20,
        color: '#888'
    }
});

export default AddPaymentReport;