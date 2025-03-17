import React, { useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Button } from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';

// Get screen width and height for responsive design
const { width, height } = Dimensions.get('window');

const BusinessReport = () => {
    const [data, setData] = useState([
        { id: 1, date: "12/03/2025", market: "New Yorkrrrrrrrrrrrrrrrrrrrrrrrr", totalKam: 1000, commission: "10%", totalPaid: 900, totalBus: 100 },
        { id: 2, date: "13/03/2025", market: "Los Angeles", totalKam: 1200, commission: "12%", totalPaid: 1050, totalBus: 150 },
        { id: 3, date: "14/03/2025", market: "Chicago", totalKam: 1100, commission: "11%", totalPaid: 950, totalBus: 120 }
    ]);

    // Function to calculate totals
    const calculateTotal = (key = data[0]) => {
        return data.reduce((sum, item) => sum + (typeof item[key] === "number" ? item[key] : 0), 0);
    };

    // Refresh Button Logic (For example, fetch new data)
    const handleRefresh = () => {
        console.log("Refreshing data...");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Business Report</Text>

            {/* Controls (Export & Refresh) */}
            <View style={styles.buttonContainer}>
                <Button mode="contained" style={styles.button} onPress={() => console.log("Export Excel")}>
                    Excel
                </Button>
                <Button mode="contained" style={styles.button} onPress={() => console.log("Export PDF")}>
                    PDF
                </Button>
                <Button mode="contained" style={styles.button} buttonColor="red" onPress={handleRefresh}>Refresh
                </Button>
            </View>

            {/* Table */}
            <ScrollView horizontal>
                <View>
                    {/* Header */}
                    <View style={styles.tableHeader}>
                        <Text style={styles.headerCell}>SR</Text>
                        <Text style={styles.headerCell}>DATE</Text>
                        <Text style={styles.headerCell}>MARKET</Text>
                        <Text style={styles.headerCell}>TOTAL KAM</Text>
                        <Text style={styles.headerCell}>COMMISSION</Text>
                        <Text style={styles.headerCell}>TOTAL PAID</Text>
                        <Text style={styles.headerCell}>TOTAL BUS.</Text>
                    </View>

                    {/* Rows */}
                    <ScrollView style={styles.tableBody}>
                        {data.map((item, index) => (
                            <View key={item.id} style={styles.tableRow}>
                                <Text style={styles.rowCell}>{index + 1}</Text>
                                <Text style={styles.rowCell}>{item.date}</Text>
                                <Text style={styles.rowCell}>{item.market}</Text>
                                <Text style={styles.rowCell}>{item.totalKam}</Text>
                                <Text style={styles.rowCell}>{item.commission}</Text>
                                <Text style={styles.rowCell}>{item.totalPaid}</Text>
                                <Text style={styles.rowCell}>{item.totalBus}</Text>
                            </View>
                        ))}
                    </ScrollView>

                    {/* Footer - Totals */}
                    <View style={styles.tableFooter}>
                        <Text style={styles.footerCell}>TOTAL</Text>
                        <Text style={styles.footerCell}>-</Text>
                        <Text style={styles.footerCell}>-</Text>
                        <Text style={styles.footerCell}>{calculateTotal("totalKam")}</Text>
                        <Text style={styles.footerCell}>-</Text>
                        <Text style={styles.footerCell}>{calculateTotal("totalPaid")}</Text>
                        <Text style={styles.footerCell}>{calculateTotal("totalBus")}</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: width * 0.05, // Responsive padding
        backgroundColor: '#fff',
    },
    title: {
        fontSize: width > 600 ? 26 : 22, // Adjust font size based on screen width
        fontFamily: 'Poppins-Bold',
        marginBottom: 15,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 15,
    },
    button: {
        flex: 1,
        marginHorizontal: 5,
        paddingVertical: width > 600 ? 12 : 10, // Responsive button padding
        fontSize: width > 600 ? 16 : 14, // Adjust button text size
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f1f1f1',
        borderBottomWidth: 2,
        borderBottomColor: '#ddd',
    },
    headerCell: {
        paddingVertical: 12,
        paddingHorizontal: 8,
        // fontFamily: 'Poppins-Bold',
        fontWeight: 'bold',
        width: width > 600 ? 120 : 110, // Adjust header width for tablet
        textAlign: 'center',
        fontSize: width > 600 ? 16 : 14, // Responsive font size
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    rowCell: {
        paddingVertical: 10,
        paddingHorizontal: 8,
        width: width > 600 ? 120 : 110, // Adjust row cell width for tablet
        textAlign: 'center',
        fontSize: width > 600 ? 16 : 14, // Responsive font size
    },
    tableFooter: {
        flexDirection: 'row',
        backgroundColor: '#f1f1f1',
    },
    footerCell: {
        paddingVertical: 12,
        paddingHorizontal: 8,
        fontWeight: 'bold',
        width: width > 600 ? 120 : 90, // Adjust footer width for tablet
        textAlign: 'center',
        fontSize: width > 600 ? 16 : 14, // Responsive font size
    },
});

export default BusinessReport;
