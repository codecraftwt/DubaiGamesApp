import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import { globalColors } from '../../Theme/globalColors';
import { DubaiGameslogo } from '../../Theme/globalImage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CustomHeader = ({
    title,
    showBackButton = false,
    onBackPress,
    rightComponent,
    backgroundColor = globalColors.blue || '#1e293b'
}) => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const handleBackPress = () => {
        if (onBackPress) {
            onBackPress();
        } else {
            navigation.goBack();
        }
    };

    // Provide fallback values if insets are not available
    const topPadding = insets?.top || (Platform.OS === 'ios' ? 44 : 24);

    return (
        <View style={[styles.header, { backgroundColor, paddingTop: topPadding }]}>
            <View style={styles.headerContent}>
                {showBackButton && (
                    <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                        <Feather name="arrow-left" size={24} color="white" />
                    </TouchableOpacity>
                )}

                <View style={styles.titleContainer}>
                    <Image source={DubaiGameslogo} style={styles.logo} />
                    <Text style={styles.title}>{title || 'Dubai Game'}</Text>
                </View>

                {rightComponent && (
                    <View style={styles.rightComponent}>
                        {rightComponent}
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingBottom: 15,
        paddingHorizontal: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        padding: 8,
        marginRight: 8,
    },
    titleContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        height: 28,
        width: 40,
        marginRight: 8,
    },
    title: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    rightComponent: {
        minWidth: 40,
        alignItems: 'flex-end',
    },
});

export default CustomHeader;
