import React from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';

const AboutScreen = () => {
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
    <View style={styles.section}>
      <Text style={styles.subtitle}>{item.title}</Text>
      {Array.isArray(item.content) ? (
        item.content.map((subItem, index) => (
          <Text key={index} style={styles.listItem}>
            • {subItem}
          </Text>
        ))
      ) : (
        <Text style={styles.text}>{item.content}</Text>
      )}
    </View>
  );

  return (
    <FlatList style={styles.wrapper} data={content} renderItem={renderItem} keyExtractor={(item) => item.key} />
  )
};

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    section: {
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    text: {
        textAlign: 'justify',
        lineHeight: 24,
        fontSize: 16,
        color: '#555',
    },
    listItem: {
        fontSize: 16,
        lineHeight: 24,
        color: '#444',
        marginBottom: 5,
    },
});

export default AboutScreen;
