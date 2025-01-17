export type Exercise = {
    title: string,
    type: string
}

export type Result = {
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