import { createStore } from "redux";
import User from "../Models/User";
import { jwtDecode } from "jwt-decode";

export class AuthState {
    token: string | null = null;
    user: User | null = null;
    
    constructor() {
        const token: string | null = localStorage.getItem("token");
        if (token) {
            this.user = jwtDecode(token);
            this.token = token;
        }
        const userJson: string | null = localStorage.getItem("user");
        if (userJson) {
            this.user = JSON.parse(userJson);
        }
    }
}

export enum AuthActionType {
    //Registration = "Registration",
    Login = "Login",
    Logout = "Logout"
}

export interface AuthAction {
    type: AuthActionType,
    payload: any,
}

export function reducer(authState: AuthState = new AuthState(), action: AuthAction): AuthState {

    const newState: AuthState = { ...authState };

    switch (action.type) {
        //case AuthActionType.Registration:
        case AuthActionType.Login:
            if (typeof action.payload === 'string') {
                //JWT token
                localStorage.setItem("token", action.payload);
                newState.token = action.payload;
                newState.user = jwtDecode(action.payload);
                localStorage.setItem("user", JSON.stringify(newState.user));
            } 
            break;

        case AuthActionType.Logout:
            newState.token = null;
            newState.user = null;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            break;
    }

    return newState;
}

export const authStore = createStore(reducer);