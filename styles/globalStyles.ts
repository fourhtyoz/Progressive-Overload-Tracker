import { StyleSheet } from "react-native";
import { COLORS, FONT_SIZE } from "./colors";

export const globalStyles = StyleSheet.create({
    date: {
        marginEnd: 10
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        padding: 10,
        borderColor: 'lightgray',
        borderRadius: 5,
        color: COLORS.black,
        fontSize: FONT_SIZE.normal
    },
    inputWithOption: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        padding: 10,
        borderColor: 'lightgray',
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        color: COLORS.black,
    },
    dropdownButtonStyle: {
        width: 45,
        height: 40,
        backgroundColor: COLORS.black,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1
    },
    dropdownButtonTxtStyle: {
        color: COLORS.white,
    },
    dropdownButtonArrowStyle: {
        fontSize: FONT_SIZE.normal,
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
        fontSize: FONT_SIZE.normal,
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
        width: 100,
        fontSize: FONT_SIZE.normal,
    },
    wrapper: {
        paddingHorizontal: 20,
    },
    exerciseText: {
        color: COLORS.black
    },
    exerciseTextPlaceholder: {
        color: '#a9a9a9'
    },

    buttonWrapper: {
        marginVertical: 15,
        gap: 15
    }
});