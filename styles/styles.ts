import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        padding: 10,
        borderColor: 'lightgray',
        borderRadius: 5,
        color: '#000',
    },
    inputWithOption: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        padding: 10,
        borderColor: 'lightgray',
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        color: '#000',
    },
    dropdownButtonStyle: {
        width: 45,
        height: 40,
        backgroundColor: '#000',
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdownButtonTxtStyle: {
        color: '#FFF',
    },
    dropdownButtonArrowStyle: {
        fontSize: 28,
    },
    dropdownMenuStyle: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
    },
    dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
    },
    dropdownItemIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
    itemWrapper: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15
    },
    inputLabel: {
        fontWeight: 'bold',
        width: 70
    },
    wrapper: {
        paddingHorizontal: 20,
    },
    exerciseText: {
        color: '#000'
    },
    exerciseTextPlaceholder: {
        color: '#a9a9a9'
    },
    submitButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        backgroundColor: '#000',
        borderRadius: 5,
        borderWidth: 1,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: '#FFF',
    },
    buttonWrapper: {
        marginVertical: 15,
        gap: 15
    }
});