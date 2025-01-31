import React, { useEffect } from 'react';
import Toast, { BaseToast } from 'react-native-toast-message';
import { I18nextProvider } from 'react-i18next';
import { NavigationContainer } from '@react-navigation/native';

import { observer } from 'mobx-react-lite';

import i18n from '@/utils/i18n';
import Loader from '@/components/Loader';
import { settingsStore } from '@/store/store';
import DrawerNavigator from '@/navigation/DrawerNavigator';
import { createTables, deleteTables } from '@/services/db';
import { LightTheme, DarkTheme, FONT_SIZE } from '@/styles/globalStyles';
import { generateExercises, generateResults, clearAsyncStorage } from '@/utils/helpFunctions';


const App = observer(() => {
    useEffect(() => {
        // for development
        // clearAsyncStorage();
        // deleteTables();

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