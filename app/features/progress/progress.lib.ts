import { TResult } from '@/app/shared/types';

export type ProgressType = 'worse' | 'better' | 'neutral';

const KG_PER_LB = 0.45359237;

function toKilograms(weight: number, units: string): number {
    if (units === 'lb') return weight * KG_PER_LB;
    return weight;
}

function calcScore(set: TResult): number {
    if (set.weight === 0) return set.reps;
    return toKilograms(set.weight, set.units) * set.reps;
}

export function getProgress(currentSet: TResult, previousSet: TResult): ProgressType {
    const currentScore = calcScore(currentSet);
    const previousScore = calcScore(previousSet);

    if (previousScore > currentScore) return 'worse';
    if (previousScore < currentScore) return 'better';
    return 'neutral';
}
