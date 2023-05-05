import { getAll, add, clear } from "./dataservice";
import { Exercise, ExerciseType } from "./exerciseService";

const HISTORY_STORE = "exerciseHistory";

/* ======================== *\
    #Read
\* ======================== */

export async function getHistory(): Promise<Exercise[]> {
    const history = await getAll(HISTORY_STORE);
    return history.sort((a, b) => Number(a.datetime) - Number(b.datetime));
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

export async function addExercise(data: Exercise): Promise<IDBValidKey> {
    return await add(HISTORY_STORE, data);
}

export async function clearHistory(): Promise<void> {
    return await clear(HISTORY_STORE);
}
