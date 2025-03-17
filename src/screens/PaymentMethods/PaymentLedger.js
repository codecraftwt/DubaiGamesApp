import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Platform,
    Modal,
    SafeAreaView
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { globalColors } from '../../Theme/globalColors';

const PaymentLedger = () => {
    // Form state
    const [market, setMarket] = useState(null);
    const [paymentMedium, setPaymentMedium] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [agentId, setAgentId] = useState('');
    const [agentName, setAgentName] = useState('');
    const [transactionHead, setTransactionHead] = useState(null);
    const [transactionType, setTransactionType] = useState(null);
    const [amount, setAmount] = useState('');

    // Filter state
    const [filterTransType, setFilterTransType] = useState(null);
    const [filterTransHead, setFilterTransHead] = useState(null);
    const [filterAgentCode, setFilterAgentCode] = useState(null);
    const [filterMarket, setFilterMarket] = useState(null);
    const [filterStartDate, setFilterStartDate] = useState(new Date());
    const [filterEndDate, setFilterEndDate] = useState(new Date());

    // Date picker visibility
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showFilterStartDatePicker, setShowFilterStartDatePicker] = useState(false);
    const [showFilterEndDatePicker, setShowFilterEndDatePicker] = useState(false);

    // Table state
    const [entries, setEntries] = useState(30);
    const [tableData, setTableData] = useState([]);

    // Dropdown data
    const marketData = [
        { label: 'Kalyan', value: 'kalyan' },
        { label: 'Mumbai', value: 'mumbai' },
        { label: 'Delhi', value: 'delhi' },
    ];

    const paymentMediumData = [
        { label: 'Cash', value: 'cash' },
        { label: 'Bank Transfer', value: 'bank' },
        { label: 'UPI', value: 'upi' },
    ];

    const transactionHeadData = [
        { label: 'Salary', value: 'salary' },
        { label: 'Commission', value: 'commission' },
        { label: 'Bonus', value: 'bonus' },
    ];

    const transactionTypeData = [
        { label: 'Credit', value: 'credit' },
        { label: 'Debit', value: 'debit' },
    ];

    const agentCodeData = [
        { label: 'AG001', value: 'AG001' },
        { label: 'AG002', value: 'AG002' },
        { label: 'AG003', value: 'AG003' },
    ];

    // Format date for display
    const formatDate = (date) => {
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    };

    // Handle date changes
    const onStartDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || startDate;
        setShowStartDatePicker(Platform.OS === 'ios');
        setStartDate(currentDate);
    };

    const onFilterStartDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || filterStartDate;
        setShowFilterStartDatePicker(Platform.OS === 'ios');
        setFilterStartDate(currentDate);
    };

    const onFilterEndDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || filterEndDate;
        setShowFilterEndDatePicker(Platform.OS === 'ios');
        setFilterEndDate(currentDate);
    };

    // Handle form submission
    const handleSubmit = () => {
        console.log({
            market,
            paymentMedium,
            startDate,
            agentId,
            agentName,
            transactionHead,
            transactionType,
            amount
        });
        // Add API call or data processing here
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Text style={styles.header}>Payment Ledger</Text>

                {/* Form Section */}
                <View style={styles.formSection}>
                    <View style={styles.row}>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>MARKET</Text>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                data={marketData}
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Select Market"
                                value={market}
                                onChange={item => setMarket(item.value)}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>PAYMENT MEDIUM</Text>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                data={paymentMediumData}
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Select Payment Medium"
                                value={paymentMedium}
                                onChange={item => setPaymentMedium(item.value)}
                            />
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>START DATE</Text>
                            <TouchableOpacity
                                style={styles.datePickerButton}
                                onPress={() => setShowStartDatePicker(true)}
                            >
                                <Text style={styles.dateText}>{formatDate(startDate)}</Text>
                                <Ionicons name="calendar-outline" size={20} color="#333" />
                            </TouchableOpacity>
                            {showStartDatePicker && (
                                <DateTimePicker
                                    value={startDate}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={onStartDateChange}
                                />
                            )}
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>AGENT ID</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Agent code"
                                value={agentId}
                                onChangeText={setAgentId}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>AGENT NAME</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Agent name"
                                value={agentName}
                                onChangeText={setAgentName}
                            />
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>TRANSACTION HEAD</Text>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                data={transactionHeadData}
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Select Transaction head"
                                value={transactionHead}
                                onChange={item => setTransactionHead(item.value)}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>TRANSACTION TYPE</Text>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                data={transactionTypeData}
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Select Transaction Type"
                                value={transactionType}
                                onChange={item => setTransactionType(item.value)}
                            />
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>AMOUNT</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter amount"
                                value={amount}
                                onChangeText={setAmount}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
                </View>

                {/* Filter Section */}
                <View style={styles.filterSection}>
                    <View style={styles.row}>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>TRANSACTION TYPE</Text>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                data={transactionTypeData}
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Select Transaction Type"
                                value={filterTransType}
                                onChange={item => setFilterTransType(item.value)}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>TRANSACTION HEAD</Text>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                data={transactionHeadData}
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Select Transaction"
                                value={filterTransHead}
                                onChange={item => setFilterTransHead(item.value)}
                            />
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>AGENT CODE</Text>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                data={agentCodeData}
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Select Agent Code"
                                value={filterAgentCode}
                                onChange={item => setFilterAgentCode(item.value)}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>MARKET</Text>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                data={marketData}
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Select Market"
                                value={filterMarket}
                                onChange={item => setFilterMarket(item.value)}
                            />
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>START</Text>
                            <TouchableOpacity
                                style={styles.datePickerButton}
                                onPress={() => setShowFilterStartDatePicker(true)}
                            >
                                <Text style={styles.dateText}>{formatDate(filterStartDate)}</Text>
                                <Ionicons name="calendar-outline" size={20} color="#333" />
                            </TouchableOpacity>
                            {showFilterStartDatePicker && (
                                <DateTimePicker
                                    value={filterStartDate}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={onFilterStartDateChange}
                                />
                            )}
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>END</Text>
                            <TouchableOpacity
                                style={styles.datePickerButton}
                                onPress={() => setShowFilterEndDatePicker(true)}
                            >
                                <Text style={styles.dateText}>{formatDate(filterEndDate)}</Text>
                                <Ionicons name="calendar-outline" size={20} color="#333" />
                            </TouchableOpacity>
                            {showFilterEndDatePicker && (
                                <DateTimePicker
                                    value={filterEndDate}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={onFilterEndDateChange}
                                />
                            )}
                        </View>
                    </View>
                </View>

                {/* Table Controls */}
                <View style={styles.tableControls}>
                    <View style={styles.entriesControl}>
                        <Text>SHOW</Text>
                        <View style={styles.entriesDropdownContainer}>
                            <Text style={styles.entriesDropdown}>{entries}</Text>
                        </View>
                        <Text>ENTRIES</Text>
                    </View>

                    <View style={styles.exportButtons}>
                        <TouchableOpacity style={styles.exportButton}>
                            <Text style={styles.exportButtonText}>Excel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.exportButton, styles.pdfButton]}>
                            <Text style={styles.exportButtonText}>PDF</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Table */}
                <ScrollView horizontal>
                    <View style={styles.tableContainer}>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.tableHeaderCell, { width: 50 }]}>SR.</Text>
                            <Text style={[styles.tableHeaderCell, { width: 120 }]}>AGENT NAME</Text>
                            <Text style={[styles.tableHeaderCell, { width: 100 }]}>AGENT CODE</Text>
                            <Text style={[styles.tableHeaderCell, { width: 100 }]}>MARKET</Text>
                            <Text style={[styles.tableHeaderCell, { width: 120 }]}>TRANS. HEAD</Text>
                            <Text style={[styles.tableHeaderCell, { width: 120 }]}>TRANS. TYPE</Text>
                            <Text style={[styles.tableHeaderCell, { width: 100 }]}>AMOUNT</Text>
                            <Text style={[styles.tableHeaderCell, { width: 100 }]}>DATE</Text>
                            <Text style={[styles.tableHeaderCell, { width: 120 }]}>PAYMENT MEDIUM</Text>
                            <Text style={[styles.tableHeaderCell, { width: 80 }]}>ACTION</Text>
                        </View>

                        {tableData.length === 0 ? (
                            <View style={styles.noDataRow}>
                                <Text style={styles.noDataText}>NO DATA AVAILABLE IN TABLE</Text>
                            </View>
                        ) : (
                            tableData.map((item, index) => (
                                <View key={index} style={styles.tableRow}>
                                    {/* Table row data would go here */}
                                </View>
                            ))
                        )}
                    </View>
                </ScrollView>

                {/* Summary Section */}
                <View style={styles.summarySection}>
                    <View style={styles.balanceRow}>
                        <Text style={styles.balanceLabel}>REMAIN BALANCE</Text>
                        <View style={styles.balanceValues}>
                            <Text style={styles.creditText}>CREDIT: 0.00</Text>
                            <Text style={styles.debitText}>DEBIT: 0.00</Text>
                            <Text style={styles.balanceText}>BALANCE: 0.00</Text>
                        </View>
                    </View>
                </View>

                {/* Pagination */}
                <View style={styles.pagination}>
                    <Text style={styles.paginationInfo}>SHOWING 0 TO 0 OF 0 ENTRIES</Text>
                    <View style={styles.paginationButtons}>
                        <TouchableOpacity style={[styles.paginationButton, styles.paginationButtonDisabled]}>
                            <Text style={styles.paginationButtonText}>PREVIOUS</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.paginationButton, styles.paginationButtonDisabled]}>
                            <Text style={styles.paginationButtonText}>NEXT</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 22,
        fontFamily: 'Poppins-Bold',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    formSection: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    filterSection: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 16,
        flexWrap: 'wrap',
    },
    formGroup: {
        flex: 1,
        marginRight: 8,
        minWidth: 150,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Poppins-Bold',
        color: globalColors.inputLabel,
        marginBottom: 4,
        textTransform: 'uppercase'
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: globalColors.borderColor,
        fontFamily: 'Poppins-Medium',
        borderRadius: 4,
        paddingHorizontal: 10,
    },
    dropdown: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        paddingHorizontal: 10,
    },
    placeholderStyle: {
        fontSize: 14,
        color: '#888',
    },
    selectedTextStyle: {
        fontSize: 14,

    },
    datePickerButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        paddingHorizontal: 10,
    },
    dateText: {
        fontSize: 14,
    },
    submitButton: {
        backgroundColor: '#007bff',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 4,
        alignSelf: 'flex-start',
        marginTop: 8,
    },
    submitButtonText: {
        color: '#fff',
        fontFamily: 'Poppins-Bold',
    },
    tableControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    entriesControl: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    entriesDropdownContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginHorizontal: 8,
    },
    entriesDropdown: {
        fontSize: 14,
    },
    exportButtons: {
        flexDirection: 'row',
    },
    exportButton: {
        backgroundColor: '#28a745',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 4,
        marginLeft: 8,
    },
    pdfButton: {
        backgroundColor: '#dc3545',
    },
    exportButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    tableContainer: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginHorizontal: 16,
        marginBottom: 16,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f8f9fa',
        borderBottomWidth: 2,
        borderBottomColor: '#dee2e6',
    },
    tableHeaderCell: {
        padding: 12,
        fontFamily: 'Poppins-Bold',
        fontSize: 12,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    noDataRow: {
        padding: 16,
        alignItems: 'center',
    },
    noDataText: {
        color: '#666',
    },
    summarySection: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    balanceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    balanceLabel: {
        fontWeight: 'bold',
    },
    balanceValues: {
        // flexDirection: 'row',
        flexWrap: 'wrap',
    },
    creditText: {
        color: '#28a745',
        marginRight: 8,
        fontWeight: 'bold',
    },
    debitText: {
        color: '#dc3545',
        marginRight: 8,
        fontWeight: 'bold',
    },
    balanceText: {
        fontWeight: 'bold',
    },
    pagination: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    paginationInfo: {
        fontSize: 12,
        marginBottom: 8,
    },
    paginationButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    paginationButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        marginLeft: 8,
    },
    paginationButtonDisabled: {
        backgroundColor: '#f8f9fa',
    },
    paginationButtonText: {
        fontSize: 12,
    },
});

export default PaymentLedger;