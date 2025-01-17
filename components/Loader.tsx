import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '@/styles/colors';


export default function Loader() {
    return (
        <View style={styles.container} testID="loader-container">
            <ActivityIndicator size="large" color={COLORS.orange} testID="activity-indicator" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.blackTransparentBorder,
    },
});