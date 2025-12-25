import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./AuthContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    // Temporarily disabled StrictMode to prevent Keycloak double initialization
    // <React.StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    // </React.StrictMode>
);
