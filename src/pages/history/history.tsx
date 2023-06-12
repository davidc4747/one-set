import { useState, useEffect } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { Exercise } from "../../utils/exerciseService";
import { getHistoryByDate, clearHistory } from "../../utils/historyService";

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

    async function handleClear() {
        await clearHistory();
        setHistory([]);
    }

    return (
        <main className="flex flex-col gap-lg">
            <Link className="btn self-start" to="/">
                Go Home
            </Link>

            {/* Not Found Message */}
            {history.length === 0 && (
                <ul data-testid="history-not-found">
                    <li className="bg-primary-500 text-gray-400 px-lg py-sm cursor-default rounded-lg">
                        No Exercises Found :(
                    </li>
                </ul>
            )}

            {/* Display hsitory items */}
            {history.map(([date, exerciseList]) => (
                <div key={date}>
                    <h1 className="mt-md mb-sm">
                        {moment(date).calendar(dateFormat)}
                    </h1>
                    <ul data-testid="history-group">
                        {exerciseList.map((exercise, index) => (
                            <li
                                key={index}
                                data-testid="history-item"
                                className="bg-primary-500 text-gray-400 p-lg text-lg cursor-default first:rounded-t-lg last:rounded-b-lg flex justify-between hover:bg-primary-900 hover:text-white"
                            >
                                <span>{exercise.name}</span>
                                <span>
                                    {exercise.set}x{exercise.weight}lbs
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}

            <button onClick={handleClear}>Clear History</button>
        </main>
    );
}
