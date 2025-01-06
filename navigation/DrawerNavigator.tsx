import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import GoBackButton from '@/components/buttons/GoBackButton';
import { COLORS } from '@/styles/colors';

// Screens
import HomeScreen from '@/screens/HomeScreen';
import AboutScreen from '@/screens/AboutScreen';
import NewExerciseScreen from '@/screens/NewExerciseScreen';
import HistoryScreen from '@/screens/HistoryScreen';
import ResultScreen from '@/screens/ResultScreen';
import SettingsScreen from '@/screens/SettingsScreen';


export type DrawerParamList = {
    Home: undefined;
    'Add Result': undefined;
    Profile: undefined;
    'About us': undefined;
    'New Exercise': undefined;
    History: undefined;
    Settings: undefined;
  };


const Drawer = createDrawerNavigator<DrawerParamList>();

export default function DrawerNavigator() {
    return (
        <Drawer.Navigator 
            initialRouteName="Home" 
            screenOptions={
                ({ route, navigation}) => (
                    {  
                        title: route.name,
                        headerTintColor: '#fff',
                        headerTintStyle: {
                            fontWeight: 'bold'
                        },
                        headerShadowVisible: false,
                        headerStyle: {
                            backgroundColor: '#000',
                        },
                        drawerContentStyle: {
                            backgroundColor: COLORS.orange,
                        },
                        drawerActiveBackgroundColor: '#000',
                        drawerActiveTintColor: '#FFF',

                        headerRight: () => {
                            if (navigation.canGoBack()) {
                                return (
                                    <GoBackButton title="Go Back" onPress={() => navigation.goBack()} />
                                );
                            }
                        },
                    }
                )
            }
        >
            <Drawer.Screen name="Home" component={HomeScreen} />
            <Drawer.Screen name="Add Result" component={ResultScreen} />
            <Drawer.Screen name="About us" component={AboutScreen} />
            <Drawer.Screen name="New Exercise" component={NewExerciseScreen} />
            <Drawer.Screen name="History" component={HistoryScreen} />
            <Drawer.Screen name="Settings" component={SettingsScreen} />
        </Drawer.Navigator>
    );
}