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
    Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFundAccount, storeFundAccount, clearFundAccountErrors } from '../../Redux/Slices/fundAccountSlice';
import { API_BASE_URL } from '../../utils/Api';
import { globalColors } from '../../Theme/globalColors';
import { useTranslation } from 'react-i18next';

const AddFundAccount = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        upi_id: '',
        account_no: '',
        ifsc: '',
        acc_holder_name: '',
    });
    const [modalVisible, setModalVisible] = useState(false);
    const dispatch = useDispatch();

    const { data: fundAccount, loading, error, formErrors } = useSelector(
        (state) => state.fundAccount
    );
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        if (token) {
            dispatch(fetchFundAccount(token));
        }
    }, [token]);

    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
        dispatch(clearFundAccountErrors());
    };

    const validateForm = () => {
        if (!formData.upi_id || !formData.upi_id.includes('@')) {
            Alert.alert(t('error'), t('validUpiIdRequired'));
            return false;
        }
        if (!formData.account_no || formData.account_no.length < 12) {
            Alert.alert(t('error'), t('accountNumberMinLength'));
            return false;
        }
        if (!formData.ifsc || formData.ifsc.length !== 11) {
            Alert.alert(t('error'), t('ifscCodeLength'));
            return false;
        }
        if (!formData.acc_holder_name) {
            Alert.alert(t('error'), t('accountHolderNameRequired'));
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            await dispatch(storeFundAccount({ token, formData }));
            setModalVisible(false);
            Alert.alert(t('success'), t('fundAccountUpdatedSuccessfully'));
        } catch (err) {
            Alert.alert(t('error'), err.message || t('fundAccountUpdateFailed'));
        }
    };

    const renderFundAccountDetails = () => {
        if (loading) {
            return <ActivityIndicator size="large" color="#4CAF50" />;
        }

        if (error) {
            return (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity
                        style={styles.addAccountButton}
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={styles.addAccountButtonText}>{t('addFundAccountInfo')}</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (fundAccount) {
            return (
                <View style={styles.fundAccountDetails}>
                    <Text style={styles.sectionTitle}>{t('fundAccountDetails')}</Text>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{t('upiId')}: </Text>
                        <Text style={styles.detailText}>{fundAccount.upi_id}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{t('accountNumber')}: </Text>
                        <Text style={styles.detailText}>{fundAccount.account_no}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{t('ifscCode')}: </Text>
                        <Text style={styles.detailText}>{fundAccount.ifsc}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{t('accountHolderName')}: </Text>
                        <Text style={styles.detailText}>{fundAccount.acc_holder_name}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={styles.editButtonText}>{t('editDetails')}</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return null;
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-back" size={24} color={globalColors.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('account')}</Text>
                <View style={styles.headerRight} />
            </View>

            {/* Render Fund Account or loading/error message */}
            {renderFundAccountDetails()}

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
                            <Text style={styles.modalTitle}>{t('editAccountDetails')}</Text>

                            {/* UPI ID Field */}
                            <TextInput
                                style={styles.input}
                                placeholder={t('upiIdPlaceholder')}
                                value={formData.upi_id}
                                onChangeText={(text) => handleChange('upi_id', text)}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            {formErrors.upi_id && <Text style={styles.errorText}>{formErrors.upi_id[0]}</Text>}

                            {/* Account Number Field */}
                            <TextInput
                                style={styles.input}
                                placeholder={t('accountNumber')}
                                value={formData.account_no}
                                onChangeText={(text) => handleChange('account_no', text)}
                                keyboardType="numeric"
                                maxLength={16}
                            />
                            {formErrors.account_no && <Text style={styles.errorText}>{formErrors.account_no[0]}</Text>}

                            {/* IFSC Code Field */}
                            <TextInput
                                style={styles.input}
                                placeholder={t('ifscCode')}
                                value={formData.ifsc}
                                onChangeText={(text) => handleChange('ifsc', text.toUpperCase())}
                                maxLength={11}
                            />
                            {formErrors.ifsc && <Text style={styles.errorText}>{formErrors.ifsc[0]}</Text>}

                            {/* Account Holder Name Field */}
                            <TextInput
                                style={styles.input}
                                placeholder={t('accountHolderName')}
                                value={formData.acc_holder_name}
                                onChangeText={(text) => handleChange('acc_holder_name', text)}
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
                                    <Text style={styles.submitButtonText}>{t('saveChanges')}</Text>
                                )}
                            </TouchableOpacity>

                            {/* Close Modal Button */}
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.closeButtonText}>{t('close')}</Text>
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
        // backgroundColor: globalColors.commonpink,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        // paddingTop: 50,
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'Poppins-Bold',
        color: globalColors.black,
        flex: 1,
        textAlign: 'center',
    },
    headerRight: {
        width: 40,
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
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
        height: '100%',
    },
    addAccountButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addAccountButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
});

export default AddFundAccount;
