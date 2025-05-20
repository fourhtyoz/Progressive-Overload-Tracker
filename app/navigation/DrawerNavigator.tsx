import React from 'react';
import GoBackButton from '@/app/components/buttons/GoBackButton';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { COLORS } from '@/app/styles/globalStyles';
import { useTranslation } from 'react-i18next';

// Screens
import HomeScreen from '@/app/screens/HomeScreen';
import AboutScreen from '@/app/screens/AboutScreen';
import AddResultScreen from '@/app/screens/AddResultScreen';
import AddExerciseScreen from '@/app/screens/AddExerciseScreen';
import HistoryScreen from '@/app/screens/HistoryScreen';
import SettingsScreen from '@/app/screens/SettingsScreen';
import EditResultScreen from '@/app/screens/EditResultScreen';


export type DrawerParamList = {
    Home: any;
    AddResult: undefined;
    AddExercise: undefined;
    About: undefined;
    History: undefined;
    Settings: undefined;
    EditResult: undefined;
};


const Drawer = createDrawerNavigator<DrawerParamList>();

export default function DrawerNavigator({ isDarkTheme }: any) {
    const { t } = useTranslation();

    return (
        <Drawer.Navigator
            initialRouteName="Home" 
            screenOptions={
                ({ route, navigation}) => (
                    {  
                        title: route.name,
                        headerTintColor:  isDarkTheme ? COLORS.black : COLORS.white,
                        headerTintStyle: {
                            fontWeight: 'bold'
                        },
                        headerShadowVisible: false,
                        headerStyle: {
                            backgroundColor: isDarkTheme ? COLORS.orange : COLORS.black,
                        },
                        drawerContentStyle: {
                            backgroundColor: isDarkTheme ? COLORS.black : COLORS.orange,
                        },
                        drawerActiveBackgroundColor: isDarkTheme ? COLORS.orange : COLORS.black,
                        drawerActiveTintColor: isDarkTheme ? COLORS.black : COLORS.white,

                        headerRight: () => {
                            if (navigation.canGoBack()) {
                                return (
                                    <GoBackButton fn={() => navigation.goBack()}/>
                                );
                            }
                        },
                    }
                )
            }
        >
            <Drawer.Screen name="Home" component={HomeScreen} options={{ title: t('home.screenName') }} />
            <Drawer.Screen name="About" component={AboutScreen} options={{ title: t('about.screenName') }} />
            <Drawer.Screen name="AddResult" component={AddResultScreen} options={{ title: t('result.screenName') }} />
            <Drawer.Screen name="History" component={HistoryScreen} options={{ title: t('history.screenName') }} />
            <Drawer.Screen name="Settings" component={SettingsScreen} options={{ title: t('settings.screenName') }} />
            
            {/* Hidden screens */}
            <Drawer.Screen name="AddExercise" component={AddExerciseScreen} options={{ title: t('newExercise.screenName'), drawerItemStyle: { display: 'none' } }} />
            <Drawer.Screen name="EditResult" component={EditResultScreen} options={{ title: t('settings.screenName'), drawerItemStyle: { display: 'none' } }} />
        </Drawer.Navigator>
    );
}