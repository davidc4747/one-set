import { test, expect } from "vitest";
import { getAvailableExercies } from "./appModel";
import { Exercise, ALL_EXERCISES, EXERCISE_DEFAULT } from "../../utils/types";

test("Should not change Exercise until 3 sets have been completed", function () {
    const history = [EXERCISE_DEFAULT["Squat"]];

    const out = getAvailableExercies(history);
    expect(out[0].name).toBe("Squat");
    expect(out[0].set).toBe(2);
    expect(out[0].weight).toBe(EXERCISE_DEFAULT["Squat"].weight);

    const exercies = out.map((ex) => ex.name);
    expect(exercies).toEqual([
        "Squat",
        "OHP",
        "Deadlift",
        "Bench press",
        "Row",
        "Calf Raises",
        "Ab workout",
    ]);
});

test("Should Switch Exercises after 3 sets", function () {
    const history = [
        EXERCISE_DEFAULT["Squat"],
        EXERCISE_DEFAULT["Squat"],
        EXERCISE_DEFAULT["Squat"],
    ];

    const out = getAvailableExercies(history);
    expect(out[0].name).toBe("OHP");
    expect(out[0].set).toBe(1);
    expect(out[0].weight).toBe(EXERCISE_DEFAULT["OHP"].weight);

    const exercies = out.map((ex) => ex.name);
    expect(exercies).toEqual([
        "OHP",
        "Deadlift",
        "Bench press",
        "Row",
        "Calf Raises",
        "Ab workout",
    ]);
});

test("Should Bump Exercise Weight after 9 sets", function () {
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

    const out = getAvailableExercies(history);
    expect(out[0].name).toBe("Squat");
    expect(out[0].weight).toBeGreaterThan(EXERCISE_DEFAULT["Squat"].weight);

    const exercies = out.map((ex) => ex.name);
    expect(exercies).toEqual([
        "Squat",
        "OHP",
        "Deadlift",
        "Bench press",
        "Row",
        "Calf Raises",
        "Ab workout",
    ]);
});

test("Should reset the AvailableExercises after doing every Exercise", function () {
    let history: Exercise[] = [];
    history.push(EXERCISE_DEFAULT["Squat"]);

    // Shouldn't switch Exercises yet
    let available = getAvailableExercies(history);
    expect(available[0].name).toBe("Squat");
    expect(available[0].set).toBe(2);
    expect(available[0].weight).toBe(EXERCISE_DEFAULT["Squat"].weight);

    let exercies = available.map((ex) => ex.name);
    expect(exercies).toEqual([
        "Squat",
        "OHP",
        "Deadlift",
        "Bench press",
        "Row",
        "Calf Raises",
        "Ab workout",
    ]);

    // Should Switch Exercise after 3 Sets
    history.push(EXERCISE_DEFAULT["Squat"]);
    history.push(EXERCISE_DEFAULT["Squat"]);

    available = getAvailableExercies(history);
    expect(available[0].name).toBe("OHP");
    expect(available[0].set).toBe(1);
    expect(available[0].weight).toBe(EXERCISE_DEFAULT["OHP"].weight);

    exercies = available.map((ex) => ex.name);
    expect(exercies).toEqual([
        "OHP",
        "Deadlift",
        "Bench press",
        "Row",
        "Calf Raises",
        "Ab workout",
    ]);

    // 3 Set of every other Exersice
    history = history.concat(
        ALL_EXERCISES.filter((name) => name !== "Squat").flatMap((ex) => [
            EXERCISE_DEFAULT[ex],
            EXERCISE_DEFAULT[ex],
            EXERCISE_DEFAULT[ex],
        ])
    );

    // Should Available Exercises Should Reset
    available = getAvailableExercies(history);
    exercies = available.map((ex) => ex.name);
    expect(exercies).toEqual([
        "Squat",
        "OHP",
        "Deadlift",
        "Bench press",
        "Row",
        "Calf Raises",
        "Ab workout",
    ]);

    // Should continue with the second loop
    history.push(EXERCISE_DEFAULT["Squat"]);

    available = getAvailableExercies(history);
    expect(available[0].name).toBe("Squat");
    expect(available[0].weight).toBe(EXERCISE_DEFAULT["Squat"].weight);

    exercies = available.map((ex) => ex.name);
    expect(exercies).toEqual([
        "Squat",
        "OHP",
        "Deadlift",
        "Bench press",
        "Row",
        "Calf Raises",
        "Ab workout",
    ]);
});
