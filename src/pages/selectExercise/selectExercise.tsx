import { Link } from "react-router-dom";
import {
    selectExercise,
    exerciseList,
    exerciseItem,
} from "./selectExercise.module.css";
import { Exercise, getAllAvailableExercies } from "../../utils/exerciseService";
import { useEffect, useState } from "react";

/* ===================== *\
    # Select Exercise
\* ===================== */

interface PropTypes {
    select: (exercise: Exercise) => void;
}

export default function SelectExercise(props: PropTypes): React.ReactElement {
    const { select } = props;

    const [available, setAvailable] = useState<Exercise[]>([]);
    useEffect(
        function () {
            (async function () {
                setAvailable(await getAllAvailableExercies());
            })();
        },
        [setAvailable]
    );

    return (
        <div className={selectExercise}>
            <h2>
                <Link to="/">Go Back</Link>
            </h2>
            <h2>Select Exercise</h2>

            <div className={exerciseList}>
                {available.map((exercise) => (
                    <button
                        key={exercise.name}
                        onClick={() => select(exercise)}
                        className={exerciseItem}
                    >
                        <h5>{exercise.name}</h5>
                        <h5>{exercise.weight}</h5>
                        {/* <div>{JSON.stringify(exercise)}</div> */}
                    </button>
                ))}
            </div>
        </div>
    );
}
