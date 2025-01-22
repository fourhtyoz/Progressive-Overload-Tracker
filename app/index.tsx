import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from '@/navigation/DrawerNavigator';
import Toast, { BaseToast } from 'react-native-toast-message';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/utils/i18n';
import { observer } from 'mobx-react-lite';
import { createTables } from '@/services/db';
import { settingsStore } from '@/store/store';
import Loader from '@/components/Loader';
import { LightTheme, DarkTheme } from '@/styles/themes';


const App = observer(() => {
    useEffect(() => {
        createTables();
        settingsStore.initialize();
    }, []);

    if (settingsStore.isLoading) {
        return (
            <Loader />
        )
    } 

    return (
        <I18nextProvider i18n={i18n}>
            <NavigationContainer independent={true} theme={settingsStore.isDark ? DarkTheme : LightTheme}>
                <DrawerNavigator isDarkTheme={settingsStore.isDark} />
            </NavigationContainer>
            <Toast 
                config={{ 
                    success: (props: any) => (
                    <BaseToast 
                        {...props} 
                        style={{ borderLeftColor: 'lightgreen' }} 
                        text1Style={{ fontSize: 18, fontWeight: '400' }} 
                        text2Style={{ fontSize: 14 }} 
                    />
                )}} 
            />
        </I18nextProvider>
    );
});

export default App