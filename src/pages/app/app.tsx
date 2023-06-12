import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
    WEIGHT_INCREMENTS,
    Exercise as ExerciseData,
    getNextExercise,
    getRandomExercise,
    addExercise,
} from "../../utils/exerciseService";
import Exercise from "../exercise/exercise";
import SelectExercise from "../selectExercise/selectExercise";
import History from "../history/history";

/* ===================== *\
    # App
\* ===================== */

export default function App(): React.ReactElement {
    const [currExercise, setExercise] = useState<ExerciseData | null>(null);
    useEffect(function () {
        (async function () {
            setExercise(await getNextExercise());
        })();
    }, []);

    /* ------------------------- *\
        #Actions
    \* ------------------------- */

    function increaseWeight(): void {
        if (currExercise) {
            setExercise({
                ...currExercise,
                weight: currExercise.weight + WEIGHT_INCREMENTS,
            });
        }
    }
    function decreaseWeight(): void {
        if (currExercise) {
            setExercise({
                ...currExercise,
                weight: currExercise.weight - WEIGHT_INCREMENTS,
            });
        }
    }
    async function completeSet() {
        if (currExercise) {
            // Update Exercie History in DB
            await addExercise({
                ...currExercise,
                datetime: new Date(),
            });

            // Update Model
            setExercise(await getNextExercise());
        }
    }
    function selectExercise(exercise: ExerciseData) {
        setExercise(exercise);
    }
    async function shuffleExercise() {
        // randomly select and exercise that's not the same as the current one
        const randomExercise = await getRandomExercise(
            currExercise?.name ?? []
        );

        // If it can't find a random exercise to select, do nothing.
        if (randomExercise) {
            setExercise(randomExercise);
        }
    }

    /* ------------------------- *\
        #Render
    \* ------------------------- */

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Exercise
                            currExercise={currExercise}
                            onSetCompleted={completeSet}
                            increaseWeight={increaseWeight}
                            decreaseWeight={decreaseWeight}
                            shuffleExercise={shuffleExercise}
                        />
                    }
                />
                <Route
                    path="/select"
                    element={<SelectExercise onSelect={selectExercise} />}
                />
                <Route path="/history" element={<History />} />
            </Routes>
        </BrowserRouter>
    );
}
