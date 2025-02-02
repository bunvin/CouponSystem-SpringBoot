package com.example.demo.Facade;

import com.example.demo.AppModules.company.Company;
import com.example.demo.AppModules.company.CompanyServiceImp;
import com.example.demo.AppModules.coupon.Category;
import com.example.demo.AppModules.coupon.Coupon;
import com.example.demo.AppModules.coupon.CouponServiceImp;
import com.example.demo.AppModules.user.User;
import com.example.demo.Error.AppException;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompanyFacade extends ClientFacade{

    private User userLogin;
    private Company company;

//    @PostConstruct
//    public void initCompany() throws AppException {
//        if(this.userLogin != null){
//            this.company = getCompanyServiceImp().getCompanyByUserId(userLogin.getId());
//            System.out.println("CompanyFacade constractor: " +company);
//        }
//    }
    public void setUserLoginAndCompany(User userLogin) throws AppException {
        this.userLogin = userLogin;
        this.company = getCompanyServiceImp().getCompanyByUserId(userLogin.getId());
    }

    public Coupon addCoupon(Coupon coupon) throws AppException{
        return getCouponServiceImp().addCoupon(coupon);
    }

    public void updateCoupon(Coupon coupon, int couponId) throws AppException {
        getCouponServiceImp().updateCoupon(coupon,couponId);
    }

    public void deleteCoupon(int couponId) throws AppException{
        getCouponServiceImp().deleteCoupon(couponId);
    }

    public Company getSingleCompany(int id) throws AppException {
        return this.getCompanyServiceImp().getSingleCompany(id);
    }

    public Coupon getSingleCoupon(int id) throws AppException {
        return getCouponServiceImp().getSingleCoupon(id);
    }
    public List<Coupon> getAllCompanyCoupons() throws AppException {
        return getCouponServiceImp().getAllCouponsByCompanyId(company.getId());
    }

    public List<Coupon> getAllCompanyCouponsByCategory(Category category){
        return getCouponServiceImp().getAllCouponsByCompanyIdAndCategory(company.getId(), category);
    }

    public List<Coupon> getAllCompanyCouponsUpToMaxPrice(double maxPrice) throws AppException {
        List<Coupon> coupons = this.getAllCompanyCoupons();
        return coupons.stream().filter(coupon -> coupon.getPrice() <=maxPrice)
                .toList();
    }

    public User getUserLogin() {
        return userLogin;
    }

    public void setUserLogin(User userLogin) {
        this.userLogin = userLogin;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public void getCompanyDetails() throws AppException {
        System.out.println("##### Company Details #####");
        System.out.println("CompanyId: "+company.getId());
        System.out.println("Company Name: "+ company.getName());
        System.out.println("Company Email: "+ company.getCompanyUser().getEmail());
        System.out.println("Company coupons: ");
        List<Coupon> coupons = this.getAllCompanyCoupons();
        for(Coupon coupon:coupons){
            System.out.println(coupon);
        }
        System.out.println("##########");
    }


}
