import { useState, useEffect } from "react";
import { Exercise, ALL_EXERCISES } from "../../utils/types";
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
                    currExercise: selectNextExercise(history),
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
                        set: model.currExercise.set + 1,
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
                        currExercise:
                            updatedExercise.set < 9
                                ? updatedExercise
                                : selectNextExercise(updatedHistory),

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

function selectNextExercise(exerciseHistory: Exercise[]): Exercise {
    return {
        name: ALL_EXERCISES[Math.floor(Math.random() * ALL_EXERCISES.length)],
        datetime: new Date(),
        set: 0,
        weight: 100,
    };
}
