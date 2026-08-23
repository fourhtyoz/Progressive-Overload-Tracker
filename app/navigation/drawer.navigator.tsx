import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { observer } from 'mobx-react-lite';
import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, View } from 'react-native';

import AddExerciseScreen from '@/app/pages/add-exercise/add-exercise.ui';
import EditResultScreen from '@/app/pages/edit-result/edit-result.ui';
import { settingsStore } from '@/app/shared/stores/settings.store';
import { COLORS } from '@/app/shared/theme/global-styles';

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

function MenuButton({ navigation }: { navigation: any }) {
    const isDark = settingsStore.isDark;
    return (
        <Pressable
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            hitSlop={8}
            style={{ paddingHorizontal: 12 }}
            accessibilityRole="button"
            accessibilityLabel="Menu"
        >
            <Ionicons name="menu" size={24} color={isDark ? COLORS.textDarkScreen : COLORS.black} />
        </Pressable>
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

const AddResultStackNavigator = observer(function AddResultStackNavigator() {
    const { t } = useTranslation();
    const isDark = settingsStore.isDark;

    return (
        <AddResultStack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: isDark ? COLORS.backgroundDark : COLORS.white },
                headerTintColor: isDark ? COLORS.textDarkScreen : COLORS.black,
                headerTitleStyle: { fontWeight: 'bold' },
                headerShadowVisible: false,
            }}
        >
            <AddResultStack.Screen
                name="AddResultMain"
                component={AddResultScreenWrapper}
                options={({ navigation }) => ({
                    title: t('result.screenName'),
                    headerLeft: () => <MenuButton navigation={navigation} />,
                })}
            />
            <AddResultStack.Screen
                name="AddExercise"
                component={AddExerciseScreen}
                options={{ title: t('newExercise.screenName') }}
            />
        </AddResultStack.Navigator>
    );
});

const HistoryStackNavigator = observer(function HistoryStackNavigator() {
    const { t } = useTranslation();
    const isDark = settingsStore.isDark;

    return (
        <HistoryStack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: isDark ? COLORS.backgroundDark : COLORS.white },
                headerTintColor: isDark ? COLORS.textDarkScreen : COLORS.black,
                headerTitleStyle: { fontWeight: 'bold' },
                headerShadowVisible: false,
            }}
        >
            <HistoryStack.Screen
                name="HistoryMain"
                component={HistoryScreenWrapper}
                options={({ navigation }) => ({
                    title: t('history.screenName'),
                    headerLeft: () => <MenuButton navigation={navigation} />,
                })}
            />
            <HistoryStack.Screen
                name="EditResult"
                component={EditResultScreen}
                options={{ title: t('errors.editResult') }}
            />
        </HistoryStack.Navigator>
    );
});

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
                headerTintColor: isDarkTheme ? COLORS.textDarkScreen : COLORS.black,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerShadowVisible: false,
                headerStyle: {
                    backgroundColor: isDarkTheme ? COLORS.backgroundDark : COLORS.white,
                },
                drawerContentStyle: {
                    backgroundColor: isDarkTheme ? COLORS.backgroundDark : COLORS.backgroundLight,
                },
                drawerActiveBackgroundColor: COLORS.orange,
                drawerActiveTintColor: COLORS.black,
                drawerInactiveTintColor: isDarkTheme ? COLORS.textDarkScreen : COLORS.textSecondary,
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
                options={{ title: t('result.screenName'), headerShown: false }}
            />
            <Drawer.Screen
                name="History"
                component={HistoryStackNavigator}
                options={{ title: t('history.screenName'), headerShown: false }}
            />
            <Drawer.Screen
                name="Settings"
                component={SettingsScreenWrapper}
                options={{ title: t('settings.screenName') }}
            />
        </Drawer.Navigator>
    );
}
