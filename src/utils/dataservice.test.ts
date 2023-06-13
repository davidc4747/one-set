import "fake-indexeddb/auto";
import { test, expect } from "vitest";
import { Exercise, get, getAll, add, put, remove, clear } from "./dataservice";

test.only("Should change the data", async function () {
    const testExercise: Exercise = {
        name: "Squat",
        datetime: new Date(),
        set: 2,
        weight: 100,
    };

    // Insert
    const key = await add(testExercise);
    expect(key).toBe(1);

    // Select
    const val = await get(key);
    expect(val).toEqual({ ...testExercise, id: key });

    // Update
    const newExercise: Exercise = {
        id: key,
        name: "OHP",
        datetime: new Date(),
        set: 8,
        weight: 200,
    };
    const putid = await put(newExercise);
    expect(putid).toBe(key);
    const newVal = await get(key);
    expect(newVal).toEqual(newExercise);

    // Delete
    await remove(key);
    const delval = await get(key);
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
    await add(testExerciseList);

    // Select *
    const val = await getAll();
    expect(val).toEqual(testExerciseList);

    // Clear
    await clear();
    const clearVal = await getAll();
    expect(clearVal).toEqual([]);
});
