import { TResult } from '../types';
import { settingsStore } from '@/app/store/settingsStore';

export function getProgress(currentSet: TResult, previousSet: TResult) {
    const defaultUnits = settingsStore.units;

    function toDefaultUnits(weight: number, units: string): number {
        if (units === defaultUnits) return weight;
        if (defaultUnits === 'kg') return weight * 0.453;
        if (defaultUnits === 'lb') return weight * 2.205;
        return weight;
    }

    function calcScore(set: TResult): number {
        if (set.weight === 0) return set.reps;
        return toDefaultUnits(set.weight, set.units) * set.reps;
    }

    const currentScore = calcScore(currentSet);
    const previousScore = calcScore(previousSet);

    if (previousScore > currentScore) return 'worse';
    if (previousScore < currentScore) return 'better';
    return 'neutral';
}

export function getformattedDate(date: string | Date) {
    if (date instanceof Date) {
        date = date.toISOString();
    }

    const [year, month, day] = date.split('T')[0].split('-');
    const formattedDate = `${day}.${month}.${year.slice(-2)}`;

    return formattedDate;
}

export function toTitleCase(str: string) {
    if (!str || str.length < 1) return str;
    return str
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function handleTransactionError(error: unknown, message: string, place: string) {
    console.error(`${place} error`, error);
    let errorMessage = message;
    if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    }
    return { success: false, error: errorMessage };
}
