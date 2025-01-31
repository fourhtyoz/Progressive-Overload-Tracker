import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, Pressable } from "react-native"
import { COLORS, FONT_SIZE } from "@/styles/globalStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/components/buttons/Button";
import SelectDropdown from "react-native-select-dropdown";
import { UNITS, THEMES, LANGUAGES } from "@/constants/settings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import { settingsStore } from "@/store/store";
import { observer } from "mobx-react-lite";
import ErrorMessage from "@/components/ErrorMessage";
import { deleteTables, createTables } from "@/services/db";


const SettingsScreen = observer(() => {
    const [error, setError] = useState('')
    
    const { t } = useTranslation();

    const handleGetInTouch = () => {
        Alert.alert(
            t('settings.getInTouch'),
            `${t('settings.sendEmailTo')} hualua@gmail.com`,
        )
    }

    const handleDeleteAllData = () => {
        deleteTables()
        createTables()
        Alert.alert(
            t('alerts.success'),
            t('settings.dataDeleted'),
        )
    }

    const handleDeleteData = () => {
        Alert.alert(
            t('alerts.areYouSure'),
            t('alerts.wantToDelete'),
            [
                {text: t('alerts.yesProceed'), onPress: handleDeleteAllData}, 
                {text: t('alerts.noIchangedMyMind')}
            ]
        )
    }

    const handleChangeLanguage = async (lang: any) => {
        if (!lang) return;
        
        setError('')

        try {
            await AsyncStorage.setItem('language', lang.code)
            settingsStore.setLanguage(lang.code)

            Toast.show({
                type: 'success',
                text1: t('toasts.success'),
                text2: t('toasts.changedLanguage'),
            });
        } catch (e) {
            setError(String(e))
        }
    }

    const handleChangeUnits = async (units: string) => {
        if (!units || typeof units !== 'string') return;
        
        setError('')

        try {
            await AsyncStorage.setItem('units', units)
            settingsStore.setUnits(units)
            
            Toast.show({
                type: 'success',
                text1: t('toasts.success'),
                text2: t('toasts.changedUnits'),
            });
        } catch (e) {
            setError(String(e))
        }
    }

    const handleChangeTheme = async (theme: string) => {
        if (!theme || typeof theme !== 'string') return;
        
        setError('')

        try {
            await AsyncStorage.setItem('theme', theme)
            settingsStore.setTheme(theme)
            
            Toast.show({
                type: 'success',
                text1: t('toasts.success'),
                text2: t('toasts.changedTheme'),
            });
        } catch (e) {
            setError(String(e))
        }
    }

    return (
        <SafeAreaView style={s.wrapper}>
            {error && <ErrorMessage message={error} setError={setError} />}
            <View style={{ marginBottom: 10 }}>
                <View style={s.row}>
                    <Text style={[s.title, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black }]}>{t('settings.options.language')}:</Text>
                    <SelectDropdown
                        data={LANGUAGES}
                        defaultValue={LANGUAGES.filter(item => item.code === settingsStore.language)[0]}
                        onSelect={(selectedItem) => handleChangeLanguage(selectedItem)}
                        showsVerticalScrollIndicator={false}
                        dropdownStyle={s.dropdownMenu}
                        renderButton={(selectedItem) => (
                            <View style={s.dropdownButton}>
                                <Text style={[s.dropdownText, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black }]}>{(selectedItem?.title) || settingsStore.language}</Text>
                            </View>
                        )}
                        renderItem={(item, _, isSelected) => (
                            <View style={[s.dropdownItem, isSelected && { backgroundColor: settingsStore.isDark ? COLORS.orange : COLORS.selectedLight }]}>
                                <Text style={s.dropdownItemText}>{item.title}</Text>
                            </View>
                        )}
                    />
                </View>
                <Text style={[s.helpText, { marginVertical: 10 }]}>{t('settings.options.languageHelpText')}</Text>
            </View>
            <View style={{ marginBottom: 10 }}>
                <View style={s.row}>
                    <Text style={[s.title, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black }]}>{t('settings.options.units')}:</Text>
                    <SelectDropdown
                        data={UNITS}
                        defaultValue={UNITS.filter(item => item.title === settingsStore.units)[0]}
                        onSelect={(selectedItem) => handleChangeUnits(selectedItem[settingsStore.language])}
                        showsVerticalScrollIndicator={false}
                        dropdownStyle={s.dropdownMenu}
                        renderButton={(selectedItem) => (
                            <View style={s.dropdownButton}>
                                <Text style={[s.dropdownText, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black }]}>{(selectedItem && selectedItem[settingsStore.language]) || settingsStore.units}</Text>
                            </View>
                        )}
                        renderItem={(item, _, isSelected) => (
                            <View style={[s.dropdownItem, isSelected && { backgroundColor: settingsStore.isDark ? COLORS.orange : COLORS.selectedLight }]}>
                                <Text style={s.dropdownItemText}>{item[settingsStore.language]}</Text>
                            </View>
                        )}
                    />
                </View>
                <Text style={[s.helpText, { marginVertical: 10 }]}>{t('settings.options.unitsHelpText')}</Text>
            </View>
            <View style={{ marginBottom: 10 }}>
                <View style={s.row}>
                    <Text style={[s.title, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black }]}>{t('settings.options.theme')}:</Text>
                    <SelectDropdown
                        data={THEMES}
                        defaultValue={THEMES.filter(item => item.title === settingsStore.theme)[0]}
                        onSelect={(selectedItem) => handleChangeTheme(selectedItem.title)}
                        showsVerticalScrollIndicator={false}
                        dropdownStyle={s.dropdownMenu}
                        renderButton={(selectedItem) => (
                            <View style={s.dropdownButton}>
                                <Text style={[s.dropdownText, { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.black }]}>{(selectedItem && selectedItem[settingsStore.language]) || settingsStore.theme}</Text>
                            </View>
                        )}
                        renderItem={(item, _, isSelected) => (
                            <View style={[s.dropdownItem, isSelected && { backgroundColor: settingsStore.isDark ? COLORS.orange : COLORS.selectedLight }]}>
                                <Text style={s.dropdownItemText}>{item[settingsStore.language]}</Text>
                            </View>
                        )}
                    />
                </View>
                <Text style={[s.helpText, { marginVertical: 10 }]}>{t('settings.options.themeHelpText')}</Text>
            </View>
            <View>
                <Button 
                    text={t('settings.getInTouch')} 
                    onPress={handleGetInTouch} 
                    pressedBgColor={COLORS.orange} 
                    borderColor={COLORS.blackTransparentBorder} 
                />
            </View>
            <Pressable style={s.delete} onPress={handleDeleteData}>
                <Text style={s.deleteText}>{t('settings.deleteData')}</Text>
            </Pressable>
        </SafeAreaView>
    )
});

const s = StyleSheet.create({
    wrapper: {
        flex: 1,
        paddingHorizontal: 20,
        gap: 15,
    },
    delete: {
        marginTop: 'auto',
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteText: {
        color: COLORS.red
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    dropdownMenu: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
        width: 'auto',
    },
    dropdownButton: {
        width: 'auto',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdownText: {
        fontSize: FONT_SIZE.normal,
        color: '#151E26',
    },
    dropdownItem: {
        width: 200,
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    dropdownItemText: {
        flex: 1,
        fontSize: FONT_SIZE.normal,
        fontWeight: '500',
        color: '#151E26',
    },
    optionText: {
        fontSize: FONT_SIZE.normal,
    },
    options: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: COLORS.gray,
    },
    title: {
        fontSize: FONT_SIZE.normal,
        fontWeight: 'bold'
    },
    helpText: {
        color: COLORS.gray,
        fontSize: FONT_SIZE.small
    }
})

export default SettingsScreen;