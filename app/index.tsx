import { NavigationContainer } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import Toast, { BaseToast } from 'react-native-toast-message';

import DrawerNavigator from '@/app/navigation/drawer.navigator';
import { initializeDatabase } from '@/app/shared/api/db';
import i18n from '@/app/shared/i18n/i18n';
import { settingsStore } from '@/app/shared/stores/settings.store';
import { COLORS,DarkTheme, FONT_SIZE, LightTheme } from '@/app/shared/theme/global-styles';
import Loader from '@/app/shared/ui/loader.ui';

const App = observer(() => {
    useEffect(() => {
        void initializeDatabase();
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
