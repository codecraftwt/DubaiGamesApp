// StaffAttendanceInsertModal
import React, { useState } from "react";
import {
    View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Platform
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const StaffAttendanceInsertModal = ({ modalVisible, setModalVisible }) => {
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");

    // Function to handle date selection
    const onChange = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === "ios"); // Keep picker open on iOS
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    return (
    
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        {/* Modal Header */}
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>INSERT EXTRA PAID/RETURN AMOUNT</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={styles.closeButton}>✖</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Input Fields */}
                        <Text style={styles.label}>USER NAME</Text>
                        <TextInput style={styles.input} value="Admin" editable={false} />

                        {/* Date Picker */}
                        <Text style={styles.label}>SELECT DATE</Text>
                        <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
                            <Text>{date.toLocaleDateString()}</Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display="default"
                                onChange={onChange}
                            />
                        )}

                        <Text style={styles.label}>TYPE</Text>
                        <TextInput style={styles.input} value="येंगे" editable={false} />

                        <Text style={styles.label}>AMOUNT</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter amount"
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount}
                        />

                        <Text style={styles.label}>NOTE</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Enter note"
                            value={note}
                            onChangeText={setNote}
                            multiline
                        />

                        {/* Save Button */}
                        <TouchableOpacity style={styles.saveButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.saveButtonText}>Save Record</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    openButton: {
        backgroundColor: "#3498db",
        padding: 10,
        borderRadius: 5,
    },
    openButtonText: {
        color: "#fff",
        fontSize: 16,
    },
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContainer: {
        width: "90%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    closeButton: {
        fontSize: 18,
        color: "#333",
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        marginTop: 10,
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginTop: 5,
    },
    textArea: {
        height: 80,
    },
    saveButton: {
        backgroundColor: "#28a745",
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        alignItems: "center",
    },
    saveButtonText: {
        color: "#fff",
        fontSize: 16,
    },
});

export default StaffAttendanceInsertModal;
