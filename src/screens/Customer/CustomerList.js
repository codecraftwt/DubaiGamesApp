import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    Alert,
    Modal,
    StyleSheet,
    SafeAreaView,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CustomerList = () => {
    // const dispatch = useDispatch();
    // const { customers, loading } = useSelector((state) => state.customers);
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage] = useState(10);

    const [formData, setFormData] = useState({
        id: null,
        name: '',
        email: '',
        phone_number: '',
        pass: '',
        code: ''
    });

    // useEffect(() => {
    //     dispatch(fetchCustomers());
    // }, [dispatch]);

    // useEffect(() => {
    //     if (searchQuery) {
    //         const filtered = customers.filter(customer =>
    //             customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //             customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //             customer.code.includes(searchQuery)
    //         );
    //         setFilteredCustomers(filtered);
    //     } else {
    //         setFilteredCustomers(customers);
    //     }
    // }, [searchQuery, customers]);

    const handleAddCustomer = () => {
        setFormData({
            id: null,
            name: '',
            email: '',
            phone_number: '',
            pass: '',
            code: ''
        });
        setModalVisible(true);
    };

    const handleEditCustomer = (customer) => {
        setFormData({ ...customer });
        setModalVisible(true);
    };

    const handleDeleteCustomer = (id) => {
        Alert.alert(
            'Delete Customer',
            'Are you sure you want to delete this customer?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    // onPress: () => dispatch(deleteCustomer(id)),
                    style: 'destructive'
                }
            ]
        );
    };

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;

        if (!formData.name.trim()) {
            Alert.alert('Error', 'Name is required');
            return false;
        }
        if (!emailRegex.test(formData.email)) {
            Alert.alert('Error', 'Invalid email address');
            return false;
        }
        if (!phoneRegex.test(formData.phone_number)) {
            Alert.alert('Error', 'Invalid phone number');
            return false;
        }
        if (formData.pass.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return false;
        }
        return true;
    };

    const handleSaveCustomer = () => {
        if (!validateForm()) return;

        if (formData.id) {
            // dispatch(updateCustomer(formData));
        } else {
            const newCustomer = {
                ...formData,
                id: Date.now(),
                code: Math.random().toString(36).substr(2, 6).toUpperCase()
            };
            // dispatch(addCustomer(newCustomer));
        }
        setModalVisible(false);
    };

    const renderTableHeader = () => (
        <View style={styles.tableHeader}>
            <View style={[styles.tableCell, styles.indexCell]}>
                <Text style={styles.tableHeaderText}>ID</Text>
            </View>
            <View style={[styles.tableCell, styles.nameCell]}>
                <Text style={styles.tableHeaderText}>NAME</Text>
            </View>
            <View style={[styles.tableCell, styles.emailCell]}>
                <Text style={styles.tableHeaderText}>EMAIL</Text>
            </View>
            <View style={[styles.tableCell, styles.phoneCell]}>
                <Text style={styles.tableHeaderText}>PHONE</Text>
            </View>
            {/* <View style={[styles.tableCell, styles.codeCell]}>
                <Text style={styles.tableHeaderText}>CODE</Text>
            </View> */}
            <View style={[styles.tableCell, styles.actionCell]}>
                <Text style={styles.tableHeaderText}>ACTIONS</Text>
            </View>
        </View>
    );

    const renderCustomerItem = ({ item, index }) => (
        <View style={styles.tableRow}>
            <View style={[styles.tableCell, styles.indexCell]}>
                <Text style={styles.indexText}>{index + 1}</Text>
            </View>
            <View style={[styles.tableCell, styles.nameCell]}>
                <Text style={styles.nameText}>{item.name}</Text>
            </View>
            <View style={[styles.tableCell, styles.emailCell]}>
                <Text style={styles.emailText}>{item.email}</Text>
            </View>
            <View style={[styles.tableCell, styles.phoneCell]}>
                <Text style={styles.phoneText}>{item.phone_number}</Text>
            </View>
            {/* <View style={[styles.tableCell, styles.codeCell]}>
                <Text style={styles.codeText}>{item.code}</Text>
            </View> */}
            <View style={[styles.tableCell, styles.actionCell]}>
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => handleEditCustomer(item)}
                    >
                        <Icon name="edit" size={16} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteCustomer(item.id)}
                    >
                        <Icon name="trash" size={16} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Customer Management</Text>

                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.searchContainer}>
                            <Icon name="search" size={20} color="#666" />
                            <TextInput
                                style={styles.searchInput}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholder="Search customers..."
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={handleAddCustomer}
                        >
                            <Icon name="plus" size={20} color="#fff" />
                            <Text style={styles.addButtonText}>Add Customer</Text>
                        </TouchableOpacity>
                    </View>

                    {/* {loading ? (
                        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
                    ) : ( */}
                    <ScrollView horizontal>
                        <View>
                            {renderTableHeader()}
                            <FlatList
                                data={filteredCustomers}
                                renderItem={renderCustomerItem}
                                keyExtractor={(item) => item.id.toString()}
                                ListEmptyComponent={
                                    <View style={styles.emptyContainer}>
                                        <Text style={styles.emptyText}>No customers found</Text>
                                    </View>
                                }
                            />
                        </View>
                    </ScrollView>
                    {/* )} */}
                </View>
            </View>

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.modalOverlay}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {formData.id ? 'Edit Customer' : 'Add Customer'}
                            </Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <MaterialIcons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody}>
                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>Name</Text>
                                <TextInput
                                    style={styles.formInput}
                                    value={formData.name}
                                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                                    placeholder="Enter name"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>Email</Text>
                                <TextInput
                                    style={styles.formInput}
                                    value={formData.email}
                                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                                    placeholder="Enter email"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>Phone Number</Text>
                                <TextInput
                                    style={styles.formInput}
                                    value={formData.phone_number}
                                    onChangeText={(text) => setFormData({ ...formData, phone_number: text })}
                                    placeholder="Enter phone number"
                                    keyboardType="phone-pad"
                                    maxLength={10}
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>Password</Text>
                                <TextInput
                                    style={styles.formInput}
                                    value={formData.pass}
                                    onChangeText={(text) => setFormData({ ...formData, pass: text })}
                                    placeholder="Enter password"
                                    secureTextEntry
                                />
                            </View>
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleSaveCustomer}
                            >
                                <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 8,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
    },
    addButton: {
        backgroundColor: '#007AFF',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
    },
    addButtonText: {
        color: '#fff',
        marginLeft: 8,
        fontWeight: 'bold',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f8f9fa',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    tableCell: {
        padding: 16,
        justifyContent: 'center',
    },
    indexCell: { width: 60 },
    nameCell: { width: 150 },
    emailCell: { width: 200 },
    phoneCell: { width: 120 },
    codeCell: { width: 100 },
    actionCell: { width: 120 },
    tableHeaderText: {
        fontWeight: 'bold',
        color: '#333',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    editButton: {
        backgroundColor: '#007AFF',
        padding: 8,
        borderRadius: 4,
    },
    deleteButton: {
        backgroundColor: '#FF3B30',
        padding: 8,
        borderRadius: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        width: '90%',
        maxWidth: 500,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 4,
    },
    modalBody: {
        padding: 16,
        maxHeight: 400,
    },
    formGroup: {
        marginBottom: 16,
    },
    formLabel: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
    },
    formInput: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        gap: 12,
    },
    saveButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#e0e0e0',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    cancelButtonText: {
        color: '#333',
        fontWeight: 'bold',
    },
    emptyContainer: {
        padding: 24,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    },
    loader: {
        padding: 24,
    },
});

export default CustomerList;