import User from "./User"

interface Customer {
    firstName: string,
    lastName: string,
    user: User,
    id?: number
}

export default Customer;