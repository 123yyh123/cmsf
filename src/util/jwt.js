import jwt_decode from "jwt-decode";


export const getUserRole = () => {
    const token = localStorage.getItem("token");
    if (token) {
        const decodedToken = jwt_decode(token);
        return decodedToken.role;
    }
    return null;
}

export const getUserName = () => {
    return localStorage.getItem("username") === null ? null : localStorage.getItem("username");
}

export const getUserId = () => {
    const token = localStorage.getItem("token");
    if (token) {
        const decodedToken = jwt_decode(token);
        return decodedToken.userId;
    }
    return null;
}