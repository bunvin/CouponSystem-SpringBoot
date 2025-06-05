import axios from "axios";
import Coupon from "../Models/Coupon";
import appConfig from "../Config/AppConfig";

 
class CompanyService {

    address = appConfig.apiAddress + '/company';

    public async getAllCompanyCoupons(): Promise<Coupon[]> {
        const response = await axios.get<Coupon[]>(this.address+'/coupons');
        return response.data;
    }

    public async getAllCompanyCouponsByCategory(category: string): Promise<Coupon[]> {
        const response = await axios.get<Coupon[]>(this.address+'/coupons/category/'+category);
        return response.data;
    }

    public async getAllCompanyCouponsUpToMaxPrice(maxprice: number): Promise<Coupon[]> {
        const response = await axios.get<Coupon[]>(this.address+'/coupons/'+maxprice);
        return response.data;
    }

    public async addCoupon(coupon: Coupon): Promise<Coupon> {
        const response = await axios.post<Coupon>(this.address + '/coupons', coupon);
        return response.data;
    } 

    public async getSingleCoupon(id: number): Promise<Coupon> {
        const response = await axios.get<Coupon>(this.address+'/coupons/'+id);
        return response.data;
    }

    public async updateCoupon(id: number, coupon: Coupon): Promise<void> {
        const response = await axios.post<Coupon>(this.address+'/coupons/'+id, coupon);
    }

    public async deleteCoupon(id: number): Promise<void> {
        const response = await axios.delete<void>(this.address+'/coupons/'+id);
    }

}

const companyService = new CompanyService();
export default companyService;