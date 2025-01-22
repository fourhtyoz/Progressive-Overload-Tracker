import { Pressable, Text } from "react-native"
import { styles } from "@/styles/styles"
import { COLORS } from "@/styles/colors"
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
} : Props) {

    return (
        <Pressable 
            onPress={onPress}
            disabled={disabled}
            style={({ pressed }) => [
                styles.submitButton, 
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
                        styles.submitButtonText, 
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

