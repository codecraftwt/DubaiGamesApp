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
    ScrollView,
    RefreshControl,
    Animated
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
    fetchOnlineCustomers,
    createOnlineCustomer,
    updateOnlineCustomer,
    deleteOnlineCustomer,
    clearCurrentCustomer,
    resetCustomerStatus,
    fetchOnlineCustomerById
} from '../../Redux/Slices/onlineCustomersSlice';
import { globalColors } from '../../Theme/globalColors';
import { useTranslation } from 'react-i18next';

const CustomerCard = ({ customer, onEdit, onDelete }) => {
    const [expanded, setExpanded] = useState(false);
    const rotateAnim = new Animated.Value(0);

    const toggleExpand = () => {
        setExpanded(!expanded);
        Animated.spring(rotateAnim, {
            toValue: expanded ? 0 : 1,
            useNativeDriver: true,
        }).start();
    };

    const getInitials = (name) => {
        return name
            ?.split(' ')
            ?.map(word => word[0])
            ?.join('')
            ?.toUpperCase();
    };

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    return (
        <TouchableOpacity
            style={styles.customerCard}
            onPress={toggleExpand}
            activeOpacity={0.7}
        >
            <View style={styles.customerCardHeader}>
                <View style={styles.customerInfo}>
                    <View style={[styles.avatarCircle, { backgroundColor: `hsl(${customer?.name?.length * 20}, 70%, 50%)` }]}>
                        <Text style={styles.avatarText}>
                            {getInitials(customer?.name)}
                        </Text>
                    </View>
                    <View style={styles.customerDetails}>
                        <Text style={styles.customerName}>{customer?.name}</Text>
                        <Text style={styles.customerEmail}>{customer?.email}</Text>
                        <Text style={styles.customerPhone}>{customer?.phone}</Text>
                    </View>
                </View>
                <Animated.View style={{ transform: [{ rotate }] }}>
                    <MaterialIcons name="keyboard-arrow-down" size={24} color="#666" />
                </Animated.View>
            </View>

            {expanded && (
                <View style={styles.expandedContent}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.editButton]}
                        onPress={() => onEdit(customer)}
                    >
                        <FontAwesome name="edit" size={20} color="#fff" />
                        <Text style={styles.actionButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={() => onDelete(customer.id)}
                    >
                        <FontAwesome name="trash" size={20} color="#fff" />
                        <Text style={styles.actionButtonText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            )}
        </TouchableOpacity>
    );
};

