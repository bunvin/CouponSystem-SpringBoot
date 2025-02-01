package com.example.demo.Facade;

import com.example.demo.AppModules.company.Company;
import com.example.demo.AppModules.company.CompanyServiceImp;
import com.example.demo.AppModules.coupon.Category;
import com.example.demo.AppModules.coupon.Coupon;
import com.example.demo.AppModules.coupon.CouponServiceImp;
import com.example.demo.AppModules.user.User;
import com.example.demo.Error.AppException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompanyFacade extends ClientFacade{
    @Autowired
    private CouponServiceImp couponServiceImp;
    @Autowired
    private CompanyServiceImp companyServiceImp;

    private User userLogin;
    private final Company company;

    public CompanyFacade(User user) throws AppException {super();
        this.userLogin = user;
        this.company = this.companyServiceImp.getCompanyByUserId(userLogin.getId());
    }

    public User getUserLogin() {
        return userLogin;
    }

    public void setUserLogin(User userLogin) {
        this.userLogin = userLogin;
    }

    public Coupon addCoupon(Coupon coupon) throws AppException{
        return this.couponServiceImp.addCoupon(coupon);
    }

    public void updateCoupon(Coupon coupon, int couponId) throws AppException {
        this.couponServiceImp.updateCoupon(coupon,couponId);
    }

    public void deleteCoupon(int couponId) throws AppException{
        this.couponServiceImp.deleteCoupon(couponId);
    }

    public List<Coupon> getAllCompanyCoupons() throws AppException {
        return this.couponServiceImp.getAllCouponsByCompanyId(company.getId());
    }

    public List<Coupon> getAllCompanyCouponsByCategory(Category category){
        return this.couponServiceImp.getAllCouponsByCompanyIdAndCategory(company.getId(), category);
    }

    public List<Coupon> getAllCompanyCouponsUpToMaxPrice(double maxPrice) throws AppException {
        List<Coupon> coupons = this.getAllCompanyCoupons();
        return coupons.stream().filter(coupon -> coupon.getPrice() <=maxPrice)
                .toList();
    }

    public void getCompanyDetails() throws AppException {
        System.out.println("##### Company Details #####");
        System.out.println("CompanyId: "+company.getId());
        System.out.println("Company Name: "+ company.getName());
        System.out.println("Company Email: "+ company.getUserEmail());
        System.out.println("Company coupons: ");
        List<Coupon> coupons = this.getAllCompanyCoupons();
        for(Coupon coupon:coupons){
            System.out.println(coupon);
        }
        System.out.println("##########");
    }


}
