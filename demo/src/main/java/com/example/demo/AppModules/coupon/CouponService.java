package com.example.demo.AppModules.coupon;

import com.example.demo.AppModules.customerCoupon.CustomerCoupon;
import com.example.demo.Error.AppException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public interface CouponService {
    Coupon addCoupon(Coupon coupon) throws AppException;
    void updateCoupon(Coupon coupon, int couponId) throws AppException;
    void deleteCoupon(int couponId) throws AppException;
    Coupon getSingleCoupon(int couponId) throws AppException;

    List<Coupon> getAllCoupons();
    List<Coupon> getAllCouponsByCompanyId(int companyId) throws AppException;
    List<Coupon> getAllCouponsByCompanyIdAndCategory(int companyId, Category category);
    List<Coupon> getAllCouponsByCustomerId(int customerId) throws AppException;
    List<Coupon> getAllCouponsByCustomerIdAndMaxPrice(int customerId, double maxPrice);
    List<Coupon> getAllCouponsByCategory(Category category) throws AppException;
    List<Coupon> getAllCouponsByCustomerIdAndCategory(int customerId, Category category) throws AppException;

    //CustomerCoupon
    CustomerCoupon addCouponPurchase(int customerId, int couponId) throws AppException;
    void deleteCouponPurchase(int customerId, int couponId) throws AppException;

    //delete all expired coupons
    void deleteAllExpiredCoupons();



}