const CustomerList = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const {
        customers,
        currentCustomer,
        status,
        error
    } = useSelector((state) => state.onlineCustomers);

    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: ''
    });

    useEffect(() => {
        dispatch(fetchOnlineCustomers());
    }, [dispatch]);

    useEffect(() => {
        if (status === 'failed' && error) {
            Alert.alert('Error', error);
            dispatch(resetCustomerStatus());
        }
    }, [status, error]);

    useEffect(() => {
        if (currentCustomer) {
            setFormData({
                name: currentCustomer.name || '',
                email: currentCustomer.email || '',
                phone: currentCustomer.phone || '',
                password: '',
                password_confirmation: ''
            });
        }
    }, [currentCustomer]);

    useEffect(() => {
        if (searchQuery) {
            const filtered = customers.filter(customer =>
                customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                customer.phone.includes(searchQuery)
            );
            setFilteredCustomers(filtered);
        } else {
            setFilteredCustomers(customers);
        }
    }, [searchQuery, customers]);

    const onRefresh = () => {
        setRefreshing(true);
        dispatch(fetchOnlineCustomers())
            .then(() => setRefreshing(false))
            .catch(() => setRefreshing(false));
    };

    const handleAddCustomer = () => {
        dispatch(clearCurrentCustomer());
        setModalVisible(true);

        setFormData({
            name: '',
            email: '',
            phone: '',
            password: '',
            password_confirmation: ''
        });
        dispatch(fetchOnlineCustomers());

    };

    const handleEditCustomer = (customer) => {
        dispatch(fetchOnlineCustomerById(customer.id));
        setModalVisible(true);
    };

    const handleDeleteCustomer = (id) => {
        Alert.alert(
            t('deleteCustomer'),
            t('deleteCustomerConfirm'),
            [
                { text: t('cancel'), style: 'cancel' },
                {
                    text: t('delete'),
                    onPress: () => {
                        dispatch(deleteOnlineCustomer(id));
                        dispatch(fetchOnlineCustomers());
                    },
                    style: 'destructive'
                }
            ]
        );
    };

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;

        if (!formData.name.trim()) {
            Alert.alert(t('error'), t('nameRequired'));
            return false;
        }
        if (!emailRegex.test(formData.email)) {
            Alert.alert(t('error'), t('invalidEmail'));
            return false;
        }
        if (!phoneRegex.test(formData.phone)) {
            Alert.alert(t('error'), t('invalidPhone'));
            return false;
        }

        if (!currentCustomer) {
            if (formData.password.length < 8) {
                Alert.alert(t('error'), t('passwordLength'));
                return false;
            }
            if (formData.password !== formData.password_confirmation) {
                Alert.alert(t('error'), t('passwordsDoNotMatch'));
                return false;
            }
        }

        return true;
    };

    const handleSaveCustomer = async () => {
        if (!validateForm()) return;

        try {
            if (currentCustomer) {
                await dispatch(updateOnlineCustomer({
                    id: currentCustomer.id,
                    customerData: {
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        ...(formData.password ? {
                            password: formData.password,
                            password_confirmation: formData.password_confirmation
                        } : {})
                    }
                })).unwrap();
                Alert.alert(t('success'), t('customerUpdated'));
            } else {
                await dispatch(createOnlineCustomer({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                    password_confirmation: formData.password_confirmation
                })).unwrap();
                Alert.alert(t('success'), t('customerCreated'));
            }

            setModalVisible(false);
            dispatch(fetchOnlineCustomers());
        } catch (error) {
            Alert.alert(t('error'), error.message || 'An error occurred');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>{t('customers')}</Text>

                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.searchContainer}>
                            <FontAwesome name="search" size={20} color="#666" />
                            <TextInput
                                style={styles.searchInput}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholder={t('searchCustomers')}
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={handleAddCustomer}
                        >
                            <FontAwesome name="plus" size={20} color="#fff" />
                            <Text style={styles.addButtonText}>{t('addCustomer')}</Text>
                        </TouchableOpacity>
                    </View>

                    {status === 'loading' ? (
                        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
                    ) : (
                        <FlatList
                            data={filteredCustomers}
                            renderItem={({ item }) => (
                                <CustomerCard
                                    customer={item}
                                    onEdit={handleEditCustomer}
                                    onDelete={handleDeleteCustomer}
                                />
                            )}
                            keyExtractor={(item) => item?.id?.toString()}
                            contentContainerStyle={styles.listContainer}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>{t('noCustomersFound')}</Text>
                                </View>
                            }
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                    colors={['#007AFF']}
                                    tintColor="#007AFF"
                                />
                            }
                        />
                    )}
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
                                {currentCustomer ? t('editCustomer') : t('addCustomer')}
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
                                <Text style={styles.formLabel}>{t('name')}</Text>
                                <TextInput
                                    style={styles.formInput}
                                    value={formData.name}
                                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                                    placeholder={t('enterName')}
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>{t('email')}</Text>
                                <TextInput
                                    style={styles.formInput}
                                    value={formData.email}
                                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                                    placeholder={t('enterEmail')}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>{t('phoneNumber')}</Text>
                                <TextInput
                                    style={styles.formInput}
                                    value={formData.phone}
                                    onChangeText={(text) => setFormData({ ...formData, phone: text })}
                                    placeholder={t('enterPhone')}
                                    keyboardType="phone-pad"
                                    maxLength={10}
                                />
                            </View>

                            {(!currentCustomer || (currentCustomer && formData.password)) && (
                                <>
                                    <View style={styles.formGroup}>
                                        <Text style={styles.formLabel}>
                                            {t('password')} {currentCustomer && t('optional')}
                                        </Text>
                                        <TextInput
                                            style={styles.formInput}
                                            value={formData.password}
                                            onChangeText={(text) => setFormData({ ...formData, password: text })}
                                            placeholder={t('enterPassword')}
                                            secureTextEntry
                                        />
                                    </View>

                                    <View style={styles.formGroup}>
                                        <Text style={styles.formLabel}>
                                            {t('confirmPassword')} {currentCustomer && t('optional')}
                                        </Text>
                                        <TextInput
                                            style={styles.formInput}
                                            value={formData.password_confirmation}
                                            onChangeText={(text) => setFormData({ ...formData, password_confirmation: text })}
                                            placeholder={t('confirmPasswordPlaceholder')}
                                            secureTextEntry
                                        />
                                    </View>
                                </>
                            )}
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleSaveCustomer}
                            >
                                <Text style={styles.saveButtonText}>{t('save')}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
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
        padding: 10,
        paddingBottom: 200
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#1a1a1a',
    },
    card: {
        backgroundColor: '#fff',
        // borderRadius: 16,
        width: '100%',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: globalColors.borderColor,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        backgroundColor: '#fff',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 12,
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: '#333',
    },
    addButton: {
        backgroundColor: '#007AFF',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        gap: 8,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    customerCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginHorizontal: 16,
        marginTop: 16,
        padding: 16,
        elevation: 2,
        borderColor: globalColors.borderColor,
        borderWidth: 2,
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    customerCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    customerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatarCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    customerDetails: {
        flex: 1,
    },
    customerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    customerEmail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    customerPhone: {
        fontSize: 14,
        color: '#666',
    },
    expandIcon: {
        fontSize: 18,
        color: '#666',
    },
    expandedContent: {
        marginTop: 16,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        gap: 8,
    },
    editButton: {
        backgroundColor: '#007AFF',
    },
    deleteButton: {
        backgroundColor: '#FF3B30',
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        width: '90%',
        maxWidth: 500,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    closeButton: {
        padding: 4,
    },
    modalBody: {
        padding: 20,
    },
    formGroup: {
        marginBottom: 20,
    },
    formLabel: {
        fontSize: 16,
        color: '#1a1a1a',
        marginBottom: 8,
        fontWeight: '500',
    },
    formInput: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        gap: 12,
    },
    saveButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    cancelButton: {
        backgroundColor: '#f5f5f5',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
    },
    cancelButtonText: {
        color: '#666',
        fontWeight: '600',
        fontSize: 16,
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
    listContainer: {
        paddingBottom: 16,
    },
});

export default CustomerList;