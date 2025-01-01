import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from '@/navigation.tsx/DrawerNavigator';

export default function App() {
    return (
        <NavigationContainer independent={true}>
            <DrawerNavigator />
        </NavigationContainer>
    );
}