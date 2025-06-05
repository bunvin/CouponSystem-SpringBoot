export enum Type {
    ADMIN = "ADMIN",
    COMPANY = "COMPANY",
    CUSTOMER = "CUSTOMER"
}

interface User {
    email: string,
    password: string,
    userType: Type,
    id?: number,
    companyId?: number,
    userId?: number
}

export default User;