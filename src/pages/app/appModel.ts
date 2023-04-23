import { useState, useEffect } from "react";
import { Exercise } from "../../utils/types";

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
            // Recomend an Exercise based on history
            setModel((prevModel) => ({
                ...prevModel,
                currExercise: {
                    name: "Squat",
                    sets: 0,
                    weight: 50,
                },

                // TODO: Should load exerciseHistory from indexDB
                exerciseHistory: [
                    {
                        name: "Testing",
                        sets: 0,
                        weight: 100,
                    },
                    {
                        name: "Temp",
                        sets: 0,
                        weight: 100,
                    },
                    {
                        name: "Soemthing",
                        sets: 0,
                        weight: 100,
                    },
                ],
            }));
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
                    setModel({
                        ...model,
                        currExercise: {
                            ...model.currExercise,
                            sets: model.currExercise.sets + 1,
                        },
                    });
                }
            },
            selectExercise() {},
            shuffleExercise() {},
        } as Actions,
    };
}
