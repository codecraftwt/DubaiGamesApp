import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalColors } from '../../Theme/globalColors';
import { widthPercentageToDP } from 'react-native-responsive-screen';

const LanguageSelector = () => {
    const { i18n } = useTranslation();

    const changeLanguage = async (lng) => {
        await i18n.changeLanguage(lng);
        await AsyncStorage.setItem('user-language', lng);

    };
    useEffect(() => {
        AsyncStorage.getItem('user-language').then((lng) => {
            if (lng && i18n.language !== lng) {
                i18n.changeLanguage(lng);
            }
        });
    }, [i18n]);


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select Language / भाषा चुनें / भाषा निवडा</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, i18n.language === 'en' && styles.activeButton]}
                    onPress={() => changeLanguage('en')}
                >
                    <Text style={[styles.buttonText, i18n.language === 'en' && styles.activeButtonText]}>English</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, i18n.language === 'hi' && styles.activeButton]}
                    onPress={() => changeLanguage('hi')}
                >
                    <Text style={[styles.buttonText, i18n.language === 'hi' && styles.activeButtonText]}>हिंदी</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, i18n.language === 'mr' && styles.activeButton]}
                    onPress={() => changeLanguage('mr')}
                >
                    <Text style={[styles.buttonText, i18n.language === 'mr' && styles.activeButtonText]}>मराठी</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, i18n.language === 'kn' && styles.activeButton]}
                    onPress={() => changeLanguage('kn')}
                >
                    <Text style={[styles.buttonText, i18n.language === 'kn' && styles.activeButtonText]}>ಕನ್ನಡ</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        marginVertical: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: widthPercentageToDP('80%')
    },
    button: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 6,
        marginHorizontal: 4,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    activeButton: {
        backgroundColor: globalColors.blue,
        borderColor: globalColors.blue,
    },
    buttonText: {
        fontSize: 14,
        color: '#333',
    },
    activeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default LanguageSelector;