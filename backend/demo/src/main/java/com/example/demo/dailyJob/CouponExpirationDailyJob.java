package com.example.demo.dailyJob;

import com.example.demo.AppModules.coupon.CouponServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class CouponExpirationDailyJob {
    @Autowired
    CouponServiceImp couponServiceImp;

    @Scheduled(cron = "0 20 00 * * ?")
    public void dailyJob(){
        couponServiceImp.deleteAllExpiredCoupons();
        System.out.println("FINISHED: all coupons are up to date");
    }
}
