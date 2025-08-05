import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    ScrollView,
    ActivityIndicator,
    Modal,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../../utils/Api';

const AddFundAccount = () => {
    const navigation = useNavigation();
    const [formData, setFormData] = useState({
        upi_id: '',
        account_no: '',
        ifsc: '',
        acc_holder_name: '',
    });

    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [fundAccount, setFundAccount] = useState(null); // State for storing fetched account details
    const [modalVisible, setModalVisible] = useState(false); // Modal visibility
    const [fetchingError, setFetchingError] = useState(null); // Error state for fetch failure
    const token = useSelector(state => state.auth.token);
    const fetchFundAccountDetails = async () => {
        setLoading(true); // Start loader
        try {
            console.log("token", token)
            const response = await axios.get(`${API_BASE_URL}/get/fund-account`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log("response.data", response.data.fundAccount);
            if (response.data.fundAccount) {
                setFundAccount(response.data.fundAccount);
                setFormData(response.data.fundAccount); // Set form data when details are fetched
                setFetchingError(null); // Clear any fetching errors
            } else {
                setFetchingError('No fund account found.');
                setFundAccount(null); // Ensure fund account is null when not found
            }
        } catch (error) {
            console.error('Error fetching fund account:', error.response?.data?.message || error.message);
            setFetchingError(error?.response?.data?.message || 'Failed to fetch fund account.');
            setFundAccount(null); // Ensure fund account is null when there's an error
        } finally {
            setLoading(false); // Stop loader after fetching or error
        }
    };
    useEffect(() => {


        fetchFundAccountDetails();
    }, [token]);

    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
        setFormErrors({ ...formErrors, [name]: null }); // Clear error on change
    };

    const validateForm = () => {
        if (!formData.upi_id || !formData.upi_id.includes('@')) {
            Alert.alert('Error', 'Please enter a valid UPI ID');
            return false;
        }
        if (!formData.account_no || formData.account_no.length < 12) {
            Alert.alert('Error', 'Account number must be at least 12 digits');
            return false;
        }
        if (!formData.ifsc || formData.ifsc.length !== 11) {
            Alert.alert('Error', 'IFSC code must be 11 characters');
            return false;
        }
        if (!formData.acc_holder_name) {
            Alert.alert('Error', 'Please enter account holder name');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setFormErrors({}); // Clear previous errors

        try {
            console.log("formData", formData);
            const response = await axios.post(`${API_BASE_URL}/store/fund-account`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.data) {
                setModalVisible(false); // Close modal after success
                setFundAccount(formData);
                await fetchFundAccountDetails()
                setModalVisible(false); // Optionally reopen the modal for editing or show confirmation
            } else {
                Alert.alert('Error', response.data.message || 'Failed to update Account Details');
            }
        } catch (error) {
            console.error('Error:', error.response?.data);

            if (error.response?.data?.errors) {
                setFormErrors(error.response.data.errors);
            } else {
                Alert.alert('Error', error.response?.data?.message || 'Something went wrong');
            }
        } finally {
            setLoading(false);
        }
    };


    const renderFundAccountDetails = () => {
        if (fetchingError) {
            return (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{fetchingError}</Text>
                    <TouchableOpacity
                        style={styles.addAccountButton}
                        onPress={() => setModalVisible(true)} // Open modal to add account
                    >
                        <Text style={styles.addAccountButtonText}>Add Fund Account info</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (fundAccount) {
            return (
                <View style={styles.fundAccountDetails}>
                    <Text style={styles.sectionTitle}>Fund Account Details</Text>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>UPI ID: </Text>
                        <Text style={styles.detailText}>{fundAccount.upi_id}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Account Number: </Text>
                        <Text style={styles.detailText}>{fundAccount.account_no}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>IFSC Code: </Text>
                        <Text style={styles.detailText}>{fundAccount.ifsc}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Account Holder Name: </Text>
                        <Text style={styles.detailText}>{fundAccount.acc_holder_name}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => setModalVisible(true)} // Open modal on edit button click
                    >
                        <Text style={styles.editButtonText}>Edit Details</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return <ActivityIndicator size="large" color="#4CAF50" />;
    };


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Add Account</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Show loading or error message */}
            {loading ? (
                <ActivityIndicator size="large" color="#4CAF50" />
            ) : (
                renderFundAccountDetails()
            )}

            {/* Edit Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Edit Account Details</Text>

                            {/* UPI ID Field */}
                            <TextInput
                                style={styles.input}
                                placeholder="UPI ID (e.g., name@upi)"
                                value={formData.upi_id}
                                onChangeText={text => handleChange('upi_id', text)}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            {formErrors.upi_id && <Text style={styles.errorText}>{formErrors.upi_id[0]}</Text>}

                            {/* Account Number Field */}
                            <TextInput
                                style={styles.input}
                                placeholder="Account Number"
                                value={formData.account_no}
                                onChangeText={text => handleChange('account_no', text)}
                                keyboardType="numeric"
                                maxLength={16}
                            />
                            {formErrors.account_no && <Text style={styles.errorText}>{formErrors.account_no[0]}</Text>}

                            {/* IFSC Code Field */}
                            <TextInput
                                style={styles.input}
                                placeholder="IFSC Code"
                                value={formData.ifsc}
                                onChangeText={text => handleChange('ifsc', text.toUpperCase())}
                                maxLength={11}
                            />
                            {formErrors.ifsc && <Text style={styles.errorText}>{formErrors.ifsc[0]}</Text>}

                            {/* Account Holder Name Field */}
                            <TextInput
                                style={styles.input}
                                placeholder="Account Holder Name"
                                value={formData.acc_holder_name}
                                onChangeText={text => handleChange('acc_holder_name', text)}
                            />
                            {formErrors.acc_holder_name && (
                                <Text style={styles.errorText}>{formErrors.acc_holder_name[0]}</Text>
                            )}

                            {/* Save Button */}
                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.submitButtonText}>Save Changes</Text>
                                )}
                            </TouchableOpacity>

                            {/* Close Modal Button */}
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f5f5f5',
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    fundAccountDetails: {
        margin: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    detailLabel: {
        fontWeight: 'bold',
        color: '#666',
    },
    detailText: {
        color: '#333',
    },
    editButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    editButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        fontSize: 14,
        paddingVertical: 8,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    submitButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        padding: 10,
        marginTop: 20,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    closeButton: {
        backgroundColor: '#f44336',
        borderRadius: 8,
        padding: 10,
        marginTop: 10,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',  // Center vertically
        alignItems: 'center',      // Center horizontally
        padding: 20,
        backgroundColor: '#f5f5f5',
        height: '100%',             // Take up full screen height
    },
    errorText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#d32f2f',          // Red color for error message
        // marginBottom: 20,
        textAlign: 'center',       // Center the text
    },
    addAccountButton: {
        backgroundColor: '#4CAF50',   // Green color for the button
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,             // Rounded corners for the button
        shadowColor: '#000',          // Shadow for depth
        shadowOffset: { width: 0, height: 4 }, // Slight shadow offset
        shadowOpacity: 0.2,           // Subtle shadow
        shadowRadius: 6,              // Slightly larger shadow radius
        elevation: 5,                 // Elevation for Android shadow
        marginTop: 20,
        justifyContent: 'center',     // Center content horizontally and vertically
        alignItems: 'center',
        transition: 'all 0.3s ease-in-out', // Smooth hover/press transition (for web apps, for React Native use interaction styles)
    },
    addAccountButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',               // White text for contrast
        textAlign: 'center',         // Centered text in the button
    },
    // Optional: Add hover/press effects for modern touch 
    addAccountButtonPressed: {
        backgroundColor: '#388E3C', // Darker green when pressed
        shadowOffset: { width: 0, height: 8 }, // Deeper shadow when pressed
        shadowOpacity: 0.3,
        elevation: 6, // Elevated more when pressed
    },
});

export default AddFundAccount;
