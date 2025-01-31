import AsyncStorage from "@react-native-async-storage/async-storage";
import { TResult, TGroupedResult } from "./types";
import { settingsStore } from "@/store/store";
import { MUSCLES } from "@/constants/settings";
import { UNITS } from "@/constants/settings";
import { addExercise, addResult } from "@/services/db";
import { db } from "@/services/db";


export function getProgress(currentSet: TResult, previousSet: TResult) {
    const defaultUnits = settingsStore.units

    let progress = ''

    let previousScore = previousSet.weight * previousSet.reps
    if (previousSet.units !== defaultUnits) {
        if (defaultUnits === 'kg') {
            previousScore = previousScore * 0.453  // * 0.453 to kg
        }
        if (defaultUnits === 'lb') {
            previousScore = previousScore * 2.205  // * 2.205 to lb
        }
    }

    let currentScore = currentSet.weight * currentSet.reps
    if (currentSet.units !== defaultUnits) {
        if (defaultUnits === 'kg') {
            currentScore = currentScore * 0.453
        } 
        if (defaultUnits === 'lb') {
            currentScore = currentScore * 2.205
        }
    }

    if (currentSet.weight === 0) {
        currentScore = currentSet.reps
    }

    if (previousSet.weight === 0) {
        previousScore = previousSet.reps
    }

    if (previousScore > currentScore) {
        progress = 'worse'
    } else if (previousScore < currentScore) {
        progress = 'better'
    } else {
        progress = 'neutral'
    }
    return progress
}


export function getformattedDate(date: string | Date) {
    if (date instanceof Date) {
        date = date.toISOString()
    }

    const [year, month, day] = date.split('T')[0].split('-');
    const formattedDate = `${day}.${month}.${year.slice(-2)}`;

    return formattedDate
}


export function toTitleCase(word: string) {
    if (!word || word.length < 1) return word;
    
    return (word.charAt(0).toUpperCase() + word.slice(1))
}


export function groupByExercise(dataArray: TResult[]) {
    const grouped: TGroupedResult = {};

    dataArray.forEach((item: TResult) => {
        if (!grouped[item.exercise]) {
            grouped[item.exercise] = [];
        }
        grouped[item.exercise].push(item);
    });

    return grouped;
}


export function filterByMuscleGroup(data: any, targetGroup: any) {
    const filteredData: any = {};

    for (const [exercise, records] of Object.entries(data)) {
        const filteredRecords = (records as TResult[]).filter((record: TResult) => record.muscleGroup === targetGroup);
        if (filteredRecords.length > 0) {
            filteredData[exercise] = filteredRecords;
        }
    }
    return filteredData;
}

// for development
export async function clearAsyncStorage() {
    try {
        await AsyncStorage.clear()
        console.log('All keys cleared successfully.');
    } catch (e) {
        console.error('Failed to clear AsyncStorage:', e);
    }
}


export function generateExercises(quantity: number = 100) {
    console.log('generateExercises start')
    for (let i = 0; i < quantity; i++) {
        const title = generateRandomString()
        
        const typeIndex = Math.floor(Math.random() * MUSCLES.length);
        const type = MUSCLES[typeIndex].title
        
        console.log(`${i}, title: ${title} type: ${type}`)
        addExercise(title, type)
    }
    console.log('generateExercises finish')
}


export async function generateResults(quantity: number = 1000) {
    console.log('generateResults start')
    for (let i = 0; i < quantity; i++) {
        const exerciseObject: any = await getRandomExercise()
        const date = generateRandomDate()
        const reps = Math.floor(Math.random() * 20)
        const weight =  Math.floor(Math.random() * 150)
        const unitsIndex = Math.floor(Math.random() * UNITS.length)
        const units = UNITS[unitsIndex].title

        console.log(`${i}, title: ${exerciseObject.title} type: ${exerciseObject.type}`)
        await addResult(exerciseObject.title, date, exerciseObject.type, reps, weight, units)
    }
    console.log('generateResults finish')
}


export async function getRandomExercise() {
    try {
        const result = await new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT title, type FROM exercises ORDER BY RANDOM() LIMIT 1;',
                    [],
                    (_, { rows }) => resolve(rows._array[0]),
                    (_, error) => reject(error)
                );
            });
        });
        console.log('result')
        return result;
    } catch (e) {
        console.error('Error fetching random exercise:', e);
        throw e;
    }
};

export function generateRandomDate(start = new Date(2000, 0, 1), end = new Date()) {
    const randomTimestamp = Math.random() * (end.getTime() - start.getTime()) + start.getTime();
    const date = new Date(randomTimestamp)
    const dateString = date.toISOString()
    return dateString;
}


export function generateRandomString(length = 10) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}
