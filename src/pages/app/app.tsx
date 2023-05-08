import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useAppModel } from "./useAppModel";
import Exercise from "../exercise/exercise";
import SelectExercise from "../selectExercise/selectExercise";
import History from "../history/history";

/* ===================== *\
    # App
\* ===================== */

export default function App(): React.ReactElement {
    const { model, actions } = useAppModel();
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Exercise model={model} actions={actions} />}
                />
                <Route
                    path="/select"
                    element={<SelectExercise select={actions.selectExercise} />}
                />
                <Route
                    path="/history"
                    element={
                        <History
                            history={model.exerciseHistory}
                            clearHistory={actions.clearHistory}
                        />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
