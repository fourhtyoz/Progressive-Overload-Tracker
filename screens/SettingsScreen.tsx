import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, Alert, Pressable } from "react-native"
import { DrawerScreenProps } from "@react-navigation/drawer";
import { DrawerParamList } from "@/navigation/DrawerNavigator";
import { COLORS } from "@/styles/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/components/Button";
import SelectDropdown from "react-native-select-dropdown";
import { UNITS, THEMES, LANGUAGES, FONT_SIZES } from "@/constants/settings";


type Props = DrawerScreenProps<DrawerParamList, 'Settings'>;


export default function SettingsScreen({ navigation }: Props) {
    // TODO
    const [isEnabled, setIsEnabled] = useState(false);
    const [defaultUnits, setDefaultUnits] = useState(null);
    const [defaultLanguage, setDefaultLanguage] = useState(null);
    const [defaultFontSize, setDefaultFontSize] = useState(null);
    const [defaultTheme, setDefaultTheme] = useState(null);

    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

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
            [{text: 'Yes, please proceed', onPress: handleDeleteAllData}, {text: 'No, I\'ve changed my mind'}]
        )
    }
    return (
        <SafeAreaView style={s.wrapper}>
            <View>
                <View style={s.row}>
                    <Text style={s.title}>Font size:</Text>
                    <SelectDropdown
                        data={FONT_SIZES}
                        onSelect={(selectedItem) => setDefaultFontSize(selectedItem)}
                        renderButton={(selectedItem) => {
                            return (
                                <View style={s.dropdownButton}>
                                    <Text style={s.dropdownText}>{(selectedItem?.title) || defaultFontSize}</Text>
                                </View>
                            );
                        }}
                        renderItem={(item, isSelected) => {
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
                        onSelect={(selectedItem) => setDefaultLanguage(selectedItem)}
                        renderButton={(selectedItem) => {
                            return (
                                <View style={s.dropdownButton}>
                                    <Text style={s.dropdownText}>{(selectedItem?.title) || defaultLanguage}</Text>
                                </View>
                            );
                        }}
                        renderItem={(item, isSelected) => {
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
                        onSelect={(selectedItem) => setDefaultUnits(selectedItem)}
                        renderButton={(selectedItem) => {
                            return (
                                <View style={s.dropdownButton}>
                                    <Text style={s.dropdownText}>{(selectedItem?.title) || defaultUnits}</Text>
                                </View>
                            );
                        }}
                        renderItem={(item, isSelected) => {
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
                        onSelect={(selectedItem) => setDefaultTheme(selectedItem)}
                        renderButton={(selectedItem) => {
                            return (
                                <View style={s.dropdownButton}>
                                    <Text style={s.dropdownText}>{(selectedItem?.title) || defaultTheme}</Text>
                                </View>
                            );
                        }}
                        renderItem={(item, isSelected) => {
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
                    <Text style={s.title}>Receive notifications:</Text>
                    <Switch
                        trackColor={{ false: '#767577', true: COLORS.orange }}
                        thumbColor={isEnabled ? COLORS.black : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
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
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    dropdownText: {
        fontSize: 18,
        fontWeight: '500',
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

