import { COLORS, FONT_SIZE } from '@/styles/globalStyles';
import React, { useState } from 'react';
import { FlatList, Text, View, StyleSheet, SafeAreaView } from 'react-native';
import { settingsStore } from '@/store/store';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native-gesture-handler';


const AboutScreen = observer(() => {
    const [showHowTo, setShowHowTo] = useState(false);
    const { t } = useTranslation();
    const isDark = settingsStore.isDark

    const content = [
        {
            key: '1',
            title: t('about.definitionTitle'),
            content: t('about.definitionContent'),
        },
        {
            key: '2',
            title:  t('about.conceptTitle'),
            content: t('about.conceptContent'),
        },
        {
            key: '3',
            title:  t('about.methodsTitle'),
            content: t('about.methodsContent'),
        },
        {
            key: '4',
            title:  t('about.importanceTitle'),
            content: t('about.importanceContent'),
        },
        {
            key: '5',
            title:  t('about.exampleTitle'),
            content: t('about.exampleContent'),
        },
        {
            key: '6',
            title:  t('about.tipsTitle'),
            content: t('about.tipsContent'),
        },
    ];

    const renderItem = ({ item }: { item: { title: string; content: any } }) => (
        <View style={s.section}>
            <Text style={[s.subtitle, { color: isDark ? COLORS.textTitleColorDark : COLORS.textTitleColorLight}]}>{item.title}</Text>
            <Text style={[s.text, { color: isDark ? COLORS.textColorDark : COLORS.textColorLight }]}>{item.content}</Text>
        </View>
    );

    return (
        <SafeAreaView>
            <TouchableOpacity onPress={() => setShowHowTo(prev => !prev)} style={[s.howto, { borderColor: isDark ? COLORS.orange : COLORS.black }]} >
                <View style={s.section}>
                    <Text style={[s.subtitle, { color: isDark ? COLORS.textTitleColorDark : COLORS.textTitleColorLight}]}>{t('about.howToTitle')}</Text>
                    {showHowTo &&
                    <Text style={[s.text, { color: isDark ? COLORS.textColorDark : COLORS.textColorLight }]}>
                        {t('about.howToContent')}
                        <Text style={{ color: COLORS.green }}>{t('about.green')}</Text>
                        <Text style={{ color: COLORS.orange }}>{t('about.yellow')}</Text>
                        <Text style={{ color: COLORS.red }}>{t('about.red')}</Text>
                        {t('about.lastSentence')}
                    </Text>
                    }
                </View>
            </TouchableOpacity>
            <FlatList 
                style={s.wrapper} 
                data={content} 
                renderItem={renderItem} 
                keyExtractor={(item) => item.key} 
            />
        </SafeAreaView>
  )
});

export default AboutScreen;

const s = StyleSheet.create({
    howto: {
        paddingHorizontal: 20,
        paddingTop: 15,
        borderWidth: 1,
        margin: 10
    },
    wrapper: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    section: {
        marginBottom: 20,
        borderRadius: 8,
    },
    subtitle: {
        fontSize: FONT_SIZE.large,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    text: {
        // textAlign: 'justify',
        lineHeight: FONT_SIZE.lineHeight,
        fontSize: FONT_SIZE.normal,
    },
    listItem: {
        fontSize: FONT_SIZE.normal,
        lineHeight: FONT_SIZE.lineHeight,
        marginBottom: 5,
    },
});