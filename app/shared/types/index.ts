export type TExercise = {
    id: number;
    title: string;
    type: string;
};

export type TResult = {
    id: number;
    exercise_id: number;
    exercise: string;
    date: string;
    muscleGroup: string;
    reps: number;
    weight: number;
    units: string;
};

export interface DBResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
