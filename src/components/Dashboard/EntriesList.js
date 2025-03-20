import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const EntriesList = ({ reversedGroupedEntries }) => {
    if (!reversedGroupedEntries) return null;

    const formatNumbers = (numbers) => {
        if (!numbers) return 'N/A';
        try {
            if (typeof numbers === 'string') {
                if (numbers.startsWith('[')) {
                    return JSON.parse(numbers).join(', ');
                }
                return numbers;
            }
            if (Array.isArray(numbers)) {
                return numbers.join(', ');
            }
            return numbers;
        } catch (e) {
            return numbers;
        }
    };

    return Object.entries(reversedGroupedEntries).map(([key, group]) => {
        const totalAmount = Object.values(group).reduce((sum, item) => {
            return sum + (typeof item === 'object' && 'amount' in item ? Number(item.amount) : 0);
        }, 0);

        // Extract msg_no and market_msg from the first item in the group
        const firstItem = Object.values(group).find(item => typeof item === 'object' && 'msg_no' in item && 'market_msg' in item);
        const msg_no = firstItem?.msg_no || 'NULL';
        const market_msg = firstItem?.market_msg || 'NULL';

        const title = `${msg_no} MSG ${market_msg}`;

        return (
            <ScrollView horizontal style={{ alignContent: 'space-around', gap: 10 }}>
                <View key={key} style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{title}</Text>
                        <Text style={styles.totalAmount}>TOTAL = {totalAmount}</Text>
                    </View>

                    <View style={styles.cardsContainer}>
                        {Object.values(group).map((item, index) => {
                            if (typeof item === 'object' && 'type' in item) {
                                return (
                                    <View key={index} style={styles.cardStyle}>
                                        <View style={styles.cardHeader}>
                                            <View style={styles.checkbox} />
                                            <Text style={styles.cardType}>{item.type?.toUpperCase()}</Text>
                                        </View>

                                        <View style={styles.cardContent}>
                                            <Text style={styles.numbers}>{formatNumbers(item.number)}</Text>
                                            <Text style={styles.amount}>₹ {item.amount}</Text>
                                        </View>

                                        <View style={styles.cardActions}>
                                            <TouchableOpacity style={styles.actionButton}>
                                                <Icon name="refresh" size={20} color="#FFB800" />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.actionButton}>
                                                <Icon name="edit" size={20} color="#0066FF" />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.actionButton}>
                                                <Icon name="trash" size={20} color="#FF0000" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                );
                            }
                            return null;
                        })}
                    </View>
                </View>
            </ScrollView>

        );
    });
};

const styles = StyleSheet.create({
    section: {
        marginBottom: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#F5F5F5',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    totalAmount: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    cardsContainer: {
        padding: 10,
        flexDirection: 'row'
    },
    cardStyle: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        width: 200
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: '#999',
        borderRadius: 4,
        marginRight: 10,
    },
    cardType: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    cardContent: {
        padding: 10,
    },
    numbers: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    amount: {
        fontSize: 14,
        color: '#666',
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    actionButton: {
        marginLeft: 15,
    },
});

export default EntriesList;