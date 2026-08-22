import React, { useEffect } from 'react';
import Toast, { BaseToast } from 'react-native-toast-message';
import { I18nextProvider } from 'react-i18next';
import { NavigationContainer } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import i18n from '@/app/shared/i18n/i18n';
import Loader from '@/app/shared/ui/loader.ui';
import { settingsStore } from '@/app/shared/stores/settings.store';
import DrawerNavigator from '@/app/navigation/drawer.navigator';
import { initializeDatabase } from '@/app/shared/api/db';
import { LightTheme, DarkTheme, FONT_SIZE, COLORS } from '@/app/shared/theme/global-styles';

const App = observer(() => {
    useEffect(() => {
        initializeDatabase();
    }, []);

    if (settingsStore.isLoading) {
        return <Loader />;
    }

    return (
        <I18nextProvider i18n={i18n}>
            <NavigationContainer
                independent={true}
                theme={settingsStore.isDark ? DarkTheme : LightTheme}
            >
                <DrawerNavigator isDarkTheme={settingsStore.isDark} />
            </NavigationContainer>
            <Toast
                config={{
                    success: (props: object) => (
                        <BaseToast
                            {...props}
                            style={{
                                borderLeftColor: 'lightgreen',
                                borderLeftWidth: 10,
                                backgroundColor: settingsStore.isDark ? COLORS.backgroundDark : COLORS.backgroundLight,
                            }}
                            text1Style={{
                                fontSize: FONT_SIZE.large,
                                fontWeight: 'bold',
                                color: settingsStore.isDark ? COLORS.backgroundLight : COLORS.backgroundDark,
                            }}
                            text2Style={{
                                fontSize: FONT_SIZE.normal,
                                color: settingsStore.isDark ? COLORS.backgroundLight : COLORS.backgroundDark,
                            }}
                        />
                    ),
                }}
            />
        </I18nextProvider>
    );
});

export default App;
