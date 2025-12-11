import React from "react";
import { useAuth } from "./AuthContext";
import AvailableCourses from "./AvailableCourses";
import AdminCourses from "./AdminCourses";

function App() {
    const { loading, authenticated, profile, roles, logout, hasRole } = useAuth();

    if (loading) {
        return <div>Chargement de l’authentification...</div>;
    }

    if (!authenticated) {
        return <div>Utilisateur non authentifié</div>;
    }

    const fullName = `${profile?.given_name || ""} ${profile?.family_name || ""}`.trim();

    return (
        <div style={{ fontFamily: "sans-serif", padding: "1rem" }}>
            <header
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1.5rem",
                }}
            >
                <div>
                    <h1>Plateforme E-Learning</h1>
                    <p>
                        Connecté en tant que <strong>{fullName || profile?.preferred_username}</strong>{" "}
                        ({profile?.email})
                    </p>
                    <p>
                        Rôles : <code>{roles.join(", ") || "Aucun rôle"}</code>
                    </p>
                </div>
                <button onClick={logout} style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
                    Logout
                </button>
            </header>

            <main style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                {/* Section Cours disponibles → STUDENT + ADMIN */}
                {hasRole("ROLE_STUDENT") || hasRole("ROLE_ADMIN") ? (
                    <section>
                        <h2>Cours disponibles</h2>
                        <AvailableCourses />
                    </section>
                ) : (
                    <section>
                        <h2>Cours disponibles</h2>
                        <p>Vous n’avez pas les droits pour consulter les cours.</p>
                    </section>
                )}

                {/* Section Gestion des cours → ADMIN uniquement */}
                <section>
                    <h2>Gestion des cours (ADMIN)</h2>
                    {hasRole("ROLE_ADMIN") ? (
                        <AdminCourses />
                    ) : (
                        <p>Accès réservé aux administrateurs.</p>
                    )}
                </section>
            </main>
        </div>
    );
}

export default App;
