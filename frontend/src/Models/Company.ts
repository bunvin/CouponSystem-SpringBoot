import User from "./User"

interface Company {
    name: string,
    user: User,
    id?: number
}

export default Company;