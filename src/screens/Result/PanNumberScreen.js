import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { deleteResult, fetchPanNumbers, updateResult } from '../../Redux/Slices/panNumberSlice';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { format } from 'date-fns';



const EditModal = ({ modalVisible, onClose, formData, setFormData, onSave }) => (
    <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}
    >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>EDIT RECORD</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={styles.closeButton}>×</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>PAN NUMBER</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.pannumber}
                        maxLength={3}
                        onChangeText={(text) => setFormData({ ...formData, pannumber: text })}
                        placeholder="Enter PAN number"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>NUMBER</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.number}
                        maxLength={1}
                        onChangeText={(text) => setFormData({ ...formData, number: text })}
                        keyboardType="numeric"
                        placeholder="Enter number"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>TYPE</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.type}
                        onChangeText={(text) => setFormData({ ...formData, type: text })}
                        placeholder="Enter type"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>MARKET</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.market}
                        onChangeText={(text) => setFormData({ ...formData, market: text })}
                        placeholder="Enter market"
                    />
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={onSave}>
                    <Text style={styles.saveButtonText}>Save changes</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
);


const PanNumberScreen = ({ date, panNumber, number, type, market2 }) => {
    const dispatch = useDispatch();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({
        pannumber: '',
        number: '',
        type: '',
        market: '',
    });

    const { data, loading, addStatus } = useSelector((state) => state.panNumbers);


    const fetchData = useCallback(() => {
        const formattedDate = format(date, 'dd-MM-yyyy');
        dispatch(fetchPanNumbers({ filterDate: formattedDate }));
    }, [date, dispatch]);

    useEffect(() => {
        fetchData()
    }, [fetchData]);

    useEffect(() => {
        if (addStatus === 'succeeded') {
            fetchData();
        }
    }, [addStatus, fetchData]);

    const handleEdit = useCallback((item) => {
        setSelectedItem(item);
        setFormData({
            pannumber: item.pannumber,
            number: item.number.toString(),
            type: item.type,
            market: item.market,
        });
        setModalVisible(true);
    }, []);

    const handleDelete = useCallback((id) => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this record?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: () => {
                        dispatch(deleteResult(id))
                            .then((action) => {
                                if (deleteResult.fulfilled.match(action)) {
                                    // Only fetch new data if deletion was successful
                                    fetchData();
                                }
                            });
                    }
                }
            ]
        );
    }, [dispatch, fetchData]);

    const handleSave = useCallback(() => {
        if (selectedItem) {
            dispatch(updateResult({
                id: selectedItem.id,
                payload: formData,
            })).then(() => {
                setModalVisible(false);
                fetchData();
            });
        }
    }, [selectedItem, formData, dispatch, fetchData]);

    const renderItem = useCallback(({ item }) => (
        <View style={styles.row}>
            <Text style={[styles.cell, styles.pannumberCell]}>{item.pannumber}</Text>
            <Text style={[styles.cell, styles.numberCell]}>{item.number}</Text>
            <Text style={[styles.cell, styles.typeCell]}>{item.type}</Text>
            <Text style={[styles.cell, styles.marketCell]}>{item.market}</Text>
            <View style={styles.actionCell}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => handleEdit(item)}
                >
                    <Ionicons name="pencil" size={16} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDelete(item.id)}
                >
                    <Ionicons name="trash" size={16} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    ), []);


    return (
        <ScrollView horizontal style={styles.container}>
            <View style={styles.content}>

                {data?.length !== 0 ?
                    < View style={styles.tableContainer}>
                        <View style={styles.header}>
                            <Text style={[styles.headerCell, styles.pannumberCell]}>PANNUMBER</Text>
                            <Text style={[styles.headerCell, styles.numberCell]}>NUMBER</Text>
                            <Text style={[styles.headerCell, styles.typeCell]}>TYPE</Text>
                            <Text style={[styles.headerCell, styles.marketCell]}>MARKET</Text>
                            <Text style={[styles.headerCell, styles.actionCell]}>ACTION</Text>
                        </View>

                        <FlatList
                            data={data}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                            initialNumToRender={10}
                            maxToRenderPerBatch={10}
                            windowSize={5}
                            removeClippedSubviews={true}
                        />
                    </View>
                    : ''
                }

                <EditModal
                    modalVisible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    formData={formData}
                    setFormData={setFormData}
                    onSave={handleSave}
                />
            </View>
        </ScrollView >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        minWidth: '100%',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    tableContainer: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        padding: 10,
    },
    headerCell: {
        fontWeight: 'bold',
        color: '#333',
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        padding: 12,
        alignItems: 'center',
    },
    cell: {
        color: '#666',
    },
    pannumberCell: {
        flex: 2,
        marginRight: 10,
    },
    numberCell: {
        flex: 1,
        marginRight: 10,
    },
    typeCell: {
        flex: 2,
        marginRight: 10,
    },
    marketCell: {
        flex: 2,
        marginRight: 10,
    },
    actionCell: {
        flex: 2,
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        padding: 8,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editButton: {
        backgroundColor: '#007bff',
    },
    deleteButton: {
        backgroundColor: '#dc3545',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        width: '90%',
        maxWidth: 500,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#666',
    },
    formGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        padding: 10,
        fontSize: 16,
        color: '#333',
    },
    saveButton: {
        backgroundColor: '#28a745',
        padding: 12,
        borderRadius: 4,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default PanNumberScreen;
