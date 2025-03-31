import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native"
import Icon from "react-native-vector-icons/FontAwesome"

const EntriesList = ({ reversedGroupedEntries, Delete, handleEdit }) => {
    if (!reversedGroupedEntries) return null;

    const formatNumbers = (numbers) => {
        if (!numbers) return "N/A";
        try {
            if (typeof numbers === "string") {
                if (numbers.startsWith("[")) {
                    return JSON.parse(numbers).join(", ");
                }
                return numbers;
            }
            if (Array.isArray(numbers)) {
                return numbers.join(", ");
            }
            return numbers;
        } catch (e) {
            return numbers;
        }
    };

    // Extract all entries from the nested structure into a flat array
    const allEntries = [];

    Object.entries(reversedGroupedEntries).forEach(([groupKey, group]) => {
        Object.entries(group).forEach(([itemKey, item]) => {
            if (typeof item === "object" && item !== null && "id" in item) {
                allEntries.push(item);
            }
        });
    });

    return (
        <ScrollView style={styles.container}>
            <View style={styles.entriesContainer}>
                {allEntries.map((item, index) => {
                    if (!item || typeof item !== "object" || !("type" in item)) return null;

                    const displayField =
                        item.type?.toLowerCase() === "chokada" ||
                            item.type?.toLowerCase() === "cycle" ||
                            item.type?.toLowerCase() === "farak" ||
                            item.type?.toLowerCase() === "beerich"
                            ? item.entry_number
                            : item.number;

                    return (
                        <View key={index} style={styles.cardStyle}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardType}>{item.type?.toUpperCase()}</Text>
                                <Text style={styles.cardMsg}>
                                    {item.msg_no ? `MSG ${item.msg_no}` : ""} {item.market_msg || ""}
                                </Text>
                            </View>
                            <View style={styles.cardContent}>
                                <Text style={styles.numbers}>{formatNumbers(displayField)}</Text>
                                <Text style={styles.amount}>₹ {item.amount}</Text>
                            </View>
                            <View style={styles.cardActions}>
                                <TouchableOpacity style={styles.actionButton} onPress={() => handleEdit(item.id)}>
                                    <Icon name="edit" size={20} color="#0066FF" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionButton} onPress={() => Delete(item.id)}>
                                    <Icon name="trash" size={20} color="#FF0000" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                })}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    entriesContainer: {
        padding: 10,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    cardStyle: {
        backgroundColor: "#fff",
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        width: "48%", // Two cards per row with a small gap
    },
    cardHeader: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
    },
    cardType: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
    },
    cardMsg: {
        fontSize: 12,
        color: "#666",
        marginTop: 2,
    },
    cardContent: {
        padding: 10,
    },
    numbers: {
        fontSize: 16,
        color: "#333",
        marginBottom: 5,
    },
    amount: {
        fontSize: 14,
        color: "#666",
    },
    cardActions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: "#E0E0E0",
    },
    actionButton: {
        marginLeft: 15,
    },
});

export default EntriesList;