package com.example.demo.AppModules.coupon;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Integer> {
    boolean existsByTitleAndCompanyId(String couponName, int companyId);
    List<Coupon> findAllByCompanyId(int companyID);
    List<Coupon> findAllByCategory(Category category);
    List<Coupon> findAllByCompanyIdAndCategory(int companyId, Category category);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM coupon WHERE end_date < CURRENT_DATE", nativeQuery = true)
    void deleteExpiredCoupons();

    @Modifying
    @Query("DELETE FROM CustomerCoupon cc WHERE cc.coupon.endDate < CURRENT_DATE")
    void deleteExpiredCouponsCustomerCoupons();


//    void deleteByEndDateBeforeAndEndDateIsNotNull(LocalDate now);
}
