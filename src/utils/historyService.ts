import moment from "moment";
import { getAll, clear } from "./dataservice";
import { Exercise, ExerciseType } from "./exerciseService";

/* ======================== *\
    #Read
\* ======================== */

export async function getHistory(sortAscending = true): Promise<Exercise[]> {
    const history: Exercise[] = await getAll();
    if (sortAscending) {
        return history.sort((a, b) => Number(a.datetime) - Number(b.datetime));
    } else {
        return history.sort((a, b) => Number(b.datetime) - Number(a.datetime));
    }
}

export async function getHistoryForToday(): Promise<Exercise[]> {
    const history = await getHistory(false);
    return combineDuplicateExercise(
        history.filter((ex) => moment(ex.datetime).isSame(moment(), "day"))
    );
}

export async function getHistoryForExercise(
    exerciseName: ExerciseType
): Promise<Exercise[]> {
    const history = await getHistory();
    return history.filter((ex) => ex.name === exerciseName);
}

/* ------------------------- *\
    #By Group
\* ------------------------- */

export async function getHistoryByDate(): Promise<Map<string, Exercise[]>> {
    const history = await getHistory(false);
    const groups = new Map<string, Exercise[]>();
    history.forEach(function (exercise) {
        const date = moment(exercise.datetime).format("YYYY-MM-DD");
        const group = groups.get(date) ?? [];
        group.push(exercise);
        groups.set(date, combineDuplicateExercise(group));
    });
    return groups;
}

/* ======================== *\
    #Update
\* ======================== */

export async function clearHistory(): Promise<void> {
    return await clear();
}

/* ======================== *\
    #Helpers
\* ======================== */

function combineDuplicateExercise(exerciseList: Exercise[]): Exercise[] {
    const numOfSets = {
        Squat: 0,
        OHP: 0,
        Deadlift: 0,
        "Bench press": 0,
        Row: 0,
        "Calf Raises": 0,
        "Ab workout": 0,
    };
    //  Count the number of Sets
    exerciseList.forEach(function (exercise) {
        numOfSets[exercise.name] += exercise.set;
    });
    return (
        exerciseList
            // Filter out Duplicates
            .filter(
                (ex, index) =>
                    index ===
                    exerciseList.findIndex(
                        (innerEx) => innerEx.name === ex.name
                    )
            )
            // Apply the new value
            .map((ex) => {
                return { ...ex, set: numOfSets[ex.name] };
            })
    );
}
