import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import "./AvailableCourses.css";

function AvailableCourses() {
    const { token } = useAuth();
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCourses() {
            setLoading(true);
            setError(null);

            try {
                const res = await fetch("http://localhost:8081/api/courses", {
                    credentials: 'include',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (res.status === 401) {
                    setError("Token invalide ou expiré. Veuillez vous reconnecter.");
                    return;
                }

                if (res.status === 403) {
                    setError("Accès refusé. Vous n'avez pas les permissions nécessaires.");
                    return;
                }

                if (!res.ok) {
                    setError(`Erreur serveur (${res.status}). Veuillez réessayer.`);
                    return;
                }

                const data = await res.json();
                setCourses(data);
            } catch (e) {
                setError(`Impossible de charger les cours: ${e.message}`);
            } finally {
                setLoading(false);
            }
        }

        if (token) {
            fetchCourses();
        }
    }, [token]);

    if (loading) {
        return (
            <div className="courses-loading">
                <div className="loading-spinner"></div>
                <p>Chargement des cours...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="courses-error">
                <span className="error-icon">⚠️</span>
                <p>{error}</p>
            </div>
        );
    }

    if (!courses.length) {
        return (
            <div className="courses-empty">
                <span className="empty-icon">📭</span>
                <p>Aucun cours disponible pour le moment.</p>
            </div>
        );
    }

    return (
        <div className="courses-container">
            <div className="courses-stats">
                <span className="stat-badge">
                    <strong>{courses.length}</strong> cours disponible{courses.length > 1 ? 's' : ''}
                </span>
            </div>
            <ul className="courses-list">
                {courses.map((course) => (
                    <li key={course.id} className="course-item fade-in">
                        <div className="course-header">
                            <span className="course-icon">📖</span>
                            <h3 className="course-title">{course.title}</h3>
                        </div>
                        <p className="course-description">{course.description}</p>
                        <div className="course-footer">
                            <span className="course-id">ID: {course.id}</span>
                            <button className="course-action outline">
                                <span>👁️</span>
                                Voir détails
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AvailableCourses;

