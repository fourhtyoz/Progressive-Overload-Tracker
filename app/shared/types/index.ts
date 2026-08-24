export type TExercise = {
    id: number;
    title: string;
    type: string;
};

export type TResult = {
    id: number;
    exercise_id: number;
    date: string;
    reps: number;
    weight: number;
    units: string;
    sets: number;
};

export interface DBResult<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
}
