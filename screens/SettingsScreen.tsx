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


type Props = DrawerScreenProps<DrawerParamList, 'Settings'>;


export default function SettingsScreen({ navigation }: Props) {
    const [settings, setSettings] = useState({
        theme: '',
        fontSize: '',
        language: '',
        units: '',
        notifications: false,
    });

    const [defaultFontSize, setDefaultFontSize] = useState(settings.fontSize || '');
    const [defaultLanguage, setDefaultLanguage] = useState(settings.language || '');
    const [defaultUnits, setDefaultUnits] = useState(settings.units || '');
    const [defaultTheme, setDefaultTheme] = useState(settings.theme || '');
    const [defaultNotifications, setDefaultNotifcations] = useState(settings.notifications || false);

    const handleGetInTouch = () => {
        Alert.alert(
            'Get in touch with us',
            'To get in touch with us send an email to meow@gmail.com',
         )
    }

    const handleDeleteAllData = () => {
        Alert.alert(
            'Success',
            'Your data has been deleted successfully',
        )
    }

    const handleDeleteData = () => {
        Alert.alert(
            'Are you sure?', 
            'Do you really want to delete all the data in the app? Press "YES" will delete your progress', 
            [
                {text: 'Yes, please proceed', onPress: handleDeleteAllData}, 
                {text: 'No, I\'ve changed my mind'}
            ]
        )
    }

    const handleChangeLanguage = async (lang: string) => {
        if (!lang || typeof lang !== 'string') return;
        setDefaultLanguage(lang)
        await AsyncStorage.setItem('language', lang)
        Toast.show({
            type: 'success',
            text1: 'Success',
            text2: `Your default language has been changed to ${lang}`,
        });
    }

    const handleChangeUnits = async (units: string) => {
        if (!units || typeof units !== 'string') return;
        setDefaultUnits(units)
        await AsyncStorage.setItem('units', units)
        Toast.show({
            type: 'success',
            text1: 'Success',
            text2: `Your default units have been changed to ${units}`,
        });
    }

    const handleChangeFontSize = async (fontSize: string) => {
        if (!fontSize || typeof fontSize !== 'string') return;
        setDefaultFontSize(fontSize)
        await AsyncStorage.setItem('fontSize', fontSize)
        Toast.show({
            type: 'success',
            text1: 'Success',
            text2: `Your default font size has been changed to ${fontSize}`,
        });
    }

    const handleChangeTheme = async (theme: string) => {
        if (!theme || typeof theme !== 'string') return;
        setDefaultTheme(theme)
        await AsyncStorage.setItem('theme', theme)
        Toast.show({
            type: 'success',
            text1: 'Success',
            text2: `Your default theme has been changed to ${theme}`,
        });
    }

    // NOTE: looks weird
    const handleChangeNotifications = async (notifications: boolean) => {
        setDefaultNotifcations(!notifications)
        await AsyncStorage.setItem('notifications', JSON.stringify(notifications))
        Toast.show({
            type: 'success',
            text1: 'Success',
            text2: !notifications ? `Now you'll receive notifications` : `You won't receive notitications anymore` ,
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

    return (
        <SafeAreaView style={s.wrapper}>
            <View>
                <View style={s.row}>
                    <Text style={s.title}>Font size:</Text>
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
                <Text style={s.helpText}>Help Text</Text>
            </View>
            <View>
                <View style={s.row}>
                    <Text style={s.title}>Language:</Text>
                    <SelectDropdown
                        data={LANGUAGES}
                        onSelect={(selectedItem) => handleChangeLanguage(selectedItem?.title)}
                        renderButton={(selectedItem) => {
                            return (
                                <View style={s.dropdownButton}>
                                    <Text style={s.dropdownText}>{(selectedItem?.title) || settings.language}</Text>
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
                <Text style={s.helpText}>Help Text</Text>
            </View>
            <View>
                <View style={s.row}>
                    <Text style={s.title}>Units:</Text>
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
                <Text style={s.helpText}>Help Text</Text>
            </View>
            <View>
                <View style={s.row}>
                    <Text style={s.title}>Theme:</Text>
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
                <Text style={s.helpText}>Help Text</Text>
            </View>
            <View>
                <View style={s.row}>
                    <Text style={s.title}>Receive notifications:</Text>
                    <Switch
                        trackColor={{ false: '#767577', true: COLORS.orange }}
                        thumbColor={defaultNotifications ? COLORS.black : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => handleChangeNotifications(defaultNotifications)}
                        value={defaultNotifications}
                    />
                </View>
                <Text style={s.helpText}>Help Text</Text>
            </View>
            <View>
                <Button text="Get in touch with us" onPress={handleGetInTouch} bgColor={COLORS.black} pressedBgColor={COLORS.orange} borderColor={'rgba(0, 0, 0, .1)'} pressedBorderColor={'rgba(0, 0, 0, .1)'} textColor={COLORS.white} pressedTextColor={COLORS.black} />
            </View>
            <Pressable style={s.delete} onPress={handleDeleteData}>
                <Text style={s.deleteText}>Delete data</Text>
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
        width: 50,
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

