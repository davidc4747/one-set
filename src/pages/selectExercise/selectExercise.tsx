import { Link } from "react-router-dom";
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
        <main className="flex flex-col gap-lg text-center2">
            <Link to="/">Cancel</Link>
            <h1>Available Exercises</h1>

            <div className="grid grid-cols-3 gap-lg">
                {available.map((exercise) => (
                    <Link
                        to="/"
                        key={exercise.name}
                        onClick={() => select(exercise)}
                        className="bg-primary-500 text-gray-200 text-center shadow p-lg rounded hover:bg-primary-900 hover:text-white hover:scale-105"
                    >
                        <h5 className="text-lg">{exercise.name}</h5>
                        <h5 className="text-md mt-lg">{exercise.weight}lbs</h5>
                    </Link>
                ))}
            </div>
        </main>
    );
}
