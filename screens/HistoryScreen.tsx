import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerParamList } from '@/navigation.tsx/DrawerNavigator';


type Props = DrawerScreenProps<DrawerParamList, 'History'>;


export default function HistoryScreen({ navigation }: Props) {
    const [data, setData] = useState([])
    useEffect(() => {

        const getAllKeys = async () => {
            const allKeys = await AsyncStorage.getAllKeys()
            console.log('allKeys', allKeys)
            // const newArray = []
            for (let key of allKeys) {
                const keyData = await AsyncStorage.getItem(key)
                
                if (!keyData) continue

                // console.log('keyData', keyData)
                setData(prev => ({...prev, [key]: JSON.parse(keyData)}))
                // newArray.push({[key]: JSON.parse(keyData)})
            }
            // setData(newArray)
            // setData(data)
            return data
        }
        getAllKeys()
    }, [])

    console.log('data', data)

    for (let [key, value] of Object.entries(data)) {
        value.map(item => (<Text>{item.date}, {item.exercise}, {item.muscleGroup}, {item.repsValue}, {item.units}, {item.weightValue}</Text>))
    }

    return (
        <View>
            {Object.entries(data).map(([key, value]) => {
                return value.map((item, index) => (
                    <Text key={index}>
                        {item.date}, {item.exercise}, {item.muscleGroup}, {item.repsValue}, {item.units}, {item.weightValue}
                    </Text>
          ));
        })}
        </View>
    )
} 