import { DrawerScreenProps } from '@react-navigation/drawer';
import { useTranslation } from 'react-i18next';
import {
    Dimensions,
    ImageBackground,
    Pressable,
} from 'react-native';
import { Text, XStack, YStack } from 'tamagui';

import { DrawerParamList } from '@/app/navigation/drawer.navigator';
import { COLORS, FONT_SIZE } from '@/app/shared/theme/global-styles';

type Props = DrawerScreenProps<DrawerParamList, 'Home'>;

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

export default function HomeScreen({ navigation }: Props) {
    const { t } = useTranslation();

    return (
        <YStack marginVertical={10}>
            <XStack alignItems="center" paddingVertical={15} marginHorizontal={10}>
                <ImageBackground
                    source={require('@/public/images/cards/result.jpg')}
                    resizeMode="cover"
                    style={{ overflow: 'hidden', borderRadius: 15, height: screenHeight / 2.5, width: screenWidth / 2.2 }}
                >
                    <Pressable
                        style={{ flexGrow: 1, borderRadius: 15 }}
                        onPress={() => navigation.navigate('AddResult')}
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
                <YStack flexGrow={1} gap={10} marginLeft={10}>
                    <ImageBackground
                        source={require('@/public/images/cards/about.jpg')}
                        resizeMode="cover"
                        style={{ overflow: 'hidden', borderRadius: 15, height: screenHeight / 2.5 / 1.5 }}
                    >
                        <Pressable
                            style={{ flexGrow: 1, borderRadius: 15 }}
                            onPress={() => navigation.navigate('About')}
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
                        style={{ overflow: 'hidden', borderRadius: 15, height: screenHeight / 2.5 / 3 }}
                    >
                        <Pressable
                            style={{ flexGrow: 1, borderRadius: 15 }}
                            onPress={() => navigation.navigate('Settings')}
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
            <YStack marginHorizontal={10}>
                <ImageBackground
                    source={require('@/public/images/cards/history.jpg')}
                    resizeMode="cover"
                    style={{ overflow: 'hidden', borderRadius: 15, height: screenHeight / 2.5 }}
                >
                    <Pressable
                        style={{ borderRadius: 15, height: screenHeight / 2.5 }}
                        onPress={() => navigation.navigate('History')}
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
