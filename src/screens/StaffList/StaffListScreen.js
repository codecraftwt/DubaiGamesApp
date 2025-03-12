import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Alert, Modal, StyleSheet } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons"
import Header from '../../components/Header/Header';
import { globalColors } from '../../Theme/globalColors';

const staffData = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com' },
    { id: 4, name: 'Emily Davis', email: 'emily@example.com' },
    { id: 5, name: 'Robert Brown', email: 'robert@example.com' },
    { id: 6, name: 'Linda Wilson', email: 'linda@example.com' },
    { id: 7, name: 'David Lee', email: 'david@example.com' },
    { id: 8, name: 'Sarah Miller', email: 'sarah@example.com' },
];

const StaffListScreen = () => {
    const [staffList, setStaffList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', role: '', password: '' });
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedStaffId, setSelectedStaffId] = useState(null);

    useEffect(() => {
        loadMoreStaff();
    }, [page]);

    const loadMoreStaff = () => {
        if (!hasMore) return;
        setLoading(true);
        setTimeout(() => {
            const newData = staffData.slice((page - 1) * 5, page * 5);
            if (newData.length === 0) setHasMore(false);
            setStaffList(prev => [...prev, ...newData]);
            setLoading(false);
        }, 500);
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        const filteredData = staffData.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.email.toLowerCase().includes(query.toLowerCase())
        );
        setStaffList(filteredData);
    };

    const handleDelete = (id) => {
        Alert.alert('Delete Staff', 'Are you sure you want to delete this staff member?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                onPress: () => setStaffList(staffList.filter(item => item.id !== id)),
                style: 'destructive',
            },
        ]);
    };

    const handleEdit = (staff) => {
        setFormData({ name: staff.name, email: staff.email, role: staff.role, password: '' });
        setSelectedStaffId(staff.id);
        setIsEditMode(true);
        setModalVisible(true);
    };

    const handleAdd = () => {
        setFormData({ name: '', email: '', role: '', password: '' });
        setIsEditMode(false);
        setSelectedStaffId(null);
        setModalVisible(true);
    };

    const handleSave = () => {
        if (isEditMode) {
            // Update the staff data (just an example, modify according to your logic)
            setStaffList(prev => prev.map(item => item.id === selectedStaffId ? { ...item, ...formData } : item));
        } else {
            // Add new staff
            setStaffList(prev => [
                ...prev,
                { id: staffList.length + 1, ...formData },
            ]);
        }
        setModalVisible(false);
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.email}>{item.email}</Text>
                <TextInput
                    style={styles.codeInput}
                    placeholder="Enter Code"
                    keyboardType="numeric"
                />
            </View>
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => handleEdit(item)}>
                    <Ionicons name="pencil" size={20} color="blue" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <Ionicons name="trash" size={20} color="red" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.childcontainer}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search StaffList"
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
                <FlatList
                    data={staffList}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    onEndReached={() => setPage(page + 1)}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={loading && <Text style={styles.loading}>Loading...</Text>}
                />

                {/* Add Staff Button */}
                <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
                    <Text style={styles.addButtonText}>Add Staff</Text>
                </TouchableOpacity>

                {/* Modal */}
                <Modal
                    visible={modalVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Name"
                                value={formData.name}
                                onChangeText={(text) => setFormData({ ...formData, name: text })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                value={formData.email}
                                onChangeText={(text) => setFormData({ ...formData, email: text })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Role"
                                value={formData.role}
                                onChangeText={(text) => setFormData({ ...formData, role: text })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                secureTextEntry
                                value={formData.password}
                                onChangeText={(text) => setFormData({ ...formData, password: text })}
                            />
                            <View style={styles.modalActions}>
                                <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                                    <Text style={styles.saveButtonText}>Save</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    childcontainer: {
        padding: 10,
        backgroundColor: globalColors.LightWhite,
    },
    searchBar: {
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 8,
        marginBottom: 10,
    },
    card: {
        padding: 15,
        backgroundColor: globalColors.white,
        borderRadius: 10,
        marginVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    email: {
        fontSize: 14,
        color: 'gray',
    },
    actions: {
        flexDirection: 'row',
        gap: 10,
    },
    codeInput: {
        fontSize: 14,
        borderWidth: 1,
        borderColor: globalColors.borderColor,
        borderRadius: 5,
        padding: 5,
        marginTop: 5,
        width: 150,
    },
    loading: {
        textAlign: 'center',
        padding: 10,
        color: 'gray',
    },
    addButton: {
        backgroundColor: globalColors.blue,
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    addButtonText: {
        color: globalColors.white,
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: 300,
        backgroundColor: globalColors.white,
        padding: 20,
        borderRadius: 10,
    },
    input: {
        height: 40,
        borderColor: globalColors.borderColor,
        borderWidth: 1,
        backgroundColor: globalColors.inputbgColor,
        marginBottom: 10,
        paddingLeft: 10,
        borderRadius: 5,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    saveButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
    },
    saveButtonText: {
        color: 'white',
    },
    closeButton: {
        backgroundColor: globalColors.vividred,
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: globalColors.white,
    },
});

export default StaffListScreen;
