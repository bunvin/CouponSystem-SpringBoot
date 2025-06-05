import axios from "axios";
import User from "../Models/User";
import appConfig from "../Config/AppConfig";
import { AuthActionType, authStore } from "../State/AuthState";
import { jwtDecode } from "jwt-decode";

class AuthService {

    // async register(user: User): Promise<void> {
    //     const response = await axios.post<{token: string}>(appConfig.apiAddress + '/auth', user);
    //     const tokenResponse: {token: string} = response.data;
    //     authStore.dispatch({type: AuthActionType.Registration, payload: tokenResponse.token});
    // }

    async login(user: User): Promise<User> {
    const response = await axios.post<{token: string}>(appConfig.apiAddress + '/auth/login', user);
    const token = response.data.token;
    authStore.dispatch({type: AuthActionType.Login, payload: token});
    return jwtDecode(token);
    }

}

const authService: AuthService = new AuthService();
export default authService;