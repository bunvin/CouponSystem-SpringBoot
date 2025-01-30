package com.example.demo.AppModules.coupon;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Integer> {
    boolean existsByCouponTitleAndCompanyId(String couponName, int companyId);

    List<Coupon> findAllByCompanyId(int companyID);
}
