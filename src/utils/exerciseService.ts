import { getHistory, getHistoryForExercise } from "./historyService";
export { addExercise, removeExercise } from "./historyService";

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
    id?: IDBValidKey;
    name: ExerciseType;
    set: number;
    weight: number;
    datetime: Date;
}

export const WEIGHT_INCREMENTS = 5;

export const EXERCISE_DEFAULT: Record<ExerciseType, Exercise> = {
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

export async function getNextExercise(): Promise<Exercise> {
    const available = await getAvailableExercieTypes();
    const exName = available[0];
    return await getNextExerciseByName(exName);
}

export async function getRandomExercise(
    exclude: ExerciseType | ExerciseType[]
): Promise<Exercise | null> {
    exclude = Array.isArray(exclude) ? exclude : [exclude];
    const available = await getAvailableExercieTypes();
    const exercises = available.filter((name) => !exclude.includes(name));
    if (exercises.length > 0) {
        const randomIndex = Math.floor(exercises.length * Math.random());
        return getNextExerciseByName(exercises[randomIndex]);
    } else {
        return null;
    }
}

export async function getAllAvailableExercies(): Promise<Exercise[]> {
    const available = await getAvailableExercieTypes();
    return Promise.all(available.map((name) => getNextExerciseByName(name)));
}

/* ======================== *\
    #Helpers
\* ======================== */

async function getNextExerciseByName(
    exerciseName: ExerciseType
): Promise<Exercise> {
    const exerciseHistory: Exercise[] = await getHistoryForExercise(
        exerciseName
    );
    const mostRecent = exerciseHistory.findLast(
        (ex) => ex.name === exerciseName
    );
    const setsAtCurrentWeight = exerciseHistory.filter(
        (ex) => ex.weight === mostRecent?.weight
    ).length;

    if (mostRecent && setsAtCurrentWeight >= 9) {
        // If you've done more than 9 set, Bump the weight
        return {
            name: exerciseName,
            datetime: new Date(),
            set: 1,
            weight: mostRecent.weight + 5,
        };
    } else if (mostRecent && setsAtCurrentWeight < 9) {
        // Less than 9 set, Keep doing the same Weight
        return {
            name: exerciseName,
            datetime: new Date(),
            set: mostRecent.set + 1,
            weight: mostRecent.weight,
        };
    } else {
        // There's no history Data in the DB yet, use Defaults
        return EXERCISE_DEFAULT[exerciseName] as Exercise;
    }
}

async function getAvailableExercieTypes() {
    const exerciseOrder = ALL_EXERCISES.slice(); // Clone the Array
    const numOfSets = ALL_EXERCISES.reduce(function (acc, exercise) {
        return {
            ...acc,
            [exercise]: 0,
        };
    }, {}) as Record<ExerciseType, number>;
    let availableExercies = new Set<ExerciseType>(exerciseOrder);
    const history = await getHistory();
    history.forEach(function (exercise) {
        numOfSets[exercise.name]++;

        // Exercises become Unavailable after 3 Completed Sets
        if (numOfSets[exercise.name] >= 3) {
            availableExercies.delete(exercise.name);
            numOfSets[exercise.name] = 0;
        }
        if (availableExercies.size === 0) {
            // Reset the Deck
            availableExercies = new Set<ExerciseType>(exerciseOrder);
        }
    });
    return Array.from(availableExercies);
}
