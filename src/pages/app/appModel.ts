import { useState, useEffect } from "react";
import {
    Exercise,
    ExerciseType,
    ALL_EXERCISES,
    EXERCISE_DEFAULT,
} from "../../utils/types";
import * as dataservice from "../../utils/dataservice";

/* ======================== *\
    #App Model
\* ======================== */

export interface Model {
    count: number;
    currExercise: Exercise | null;
    exerciseHistory: Exercise[];
}

export interface Actions {
    completeSet: () => void;
    increaseWeight: () => void;
    decreaseWeight: () => void;
    selectExercise: () => void;
    shuffleExercise: () => void;
    clearHistory: () => void;
}

const initalModel: Model = {
    count: 0,
    currExercise: null,
    exerciseHistory: [],
};

/* ======================== *\
    #Hook
\* ======================== */

export function useAppModel() {
    const [model, setModel] = useState(initalModel);

    /* ------------------------- *\
        #Initialize Model
    \* ------------------------- */

    useEffect(
        function () {
            // Pull Exercie History from DB
            dataservice.getAll().then(function (history) {
                // Recomend an Exercise based on history
                setModel({
                    ...initalModel,
                    currExercise: getAvailableExercies(history)[0],
                    exerciseHistory: history,
                });
            });
        },
        [setModel]
    );

    /* ------------------------- *\
        #Actions
    \* ------------------------- */

    return {
        model,
        actions: {
            increaseWeight(): void {
                if (model.currExercise) {
                    setModel({
                        ...model,
                        currExercise: {
                            ...model.currExercise,
                            weight: model.currExercise.weight + 5,
                        },
                    });
                }
            },
            decreaseWeight(): void {
                if (model.currExercise) {
                    setModel({
                        ...model,
                        currExercise: {
                            ...model.currExercise,
                            weight: model.currExercise.weight - 5,
                        },
                    });
                }
            },
            completeSet() {
                if (model.currExercise) {
                    const updatedExercise = {
                        ...model.currExercise,
                        datetime: new Date(),
                    };

                    const updatedHistory = [
                        updatedExercise,
                        ...model.exerciseHistory,
                    ];

                    // Update Model
                    setModel({
                        ...model,

                        // Should the current exercise change?
                        currExercise: getAvailableExercies(updatedHistory)[0],

                        // Add to exercise history
                        exerciseHistory: updatedHistory,
                    });

                    // Update Exercie History in DB
                    dataservice.add(updatedExercise);
                }
            },
            selectExercise() {},
            shuffleExercise() {},
            clearHistory() {
                // Update Model
                setModel({
                    ...model,
                    currExercise: selectNextExercise(model.exerciseHistory),
                    exerciseHistory: [],
                });

                // Update Exercie History in DB
                dataservice.clear();
            },
        } as Actions,
    };
}

export function getAvailableExercies(
    fullExerciseHistory: Exercise[]
): Exercise[] {
    const availableExercies = getAvailableExercieTypes(fullExerciseHistory);
    return availableExercies.map(function (exerciseName: ExerciseType) {
        // TODO: Do this with an index? indexedDB?
        const exerciseHistory = fullExerciseHistory
            .filter((ex) => ex.name === exerciseName)
            .sort((a, b) => a.datetime - b.datetime);
        const mostRecent = exerciseHistory.findLast(
            (ex) => ex.name === exerciseName
        );
        const setsAtCurrentWeight = exerciseHistory.filter(
            (ex) => ex.weight === mostRecent?.weight
        ).length;

        if (mostRecent && setsAtCurrentWeight >= 9) {
            // If you've done more than 9 set, Bump the weight
            return {
                name: exerciseName,
                datetime: new Date(),
                set: 1,
                weight: mostRecent.weight + 5,
            };
        } else if (mostRecent && setsAtCurrentWeight < 9) {
            // Less than 9 set, Keep doing the same Weight
            return {
                name: exerciseName,
                datetime: new Date(),
                set: mostRecent.set + 1,
                weight: mostRecent.weight,
            };
        } else {
            // There's no history Data in the DB yet, use Defaults
            return EXERCISE_DEFAULT[exerciseName] as Exercise;
        }
    });
}

function getAvailableExercieTypes(fullExerciseHistory: Exercise[]) {
    const exerciseOrder = ALL_EXERCISES.slice(); // Clone the Array
    const numOfSets = ALL_EXERCISES.reduce(function (acc, exercise) {
        return {
            ...acc,
            [exercise]: 0,
        };
    }, {});
    let availableExercies = new Set<ExerciseType>(exerciseOrder);
    fullExerciseHistory
        .slice()
        .sort((a, b) => a.datetime - b.datetime)
        .forEach(function (exercise) {
            numOfSets[exercise.name]++;

            // Exercises become Unavailable after 3 Completed Sets
            if (numOfSets[exercise.name] >= 3) {
                availableExercies.delete(exercise.name);
                numOfSets[exercise.name] = 0;
            }
            if (availableExercies.size === 0) {
                // Reset the Deck
                availableExercies = new Set<ExerciseType>(exerciseOrder);
            }
        });
    return Array.from(availableExercies);
}
