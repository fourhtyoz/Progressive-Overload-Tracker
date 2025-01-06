import { COLORS } from "@/styles/colors";
import { Pressable, Text, StyleSheet} from "react-native"


type Props = {
    title: string,
    onPress: any
  };

export default function GoBackButton({ title, onPress } : Props) {
    return (
        <Pressable 
            onPress={onPress}
            style={({ pressed }) => [
                styles.button, 
                { backgroundColor: pressed ? COLORS.black : COLORS.orange }
            ]}
            >
            {({ pressed }) => (
                <Text 
                    style={[
                        styles.text, 
                        { color: pressed ? COLORS.white : COLORS.black }
                    ]}
                >
                    {title}
                </Text>
            )}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        marginRight: 10,
        padding: 10,
        borderRadius: 5
    },

    text: {
        fontWeight: 'bold'
    } 
})