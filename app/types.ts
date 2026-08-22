export type TExercise = {
    id: number;
    title: string;
    type: string;
};

export type TResult = {
    id: number;
    exercise: string;
    date: string;
    muscleGroup: string;
    reps: number;
    weight: number;
    units: string;
};

export type TTranslatedItem = {
    title: string;
    ru: string;
    en: string;
    de: string;
    es: string;
    tr: string;
};

export interface DBResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
