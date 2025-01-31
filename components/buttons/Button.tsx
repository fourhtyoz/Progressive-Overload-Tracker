import { Pressable, Text, StyleSheet } from "react-native"
import { COLORS, FONT_SIZE } from "@/styles/globalStyles"
import { settingsStore } from "@/store/store"


type Props = {
    onPress: any,
    text: string,
    disabled?: boolean,
    bgColor?: string,
    pressedBgColor?: string,
    borderColor?: string,
    pressedBorderColor?: string,
    textColor?: string,
    pressedTextColor?: string,
    testID?: string
}


export default function Button({ 
    onPress, 
    text,
    disabled = false,
    bgColor = COLORS.black,
    pressedBgColor = COLORS.white,
    borderColor = COLORS.white,
    pressedBorderColor = COLORS.blackTransparentBorder,
    textColor = COLORS.white,
    pressedTextColor  = COLORS.black,
    testID = '',
} : Props) {

    return (
        <Pressable 
            testID={testID}
            onPress={onPress}
            disabled={disabled}
            style={({ pressed }) => [
                s.button, 
                { 
                    opacity: disabled ? 0.3 : 1,
                    backgroundColor: 
                        settingsStore.isDark 
                        ? pressed ? bgColor : pressedBgColor 
                        : pressed ? pressedBgColor : bgColor,
                    borderColor: 
                        settingsStore.isDark  
                        ? pressed ? borderColor : pressedBorderColor 
                        : pressed ? pressedBorderColor : borderColor
                }
            ]}
            >
            {({ pressed }) => (
                <Text 
                    style={[
                        s.text, 
                        { 
                            color: 
                            settingsStore.isDark   
                            ? pressed ? textColor : pressedTextColor 
                            : pressed ? pressedTextColor : textColor 
                        }
                    ]}
                >
                    {text}
                </Text>
            )}
        </Pressable>
    )
}

const s = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        backgroundColor: COLORS.black,
        borderRadius: 5,
        borderWidth: 1,
    },
    text: {
        fontSize: FONT_SIZE.large,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: COLORS.white,
    },
})
