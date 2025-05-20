import { makeAutoObservable, runInAction } from "mobx";
import { fetchExercises } from "../services/db";
import { TExercise } from "../types";

class ExerciseStore {
    isLoading = false;
    error = '';
    exercises: TExercise[] = [];
    muscleOptions: string[] = []

    constructor() {
        makeAutoObservable(this);
        this.initialize();
    }

    async initialize() {
        runInAction(() => {
            this.isLoading = true;
            this.error = '';
        });
        
        const res = await fetchExercises();
        const { success, data, error } = res;
        runInAction(() => {
            if (success) {
                this.exercises = data;
                this.muscleOptions = Array.from(new Set(this.exercises.map(item => item.type)));
            } else {
                this.error = error?.message || "Failed to load exercises";
            }
        });

        runInAction(() => {
            this.isLoading = false
        })
    }

    resetError = () => {
        runInAction(() => {
            this.error = ''
        })
    }
}

export const exerciseStore = new ExerciseStore();