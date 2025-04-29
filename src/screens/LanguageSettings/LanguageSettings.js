import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalColors } from '../../Theme/globalColors';

const LanguageSettings = () => {
    const { i18n, t } = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'hi', name: 'हिंदी' },
        { code: 'mr', name: 'मराठी' },
        { code: 'kn', name: 'ಕನ್ನಡ' },
    ];

    const changeLanguage = async (languageCode) => {
        try {
            await i18n.changeLanguage(languageCode);
            await AsyncStorage.setItem('user-language', languageCode);
            setCurrentLanguage(languageCode);
        } catch (error) {
            console.log('Error changing language:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('selectLanguage')}</Text>
            <ScrollView style={styles.languageList}>
                {languages.map((lang) => (
                    <TouchableOpacity
                        key={lang.code}
                        style={[
                            styles.languageButton,
                            currentLanguage === lang.code && styles.selectedLanguage,
                        ]}
                        onPress={() => changeLanguage(lang.code)}
                    >
                        <Text
                            style={[
                                styles.languageText,
                                currentLanguage === lang.code && styles.selectedLanguageText,
                            ]}
                        >
                            {lang.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: globalColors.LightWhite,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    languageList: {
        flex: 1,
    },
    languageButton: {
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: '#f0f0f0',
    },
    selectedLanguage: {
        backgroundColor: globalColors.blue,
    },
    languageText: {
        fontSize: 18,
        color: '#333',
    },
    selectedLanguageText: {
        color: 'white',
    },
});

export default LanguageSettings; 