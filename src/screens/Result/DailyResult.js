import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { globalColors } from '../../Theme/globalColors';
import { fetchAgentByCode, fetchAgentByName } from '../../Redux/Slices/autoCompleteSlice';
import { useDispatch, useSelector } from 'react-redux';
import DynamicDropdown from '../DynamicDropdown';
import { fetchDailyResult } from '../../Redux/Slices/dailyResultSlice';

const DailyResult = () => {
    const dispatch = useDispatch();

    const [agentId, setAgentId] = useState('');
    const [agentName, setAgentName] = useState('');
    const [market, setMarket] = useState(null);
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [id, setId] = useState(0);

    const { agentInfo } = useSelector((state) => state.autoComplete);
    const { data } = useSelector((state) => state.dailyResult);

    const markets = [
        { label: 'Kalyan', value: 'Kalyan' },
        { label: 'Mumbai', value: 'Mumbai' }
    ];

    const handleSelectByCode = (code) => {
        dispatch(fetchAgentByCode(code));
    };

    const handleSelectByName = (name) => {
        dispatch(fetchAgentByName(name));
    };

    const formatDate = (date) => {
        return date.toISOString().split("T")[0];
    };

    useEffect(() => {
        if (agentInfo) {
            setAgentName(agentInfo.name);
            setAgentId(agentInfo.agentcode);
            setId(agentInfo.id);
        }
    }, [agentInfo]);

    const HandlePress = () => {
        const formattedDate = formatDate(date);
        dispatch(fetchDailyResult({
            agentName,
            market,
            date: formattedDate,
            agentId: id,
        }));
    };

    const ResultDisplay = ({ data }) => {
        if (!data || Object.keys(data.results || {}).length === 0) return null;

        const result = Object.values(data.results)[0];

        return (
            <View style={styles.resultContainer}>
                <View style={styles.resultHeader}>
                    <Text style={styles.resultHeaderText}>
                        AGENT - {result.market} - {result.result} - DATE: {format(date, 'yyyy-MM-dd')}
                    </Text>
                </View>

                <View style={styles.resultContent}>
                    <View style={styles.resultColumn}>
                        <View style={styles.resultSection}>
                            <Text style={styles.sectionHeader}>पेमेंट</Text>
                            <View style={styles.row}>
                                <Text style={styles.label}>जोडी</Text>
                                <Text style={styles.value}>{result.jodi}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>एकूण</Text>
                                <Text style={styles.value}>{result.totalOpenWin}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.resultColumn}>
                        <View style={styles.resultSection}>
                            <Text style={styles.sectionHeader}>एकूण</Text>
                            <View style={styles.row}>
                                <Text style={styles.label}>ओपन काम</Text>
                                <Text style={styles.value}>{result.totalOpenPlay}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>क्लोज काम</Text>
                                <Text style={styles.value}>{result.totalClosePlay}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>एकूण</Text>
                                <Text style={styles.value}>{parseFloat(result.totalOpenPlay) + parseFloat(result.totalClosePlay)}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>कट क्लोज</Text>
                                <Text style={styles.value}>{parseFloat(result.cut_close)}</Text>
                            </View>
                            {/* cut_close */}
                            <View style={styles.row}>
                                <Text style={styles.label}>कमीशन</Text>
                                <Text style={styles.value}>{result.commission}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>एकूण</Text>
                                <Text style={styles.value}>{parseFloat(result.totalOpenPlay) - parseFloat(result.commission)}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>पेमेंट</Text>
                                <Text style={styles.value}>{result.totalOpenWin}</Text>
                            </View>
                            {/* मागील पेमेंट */}


                            <View style={styles.row}>
                                <Text style={styles.label}>देणे</Text>
                                <Text style={[styles.value, { color: 'red' }]}>{(parseFloat(result.totalOpenPlay) - parseFloat(result.commission)) - result.totalOpenWin}</Text>
                            </View>

                            <View style={styles.row}>
                                <Text style={styles.label}>मागील पेमेंट</Text>
                                <Text style={[styles.value, { color: 'red' }]}>{result.remaining}</Text>
                            </View>
                            {/* एकूण देणे */}
                            <View style={styles.row}>
                                <Text style={styles.label}> एकूण देणे</Text>
                                <Text style={[styles.value, { color: 'red' }]}>{(parseFloat(result.totalOpenPlay) - parseFloat(result.commission)) - result.totalOpenWin - result.remaining}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={styles.addLedgerButton}>
                    <Text style={styles.addLedgerButtonText}>ADD TO LEDGER</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Daily Result</Text>
            <View style={styles.row}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>AGENT CODE</Text>
                    <DynamicDropdown
                        onSelect={handleSelectByCode}
                        placeholder="Agent Code"
                        searchType="code"
                        value={agentId}
                    />
                </View>

                <View style={styles.inputGroup}>
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

            <TouchableOpacity onPress={HandlePress} style={styles.button}>
                <Text style={styles.buttonText}>Show</Text>
            </TouchableOpacity>

            <ResultDisplay data={data} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: globalColors.white,
    },
    header: {
        fontSize: 20,
        fontFamily: 'Poppins-Bold',
        color: '#1F2937',
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Poppins-Bold',
        color: globalColors.inputLabel,
    },
    input: {
        backgroundColor: globalColors.inputbgColor,
        borderRadius: 8,
        fontFamily: 'Poppins-Medium',
        borderWidth: 1,
        borderColor: globalColors.borderColor,
    },
    button: {
        backgroundColor: globalColors.blue,
        padding: 12,
        borderRadius: 8,
        marginTop: 16,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
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
    resultContainer: {
        marginTop: 20,
        borderWidth: 1,
        borderColor: globalColors.borderColor,
        borderRadius: 8,
        overflow: 'hidden',
    },
    resultHeader: {
        backgroundColor: globalColors.Wisteria,
        padding: 12,
    },
    resultHeaderText: {
        color: globalColors.white,
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        textAlign: 'center',
    },
    resultContent: {
        // flexDirection: 'row',
        padding: 16,
    },
    resultColumn: {
        flex: 1,
    },
    resultSection: {
        marginBottom: 16,
    },
    sectionHeader: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        color: globalColors.blue,
        marginBottom: 8,
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    value: {
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
        color: globalColors.textPrimary,
    },
    addLedgerButton: {
        backgroundColor: globalColors.blue,
        padding: 12,
        margin: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    addLedgerButtonText: {
        color: globalColors.white,
        fontSize: 14,
        fontFamily: 'Poppins-Bold',
    },
});

export default DailyResult;