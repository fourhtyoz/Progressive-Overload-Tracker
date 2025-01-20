import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONT_SIZE } from '@/styles/colors';


type ErrorMessageProps = {
    message: string;
    setError: (value: string) => void; 
  }

export default function ErrorMessage({ message, setError }: ErrorMessageProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Error: {message}</Text>
            <TouchableOpacity onPress={() => setError('')} style={styles.closeButton}>
                <Ionicons name="close" size={20} color="#721c24" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#f8d7da',
        borderWidth: 1,
        borderColor: '#f5c6cb',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    text: {
        color: '#721c24',
        fontSize: FONT_SIZE.normal,
        fontWeight: '600',
        flex: 1,
    },
    closeButton: {
        marginLeft: 8,
    },
});
