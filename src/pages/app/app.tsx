import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { app } from "./app.module.css";
import { useAppModel } from "./appModel";
import Exercise from "../exercise/exercise";
import SelectExercise from "../selectExercise/selectExercise";

/* ===================== *\
    # App
\* ===================== */

export default function App(): React.ReactElement {
    const { model, actions } = useAppModel();
    return (
        <div className={app}>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={<Exercise model={model} actions={actions} />}
                    />
                    <Route
                        path="/select"
                        element={
                            <SelectExercise select={actions.selectExercise} />
                        }
                    />
                    <Route
                        path="/history"
                        element={
                            <h2>
                                <Link to="/">Home</Link>
                                <div>History</div>
                            </h2>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </div>
    );
}
