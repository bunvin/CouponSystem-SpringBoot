import { CATEGORIES } from "../Components/Constants";
import Company from "./Company";

interface Coupon {
    id?: number;
    company: Company; 
    category: CATEGORIES;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    amount: number;
    price: number;
    image: string;
}

export default Coupon;