import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
    url: "http://localhost:8080",
    realm: "elearning-realm",
    clientId: "react-client",
});

// Enable cookie support for cross-origin requests
keycloak.enableLogging = true;

export default keycloak;
