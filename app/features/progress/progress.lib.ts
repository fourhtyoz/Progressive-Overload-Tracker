import { TResult } from '@/app/shared/types';

export type ProgressType = 'worse' | 'better' | 'neutral';

const KG_PER_LB = 0.45359237;

function toKilograms(weight: number, units: string): number {
    if (units === 'lb') return weight * KG_PER_LB;
    return weight;
}

function isBodyweight(set: TResult): boolean {
    return set.weight === 0;
}

export function calcOneRepMax(set: TResult): number {
    if (set.weight === 0) return set.reps;
    const kg = toKilograms(set.weight, set.units);
    if (set.reps === 1) return kg;
    return kg * (1 + set.reps / 30);
}

export function getProgress(currentSet: TResult, previousSet: TResult): ProgressType {
    if (isBodyweight(currentSet) !== isBodyweight(previousSet)) {
        return 'neutral';
    }

    const currentScore = calcOneRepMax(currentSet);
    const previousScore = calcOneRepMax(previousSet);

    if (previousScore > currentScore) return 'worse';
    if (previousScore < currentScore) return 'better';
    return 'neutral';
}

export function getBestResult(results: TResult[]): TResult | null {
    if (results.length === 0) return null;
    return results.reduce((best, current) =>
        calcOneRepMax(current) > calcOneRepMax(best) ? current : best
    );
}

export function getLatestResult(results: TResult[]): TResult | null {
    if (results.length === 0) return null;
    return [...results].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)[0];
}

export function getPctChange(current: number, previous: number): number | null {
    if (previous === 0) return null;
    return ((current - previous) / previous) * 100;
}
