import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';

// Sample data structure
const data = {
    counter: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    numbers: { "1": 150, "0": 10, "2": 20, "3": 50, "6": 80, "8": 20 },
    jodies_data: {
        "12": 60, "31": 20, "11": 20, "16": 10, "61": 10, "66": 10,
        "17": 20, "62": 20, "67": 20, "13": 10, "18": 10, "63": 10,
        "68": 10, "36": 10, "81": 10, "86": 10, "32": 10
    },
    "panarray": {
        "100": 0,
        "119": 0,
        "128": 0,
        "137": 0,
        "146": 0,
        "155": 0,
        "227": 0,
        "236": 0,
        "245": 0,
        "290": 0,
        "335": 0,
        "344": 0,
        "380": 0,
        "399": 0,
        "470": 0,
        "489": 0,
        "560": 0,
        "579": 0,
        "588": 0,
        "669": 0,
        "678": 0,
        "777": 0,
        "110": 0,
        "129": 0,
        "138": 0,
        "147": 0,
        "156": 0,
        "200": 0,
        "228": 0,
        "237": 0,
        "246": 0,
        "255": 0,
        "336": 0,
        "345": 0,
        "390": 0,
        "444": 0,
        "480": 0,
        "499": 0,
        "570": 0,
        "589": 0,
        "660": 0,
        "679": 0,
        "688": 0,
        "778": 0,
        "111": 0,
        "120": 0,
        "139": 0,
        "148": 0,
        "157": 0,
        "166": 0,
        "229": 0,
        "238": 0,
        "247": 0,
        "256": 0,
        "300": 0,
        "346": 0,
        "355": 0,
        "337": 0,
        "445": 0,
        "490": 0,
        "580": 0,
        "670": 0,
        "689": 0,
        "599": 0,
        "779": 0,
        "788": 0,
        "112": 0,
        "130": 0,
        "149": 0,
        "158": 0,
        "167": 0,
        "220": 0,
        "239": 0,
        "248": 0,
        "257": 0,
        "266": 0,
        "338": 0,
        "347": 0,
        "356": 0,
        "400": 0,
        "446": 0,
        "455": 0,
        "590": 0,
        "680": 0,
        "699": 0,
        "770": 0,
        "789": 0,
        "888": 0,
        "113": 0,
        "122": 0,
        "140": 0,
        "159": 0,
        "168": 0,
        "177": 0,
        "230": 0,
        "249": 0,
        "258": 0,
        "267": 0,
        "339": 0,
        "348": 0,
        "357": 0,
        "366": 0,
        "447": 0,
        "456": 0,
        "500": 0,
        "555": 0,
        "690": 0,
        "780": 0,
        "799": 0,
        "889": 0,
        "114": 0,
        "123": 0,
        "150": 0,
        "169": 0,
        "178": 0,
        "222": 0,
        "240": 0,
        "259": 0,
        "268": 0,
        "277": 0,
        "330": 0,
        "349": 0,
        "358": 0,
        "367": 0,
        "448": 0,
        "457": 0,
        "466": 0,
        "556": 0,
        "600": 0,
        "790": 0,
        "880": 0,
        "899": 0,
        "115": 0,
        "124": 0,
        "133": 0,
        "160": 0,
        "179": 0,
        "188": 0,
        "223": 0,
        "250": 0,
        "269": 0,
        "278": 0,
        "340": 0,
        "359": 0,
        "368": 0,
        "377": 0,
        "449": 0,
        "458": 0,
        "467": 0,
        "557": 0,
        "566": 0,
        "700": 0,
        "890": 0,
        "999": 0,
        "116": 0,
        "125": 0,
        "134": 0,
        "170": 0,
        "189": 0,
        "224": 0,
        "233": 0,
        "260": 0,
        "279": 0,
        "288": 0,
        "350": 0,
        "369": 0,
        "378": 0,
        "440": 0,
        "459": 0,
        "468": 0,
        "477": 0,
        "558": 0,
        "567": 0,
        "666": 0,
        "800": 0,
        "990": 0,
        "117": 0,
        "126": 0,
        "135": 0,
        "144": 0,
        "180": 0,
        "199": 0,
        "225": 0,
        "234": 0,
        "270": 0,
        "289": 0,
        "333": 0,
        "360": 0,
        "379": 0,
        "388": 0,
        "450": 0,
        "469": 0,
        "478": 0,
        "559": 0,
        "568": 0,
        "577": 0,
        "667": 0,
        "900": 0,
        "118": 0,
        "127": 0,
        "136": 0,
        "145": 0,
        "190": 0,
        "226": 0,
        "235": 0,
        "244": 0,
        "280": 0,
        "299": 0,
        "334": 0,
        "370": 0,
        "389": 0,
        "460": 0,
        "479": 0,
        "488": 0,
        "550": 0,
        "569": 0,
        "578": 0,
        "668": 0,
        "677": 0,
        "000": 0
    },
    total_play: 330,
    br: { "1": 117, "0": 0, "2": 0, "3": 17, "6": 47, "8": 0 },
    remain_amouunt: 33
};

