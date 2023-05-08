import { Link } from "react-router-dom";
import { Exercise } from "../../utils/exerciseService";

/* ===================== *\
    # History
\* ===================== */

interface PropTypes {
    history: Exercise[];
    clearHistory: () => Promise<void>;
}

export default function History(props: PropTypes): React.ReactElement {
    const { history, clearHistory } = props;

    return (
        <main className="flex flex-col gap-lg">
            <Link to="/">Home</Link>
            <h1>History</h1>

            <ul data-testid="full-history">
                {history.length === 0 && (
                    <li className="bg-primary-500 text-gray-400 px-lg py-sm cursor-default rounded-lg">
                        No Exercises Found :(
                    </li>
                )}
                {history.map((exercise, index) => (
                    <li
                        key={index}
                        className="bg-primary-500 text-gray-400 px-lg py-sm  cursor-default first:rounded-t-lg last:rounded-b-lg flex justify-between hover:bg-primary-900 hover:text-white"
                    >
                        <button
                            className="bg-white border-2 border-red"
                            onClick={() =>
                                console.log(exercise.datetime.toJSON())
                            }
                        ></button>
                        <span>
                            ({exercise.datetime.toDateString()}) {exercise.name}
                        </span>
                        <span>
                            {exercise.set}x{exercise.weight}lbs
                        </span>
                    </li>
                ))}
            </ul>

            {/* <button onClick={clearHistory}>Clear History</button> */}
        </main>
    );
}
