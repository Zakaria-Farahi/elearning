import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import keycloak from "./keycloak";

// Création du contexte d'authentification
const AuthContext = createContext(null);

// Provider qu'on va utiliser autour de <App />
export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [profile, setProfile] = useState(null); // données /userinfo (Keycloak)
    const [roles, setRoles] = useState([]);       // rôles venant de /api/me (backend)
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        let refreshInterval;

        // Initialisation de Keycloak au démarrage de l'app
        keycloak
            .init({
                onLoad: "login-required", // si pas connecté → redirection Keycloak
                checkLoginIframe: false,
            })
            .then(async (auth) => {
                if (!auth) {
                    setAuthenticated(false);
                    setLoading(false);
                    return;
                }

                setAuthenticated(true);
                setToken(keycloak.token);

                // 1) Récupérer les infos utilisateur depuis Keycloak (/userinfo)
                try {
                    const userinfoUrl = `${keycloak.authServerUrl}realms/${keycloak.realm}/protocol/openid-connect/userinfo`;

                    const userinfoRes = await fetch(userinfoUrl, {
                        headers: {
                            Authorization: `Bearer ${keycloak.token}`,
                        },
                    });

                    if (userinfoRes.ok) {
                        const userinfo = await userinfoRes.json();
                        setProfile(userinfo);
                    } else {
                        console.error("Erreur /userinfo :", userinfoRes.status);
                    }
                } catch (err) {
                    console.error("Erreur lors de l'appel à /userinfo :", err);
                }

                // 2) Récupérer les rôles depuis le backend Spring (/api/me)
                try {
                    const meRes = await fetch("http://localhost:8081/api/me", {
                        headers: {
                            Authorization: `Bearer ${keycloak.token}`,
                        },
                    });

                    if (meRes.ok) {
                        const me = await meRes.json();
                        const realmRoles = me.realm_access?.roles || [];
                        setRoles(realmRoles);
                    } else {
                        console.error("Erreur /api/me :", meRes.status);
                        setRoles([]);
                    }
                } catch (err) {
                    console.error("Erreur lors de l'appel à /api/me :", err);
                    setRoles([]);
                }

                // 3) Mise en place du refresh automatique du token
                refreshInterval = setInterval(() => {
                    keycloak
                        .updateToken(60) // refresh si token expire dans < 60s
                        .then((refreshed) => {
                            if (refreshed) {
                                setToken(keycloak.token);
                            }
                        })
                        .catch(() => {
                            console.warn("Impossible de refresh le token, logout...");
                            keycloak.logout({
                                redirectUri: window.location.origin,
                            });
                        });
                }, 30000); // vérifie toutes les 30 secondes

                setLoading(false);
            })
            .catch((err) => {
                console.error("Erreur d'initialisation Keycloak :", err);
                setLoading(false);
            });

        // Nettoyage de l’intervalle quand le component est démonté
        return () => {
            if (refreshInterval) {
                clearInterval(refreshInterval);
            }
        };
    }, []);

    // Fonction de logout exposée au reste de l’app
    const logout = () => {
        keycloak.logout({
            redirectUri: window.location.origin,
        });
    };

    // Helper pour tester les rôles facilement dans les composants
    const hasRole = (role) => roles.includes(role);

    const value = {
        keycloak,
        token,
        profile,
        roles,
        loading,
        authenticated,
        logout,
        hasRole,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook custom pour utiliser le contexte plus facilement
export function useAuth() {
    return useContext(AuthContext);
}
