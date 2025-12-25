import React from "react";
import { useAuth } from "./AuthContext";
import AvailableCourses from "./AvailableCourses";
import AdminCourses from "./AdminCourses";
import "./App.css";

function App() {
    const { loading, authenticated, profile, roles, logout, hasRole } = useAuth();

    console.log("🎯 App render - loading:", loading, "authenticated:", authenticated);
    console.log("🎯 App render - profile:", profile);
    console.log("🎯 App render - roles:", roles);

    if (loading) {
        console.log("⏳ Showing loading screen");
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Chargement de l'authentification...</p>
            </div>
        );
    }

    if (!authenticated) {
        console.log("🔒 Showing unauthenticated screen");
        return (
            <div className="loading-container">
                <div className="auth-error">
                    <h2>🔒 Non authentifié</h2>
                    <p>Veuillez vous connecter pour accéder à la plateforme.</p>
                </div>
            </div>
        );
    }

    console.log("✅ User is authenticated, showing main app");

    const fullName = `${profile?.given_name || ""} ${profile?.family_name || ""}`.trim();
    const displayName = fullName || profile?.preferred_username || "Utilisateur";

    return (
        <div className="app-container">
            <header className="app-header">
                <div className="header-content">
                    <div className="header-left">
                        <div className="logo">
                            <span className="logo-icon">🎓</span>
                            <h1>E-Learning</h1>
                        </div>
                        <div className="user-info">
                            <p className="user-greeting">
                                Bienvenue, <strong>{displayName}</strong>
                            </p>
                            {profile?.email && (
                                <p className="user-email">{profile.email}</p>
                            )}
                            <div className="user-roles">
                                {roles.map((role) => (
                                    <span
                                        key={role}
                                        className={`badge ${role.includes('ADMIN') ? 'danger' : 'success'}`}
                                    >
                                        {role.replace('ROLE_', '')}
                                    </span>
                                ))}
                                {roles.length === 0 && (
                                    <span className="badge">Aucun rôle</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <button onClick={logout} className="logout-button">
                        <span>🚪</span>
                        Déconnexion
                    </button>
                </div>
            </header>

            <main className="main-content">
                <div className="content-grid">
                    {/* Section Cours disponibles */}
                    <section className="section-card">
                        <div className="section-header">
                            <h2>📚 Cours disponibles</h2>
                            <p className="section-description">
                                Explorez notre catalogue de cours
                            </p>
                        </div>
                        {hasRole("ROLE_STUDENT") || hasRole("ROLE_ADMIN") ? (
                            <AvailableCourses />
                        ) : (
                            <div className="access-denied">
                                <span className="icon">🔒</span>
                                <p>Vous n'avez pas les droits pour consulter les cours.</p>
                            </div>
                        )}
                    </section>

                    {/* Section Gestion des cours */}
                    <section className="section-card">
                        <div className="section-header">
                            <h2>⚙️ Gestion des cours</h2>
                            <p className="section-description">
                                Administration et création de cours
                            </p>
                        </div>
                        {hasRole("ROLE_ADMIN") ? (
                            <AdminCourses />
                        ) : (
                            <div className="access-denied">
                                <span className="icon">👨‍💼</span>
                                <p>Accès réservé aux administrateurs.</p>
                            </div>
                        )}
                    </section>
                </div>
            </main>

            <footer className="app-footer">
                <p>© 2025 E-Learning Platform • Powered by Spring Boot & React</p>
            </footer>
        </div>
    );
}

export default App;

