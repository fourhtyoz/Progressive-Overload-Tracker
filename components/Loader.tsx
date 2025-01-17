import { View, ActivityIndicator, StyleSheet } from 'react-native';


export default function Loader() {
    return (
        <View style={styles.container} testID="loader-container">
            <ActivityIndicator size="large" color="#0000ff" testID="activity-indicator" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
});