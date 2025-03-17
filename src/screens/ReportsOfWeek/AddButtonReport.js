import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Button, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';
import { globalColors } from '../../Theme/globalColors';
import { format } from 'date-fns';

const { width } = Dimensions.get('window');

const AddButtonReport = () => {
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState(null);

    const agents = [
        { label: 'AG123', value: 'AG123' },
        { label: 'AG456', value: 'AG456' },
        { label: 'AG789', value: 'AG789' }
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Agent Add Button</Text>
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
            <Text style={styles.label}>Select date</Text>
            {/* <Button title="Select Date" onPress={() => setShowDatePicker(true)} /> */}
            <TouchableOpacity
                onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
                <Text>
                    {format(date, 'dd-MM-yyyy')}
                </Text>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) setDate(selectedDate);
                    }}
                />
            )}

            <Text style={styles.sectionTitle}>AGENT RECORDS NOT ADDED IN LEDGER</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={[styles.tableContainer, { minWidth: width * 1.2 }]}>
                    <View style={styles.tableHeader}>
                        {['SR', 'AGENT CODE', 'NAME', 'MARKET', 'DATE'].map((header, index) => (
                            <Text key={index} style={styles.headerCell}>{header}</Text>
                        ))}
                    </View>
                    <View style={styles.tableRow}>
                        {[1, '001', '001', 'KALYAN', '3/11/2025'].map((item, index) => (
                            <Text key={index} style={styles.cell}>{item}</Text>
                        ))}
                    </View>
                    <View style={styles.tableRow}>
                        {[2, '001', '001', 'MUMBAI', '3/11/2025'].map((item, index) => (
                            <Text key={index} style={styles.cell}>{item}</Text>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: globalColors.LightWhite
    },
    title: {
        fontSize: 22,
        fontFamily: 'Poppins-Bold',
        marginBottom: 20
    },
    label: {
        fontSize: 14,
        fontFamily: 'Poppins-Bold',
        color: globalColors.inputLabel,
        textTransform: 'uppercase'
    },
    dropdown: {
        borderWidth: 1,
        borderColor: globalColors.borderColor,
        backgroundColor: globalColors.inputbgColor,
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    sectionTitle: {
        backgroundColor: '#007bff',
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
        backgroundColor: '#d0e2ff',
        paddingVertical: 10
    },
    tableRow: {
        flexDirection: 'row',
        backgroundColor: '#f9f9f9',
        paddingVertical: 10
    },
    headerCell: {
        flex: 1, padding: 8,
        fontFamily: 'Poppins-Bold',
        textAlign: 'center'
    },
    cell: {
        flex: 1,
        padding: 10,
        textAlign: 'center',
        fontFamily: 'Poppins-Medium',
    },
    datePicker: {
        borderWidth: 1,
        borderColor: globalColors.borderColor,
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
});

export default AddButtonReport;