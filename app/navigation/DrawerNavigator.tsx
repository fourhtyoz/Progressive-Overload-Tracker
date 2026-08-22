import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GoBackButton from '@/app/components/buttons/GoBackButton';
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

// Stack navigators
const AddResultStack = createNativeStackNavigator();
const HistoryStack = createNativeStackNavigator();

function AddResultStackNavigator() {
    return (
        <AddResultStack.Navigator>
            <AddResultStack.Screen
                name="AddResultMain"
                component={AddResultScreen}
                options={({ navigation }) => ({
                    title: '',
                    headerRight: () =>
                        navigation.canGoBack() ? (
                            <GoBackButton fn={() => navigation.goBack()} />
                        ) : null,
                })}
            />
            <AddResultStack.Screen
                name="AddExercise"
                component={AddExerciseScreen}
                options={({ navigation }) => ({
                    title: '',
                    headerRight: () =>
                        navigation.canGoBack() ? (
                            <GoBackButton fn={() => navigation.goBack()} />
                        ) : null,
                })}
            />
        </AddResultStack.Navigator>
    );
}

function HistoryStackNavigator() {
    return (
        <HistoryStack.Navigator>
            <HistoryStack.Screen
                name="HistoryMain"
                component={HistoryScreen}
                options={({ navigation }) => ({
                    title: '',
                    headerRight: () =>
                        navigation.canGoBack() ? (
                            <GoBackButton fn={() => navigation.goBack()} />
                        ) : null,
                })}
            />
            <HistoryStack.Screen
                name="EditResult"
                component={EditResultScreen}
                options={({ navigation }) => ({
                    title: '',
                    headerRight: () =>
                        navigation.canGoBack() ? (
                            <GoBackButton fn={() => navigation.goBack()} />
                        ) : null,
                })}
            />
        </HistoryStack.Navigator>
    );
}

// Drawer
export type DrawerParamList = {
    Home: undefined;
    About: undefined;
    AddResult: undefined;
    History: undefined;
    Settings: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

export default function DrawerNavigator({ isDarkTheme }: any) {
    const { t } = useTranslation();

    return (
        <Drawer.Navigator
            initialRouteName="Home"
            screenOptions={({ route, navigation }) => ({
                title: route.name,
                headerTintColor: isDarkTheme ? COLORS.black : COLORS.white,
                headerTintStyle: {
                    fontWeight: 'bold',
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
                        return <GoBackButton fn={() => navigation.goBack()} />;
                    }
                },
            })}
        >
            <Drawer.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: t('home.screenName') }}
            />
            <Drawer.Screen
                name="About"
                component={AboutScreen}
                options={{ title: t('about.screenName') }}
            />
            <Drawer.Screen
                name="AddResult"
                component={AddResultStackNavigator}
                options={{ title: t('result.screenName') }}
            />
            <Drawer.Screen
                name="History"
                component={HistoryStackNavigator}
                options={{ title: t('history.screenName') }}
            />
            <Drawer.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ title: t('settings.screenName') }}
            />
        </Drawer.Navigator>
    );
}
