export type Exercise = {
    title: string,
    type: string
}

export type Result = {
    id: number,
    exercise: string,
    date: string,
    muscleGroup: string,
    reps: number,
    weight: number,
    units: string
}

export type GroupedResult = {
    [key: string]: Result[];
};

export type Muscle = {
    title: string;
    ru: string;
    en: string;
    de: string;
    es: string;
    tr: string;
}