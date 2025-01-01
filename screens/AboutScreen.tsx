import React from 'react';
import { View, Button } from 'react-native';
import { DrawerParamList } from '@/navigation.tsx/DrawerNavigator';
import { DrawerScreenProps } from '@react-navigation/drawer';


type Props = DrawerScreenProps<DrawerParamList, 'About'>;


export default function AboutScreen({ navigation }: Props) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#323031' }}>
            <Button onPress={() => navigation.goBack()} title="Go back home" />
        </View>
    );
}