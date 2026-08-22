import { NavigationContainer } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import Toast, { BaseToast } from 'react-native-toast-message';
import { TamaguiProvider, Text, YStack } from 'tamagui';

import DrawerNavigator from '@/app/navigation/drawer.navigator';
import { initializeDatabase } from '@/app/shared/api/db';
import i18n from '@/app/shared/i18n/i18n';
import { settingsStore } from '@/app/shared/stores/settings.store';
import { COLORS, DarkTheme, FONT_SIZE, LightTheme } from '@/app/shared/theme/global-styles';
import { config } from '@/app/shared/theme/tamagui.config';
import Loader from '@/app/shared/ui/loader.ui';

const App = observer(() => {
    const [dbError, setDbError] = useState('');

    useEffect(() => {
        initializeDatabase().catch((e) => {
            setDbError(String(e));
        });
    }, []);

    if (dbError) {
        return (
            <YStack flex={1} justifyContent="center" alignItems="center" padding={20}>
                <Text fontSize={18} fontWeight="bold" color={COLORS.red} marginBottom={10}>
                    Database Error
                </Text>
                <Text fontSize={14} color="$colorMuted" textAlign="center">
                    {dbError}
                </Text>
            </YStack>
        );
    }

    if (settingsStore.isLoading) {
        return <Loader />;
    }

    return (
        <I18nextProvider i18n={i18n}>
            <TamaguiProvider config={config} defaultTheme={settingsStore.isDark ? 'dark' : 'light'}>
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
            </TamaguiProvider>
        </I18nextProvider>
    );
});

export default App;
