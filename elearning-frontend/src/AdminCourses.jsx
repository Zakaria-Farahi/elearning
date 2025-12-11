import React, { useState } from "react";
import { useAuth } from "./AuthContext";

function AdminCourses() {
    const { token } = useAuth();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage(null);
        setError(null);

        try {
            const res = await fetch("http://localhost:8081/api/courses", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`, // ✅ JWT envoyé
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, description }),
            });

            if (res.status === 401) {
                setError("401 – Token invalide ou expiré.");
                return;
            }

            if (res.status === 403) {
                setError("403 – Rôle insuffisant pour créer un cours.");
                return;
            }

            if (!res.ok) {
                setError(`Erreur serveur : ${res.status}`);
                return;
            }

            const created = await res.json();
            setMessage(`Cours créé (id=${created.id})`);
            setTitle("");
            setDescription("");
        } catch (e) {
            setError(e.message);
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <input
                    type="text"
                    placeholder="Titre du cours"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <button type="submit">Ajouter un cours</button>
            </form>

            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default AdminCourses;
