import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Exercise } from "../../utils/exerciseService";
import { getHistoryForToday } from "../../utils/historyService";

/* ===================== *\
    # Exercise
\* ===================== */

interface PropTypes {
    currExercise: Exercise | null;
    onSetCompleted(): void;
    increaseWeight(): void;
    decreaseWeight(): void;
    shuffleExercise(): void;
}

export default function Exercise(props: PropTypes): React.ReactElement {
    const {
        currExercise,
        onSetCompleted,
        increaseWeight,
        decreaseWeight,
        shuffleExercise,
    } = props;

    // Get the history Data from the DB
    const [history, setHistory] = useState<Exercise[]>([]);
    useEffect(function () {
        (async function init() {
            setHistory(await getHistoryForToday());
        })();
    }, []);

    async function handleSetCompleted(): Promise<void> {
        if (currExercise) {
            onSetCompleted();

            // Update exercise history
            setHistory(await getHistoryForToday());
        }
    }

    return (
        <>
            <header className="grid grid-cols-2 grid-row-2 gap-md">
                <div className=" bg-primary-500 p-lg text-xl font-bold rounded col-span-2 flex gap-md items-center">
                    <button
                        aria-label={`Complete ${
                            currExercise?.name ?? "Exercise"
                        } Set`}
                        data-testid="complete-set"
                        onClick={handleSetCompleted}
                    >
                        ☑️
                    </button>
                    <span data-testid="exercise">{currExercise?.name}</span>
                    <button
                        className="ml-auto"
                        aria-label={`Increase ${
                            currExercise?.name ?? "Exercise"
                        } Weight`}
                        data-testid="increase"
                        onClick={increaseWeight}
                    >
                        +
                    </button>
                    <span data-testid="weight">{currExercise?.weight}lbs</span>
                    <button
                        aria-label={`Decrease ${
                            currExercise?.name ?? "Exercise"
                        } Weight`}
                        data-testid="decrease"
                        onClick={decreaseWeight}
                    >
                        -
                    </button>
                </div>

                <Link
                    aria-label="Select Exercise"
                    to="/select"
                    className="btn p-lg"
                >
                    Select
                </Link>
                <button
                    className="p-md"
                    aria-label="Select Random Exercise"
                    data-testid="shuffle"
                    onClick={shuffleExercise}
                >
                    Shuffle
                </button>
            </header>

            <ul data-testid="exercise-history" className="mt-lg">
                {history.map((exercise) => (
                    <li
                        key={exercise.id as number}
                        data-testid="history-item"
                        className="bg-primary-500 text-black p-lg text-lg cursor-default first:rounded-t-lg last:rounded-b-lg flex justify-between hover:bg-primary-700 hover:text-black"
                    >
                        <span>{exercise.name}</span>
                        <span>
                            {exercise.set}x{exercise.weight}lbs
                        </span>
                    </li>
                ))}
            </ul>

            <Link className="btn my-sm" to="/history">
                See Full History
            </Link>
        </>
    );
}
