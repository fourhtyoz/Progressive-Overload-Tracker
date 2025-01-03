import React, { useState } from 'react';
import { View, Button, SafeAreaView, Text, TextInput, Pressable } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '@/navigation/DrawerNavigator';
import SelectDropdown from 'react-native-select-dropdown';
import { toTitleCase } from '@/utils/utils';
import { EXERCISES } from '@/constants/exercises';
import { styles } from '@/styles/styles';


type Props = DrawerScreenProps<DrawerParamList, 'New Exercise'>;


export default function NewExerciseScreen({ navigation }: Props) {
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
                <View>
                    <Pressable style={styles.submitButton} onPress={handleCreateExercise}>
                        <Text style={styles.submitButtonText}>Create a new exercise</Text>
                    </Pressable>
                </View>
                <View>
                    <Pressable style={styles.submitButton} onPress={() => navigation.goBack()}>
                        <Text style={styles.submitButtonText}>Go back home</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    )
}