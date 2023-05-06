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

            <ul className="text-center" data-testid="exercise-history">
                {exerciseHistory.map((exercise, index) => (
                    <li key={index}>
                        {exercise.name} {exercise.set}x{exercise.weight}lbs
                    </li>
                ))}
            </ul>
            <Link className="link block text-center" to="/history">
                See Full History
            </Link>
        </>
    );
}
