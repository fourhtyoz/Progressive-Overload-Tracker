import React from 'react';
import { Text, View, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { settingsStore } from '@/app/store/settingsStore';
import { getformattedDate } from '@/app/utils/utils';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { FONT_SIZE, COLORS } from '@/app/styles/globalStyles';
import { HistoryStackParamList } from '@/app/navigation/DrawerNavigator';

type ResultProps = {
    resultId: number;
    date: string;
    weight: number;
    reps: number;
    units: string;
    progress: string;
    deleteResult: (id: number) => void;
};

export default function Result({
    resultId,
    date,
    weight,
    reps,
    units,
    progress,
    deleteResult,
}: ResultProps) {
    const { t } = useTranslation();
    const navigation = useNavigation<NavigationProp<HistoryStackParamList>>();

    const handleDeleteRecord = (resultId: number) => {
        Alert.alert(t('alerts.areYouSure'), t('alerts.sureToDeleteRecord'), [
            { text: t('alerts.yesProceed'), onPress: () => deleteResult(resultId) },
            { text: t('alerts.noIchangedMyMind') },
        ]);
    };

    const handlePressedRecord = (resultId: number) => {
        Alert.alert(
            t('alerts.chooseAction'),
            '', // TODO: fill it out
            [
                { text: t('alerts.delete'), onPress: () => handleDeleteRecord(resultId) },
                {
                    text: t('alerts.edit'),
                    onPress: () =>
                        navigation.navigate('EditResult', { resultId: resultId }),
                },
                { text: t('alerts.close') },
            ]
        );
    };

    return (
        <View
            style={[
                s.row,
                {
                    borderBottomColor: settingsStore.isDark ? COLORS.black : COLORS.borderLight,
                    borderLeftWidth: 5,
                    borderLeftColor:
                        progress === 'worse'
                            ? COLORS.red
                            : progress === 'neutral'
                              ? COLORS.orange
                              : progress === 'better'
                                ? COLORS.green
                                : settingsStore.isDark
                                  ? COLORS.darkGrey
                                  : COLORS.white,
                },
            ]}
        >
            <Text
                style={[
                    s.cell,
                    { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.textSecondary },
                ]}
            >
                {getformattedDate(date)}
            </Text>
            <Text
                style={[
                    s.cell,
                    { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.textSecondary },
                ]}
            >
                {weight
                    ? `${weight} ${t('units.' + units)}`
                    : '-'}
            </Text>
            <Text
                style={[
                    s.cell,
                    { color: settingsStore.isDark ? COLORS.textDarkScreen : COLORS.textSecondary },
                ]}
            >
                {reps}
            </Text>
            <TouchableOpacity style={s.cell} onPress={() => handlePressedRecord(resultId)}>
                <Ionicons style={s.cellAction} name="settings" color={COLORS.gray} size={18} />
            </TouchableOpacity>
        </View>
    );
}

const s = StyleSheet.create({
    row: {
        flexDirection: 'row',
        paddingVertical: 8,
        borderBottomWidth: 1,
    },
    cell: {
        flex: 1,
        textAlign: 'center',
        fontSize: FONT_SIZE.normal,
    },
    cellAction: {
        textAlign: 'center',
    },
});
