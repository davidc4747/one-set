import { useState, useEffect } from "react";
import { getHistory, addExercise } from "../../utils/historyService";
import {
    Exercise,
    getNextExercise,
    getRandomExercise,
} from "../../utils/exerciseService";

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
    selectExercise: (exercise: Exercise) => void;
    shuffleExercise: () => void;
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
            (async function init() {
                // Recomend an Exercise based on history
                setModel({
                    ...initalModel,
                    currExercise: await getNextExercise(),
                    exerciseHistory: await getHistory(),
                });
            })();
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
            async completeSet() {
                if (model.currExercise) {
                    const updatedExercise = {
                        ...model.currExercise,
                        datetime: new Date(),
                    };

                    // Update Exercie History in DB
                    await addExercise(updatedExercise);

                    // Update Model
                    setModel({
                        ...model,

                        currExercise: await getNextExercise(),

                        // Add to exercise history
                        exerciseHistory: [
                            updatedExercise,
                            ...model.exerciseHistory,
                        ],
                    });
                }
            },
            selectExercise(exercise: Exercise) {
                setModel({
                    ...model,
                    currExercise: exercise,
                });
            },
            async shuffleExercise() {
                const randomExercise = await getRandomExercise(
                    // randomly select and exercise that's not the same as the current one
                    model.currExercise ? [model.currExercise.name] : []
                );

                // If it can't find an exersice to select, do nothing.
                if (randomExercise) {
                    setModel({
                        ...model,
                        currExercise: randomExercise,
                    });
                }
            },
        } as Actions,
    };
}