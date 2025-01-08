import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Switch, Alert, Pressable } from "react-native"
import { DrawerScreenProps } from "@react-navigation/drawer";
import { DrawerParamList } from "@/navigation/DrawerNavigator";
import { COLORS } from "@/styles/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/components/buttons/Button";
import SelectDropdown from "react-native-select-dropdown";
import { UNITS, THEMES, LANGUAGES, FONT_SIZES } from "@/constants/settings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import i18n from "@/utils/i18n";


type Props = DrawerScreenProps<DrawerParamList, 'Settings'>;


export default function SettingsScreen({ navigation }: Props) {
    const { t } = useTranslation();

    // NOTE: quite a weird logic of working with the app settings 
    const [settings, setSettings] = useState({
        theme: '',
        fontSize: '',
        language: '',
        units: '',
        notifications: false,
    });

    const [lang, setLang] = useState(settings.language || 'en')
    const [defaultNotifications, setDefaultNotifcations] = useState(settings.notifications || false);

    const handleGetInTouch = () => {
        Alert.alert(
            t('settings.getInTouch'),
            `${t('settings.sendEmailTo')} meow@gmail.com`,
         )
    }

    const handleDeleteAllData = () => {
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

        await AsyncStorage.setItem('language', lang.code)
        setLang(lang.code)
    }

    const handleChangeUnits = async (units: string) => {
        if (!units || typeof units !== 'string') return;
        
        await AsyncStorage.setItem('units', units)
        
        Toast.show({
            type: 'success',
            text1: t('toasts.success'),
            text2: t('toasts.changedUnits'),
        });
    }

    const handleChangeFontSize = async (fontSize: string) => {
        if (!fontSize || typeof fontSize !== 'string') return;
        
        await AsyncStorage.setItem('fontSize', fontSize)
        
        Toast.show({
            type: 'success',
            text1: t('toasts.success'),
            text2: t('toasts.changedFontSize'),
        });
    }

    const handleChangeTheme = async (theme: string) => {
        if (!theme || typeof theme !== 'string') return;
        
        await AsyncStorage.setItem('theme', theme)
        
        Toast.show({
            type: 'success',
            text1: t('toasts.success'),
            text2: t('toasts.changedTheme'),
        });
    }

    // NOTE: looks weird
    const handleChangeNotifications = async (notifications: boolean) => {
        setDefaultNotifcations(!notifications)
        
        await AsyncStorage.setItem('notifications', JSON.stringify(notifications))
        
        Toast.show({
            type: 'success',
            text1: t('toasts.success'),
            text2: !notifications ? t('toasts.receiveNotifications') : t('toasts.notReceiveNotifications') ,
        });
    }

    const loadSettings = async () => {
        try {
            const keys = ['theme', 'fontSize', 'language', 'units', 'notifications'];
            const values = await AsyncStorage.multiGet(keys);

            const settingsObject = {};
            values.forEach(([key, value]) => {
            settingsObject[key] = value;
            });

            setSettings(settingsObject);
        } catch (error) {
            console.error('Failed to load settings from AsyncStorage:', error);
        }
      };

    useEffect(() => {
        loadSettings();
    }, []);

    useEffect(() => {
        if (!lang) return;
        i18n.changeLanguage(lang)
        // Toast.show({
        //     type: 'success',
        //     text1: t('toasts.success'),
        //     text2: t('toasts.changedLanguage'),
        // });
    }, [lang])


    return (
        <SafeAreaView style={s.wrapper}>
            <View>
                <View style={s.row}>
                    <Text style={s.title}>{t('settings.options.fontSize')}:</Text>
                    <SelectDropdown
                        data={FONT_SIZES}
                        onSelect={(selectedItem) => handleChangeFontSize(selectedItem?.title)}
                        renderButton={(selectedItem) => {
                            return (
                                <View style={s.dropdownButton}>
                                    <Text style={s.dropdownText}>{(selectedItem?.title) || settings.fontSize}</Text>
                                </View>
                            );
                        }}
                        renderItem={(item, _, isSelected) => {
                            return (
                                <View style={{...s.dropdownItem, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                                    <Text style={s.dropdownItemText}>{item.title}</Text>
                                </View>
                            );
                        }}
                        showsVerticalScrollIndicator={false}
                        dropdownStyle={s.dropdownMenu}
                    />
                </View>
                <Text style={s.helpText}>{t('settings.options.fontSizeHelpText')}</Text>
            </View>
            <View>
                <View style={s.row}>
                    <Text style={s.title}>{t('settings.options.language')}:</Text>
                    <SelectDropdown
                        data={LANGUAGES}
                        onSelect={(selectedItem) => handleChangeLanguage(selectedItem)}
                        renderButton={(selectedItem) => {
                            return (
                                <View style={s.dropdownButton}>
                                    <Text style={s.dropdownText}>{(selectedItem?.code) || settings.language}</Text>
                                </View>
                            );
                        }}
                        renderItem={(item, _, isSelected) => {
                            return (
                                <View style={{...s.dropdownItem, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                                    <Text style={s.dropdownItemText}>{item.code}</Text>
                                </View>
                            );
                        }}
                        showsVerticalScrollIndicator={false}
                        dropdownStyle={s.dropdownMenu}
                    />
                </View>
                <Text style={s.helpText}>{t('settings.options.languageHelpText')}</Text>
            </View>
            <View>
                <View style={s.row}>
                    <Text style={s.title}>{t('settings.options.units')}:</Text>
                    <SelectDropdown
                        data={UNITS}
                        onSelect={(selectedItem) => handleChangeUnits(selectedItem?.title)}
                        renderButton={(selectedItem) => {
                            return (
                                <View style={s.dropdownButton}>
                                    <Text style={s.dropdownText}>{(selectedItem?.title) || settings.units}</Text>
                                </View>
                            );
                        }}
                        renderItem={(item, _, isSelected) => {
                            return (
                                <View style={{...s.dropdownItem, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                                    <Text style={s.dropdownItemText}>{item.title}</Text>
                                </View>
                            );
                        }}
                        showsVerticalScrollIndicator={false}
                        dropdownStyle={s.dropdownMenu}
                    />
                </View>
                <Text style={s.helpText}>{t('settings.options.unitsHelpText')}</Text>
            </View>
            <View>
                <View style={s.row}>
                    <Text style={s.title}>{t('settings.options.theme')}:</Text>
                    <SelectDropdown
                        data={THEMES}
                        onSelect={(selectedItem) => handleChangeTheme(selectedItem.title)}
                        renderButton={(selectedItem) => {
                            return (
                                <View style={s.dropdownButton}>
                                    <Text style={s.dropdownText}>{(selectedItem?.title) || settings.theme}</Text>
                                </View>
                            );
                        }}
                        renderItem={(item, _, isSelected) => {
                            return (
                                <View style={{...s.dropdownItem, ...(isSelected && {backgroundColor: COLORS.orange})}}>
                                    <Text style={s.dropdownItemText}>{item.title}</Text>
                                </View>
                            );
                        }}
                        showsVerticalScrollIndicator={false}
                        dropdownStyle={s.dropdownMenu}
                    />
                </View>
                <Text style={s.helpText}>{t('settings.options.unitsHelpText')}</Text>
            </View>
            <View>
                <View style={s.row}>
                    <Text style={s.title}>{t('settings.options.notifications')}:</Text>
                    <Switch
                        trackColor={{ false: '#767577', true: COLORS.orange }}
                        thumbColor={defaultNotifications ? COLORS.black : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => handleChangeNotifications(defaultNotifications)}
                        value={defaultNotifications}
                    />
                </View>
                <Text style={s.helpText}>{t('settings.options.notificationsHelpText')}</Text>
            </View>
            <View>
                <Button 
                    text={t('settings.getInTouch')} 
                    onPress={handleGetInTouch} 
                    pressedBgColor={COLORS.orange} 
                    borderColor={'rgba(0, 0, 0, .1)'} 
                />
            </View>
            <Pressable style={s.delete} onPress={handleDeleteData}>
                <Text style={s.deleteText}>{t('settings.deleteData')}</Text>
            </Pressable>
        </SafeAreaView>
    )
}


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
        fontSize: 18,
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
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
    },

    optionText: {
        fontSize: 18,
    },

    options: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: COLORS.gray,
    },

    title: {
        fontSize: 18,
        fontWeight: 'bold'
    },

    helpText: {
        color: COLORS.gray
    }
})

