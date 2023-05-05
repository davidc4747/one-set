import "fake-indexeddb/auto";
import { test, expect } from "vitest";
import { get, getAll, add, put, remove, clear } from "./dataservice";

const STORE = "exerciseHistory";

test("Should change the data", async function () {
    const testExercise = {
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
    expect(val).toEqual(testExercise);

    // Update
    const newExercise = {
        name: "OHP",
        datetime: new Date(),
        set: 8,
        weight: 200,
    };
    const putid = await put(STORE, key, newExercise);
    expect(putid).toBe(key);
    const newVal = await get(STORE, key);
    expect(newVal).toEqual(newExercise);

    // delete
    await remove(STORE, key);
    const delval = await get(STORE, key);
    expect(delval).toBeUndefined();
});

test("Should get and clear the full datastore", async function () {
    const testExerciseList = [
        {
            name: "Squat",
            datetime: new Date(),
            set: 2,
            weight: 100,
        },
        {
            name: "Deadlift",
            datetime: new Date(),
            set: 2,
            weight: 100,
        },
        {
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
