import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const EntriesList = ({
    reversedGroupedEntries,
    Delete,
    handleEdit,
    handleChangeMsg,
    resultnum,
    resultpan,
    userRole
}) => {
    if (!reversedGroupedEntries) return null;

    const formatNumbers = (entry, type) => {
        if (!entry) return "N/A";

        try {
            if (type === 'running_pan' || type === 'beerich' || type === 'farak' || type === 'cycle' || type === 'chokada') {
                const numbers = JSON.parse(entry.entry_number).join(', ');
                const numbersArray = numbers.split(",");

                // if (type === 'running_pan') {
                //     const formatted = numbersArray[0].replace(
                //         new RegExp(resultpan, 'g'),
                //         resultpan
                //     );
                //     return formatted + ',' + numbersArray[1];
                // } else if (type === 'cycle') {
                //     const formatted = numbersArray[0].replace(
                //         new RegExp(resultnum, 'g'),
                //         resultnum
                //     );
                //     return formatted + ',' + numbersArray[1];
                // } else if (type === 'beerich' || type === 'farak') {
                //     if (resultpan !== "null") {
                //         return numbersArray.map(num => num).join(', ');
                //     }
                //     return numbers;
                // }
                return numbers;
            }
            else if (type === 'openpan') {
                const numbersArray = JSON.parse(entry.entry_number);
                return numbersArray.map(num =>
                    num === resultpan ? num : num
                ).join(', ');
            }
            else if (type === 'closepan') {
                return JSON.parse(entry.entry_number).join(', ');
            }
            else {
                const numbers = JSON.parse(entry.number).join(', ');
                if (type !== 'cut_close') {
                    return numbers.split(",").map(num => {
                        const number = parseInt(num, 10);
                        const firstDigit = number.toString().charAt(0);
                        if (firstDigit === resultnum && type !== 'close') {
                            return number;
                        }
                        return number;
                    }).join(', ');
                }
                return numbers;
            }
        } catch (e) {
            return entry.number || entry.entry_number || "N/A";
        }
    };

    const renderNormalEntries = (entries) => {
        return entries.map((entry, index) => (
            <View
                key={`normal-${entry.id}-${index}`}
                style={[
                    styles.cardStyle,
                    { backgroundColor: entry.verified_by === 0 ? '#fff' : 'lightgreen' }
                ]}
            >
                <View style={styles.cardHeader}>
                    {userRole === "admin" && (
                        <View style={styles.checkboxContainer}>
                            {/* Checkbox would go here */}
                        </View>
                    )}
                    <TouchableOpacity onPress={() => {/* verify_status would go here */ }}>
                        <Text style={styles.cardType}>{entry.type.toUpperCase()}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.cardContent}>
                    <Text style={styles.numbers}>{formatNumbers(entry, entry.type)}</Text>
                    <Text style={styles.amount}>₹ {entry.amount}</Text>
                </View>
                {(entry.verified_by === 0 || userRole === "admin") && (
                    <View style={styles.cardActions}>
                        {/* <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleChangeMsg(entry.id)}
                        >
                            <Icon name="recycle" size={20} color="#FFA500" />
                        </TouchableOpacity> */}
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleEdit(entry.id)}
                        >
                            <Icon name="edit" size={20} color="#0066FF" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => Delete(entry.id)}
                        >
                            <Icon name="trash" size={20} color="#FF0000" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        ));
    };

    const renderPanTableEntries = (panEntries) => {
        const childrenGrouped = {};
        const parents = {};

        // Process pan entries to group children with parents
        panEntries.forEach(entry => {
            if (entry.type === 'saral_pan' || entry.type === 'ulta_pan') {
                if (entry.parent !== "0") {
                    try {
                        const parentIds = JSON.parse(entry.parent);
                        const parentKey = JSON.stringify(parentIds);

                        if (!childrenGrouped[parentKey]) {
                            childrenGrouped[parentKey] = { children: [], type: entry.type };
                        }
                        childrenGrouped[parentKey].children.push(entry);
                    } catch (e) {
                        console.error("Error parsing parent IDs:", e);
                    }
                } else {
                    parents[entry.id] = entry;
                }
            }
        });

        return Object.keys(childrenGrouped).map((parentKey, index) => {
            const parentIds = JSON.parse(parentKey);
            const type = childrenGrouped[parentKey].type;
            const children = childrenGrouped[parentKey].children;

            let parentContent = [];
            let childContent = [];

            // Render parent entries
            parentIds.forEach(parentId => {
                if (parents[parentId]) {
                    const parent = parents[parentId];
                    const isHighlighted =
                        (type === 'ulta_pan' && resultnum === parent.number) ||
                        (type === 'saral_pan' && resultpan === parent.number);

                    parentContent.push(
                        <View key={`parent-${parentId}`} style={styles.panEntry}>
                            <Text style={isHighlighted ? styles.highlightedText : styles.normalText}>
                                {parent.number}X{parent.amount}
                            </Text>
                        </View>
                    );
                }
            });

            // Render child entries
            children.forEach(child => {
                childContent.push(
                    <View key={`child-${child.id}`} style={styles.panEntry}>
                        <Text style={styles.normalText}>
                            {child.number}X{child.amount}
                        </Text>
                    </View>
                );
            });

            const mergedIds = [...parentIds, ...children.map(child => child.id)];
            const backgroundColor = parents[parentIds[0]]?.verified_by === 0 ? '#fff' : 'lightgreen';

            return (
                <View
                    key={`pan-${index}`}
                    style={[
                        styles.cardStyle,
                        { backgroundColor },
                        styles.panCard
                    ]}
                >
                    <View style={styles.cardHeader}>
                        <TouchableOpacity onPress={() => {/* verify_status would go here */ }}>
                            <Text style={styles.cardType}>{type.toUpperCase()}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.panContent}>
                        {parentContent}
                        {childContent}
                    </View>
                    {(parents[parentIds[0]]?.verified_by === 0 || userRole === "admin") && (
                        <View style={styles.cardActions}>
                            {/* <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => handleChangeMsg(JSON.stringify(mergedIds))}
                            >
                                <Icon name="recycle" size={20} color="#FFA500" />
                            </TouchableOpacity> */}
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => Delete(JSON.stringify(mergedIds))}
                            >
                                <Icon name="trash" size={20} color="#FF0000" />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            );
        });
    };

    const renderAllEntries = () => {
        // Flatten all entries from all groups
        const allEntries = [];
        Object.values(reversedGroupedEntries).forEach(group => {
            Object.values(group).forEach(entry => {
                if (typeof entry === 'object' && entry !== null && 'id' in entry) {
                    allEntries.push(entry);
                }
            });
        });

        // Separate normal entries from pan entries
        const normalEntries = allEntries.filter(
            entry => entry.type !== 'saral_pan' && entry.type !== 'ulta_pan'
        );

        const panEntries = allEntries.filter(
            entry => entry.type === 'saral_pan' || entry.type === 'ulta_pan'
        );

        return (
            <View style={styles.container}>
                {renderNormalEntries(normalEntries)}
                {renderPanTableEntries(panEntries)}
            </View>
        );
    };

    return (
        <ScrollView style={styles.scrollContainer}>
            {renderAllEntries()}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        padding: 10,
    },
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    cardStyle: {
        backgroundColor: "#fff",
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#000",
        width: "48%",
    },
    panCard: {
        width: "100%",
        marginBottom: 15,
    },
    cardHeader: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
        alignItems: "center",
    },
    cardType: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
    },
    cardContent: {
        padding: 10,
    },
    panContent: {
        padding: 10,
    },
    panEntry: {
        marginBottom: 5,
    },
    numbers: {
        fontSize: 16,
        color: "#333",
        marginBottom: 5,
    },
    highlightedText: {
        color: "red",
    },
    normalText: {
        color: "#333",
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
    checkboxContainer: {
        marginRight: 10,
    },
});

export default EntriesList;