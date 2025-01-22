import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '@/styles/colors';
import { settingsStore } from '@/store/store';


export default function Loader() {
    return (
        <View style={[styles.container, { backgroundColor: settingsStore.isDark ? COLORS.black : COLORS.blackTransparentBorder }]} testID="loader-container">
            <ActivityIndicator size="large" color={COLORS.orange} testID="activity-indicator" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.black,
    },
});