import { FONT_SIZE } from '@/styles/colors';
import React from 'react';
import { FlatList, Text, View, StyleSheet, SafeAreaView } from 'react-native';
import { settingsStore } from '@/store/store';
import { observer } from 'mobx-react-lite';


const AboutScreen = observer(() => {
    const content = [
        {
            key: '1',
            title: 'What is Progressive Overload?',
            content:
                'Progressive overload is a principle that involves gradually increasing the demands placed on the muscles or body to continue making progress in strength, endurance, or performance.',
        },
        {
            key: '2',
            title: 'Key Concepts',
            content: [
                '1. Gradual Increase in Stress: Continuously challenge the body beyond its current ability.',
                '2. Adaptation: The body becomes stronger and more efficient in response to stress.',
                '3. Plateaus: Without progressive overload, the body stops adapting, leading to stagnation.',
            ],
        },
        {
            key: '3',
            title: 'Methods of Applying Progressive Overload',
            content: [
                'Increase Weight',
                'Increase Repetitions or Sets',
                'Increase Training Frequency',
                'Improve Technique',
                'Decrease Rest Time',
                'Increase Training Volume',
                'Increase Exercise Complexity',
            ],
        },
        {
            key: '4',
            title: 'Why Is Progressive Overload Important?',
            content: [
                'Prevents Plateaus: Avoids stagnation by continuously challenging the body.',
                'Builds Strength and Muscle: Stimulates growth and increased strength.',
                'Enhances Endurance: Improves cardiovascular and muscular endurance.',
                'Boosts Motivation: Tracks progress toward fitness goals.',
            ],
        },
        {
            key: '5',
            title: 'Practical Example',
            content:
                'Scenario: You want to increase your squat strength.\n- Week 1: Squat 50 kg for 3 sets of 10 reps.\n- Week 2: Squat 52.5 kg for 3 sets of 10 reps.\n- Week 3: Squat 55 kg for 3 sets of 8 reps.\n- Week 4: Add an additional set or reduce rest time between sets.',
        },
        {
            key: '6',
            title: 'Tips for Effective Progressive Overload',
            content: [
                'Start Slow: Avoid drastic increases to prevent injury or overtraining.',
                'Track Progress: Use a workout journal or app to monitor weights, reps, and sets.',
                'Focus on Recovery: Proper rest, nutrition, and sleep are essential for adaptation.',
                'Be Consistent: Gradual, consistent effort is more sustainable than quick, drastic changes.',
                'Listen to Your Body: Avoid overloading too quickly, which can lead to fatigue or injury.',
            ],
        },
    ];

    const renderItem = ({ item }: { item: { title: string; content: any } }) => (
        <View style={s.section}>
            <Text style={[s.subtitle, { color: settingsStore.isDark ? '#EDEDED' : '#333'}]}>{item.title}</Text>
            {Array.isArray(item.content) 
            ? item.content.map((subItem, index) => (<Text key={index} style={[s.listItem, { color: settingsStore.isDark ?'#F5F5F5' : '#555' }]}>• {subItem}</Text>)) 
            : <Text style={[
                s.text, 
                { 
                    color: settingsStore.isDark ?'#F5F5F5' : '#555' 
                }
            ]}>
                {item.content}
            </Text>
            }
        </View>
    );

    return (
        <SafeAreaView>
            <FlatList 
                style={s.wrapper} 
                data={content} 
                renderItem={renderItem} 
                keyExtractor={(item) => item.key} 
            />
        </SafeAreaView>
  )
});

export default AboutScreen;

const s = StyleSheet.create({
    wrapper: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    section: {
        marginBottom: 20,
        borderRadius: 8,
    },
    subtitle: {
        fontSize: FONT_SIZE.large,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    text: {
        textAlign: 'justify',
        lineHeight: FONT_SIZE.lineHeight,
        fontSize: FONT_SIZE.normal,
    },
    listItem: {
        fontSize: FONT_SIZE.normal,
        lineHeight: FONT_SIZE.lineHeight,
        marginBottom: 5,
    },
});