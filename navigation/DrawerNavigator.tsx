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
import { useTranslation } from 'react-i18next';


export type DrawerParamList = {
    Home: any;
    Result: undefined;
    Profile: undefined;
    About: undefined;
    NewExercise: undefined;
    History: undefined;
    Settings: undefined;
  };


const Drawer = createDrawerNavigator<DrawerParamList>();

export default function DrawerNavigator() {
    const { t } = useTranslation();

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
                                    <GoBackButton title={t('general.goBackButton')} onPress={() => navigation.goBack()} />
                                );
                            }
                        },
                    }
                )
            }
        >
            <Drawer.Screen name="Home" component={HomeScreen} options={{ title: t('home.screenName') }} />
            <Drawer.Screen name="Result" component={ResultScreen} options={{ title: t('result.screenName') }} />
            <Drawer.Screen name="About" component={AboutScreen} options={{ title: t('about.screenName') }} />
            <Drawer.Screen name="NewExercise" component={NewExerciseScreen} options={{ title: t('newExercise.screenName') }} />
            <Drawer.Screen name="History" component={HistoryScreen} options={{ title: t('history.screenName') }} />
            <Drawer.Screen name="Settings" component={SettingsScreen} options={{ title: t('settings.screenName') }} />
        </Drawer.Navigator>
    );
}