import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { globalColors } from '../../Theme/globalColors';

const DailyResult = () => {
    const [agentCode, setAgentCode] = useState('');
    const [agentName, setAgentName] = useState('');
    const [market, setMarket] = useState(null);
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    const markets = [
        { label: 'Market 1', value: 'market1' },
        { label: 'Market 2', value: 'market2' },
        { label: 'Market 3', value: 'market3' }
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.header}>DAILY RESULT</Text>

            <Text style={styles.label}>AGENT CODE</Text>
            <TextInput
                style={styles.input}
                placeholder="Agent Code"
                value={agentCode}
                onChangeText={setAgentCode}
            />

            <Text style={styles.label}>AGENT NAME</Text>
            <TextInput
                style={styles.input}
                placeholder="Agent Name"
                value={agentName}
                onChangeText={setAgentName}
            />

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

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Show</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        borderColor: globalColors.white,
        justifyContent: 'center',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: globalColors.labelField,
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: globalColors.borderColor,
        padding: 12,
        backgroundColor: globalColors.inputbgColor,
        borderRadius: 8,
        marginBottom: 12,
        fontSize: 16,
    },
    dropdown: {
        borderWidth: 1,
        borderColor: globalColors.borderColor,
        padding: 12,
        backgroundColor: globalColors.inputbgColor,
        borderRadius: 8,
        marginBottom: 12,
    },
    datePicker: {
        borderWidth: 1,
        borderColor: globalColors.borderColor,
        padding: 12,
        backgroundColor: globalColors.inputbgColor,
        borderRadius: 8,
        marginBottom: 12,
    },
    button: {
        backgroundColor: globalColors.blue,
        padding: 16,
        borderRadius: 8,
        marginTop: 16,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: globalColors.white,
    },
});

export default DailyResult;
