import AsyncStorage from '@react-native-async-storage/async-storage';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import Toast from 'react-native-toast-message';
import { Label, Text, XStack, YStack } from 'tamagui';

import { deleteTables, initializeDatabase } from '@/app/shared/api/db';
import { LANGUAGES, THEME_KEYS, UNIT_KEYS } from '@/app/shared/constants/settings';
import { exerciseStore } from '@/app/shared/stores/exercise.store';
import { settingsStore } from '@/app/shared/stores/settings.store';
import { COLORS, FONT_SIZE, globalStyles } from '@/app/shared/theme/global-styles';
import Button from '@/app/shared/ui/button.ui';
import ErrorMessage from '@/app/shared/ui/error-message.ui';

const SettingsScreen = observer(() => {
    const [error, setError] = useState('');
    const { t } = useTranslation();
    const isDark = settingsStore.isDark;

    const handleGetInTouch = () => {
        Alert.alert(t('settings.getInTouch'), `${t('settings.sendEmailTo')} hualua@gmail.com`);
    };

    const handleDeleteAllData = async () => {
        await deleteTables();
        await initializeDatabase();
        await exerciseStore.initialize();
        Alert.alert(t('alerts.success'), t('settings.dataDeleted'));
    };

    const handleDeleteData = () => {
        Alert.alert(t('alerts.areYouSure'), t('alerts.wantToDelete'), [
            { text: t('alerts.yesProceed'), onPress: handleDeleteAllData },
            { text: t('alerts.noIchangedMyMind') },
        ]);
    };

    const handleChangeLanguage = async (lang: { title: string; code: string }) => {
        if (!lang) return;
        setError('');
        try {
            await AsyncStorage.setItem('language', lang.code);
            settingsStore.setLanguage(lang.code);
            Toast.show({
                type: 'success',
                text1: t('toasts.success'),
                text2: t('toasts.changedLanguage'),
            });
        } catch (e) {
            setError(String(e));
        }
    };

    const handleChangeUnits = async (units: string) => {
        if (!units || typeof units !== 'string') return;
        setError('');
        try {
            await AsyncStorage.setItem('units', units);
            settingsStore.setUnits(units);
            Toast.show({
                type: 'success',
                text1: t('toasts.success'),
                text2: t('toasts.changedUnits'),
            });
        } catch (e) {
            setError(String(e));
        }
    };

    const handleChangeTheme = async (theme: string) => {
        if (!theme || typeof theme !== 'string') return;
        setError('');
        try {
            await AsyncStorage.setItem('theme', theme);
            settingsStore.setTheme(theme);
            Toast.show({
                type: 'success',
                text1: t('toasts.success'),
                text2: t('toasts.changedTheme'),
            });
        } catch (e) {
            setError(String(e));
        }
    };

    return (
        <YStack flex={1} paddingHorizontal={20} gap={15}>
            {error && <ErrorMessage message={error} setError={setError} />}

            {/* Language */}
            <YStack marginBottom={10}>
                <XStack alignItems="center" justifyContent="space-between">
                    <Label fontSize={FONT_SIZE.normal} fontWeight="bold"
                        color={isDark ? COLORS.textDarkScreen : COLORS.black}>
                        {t('settings.options.language')}:
                    </Label>
                    <SelectDropdown
                        data={LANGUAGES}
                        defaultValue={
                            LANGUAGES.filter((item) => item.code === settingsStore.language)[0]
                        }
                        onSelect={(selectedItem) => handleChangeLanguage(selectedItem)}
                        showsVerticalScrollIndicator={false}
                        dropdownStyle={globalStyles.dropdownMenuStyle}
                        renderButton={(selectedItem) => (
                            <XStack width="auto" justifyContent="center" alignItems="center">
                                <Text fontSize={FONT_SIZE.normal}
                                    color={isDark ? COLORS.textDarkScreen : COLORS.black}>
                                    {selectedItem?.title || settingsStore.language}
                                </Text>
                            </XStack>
                        )}
                        renderItem={(item, _, isSelected) => (
                            <XStack
                                style={[
                                    globalStyles.dropdownItemStyle,
                                    { width: 200 },
                                    isSelected && {
                                        backgroundColor: isDark ? COLORS.orange : COLORS.selectedLight,
                                    },
                                ]}
                            >
                                <Text style={globalStyles.dropdownItemTxtStyle}>
                                    {item.title}
                                </Text>
                            </XStack>
                        )}
                    />
                </XStack>
                <Text color={COLORS.gray} fontSize={FONT_SIZE.small} marginVertical={10}>
                    {t('settings.options.languageHelpText')}
                </Text>
            </YStack>

            {/* Units */}
            <YStack marginBottom={10}>
                <XStack alignItems="center" justifyContent="space-between">
                    <Label fontSize={FONT_SIZE.normal} fontWeight="bold"
                        color={isDark ? COLORS.textDarkScreen : COLORS.black}>
                        {t('settings.options.units')}:
                    </Label>
                    <SelectDropdown
                        data={UNIT_KEYS}
                        defaultValue={settingsStore.units}
                        onSelect={(selectedItem) => handleChangeUnits(selectedItem)}
                        showsVerticalScrollIndicator={false}
                        dropdownStyle={globalStyles.dropdownMenuStyle}
                        renderButton={(selectedItem) => (
                            <XStack width="auto" justifyContent="center" alignItems="center">
                                <Text fontSize={FONT_SIZE.normal}
                                    color={isDark ? COLORS.textDarkScreen : COLORS.black}>
                                    {(selectedItem && t('units.' + selectedItem)) ||
                                        settingsStore.units}
                                </Text>
                            </XStack>
                        )}
                        renderItem={(item, _, isSelected) => (
                            <XStack
                                style={[
                                    globalStyles.dropdownItemStyle,
                                    { width: 200 },
                                    isSelected && {
                                        backgroundColor: isDark ? COLORS.orange : COLORS.selectedLight,
                                    },
                                ]}
                            >
                                <Text style={globalStyles.dropdownItemTxtStyle}>
                                    {t('units.' + item)}
                                </Text>
                            </XStack>
                        )}
                    />
                </XStack>
                <Text color={COLORS.gray} fontSize={FONT_SIZE.small} marginVertical={10}>
                    {t('settings.options.unitsHelpText')}
                </Text>
            </YStack>

            {/* Theme */}
            <YStack marginBottom={10}>
                <XStack alignItems="center" justifyContent="space-between">
                    <Label fontSize={FONT_SIZE.normal} fontWeight="bold"
                        color={isDark ? COLORS.textDarkScreen : COLORS.black}>
                        {t('settings.options.theme')}:
                    </Label>
                    <SelectDropdown
                        data={THEME_KEYS}
                        defaultValue={settingsStore.theme}
                        onSelect={(selectedItem) => handleChangeTheme(selectedItem)}
                        showsVerticalScrollIndicator={false}
                        dropdownStyle={globalStyles.dropdownMenuStyle}
                        renderButton={(selectedItem) => (
                            <XStack width="auto" justifyContent="center" alignItems="center">
                                <Text fontSize={FONT_SIZE.normal}
                                    color={isDark ? COLORS.textDarkScreen : COLORS.black}>
                                    {(selectedItem && t('themes.' + selectedItem)) ||
                                        settingsStore.theme}
                                </Text>
                            </XStack>
                        )}
                        renderItem={(item, _, isSelected) => (
                            <XStack
                                style={[
                                    globalStyles.dropdownItemStyle,
                                    { width: 200 },
                                    isSelected && {
                                        backgroundColor: isDark ? COLORS.orange : COLORS.selectedLight,
                                    },
                                ]}
                            >
                                <Text style={globalStyles.dropdownItemTxtStyle}>
                                    {t('themes.' + item)}
                                </Text>
                            </XStack>
                        )}
                    />
                </XStack>
                <Text color={COLORS.gray} fontSize={FONT_SIZE.small} marginVertical={10}>
                    {t('settings.options.themeHelpText')}
                </Text>
            </YStack>

            {/* Get in Touch */}
            <YStack>
                <Button
                    text={t('settings.getInTouch')}
                    onPress={handleGetInTouch}
                    pressedBgColor={COLORS.orange}
                    borderColor={COLORS.blackTransparentBorder}
                />
            </YStack>

            {/* Delete Data */}
            <YStack
                marginTop="auto"
                marginBottom={20}
                alignItems="center"
                onPress={handleDeleteData}
                accessibilityRole="button"
                accessibilityLabel={t('settings.deleteData')}
            >
                <Text color={COLORS.red}>{t('settings.deleteData')}</Text>
            </YStack>
        </YStack>
    );
});

export default SettingsScreen;
