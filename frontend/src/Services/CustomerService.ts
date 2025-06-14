import axios from "axios";
import Coupon from "../Models/Coupon";
import appConfig from "../Config/AppConfig";
import { AuthState } from "../State/AuthState"; // Adjust the import path as needed
import { jwtDecode } from "jwt-decode";

 
class CustomerService {

    address = appConfig.apiAddress + '/customer';

    private getCustomerIdFromToken(): number {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found in localStorage");
            throw new Error("No authentication token found. Please log in.");
        }
        
        try {
            const decodedToken: any = jwtDecode(token);
            console.log("Decoded token:", decodedToken); // Debug log
            
            const customerId = decodedToken.customerId;
            console.log("Customer ID from token:", customerId); // Debug log
            
            if (!customerId) {
                console.error("Customer ID is missing from token:", decodedToken);
                throw new Error("Customer ID not found in token. Please log in again.");
            }
            
            return customerId;
        } catch (error) {
            console.error("Error decoding token:", error);
            throw new Error("Invalid token. Please log in again.");
        }
    }

    private getCustomerIdFromToken_old(): number {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No authentication token found. Please log in.");
        }
        
        try {
            const decodedToken: any = jwtDecode(token);
            const customerId = decodedToken.customerId;
            
            if (!customerId) {
                throw new Error("Customer ID not found in token. Please log in again.");
            }
            
            return customerId;
        } catch (error) {
            throw new Error("Invalid token. Please log in again.");
        }
    }

    public async getAllCoupons(): Promise<Coupon[]> {
        const response = await axios.get<Coupon[]>(this.address+'/coupons');
        return response.data;
    }

    public async getAllCustomerCoupons(id: number): Promise<Coupon[]> {
        const response = await axios.get<Coupon[]>(this.address+'/coupons/'+id);
        return response.data;
    }

    public async getAllCustomerCouponsByCategory(category: string): Promise<Coupon[]> {
        const response = await axios.get<Coupon[]>(this.address+'/coupons/category/'+category);
        return response.data;
    }

    public async getAllCustomerCouponsUpToMaxPrice(maxprice: number): Promise<Coupon[]> {
        const response = await axios.get<Coupon[]>(this.address+'/coupons/max-price/'+maxprice);
        return response.data;
    }

    public async addCouponPurchase(couponId: number): Promise<Coupon> {
        const customerId = this.getCustomerIdFromToken();
        const response = await axios.post<Coupon>(this.address + '/coupons/'+couponId+'/customer/'+customerId);
        return response.data;
    } 

    public async deleteCouponPurchase(couponId: number): Promise<void> {
        const customerId = this.getCustomerIdFromToken();
        await axios.delete(this.address + '/coupons/' + couponId + '/customer/' + customerId);
    } 


}

const customerService = new CustomerService();
export default customerService;