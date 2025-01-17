import React, { useState } from 'react';
import { View, SafeAreaView, Text, TextInput, Alert } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '@/navigation/DrawerNavigator';
import SelectDropdown from 'react-native-select-dropdown';
import { toTitleCase } from '@/utils/helpFunctions';
import { styles } from '@/styles/styles';
import Button from '@/components/buttons/Button';
import { muscleGroups } from '@/utils/constants';
import { addExercise } from '@/services/db';
import ErrorMessage from '@/components/ErrorMessage';


type Props = DrawerScreenProps<DrawerParamList, 'AddExercise'>;


export default function AddExerciseScreen({ navigation }: Props) {
    const [muscleGroup, setMuscleGroup] = useState('');
    const [title, setTitle] = useState('');
    const [error, setError] = useState('');

    const handleSucess = () => {
        navigation.navigate('AddResult')
    }

    const handleCreateExercise = async () => {
        try {
            await addExercise(title, muscleGroup)
            Alert.alert(
                'Успех',
                'Упражнение было успешно добавлено',
                [
                    {text: 'Отлично', onPress: handleSucess},
                ]
            )
        } catch (e) {
            setError(String(e))
            console.error(e)
        }
    }

    const handleGoBack = () => {
        navigation.goBack()
    }

    return (
        <SafeAreaView style={styles.wrapper}>
            {error && <View style={{ marginTop: 25 }}><ErrorMessage message={error} /></View>}
             <View style={styles.itemWrapper}>
                <Text style={styles.inputLabel}>Type:</Text>
                <SelectDropdown
                    data={muscleGroups}
                    onSelect={(selectedItem, index) => setMuscleGroup(selectedItem)}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={styles.dropdownMenuStyle}
                    renderButton={(selectedItem) => (
                        <View style={styles.input}>
                            {muscleGroup 
                            ? <Text style={styles.exerciseText}>{toTitleCase(selectedItem)}</Text> 
                            : <Text style={styles.exerciseTextPlaceholder}>{'Choose a muscle group'}</Text>
                            }
                        </View>
                    )}
                    renderItem={(item, _, isSelected) => (
                        <View style={{...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' })}}>
                            <Text style={styles.dropdownItemTxtStyle}>{toTitleCase(item)}</Text>
                        </View>
                    )}
                />
            </View>
            <View style={styles.itemWrapper}>
                <Text style={styles.inputLabel}>Name:</Text>
                <TextInput onChangeText={setTitle} placeholder='Name of the exercise' style={styles.input} />
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
            </View>
        </SafeAreaView>
    )
}