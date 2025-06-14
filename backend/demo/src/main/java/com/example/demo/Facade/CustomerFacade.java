package com.example.demo.Facade;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.AppModules.coupon.Category;
import com.example.demo.AppModules.coupon.Coupon;
import com.example.demo.AppModules.customer.Customer;
import com.example.demo.AppModules.user.User;
import com.example.demo.Error.AppException;

import jakarta.annotation.PostConstruct;

@Service
public class CustomerFacade extends ClientFacade{

    private User userLogin;
    private Customer customer;

    public CustomerFacade() throws AppException {super();
    }

   @PostConstruct
   public void initCustomer() throws AppException{
       if(this.userLogin != null){
           this.customer = getCustomerServiceImp().getCustomerByUserId(userLogin.getId());
       }
   }

    public void setUserLoginAndCustomer(User userLogin) throws AppException {
        this.userLogin = userLogin;
        this.customer = getCustomerServiceImp().getCustomerByUserId(userLogin.getId());
    }

    public User getUserLogin() {
        return userLogin;
    }

    public void setUserLogin(User userLogin) {
        this.userLogin = userLogin;
    }



    public void addCouponPurchases(int couponId, int customerId) throws AppException {
        getCouponServiceImp().addCouponPurchase(couponId, customerId);
    }

    public void deleteCouponPurchases(int customerId ,int couponId) throws AppException {
        getCouponServiceImp().deleteCouponPurchase(customerId, couponId);
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

    public List<Coupon> getAllCoupons(){
        return getCouponServiceImp().getAllCoupons();
    }

    public void getCustomerDerails() throws AppException {
        System.out.println("#############");
        System.out.println("CustomerId: "+customer.getId());
        System.out.println("First Name: "+ customer.getFirstName());
        System.out.println("Last Name: "+customer.getLastName());
        System.out.println("Customer Email: "+customer.getUser().getEmail());
        System.out.println("Purchase coupons: ");
        for(Coupon coupon : this.getAllCustomerCoupons()){
            System.out.println(coupon);
        }
        System.out.println("#############");
    }

}
