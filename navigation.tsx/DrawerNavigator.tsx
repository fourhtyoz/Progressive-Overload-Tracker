import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

// Screens
import HomeScreen from '@/screens/HomeScreen';
import AboutScreen from '@/screens/AboutScreen';
import NewExerciseScreen from '@/screens/NewExerciseScreen';
import HistoryScreen from '@/screens/HistoryScreen';


export type DrawerParamList = {
    Home: undefined;
    Profile: undefined;
    About: undefined;
    NewExercise: undefined;
    History: undefined;
  };


const Drawer = createDrawerNavigator<DrawerParamList>();

export default function DrawerNavigator() {
    return (
        <Drawer.Navigator 
            initialRouteName="Home" 
            screenOptions={
                ({ route, navigation}) => 
                    ({  title: route.name,
                        headerTintColor: '#fff',
                        headerTintStyle: {
                            fontWeight: 'bold'
                        },
                        headerShadowVisible: false,
                        headerStyle: {
                            backgroundColor: '#000',
                        },
                        drawerContentStyle: {
                            backgroundColor: '#FFC857',
                        },
                        drawerActiveBackgroundColor: '#000',
                        drawerActiveTintColor: '#FFF'
                    })
            }
        >
            <Drawer.Screen 
                name="Home" 
                component={HomeScreen} 
            />
            <Drawer.Screen 
                name="About" 
                component={AboutScreen} 
            />
            <Drawer.Screen 
                name="NewExercise" 
                component={NewExerciseScreen} 
            />
            <Drawer.Screen 
                name="History" 
                component={HistoryScreen} 
            />
        </Drawer.Navigator>
    );
}