export default function ResultPage() {
    const renderNumbersTable = () => (
        <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
                <Text style={styles.headerText}>BEFOR OPEN LOAD NUMBER</Text>
            </View>
            <Text style={styles.amountText}>AMOUNT: ₹{data.total_play}.00</Text>
            <View style={styles.table}>
                <View style={styles.tableRow}>
                    {data.counter.map((num) => (
                        <View key={num} style={styles.tableCell}>
                            <Text style={styles.cellHeader}>{num}</Text>
                            <Text style={styles.cellValue}>{data.numbers[num] || 0}</Text>
                            <Text style={styles.cellBR}>{data.br[num] || 0}.00</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );

    const renderJodiesTable = () => (
        <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
                <Text style={styles.headerText}>BEFOR OPEN LOAD JODI</Text>
            </View>
            <Text style={styles.amountText}>AMOUNT: ₹270.00</Text>
            <View style={styles.jodiesGrid}>
                {Object.entries(data.jodies_data).map(([key, value]) => (
                    <View key={key} style={styles.jodiCell}>
                        <Text style={styles.jodiNumber}>{key}</Text>
                        <Text style={styles.jodiValue}>{value}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
    const renderPannaTable = () => {
        const pannaEntries = Object.entries(data.panarray);
        const columns = 10;
        const rows = Math.ceil(pannaEntries.length / columns);

        return (
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>BEFOR OPEN LOAD PAN</Text>
                    <Text style={styles.amount}>AMOUNT: ₹0.00</Text>
                </View>
                <ScrollView horizontal>
                    <View>
                        <View style={styles.pannaHeader}>
                            {Array.from({ length: columns }, (_, i) => (
                                <View key={i} style={styles.pannaHeaderCell}>
                                    <Text style={styles.headerText}>{i}</Text>
                                    <Text style={styles.headerText}>₹</Text>
                                </View>
                            ))}
                        </View>
                        {Array.from({ length: rows }).map((_, rowIndex) => (
                            <View key={rowIndex} style={styles.pannaRow}>
                                {pannaEntries
                                    .slice(rowIndex * columns, (rowIndex + 1) * columns)
                                    .map(([number, amount], colIndex) => (
                                        <View key={`${rowIndex}-${colIndex}`} style={styles.pannaCell}>
                                            <Text style={styles.pannaNumber}>{number}</Text>
                                            <Text style={styles.pannaAmount}>{amount}</Text>
                                        </View>
                                    ))}
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.totalText}>TOTAL PLAY: ₹{data.total_play}.00</Text>
                <Text style={styles.totalText}>AMOUNT: ₹{data.total_play}.00</Text>
            </View>

            {renderNumbersTable()}
            {renderJodiesTable()}
            {renderPannaTable()}

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTotal: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    headerAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    section: {
        backgroundColor: '#fff',
        marginTop: 16,
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    section: {
        backgroundColor: '#fff',
        marginTop: 16,
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionHeader: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 4,
    },
    amount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingBottom: 8,
    },
    tableHeaderCell: {
        flex: 1,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 8,
    },
    tableCell: {
        flex: 1,
        alignItems: 'center',
    },
    cellText: {
        fontSize: 16,
        color: '#333',
    },
    cellTextSmall: {
        fontSize: 12,
        color: '#666',
    },
    jodiContainer: {
        marginTop: 8,
    },
    jodiRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    jodiCell: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#f8f8f8',
        borderRadius: 4,
        marginHorizontal: 4,
    },
    jodiNumber: {
        fontSize: 14,
        color: '#333',
    },
    jodiAmount: {
        fontSize: 14,
        color: '#0066cc',
        fontWeight: 'bold',
    },
    pannaHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingBottom: 8,
    },
    pannaHeaderCell: {
        width: 80,
        alignItems: 'center',
    },
    pannaRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    pannaCell: {
        width: 80,
        paddingVertical: 8,
        alignItems: 'center',
    },
    pannaNumber: {
        fontSize: 14,
        color: '#333',
        marginBottom: 2,
    },
    pannaAmount: {
        fontSize: 12,
        color: '#666',
    },
});