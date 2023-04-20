import { app } from "./app.module.css";
import { useAppModel } from "./appModel";
import Exercise from "../exercise/exercise";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

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
                            <h2>
                                <Link to="/">Home</Link>
                                <div>Select Exercise</div>
                            </h2>
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
