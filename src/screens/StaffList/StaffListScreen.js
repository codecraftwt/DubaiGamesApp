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
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { globalColors } from '../../Theme/globalColors';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStaffList } from '../../Redux/Slices/staffSlice';


const StaffListScreen = () => {
    const dispatch = useDispatch();

    const [staffList, setStaffList] = useState([]);
    const [filteredStaffList, setFilteredStaffList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    // const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);

    const { staff, loading } = useSelector((state) => state?.staff)

    const [formData, setFormData] = useState({
        id: null,
        name: '',
        email: '',
        role: 'staff',
        password: '',
        market_amount: '',
        morning_amount: '',
        night_amount: '',
        code: ''
    });

    useEffect(() => {
        const loadStaffData = async () => {
            try {
                console.log("Dispatching fetchStaffList");
                await dispatch(fetchStaffList());
            } catch (error) {
                console.error('Error fetching staff data:', error);
                Alert.alert('Error', 'Failed to load staff data');
            }
        };
        loadStaffData();
    }, [dispatch]);

    useEffect(() => {
        if (searchQuery) {
            const filtered = staffList.filter(staff =>
                staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                staff.code.includes(searchQuery)
            );
            setFilteredStaffList(filtered);
        } else {
            setFilteredStaffList(staffList);
        }
    }, [searchQuery, staffList]);

    // const loadStaffData = async () => {
    //     // setLoading(true);
    //     try {
    //         console.log("calling api fetchStaffList")
    //         const response = await dispatch(fetchStaffList());
    //         setStaffList(staff);
    //         setFilteredStaffList(staff);
    //         setTotalPages(Math.ceil(response.recordsTotal / entriesPerPage));
    //     } catch (error) {
    //         console.error('Error fetching staff data:', error);
    //         Alert.alert('Error', 'Failed to load staff data');
    //     } finally {
    //         // setLoading(false);
    //     }
    // };

    useEffect(() => {
        if (staff) {
            setStaffList(staff);
            setFilteredStaffList(staff);
            setTotalPages(Math.ceil(staff.length / entriesPerPage));
        }
    }, [staff]);

    const handleAddStaff = () => {
        setFormData({
            id: null,
            name: '',
            email: '',
            role: 'staff',
            password: '',
            market_amount: '',
            morning_amount: '',
            night_amount: '',
            code: ''
        });
        setModalVisible(true);
    };

    const handleEditStaff = (staff) => {
        setFormData({
            id: staff.id,
            name: staff.name,
            email: staff.email,
            role: staff.role,
            password: '',
            market_amount: staff.market_amount,
            morning_amount: staff.morning_amount,
            night_amount: staff.night_amount,
            code: staff.code
        });
        setModalVisible(true);
    };

    const handleDeleteStaff = (id) => {
        Alert.alert(
            'Delete Staff',
            'Are you sure you want to delete this staff member?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    onPress: () => {
                        // In a real app, you would call your API to delete the staff
                        // After successful deletion, update the local state
                        setStaffList(staffList.filter(staff => staff.id !== id));
                        setFilteredStaffList(filteredStaffList.filter(staff => staff.id !== id));
                    },
                    style: 'destructive'
                }
            ]
        );
    };

    const handleSaveStaff = () => {
        // Validate form data
        if (!formData.name || !formData.email || !formData.role) {
            Alert.alert('Validation Error', 'Please fill in all required fields');
            return;
        }

        if (formData.id) {
            // Update existing staff
            const updatedList = staffList.map(staff =>
                staff.id === formData.id ? { ...staff, ...formData } : staff
            );
            setStaffList(updatedList);
            setFilteredStaffList(updatedList);
        } else {
            // Add new staff
            const newStaff = {
                ...formData,
                id: Date.now(), // temporary ID, would be assigned by the server in a real app
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                status: 0,
                DT_RowIndex: staffList.length + 1
            };
            setStaffList([...staffList, newStaff]);
            setFilteredStaffList([...filteredStaffList, newStaff]);
        }

        setModalVisible(false);
    };

    const handleGenerateCode = (staff) => {
        // Generate a random 4-digit code
        const newCode = Math.floor(1000 + Math.random() * 9000).toString();

        // Update the staff member with the new code
        const updatedList = staffList.map(item =>
            item.id === staff.id ? { ...item, code: newCode } : item
        );

        setStaffList(updatedList);
        setFilteredStaffList(updatedList);

        Alert.alert('Success', `New code generated: ${newCode}`);
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const renderTableHeader = () => (
        <View style={styles.tableHeader}>
            <View style={[styles.tableCell, styles.indexCell]}>
                <Text style={styles.tableHeaderText}>SR.NO</Text>
            </View>
            <View style={[styles.tableCell, styles.nameCell]}>
                <Text style={styles.tableHeaderText}>NAME</Text>
            </View>
            <View style={[styles.tableCell, styles.emailCell]}>
                <Text style={styles.tableHeaderText}>EMAIL</Text>
            </View>
            <View style={[styles.tableCell, styles.actionCell]}>
                <Text style={styles.tableHeaderText}>ACTION</Text>
            </View>
            <View style={[styles.tableCell, styles.codeCell]}>
                <Text style={styles.tableHeaderText}>ACTION</Text>
            </View>
        </View>
    );

    const renderStaffItem = ({ item, index }) => (
        <View style={styles.tableRow}>
            <View style={[styles.tableCell, styles.indexCell]}>
                <Text style={styles.indexText}>{item.DT_RowIndex}</Text>
            </View>
            <View style={[styles.tableCell, styles.nameCell]}>
                <Text style={styles.nameText}>{item.name}</Text>
            </View>
            <View style={[styles.tableCell, styles.emailCell]}>
                <Text style={styles.emailText}>{item.email}</Text>
            </View>
            <View style={[styles.tableCell, styles.actionCell]}>
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => handleEditStaff(item)}
                    >
                        <Text style={styles.buttonText}>EDIT</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteStaff(item.id)}
                    >
                        <Text style={styles.buttonText}>DELETE</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={[styles.tableCell, styles.codeCell]}>
                <View style={styles.codeContainer}>
                    <View>
                        <Text style={styles.codeText}>{item.code}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.generateButton}
                        onPress={() => handleGenerateCode(item)}
                    >
                        <Ionicons name="settings" size={16} color="#fff" style={styles.generateIcon} />
                        <Text style={styles.generateText}>Generate</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const renderPagination = () => (
        <View style={styles.paginationContainer}>
            <Text style={styles.paginationInfo}>
                SHOWING {filteredStaffList.length > 0 ? 1 : 0} TO {Math.min(filteredStaffList.length, entriesPerPage)} OF {filteredStaffList.length} ENTRIES
            </Text>
            <View style={styles.paginationButtons}>
                <TouchableOpacity
                    style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]}
                    onPress={goToPreviousPage}
                    disabled={currentPage === 1}
                >
                    <Text style={styles.paginationButtonText}>PREVIOUS</Text>
                </TouchableOpacity>

                <View style={styles.pageNumberContainer}>
                    <Text style={styles.currentPageText}>{currentPage}</Text>
                </View>

                <TouchableOpacity
                    style={[styles.paginationButton, currentPage === totalPages && styles.paginationButtonDisabled]}
                    onPress={goToNextPage}
                    disabled={currentPage === totalPages}
                >
                    <Text style={styles.paginationButtonText}>NEXT</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Staff List</Text>

                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        {/* <View style={styles.entriesContainer}>
                            <Text style={styles.showText}>SHOW</Text>
                            <View style={styles.entriesInput}>
                                <Text style={styles.entriesText}>{entriesPerPage}</Text>
                            </View>
                            <Text style={styles.entriesLabel}>ENTRIES</Text>
                        </View> */}

                        <View style={styles.searchContainer}>
                            {/* <Text style={styles.searchLabel}>SEARCH:</Text> */}
                            <TextInput
                                style={styles.searchInput}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholder="Search..."
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.addStaffButton}
                            onPress={handleAddStaff}
                        >
                            <Text style={styles.addStaffText}>Add Staff</Text>
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <ActivityIndicator size="large" color={globalColors.blue} style={styles.loader} />
                    ) : (
                        <>
                            <ScrollView horizontal>
                                <View>
                                    {renderTableHeader()}
                                    <FlatList
                                        data={filteredStaffList}
                                        renderItem={renderStaffItem}
                                        keyExtractor={(item) => item.id.toString()}
                                        contentContainerStyle={styles.tableContainer}
                                        ListEmptyComponent={
                                            <View style={styles.emptyContainer}>
                                                <Text style={styles.emptyText}>No staff members found</Text>
                                            </View>
                                        }
                                    />
                                </View>
                            </ScrollView>

                            {renderPagination()}
                        </>
                    )}
                </View>
            </View>

            {/* Staff Modal */}
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
                            <Text style={styles.modalTitle}>STAFF</Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Ionicons name="close" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody}>
                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>NAME</Text>
                                <TextInput
                                    style={styles.formInput}
                                    value={formData.name}
                                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                                    placeholder="Enter name"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>EMAIL</Text>
                                <TextInput
                                    style={styles.formInput}
                                    value={formData.email}
                                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                                    placeholder="Enter email"
                                    keyboardType="email-address"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>ROLE</Text>
                                <TextInput
                                    style={styles.formInput}
                                    value={formData.role}
                                    onChangeText={(text) => setFormData({ ...formData, role: text })}
                                    placeholder="Enter role"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>PASSWORD</Text>
                                <TextInput
                                    style={styles.formInput}
                                    value={formData.password}
                                    onChangeText={(text) => setFormData({ ...formData, password: text })}
                                    placeholder="Enter password"
                                    secureTextEntry
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>MARKET AMOUNT</Text>
                                <TextInput
                                    style={styles.formInput}
                                    value={formData.market_amount}
                                    onChangeText={(text) => setFormData({ ...formData, market_amount: text })}
                                    placeholder="Enter market amount"
                                    keyboardType="numeric"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>MORNING AMOUNT</Text>
                                <TextInput
                                    style={styles.formInput}
                                    value={formData.morning_amount}
                                    onChangeText={(text) => setFormData({ ...formData, morning_amount: text })}
                                    placeholder="Enter morning amount"
                                    keyboardType="numeric"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>EVENING AMOUNT</Text>
                                <TextInput
                                    style={styles.formInput}
                                    value={formData.night_amount}
                                    onChangeText={(text) => setFormData({ ...formData, night_amount: text })}
                                    placeholder="Enter evening amount"
                                    keyboardType="numeric"
                                />
                            </View>
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleSaveStaff}
                            >
                                <Text style={styles.saveButtonText}>SAVE</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.closeModalButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.closeModalButtonText}>Close</Text>
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
        flexWrap: 'wrap',
    },
    // entriesContainer: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    // },
    // showText: {
    //     marginRight: 8,
    //     fontSize: 14,
    //     color: '#666',
    // },
    // entriesInput: {
    //     borderWidth: 1,
    //     borderColor: '#ccc',
    //     borderRadius: 4,
    //     paddingHorizontal: 8,
    //     paddingVertical: 4,
    //     minWidth: 50,
    //     alignItems: 'center',
    // },
    // entriesText: {
    //     fontSize: 14,
    //     color: '#333',
    // },
    // entriesLabel: {
    //     marginLeft: 8,
    //     fontSize: 14,
    //     color: '#666',
    // },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchLabel: {
        marginRight: 8,
        fontSize: 14,
        color: globalColors.black,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: globalColors.borderColor,
        color: globalColors.black,
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        minWidth: 220,
        height: 40
    },
    addStaffButton: {
        backgroundColor: '#007bff',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
    },
    addStaffText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    loader: {
        padding: 20,
    },
    tableContainer: {
        flexGrow: 1,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f9f9f9',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    tableHeaderText: {
        fontWeight: 'bold',
        color: '#333',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    tableCell: {
        padding: 12,
        justifyContent: 'center',
        minWidth: 100, // Adjust this value as needed
    },
    indexCell: {
        width: 100,
    },
    nameCell: {
        width: 150,
    },
    emailCell: {
        width: 200,
    },
    actionCell: {
        width: 150,
    },
    codeCell: {
        width: 150,
    },
    indexText: {
        fontSize: 14,
        color: '#333',
    },
    nameText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    emailText: {
        fontSize: 14,
        color: '#666',
    },
    actionButtons: {
        flexDirection: 'row',
    },
    editButton: {
        backgroundColor: '#007bff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
        marginRight: 8,
    },
    deleteButton: {
        backgroundColor: '#dc3545',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
    },
    buttonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    codeContainer: {
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row',
        gap: 10
    },
    codeText: {
        fontSize: 14,
        color: '#333',
    },
    generateButton: {
        backgroundColor: '#007bff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    generateIcon: {
        marginRight: 4,
    },
    generateText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
    },
    emptyText: {
        color: '#666',
        fontSize: 16,
    },
    paginationContainer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    paginationInfo: {
        fontSize: 12,
        color: '#666',
        marginBottom: 8,
    },
    paginationButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    paginationButton: {
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    paginationButtonDisabled: {
        opacity: 0.5,
    },
    paginationButtonText: {
        color: '#333',
        fontSize: 12,
    },
    pageNumberContainer: {
        backgroundColor: '#007bff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    currentPageText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },

    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        width: '90%',
        maxWidth: 500,
        maxHeight: '80%',
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
        fontSize: 18,
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
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    formInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 16,
    },
    modalFooter: {
        flexDirection: 'row',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    saveButton: {
        backgroundColor: '#007bff',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    closeModalButton: {
        backgroundColor: '#6c757d',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
    },
    closeModalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default StaffListScreen;