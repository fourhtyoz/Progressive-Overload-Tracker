import { DrawerScreenProps } from '@react-navigation/drawer';
import { useTranslation } from 'react-i18next';
import { ImageBackground, Pressable } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';

import { DrawerParamList } from '@/app/navigation/drawer.navigator';
import { COLORS, FONT_SIZE } from '@/app/shared/theme/global-styles';

type Props = DrawerScreenProps<DrawerParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
    const { t } = useTranslation();

    return (
        <YStack flex={1} marginVertical={10}>
            <XStack flex={2} alignItems="stretch" paddingVertical={15} marginHorizontal={10} gap={10}>
                <ImageBackground
                    source={require('@/public/images/cards/result.jpg')}
                    resizeMode="cover"
                    style={{ overflow: 'hidden', borderRadius: 15, flex: 1 }}
                >
                    <Pressable
                        style={{ flexGrow: 1, borderRadius: 15 }}
                        onPress={() => navigation.navigate('AddResult')}
                        accessibilityRole="button"
                        accessibilityLabel={t('home.result')}
                    >
                        <Text
                            color={COLORS.white}
                            padding={10}
                            fontSize={FONT_SIZE.huge}
                            backgroundColor={COLORS.overlayDark}
                            fontWeight="bold"
                            borderBottomLeftRadius={15}
                            borderTopRightRadius={15}
                        >
                            {t('home.result')}
                        </Text>
                    </Pressable>
                </ImageBackground>
                <YStack flex={1} gap={10}>
                    <ImageBackground
                        source={require('@/public/images/cards/about.jpg')}
                        resizeMode="cover"
                        style={{ overflow: 'hidden', borderRadius: 15, flex: 2 }}
                    >
                        <Pressable
                            style={{ flexGrow: 1, borderRadius: 15 }}
                            onPress={() => navigation.navigate('About')}
                            accessibilityRole="button"
                            accessibilityLabel={t('home.about')}
                        >
                            <Text
                                color={COLORS.white}
                                padding={10}
                                fontSize={FONT_SIZE.huge}
                                backgroundColor={COLORS.overlayDark}
                                fontWeight="bold"
                                borderBottomLeftRadius={15}
                                borderTopRightRadius={15}
                            >
                                {t('home.about')}
                            </Text>
                        </Pressable>
                    </ImageBackground>
                    <ImageBackground
                        source={require('@/public/images/cards/settings.jpg')}
                        resizeMode="cover"
                        style={{ overflow: 'hidden', borderRadius: 15, flex: 1 }}
                    >
                        <Pressable
                            style={{ flexGrow: 1, borderRadius: 15 }}
                            onPress={() => navigation.navigate('Settings')}
                            accessibilityRole="button"
                            accessibilityLabel={t('home.settings')}
                        >
                            <Text
                                color={COLORS.white}
                                padding={10}
                                fontSize={FONT_SIZE.huge}
                                backgroundColor={COLORS.overlayDark}
                                fontWeight="bold"
                                borderBottomLeftRadius={15}
                                borderTopRightRadius={15}
                            >
                                {t('home.settings')}
                            </Text>
                        </Pressable>
                    </ImageBackground>
                </YStack>
            </XStack>
            <YStack flex={1} marginHorizontal={10} marginBottom={10}>
                <ImageBackground
                    source={require('@/public/images/cards/history.jpg')}
                    resizeMode="cover"
                    style={{ overflow: 'hidden', borderRadius: 15, flex: 1 }}
                >
                    <Pressable
                        style={{ flexGrow: 1, borderRadius: 15 }}
                        onPress={() => navigation.navigate('History')}
                        accessibilityRole="button"
                        accessibilityLabel={t('home.history')}
                    >
                        <Text
                            color={COLORS.white}
                            padding={10}
                            fontSize={FONT_SIZE.huge}
                            backgroundColor={COLORS.overlayDark}
                            fontWeight="bold"
                            borderBottomLeftRadius={15}
                            borderTopRightRadius={15}
                        >
                            {t('home.history')}
                        </Text>
                    </Pressable>
                </ImageBackground>
            </YStack>
        </YStack>
    );
}
