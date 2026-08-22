import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import AboutScreen from '@/app/pages/about/about.ui';
import AddExerciseScreen from '@/app/pages/add-exercise/add-exercise.ui';
import AddResultScreen from '@/app/pages/add-result/add-result.ui';
import EditResultScreen from '@/app/pages/edit-result/edit-result.ui';
import HistoryScreen from '@/app/pages/history/history.ui';
// Screens
import HomeScreen from '@/app/pages/home/home.ui';
import SettingsScreen from '@/app/pages/settings/settings.ui';
import { COLORS } from '@/app/shared/theme/global-styles';
import GoBackButton from '@/app/shared/ui/go-back-button.ui';

// Stack navigators
const AddResultStack = createNativeStackNavigator<AddResultStackParamList>();
const HistoryStack = createNativeStackNavigator<HistoryStackParamList>();

export type AddResultStackParamList = {
    AddResultMain: undefined;
    AddExercise: undefined;
};

export type HistoryStackParamList = {
    HistoryMain: undefined;
    EditResult: { resultId: number };
};

function AddResultStackNavigator() {
    return (
        <AddResultStack.Navigator
            screenOptions={({ navigation }: { navigation: NativeStackNavigationProp<AddResultStackParamList> }) => ({
                title: '',
                headerRight: () =>
                    navigation.canGoBack() ? (
                        <GoBackButton fn={() => navigation.goBack()} />
                    ) : null,
            })}
        >
            <AddResultStack.Screen name="AddResultMain" component={AddResultScreen} />
            <AddResultStack.Screen name="AddExercise" component={AddExerciseScreen} />
        </AddResultStack.Navigator>
    );
}

function HistoryStackNavigator() {
    return (
        <HistoryStack.Navigator
            screenOptions={({ navigation }: { navigation: NativeStackNavigationProp<HistoryStackParamList> }) => ({
                title: '',
                headerRight: () =>
                    navigation.canGoBack() ? (
                        <GoBackButton fn={() => navigation.goBack()} />
                    ) : null,
            })}
        >
            <HistoryStack.Screen name="HistoryMain" component={HistoryScreen} />
            <HistoryStack.Screen name="EditResult" component={EditResultScreen} />
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

export default function DrawerNavigator({ isDarkTheme }: { isDarkTheme: boolean }) {
    const { t } = useTranslation();

    return (
        <Drawer.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
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
