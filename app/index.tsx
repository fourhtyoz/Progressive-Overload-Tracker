import React, { useEffect } from 'react';
import Toast, { BaseToast } from 'react-native-toast-message';
import { I18nextProvider } from 'react-i18next';
import { NavigationContainer } from '@react-navigation/native';

import { observer } from 'mobx-react-lite';

import i18n from '@/app/translations/i18n';
import Loader from '@/app/components/Loader';
import { settingsStore } from '@/app/store/store';
import DrawerNavigator from '@/app/navigation/DrawerNavigator';
import { createTables, deleteTables } from '@/app/services/db';
import { LightTheme, DarkTheme, FONT_SIZE } from '@/app/styles/globalStyles';
import { generateExercises, generateResults, clearAsyncStorage } from '@/app/utils/utils';


const App = observer(() => {
    useEffect(() => {
        // for development
        // clearAsyncStorage();
        // deleteTables();
        createTables();
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
                            style={{ 
                                borderLeftColor: 'lightgreen',
                                borderLeftWidth: 10,
                                backgroundColor: settingsStore.isDark ? '#171717' : '#f8f9fa'}} 
                            text1Style={{ 
                                fontSize: FONT_SIZE.large, 
                                fontWeight: 'bold',
                                color: settingsStore.isDark ? '#f8f9fa' : '#171717' 
                             }} 
                            text2Style={{ 
                                fontSize: FONT_SIZE.normal,
                                color: settingsStore.isDark ? '#f8f9fa' : '#171717' 
                             }} 
                        />
                )}} 
            />
        </I18nextProvider>
    );
});

export default App