import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { lazy,Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, View } from 'react-native';

import AddExerciseScreen from '@/app/pages/add-exercise/add-exercise.ui';
import EditResultScreen from '@/app/pages/edit-result/edit-result.ui';
import { COLORS } from '@/app/shared/theme/global-styles';
import GoBackButton from '@/app/shared/ui/go-back-button.ui';

// Lazy loaded screens
const HomeScreen = lazy(() => import('@/app/pages/home/home.ui'));
const AboutScreen = lazy(() => import('@/app/pages/about/about.ui'));
const HistoryScreen = lazy(() => import('@/app/pages/history/history.ui'));
const SettingsScreen = lazy(() => import('@/app/pages/settings/settings.ui'));
const AddResultScreen = lazy(() => import('@/app/pages/add-result/add-result.ui'));

// Loading fallback component
function ScreenLoader() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={COLORS.orange} />
        </View>
    );
}

// Wrapper components for lazy loaded screens
function HomeScreenWrapper(props: any) {
    return (
        <Suspense fallback={<ScreenLoader />}>
            <HomeScreen {...props} />
        </Suspense>
    );
}

function AboutScreenWrapper(props: any) {
    return (
        <Suspense fallback={<ScreenLoader />}>
            <AboutScreen {...props} />
        </Suspense>
    );
}

function HistoryScreenWrapper(props: any) {
    return (
        <Suspense fallback={<ScreenLoader />}>
            <HistoryScreen {...props} />
        </Suspense>
    );
}

function SettingsScreenWrapper(props: any) {
    return (
        <Suspense fallback={<ScreenLoader />}>
            <SettingsScreen {...props} />
        </Suspense>
    );
}

function AddResultScreenWrapper(props: any) {
    return (
        <Suspense fallback={<ScreenLoader />}>
            <AddResultScreen {...props} />
        </Suspense>
    );
}

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
            <AddResultStack.Screen name="AddResultMain" component={AddResultScreenWrapper} />
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
            <HistoryStack.Screen name="HistoryMain" component={HistoryScreenWrapper} />
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
                headerTitleStyle: {
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
                component={HomeScreenWrapper}
                options={{ title: t('home.screenName') }}
            />
            <Drawer.Screen
                name="About"
                component={AboutScreenWrapper}
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
                component={SettingsScreenWrapper}
                options={{ title: t('settings.screenName') }}
            />
        </Drawer.Navigator>
    );
}
