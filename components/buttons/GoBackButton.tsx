import { COLORS, FONT_SIZE } from "@/styles/colors";
import { Pressable, Text, StyleSheet} from "react-native"
import { settingsStore } from "@/store/store";
import { useTranslation } from "react-i18next";


export default function GoBackButton({ fn }: any) {
    const { t } = useTranslation();

    return (
        <Pressable 
            onPress={fn}
            style={({ pressed }) => [
                styles.button, 
                { 
                    backgroundColor: 
                        settingsStore.isDark 
                        ? pressed ? COLORS.orange : COLORS.black 
                        : pressed ? COLORS.black : COLORS.orange 
                }
            ]}
        >
            {({ pressed }) => (
                <Text 
                    style={[
                        styles.text, 
                        { 
                            color: 
                                settingsStore.isDark 
                                ? pressed ? COLORS.black : COLORS.white 
                                : pressed ? COLORS.white : COLORS.black 
                        }
                    ]}
                >
                    {t('general.goBackButton')}
                </Text>
            )}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        marginRight: 10,
        padding: 10,
        borderRadius: 5,
    },
    text: {
        fontWeight: 'bold',
        fontSize: FONT_SIZE.large
    } 
})