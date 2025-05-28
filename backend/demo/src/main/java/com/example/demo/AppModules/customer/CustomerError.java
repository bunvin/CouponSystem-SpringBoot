package com.example.demo.AppModules.customer;

import com.example.demo.Error.ErrorMessage;

public enum CustomerError implements ErrorMessage {
    CUSTOMER_NOT_FOUND(4001, "Customer not found"),
    CUSTOMER_ALREADY_EXIST(4002, "Customer already Exist"),
    CUSTOMER_EMAIL_IN_USE(4003, "Customer email already in use");

    private final int code;
    private final String message;

    CustomerError(int code, String message) {
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
