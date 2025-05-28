package com.example.demo.AppModules.customerCoupon;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface CustomerCouponRepository extends JpaRepository<CustomerCoupon, Integer> {
    CustomerCoupon findByCustomerIdAndCouponId(int customerId, int couponId);
    boolean existsByCustomerIdAndCouponId(int customerId, int couponId);
    List<CustomerCoupon> findAllByCustomerId(int customerId);
    List<CustomerCoupon> findAllByCouponId(int couponId);
}
