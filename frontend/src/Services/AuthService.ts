import axios from "axios";
import User from "../Models/User";
import appConfig from "../Config/AppConfig";
import { AuthActionType, authStore } from "../State/AuthState";

class AuthService {

    // async register(user: User): Promise<void> {
    //     const response = await axios.post<{token: string}>(appConfig.apiAddress + '/auth', user);
    //     const tokenResponse: {token: string} = response.data;
    //     authStore.dispatch({type: AuthActionType.Registration, payload: tokenResponse.token});
    // }

}

const authService: AuthService = new AuthService();
export default authService;