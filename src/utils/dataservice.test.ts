import "fake-indexeddb/auto";
import { test, expect } from "vitest";
import { get, getAll, add, put, remove, clear } from "./dataservice";
import { Exercise } from "./exerciseService";

test("Should change the data", async function () {
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
    for (const ex of testExerciseList) {
        await add(ex);
    }

    // Select *
    const val = await getAll();
    expect(val).toEqual(testExerciseList);

    // Remove Multiple
    await remove([1, 2]);
    const nextVal = await getAll();
    expect(nextVal).toEqual([
        {
            id: 3,
            name: "Row",
            datetime: new Date(),
            set: 2,
            weight: 100,
        },
    ]);

    // Clear
    await clear();
    const clearVal = await getAll();
    expect(clearVal).toEqual([]);
});
