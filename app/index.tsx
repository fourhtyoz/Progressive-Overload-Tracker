import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from '@/navigation/DrawerNavigator';
import Toast, { BaseToast } from 'react-native-toast-message';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/utils/i18n';


const toastConfig = {
    success: (props: any) => (
        <BaseToast
            {...props}
            style={{ borderLeftColor: 'lightgreen' }}
            text1Style={{
                fontSize: 18,
                fontWeight: '400'
            }}
            text2Style={{
                fontSize: 14,
            }}
        />
    )
};

export default function App() {
    return (
        // TODO: AuthProvider
        <I18nextProvider i18n={i18n}>
            <NavigationContainer independent={true}>
                <DrawerNavigator />
            </NavigationContainer>
            <Toast config={toastConfig} />
        </I18nextProvider>
    );
}