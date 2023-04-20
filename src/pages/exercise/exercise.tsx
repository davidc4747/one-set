import {
    exerciseHeader,
    currentExercise,
    right,
    historyList,
    historyItem,
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
                    <button onClick={() => actions.completeSet()}>☑️</button>
                    <div>{currExercise?.name}</div>
                    <button
                        className={right}
                        onClick={() => actions.increaseWeight()}
                    >
                        +
                    </button>
                    {currExercise?.weight}x{currExercise?.sets}
                    <button onClick={() => actions.decreaseWeight()}>-</button>
                </div>
                <button>
                    <Link to="/select">Select</Link>
                </button>
                <button onClick={() => actions.shuffleExercise()}>
                    Shuffle
                </button>
            </header>

            <ul className={historyList}>
                {exerciseHistory.map((exercise, index) => (
                    <li key={index} className={historyItem}>
                        {exercise.name} {exercise.weight}x{exercise.sets}
                    </li>
                ))}

                <li>
                    <Link to="/history">See Full Hisotry</Link>
                </li>
            </ul>
        </>
    );
}
