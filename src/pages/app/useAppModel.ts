import { useState, useEffect } from "react";
import { addExercise } from "../../utils/historyService";
import {
    Exercise,
    getNextExercise,
    getRandomExercise,
} from "../../utils/exerciseService";

/* ======================== *\
    #App Model
\* ======================== */

export interface Model {
    currExercise: Exercise | null;
}

const initalModel: Model = {
    currExercise: null,
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
                });
            })();
        },
        [setModel]
    );

    /* ------------------------- *\
        #Actions
    \* ------------------------- */

    return {
        ...model,
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
                // Update Exercie History in DB
                await addExercise({
                    ...model.currExercise,
                    datetime: new Date(),
                });

                // Update Model
                setModel({
                    ...model,
                    currExercise: await getNextExercise(),
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
            // randomly select and exercise that's not the same as the current one
            const randomExercise = await getRandomExercise(
                model.currExercise?.name ?? []
            );

            // If it can't find a random exercise to select, do nothing.
            if (randomExercise) {
                setModel({
                    ...model,
                    currExercise: randomExercise,
                });
            }
        },
        // async clearHistory(): Promise<void> {
        //     // Update Exercie History in DB
        //     await clearHistory();

        //     // Update Model
        //     setModel({
        //         ...model,
        //         // If history change, the currentExercise does to
        //         currExercise: await getNextExercise(),
        //     });
        // },
    };
}
