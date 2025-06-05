import Company from './Company';

export enum Category {
    FOOD = "FOOD",
    ELECTRICITY = "ELECTRICITY", 
    RESTAURANT = "RESTAURANT",
    VACATION = "VACATION"
}

interface Coupon {
    id?: number;
    company: Company;
    category: Category;
    title: string;
    description: string;
    startDate: string;  
    endDate: string; 
    amount: number;
    price: number;
    image?: string;
}

export default Coupon;