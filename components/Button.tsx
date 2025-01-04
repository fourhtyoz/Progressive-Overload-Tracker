import { Pressable, Text } from "react-native"
import { styles } from "@/styles/styles"

export default function Button({ 
    onPress, 
    bgColor, 
    pressedBgColor,
    borderColor, 
    pressedBorderColor, 
    textColor, 
    pressedTextColor, 
    text 
}) {
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

