import {
    exerciseHeader,
    currentExercise,
    right,
    historyList,
    historyItem,
    viewfullhistory,
} from "./exercise.module.css";
import { Model, Actions } from "../app/appModel";
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
            <header className={exerciseHeader}>
                <div className={currentExercise}>
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
                        className={right}
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

                <Link aria-label="Select Exercise" to="/select">
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

            <ul className={historyList} data-testid="exercise-history">
                {exerciseHistory.map((exercise, index) => (
                    <li key={index} className={historyItem}>
                        {exercise.name} {exercise.set}x{exercise.weight}lbs
                    </li>
                ))}
            </ul>
            <Link className={viewfullhistory} to="/history">
                See Full History
            </Link>
        </>
    );
}
