import { Pressable, Text } from "react-native"
import { styles } from "@/styles/styles"
import { COLORS } from "@/styles/colors"


type Props = {
    onPress: any,
    text: string,
    bgColor?: string,
    pressedBgColor?: string,
    borderColor?: string,
    pressedBorderColor?: string,
    textColor?: string,
    pressedTextColor?: string,
}


export default function Button({ 
    onPress, 
    text,
    bgColor = COLORS.black,
    pressedBgColor = COLORS.white,
    borderColor = COLORS.white,
    pressedBorderColor = COLORS.blackTransparentBorder,
    textColor = COLORS.white,
    pressedTextColor  = COLORS.black
} : Props) {
    return (
        <Pressable 
            onPress={onPress}
            style={({ pressed }) => [
                styles.submitButton, 
                { 
                    backgroundColor: pressed ? pressedBgColor : bgColor,
                    borderColor: pressed ? pressedBorderColor : borderColor
                }
            ]}
            >
            {({ pressed }) => (
                <Text 
                    style={[
                        styles.submitButtonText, 
                        { color: pressed ? pressedTextColor : textColor }
                    ]}
                >
                    {text}
                </Text>
            )}
        </Pressable>
    )
}

