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
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { getChartData } from "../../api/api";

const ChartsScreen = () => {

    const [market, setMarket] = useState("Kalyan");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const chartData = await getChartData();
                setData(chartData);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const grouped = useMemo(() => {
        const filtered = data.filter(i => i.market === market);
        const map = {};
        filtered.forEach(item => {
            const date = item.created_at.split(" ")[0];
            if (!map[date]) {
                map[date] = {
                    date,
                    open: null,
                    close: null,
                };
            }
            if (item.type === "open-pan") {
                map[date].open = item;
            }
            if (item.type === "close-pan") {
                map[date].close = item;
            }
        });

        const sortedDates = Object.keys(map).sort((a, b) => new Date(b) - new Date(a));
        if (sortedDates.length === 0) {
            return [];
        }

        const allDays = [];
        const firstDate = new Date(sortedDates[0]);
        const lastDate = new Date(sortedDates[sortedDates.length - 1]);

        let currentDate = new Date(firstDate);
        while (currentDate >= lastDate) {
            const dateString = currentDate.toISOString().split("T")[0];
            if (map[dateString]) {
                allDays.push(map[dateString]);
            } else {
                allDays.push({
                    date: dateString,
                    isHoliday: true
                });
            }
            currentDate.setDate(currentDate.getDate() - 1);
        }

        const weeks = [];
        for (let i = 0; i < allDays.length; i += 7) {
            weeks.push(allDays.slice(i, i + 7));
        }

        return weeks;
    }, [data, market]);


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
                    {/* TOP */}
                    <View style={styles.rowTop}>
                        <Text style={styles.small}>{openPan?.[0]}</Text>
                        <Text style={styles.small}>{closePan?.[0]}</Text>
                    </View>

                    {/* MIDDLE */}
                    <View style={styles.rowMiddle}>
                        <Text style={styles.small}>{openPan?.[1]}</Text>

                        <Text style={styles.jodi}>
                            {openNum}{closeNum}
                        </Text>

                        <Text style={styles.small}>{closePan?.[1]}</Text>
                    </View>

                    {/* BOTTOM */}
                    <View style={styles.rowBottom}>
                        <Text style={styles.small}>{openPan?.[2]}</Text>
                        <Text style={styles.small}>{closePan?.[2]}</Text>
                    </View>
                </View>
            </View>

        )

    }

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
            <ScrollView>

                <View style={{ marginVertical: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20, textDecorationLine: 'underline', textAlign: 'center' }}>varthar</Text>
                </View>
                <View style={styles.marketRow}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20, textDecorationLine: 'underline' }}>Markets</Text>
                    <TouchableOpacity
                        style={[styles.marketBtn, market === "Kalyan" && styles.active]}
                        onPress={() => setMarket("Kalyan")}
                    >
                        <Text>Kalyan</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.marketBtn, market === "Mumbai" && styles.active]}
                        onPress={() => setMarket("Mumbai")}
                    >
                        <Text>Mumbai</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.marketBtn, market === "Kalyan-Night" && styles.active]}
                        onPress={() => setMarket("Kalyan-Night")}
                    >
                        <Text>Kalyan-Night</Text>
                    </TouchableOpacity>

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

                            const start = week[0]?.date || "";
                            const end = week[week.length - 1]?.date || "";

                            return (

                                <View key={rowIndex} style={styles.row}>

                                    <Text style={styles.dateCell}>
                                        {start}{"\n"}{end}
                                    </Text>

                                    {Array.from({ length: 7 }).map((_, i) => renderCell(week[i], i))}

                                </View>

                            )

                        })}

                    </View>

                </ScrollView>
            </ScrollView>
        </SafeAreaView>

    )

}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#fff"
    },

    marketRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 10,
        // marginHorizontal: 20
    },

    marketBtn: {
        padding: 10,
        borderWidth: 1,
        marginHorizontal: 10
    },

    active: {
        backgroundColor: "#ddd"
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
    rowMiddle: {
        flexDirection: "row",
        // paddingHorizontal: 10,
        // paddingVertical: 10,
        justifyContent: "space-between",
        alignItems: "center",
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
        // paddingHorizontal: 10,
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

    pana: {
        fontSize: 14,
        flexDirection: 'column'
        // flexDirection: "column"
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
        // marginVertical: 2,
        marginHorizontal: 10,
    },

    holidayText: {
        fontSize: 24,
        color: "red",
        fontWeight: "bold"
    },

    redDigit: {
        fontSize: 16,
        color: "red",
        fontWeight: "bold",
        flexDirection: 'row'

    }

});

export default ChartsScreen;