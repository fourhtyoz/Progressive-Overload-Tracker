import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { Label, Text, XStack, YStack } from 'tamagui';

import { deleteTables, initializeDatabase } from '@/app/shared/api/db';
import { LANGUAGES, THEME_KEYS, UNIT_KEYS } from '@/app/shared/constants/settings';
import { exerciseStore } from '@/app/shared/stores/exercise.store';
import { settingsStore } from '@/app/shared/stores/settings.store';
import { COLORS, FONT_SIZE } from '@/app/shared/theme/global-styles';
import Button from '@/app/shared/ui/button.ui';
import ErrorMessage from '@/app/shared/ui/error-message.ui';
import Loader from '@/app/shared/ui/loader.ui';
import {
    DropdownInput,
    DropdownItem,
    DropdownItemText,
    DropdownText,
    ThemedDropdown,
} from '@/app/shared/ui/themed-dropdown.ui';

const SettingsScreen = observer(() => {
    const [error, setError] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const { t } = useTranslation();
    const isDark = settingsStore.isDark;

    const handleGetInTouch = () => {
        Alert.alert(t('settings.getInTouch'), `${t('settings.sendEmailTo')} hualua@gmail.com`);
    };

    const handleDeleteAllData = async () => {
        setIsDeleting(true);
        try {
            const res = await deleteTables();
            if (!res.success) {
                setError(res.error || 'Failed to delete data');
                return;
            }
            await initializeDatabase();
            await exerciseStore.initialize();
            Alert.alert(t('alerts.success'), t('settings.dataDeleted'));
        } catch (e) {
            setError(String(e));
        } finally {
            setIsDeleting(false);
        }
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
            await settingsStore.setLanguage(lang.code as 'en' | 'de' | 'es' | 'ru' | 'tr');
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
            await settingsStore.setUnits(units as 'kg' | 'lb');
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
            await settingsStore.setTheme(theme as 'light' | 'dark');
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
                    <ThemedDropdown
                        data={LANGUAGES}
                        defaultValue={
                            LANGUAGES.filter((item) => item.code === settingsStore.language)[0]
                        }
                        onSelect={(selectedItem) => handleChangeLanguage(selectedItem)}
                        renderButton={() => (
                            <DropdownInput>
                                <DropdownText>
                                    {settingsStore.language}
                                </DropdownText>
                            </DropdownInput>
                        )}
                        renderItem={(item, _, isSelected) => (
                            <DropdownItem isSelected={isSelected} width={200}>
                                <DropdownItemText>{item.title}</DropdownItemText>
                            </DropdownItem>
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
                    <ThemedDropdown
                        data={UNIT_KEYS}
                        defaultValue={settingsStore.units}
                        onSelect={(selectedItem) => handleChangeUnits(selectedItem)}
                        renderButton={() => (
                            <DropdownInput>
                                <DropdownText>
                                    {t('units.' + settingsStore.units)}
                                </DropdownText>
                            </DropdownInput>
                        )}
                        renderItem={(item, _, isSelected) => (
                            <DropdownItem isSelected={isSelected} width={200}>
                                <DropdownItemText>
                                    {t('units.' + item)}
                                </DropdownItemText>
                            </DropdownItem>
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
                    <ThemedDropdown
                        data={THEME_KEYS}
                        defaultValue={settingsStore.theme}
                        onSelect={(selectedItem) => handleChangeTheme(selectedItem)}
                        renderButton={() => (
                            <DropdownInput>
                                <DropdownText>
                                    {t('themes.' + settingsStore.theme)}
                                </DropdownText>
                            </DropdownInput>
                        )}
                        renderItem={(item, _, isSelected) => (
                            <DropdownItem isSelected={isSelected} width={200}>
                                <DropdownItemText>
                                    {t('themes.' + item)}
                                </DropdownItemText>
                            </DropdownItem>
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
            {isDeleting ? (
                <YStack marginTop="auto" marginBottom={20} alignItems="center">
                    <Loader />
                </YStack>
            ) : (
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
            )}
        </YStack>
    );
});

export default SettingsScreen;
