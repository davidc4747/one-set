export const ALL_EXERCISES = [
    "Squat",
    "OHP",
    "Deadlift",
    "Bench press",
    "Row",
    "Calf Raises",
    "Ab workout",
] as const;

export type ExerciseType = (typeof ALL_EXERCISES)[number];

export interface Exercise {
    name: ExerciseType;
    set: number;
    weight: number;
    datetime: Date;
}

export const EXERCISE_DEFAULT = {
    Squat: {
        name: "Squat",
        datetime: new Date(),
        set: 1,
        weight: 50,
    },
    OHP: {
        name: "OHP",
        datetime: new Date(),
        set: 1,
        weight: 25,
    },
    Deadlift: {
        name: "Deadlift",
        datetime: new Date(),
        set: 1,
        weight: 45,
    },
    "Bench press": {
        name: "Bench press",
        datetime: new Date(),
        set: 1,
        weight: 30,
    },
    Row: {
        name: "Row",
        datetime: new Date(),
        set: 1,
        weight: 30,
    },
    "Calf Raises": {
        name: "Calf Raises",
        datetime: new Date(),
        set: 1,
        weight: 50,
    },
    "Ab workout": {
        name: "Ab workout",
        datetime: new Date(),
        set: 1,
        weight: 10,
    },
} as const;
