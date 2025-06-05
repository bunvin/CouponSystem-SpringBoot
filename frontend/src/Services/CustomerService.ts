import axios from "axios";
import Coupon from "../Models/Coupon";
import appConfig from "../Config/AppConfig";

 
class CompanyService {

    address = appConfig.apiAddress + '/customer';

    public async getAllCustomerCoupons(): Promise<Coupon[]> {
        const response = await axios.get<Coupon[]>(this.address+'/coupons');
        return response.data;
    }

    public async getAllCustomerCouponsByCategory(category: string): Promise<Coupon[]> {
        const response = await axios.get<Coupon[]>(this.address+'/coupons/category/'+category);
        return response.data;
    }

    public async getAllCustomerCouponsUpToMaxPrice(maxprice: number): Promise<Coupon[]> {
        const response = await axios.get<Coupon[]>(this.address+'/coupons/'+maxprice);
        return response.data;
    }

    public async addCouponPurchase(couponId: number): Promise<Coupon> {
        const response = await axios.post<Coupon>(this.address + '/coupons/', couponId);
        return response.data;
    } 


}

const companyService = new CompanyService();
export default companyService;