import "fake-indexeddb/auto";
import { test, expect } from "vitest";
import { get, getAll, add, put, remove, clear } from "./dataservice";
import { Exercise } from "./exerciseService";

const STORE = "exerciseHistory";

test("Should change the data", async function () {
    const testExercise: Exercise = {
        name: "Squat",
        datetime: new Date(),
        set: 2,
        weight: 100,
    };

    // Insert
    const key = await add(STORE, testExercise);
    expect(key).toBe(1);

    // Select
    const val = await get(STORE, key);
    expect(val).toEqual({ ...testExercise, id: key });

    // Update
    const newExercise: Exercise = {
        id: key,
        name: "OHP",
        datetime: new Date(),
        set: 8,
        weight: 200,
    };
    const putid = await put(STORE, key, newExercise);
    expect(putid).toBe(key);
    const newVal = await get(STORE, key);
    expect(newVal).toEqual(newExercise);

    // Delete
    await remove(STORE, key);
    const delval = await get(STORE, key);
    expect(delval).toBeUndefined();
});

test("Should get and clear the full datastore", async function () {
    const testExerciseList: Exercise[] = [
        {
            id: 1,
            name: "Squat",
            datetime: new Date(),
            set: 2,
            weight: 100,
        },
        {
            id: 2,
            name: "Deadlift",
            datetime: new Date(),
            set: 2,
            weight: 100,
        },
        {
            id: 3,
            name: "Row",
            datetime: new Date(),
            set: 2,
            weight: 100,
        },
    ];

    // Insert a bunch
    for (const ex of testExerciseList) {
        await add(STORE, ex);
    }

    // Select *
    const val = await getAll(STORE);
    expect(val).toEqual(testExerciseList);

    // Clear
    await clear(STORE);
    const clearVal = await getAll(STORE);
    expect(clearVal).toEqual([]);
});
