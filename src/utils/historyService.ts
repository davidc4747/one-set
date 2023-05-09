import { getAll, add, clear } from "./dataservice";
import { Exercise, ExerciseType } from "./exerciseService";

const HISTORY_STORE = "exerciseHistory";

/* ======================== *\
    #Read
\* ======================== */

export async function getHistory(sortAscending = true): Promise<Exercise[]> {
    const history = await getAll(HISTORY_STORE);
    if (sortAscending) {
        return history.sort((a, b) => Number(a.datetime) - Number(b.datetime));
    } else {
        return history.sort((a, b) => Number(b.datetime) - Number(a.datetime));
    }
}

export async function getHistoryForExercise(
    exerciseName: ExerciseType
): Promise<Exercise[]> {
    const history = await getHistory();
    return history.filter((ex) => ex.name === exerciseName);
}

/* ======================== *\
    #Update
\* ======================== */

export async function addExercise(
    data: Exercise | Exercise[]
): Promise<IDBValidKey> {
    if (Array.isArray(data)) {
        return Promise.all(
            data.map(async (item) => await add(HISTORY_STORE, item))
        );
    } else {
        return await add(HISTORY_STORE, data);
    }
}

export async function clearHistory(): Promise<void> {
    return await clear(HISTORY_STORE);
}
