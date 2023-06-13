import "fake-indexeddb/auto";
import { test, expect, beforeEach } from "vitest";
import { clearHistory } from "./historyService";
import {
    Exercise,
    EXERCISE_DEFAULT,
    ALL_EXERCISES,
    addExercise,
    getAllAvailableExercies,
    getNextExercise,
} from "./exerciseService";

beforeEach(async () => {
    await clearHistory();
});

test("Should not change Exercise until 3 sets have been completed", async function () {
    // Same
    await addExercise(EXERCISE_DEFAULT["Squat"]);
    let exercise = await getNextExercise();
    expect(exercise.name).toBe("Squat");

    // Same
    await addExercise(EXERCISE_DEFAULT["Squat"]);
    exercise = await getNextExercise();
    expect(exercise.name).toBe("Squat");

    // New
    await addExercise(EXERCISE_DEFAULT["Squat"]);
    exercise = await getNextExercise();
    expect(exercise.name).toBe("OHP");
    expect(exercise.set).toBe(1);
});

test("Should Bump Exercise Weight after 9 sets", async function () {
    let history: Exercise[] = [];

    // 9 Sets of Squats
    for (let i = 0; i < 9; i++) {
        history.push(EXERCISE_DEFAULT["Squat"]);
    }
    // 3 Set of every other Exersice
    history = history.concat(
        ALL_EXERCISES.filter((name) => name !== "Squat").flatMap((ex) => [
            EXERCISE_DEFAULT[ex],
            EXERCISE_DEFAULT[ex],
            EXERCISE_DEFAULT[ex],
        ])
    );
    for (const hisExercise of history) {
        await addExercise(hisExercise);
    }

    const exercise = await getNextExercise();
    expect(exercise.name).toBe("Squat");
    expect(exercise.weight).toBeGreaterThan(EXERCISE_DEFAULT["Squat"].weight);
});

test("Should reset the AvailableExercises after doing every Exercise 3 times", async function () {
    await addExercise(EXERCISE_DEFAULT["Squat"]);

    // Shouldn't switch Exercises yet
    let available = await getAllAvailableExercies();
    expect(available[0].name).toBe("Squat");
    expect(available[0].weight).toBe(EXERCISE_DEFAULT["Squat"].weight);

    let exercies = available.map((ex) => ex.name);
    expect(exercies).toEqual(ALL_EXERCISES);

    // Should Switch Exercise after 3 Sets
    await addExercise(EXERCISE_DEFAULT["Squat"]);
    await addExercise(EXERCISE_DEFAULT["Squat"]);

    available = await getAllAvailableExercies();
    expect(available[0].name).toBe("OHP");
    expect(available[0].set).toBe(1);
    expect(available[0].weight).toBe(EXERCISE_DEFAULT["OHP"].weight);

    exercies = available.map((ex) => ex.name);
    expect(exercies).toEqual([
        // "Squat", -- Squat should not be "available" since we completed 3sets
        "OHP",
        "Deadlift",
        "Bench press",
        "Row",
        "Calf Raises",
        "Ab workout",
    ]);

    // 3 Set of every other Exersice
    for (const exerciseName of ALL_EXERCISES) {
        await addExercise(EXERCISE_DEFAULT[exerciseName]);
        await addExercise(EXERCISE_DEFAULT[exerciseName]);
        await addExercise(EXERCISE_DEFAULT[exerciseName]);
    }

    // Available Exercises Should Reset
    available = await getAllAvailableExercies();
    exercies = available.map((ex) => ex.name);
    expect(exercies).toEqual(ALL_EXERCISES);

    // Should continue with the second loop
    await addExercise(EXERCISE_DEFAULT["Squat"]);

    available = await getAllAvailableExercies();
    expect(available[0].name).toBe("Squat");
    expect(available[0].weight).toBe(EXERCISE_DEFAULT["Squat"].weight);

    exercies = available.map((ex) => ex.name);
    expect(exercies).toEqual(ALL_EXERCISES);
});
