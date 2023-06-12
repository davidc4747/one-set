import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAppModel } from "./useAppModel";
import Exercise from "../exercise/exercise";
import SelectExercise from "../selectExercise/selectExercise";
import History from "../history/history";

/* ===================== *\
    # App
\* ===================== */

export default function App(): React.ReactElement {
    const { currExercise, history, ...actions } = useAppModel();
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Exercise
                            currExercise={currExercise}
                            history={history}
                            completeSet={actions.completeSet}
                            increaseWeight={actions.increaseWeight}
                            decreaseWeight={actions.decreaseWeight}
                            shuffleExercise={actions.shuffleExercise}
                        />
                    }
                />
                <Route
                    path="/select"
                    element={<SelectExercise select={actions.selectExercise} />}
                />
                <Route
                    path="/history"
                    element={
                        <History
                            history={history}
                            clearHistory={actions.clearHistory}
                        />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
