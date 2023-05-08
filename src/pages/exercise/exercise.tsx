import { Model, Actions } from "../app/useAppModel";
import { Link } from "react-router-dom";

/* ===================== *\
    # Exercise
\* ===================== */

interface PropTypes {
    model: Model;
    actions: Actions;
}

export default function Exercise(props: PropTypes): React.ReactElement {
    const { model, actions } = props;
    const { currExercise, exerciseHistory } = model;
    return (
        <>
            <header className="p-lg grid grid-cols-2 grid-row-2 gap-md">
                <div className="col-span-2 flex gap-md items-center">
                    <button
                        aria-label={`Complete ${
                            currExercise?.name ?? "Exercise"
                        } Set`}
                        data-testid="complete-set"
                        onClick={async () => await actions.completeSet()}
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
                        onClick={() => actions.increaseWeight()}
                    >
                        +
                    </button>
                    <span data-testid="weight">{currExercise?.weight}lbs</span>
                    <button
                        aria-label={`Decrease ${
                            currExercise?.name ?? "Exercise"
                        } Weight`}
                        data-testid="decrease"
                        onClick={() => actions.decreaseWeight()}
                    >
                        -
                    </button>
                </div>

                <Link aria-label="Select Exercise" to="/select" className="btn">
                    Select
                </Link>
                <button
                    aria-label="Select Random Exercise"
                    data-testid="shuffle"
                    onClick={async () => await actions.shuffleExercise()}
                >
                    Shuffle
                </button>
            </header>

            <div className="mx-lg">
                <ul data-testid="exercise-history">
                    {exerciseHistory.map((exercise, index) => (
                        <li
                            key={index}
                            className="bg-primary-500 px-lg py-sm text-gray-400 cursor-default first:rounded-t-lg last:rounded-b-lg flex justify-between hover:bg-primary-900 hover:text-white"
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
            </div>
        </>
    );
}
