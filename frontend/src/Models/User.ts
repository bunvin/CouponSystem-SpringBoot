import { ROLES } from "../Components/Constants";

interface User {
    email: string,
    password: string,
    userType: ROLES,
    id?: number,
    companyId?: number,
    companyName?: string,
    userId?: number
    customerId?: number,
    
}

export default User;