import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const StaffAttendanceView = ({ modalVisible, setModalVisible, selectedUser }) => {
    return (
        <Modal
            visible={modalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>
                        खात्याची तपशील : {selectedUser?.userName}
                    </Text>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setModalVisible(false)}
                    >
                        <Text style={styles.closeText}>✖</Text>
                    </TouchableOpacity>

                    <View style={styles.tableContainer}>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.tableHeaderCell, { width: 100 }]}>तारीख</Text>
                            <Text style={[styles.tableHeaderCell, { width: 100 }]}>प्रकार</Text>
                            <Text style={[styles.tableHeaderCell, { width: 100 }]}>रक्कम</Text>
                        </View>

                        {selectedUser?.transactions?.length ? (
                            selectedUser.transactions.map((transaction, index) => (
                                <View key={index} style={styles.tableRow}>
                                    <Text style={[styles.tableCell, { width: 100 }]}>{transaction.date}</Text>
                                    <Text style={[styles.tableCell, { width: 100 }]}>{transaction.type}</Text>
                                    <Text style={[styles.tableCell, { width: 100 }]}>{transaction.amount.toFixed(2)}</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={{ textAlign: "center", padding: 10 }}>No Transactions</Text>
                        )}

                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryText}>संपूर्ण रक्कम (आठवडा)</Text>
                            <Text style={styles.summaryValue}>{selectedUser?.total}</Text>
                        </View>

                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryText}>एकूण घेणे</Text>
                            <Text style={styles.summaryValue}>{selectedUser?.totalTaken}</Text>
                        </View>

                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryText}>एकूण दिले</Text>
                            <Text style={styles.summaryValue}>{selectedUser?.totalGiven}</Text>
                        </View>

                        <View style={styles.summaryRow}>
                            <Text style={styles.finalText}>अंतिम रक्कम</Text>
                            <Text style={styles.finalValue}>{selectedUser?.finalAmount}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "90%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        position: "relative",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
        padding: 5,
    },
    closeText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    tableContainer: {
        marginTop: 20,
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#f5f5f5",
        paddingVertical: 8,
        borderBottomWidth: 2,
        borderBottomColor: "#ddd",
    },
    tableHeaderCell: {
         fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
        paddingHorizontal: 10,
    },
    tableRow: {
        flexDirection: "row",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    tableCell: {
        fontSize: 14,
        textAlign: "center",
        paddingHorizontal: 10,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    summaryText: {
        fontSize: 14,
    },
    summaryValue: {
        fontSize: 14,
    },
    finalText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
    },
    finalValue: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
    },
});

export default StaffAttendanceView;