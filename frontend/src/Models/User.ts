import { ROLES } from "../Components/Constants";

interface User {
    email: string,
    password: string,
    userType: ROLES,
    id?: number,
    companyId?: number,
    userId?: number
}

export default User;