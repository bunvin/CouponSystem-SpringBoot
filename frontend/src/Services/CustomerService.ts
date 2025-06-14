import axios from "axios";
import Coupon from "../Models/Coupon";
import appConfig from "../Config/AppConfig";

 
class CustomerService {

    address = appConfig.apiAddress + '/customer';

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
        const response = await axios.post<Coupon>(this.address + '/coupons/', couponId);
        return response.data;
    } 


}

const customerService = new CustomerService();
export default customerService;