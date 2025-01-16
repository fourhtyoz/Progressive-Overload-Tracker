import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from '@/navigation/DrawerNavigator';
import Toast, { BaseToast } from 'react-native-toast-message';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/utils/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LANGUAGES } from '@/constants/settings';
import { createTable } from '@/services/db';


export default function App() {
    const [lang, setLang] = useState('en');

    useEffect(() => {
        const getPreferredLanguage = async () => {
            const language = await AsyncStorage.getItem('language');
            if (!language || LANGUAGES.filter(item => item.code === language).length === 0) {
                return;
            }
            setLang(language)
        }

        createTable()
        getPreferredLanguage()

    }, [])
    
    useEffect(() => {
        i18n.changeLanguage(lang)
    }, [lang])

    return (
        // TODO: AuthProvider
        <I18nextProvider i18n={i18n}>
            <NavigationContainer independent={true}>
                <DrawerNavigator />
            </NavigationContainer>
            <Toast config={{ success: (props: any) => (<BaseToast {...props} style={{ borderLeftColor: 'lightgreen' }} text1Style={{ fontSize: 18, fontWeight: '400' }} text2Style={{ fontSize: 14 }} />)}} />
        </I18nextProvider>
    );
}