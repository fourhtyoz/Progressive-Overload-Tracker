import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from '@/navigation/DrawerNavigator';
import Toast from 'react-native-toast-message';


export default function App() {
    return (
        // AuthProvider
        <>
            <NavigationContainer independent={true}>
                <DrawerNavigator />
            </NavigationContainer>
            <Toast />
        </>
    );
}