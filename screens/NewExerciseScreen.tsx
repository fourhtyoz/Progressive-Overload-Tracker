import React from 'react';
import { View, Button } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '@/navigation.tsx/DrawerNavigator';


type Props = DrawerScreenProps<DrawerParamList, 'NewExercise'>;


export default function NewExerciseScreen({ navigation }: Props) {
    return (
        <View>
            <Button onPress={() => navigation.goBack()} title="Go back home" />
        </View>
    )
}