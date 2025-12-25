import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import "./AdminCourses.css";

function AdminCourses() {
    const { token } = useAuth();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage(null);
        setError(null);
        setLoading(true);

        try {
            const res = await fetch("http://localhost:8081/api/courses", {
                method: "POST",
                credentials: 'include',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, description }),
            });

            if (res.status === 401) {
                setError("Token invalide ou expiré. Veuillez vous reconnecter.");
                return;
            }

            if (res.status === 403) {
                setError("Accès refusé. Vous devez être administrateur pour créer un cours.");
                return;
            }

            if (!res.ok) {
                setError(`Erreur serveur (${res.status}). Veuillez réessayer.`);
                return;
            }

            const created = await res.json();
            setMessage(`✅ Cours "${created.title}" créé avec succès! (ID: ${created.id})`);
            setTitle("");
            setDescription("");

            // Clear success message after 5 seconds
            setTimeout(() => setMessage(null), 5000);
        } catch (e) {
            setError(`Erreur lors de la création: ${e.message}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="admin-courses-container">
            <form onSubmit={handleSubmit} className="course-form">
                <div className="form-group">
                    <label htmlFor="course-title" className="form-label">
                        <span className="label-icon">📝</span>
                        Titre du cours
                    </label>
                    <input
                        id="course-title"
                        type="text"
                        placeholder="Ex: Introduction à React"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        disabled={loading}
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="course-description" className="form-label">
                        <span className="label-icon">📄</span>
                        Description
                    </label>
                    <textarea
                        id="course-description"
                        placeholder="Décrivez le contenu et les objectifs du cours..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        disabled={loading}
                        className="form-textarea"
                        rows="4"
                    />
                </div>

                <button
                    type="submit"
                    className="submit-button secondary"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <div className="loading-spinner"></div>
                            Création en cours...
                        </>
                    ) : (
                        <>
                            <span>➕</span>
                            Ajouter le cours
                        </>
                    )}
                </button>
            </form>

            {/* Success Message */}
            {message && (
                <div className="alert alert-success fade-in">
                    <span className="alert-icon">✅</span>
                    <p>{message}</p>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="alert alert-error fade-in">
                    <span className="alert-icon">⚠️</span>
                    <p>{error}</p>
                    <button
                        className="alert-close"
                        onClick={() => setError(null)}
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Info Box */}
            <div className="info-box">
                <span className="info-icon">💡</span>
                <div className="info-content">
                    <h4>À savoir</h4>
                    <ul>
                        <li>Les cours créés seront immédiatement visibles pour tous les étudiants</li>
                        <li>Assurez-vous que le titre et la description sont clairs et précis</li>
                        <li>Vous pouvez rafraîchir la page pour voir le nouveau cours dans la liste</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default AdminCourses;

