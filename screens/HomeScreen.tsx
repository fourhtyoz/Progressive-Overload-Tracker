import { SafeAreaView, View, Text, StyleSheet, Dimensions, Pressable, ImageBackground } from "react-native";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { DrawerParamList } from "@/navigation/DrawerNavigator";
import { useTranslation } from "react-i18next";


type Props = DrawerScreenProps<DrawerParamList, 'Home'>;


export default function HomeScreen({ navigation }: Props) {
    const { t } = useTranslation();

    return (
        <SafeAreaView style={s.wrapper}>
            <View style={s.top}>
                <ImageBackground source={require('@/src/images/cards/result.jpg')} style={s.cardImage}>
                    <Pressable style={s.firstBox}  onPress={() => navigation.navigate('Result')}>
                        <Text style={s.cardTitle}>{t('home.result')}</Text>
                    </Pressable>
                </ImageBackground>
                <View style={s.secondColumn}>
                    <ImageBackground source={require('@/src/images/cards/about.jpg')} style={s.cardImage}>
                        <Pressable style={s.secondBox} onPress={() => navigation.navigate('About')}>
                            <Text style={s.cardTitle}>{t('home.about')}</Text>
                        </Pressable>
                    </ImageBackground>
                    <ImageBackground source={require('@/src/images/cards/profile.jpg')} style={s.cardImage}>
                        <Pressable style={s.thirdBox} onPress={() => navigation.navigate('Profile')}>
                            <Text style={s.cardTitle}>{t('home.profile')}</Text>
                        </Pressable>
                    </ImageBackground>
                    <ImageBackground source={require('@/src/images/cards/settings.jpg')} style={s.cardImage}>
                        <Pressable style={s.forthBox} onPress={() => navigation.navigate('Settings')}>
                            <Text style={s.cardTitle}>{t('home.settings')}</Text>
                        </Pressable>
                    </ImageBackground>
                </View>
            </View>
            <View style={s.bottom}>
                <ImageBackground source={require('@/src/images/cards/history.jpg')} style={s.cardImage}>
                    <Pressable style={s.fifthBox} onPress={() => navigation.navigate('History')}>
                        <Text style={s.cardTitle}>{t('home.history')}</Text>
                    </Pressable>
                </ImageBackground>
            </View>
        </SafeAreaView>
    )
}

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
const s = StyleSheet.create({
    wrapper: {
        marginVertical: 10
    },
    top: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        marginHorizontal: 10
    },
    bottom: {
        marginHorizontal: 10
    },
    secondColumn: {
        display: 'flex',
        flexGrow: 1,
        gap: 10,
        marginLeft: 10
    },
    firstBox: {
        height: screenHeight / 2.5,
        flexGrow: 1,
        borderRadius: 15,
        width: screenWidth / 2.2
    },
    secondBox: {
        flexGrow: 1,
        borderRadius: 15, 
        height: screenHeight / 2.5 / 3
    },
    thirdBox: {
        flexGrow: 1,
        borderRadius: 15,
        height: screenHeight / 2.5 / 3
    },
    forthBox: {
        flexGrow: 1,
        borderRadius: 15,
        height: screenHeight / 2.5 / 3
    },
    fifthBox: {
        borderRadius: 15,
        height: screenHeight / 2.5,
    },
    cardTitle: {
        color: '#FFF',
        padding: 10,
        fontSize: 18,
        backgroundColor: 'rgba(0, 0, 0, .4)',
        fontWeight: 'bold'
    },
    cardImage: {
        overflow: 'hidden',
        borderRadius: 15,
        resizeMode: 'cover',
    }
})