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
        <main className="flex flex-col gap-xl p-lg max-w-lg mx-auto text-center">
            <Link to="/">Cancel</Link>
            <h2 className="font-bold">Available Exercises</h2>

            <div className="flex flex-wrap justify-center gap-lg">
                {available.map((exercise) => (
                    <Link
                        to="/"
                        key={exercise.name}
                        onClick={() => select(exercise)}
                        className="btn p-lg w-[calc(33%-1rem)] hover:scale-105"
                    >
                        <h5 className="text-lg">{exercise.name}</h5>
                        <h5 className="text-md mt-md">{exercise.weight}lbs</h5>
                    </Link>
                ))}
            </div>
        </main>
    );
}
