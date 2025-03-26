import React from 'react'
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { globalColors } from '../../Theme/globalColors';

const EditEntryModal = ({ visible, entry, onClose, onSave, editNumber, setEditNumber, editAmount, setEditAmount }) => {
    if (!entry) return null;
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Edit Entry</Text>
                    <Text style={styles.modalSubtitle}>{entry.type.toUpperCase()}</Text>

                    <Text style={styles.label}>NUMBER</Text>
                    <TextInput
                        style={styles.modalInput}
                        value={editNumber}
                        onChangeText={setEditNumber}
                        keyboardType="numeric"
                        placeholder="Enter Number"
                    />

                    <Text style={styles.label}>AMOUNT</Text>
                    <TextInput
                        style={styles.modalInput}
                        value={editAmount}
                        onChangeText={setEditAmount}
                        keyboardType="numeric"
                        placeholder="Enter Amount"
                    />

                    <View style={styles.modalButtonContainer}>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.closeButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.modalButtonText}>Close</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.modalButton, styles.saveButton]}
                            onPress={onSave}
                        >
                            <Text style={styles.modalButtonText}>Save changes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '90%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: globalColors.darkBlue,
    },
    modalSubtitle: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
        color: globalColors.blue,
    },
    modalInput: {
        borderWidth: 1,
        borderColor: globalColors.borderColor,
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        backgroundColor: globalColors.inputbgColor,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        padding: 12,
        borderRadius: 5,
        width: '48%',
        alignItems: 'center',
    },
    closeButton: {
        backgroundColor: globalColors.grey,
    },
    saveButton: {
        backgroundColor: globalColors.green,
    },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
})


export default EditEntryModal