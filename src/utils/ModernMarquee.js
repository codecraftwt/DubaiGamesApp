import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MarketResultMarquee = ({ results }) => {
    // Group results by market
    const groupedResults = results.reduce((acc, result) => {
        if (!acc[result.market]) {
            acc[result.market] = {};
        }
        acc[result.market][result.type] = result;
        return acc;
    }, {});

    const markets = Object.keys(groupedResults);
    const [currentMarketIndex, setCurrentMarketIndex] = useState(0);
    const fadeAnim = useState(new Animated.Value(1))[0];

    // Auto-rotate through markets
    useEffect(() => {
        if (markets.length > 1) {
            const interval = setInterval(() => {
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }).start(() => {
                    setCurrentMarketIndex((prev) => (prev + 1) % markets.length);
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }).start();
                });
            }, 3000); // Change market every 5 seconds

            return () => clearInterval(interval);
        }
    }, [markets.length]);

    if (markets.length === 0) {
        return (
            // <View style={styles.emptyContainer}>
            //     <Icon name="info" size={20} color="#4a8cff" />
            //     <Text style={styles.emptyText}>No results declared yet !</Text>
            // </View>
            ''
        );
    }

    const currentMarket = markets[currentMarketIndex];
    const marketResults = groupedResults[currentMarket];

    return (
        <LinearGradient
            colors={['#4a8cff', '#6a5acd']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.container}
        >
            <Icon name="notifications" size={20} color="white" style={styles.icon} />
            <Text style={styles.marketText}>{currentMarket?.toUpperCase()}</Text>
            <Animated.View style={[styles.marketContainer, { opacity: fadeAnim }]}>


                <View style={styles.resultsContainer}>
                    {marketResults['open-pan'] && (
                        <ResultItem
                            type="OPEN PAN"
                            result={marketResults['open-pan']}
                        />
                    )}

                    {marketResults['close-pan'] && (
                        <ResultItem
                            type="CLOSE PAN"
                            result={marketResults['close-pan']}
                        />
                    )}
                </View>
            </Animated.View>
        </LinearGradient>
    );
};

const ResultItem = ({ type, result }) => (
    <View style={{flexDirection:'row',alignItems:'center'}}>
        <View style={styles.resultItem}>
            <Text style={styles.typeText}>{type}</Text>
        <View style={styles.numberBadge}>
            <Text style={styles.numberText}>{result.number}</Text>
        </View>
            </View>
        
        <Text style={styles.panText}>PAN: {result.pannumber}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 2,
        paddingHorizontal: 10,
        borderRadius: 12,
        marginHorizontal: 5,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },
    icon: {
        marginRight: 12,
    },
    emptyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f8ff',
        padding: 12,
        borderRadius: 12,
        marginHorizontal: 5,
        marginVertical: 6,
        borderWidth: 1,
        borderColor: '#d1e3ff',
    },
    emptyText: {
        color: '#4a8cff',
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 8,
    },
    marketContainer: {
        flex: 1,
        alignItems: 'center',
    },
    marketText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 14,
        // marginBottom: 8,
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    resultsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    resultItem: {
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical:5,
        // gap:5
    },
    typeText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 10,
        marginBottom: 2,
        opacity: 0.9,
    },
    numberBadge: {
        backgroundColor: 'white',
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 10,
        // marginBottom: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    numberText: {
        color: '#4a8cff',
        fontWeight: '800',
        fontSize: 10,
    },
    panText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 12,
        opacity: 0.8,
    },
    sideText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 10,
        marginBottom: 2,
        opacity: 0.9,
    },
});

export default MarketResultMarquee;