import * as ReactDOM from "react-dom/client";
import App from "./pages/app/app";

const elem = document.querySelector("#root");
if (elem) {
    const root = ReactDOM.createRoot(elem);
    root.render(<App />);
}
