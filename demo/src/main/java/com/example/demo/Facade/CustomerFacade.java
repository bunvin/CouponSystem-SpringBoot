package com.example.demo.Facade;

import com.example.demo.AppModules.coupon.Category;
import com.example.demo.AppModules.coupon.Coupon;
import com.example.demo.AppModules.coupon.CouponServiceImp;
import com.example.demo.AppModules.customer.Customer;
import com.example.demo.AppModules.customer.CustomerServiceImp;
import com.example.demo.AppModules.customerCoupon.CustomerCoupon;
import com.example.demo.AppModules.user.User;
import com.example.demo.Error.AppException;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerFacade extends ClientFacade{

    private User userLogin;
    private Customer customer;

    public CustomerFacade() throws AppException {super();
    }

    @PostConstruct
    public void initCustomer(){
        if(this.userLogin != null){
            this.customer = getCustomerServiceImp().getCustomerByUserId(userLogin.getId());
        }
    }

    public User getUserLogin() {
        return userLogin;
    }

    public void setUserLogin(User userLogin) {
        this.userLogin = userLogin;
    }

    public CustomerCoupon addCouponPurchases(int couponId) throws AppException {
        return getCouponServiceImp().addCouponPurchase(customer.getId(), couponId);
    }

    public List<Coupon> getAllCustomerCoupons() throws AppException {
        return getCouponServiceImp().getAllCouponsByCustomerId(customer.getId());
    }

    public List<Coupon> getAllCustomerCouponsByCategory(Category category) throws AppException {
        return getCouponServiceImp().getAllCouponsByCustomerIdAndCategory(customer.getId(), category);
    }

    public List<Coupon> getAllCustomerCouponsByMaxPrice(double maxPrice){
        return getCouponServiceImp().getAllCouponsByCustomerIdAndMaxPrice(customer.getId(), maxPrice);
    }

    public void getCustomerDerails() throws AppException {
        System.out.println("#############");
        System.out.println("CustomerId: "+customer.getId());
        System.out.println("First Name: "+ customer.getFirstName());
        System.out.println("Last Name: "+customer.getLastName());
        System.out.println("Customer Email: "+customer.getUserEmail());
        System.out.println("Purchase coupons: ");
        for(Coupon coupon : this.getAllCustomerCoupons()){
            System.out.println(coupon);
        }
        System.out.println("#############");
    }

}
