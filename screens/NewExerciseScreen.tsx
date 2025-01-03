import React, { useState } from 'react';
import { View, Button, SafeAreaView, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '@/navigation/DrawerNavigator';
import SelectDropdown from 'react-native-select-dropdown';
import { toTitleCase } from '@/utils/utils';
import { EXERCISES } from '@/constants/exercises';


type Props = DrawerScreenProps<DrawerParamList, 'NewExercise'>;


export default function NewExerciseScreen({ navigation }: Props) {

    const styles = StyleSheet.create({
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
            borderRadius: 5,
            backgroundColor: 'black',
            },
        submitButtonText: {
            fontSize: 16,
            fontWeight: 'bold',
            letterSpacing: 0.25,
            color: 'white',
        },
        buttonWrapper: {
            marginVertical: 15
        }
    });


    const [muscleGroup, setMuscleGroup] = useState('');
    const [name, setName] = useState('');
    const muscleGroups = Array.from(new Set(EXERCISES.map(item => item.type)));

    const handleCreateExercise = () => {
        console.log('name', name)
        console.log('group', muscleGroup)
    }

    return (
        <SafeAreaView style={styles.wrapper}>
             <View style={styles.itemWrapper}>
                <Text style={styles.inputLabel}>Type:</Text>
                <SelectDropdown
                    data={muscleGroups}
                    onSelect={(selectedItem, index) => setMuscleGroup(selectedItem)}
                    renderButton={(selectedItem) => {
                        return (
                            <View style={styles.input}>
                                {!muscleGroup && <Text style={styles.exerciseTextPlaceholder}>{'Choose a muscle group'}</Text>} 
                                {muscleGroup && <Text style={styles.exerciseText}>{toTitleCase(selectedItem)}</Text>}
                            </View>
                    );
                    }}
                    renderItem={(item, index, isSelected) => {
                    return (
                        <View style={{...styles.dropdownItemStyle, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                            <Text style={styles.dropdownItemTxtStyle}>{toTitleCase(item)}</Text>
                        </View>
                        )
                    }}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={styles.dropdownMenuStyle}
                />
            </View>
            <View style={styles.itemWrapper}>
                <Text style={styles.inputLabel}>Name:</Text>
                <TextInput onChangeText={setName} placeholder='Name of the exercise' style={styles.input} />
            </View>
            <View style={styles.buttonWrapper}>
                <Pressable style={styles.submitButton} onPress={handleCreateExercise}>
                    <Text style={styles.submitButtonText}>Create a new exercise</Text>
                </Pressable>
            </View>
            <View>
                <Pressable style={styles.submitButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.submitButtonText}>Go back home</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}