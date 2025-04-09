import React from 'react'
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { globalColors } from '../../Theme/globalColors';
import { t } from 'i18next';

const EditEntryModal = ({ visible, entry, onClose, onSave, editNumber, setEditNumber, editAmount, setEditAmount }) => {
    if (!entry) return null;

    // Helper function to parse the number field which can be in different formats
    const parseNumberField = (number) => {
        if (!number) return '';

        try {
            // Handle cases where number is a JSON string array
            if (typeof number === 'string' && number.startsWith('[') && number.endsWith(']')) {
                const parsed = JSON.parse(number);
                return Array.isArray(parsed) ? parsed.join(', ') : number;
            }

            // Handle cases where number is already an array
            if (Array.isArray(number)) {
                return number.join(', ');
            }

            // Handle simple string/number cases
            return String(number);
        } catch (e) {
            console.error('Error parsing number:', e);
            return String(number);
        }
    };

    const validateNumber = (value, type) => {
        if (!value) return true;

        // Remove all non-digit characters and split by commas
        const numbers = value.replace(/[^0-9,]/g, '').split(',').map(num => num.trim()).filter(num => num);

        if (numbers.length === 0) return false;

        switch (type.toLowerCase()) {
            case "open":
            case "beerich":
            case "close":
            case "cut_open":
            case "cut_close":
            case "farak":
                return numbers.every(num => num.length === 1);

            case "jodi":
            case "chokada":
                return numbers.every(num => num.length === 2);

            case "running_pan":
            case "openpan":
            case "closepan":
            case "saral_pan":
                return numbers.every(num => num.length === 3);

            case "cycle":
            case "cut":

                return numbers.every(num => num.length <= 10);

            default:
                return true;
        }
    };

    const getValidationMessage = (type) => {
        switch (type.toLowerCase()) {
            case "open":
            case "beerich":
            case "farak":
            case "cut_open":
            case "cut_close":
            case "close":
                return "Please enter 1-digit numbers (comma separated for multiple)";

            case "jodi":
            case "chokada":
                return "Please enter 2-digit numbers (comma separated for multiple)";

            case "running_pan":
            case "openpan":
            case "closepan":
            case "saral_pan":
                return "Please enter 3-digit numbers (comma separated for multiple)";

            case "cycle":
            case "cut":

                return "Maximum 10 digits per number allowed (comma separated for multiple)";

            default:
                return "Invalid input";
        }
    };

    const handleNumberChange = (text) => {
        // Allow only numbers and commas
        const cleaned = text.replace(/[^0-9,]/g, '');
        setEditNumber(cleaned);
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{t('edit_entry')}</Text>
                    <Text style={styles.modalSubtitle}>{entry.type.toUpperCase()}</Text>

                    <Text style={styles.label}>{t('enterNumber')}</Text>
                    <TextInput
                        style={[
                            styles.modalInput,
                            !validateNumber(editNumber, entry.type) && editNumber.length > 0 && styles.invalidInput
                        ]}
                        value={editNumber}
                        onChangeText={handleNumberChange}
                        keyboardType="numeric"
                        placeholder="Enter numbers (comma separated if multiple)"
                    />
                    {!validateNumber(editNumber, entry.type) && editNumber.length > 0 && (
                        <Text style={styles.errorText}>
                            {getValidationMessage(entry.type)}
                        </Text>
                    )}

                    <Text style={styles.label}>{t('enterAmount')}</Text>
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
                            <Text style={styles.modalButtonText}>{t('cancel')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.modalButton,
                                styles.saveButton,
                                (!validateNumber(editNumber, entry.type) || !editAmount) && styles.disabledButton
                            ]}
                            onPress={onSave}
                            disabled={!validateNumber(editNumber, entry.type) || !editAmount}
                        >
                            <Text style={styles.modalButtonText}>{t("save_changes")}</Text>
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
        marginBottom: 5,
        backgroundColor: globalColors.inputbgColor,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
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
    disabledButton: {
        backgroundColor: globalColors.greishwhite,
    },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    invalidInput: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 5,
        color: globalColors.inputLabel,
    }
})

export default EditEntryModal