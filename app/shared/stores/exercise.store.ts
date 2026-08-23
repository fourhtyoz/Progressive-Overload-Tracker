import { makeAutoObservable, runInAction } from 'mobx';

import {
    addExercise as dbAddExercise,
    addResult as dbAddResult,
    deleteResult as dbDeleteResult,
    exerciseExist,
    fetchExercises,
    fetchResultById as dbFetchResultById,
    fetchResultsByExerciseId as dbFetchResultsByExerciseId,
    updateResult as dbUpdateResult,
} from '@/app/shared/api/db';
import { DBResult, TExercise, TResult } from '@/app/shared/types';

class ExerciseStore {
    isLoading = false;
    error = '';
    exercises: TExercise[] = [];
    muscleOptions: string[] = [];

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
    async addResult(
        exercise: string,
        exerciseId: number,
        date: string,
        muscleGroup: string,
        reps: number,
        weight: number,
        units: string
    ) {
        return dbAddResult(exercise, exerciseId, date, muscleGroup, reps, weight, units);
    }

    async updateResult(
        id: number,
        exercise: string,
        exerciseId: number,
        date: string,
        muscleGroup: string,
        reps: number,
        weight: number,
        units: string
    ) {
        return dbUpdateResult(id, exercise, exerciseId, date, muscleGroup, reps, weight, units);
    }

    async deleteResult(id: number) {
        return dbDeleteResult(id);
    }

    async fetchResultById(id: number): Promise<DBResult<TResult>> {
        return dbFetchResultById(id);
    }

    async fetchResultsByExerciseId(exerciseId: number): Promise<DBResult<TResult[]>> {
        return dbFetchResultsByExerciseId(exerciseId);
    }
}

export const exerciseStore = new ExerciseStore();
