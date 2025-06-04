import axios from "axios";
import User from "../Models/User";
import appConfig from "../Config/AppConfig";
import authService from "./AuthService";
import { AuthActionType, authStore } from "../State/AuthState";
import { jwtDecode } from "jwt-decode";

class UserService {

    // async addUser(user: User): Promise<User[]> {
    //     const response = await axios.post<User[]>(appConfig.apiAddress + '/user', user);
    //     authStore.dispatch({type: AuthActionType.Registration, payload: response.data});
    //     return response.data;
    // }

    async login(user: User): Promise<User> {
        const response = await axios.post<{token: string}>(appConfig.apiAddress + '/auth/login', user);
        const token = response.data.token;
        authStore.dispatch({type: AuthActionType.Login, payload: token});
        return jwtDecode(token);
    }

    // async getUserList(): Promise<User[]> {
    //     const response = await axios.get<User[]>(appConfig.apiAddress + '/user');
    //     return response.data;
    // }


    // getUserById(userList: User[], id: number): User {
    //     return userList.filter(user => user.id == id)[0];
    // }

}

const userService = new UserService();
export default userService;