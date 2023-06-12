import moment from "moment";
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

export async function getHistoryForToday(): Promise<Exercise[]> {
    const history = await getHistory(false);
    return history.filter((ex) => moment(ex.datetime).isSame(moment(), "day"));
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
        if (groups.has(date)) {
            // Append to the Group
            const group = groups.get(date);
            group?.push(exercise);
        } else {
            // Start a new Group
            groups.set(date, [exercise]);
        }
    });
    return groups;
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
