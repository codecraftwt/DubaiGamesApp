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
            <View style={styles.row}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>AGENT CODE</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Agent Code"
                        value={agentCode}
                        onChangeText={setAgentCode}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>AGENT NAME</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Agent Name"
                        value={agentName}
                        onChangeText={setAgentName}
                    />
                </View>
            </View>



            <View style={styles.row}>
                <View style={styles.inputGroup}>
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
                </View>


                <View style={styles.inputGroup}>

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
                </View>

            </View>


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
        backgroundColor: globalColors.inputbgColor,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: globalColors.borderColor,
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
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        marginBottom: 10,
    },
    inputGroup: {
        marginBottom: 10,
        width: '48%'
    },
    dropdown: {
        borderWidth: 1,
        borderColor: globalColors.borderColor,
        backgroundColor: globalColors.inputbgColor,
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    datePicker: {
        borderWidth: 1,
        borderColor: globalColors.borderColor,
        backgroundColor: globalColors.inputbgColor,
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
});

export default DailyResult;
