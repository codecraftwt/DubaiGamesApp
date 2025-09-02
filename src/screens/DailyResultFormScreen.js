import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Animated,
    Dimensions,
    ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDailyResult } from '../Redux/Slices/dailyResultSlice';
import { globalColors } from '../Theme/globalColors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';

const { width, height } = Dimensions.get('window');

const DailyResultFormScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { status, error } = useSelector((state) => state.dailyResult);
    const [market, setMarket] = useState('kalyan');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [errorAnimation] = useState(new Animated.Value(0));
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([
        { label: 'Kalyan', value: 'kalyan' },
        { label: 'Mumbai', value: 'mumbai' },

    ]);

    useEffect(() => {
        if (error) {
            // Animate error message
            Animated.sequence([
                Animated.timing(errorAnimation, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.delay(3000),
                Animated.timing(errorAnimation, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [error]);

    const handleSubmit = async () => {
        if (!market) {
            showError(t('pleaseSelectMarket'));
            return;
        }

        const formattedDate = date.toISOString().split('T')[0];
        const result = await dispatch(fetchDailyResult({ market, date: formattedDate }));
        console.log("result", result)
        if (result?.meta?.requestStatus === 'fulfilled') {
            const totalWinnings = (result.payload.totalOpenWin || 0) + (result.payload.totalCloseWin || 0);
            if (totalWinnings > 0) {
                navigation.navigate('ResultPage', { amount: totalWinnings, data: result?.meta?.arg, result: result?.payload });
            } else {
                navigation.navigate('BetterLuck', { amount: 0, data: result?.meta?.arg, result: result?.payload });
            }
        } else {
            console.log("result api0000", result)
        }
    };

    const showError = (message) => {
        Animated.sequence([
            Animated.timing(errorAnimation, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.delay(3000),
            Animated.timing(errorAnimation, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const errorTranslateY = errorAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [-100, 0],
    });

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.errorContainer,
                    {
                        transform: [{ translateY: errorTranslateY }],
                        opacity: errorAnimation,
                    },
                ]}
            >
                <Icon name="alert-circle" size={24} color={globalColors.white} />
                <Text style={styles.errorText}>{error || t('somethingWentWrong')}</Text>
            </Animated.View>

            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.headerContainer}>
                    <Icon name="trophy-outline" size={40} color={globalColors.primary} />
                    <Text style={styles.title}>{t('checkResult')}</Text>
                    <Text style={styles.subtitle}>{t('checkYourWinnings')}</Text>
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>{t('selectMarket')}</Text>
                        <DropDownPicker
                            open={open}
                            value={market}
                            items={items}
                            setOpen={setOpen}
                            setValue={setMarket}
                            setItems={setItems}
                            style={styles.dropdown}
                            textStyle={styles.dropdownText}
                            placeholder={t('selectMarket')}
                            dropDownContainerStyle={styles.dropdownContainer}
                            zIndex={3000}
                            zIndexInverse={1000}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>{t('selectDate')}</Text>
                        <TouchableOpacity
                            style={styles.dateButton}
                            onPress={() => setShowDatePicker(true)}>
                            <Icon name="calendar-outline" size={24} color={globalColors.primary} />
                            <Text style={styles.dateText}>
                                {date.toLocaleDateString()}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={onDateChange}
                            maximumDate={new Date()}
                        />
                    )}

                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            status === 'loading' && styles.submitButtonDisabled
                        ]}
                        onPress={handleSubmit}
                        disabled={status === 'loading'}>
                        {status === 'loading' ? (
                            <ActivityIndicator color={globalColors.black} />
                        ) : (
                            <>
                                <Icon name="search-outline" size={24} color={globalColors.black} style={styles.buttonIcon} />
                                <Text style={styles.submitButtonText}>{t('checkResult')}</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: globalColors.white,
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
    },
    headerContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontFamily: 'Poppins-Bold',
        color: globalColors.darkBlue,
        marginTop: 15,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: globalColors.grey,
        marginTop: 8,
        textAlign: 'center',
    },
    formContainer: {
        flex: 1,
        paddingHorizontal: 10,
    },
    inputContainer: {
        marginBottom: 25,
    },
    label: {
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
        color: globalColors.darkBlue,
        marginBottom: 10,
    },
    dropdown: {
        borderColor: globalColors.grey,
        borderRadius: 12,
        height: 55,
        borderWidth: 1,
        backgroundColor: globalColors.white,
    },
    dropdownText: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: globalColors.darkBlue,
    },
    dropdownContainer: {
        borderColor: globalColors.grey,
        borderRadius: 12,
        borderWidth: 1,
        backgroundColor: globalColors.white,
    },
    dateButton: {
        borderWidth: 1,
        borderColor: globalColors.grey,
        borderRadius: 12,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: globalColors.white,
    },
    dateText: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: globalColors.darkBlue,
        marginLeft: 10,
    },
    submitButton: {
        backgroundColor: globalColors.primary,
        padding: 10,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        borderColor: globalColors.Charcoal,
        borderWidth: 1,
        // elevation: 3,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    submitButtonDisabled: {
        opacity: 0.7,
    },
    buttonIcon: {
        marginRight: 10,
    },
    submitButtonText: {
        color: globalColors.black,
        fontSize: 18,
        fontFamily: 'Poppins-Bold',
    },
    errorContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FF6B6B',
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    errorText: {
        color: globalColors.white,
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
        marginLeft: 8,
        textAlign: 'center',
    },
});

export default DailyResultFormScreen; 