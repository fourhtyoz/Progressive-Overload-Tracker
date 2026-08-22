import { observer } from 'mobx-react-lite';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList } from 'react-native';
import { Text, YStack } from 'tamagui';

import { settingsStore } from '@/app/shared/stores/settings.store';
import { COLORS, FONT_SIZE } from '@/app/shared/theme/global-styles';

const AboutScreen = observer(() => {
    const [showHowTo, setShowHowTo] = useState(false);
    const { t } = useTranslation();
    const isDark = settingsStore.isDark;

    const content = useMemo(() => [
        {
            key: '1',
            title: t('about.definitionTitle'),
            content: t('about.definitionContent'),
        },
        {
            key: '2',
            title: t('about.conceptTitle'),
            content: t('about.conceptContent'),
        },
        {
            key: '3',
            title: t('about.methodsTitle'),
            content: t('about.methodsContent'),
        },
        {
            key: '4',
            title: t('about.importanceTitle'),
            content: t('about.importanceContent'),
        },
        {
            key: '5',
            title: t('about.exampleTitle'),
            content: t('about.exampleContent'),
        },
        {
            key: '6',
            title: t('about.tipsTitle'),
            content: t('about.tipsContent'),
        },
    ], [t]);

    const renderItem = ({ item }: { item: { title: string; content: string } }) => (
        <YStack marginBottom={20} borderRadius={8}>
            <Text
                fontSize={FONT_SIZE.large}
                fontWeight="bold"
                marginBottom={10}
                color={isDark ? COLORS.textTitleColorDark : COLORS.textTitleColorLight}
            >
                {item.title}
            </Text>
            <Text
                lineHeight={FONT_SIZE.lineHeight}
                fontSize={FONT_SIZE.normal}
                color={isDark ? COLORS.textColorDark : COLORS.textColorLight}
            >
                {item.content}
            </Text>
        </YStack>
    );

    return (
        <YStack flex={1}>
            <YStack
                onPress={() => setShowHowTo((prev) => !prev)}
                paddingHorizontal={20}
                paddingTop={15}
                borderWidth={1}
                borderColor={isDark ? COLORS.orange : COLORS.black}
                margin={10}
                borderRadius={8}
                accessibilityRole="button"
                accessibilityLabel={t('about.howToTitle')}
            >
                <YStack marginBottom={20} borderRadius={8}>
                    <Text
                        fontSize={FONT_SIZE.large}
                        fontWeight="bold"
                        marginBottom={10}
                        color={isDark ? COLORS.textTitleColorDark : COLORS.textTitleColorLight}
                    >
                        {t('about.howToTitle')}
                    </Text>
                    {showHowTo && (
                        <Text
                            lineHeight={FONT_SIZE.lineHeight}
                            fontSize={FONT_SIZE.normal}
                            color={isDark ? COLORS.textColorDark : COLORS.textColorLight}
                        >
                            {t('about.howToContent')}
                            <Text style={{ color: COLORS.green }}>{t('about.green')}</Text>
                            <Text style={{ color: COLORS.orange }}>{t('about.yellow')}</Text>
                            <Text style={{ color: COLORS.red }}>{t('about.red')}</Text>
                            {t('about.lastSentence')}
                        </Text>
                    )}
                </YStack>
            </YStack>
            <FlatList
                data={content}
                renderItem={renderItem}
                keyExtractor={(item) => item.key}
                contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 15 }}
            />
        </YStack>
    );
});

export default AboutScreen;
