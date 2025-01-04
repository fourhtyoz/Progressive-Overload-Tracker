import { SafeAreaView, View, Text, StyleSheet, Dimensions } from "react-native";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { DrawerParamList } from "@/navigation/DrawerNavigator";


type Props = DrawerScreenProps<DrawerParamList, 'Main'>;


export default function MainScreen({ navigation }: Props) {
    return (
        <SafeAreaView style={s.wrapper}>
            <View style={s.firstSecondWrapper}>
                <View style={s.firstColumn}></View>
                    <View style={s.firstBox}>
                        <Text>1</Text>
                    </View>
                <View style={s.secondColumn}>
                    <View style={s.secondBox}>
                        <Text>2</Text>
                    </View>
                    <View style={s.thirdBox}>
                        <Text>3</Text>
                    </View>
                    <View style={s.forthBox}>
                        <Text>4</Text>
                    </View>
                </View>
            </View>
                <View style={s.thirdColumn}>
                    <View style={s.fifthBox}>
                        <Text>5</Text>
                    </View>
                </View>
        </SafeAreaView>
    )
}

const { height: screenHeight } = Dimensions.get('window');
const s = StyleSheet.create({
    wrapper: {
        marginVertical: 10
    },
    firstSecondWrapper: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        marginHorizontal: 10
    },
    firstColumn: {

    },
    secondColumn: {
        display: 'flex',
        flexGrow: 1,
        gap: 10,
        marginLeft: 10
    },
    thirdColumn: {
        marginHorizontal: 10
    },
    firstBox: {
        height: screenHeight / 2.5,
        flexGrow: 1,
        backgroundColor: '#000',
        borderRadius: 15,
    },
    secondBox: {
        flexGrow: 1,
        borderRadius: 15, 
        backgroundColor: '#333'
    },
    thirdBox: {
        flexGrow: 1,
        borderRadius: 15,
        backgroundColor: '#000'
    },
    forthBox: {
        flexGrow: 1,
        borderRadius: 15,
        backgroundColor: '#000'
    },
    fifthBox: {
        backgroundColor: '#000',
        borderRadius: 15,
        height: screenHeight / 2.5,
    }
})