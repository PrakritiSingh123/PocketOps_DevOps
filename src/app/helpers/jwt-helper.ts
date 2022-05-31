import jwt_decode from "jwt-decode";

export function decodeToken(token: string) {
    let decodedToken:{[key:string]: any} = {};
    if (token) {
        decodedToken = jwt_decode(token);
    }
    return decodedToken;
}