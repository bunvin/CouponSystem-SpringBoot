package com.example.demo.AppModules.customerCoupon;

import com.example.demo.Error.ErrorMessage;

public enum CustomerCouponError implements ErrorMessage {
    CUSTOMER_COUPON_ALREADY_EXIST(5001, "Purchase already exist"),
    CUSTOMER_COUPON_NOT_FOUND(5002, "Purchase not found");

    private final int code;
    private final String message;

    CustomerCouponError(int code, String message) {
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
