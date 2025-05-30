package com.example.demo.AppModules.coupon;

import com.example.demo.Error.ErrorMessage;

public enum CouponError implements ErrorMessage {
    COUPON_NOT_FOUND(3001, "Coupon not found"),
    COUPON_ALREADY_EXIST(3002, "Coupon already exist"),
    COUPON_NAME_TAKEN(3003, "Coupon name already in use by company"),
    COUPON_AMOUNT_FINISHED(3004, "No coupons left to purchase"),
    COUPON_COMPANY_UNUPDATABLE(3005, "Coupon's company can't be updated"),
    COUPON_ALREADY_PURCHASED_BY_CUSTOMER(3006, "Coupon already purchased by customer"),
    COUPON_EXPIRED(3007, "Coupon is expired");

    private final int code;
    private final String message;

    CouponError(int code, String message) {
        this.code = code;
        this.message = message;
    }

    @Override
    public int getCode() {
        return code;
    }

    @Override
    public String getMessage() {
        return message;
    }
}
