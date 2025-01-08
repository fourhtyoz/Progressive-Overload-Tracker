import React, { useState } from 'react';
import { View, SafeAreaView, Text, TextInput } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '@/navigation/DrawerNavigator';
import SelectDropdown from 'react-native-select-dropdown';
import { toTitleCase } from '@/utils/utils';
import { EXERCISES } from '@/constants/exercises';
import { styles } from '@/styles/styles';
import Button from '@/components/buttons/Button';


type Props = DrawerScreenProps<DrawerParamList, 'NewExercise'>;


export default function NewExerciseScreen({ navigation }: Props) {
    const [muscleGroup, setMuscleGroup] = useState('');
    const [name, setName] = useState('');
    const muscleGroups = Array.from(new Set(EXERCISES.map(item => item.type)));

    const handleCreateExercise = () => {
        console.log('name', name)
        console.log('group', muscleGroup)
    }

    const handleGoBack = () => {
        navigation.goBack()
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
                    renderItem={(item, _, isSelected) => {
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
                <Button 
                    onPress={handleCreateExercise} 
                    bgColor={'#000'} 
                    pressedBgColor={'#FFF'} 
                    borderColor={'#FFF'} 
                    pressedBorderColor={'rgba(0, 0, 0, .1)'} 
                    textColor={'#FFF'} 
                    pressedTextColor={'#000'} 
                    text={'Create a new exercise'}
                />
                <Button 
                    onPress={handleGoBack} 
                    bgColor={'#000'} 
                    pressedBgColor={'#FFF'} 
                    borderColor={'#FFF'} 
                    pressedBorderColor={'rgba(0, 0, 0, .1)'} 
                    textColor={'#FFF'} 
                    pressedTextColor={'#000'} 
                    text={'Go back'}
                />
            </View>
        </SafeAreaView>
    )
}