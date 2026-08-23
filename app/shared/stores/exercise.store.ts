import { makeAutoObservable, runInAction } from 'mobx';

import {
    addExercise as dbAddExercise,
    addResult as dbAddResult,
    deleteExercise as dbDeleteExercise,
    deleteResult as dbDeleteResult,
    exerciseExist,
    fetchExercises,
    fetchLatestResultByExerciseId,
    fetchResultById as dbFetchResultById,
    fetchResultsByExerciseId as dbFetchResultsByExerciseId,
    renameExercise as dbRenameExercise,
    updateResult as dbUpdateResult,
} from '@/app/shared/api/db';
import { DBResult, TExercise, TResult } from '@/app/shared/types';

class ExerciseStore {
    isLoading = false;
    error = '';
    exercises: TExercise[] = [];
    muscleOptions: string[] = [];
    resultsCache = new Map<number, TResult[]>();

    constructor() {
        makeAutoObservable(this);
    }

    async initialize() {
        runInAction(() => {
            this.isLoading = true;
            this.error = '';
        });

        const res = await fetchExercises();
        runInAction(() => {
            if (res.success && Array.isArray(res.data)) {
                this.exercises = res.data;
                this.muscleOptions = Array.from(new Set(this.exercises.map((item) => item.type)));
            } else {
                this.error = res.error || 'Failed to load exercises';
            }
            this.isLoading = false;
        });
    }

    resetError = () => {
        runInAction(() => {
            this.error = '';
        });
    };

    setError = (message: string) => {
        runInAction(() => {
            this.error = message;
        });
    };

    private refreshExercises = async () => {
        const res = await fetchExercises();
        runInAction(() => {
            if (res.success && Array.isArray(res.data)) {
                this.exercises = res.data;
                this.muscleOptions = Array.from(new Set(this.exercises.map((item) => item.type)));
            }
        });
    };

    // EXERCISES
    async checkExerciseExists(title: string, type: string): Promise<boolean> {
        return exerciseExist(title, type);
    }

    async addExercise(title: string, type: string) {
        const res = await dbAddExercise(title, type);
        if (res.success) {
            await this.refreshExercises();
        }
        return res;
    }

    // RESULTS
    async addResult(exerciseId: number, date: string, reps: number, weight: number, units: string) {
        const res = await dbAddResult(exerciseId, date, reps, weight, units);
        if (res.success) {
            runInAction(() => {
                this.resultsCache.clear();
            });
        }
        return res;
    }

    async updateResult(
        id: number,
        exerciseId: number,
        date: string,
        reps: number,
        weight: number,
        units: string
    ) {
        const res = await dbUpdateResult(id, exerciseId, date, reps, weight, units);
        if (res.success) {
            runInAction(() => {
                this.resultsCache.clear();
            });
        }
        return res;
    }

    async deleteResult(id: number) {
        const res = await dbDeleteResult(id);
        if (res.success) {
            runInAction(() => {
                for (const [exerciseId, rows] of this.resultsCache) {
                    const filtered = rows.filter((row) => row.id !== id);
                    if (filtered.length !== rows.length) {
                        this.resultsCache.set(exerciseId, filtered);
                    }
                }
            });
        }
        return res;
    }

    async fetchResultById(id: number): Promise<DBResult<TResult>> {
        return dbFetchResultById(id);
    }

    async loadResults(exerciseId: number): Promise<DBResult<TResult[]>> {
        const cached = this.resultsCache.get(exerciseId);
        if (cached) return { success: true, data: cached };

        const res = await dbFetchResultsByExerciseId(exerciseId);
        if (res.success && res.data) {
            const data = res.data;
            runInAction(() => {
                this.resultsCache.set(exerciseId, data);
            });
        }
        return res;
    }

    async fetchLatestResult(exerciseId: number): Promise<TResult | null> {
        const res = await fetchLatestResultByExerciseId(exerciseId);
        return res.success && res.data ? res.data : null;
    }

    isTitleTaken(title: string, type: string, excludeId?: number): boolean {
        return this.exercises.some(
            (item) =>
                item.type === type &&
                item.title.toLowerCase() === title.toLowerCase() &&
                item.id !== excludeId
        );
    }

    async renameExercise(id: number, newTitle: string) {
        const res = await dbRenameExercise(id, newTitle);
        if (res.success) {
            runInAction(() => {
                this.resultsCache.clear();
            });
            await this.refreshExercises();
        }
        return res;
    }

    async deleteExercise(id: number) {
        const res = await dbDeleteExercise(id);
        if (res.success) {
            runInAction(() => {
                this.resultsCache.delete(id);
            });
            await this.refreshExercises();
        }
        return res;
    }
}

export const exerciseStore = new ExerciseStore();
