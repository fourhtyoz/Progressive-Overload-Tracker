import { settingsStore } from '@/app/shared/stores/settings.store';
import { TResult } from '@/app/shared/types';

export type ProgressType = 'worse' | 'better' | 'neutral';

export function getProgress(currentSet: TResult, previousSet: TResult): ProgressType {
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
