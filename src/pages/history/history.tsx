import { useState, useEffect } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { Exercise, removeExercise } from "../../utils/exerciseService";
import { getHistoryByDate } from "../../utils/historyService";

/* ===================== *\
    # History
\* ===================== */

export default function History(): React.ReactElement {
    const dateFormat = {
        sameDay: "[Today]",
        lastDay: "[Yesterday]",
        lastWeek: "dddd",
        sameElse: function (this: moment.Moment) {
            if (this.isSame(Date.now(), "year")) {
                return "MMM D";
            } else {
                return "MMM D YYYY";
            }
        },
    };

    // Get the history Data from the DB
    const [history, setHistory] = useState<
        [date: string, exList: Exercise[]][]
    >([]);
    useEffect(function () {
        (async function init() {
            const historyGroups = await getHistoryByDate();
            setHistory(Array.from(historyGroups));
        })();
    }, []);

    async function handleRemove(exercise: Exercise) {
        await removeExercise(exercise);
        const historyGroups = await getHistoryByDate();
        setHistory(Array.from(historyGroups));
    }

    return (
        <main className="flex flex-col gap-lg">
            <Link className="btn self-start" to="/">
                Go Home
            </Link>

            {/* Not Found Message */}
            {history.length === 0 && (
                <ul data-testid="history-not-found">
                    <li className="bg-primary-500 text-black px-lg py-sm cursor-default rounded-lg">
                        No Exercises Found :(
                    </li>
                </ul>
            )}

            {/* Display hsitory items */}
            {history.map(([date, exerciseList]) => (
                <div key={date}>
                    <h1 className="mt-md mb-sm text-white">
                        {moment(date).calendar(dateFormat)}
                    </h1>
                    <ul data-testid="history-group">
                        {exerciseList.map((exercise, index) => (
                            <li
                                key={index}
                                data-testid="history-item"
                                className="flex gap-md items-center bg-primary-500 text-black p-lg text-lg cursor-default first:rounded-t-lg last:rounded-b-lg hover:bg-primary-700"
                            >
                                <span className="mr-auto">{exercise.name}</span>
                                <span>
                                    {exercise.set}x{exercise.weight}lbs
                                </span>
                                <button
                                    aria-label="Delete from history"
                                    data-testid="remove"
                                    onClick={() => handleRemove(exercise)}
                                >
                                    ❌
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </main>
    );
}
