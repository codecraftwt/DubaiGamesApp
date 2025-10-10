import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MarketResultMarquee = ({ results }) => {
    // Group results by market
    const groupedResults = results.reduce((acc, result) => {
        if (!acc[result.market]) acc[result.market] = {};
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
                    duration: 400,
                    useNativeDriver: true,
                }).start(() => {
                    setCurrentMarketIndex((prev) => (prev + 1) % markets.length);
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 400,
                        useNativeDriver: true,
                    }).start();
                });
            }, 3000);

            return () => clearInterval(interval);
        }
    }, [markets.length]);

    if (markets.length === 0) return null;

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
                {marketResults['open-pan'] && marketResults['close-pan'] ? (
                    <LODResult
                        label="RESULT"
                        result={{
                            combined: `${marketResults['open-pan'].pannumber}-${marketResults['open-pan'].number}${marketResults['close-pan'].number}-${marketResults['close-pan'].pannumber}`
                        }}
                    />
                ) : marketResults['open-pan'] ? (
                    <LODResult
                        label="OPEN PAN"
                        result={{
                            combined: `${marketResults['open-pan'].pannumber}-${marketResults['open-pan'].number}`
                        }}
                    />
                ) : marketResults['close-pan'] ? (
                    <LODResult
                        label="CLOSE PAN"
                        result={{
                            combined: `${marketResults['close-pan'].number}-${marketResults['close-pan'].pannumber}`
                        }}
                    />
                ) : null}
            </Animated.View>


        </LinearGradient>
    );
};

// LOD-style Result component with 111-22-111 format
const LODResult = ({ label, result }) => {
    return (
        <View style={styles.lodContainer}>
            <Text style={styles.lodLabel}>{label}</Text>
            <View style={styles.lodBadge}>
                <Text style={styles.lodValue}>{result.combined}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
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
        marginRight: 10,
    },
    marketContainer: {
        flexDirection: 'row',
        flex: 1,
        gap: 5,

        // justifyContent: 'space-around',
        // marginLeft: 50,
        justifyContent: 'center'
    },
    marketText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 14,
    },
    lodContainer: {
        alignItems: 'center',
    },
    lodLabel: {
        color: 'white',
        fontSize: 11,
        fontWeight: '600',
        marginBottom: 4,
        opacity: 0.9,
    },
    lodBadge: {
        backgroundColor: 'white',
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    lodValue: {
        color: '#4a8cff',
        fontWeight: '800',
        fontSize: 12,
    },
});

export default MarketResultMarquee;
