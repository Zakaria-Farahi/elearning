import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

function AvailableCourses() {
    const { token } = useAuth();
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchCourses() {
            try {
                const res = await fetch("http://localhost:8081/api/courses", {
                    headers: {
                        Authorization: `Bearer ${token}`, // ✅ envoi du JWT
                    },
                });

                if (res.status === 401) {
                    setError("401 – Token invalide ou expiré.");
                    return;
                }

                if (res.status === 403) {
                    setError("403 – Accès refusé (rôle insuffisant).");
                    return;
                }

                if (!res.ok) {
                    setError(`Erreur serveur : ${res.status}`);
                    return;
                }

                const data = await res.json();
                setCourses(data);
            } catch (e) {
                setError(e.message);
            }
        }

        if (token) {
            fetchCourses();
        }
    }, [token]);

    if (error) {
        return <p>Erreur lors du chargement des cours : {error}</p>;
    }

    if (!courses.length) {
        return <p>Aucun cours disponible.</p>;
    }

    return (
        <ul>
            {courses.map((c) => (
                <li key={c.id}>
                    <strong>{c.title}</strong> – {c.description}
                </li>
            ))}
        </ul>
    );
}

export default AvailableCourses;
