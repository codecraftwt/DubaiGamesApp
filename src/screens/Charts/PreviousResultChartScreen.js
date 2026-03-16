import React, {
    useEffect,
    useMemo,
    useState
} from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    ActivityIndicator,
} from "react-native";
import { getChartData } from "../../api/api";
import { useSelector } from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';

const PreviousResultChartScreen = () => {
    const token = useSelector((state) => state.auth.token);
    const [market, setMarket] = useState("Kalyan");
    const [data, setData] = useState([]);
    const [excludedFrom, setExcludedFrom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([
        { label: 'Kalyan', value: 'Kalyan' },
        { label: 'Mumbai', value: 'Mumbai' },
        { label: 'Kalyan-Night', value: 'Kalyan-Night' }
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getChartData(token);
                if (Array.isArray(result)) {
                    setData(result);
                } else {
                    setData(result.items ?? []);
                    setExcludedFrom(result.excludedFrom ?? null);
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const grouped = useMemo(() => {
        const filtered = data.filter(i =>
            i.market === market &&
            (!excludedFrom || i.created_at.split(" ")[0] < excludedFrom)
        );

        const map = {};
        filtered.forEach(item => {
            const date = item.created_at.split(" ")[0];
            if (!map[date]) {
                map[date] = { date, open: null, close: null };
            }
            if (item.type === "open-pan") map[date].open = item;
            if (item.type === "close-pan") map[date].close = item;
        });

        if (Object.keys(map).length === 0) return [];

        const sortedDates = Object.keys(map).sort();
        const lastDate = new Date(sortedDates[0]);
        const firstDate = new Date(sortedDates[sortedDates.length - 1]);

        const allDays = [];
        let currentDate = new Date(lastDate);
        while (currentDate <= firstDate) {
            const dateString = currentDate.toISOString().split("T")[0];
            if (map[dateString]) {
                allDays.push(map[dateString]);
            } else {
                allDays.push({ date: dateString, isHoliday: true });
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        const weeks = [];
        for (let i = 0; i < allDays.length; i += 7) {
            weeks.push(allDays.slice(i, i + 7));
        }
        return weeks;
    }, [data, market, excludedFrom]);

    const renderCell = (day, index) => {
        if (!day || day.isHoliday) {
            return (
                <View key={index} style={styles.dayCell}>
                    <View>
                        <View style={styles.rowTop}>
                            <Text style={styles.small}>*</Text>
                            <Text style={styles.small}>*</Text>
                        </View>
                        <View style={styles.rowMiddle}>
                            <Text style={styles.small}>*</Text>
                            <Text style={styles.jodi}>**</Text>
                            <Text style={styles.small}>*</Text>
                        </View>
                        <View style={styles.rowBottom}>
                            <Text style={styles.small}>*</Text>
                            <Text style={styles.small}>*</Text>
                        </View>
                    </View>
                </View>
            );
        }

        const openPan = day.open?.pannumber || "-";
        const closePan = day.close?.pannumber || "-";
        const openNum = day.open?.number ?? "-";
        const closeNum = day.close?.number ?? "-";

        return (
            <View key={index} style={styles.dayCell}>
                <View>
                    <View style={styles.rowTop}>
                        <Text style={styles.small}>{openPan?.[0]}</Text>
                        <Text style={styles.small}>{closePan?.[0]}</Text>
                    </View>
                    <View style={styles.rowMiddle}>
                        <Text style={styles.small}>{openPan?.[1]}</Text>
                        <Text style={styles.jodi}>{openNum}{closeNum}</Text>
                        <Text style={styles.small}>{closePan?.[1]}</Text>
                    </View>
                    <View style={styles.rowBottom}>
                        <Text style={styles.small}>{openPan?.[2]}</Text>
                        <Text style={styles.small}>{closePan?.[2]}</Text>
                    </View>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Error fetching data</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
                <View style={{
                    margin: 10,
                    zIndex: 2000,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10, marginHorizontal: 10 }}>
                        Select Market
                    </Text>
                    <DropDownPicker
                        open={open}
                        value={market}
                        items={items}
                        setOpen={setOpen}
                        setValue={setMarket}
                        setItems={setItems}
                        placeholder="Select Market"
                        style={{ backgroundColor: '#fff', borderColor: '#ccc', width: '65%' }}
                        dropDownContainerStyle={{ backgroundColor: '#fff', borderColor: '#ccc', width: '65%' }}
                        zIndex={2000}
                        zIndexInverse={1000}
                    />
                </View>

                <ScrollView horizontal>
                    <View>
                        <View style={styles.headerRow}>
                            <Text style={styles.dateHeader}>DATE</Text>
                            {[1, 2, 3, 4, 5, 6, 7].map(d => (
                                <Text key={d} style={styles.dayHeader}>{d}</Text>
                            ))}
                        </View>

                        {grouped.map((week, rowIndex) => {
                            const startDate = week[0]?.date || "";
                            const endDate = week[week.length - 1]?.date || "";

                            return (
                                <View key={rowIndex} style={styles.row}>
                                    <Text style={styles.dateCell}>
                                        {startDate}{"\n"}{"  to  "}{"\n"}{endDate}
                                    </Text>
                                    {Array.from({ length: 7 }).map((_, i) => renderCell(week[i], i))}
                                </View>
                            );
                        })}
                    </View>
                </ScrollView>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    headerRow: {
        flexDirection: "row",
        backgroundColor: "#eee",
    },
    dateHeader: {
        width: 120,
        textAlign: "center",
        padding: 10,
        fontWeight: "bold",
        borderWidth: 1,
        borderColor: "black",
    },
    dayHeader: {
        width: 100,
        textAlign: "center",
        padding: 10,
        fontWeight: "bold",
        borderWidth: 1,
        borderColor: "black",
        borderLeftWidth: 0,
    },
    row: {
        flexDirection: "row",
        borderColor: "black",
    },
    dateCell: {
        width: 120,
        textAlign: "center",
        padding: 10,
        fontWeight: "600",
        borderWidth: 1,
        borderColor: "black",
        borderTopWidth: 0,
    },
    dayCell: {
        width: 100,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: "black",
        borderTopWidth: 0,
        borderLeftWidth: 0,
        alignItems: "center"
    },
    rowTop: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    rowMiddle: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    rowBottom: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    small: {
        fontSize: 14
    },
    jodi: {
        fontSize: 20,
        color: "red",
        fontWeight: "bold",
        marginHorizontal: 10,
    },
});

export default PreviousResultChartScreen;