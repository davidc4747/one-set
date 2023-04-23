import { test, expect } from "vitest";
import "fake-indexeddb/auto";
import { get, add, put, remove } from "./dataservice";

test("Should change the data", async function () {
    const testExercise = {
        name: "Testing",
        sets: 2,
        weight: 100,
    };

    // Insert
    const key = await add(testExercise);
    expect(key).toBe(1);

    // Select
    const val = await get(key);
    expect(val).toEqual(testExercise);

    // Update
    const newExercise = {
        name: "Change",
        sets: 8,
        weight: 200,
    };
    const putid = await put(key, newExercise);
    expect(putid).toBe(key);
    const newVal = await get(key);
    expect(newVal).toEqual(newExercise);

    // delete
    await remove(key);
    const delval = await get(key);
    expect(delval).toBeUndefined();
});
