import { CATEGORIES } from '../Components/Constants';
import User from "./User";

interface Company {
    name: string,
    user: User,
    category: CATEGORIES,
    id?: number
}

export default Company;