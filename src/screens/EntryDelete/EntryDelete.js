import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { globalColors } from '../../Theme/globalColors';

const EntryDelete = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [totalRecords, setTotalRecords] = useState(12); // Example record count

    const onChangeStart = (event, selectedDate) => {
        const currentDate = selectedDate || startDate;
        setShowStartDatePicker(false);
        setStartDate(currentDate);
    };

    const onChangeEnd = (event, selectedDate) => {
        const currentDate = selectedDate || endDate;
        setShowEndDatePicker(false);
        setEndDate(currentDate);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>ENTRY DELETE</Text>

            <View style={styles.dateInputs}>
                <View style={styles.dateInput}>
                    <Text>START DATE</Text>
                    <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.input}>
                        <Text>{startDate.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                    {showStartDatePicker && (
                        <DateTimePicker
                            value={startDate}
                            mode="date"
                            display="default"
                            onChange={onChangeStart}
                        />
                    )}
                </View>

                <View style={styles.dateInput}>
                    <Text>END DATE</Text>
                    <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.input}>
                        <Text>{endDate.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                    {showEndDatePicker && (
                        <DateTimePicker
                            value={endDate}
                            mode="date"
                            display="default"
                            onChange={onChangeEnd}
                        />
                    )}
                </View>
            </View>

            <TouchableOpacity style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>

            <View style={styles.recordInfo}>
                <Text style={styles.recordInfoText}>
                    RECORD INFORMATION
                </Text>


                <View style={styles.recordInfoChild}>
                    <Text style={styles.recordText}>
                        DATE RANGE:
                    </Text>
                    <Text>{startDate.toLocaleDateString()}
                        TO {endDate.toLocaleDateString()}</Text>
                </View>
                <View style={styles.recordInfoChild}>
                    <Text style={styles.recordText}>
                        TOTAL RECORDS COUNT:
                    </Text>
                    <Text>{totalRecords}</Text>
                </View>

                <View style={styles.lastUpdatedText}>
                    <Text style={styles.lastUpdatedText}> last updated date:   {new Date().toLocaleDateString()}
                    </Text>

                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: globalColors.LightWhite,
    },
    title: {
        fontSize: 21,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    dateInputs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    dateInput: {
        width: '45%',
        color: globalColors.black,
    },
    input: {
        padding: 10,
        borderWidth: 1,
        borderColor: globalColors.borderColor,
        backgroundColor: globalColors.inputbgColor,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: globalColors.vividred,
        padding: 15,
        alignItems: 'center',
        marginBottom: 20,
    },
    deleteButtonText: {
        color: 'white',
        fontSize: 18,
    },
    recordInfo: {
        backgroundColor: globalColors.white,
        padding: 15,
        marginTop: 20,
        borderRadius: 8,
    },
    recordInfoText: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 10,
        alignSelf: 'center'
    },
    recordText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: globalColors.black,
        marginBottom: 5,
    },
    lastUpdatedText: {
        fontSize: 12,
        color: globalColors.black,
        alignSelf: "center",
        margin: 10
    },
    recordInfoChild: {
        flexDirection: 'row',
        gap: 10
    }
});

export default EntryDelete;
